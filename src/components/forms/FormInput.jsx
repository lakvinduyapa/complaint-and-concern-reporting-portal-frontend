import React from "react";

const FormInput = React.forwardRef(({ label, error, className = "", ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <input ref={ref} className="ui-input bg-transparent border-gray-300 focus:border-gray-500" {...props} />
      {error && <p className="text-sm" style={{color: '#b91c1c'}}>{error}</p>}
    </div>
  );
});

export default FormInput;
