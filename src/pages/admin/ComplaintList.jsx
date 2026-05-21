import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
	const location = useLocation();

	const params = new URLSearchParams(location.search);
	const initialStatus = params.get("status") || "";

	const [searchInput, setSearchInput] = useState("");
	const [filters, setFilters] = useState({
		search: "",
		status: initialStatus
	});

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
		setFilters({
			search: "",
			status: ""
		});
	};

	const getStatusClassName = () => {
		return "bg-white text-gray-700 border border-gray-200";
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="space-y-6">

			{/* Header */}
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-slate-900">
					Complaint Management
				</h1>

				<p className="text-slate-600 mt-2">
					Search, filter, and review submitted complaints.
				</p>
			</div>

			{/* Filters */}
			<div className="bg-white p-5 md:p-6 rounded-3xl shadow-lg">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">

					{/* Search */}
					<div className="md:col-span-2">
						<label className="block text-sm font-semibold mb-2">
							Search by CRN or Category
						</label>

						<div className="flex gap-2">
							<input
								type="text"
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
								className="ui-input w-full"
							/>

							{/*  GREEN BUTTON */}
							<button
								type="button"
								onClick={handleApplySearch}
								className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
							>
								Search
							</button>
						</div>
					</div>

					{/* Status */}
					<div>
						<label className="block text-sm font-semibold mb-2">
							Filter by Status
						</label>

						<select
							value={filters.status}
							onChange={handleStatusChange}
							className="ui-select w-full"
						>
							{STATUS_OPTIONS.map((status) => (
								<option key={status || "all"} value={status}>
									{status || "All Statuses"}
								</option>
							))}
						</select>
					</div>

					{/* Reset */}
					<div className="flex items-end">
						<button
							type="button"
							onClick={handleResetFilters}
							className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg w-full text-sm font-medium"
						>
							Reset
						</button>
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="ui-card overflow-hidden">

				<div className="p-4 border-b flex justify-between bg-white">
					<p className="text-sm font-medium text-slate-700">
						{totalItemsLabel}
					</p>

					<p className="text-sm text-slate-500">
						Page {data.pagination.page} of {data.pagination.totalPages}
					</p>
				</div>

				<table className="w-full">

					<tbody>
						{data.items.map((item) => (
							<tr key={item._id} className="hover:bg-gray-100">

								<td className="px-4 py-3 font-mono text-cyan-600">
									{item.crn}
								</td>

								<td className="px-4 py-3">
									{item.category}
								</td>

								<td className="px-4 py-3">
									<span className={getStatusClassName()}>
										{item.currentStatus}
									</span>
								</td>

								<td className="px-4 py-3">
									{item.isAnonymous ? "Anonymous" : item?.reporter?.fullName}
								</td>

								<td className="px-4 py-3">
									{new Date(item.createdAt).toLocaleDateString()}
								</td>

								<td className="px-4 py-3">

									{/*  GREEN BUTTON */}
									<button
										onClick={() =>
											navigate(`/admin/complaints/${item._id}`)
										}
										className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs"
									>
										Open Details
									</button>

								</td>

							</tr>
						))}
					</tbody>

				</table>

				{/* Pagination */}
				<div className="p-4 flex justify-end gap-2 bg-gray-50">

					{/* GREEN */}
					<button
						disabled={!data.pagination.hasPrevPage}
						onClick={() => setPage((p) => Math.max(p - 1, 1))}
						className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm disabled:opacity-50"
					>
						Previous
					</button>

					{/* GREEN */}
					<button
						disabled={!data.pagination.hasNextPage}
						onClick={() => setPage((p) => p + 1)}
						className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm disabled:opacity-50"
					>
						Next
					</button>

				</div>

			</div>
		</div>
	);
};

export default ComplaintList;