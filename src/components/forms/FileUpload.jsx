import React from "react";

const FileUpload = ({ label, accept, multiple = false, onChange, className = "" }) => {
	return (
		<div className={`flex flex-col gap-2 ${className}`}>
			{label && <label className="text-sm font-medium">{label}</label>}
			<label className="ui-input cursor-pointer flex items-center justify-between bg-transparent border-gray-300">
				<span className="text-sm">Choose file{multiple ? "s" : ""}</span>
				<input
					type="file"
					accept={accept}
					multiple={multiple}
					onChange={onChange}
					className="hidden"
				/>
			</label>
		</div>
};

export default FileUpload;

