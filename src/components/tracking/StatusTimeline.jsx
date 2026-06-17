const statusOrder = [
	"Submitted",
	"Preliminary Review",
	"Under Investigation",
	"Awaiting Evidence",
	"Escalated to CIABOC",
	"Resolved / Closed",
];

const getDisplayStatus = (status) => {
	if (status === "Resolved" || status === "Closed") {
		return "Resolved / Closed";
	}

	return status;
};

const formatDateTime = (value) => {
	if (!value) {
		return "";
	}

	const parsedDate = new Date(value);

	if (Number.isNaN(parsedDate.getTime())) {
		return "";
	}

	return parsedDate.toLocaleString();
};

const StatusTimeline = ({ currentStatus, statusHistory = [] }) => {
	const statusMeta = new Map();

	statusHistory.forEach((entry) => {
		const displayStatus = getDisplayStatus(entry.status);

		if (!statusMeta.has(displayStatus)) {
			statusMeta.set(displayStatus, entry);
		}
	});

	const currentDisplayStatus = getDisplayStatus(currentStatus);
	const currentStatusIndex = statusOrder.indexOf(currentDisplayStatus);

	return (
		<div className="panel-surface p-6 md:p-8">
			<h3 className="text-lg font-bold text-slate-900">Status timeline</h3>

			<div className="mt-6 space-y-4">
				{statusOrder.map((status, index) => {
					const isComplete = currentStatusIndex >= index;
					const isCurrent = currentDisplayStatus === status;
					const historyEntry = statusMeta.get(status);

					return (
						<div key={status} className="flex gap-4">
							<div className="flex flex-col items-center">
								<div
									className={`mt-1 flex h-4 w-4 items-center justify-center rounded-full border-2 ${
										isComplete ? "border-green-600 bg-green-600" : "border-slate-300 bg-white"
									}`}
								>
									{isCurrent && <span className="h-2 w-2 rounded-full bg-white" />}
								</div>

								{index < statusOrder.length - 1 && (
									<div className={`mt-2 h-full w-px flex-1 ${isComplete ? "bg-green-200" : "bg-slate-200"}`} />
								)}
							</div>

							<div className="pb-4 min-w-0 flex-1">
								<div className="flex flex-wrap items-center gap-2">
									<p className={`font-semibold ${isComplete ? "text-slate-900" : "text-slate-500"}`}>
										{status}
									</p>

									{isCurrent && (
										<span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
											Current stage
										</span>
									)}
								</div>

								{historyEntry?.note && (
									<div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
										<p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
											Additional note
										</p>
										<p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700">
											{historyEntry.note}
										</p>
									</div>
								)}

								{(historyEntry?.updatedBy || historyEntry?.updatedAt) && (
									<p className="mt-2 text-xs text-slate-500">
										{historyEntry.updatedBy ? `Updated by ${historyEntry.updatedBy}` : ""}
										{historyEntry.updatedBy && historyEntry.updatedAt ? " · " : ""}
										{formatDateTime(historyEntry.updatedAt)}
									</p>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default StatusTimeline;
