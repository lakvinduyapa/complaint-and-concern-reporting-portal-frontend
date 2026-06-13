import { useCallback, useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import pdflogo from "../../assets/pdflogo1.jpeg"; // make sure this is a high-res PNG

const Reports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Single date filter (used for both cards and table)
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  // Fetch all complaints (use a wide date range to get everything)
  const fetchAllComplaints = useCallback(async () => {
    try {
      setLoading(true);
      // No need to reset currentPage here – already done in filter handlers and initial state
      const token = localStorage.getItem("adminToken");
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // PDF export (uses filtered complaints) - PROFESSIONAL VERSION
  const viewPDF = async () => {
    if (!report) return;
    const allComplaints = report.complaints;
    const filteredComplaints = filterComplaintsByDate(allComplaints);
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // ========== 1. LOGO (DIRECT PNG – NO BASE64 BLUR) ==========
    doc.addImage(pdflogo, "PNG", 10, 8, 70, 30);

    // ========== 2. HEADER TEXTS ==========
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("SLTMobitel Internal Audit Unit (IAU)", 70, 20);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Complaint Management Portal - Operational Report", 70, 28);
    doc.setDrawColor(0, 102, 179);
    doc.setLineWidth(0.5);
    doc.line(14, 38, 196, 38);

    // ========== 3. META INFO (LEFT / RIGHT ALIGNMENT, SAME LINE) ==========
    const pageWidth = doc.internal.pageSize.getWidth();
    const today = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generated Date: ${today}`, 14, 48);

    // Inline filter text – no unused variable warning
    doc.text(
      filterFrom || filterTo
        ? `Date Filter: ${filterFrom || "any"} to ${filterTo || "any"}`
        : "Date Filter: All Complaints",
      pageWidth - 14,
      48,
      { align: "right" }
    );

    // ========== 4. EXECUTIVE SUMMARY – TWO TABLES (LEFT + RIGHT) ==========
    const filteredStats = (() => {
      const filtered = filterComplaintsByDate(allComplaints);
      return {
        total: filtered.length,
        preliminary: filtered.filter(c => c.current_status === "Preliminary Review").length,
        underInvestigation: filtered.filter(c => c.current_status === "Under Investigation").length,
        resolved: filtered.filter(c => c.current_status === "Resolved").length,
        closed: filtered.filter(c => c.current_status === "Closed").length,
        escalated: filtered.filter(c => c.current_status === "Escalated to CIABOC").length,
      };
    })();

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Executive Summary", 14, 65);
    doc.setFont("helvetica", "normal");

    const leftTableData = [
      ["Metric", "Value"],
      ["Total Complaints", filteredStats.total],
      ["Preliminary Review", filteredStats.preliminary],
      ["Under Investigation", filteredStats.underInvestigation],
      ["Resolved", filteredStats.resolved],
      ["Closed", filteredStats.closed],
      ["Escalated to CIABOC", filteredStats.escalated],
    ];

    const rightTableData = [
      ["Metric", "Value"],
      ["Submitted (Total)", report.summary.submitted],
      ["Awaiting Evidence", report.summary.awaitingEvidence],
      ["Anonymous Complaints", report.summary.anonymousComplaints],
      ["Named Complaints", report.summary.namedComplaints],
      ["Evidence Files", report.summary.totalEvidence],
    ];

    // Left table
    autoTable(doc, {
      startY: 70,
      head: [leftTableData[0]],
      body: leftTableData.slice(1),
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: {
        fillColor: [0, 102, 179],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 50, halign: "left" },
        1: { cellWidth: 25, halign: "center" },
      },
      margin: { left: 14 },
      tableWidth: 85,
    });
    const leftEndY = doc.lastAutoTable.finalY;

    // Right table
    autoTable(doc, {
      startY: 70,
      head: [rightTableData[0]],
      body: rightTableData.slice(1),
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: {
        fillColor: [0, 102, 179],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 50, halign: "left" },
        1: { cellWidth: 25, halign: "center" },
      },
      margin: { left: 110 },
      tableWidth: 85,
    });
    const rightEndY = doc.lastAutoTable.finalY;
    const summaryEndY = Math.max(leftEndY, rightEndY);

    // ========== 5. COMPLAINTS LIST TABLE ==========
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Complaints List", 14, summaryEndY + 12);
    doc.setFont("helvetica", "normal");

    autoTable(doc, {
      startY: summaryEndY + 18,
      head: [["CRN", "Category", "Status", "Submitted Date"]],
      body: filteredComplaints.map(item => [
        item.crn,
        item.category || "Unspecified",
        item.current_status,
        item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A",
      ]),
      theme: "striped",
      headStyles: {
        fillColor: [0, 102, 179],
        textColor: 255,
        fontStyle: "bold",
        halign: "left",
      },
      bodyStyles: { textColor: [31, 41, 55] },
      alternateRowStyles: { fillColor: [240, 248, 255] },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 45 },
        2: { cellWidth: 45 },
        3: { cellWidth: 40 },
      },
      margin: { left: 14, right: 14 },
      styles: {
        fontSize: 9,
        cellPadding: 5,
        valign: "middle",
        lineColor: [0, 102, 179],
        lineWidth: 0.1,
      },
    });

    const finalY = doc.lastAutoTable.finalY + 12;
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text("Generated by IAU Complaint Portal", 14, finalY);
    doc.text("Confidential - Internal Use Only", 14, finalY + 6);

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  // Excel export using SheetJS (real .xlsx)
  const downloadExcel = () => {
    if (!report) return;

    const filteredComplaints = filterComplaintsByDate(report.complaints);

    const excelData = filteredComplaints.map((c) => ({
      CRN: c.crn,
      Category: c.category || "Unspecified",
      Status: c.current_status,
      "Report Type": c.is_anonymous ? "Anonymous" : "Named",
      "Submitted Date": c.created_at
        ? new Date(c.created_at).toLocaleDateString()
        : "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Complaints");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, `Complaint_Report_${new Date().toISOString().slice(0, 19)}.xlsx`);
  };

  // Pagination & filtered data
  const allComplaints = report?.complaints || [];
  const filteredComplaints = filterComplaintsByDate(allComplaints);
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

  // Date filter handlers – reset currentPage to 1 when filter changes
  const handleFilterFromChange = (e) => {
    setFilterFrom(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterToChange = (e) => {
    setFilterTo(e.target.value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilterFrom("");
    setFilterTo("");
    setCurrentPage(1);
  };

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
              onChange={handleFilterFromChange}
              className="px-3 py-2 border border-slate-300 rounded-lg bg-white"
            />
            <span className="text-slate-500">to</span>
            <input
              type="date"
              value={filterTo}
              onChange={handleFilterToChange}
              className="px-3 py-2 border border-slate-300 rounded-lg bg-white"
            />
            {(filterFrom || filterTo) && (
              <button
                onClick={handleClearFilters}
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
    </>
  );
};

export default Reports;