import React from "react";

function Heading({
  title,
  subtitle,
  actions, // 👈 buttons go here
  className = "",
}) {
  return (
    <div
      className={`flex font-dm-sans flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5 ${className}`}
    >
      {/* Left Content */}
      <div>
        <h1 className="text-xl md:text-2xl lg:text-[35px] font-semibold text-black">
          {title}
        </h1>

        {subtitle && (
          <p className="text-sm font-dm-sans md:text-[18px] font-medium text-gray-500 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Actions (Only if passed) */}
      {actions && (
        <div className="flex items-center gap-3 flex-wrap justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}

export default Heading;