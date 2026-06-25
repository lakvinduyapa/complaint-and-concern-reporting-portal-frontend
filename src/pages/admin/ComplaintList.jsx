import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiFilter,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiUserX,
} from "react-icons/fi";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getAdminComplaints } from "../../services/adminComplaintService";

const STATUS_OPTIONS = [
  "",
  "Submitted",
  "Preliminary Review",
  "Under Investigation",
  "Awaiting Evidence",
  "Escalated to CIABOC",
  "Resolved",
  "Closed",
];

const ComplaintList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const initialStatus = params.get("status") || "";

  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    status: initialStatus,
  });

  const [page, setPage] = useState(1);

  const [data, setData] = useState({
    items: [],
    pagination: {
      page: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
      totalItems: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const complaints = data?.items || [];
  const pagination = data?.pagination || {
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    totalItems: 0,
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getAdminComplaints({
          search: filters.search,
          status: filters.status,
          page,
          limit: 10,
        });

        setData(result);
      } catch (err) {
        setError(err?.message || "Failed to fetch complaints");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [filters, page]);

  const totalItemsLabel = useMemo(() => {
    const totalItems = pagination.totalItems || 0;
    return `${totalItems} complaint${totalItems === 1 ? "" : "s"}`;
  }, [pagination.totalItems]);

  const pageStats = useMemo(() => {
    const openOnPage = complaints.filter(
      (item) =>
        item.current_status !== "Resolved" && item.current_status !== "Closed"
    ).length;

    const resolvedOnPage = complaints.filter(
      (item) => item.current_status === "Resolved"
    ).length;

    const unassignedOnPage = complaints.filter(
      (item) => !item.assigned_officer_name
    ).length;

    return {
      total: pagination.totalItems || 0,
      displayed: complaints.length,
      openOnPage,
      resolvedOnPage,
      unassignedOnPage,
      activeStatus: filters.status || "All Statuses",
    };
  }, [complaints, pagination.totalItems, filters.status]);

  const handleApplySearch = (event) => {
    event?.preventDefault();

    setPage(1);
    setFilters((prev) => ({
      ...prev,
      search: searchInput.trim(),
    }));
  };

  const handleStatusChange = (event) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      status: event.target.value,
    }));
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setPage(1);
    setFilters({
      search: "",
      status: "",
    });
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case "Submitted":
        return "status-pill status-submitted";
      case "Preliminary Review":
        return "status-pill status-review";
      case "Under Investigation":
        return "status-pill status-investigation";
      case "Awaiting Evidence":
        return "status-pill status-evidence";
      case "Escalated to CIABOC":
        return "status-pill status-escalated";
      case "Resolved":
        return "status-pill status-resolved";
      case "Closed":
        return "status-pill status-closed";
      default:
        return "status-pill status-default";
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";

    return new Date(dateValue).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="complaints-loading">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="complaints-page animate-fade-up">
      <section className="complaints-hero">
        <div className="complaints-hero-content">
          <div>
            <div className="complaints-eyebrow">
              <FiShield />
              Internal Affairs Unit
            </div>

            <h1>Complaint Management</h1>

            <p>
              Search, filter, review and manage complaint records from one
              professional investigation workspace.
            </p>
          </div>

          <div className="complaints-hero-card">
            <span>Total Complaints</span>
            <strong>{pageStats.total}</strong>
            <small>{pageStats.activeStatus}</small>
          </div>
        </div>
      </section>

      <section className="complaints-kpi-grid">
        <div className="complaints-kpi-card">
          <div className="complaints-kpi-icon blue">
            <FiFileText />
          </div>
          <div>
            <p>Total Records</p>
            <h3>{pageStats.total}</h3>
          </div>
        </div>

        <div className="complaints-kpi-card">
          <div className="complaints-kpi-icon amber">
            <FiClock />
          </div>
          <div>
            <p>Open on Page</p>
            <h3>{pageStats.openOnPage}</h3>
          </div>
        </div>

        <div className="complaints-kpi-card">
          <div className="complaints-kpi-icon green">
            <FiCheckCircle />
          </div>
          <div>
            <p>Resolved on Page</p>
            <h3>{pageStats.resolvedOnPage}</h3>
          </div>
        </div>

        <div className="complaints-kpi-card">
          <div className="complaints-kpi-icon red">
            <FiUserX />
          </div>
          <div>
            <p>Unassigned on Page</p>
            <h3>{pageStats.unassignedOnPage}</h3>
          </div>
        </div>
      </section>

      <section className="complaints-filter-card">
        <div className="complaints-section-heading">
          <div>
            <h2>Find Complaint Records</h2>
            <p>Use CRN, category or status to narrow down the complaint queue.</p>
          </div>

          <FiFilter className="complaints-section-icon" />
        </div>

        <form onSubmit={handleApplySearch} className="complaints-filter-grid">
          <div className="complaints-field complaints-search-field">
            <label>Search by CRN or Category</label>

            <div className="complaints-search-box">
              <FiSearch />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Example: IAU-2026-00001 or Fraud"
              />
            </div>
          </div>

          <div className="complaints-field">
            <label>Filter by Status</label>

            <select value={filters.status} onChange={handleStatusChange}>
              {STATUS_OPTIONS.map((status) => (
                <option key={status || "all"} value={status}>
                  {status || "All Statuses"}
                </option>
              ))}
            </select>
          </div>

          <div className="complaints-filter-actions">
            <button type="submit" className="complaints-primary-button">
              <FiSearch />
              Search
            </button>

            <button
              type="button"
              onClick={handleResetFilters}
              className="complaints-secondary-button"
            >
              <FiRefreshCw />
              Reset
            </button>
          </div>
        </form>
      </section>

      {error && (
        <div className="complaints-error-box">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}

      <section className="complaints-table-card">
        <div className="complaints-table-header">
          <div>
            <h2>Complaint Queue</h2>
            <p>{totalItemsLabel}</p>
          </div>

          <div className="complaints-page-badge">
            Page {pagination.page} of {pagination.totalPages}
          </div>
        </div>

        <div className="complaints-table-wrapper">
          <table className="complaints-table">
            <thead>
              <tr>
                <th>CRN</th>
                <th>Category</th>
                <th>Status</th>
                <th>Assigned Officer</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {complaints.length > 0 ? (
                complaints.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="complaints-crn">{item.crn}</span>
                    </td>

                    <td>
                      <span className="complaints-category">
                        {item.category || "N/A"}
                      </span>
                    </td>

                    <td>
                      <span className={getStatusClassName(item.current_status)}>
                        {item.current_status || "N/A"}
                      </span>
                    </td>

                    

                    <td>
                      {item.assigned_officer_name || (
                        <span className="complaints-unassigned">
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td>{formatDate(item.created_at)}</td>

                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/admin/complaints/${item.id}`)
                        }
                        className="complaints-action-button"
                      >
                        View Case
                        <FiArrowRight />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="complaints-empty-state">
                    <FiFileText />
                    <h3>No complaints found</h3>
                    <p>
                      Try changing the search keyword or clearing the selected
                      status filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="complaints-pagination">
          <span>
            Showing {pageStats.displayed} of {pagination.totalItems || 0} records
          </span>

          <div className="complaints-pagination-actions">
            <button
              type="button"
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </button>

            <button
              type="button"
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComplaintList;