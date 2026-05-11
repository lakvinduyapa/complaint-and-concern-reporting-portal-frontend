import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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
	"Closed"
];

const ComplaintList = () => {
	const navigate = useNavigate();

	const [searchInput, setSearchInput] = useState("");
	const [filters, setFilters] = useState({ search: "", status: "" });
	const [page, setPage] = useState(1);
	const [data, setData] = useState({
		items: [],
		pagination: {
			page: 1,
			totalPages: 1,
			hasNextPage: false,
			hasPrevPage: false,
			totalItems: 0
		}
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchComplaints = async () => {
			try {
				setLoading(true);
				setError("");

				const result = await getAdminComplaints({
					search: filters.search,
					status: filters.status,
					page,
					limit: 10
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
		const totalItems = data?.pagination?.totalItems || 0;
		return `${totalItems} complaint${totalItems === 1 ? "" : "s"}`;
	}, [data]);

	const handleApplySearch = () => {
		setPage(1);
		setFilters((prev) => ({
			...prev,
			search: searchInput.trim()
		}));
	};

	const handleStatusChange = (event) => {
		setPage(1);
		setFilters((prev) => ({
			...prev,
			status: event.target.value
		}));
	};

	const handleResetFilters = () => {
		setSearchInput("");
		setPage(1);
		setFilters({ search: "", status: "" });
	};

	const getStatusClassName = (status) => {
		const styles = {
			Submitted: "bg-blue-100 text-blue-700",
			"Preliminary Review": "bg-yellow-100 text-yellow-700",
			"Under Investigation": "bg-orange-100 text-orange-700",
			"Awaiting Evidence": "bg-purple-100 text-purple-700",
			"Escalated to CIABOC": "bg-red-100 text-red-700",
			Resolved: "bg-green-100 text-green-700",
			Closed: "bg-gray-100 text-gray-700"
		};

		return styles[status] || "bg-gray-100 text-gray-700";
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div>
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-gray-900">Complaint Management</h1>
				<p className="text-gray-600 mt-2">Search, filter, and review submitted complaints.</p>
			</div>

			<div className="bg-white rounded-lg shadow-md p-5 mb-6">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="md:col-span-2">
						<label className="block text-sm font-semibold text-gray-700 mb-2">Search by CRN or Category</label>
						<div className="flex gap-2">
							<input
								type="text"
								value={searchInput}
								onChange={(event) => setSearchInput(event.target.value)}
								onKeyDown={(event) => {
									if (event.key === "Enter") {
										handleApplySearch();
									}
								}}
								placeholder="e.g. IAU-2026-000001"
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<button
								type="button"
								onClick={handleApplySearch}
								className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
							>
								Search
							</button>
						</div>
					</div>

					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Status</label>
						<select
							value={filters.status}
							onChange={handleStatusChange}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							{STATUS_OPTIONS.map((status) => (
								<option key={status || "all"} value={status}>
									{status || "All Statuses"}
								</option>
							))}
						</select>
					</div>

					<div className="flex items-end">
						<button
							type="button"
							onClick={handleResetFilters}
							className="w-full px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg"
						>
							Reset
						</button>
					</div>
				</div>
			</div>

			{error ? (
				<div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
					{error}
				</div>
			) : null}

			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<div className="p-4 border-b border-gray-200 flex justify-between items-center">
					<p className="text-sm text-gray-600">{totalItemsLabel}</p>
					<p className="text-sm text-gray-500">Page {data.pagination.page} of {data.pagination.totalPages}</p>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-200 bg-gray-50">
								<th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">CRN</th>
								<th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
								<th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
								<th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Reporter</th>
								<th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Submitted</th>
								<th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
							</tr>
						</thead>
						<tbody>
							{data.items.length === 0 ? (
								<tr>
									<td colSpan={6} className="py-8 px-4 text-center text-gray-500">
										No complaints found for the selected filters.
									</td>
								</tr>
							) : (
								data.items.map((item) => (
									<tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
										<td className="py-3 px-4 font-mono text-sm text-blue-600">{item.crn}</td>
										<td className="py-3 px-4 text-sm text-gray-700">{item.category}</td>
										<td className="py-3 px-4 text-sm">
											<span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClassName(item.currentStatus)}`}>
												{item.currentStatus}
											</span>
										</td>
										<td className="py-3 px-4 text-sm text-gray-700">
											{item.isAnonymous ? "Anonymous" : (item?.reporter?.fullName || "Named")}
										</td>
										<td className="py-3 px-4 text-sm text-gray-500">
											{new Date(item.createdAt).toLocaleDateString()}
										</td>
										<td className="py-3 px-4 text-sm">
											<button
												type="button"
												onClick={() => navigate(`/admin/complaints/${item._id}`)}
												className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium"
											>
												Open Details
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				<div className="p-4 border-t border-gray-200 flex justify-end gap-2">
					<button
						type="button"
						disabled={!data.pagination.hasPrevPage}
						onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
						className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
					>
						Previous
					</button>
					<button
						type="button"
						disabled={!data.pagination.hasNextPage}
						onClick={() => setPage((prev) => prev + 1)}
						className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
};

export default ComplaintList;
