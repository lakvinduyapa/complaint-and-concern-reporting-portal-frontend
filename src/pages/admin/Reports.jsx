import { useCallback, useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  FiAlertCircle,
  FiCalendar,
  FiDownload,
  FiFileText,
  FiRefreshCw,
  FiShield,
} from "react-icons/fi";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import pdflogo from "../../assets/pdflogo1.jpeg";

const Reports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const fetchAllComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");
      const startDate = "2000-01-01";
      const endDate = new Date().toISOString().split("T")[0];

      const url = `${import.meta.env.VITE_API_URL}/admin/reports?startDate=${startDate}&endDate=${endDate}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setReport(data);
      } else {
        setError(data.message || "Failed to load complaint reports.");
      }
    } catch (error) {
      console.error("Report Fetch Error:", error);
      setError("Failed to load complaint reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllComplaints();
  }, [fetchAllComplaints]);

  const allComplaints = report?.complaints || [];
  const summary = report?.summary || {};

  const filteredComplaints = useMemo(() => {
    if (!filterFrom && !filterTo) return allComplaints;

    return allComplaints.filter((complaint) => {
      const complaintDate = complaint.created_at
        ? new Date(complaint.created_at)
        : null;

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
  }, [allComplaints, filterFrom, filterTo]);

  const reportStats = useMemo(() => {
    const total = filteredComplaints.length;

    const submitted = filteredComplaints.filter(
      (item) => item.current_status === "Submitted"
    ).length;

    const preliminary = filteredComplaints.filter(
      (item) => item.current_status === "Preliminary Review"
    ).length;

    const underInvestigation = filteredComplaints.filter(
      (item) => item.current_status === "Under Investigation"
    ).length;

    const awaitingEvidence = filteredComplaints.filter(
      (item) => item.current_status === "Awaiting Evidence"
    ).length;

    const escalated = filteredComplaints.filter(
      (item) => item.current_status === "Escalated to CIABOC"
    ).length;

    const resolved = filteredComplaints.filter(
      (item) => item.current_status === "Resolved"
    ).length;

    const closed = filteredComplaints.filter(
      (item) => item.current_status === "Closed"
    ).length;

    const anonymous = filteredComplaints.filter(
      (item) => item.is_anonymous
    ).length;

    const named = filteredComplaints.filter(
      (item) => !item.is_anonymous
    ).length;

    const active =
      submitted + preliminary + underInvestigation + awaitingEvidence + escalated;

    return {
      total,
      submitted,
      preliminary,
      underInvestigation,
      awaitingEvidence,
      escalated,
      resolved,
      closed,
      active,
      anonymous,
      named,
      evidenceFiles: summary.totalEvidence || 0,
    };
  }, [filteredComplaints, summary.totalEvidence]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredComplaints.length / itemsPerPage)
  );

  const paginatedComplaints = filteredComplaints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";

    return new Date(dateValue).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const getDateRangeLabel = () => {
    if (!filterFrom && !filterTo) return "All Complaints";
    return `${filterFrom || "Any date"} to ${filterTo || "Any date"}`;
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case "Submitted":
        return "reports-status-pill reports-status-submitted";
      case "Preliminary Review":
        return "reports-status-pill reports-status-review";
      case "Under Investigation":
        return "reports-status-pill reports-status-investigation";
      case "Awaiting Evidence":
        return "reports-status-pill reports-status-evidence";
      case "Escalated to CIABOC":
        return "reports-status-pill reports-status-escalated";
      case "Resolved":
        return "reports-status-pill reports-status-resolved";
      case "Closed":
        return "reports-status-pill reports-status-closed";
      default:
        return "reports-status-pill reports-status-default";
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterFromChange = (event) => {
    setFilterFrom(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterToChange = (event) => {
    setFilterTo(event.target.value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilterFrom("");
    setFilterTo("");
    setCurrentPage(1);
  };

  const viewPDF = async () => {
    if (!report) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.addImage(pdflogo, "JPEG", 10, 8, 70, 30);

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("SLTMobitel Internal Audit Unit (IAU)", 70, 20);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Complaint Management Portal - Operational Report", 70, 28);

    doc.setDrawColor(0, 102, 179);
    doc.setLineWidth(0.5);
    doc.line(14, 38, 196, 38);

    const pageWidth = doc.internal.pageSize.getWidth();
    const today = new Date().toLocaleDateString();

    doc.setFontSize(10);
    doc.text(`Generated Date: ${today}`, 14, 48);
    doc.text(`Date Filter: ${getDateRangeLabel()}`, pageWidth - 14, 48, {
      align: "right",
    });

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Executive Summary", 14, 65);

    const leftTableData = [
      ["Metric", "Value"],
      ["Total Complaints", reportStats.total],
      ["Active Complaints", reportStats.active],
      ["Preliminary Review", reportStats.preliminary],
      ["Under Investigation", reportStats.underInvestigation],
      ["Awaiting Evidence", reportStats.awaitingEvidence],
      ["Escalated to CIABOC", reportStats.escalated],
    ];

    const rightTableData = [
      ["Metric", "Value"],
      ["Submitted", reportStats.submitted],
      ["Resolved", reportStats.resolved],
      ["Closed", reportStats.closed],
      ["Anonymous Complaints", reportStats.anonymous],
      ["Named Complaints", reportStats.named],
      ["Evidence Files", reportStats.evidenceFiles],
    ];

    autoTable(doc, {
      startY: 70,
      head: [leftTableData[0]],
      body: leftTableData.slice(1),
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [0, 102, 179],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: {
          cellWidth: 52,
          halign: "left",
        },
        1: {
          cellWidth: 22,
          halign: "center",
        },
      },
      margin: {
        left: 14,
      },
      tableWidth: 85,
    });

    const leftEndY = doc.lastAutoTable.finalY;

    autoTable(doc, {
      startY: 70,
      head: [rightTableData[0]],
      body: rightTableData.slice(1),
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [0, 102, 179],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: {
          cellWidth: 52,
          halign: "left",
        },
        1: {
          cellWidth: 22,
          halign: "center",
        },
      },
      margin: {
        left: 110,
      },
      tableWidth: 85,
    });

    const rightEndY = doc.lastAutoTable.finalY;
    const summaryEndY = Math.max(leftEndY, rightEndY);

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Complaints List", 14, summaryEndY + 12);

    autoTable(doc, {
      startY: summaryEndY + 18,
      head: [["CRN", "Category", "Status", "Submitted Date"]],
      body: filteredComplaints.map((item) => [
        item.crn,
        item.category || "Unspecified",
        item.current_status || "N/A",
        item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A",
      ]),
      theme: "striped",
      headStyles: {
        fillColor: [0, 102, 179],
        textColor: 255,
        fontStyle: "bold",
        halign: "left",
      },
      bodyStyles: {
        textColor: [31, 41, 55],
      },
      alternateRowStyles: {
        fillColor: [240, 248, 255],
      },
      columnStyles: {
        0: {
          cellWidth: 38,
        },
        1: {
          cellWidth: 48,
        },
        2: {
          cellWidth: 50,
        },
        3: {
          cellWidth: 40,
        },
      },
      margin: {
        left: 14,
        right: 14,
      },
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

  const downloadExcel = () => {
    if (!report) return;

    const excelData = filteredComplaints.map((complaint) => ({
      CRN: complaint.crn,
      Category: complaint.category || "Unspecified",
      Status: complaint.current_status || "N/A",
      "Report Type": complaint.is_anonymous ? "Anonymous" : "Named",
      "Submitted Date": complaint.created_at
        ? new Date(complaint.created_at).toLocaleDateString()
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

    saveAs(
      fileData,
      `Complaint_Report_${new Date().toISOString().slice(0, 19)}.xlsx`
    );
  };

  if (loading && !report) {
    return (
      <div className="reports-loading">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="reports-page animate-fade-up">
      <section className="reports-hero">
        <div className="reports-hero-content">
          <div>
            <div className="reports-eyebrow">
              <FiShield />
              Internal Audit Reporting
            </div>

            <h1>Complaint Reports</h1>

            <p>
              Monitor complaint trends, investigation progress, report types and
              operational statistics from one modern reporting workspace.
            </p>
          </div>

          
        </div>
      </section>

      {error && (
        <div className="reports-error-box">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}

      
      <section className="reports-control-card">
        <div className="reports-section-heading">
          <div>
            <h2>Report Controls</h2>
            <p>Filter by submitted date and export the selected report range.</p>
          </div>

          <FiCalendar className="reports-section-icon" />
        </div>

        <div className="reports-filter-grid">
          <div className="reports-field">
            <label>From Date</label>
            <input
              type="date"
              value={filterFrom}
              onChange={handleFilterFromChange}
            />
          </div>

          <div className="reports-field">
            <label>To Date</label>
            <input
              type="date"
              value={filterTo}
              onChange={handleFilterToChange}
            />
          </div>

          <div className="reports-control-actions">
            <button
              type="button"
              onClick={handleClearFilters}
              className="reports-secondary-button"
              disabled={!filterFrom && !filterTo}
            >
              <FiRefreshCw />
              Clear
            </button>

            <button
              type="button"
              onClick={viewPDF}
              className="reports-primary-button"
              disabled={!report}
            >
              <FiDownload />
              PDF
            </button>

            <button
              type="button"
              onClick={downloadExcel}
              className="reports-primary-button excel"
              disabled={!report}
            >
              <FiDownload />
              Excel
            </button>
          </div>
        </div>
      </section>

      <section className="reports-table-card">
        <div className="reports-table-header">
          <div>
            <h2>Recent Complaint Activity</h2>
            <p>
              Showing {paginatedComplaints.length} of{" "}
              {filteredComplaints.length} complaint records
            </p>
          </div>

          <div className="reports-page-badge">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {paginatedComplaints.length > 0 ? (
          <>
            <div className="reports-table-wrapper">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>CRN</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Report Type</th>
                    <th>Submitted</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedComplaints.map((complaint) => (
                    <tr key={complaint.crn}>
                      <td>
                        <span className="reports-crn">{complaint.crn}</span>
                      </td>

                      <td>
                        <span className="reports-category">
                          {complaint.category || "Unspecified"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={getStatusClassName(
                            complaint.current_status
                          )}
                        >
                          {complaint.current_status || "N/A"}
                        </span>
                      </td>

                      <td>
                        {complaint.is_anonymous ? (
                          <span className="reports-type-pill anonymous">
                            Anonymous
                          </span>
                        ) : (
                          <span className="reports-type-pill named">
                            Named
                          </span>
                        )}
                      </td>

                      <td>{formatDate(complaint.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="reports-pagination">
              <span>
                Filter result: {filteredComplaints.length} complaint
                {filteredComplaints.length === 1 ? "" : "s"}
              </span>

              <div className="reports-pagination-actions">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="reports-empty-state">
            <FiFileText />
            <h3>No report data found</h3>
            <p>No complaints are available for the selected date range.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Reports;