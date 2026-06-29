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

      const url = `${
        import.meta.env.VITE_API_URL
      }/admin/reports?startDate=${startDate}&endDate=${endDate}`;

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
      submitted +
      preliminary +
      underInvestigation +
      awaitingEvidence +
      escalated;

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

  const getAssignedOfficerName = (complaint) => {
    return (
      complaint?.assigned_officer_name ||
      complaint?.assignedOfficerName ||
      complaint?.assigned_to_name ||
      complaint?.assigned_to ||
      complaint?.officer_name ||
      "Unassigned"
    );
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

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const navy = [0, 26, 114];
    const navyDark = [0, 20, 90];
    const blue = [1, 86, 166];
    const teal = [0, 94, 94];
    const slate = [71, 85, 105];
    const lightBlue = [247, 251, 255];

    const generatedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    const addFooter = () => {
      const pageCount = doc.internal.getNumberOfPages();

      for (let i = 1; i <= pageCount; i += 1) {
        doc.setPage(i);

        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.2);
        doc.line(14, pageHeight - 16, pageWidth - 14, pageHeight - 16);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);

        doc.text("Generated by IAU Complaint Portal", 14, pageHeight - 10);

        doc.text(
          "Confidential - Internal Use Only",
          pageWidth / 2,
          pageHeight - 10,
          {
            align: "center",
          }
        );

        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 10, {
          align: "right",
        });
      }
    };

    // Solid professional PDF header
    const headerX = 10;
    const headerY = 8;
    const headerW = pageWidth - 20;
    const headerH = 34;
    const radius = 5;

    doc.setFillColor(...navy);
    doc.roundedRect(headerX, headerY, headerW, headerH, radius, radius, "F");

    // Subtle darker strip at the bottom of header
    doc.setFillColor(...navyDark);
    doc.rect(headerX, headerY + headerH - 5, headerW, 5, "F");

    // Small teal accent line, not a gradient
    doc.setFillColor(...teal);
    doc.rect(headerX, headerY + headerH - 1.5, headerW, 1.5, "F");

    // Logo card
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(14, 13, 40, 18, 2, 2, "F");
    doc.addImage(pdflogo, "JPEG", 20, 18, 28, 7);

    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("Complaint Management Report", 62, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("SLTMobitel Internal Audit Unit", 62, 27);
    doc.text("Operational complaint summary and activity report", 62, 33);

    // Report details block
    doc.setFillColor(...lightBlue);
    doc.roundedRect(14, 50, pageWidth - 28, 24, 4, 4, "F");

    doc.setTextColor(...slate);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("GENERATED DATE", 20, 59);
    doc.text("DATE FILTER", 82, 59);
    doc.text("TOTAL RECORDS", 154, 59);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(generatedDate, 20, 67);
    doc.text(getDateRangeLabel(), 82, 67);
    doc.text(String(reportStats.total), 154, 67);

    // Summary heading
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Executive Summary", 14, 88);

    autoTable(doc, {
      startY: 96,
      head: [["Metric", "Value", "Metric", "Value"]],
      body: [
        [
          "Total Complaints",
          reportStats.total,
          "Submitted",
          reportStats.submitted,
        ],
        [
          "Active Complaints",
          reportStats.active,
          "Resolved",
          reportStats.resolved,
        ],
        [
          "Preliminary Review",
          reportStats.preliminary,
          "Closed",
          reportStats.closed,
        ],
        [
          "Under Investigation",
          reportStats.underInvestigation,
          "Anonymous Complaints",
          reportStats.anonymous,
        ],
        [
          "Awaiting Evidence",
          reportStats.awaitingEvidence,
          "Named Complaints",
          reportStats.named,
        ],
        [
          "Escalated to CIABOC",
          reportStats.escalated,
          "Evidence Files",
          reportStats.evidenceFiles,
        ],
      ],
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 4,
        lineColor: [226, 232, 240],
        lineWidth: 0.2,
        textColor: [51, 65, 85],
        valign: "middle",
      },
      headStyles: {
        fillColor: navy,
        textColor: 255,
        fontStyle: "bold",
        halign: "left",
      },
      alternateRowStyles: {
        fillColor: [248, 251, 255],
      },
      columnStyles: {
        0: {
          cellWidth: 58,
          fontStyle: "bold",
        },
        1: {
          cellWidth: 22,
          halign: "center",
        },
        2: {
          cellWidth: 62,
          fontStyle: "bold",
        },
        3: {
          cellWidth: 22,
          halign: "center",
        },
      },
      margin: {
        left: 14,
        right: 14,
      },
    });

    const summaryEndY = doc.lastAutoTable.finalY;

    // Complaints list heading
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Complaints List", 14, summaryEndY + 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Showing ${filteredComplaints.length} complaint record${
        filteredComplaints.length === 1 ? "" : "s"
      }`,
      14,
      summaryEndY + 20
    );

    autoTable(doc, {
      startY: summaryEndY + 26,
      head: [["CRN", "Category", "Status", "Assigned To", "Submitted Date"]],
      body: filteredComplaints.map((item) => [
        item.crn || "N/A",
        item.category || "Unspecified",
        item.current_status || "N/A",
        getAssignedOfficerName(item),
        item.created_at
          ? new Date(item.created_at).toLocaleDateString("en-US")
          : "N/A",
      ]),
      theme: "grid",
      headStyles: {
        fillColor: navy,
        textColor: 255,
        fontStyle: "bold",
        halign: "left",
        fontSize: 8.5,
      },
      bodyStyles: {
        textColor: [31, 41, 55],
        fontSize: 8.5,
      },
      alternateRowStyles: {
        fillColor: [240, 248, 255],
      },
      styles: {
        cellPadding: 4,
        valign: "middle",
        lineColor: [203, 213, 225],
        lineWidth: 0.15,
        overflow: "linebreak",
      },
      columnStyles: {
        0: {
          cellWidth: 36,
          fontStyle: "bold",
          textColor: blue,
        },
        1: {
          cellWidth: 38,
        },
        2: {
          cellWidth: 42,
        },
        3: {
          cellWidth: 38,
        },
        4: {
          cellWidth: 28,
        },
      },
      margin: {
        left: 14,
        right: 14,
        bottom: 22,
      },
      didDrawPage: () => {
        if (doc.internal.getCurrentPageInfo().pageNumber > 1) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(...navy);
          doc.text("Complaint Management Report", 14, 12);

          doc.setDrawColor(226, 232, 240);
          doc.line(14, 16, pageWidth - 14, 16);
        }
      },
    });

    addFooter();

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
      "Assigned To": getAssignedOfficerName(complaint),
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
                    <th>Assigned To</th>
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
                          <span className="reports-type-pill named">Named</span>
                        )}
                      </td>

                      <td>
                        <span className="reports-category">
                          {getAssignedOfficerName(complaint)}
                        </span>
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