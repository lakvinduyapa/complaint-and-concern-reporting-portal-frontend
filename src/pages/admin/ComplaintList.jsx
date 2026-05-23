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

	const getStatusClassName = (status) => {
		switch (status) {
			case "Submitted":
				return "bg-cyan-50 text-cyan-700 border border-cyan-200";

			case "Preliminary Review":
                return "bg-purple-50 text-purple-700 border border-purple-200";

            case "Under Investigation":
                 return "bg-yellow-50 text-yellow-700 border border-yellow-200";

            case "Awaiting Evidence":
                 return "bg-orange-50 text-orange-700 border border-orange-200";

            case "Escalated to CIABOC":
                return "bg-red-50 text-red-700 border border-red-200";

            case "Resolved":
                 return "bg-green-50 text-green-700 border border-green-200";

            case "Closed":
                return "bg-gray-50 text-gray-700 border border-gray-200";

            default:
                return "bg-slate-50 text-slate-700 border border-slate-200";
  }

		




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
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
				<div>
					<h1 className="text-4xl font-bold text-slate-900">
                       Complaint Management
                    </h1>
				
				<p className="text-slate-500 mt-2">

					 Search, filter, review and manage complaint records.
				</p>
			</div>

			 <div className="bg-green-50 border border-green-100 px-5 py-3 rounded-2xl">
				 <p className="text-sm text-slate-500">
					Total Complaints
				 </p>
				 <p className="text-2xl font-bold text-slate-900">

					 {data.pagination.totalItems}
				 </p>

			 </div>
				
			</div>

			{/* Filters */}
			<div className="bg-white border border-slate-200 rounded-3xl shadow-lg p-6">
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

			{error && (
	            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-4">
		           {error}
	            </div>
            )}



			{/* Table */}
			<div className="bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden">

				<div className="p-4 border-b flex justify-between bg-white">
					<p className="text-sm font-medium text-slate-700">
						{totalItemsLabel}
					</p>

					<p className="text-sm text-slate-500">
						Page {data.pagination.page} of {data.pagination.totalPages}
					</p>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full min-w-[900px]">
					<thead>
						 <tr className="bg-slate-50 border-b">
							<th className="px-4 py-3 text-left">CRN</th>
							<th className="px-4 py-3 text-left">Category</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Reporter</th>
                            <th className="px-4 py-3 text-left">Date</th>
                           <th className="px-4 py-3 text-left">Action</th>

						 </tr>




					</thead>





					<tbody>
						{data.items.map((item) => (
							<tr key={item._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
>

								<td className="px-4 py-3 font-mono text-cyan-600">
									{item.crn}
								</td>

								<td className="px-4 py-3">
									{item.category}
								</td>

								<td className="px-4 py-3">

									<span 
									  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClassName(
									     item.currentStatus
									
									  )}`}
									>
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
				</div>

				{/* Pagination */}
				<div className="p-4 flex flex-col sm:flex-row items-center justify-between bg-slate-50">

					<span className="text-sm text-slate-600 mb-3 sm:mb-0">
  Page {data.pagination.page} of {data.pagination.totalPages}
</span>

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