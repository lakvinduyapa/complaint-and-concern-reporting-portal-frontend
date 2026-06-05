import React from "react";

const FormSelect = ({ label, options = [], className = "", ...props }) => {
	return (
		<div className={`flex flex-col gap-2 ${className}`}>
			{label && <label className="text-sm font-medium">{label}</label>}
			<select className="ui-select bg-transparent border-gray-300 focus:border-gray-500" {...props}>
				{options.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
		</div>
};

export default FormSelect;
