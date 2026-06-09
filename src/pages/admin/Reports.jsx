import { useCallback, useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import pdflogo from "../../assets/pdflogo1.jpeg";

const Reports = () => {
  const [period, setPeriod] = useState("weekly");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [useCustomRange, setUseCustomRange] = useState(false);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );

  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      let url = `${import.meta.env.VITE_API_URL}/admin/reports?`;
      if (useCustomRange && fromDate && toDate) {
        url += `startDate=${formatDateForAPI(fromDate)}&endDate=${formatDateForAPI(toDate)}`;
      } else {
        url += `period=${period}`;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) setReport(data);
    } catch (error) {
      console.error("Report Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [period, useCustomRange, fromDate, toDate]);

  useEffect(() => {
    const timer = setTimeout(() => fetchReport(), 300);
    return () => clearTimeout(timer);
  }, [fetchReport]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getBase64ImageFromURL = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 1.0));
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  const downloadPDF = async () => {
    if (!report) return;
    const doc = new jsPDF();
    let logoBase64 = null;
    try {
      logoBase64 = await getBase64ImageFromURL(pdflogo);
    } catch (error) {
      console.log("Logo failed to load", error);
    }
    if (logoBase64) doc.addImage(logoBase64, "JPEG", -5, -8, 60, 60);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("SLTMobitel Internal Audit Unit (IAU)", 50, 18);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Complaint Management Portal - Operational Report", 50, 25);

    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.8);
    doc.line(14, 35, 195, 35);

    const today = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generated Date: ${today}`, 14, 45);
    if (useCustomRange && fromDate && toDate) {
      doc.text(`Report Period: ${new Date(fromDate).toLocaleDateString()} - ${new Date(toDate).toLocaleDateString()}`, 14, 52);
    } else {
      doc.text(`Report Period: ${period}`, 14, 52);
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Executive Summary", 14, 65);
    doc.setFont("helvetica", "normal");

    const summaryData = [
      `Total Complaints: ${report.summary.totalComplaints}`,
      `Submitted: ${report.summary.submitted}`,
      `Preliminary Review: ${report.summary.preliminaryReview}`,
      `Under Investigation: ${report.summary.underInvestigation}`,
      `Awaiting Evidence: ${report.summary.awaitingEvidence}`,
      `Escalated: ${report.summary.escalated}`,
      `Resolved: ${report.summary.resolved}`,
      `Closed: ${report.summary.closed}`,
      `Anonymous Complaints: ${report.summary.anonymousComplaints}`,
      `Named Complaints: ${report.summary.namedComplaints}`,
      `Evidence Files: ${report.summary.totalEvidence}`,
    ];

    summaryData.forEach((line, i) => doc.text(line, 20, 75 + i * 8));

    autoTable(doc, {
      startY: 75 + summaryData.length * 8 + 10,
      head: [["CRN", "Category", "Status", "Date"]],
      body: report.complaints.map((item) => [
        item.crn,
        item.category,
        item.current_status,
        item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A",
      ]),
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
      styles: { fontSize: 9, cellPadding: 3 },
      alternateRowStyles: { fillColor: [245, 247, 255] },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("Generated by IAU Complaint Portal", 14, finalY + 10);
    doc.text("Confidential - Internal Use Only", 14, finalY + 16);
    doc.save(`IAU_Operational_Report_${useCustomRange ? "custom" : period}.pdf`);
  };

  const downloadExcel = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      let url = `${import.meta.env.VITE_API_URL}/admin/reports/export-excel?`;
      if (useCustomRange && fromDate && toDate) {
        url += `startDate=${formatDateForAPI(fromDate)}&endDate=${formatDateForAPI(toDate)}`;
      } else {
        url += `period=${period}`;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await response.blob();
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlBlob;
      link.download = `Complaint_Report_${useCustomRange ? "custom" : period}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Excel Download Error:", error);
    }
  };

  const chartData = report
    ? [
        { name: "Submitted", value: report.summary.submitted },
        { name: "Preliminary Review", value: report.summary.preliminaryReview },
        { name: "Under Investigation", value: report.summary.underInvestigation },
        { name: "Awaiting Evidence", value: report.summary.awaitingEvidence },
        { name: "Escalated to CIABOC", value: report.summary.escalated },
        { name: "Resolved", value: report.summary.resolved },
        { name: "Closed", value: report.summary.closed },
      ]
    : [];

  const complaintTypeData = report
    ? Object.entries(
        report.complaints.reduce((acc, item) => {
          const category = item.category || "Unspecified";
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {})
      )
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
    : [];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 md:p-8 mb-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Complaint Reports</h1>
        <p className="text-slate-500 mt-2">
          Monitor complaint trends, investigation progress, and operational statistics.
        </p>
      </div>

      {/* Controls Row - all in one line on desktop, wrap on mobile */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {/* Period dropdown */}
        <select
          value={period}
          onChange={(e) => {
            setPeriod(e.target.value);
            setUseCustomRange(false);
            setFromDate("");
            setToDate("");
          }}
          className="px-4 py-3 border border-slate-300 rounded-xl bg-white min-w-[160px]"
        >
          <option value="2days">Last 2 Days</option>
          <option value="weekly">Last 7 Days</option>
          <option value="2weekly">Last 14 Days</option>
          <option value="monthly">Last 30 Days</option>
        </select>

        {/* From Date */}
        <input
          type="date"
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value);
            setUseCustomRange(true);
          }}
          className="px-3 py-3 border border-slate-300 rounded-xl bg-white w-[160px]"
          placeholder="From Date"
        />

        {/* To Date */}
        <input
          type="date"
          value={toDate}
          onChange={(e) => {
            setToDate(e.target.value);
            setUseCustomRange(true);
          }}
          className="px-3 py-3 border border-slate-300 rounded-xl bg-white w-[160px]"
          placeholder="To Date"
        />

        {/* Download PDF */}
        <button
          onClick={downloadPDF}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium"
        >
          Download PDF
        </button>

        {/* Download Excel */}
        <button
          onClick={downloadExcel}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
        >
          Download Excel
        </button>
      </div>

      {/* Report Content (unchanged) */}
      {loading ? (
        <div className="text-center py-10">Loading Report...</div>
      ) : (
        report && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {[
                ["Total Complaints", report.summary.totalComplaints, "bg-blue-50 border-blue-100"],
                ["Preliminary Review", report.summary.preliminaryReview, "bg-purple-50 border-purple-100"],
                ["Under Investigation", report.summary.underInvestigation, "bg-yellow-50 border-yellow-100"],
                ["Resolved", report.summary.resolved, "bg-green-50 border-green-100"],
                ["Closed", report.summary.closed, "bg-gray-50 border-gray-100"],
                ["Escalated to CIABOC", report.summary.escalated, "bg-red-50 border-red-100"],
              ].map(([label, value, style]) => (
                <div key={label} className={`${style} border rounded-2xl p-5 shadow-sm`}>
                  <p className="text-sm text-slate-600">{label}</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
                </div>
              ))}
            </div>

            {/* Additional Statistics */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-5">Additional Statistics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="bg-[#F5F3FF] border border-[#DDD6FE] rounded-2xl p-5 shadow-sm">
                  <p className="text-sm text-slate-600 font-medium">Anonymous Complaints</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-2">{report.summary.anonymousComplaints}</h3>
                </div>
                <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-2xl p-5 shadow-sm">
                  <p className="text-sm text-slate-600 font-medium">Named Complaints</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-2">{report.summary.namedComplaints}</h3>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Complaint Status Distribution</h2>
                    <p className="text-sm text-slate-500 mt-1">Current workload by complaint status.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">Overview</span>
                </div>
                <ResponsiveContainer width="100%" height={isMobile ? 420 : 350}>
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={isMobile ? 70 : 120} label={!isMobile}>
                      <Cell fill="#2563EB" /><Cell fill="#F59E0B" /><Cell fill="#10B981" />
                      <Cell fill="#EF4444" /><Cell fill="#8B5CF6" /><Cell fill="#06B6D4" /><Cell fill="#6B7280" />
                    </Pie>
                    <Tooltip />
                    {!isMobile && <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "14px", paddingTop: "10px" }} />}
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Complaint Type Comparison</h2>
                    <p className="text-sm text-slate-500 mt-1">Compare the number of complaints by category.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">Bar Chart</span>
                </div>
                <ResponsiveContainer width="100%" height={isMobile ? 340 : 350}>
                  <BarChart data={complaintTypeData} margin={{ top: 10, right: 10, left: -18, bottom: 42 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#475569" }} interval={0} angle={-18} textAnchor="end" height={70} />
                    <YAxis tick={{ fontSize: 12, fill: "#475569" }} allowDecimals={false} />
                    <Tooltip cursor={{ fill: "rgba(37, 99, 235, 0.08)" }} contentStyle={{ borderRadius: "12px", borderColor: "#CBD5E1", boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)" }} />
                    <Legend />
                    <Bar dataKey="value" fill="#2563EB" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
};

export default Reports;