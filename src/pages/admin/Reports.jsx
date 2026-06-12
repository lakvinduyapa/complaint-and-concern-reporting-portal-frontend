import { useCallback, useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import pdflogo from "../../assets/pdflogo1.jpeg";

const Reports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Single date filter (used for both cards and table)
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  // Fetch all complaints (use a wide date range to get everything)
  const fetchAllComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setCurrentPage(1);
      const token = localStorage.getItem("adminToken");
      // Use a fixed wide custom range to get all complaints
      const startDate = "2000-01-01";
      const endDate = new Date().toISOString().split("T")[0];
      const url = `${import.meta.env.VITE_API_URL}/admin/reports?startDate=${startDate}&endDate=${endDate}`;
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
  }, []);

  useEffect(() => {
    fetchAllComplaints();
  }, [fetchAllComplaints]);

  // Helper: filter complaints by date range
  const filterComplaintsByDate = (complaints) => {
    if (!filterFrom && !filterTo) return complaints;
    return complaints.filter((complaint) => {
      const complaintDate = complaint.created_at ? new Date(complaint.created_at) : null;
      if (!complaintDate) return false;
      const from = filterFrom ? new Date(filterFrom) : null;
      const to = filterTo ? new Date(filterTo) : null;
      if (from && complaintDate < from) return false;
      if (to) {
        const toEnd = new Date(to);
        toEnd.setHours(23, 59, 59, 999);
        if (complaintDate > toEnd) return false;
      }
      return true;
    });
  };

  // Compute statistics from filtered complaints
  const getFilteredStats = (complaints) => {
    const filtered = filterComplaintsByDate(complaints);
    const total = filtered.length;
    const preliminary = filtered.filter(c => c.current_status === "Preliminary Review").length;
    const underInvestigation = filtered.filter(c => c.current_status === "Under Investigation").length;
    const resolved = filtered.filter(c => c.current_status === "Resolved").length;
    const closed = filtered.filter(c => c.current_status === "Closed").length;
    const escalated = filtered.filter(c => c.current_status === "Escalated to CIABOC").length;
    return { total, preliminary, underInvestigation, resolved, closed, escalated };
  };

  // Get base64 logo for PDF
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

  // PDF export (uses filtered complaints)
  const viewPDF = async () => {
    if (!report) return;
    const allComplaints = report.complaints;
    const filteredComplaints = filterComplaintsByDate(allComplaints);
    const stats = getFilteredStats(allComplaints);
    const doc = new jsPDF();

    // Logo
    let logoBase64 = null;
    try {
      logoBase64 = await getBase64ImageFromURL(pdflogo);
    } catch (error) {
      console.log("Logo failed to load", error);
    }
    if (logoBase64) doc.addImage(logoBase64, "JPEG", 10, 8, 35, 35);

    // Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("SLTMobitel Internal Audit Unit (IAU)", 50, 20);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Complaint Management Portal - Operational Report", 50, 28);
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.5);
    doc.line(14, 38, 196, 38);

    // Meta info
    const today = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generated Date: ${today}`, 14, 48);
    if (filterFrom || filterTo) {
      doc.text(`Date Filter: ${filterFrom || "any"} to ${filterTo || "any"}`, 14, 56);
    } else {
      doc.text("Date Filter: none (all complaints)", 14, 56);
    }

    // Executive Summary (using filtered stats)
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Executive Summary", 14, 70);
    doc.setFont("helvetica", "normal");

    const summaryItems = [
      { label: "Total Complaints", value: stats.total },
      { label: "Preliminary Review", value: stats.preliminary },
      { label: "Under Investigation", value: stats.underInvestigation },
      { label: "Resolved", value: stats.resolved },
      { label: "Closed", value: stats.closed },
      { label: "Escalated to CIABOC", value: stats.escalated },
      // Additional useful stats from original report (not filtered, but keep for completeness)
      { label: "Submitted (total)", value: report.summary.submitted },
      { label: "Awaiting Evidence", value: report.summary.awaitingEvidence },
      { label: "Anonymous Complaints", value: report.summary.anonymousComplaints },
      { label: "Named Complaints", value: report.summary.namedComplaints },
      { label: "Evidence Files", value: report.summary.totalEvidence },
    ];

    const col1X = 14, col2X = 78, col3X = 142;
    const rowHeight = 8;
    let startY = 80;
    for (let i = 0; i < summaryItems.length; i += 3) {
      const item1 = summaryItems[i];
      const item2 = summaryItems[i+1];
      const item3 = summaryItems[i+2];
      const y = startY + (i / 3) * rowHeight;
      if (item1) doc.text(`${item1.label}: ${item1.value}`, col1X, y);
      if (item2) doc.text(`${item2.label}: ${item2.value}`, col2X, y);
      if (item3) doc.text(`${item3.label}: ${item3.value}`, col3X, y);
    }

    const execEndY = startY + Math.ceil(summaryItems.length / 3) * rowHeight;

    // Complaint table
    autoTable(doc, {
      startY: execEndY + 12,
      head: [["CRN", "Category", "Status", "Date"]],
      body: filteredComplaints.map(item => [
        item.crn,
        item.category || "Unspecified",
        item.current_status,
        item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A",
      ]),
      theme: "plain",
      headStyles: { fillColor: [245,247,250], textColor: [31,41,55], fontStyle: "bold", halign: "left", lineWidth: 0 },
      bodyStyles: { textColor: [75,85,99], lineWidth: 0 },
      alternateRowStyles: { fillColor: [249,250,251] },
      columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 50 }, 2: { cellWidth: 45 }, 3: { cellWidth: 35 } },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 9, cellPadding: 5, valign: "middle", lineColor: [226,232,240], lineWidth: 0.1 },
    });

    const finalY = doc.lastAutoTable.finalY + 12;
    doc.setFontSize(8);
    doc.setTextColor(128,128,128);
    doc.text("Generated by IAU Complaint Portal", 14, finalY);
    doc.text("Confidential - Internal Use Only", 14, finalY + 6);

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  // Excel export (CSV) using filtered complaints
  const downloadExcel = async () => {
    if (!report) return;
    const filteredComplaints = filterComplaintsByDate(report.complaints);
    const headers = ["CRN", "Category", "Status", "Report Type", "Submitted Date"];
    const rows = filteredComplaints.map(c => [
      c.crn,
      c.category || "Unspecified",
      c.current_status,
      c.is_anonymous ? "Anonymous" : "Named",
      c.created_at ? new Date(c.created_at).toLocaleDateString() : "N/A"
    ]);
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `Complaint_Report_${new Date().toISOString().slice(0,19)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
  };

  // Pagination & filtered data
  const allComplaints = report?.complaints || [];
  const filteredComplaints = filterComplaintsByDate(allComplaints);
  const filteredStats = getFilteredStats(allComplaints);
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const paginatedComplaints = filteredComplaints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status) => {
    const styles = {
      Submitted: "bg-cyan-100 text-cyan-700",
      "Preliminary Review": "bg-yellow-100 text-yellow-700",
      "Under Investigation": "bg-orange-100 text-orange-700",
      "Awaiting Evidence": "bg-purple-100 text-purple-700",
      "Escalated to CIABOC": "bg-red-100 text-red-700",
      Resolved: "bg-green-100 text-green-700",
      Closed: "bg-gray-100 text-gray-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filterFrom, filterTo]);

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 md:p-8 mb-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Complaint Reports</h1>
          <p className="text-slate-500 mt-2">
            Monitor complaint trends, investigation progress, and operational statistics.
          </p>
        </div>

        {/* Filter and Download Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-700">Filter by date:</span>
            <input
              type="date"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg bg-white"
            />
            <span className="text-slate-500">to</span>
            <input
              type="date"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg bg-white"
            />
            {(filterFrom || filterTo) && (
              <button
                onClick={() => { setFilterFrom(""); setFilterTo(""); }}
                className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                Clear
              </button>
            )}
            <span className="text-xs text-slate-500 ml-2">
              {filteredComplaints.length} complaint(s) found
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={viewPDF}
              className="px-6 py-2 border border-green-600 text-green-600 hover:bg-green-50 rounded-xl font-medium transition-colors"
            >
              Download PDF
            </button>
            <button
              onClick={downloadExcel}
              className="px-6 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-colors"
            >
              Download Excel
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading Report...</div>
        ) : (
          report && (
            <>
              {/* Statistics Cards (based on filtered complaints) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 shadow-sm">
                  <p className="text-sm text-slate-600">Total Complaints</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-2">{filteredStats.total}</h3>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 shadow-sm">
                  <p className="text-sm text-slate-600">Preliminary Review</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-2">{filteredStats.preliminary}</h3>
                </div>
                <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5 shadow-sm">
                  <p className="text-sm text-slate-600">Under Investigation</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-2">{filteredStats.underInvestigation}</h3>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-2xl p-5 shadow-sm">
                  <p className="text-sm text-slate-600">Resolved</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-2">{filteredStats.resolved}</h3>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <p className="text-sm text-slate-600">Closed</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-2">{filteredStats.closed}</h3>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-2xl p-5 shadow-sm">
                  <p className="text-sm text-slate-600">Escalated to CIABOC</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-2">{filteredStats.escalated}</h3>
                </div>
              </div>

              {/* Recent Complaint Activity Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
                  <h2 className="text-lg font-semibold text-slate-900">Recent Complaint Activity</h2>
                </div>
                {paginatedComplaints.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-[800px] w-full">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="text-left px-3 md:px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">CRN</th>
                            <th className="text-left px-3 md:px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                            <th className="text-left px-3 md:px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="text-left px-3 md:px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Report Type</th>
                            <th className="text-left px-3 md:px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paginatedComplaints.map((complaint) => (
                            <tr key={complaint.crn} className="hover:bg-slate-50 transition-colors">
                              <td className="px-3 md:px-6 py-4">
                                <span className="font-mono text-sm text-slate-700">{complaint.crn}</span>
                              </td>
                              <td className="px-3 md:px-6 py-4 text-sm text-slate-700">
                                {complaint.category || "Unspecified"}
                              </td>
                              <td className="px-3 md:px-6 py-4">
                                <span className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusBadge(complaint.current_status)}`}>
                                  {complaint.current_status}
                                </span>
                              </td>
                              <td className="px-3 md:px-6 py-4">
                                {complaint.is_anonymous ? (
                                  <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-xs font-medium">Anonymous</span>
                                ) : (
                                  <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-md text-xs font-medium">Named</span>
                                )}
                              </td>
                              <td className="px-3 md:px-6 py-4 text-sm text-slate-500">
                                {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString() : "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {totalPages > 1 && (
                      <div className="flex justify-between items-center px-6 py-4 border-t border-slate-200 bg-white">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            currentPage === 1 ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          Previous
                        </button>
                        <span className="text-sm text-slate-600">Page {currentPage} of {totalPages}</span>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            currentPage === totalPages ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-10 text-center">
                    <p className="text-slate-500 text-sm">No complaints found for the selected date range.</p>
                  </div>
                )}
              </div>
            </>
          )
        )}
      </div>

      {/* Excel Preview Modal (uses filtered complaints) */}
      {showExcelModal && report && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-xl font-bold text-slate-900">Excel Preview – Complaint Data</h3>
              <button onClick={() => setShowExcelModal(false)} className="text-slate-500 hover:text-slate-700 text-2xl leading-none">&times;</button>
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
                  {filteredComplaints.map((complaint) => (
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
              <button onClick={() => setShowExcelModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">Close</button>
              <button onClick={downloadExcel} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Download Excel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Reports;