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

  const [showExcelModal, setShowExcelModal] = useState(false);

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

  // ===================== IMPROVED PDF DESIGN =====================
  const viewPDF = async () => {
    if (!report) return;
    const doc = new jsPDF();

    // ----- Logo -----
    let logoBase64 = null;
    try {
      logoBase64 = await getBase64ImageFromURL(pdflogo);
    } catch (error) {
      console.log("Logo failed to load", error);
    }
    if (logoBase64) doc.addImage(logoBase64, "JPEG", 10, 8, 35, 35);

    // ----- Header Texts -----
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("SLTMobitel Internal Audit Unit (IAU)", 50, 20);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Complaint Management Portal - Operational Report", 50, 28);

    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.5);
    doc.line(14, 38, 196, 38);

    // ----- Report Meta Info -----
    const today = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generated Date: ${today}`, 14, 48);
    if (useCustomRange && fromDate && toDate) {
      doc.text(`Report Period: ${new Date(fromDate).toLocaleDateString()} - ${new Date(toDate).toLocaleDateString()}`, 14, 56);
    } else {
      doc.text(`Report Period: ${period}`, 14, 56);
    }

    // ----- Executive Summary (Two-Column Table - No Borders) -----
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Executive Summary", 14, 70);
    doc.setFont("helvetica", "normal");

    const summaryItems = [
      ["Total Complaints", report.summary.totalComplaints],
      ["Submitted", report.summary.submitted],
      ["Preliminary Review", report.summary.preliminaryReview],
      ["Under Investigation", report.summary.underInvestigation],
      ["Awaiting Evidence", report.summary.awaitingEvidence],
      ["Escalated", report.summary.escalated],
      ["Resolved", report.summary.resolved],
      ["Closed", report.summary.closed],
      ["Anonymous Complaints", report.summary.anonymousComplaints],
      ["Named Complaints", report.summary.namedComplaints],
      ["Evidence Files", report.summary.totalEvidence],
    ];

    let startY = 80;
    const col1X = 20;
    const col2X = 100;
    const rowHeight = 8;

    summaryItems.forEach((item, idx) => {
      const y = startY + idx * rowHeight;
      doc.text(item[0] + ":", col1X, y);
      doc.text(item[1].toString(), col2X, y);
    });

    // ----- Complaint List Table (Professional, Minimal Borders) -----
    const tableStartY = startY + summaryItems.length * rowHeight + 12;
    autoTable(doc, {
      startY: tableStartY,
      head: [["CRN", "Category", "Status", "Date"]],
      body: report.complaints.map((item) => [
        item.crn,
        item.category || "Unspecified",
        item.current_status,
        item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A",
      ]),
      theme: "plain", // No default borders
      headStyles: {
        fillColor: [245, 247, 250],
        textColor: [31, 41, 55],
        fontStyle: "bold",
        halign: "left",
        lineWidth: 0,
      },
      bodyStyles: {
        textColor: [75, 85, 99],
        lineWidth: 0,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 50 },
        2: { cellWidth: 45 },
        3: { cellWidth: 35 },
      },
      margin: { left: 14, right: 14 },
      styles: {
        fontSize: 9,
        cellPadding: 5,
        valign: "middle",
        lineColor: [226, 232, 240],
        lineWidth: 0.1,
      },
      // Only show bottom border for header row
      didDrawCell: (data) => {
        if (data.section === "head" && data.row.index === 0 && data.column.index === 3) {
          doc.setDrawColor(203, 213, 225);
          doc.setLineWidth(0.3);
          doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
        }
      },
    });

    const finalY = doc.lastAutoTable.finalY + 12;
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text("Generated by IAU Complaint Portal", 14, finalY);
    doc.text("Confidential - Internal Use Only", 14, finalY + 6);

    // Open PDF in new tab
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const viewExcel = () => {
    if (!report) return;
    setShowExcelModal(true);
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
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Complaint_Report_${useCustomRange ? "custom" : period}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
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
    <>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 md:p-8 mb-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Complaint Reports</h1>
          <p className="text-slate-500 mt-2">
            Monitor complaint trends, investigation progress, and operational statistics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8">
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

          <button
            onClick={viewPDF}
            className="px-6 py-3 border border-green-600 text-green-600 hover:bg-green-50 rounded-xl font-medium transition-colors"
          >
            View PDF
          </button>

          <button
            onClick={viewExcel}
            className="px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-colors"
          >
            View Excel
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading Report...</div>
        ) : (
          report && (
            <>
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

      {showExcelModal && report && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-xl font-bold text-slate-900">Excel Preview – Complaint Data</h3>
              <button
                onClick={() => setShowExcelModal(false)}
                className="text-slate-500 hover:text-slate-700 text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="overflow-auto flex-1 p-4">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-slate-100 sticky top-0">
                  <tr>
                    <th className="border border-slate-300 px-4 py-2 text-left font-semibold text-slate-700">CRN</th>
                    <th className="border border-slate-300 px-4 py-2 text-left font-semibold text-slate-700">Category</th>
                    <th className="border border-slate-300 px-4 py-2 text-left font-semibold text-slate-700">Status</th>
                    <th className="border border-slate-300 px-4 py-2 text-left font-semibold text-slate-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {report.complaints.map((complaint) => (
                    <tr key={complaint.crn} className="hover:bg-slate-50">
                      <td className="border border-slate-200 px-4 py-2 text-slate-600">{complaint.crn}</td>
                      <td className="border border-slate-200 px-4 py-2 text-slate-600">{complaint.category || "Unspecified"}</td>
                      <td className="border border-slate-200 px-4 py-2 text-slate-600">{complaint.current_status}</td>
                      <td className="border border-slate-200 px-4 py-2 text-slate-600">
                        {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setShowExcelModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={downloadExcel}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Download Excel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Reports;