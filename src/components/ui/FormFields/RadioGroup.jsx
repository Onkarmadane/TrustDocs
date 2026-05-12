import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../../lib/utils';

const RadioGroup = ({ label, name, value, options, onChange, required, error, variant = 'default', className }) => {
  const isCard = variant === 'card';

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className={cn(
          "block font-medium",
          isCard ? "text-sm text-slate-700 leading-relaxed" : "text-[11px] font-bold text-slate-400 uppercase tracking-wide"
        )}>
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className={cn("flex gap-6", isCard && "pt-1")}>
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
              required={required}
            />
            <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {error && <p className="text-red-500 text-[10px] mt-1">{error}</p>}
    </div>
  );
};

RadioGroup.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  error: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'card']),
  className: PropTypes.string,
};

export default RadioGroup;