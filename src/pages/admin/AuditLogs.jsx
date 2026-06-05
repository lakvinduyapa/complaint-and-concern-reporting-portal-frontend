import { useEffect, useState } from "react";

import {
  FiSearch,
  FiRefreshCw,
  FiActivity,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import {
  getAuditLogs,
  getAuditActions,
  getAuditUsers,
  getAuditComplaints,
} from "../../services/adminAuditService";

const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-LK", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const formatRole = (role) => {
  if (!role) return "-";

  const roleMap = {
    admin: "Admin",
    officer: "Officer",
    senior_investigator: "Senior Investigator",
  };

  return roleMap[String(role).toLowerCase()] || role;
};

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [actions, setActions] = useState([]);
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    action: "",
    userId: "",
    complaintId: "",
    fromDate: "",
    toDate: "",
    page: 1,
    limit: 10,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAuditLogs(filters);

      setLogs(data.logs || []);

      setPagination(
        data.pagination || {
          page: 1,
          totalPages: 1,
          total: 0,
        }
      );
    } catch (err) {
      setError(err.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [actionData, userData, complaintData] = await Promise.all([
        getAuditActions(),
        getAuditUsers(),
        getAuditComplaints(),
      ]);

      setActions(actionData || []);
      setUsers(userData || []);
      setComplaints(complaintData || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [filters.page]);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1,
    });
  };

  const handleSearch = () => {
    fetchLogs();
  };

  const handleReset = () => {
    const resetFilters = {
      action: "",
      userId: "",
      complaintId: "",
      fromDate: "",
      toDate: "",
      page: 1,
      limit: 10,
    };

    setFilters(resetFilters);
  };

  const handlePageChange = (newPage) => {
    setFilters({
      ...filters,
      page: newPage,
    });
  };

  return (
    <div className="audit-page">
      <div className="audit-header">
        <div className="audit-header-left">
          <div className="audit-icon-box">
            <FiActivity className="audit-header-icon" />
          </div>

          <div>
            <h1 className="audit-title">Audit Logs</h1>

            <p className="audit-subtitle">
              Track internal user activities in the complaint investigation
              system
            </p>
          </div>
        </div>
      </div>

      {error && <div className="audit-error-box">{error}</div>}

      <div className="audit-filter-card">
        <div className="audit-filter-grid">
          <select
            name="action"
            value={filters.action}
            onChange={handleChange}
            className="audit-input"
          >
            <option value="">All Actions</option>

            {actions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>

          <select
            name="userId"
            value={filters.userId}
            onChange={handleChange}
            className="audit-input"
          >
            <option value="">All Users</option>

            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName || user.full_name || user.email} -{" "}
                {formatRole(user.role)}
              </option>
            ))}
          </select>

          <select
            name="complaintId"
            value={filters.complaintId}
            onChange={handleChange}
            className="audit-input"
          >
            <option value="">All Complaints</option>

            {complaints.map((complaint) => (
              <option key={complaint.id} value={complaint.id}>
                {complaint.crn}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleChange}
            className="audit-input"
          />

          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleChange}
            className="audit-input"
          />

          <button onClick={handleSearch} className="audit-button-primary">
            <FiSearch />
            Search
          </button>

          <button onClick={handleReset} className="audit-button-secondary">
            <FiRefreshCw />
            Reset
          </button>
        </div>
      </div>

      <div className="audit-table-card">
        <div className="audit-table-wrapper">
          <table className="audit-table">
            <thead>
              <tr>
                <th>Date / Time</th>
                <th>User</th>
                <th>Role</th>
                <th>Action</th>
                <th>Complaint</th>
                <th>Details</th>
                <th>IP Address</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="audit-empty">
                    Loading audit logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="audit-empty">
                    No audit logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="audit-row">
                    <td>
                      {formatDateTime(
                        log.performed_at ||
                          log.performedAt ||
                          log.created_at ||
                          log.createdAt
                      )}
                    </td>

                    <td className="audit-user">
                      {log.user_full_name ||
                        log.full_name ||
                        log.user_email ||
                        "System"}
                    </td>

                    <td>
                      {formatRole(log.user_role || log.role)}
                    </td>

                    <td>
                      <span className="audit-action-badge">
                        {log.action}
                      </span>
                    </td>

                    <td>{log.complaint_crn || log.crn || "-"}</td>

                    <td className="audit-details">
                      {log.details || "-"}
                    </td>

                    <td>{log.ip_address || log.ipAddress || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="audit-pagination">
        <button
          disabled={pagination.page <= 1}
          onClick={() => handlePageChange(pagination.page - 1)}
          className="audit-pagination-button"
        >
          <FiChevronLeft />
          Previous
        </button>

        <span className="audit-pagination-text">
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <button
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => handlePageChange(pagination.page + 1)}
          className="audit-pagination-button"
        >
          Next
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default AuditLogs;