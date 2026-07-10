// import React from 'react';
// import PropTypes from 'prop-types';
// import { ChevronRight } from 'lucide-react';
// import { cn } from '../../../lib/utils';

// const SelectField = ({
//   name,
//   value,
//   onChange,
//   options = [],
//   placeholder = 'Select',
//   label,
//   id,
//   className = '',
//   disabled = false,
//   required = false,
//   error,
//   variant = 'default',
//   size = 'small',
//   ...props
// }) => {
//   const sizeStyles = {
//     small: 'px-3 py-1.5 text-xs',
//     medium: 'px-6 py-4 text-sm',
//     large: 'px-6 py-5 text-base',
//   };

//   const variantStyles = {
//     default: 'border-slate-100 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
//     minimal: 'border-slate-50 bg-slate-50/30 focus:bg-white',
//     glass: 'border-white/40 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20',
//   };

//   return (
//     <div className={cn("relative group", className)}>
//       {label && (
//         <label className={cn(
//           "block text-[11px] font-bold uppercase tracking-wide mb-2 transition-colors",
//           error ? 'text-red-500' : 'text-slate-500 group-focus-within:text-blue-600'
//         )}>
//           {label}
//           {required && <span className="text-red-500 ml-0.5">*</span>}
//         </label>
//       )}
//       <div className="relative">
//         <select
//           name={name}
//           value={value}
//           onChange={onChange}
//           id={id || name}
//           className={cn(
//             "w-full rounded-2xl border font-bold text-slate-800 focus:outline-none transition-all appearance-none",
//             sizeStyles[size],
//             variantStyles[variant],
//             disabled && 'opacity-50 cursor-not-allowed',
//             error && 'border-red-500 focus:ring-red-500',
//           )}
//           disabled={disabled}
//           required={required}
//           {...props}
//         >
//           {placeholder && (
//             <option value="" disabled={required}>{placeholder}</option>
//           )}
//           {options.map((option) => (
//             <option key={option.value} value={option.value} disabled={option.disabled}>
//               {option.label}
//             </option>
//           ))}
//         </select>
//         <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
//           <ChevronRight size={20} className="text-slate-400 rotate-90" />
//         </div>
//       </div>
//       {error && (
//         <span className="text-[10px] text-red-500 mt-1 block">{error}</span>
//       )}
//     </div>
//   );
// };

// SelectField.propTypes = {
//   name: PropTypes.string.isRequired,
//   value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   onChange: PropTypes.func.isRequired,
//   options: PropTypes.arrayOf(
//     PropTypes.shape({
//       value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//       label: PropTypes.string.isRequired,
//       disabled: PropTypes.bool,
//     })
//   ).isRequired,
//   placeholder: PropTypes.string,
//   label: PropTypes.string,
//   id: PropTypes.string,
//   className: PropTypes.string,
//   disabled: PropTypes.bool,
//   required: PropTypes.bool,
//   error: PropTypes.string,
//   variant: PropTypes.oneOf(['default', 'minimal', 'glass']),
//   size: PropTypes.oneOf(['small', 'medium', 'large']),
// };

// export default SelectField;
import React from 'react';
import PropTypes from 'prop-types';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

const SelectField = ({
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select',
  label,
  id,
  className = '',
  disabled = false,
  required = false,
  error,
  variant = 'default',
  size = 'small',
  ...props
}) => {
  const sizeStyles = {
    small: 'px-3 py-1.5 text-[11px]',
    medium: 'px-6 py-4 text-sm',
    large: 'px-6 py-5 text-base',
    compact: 'px-3 py-2 text-[10px]',
    inline: 'px-4 py-2 text-xs',
  };

  const variantStyles = {
    default: 'border-slate-200 bg-white',
    minimal: 'border-slate-100 bg-slate-50/30',
    highlight: 'border-blue-200 bg-white text-blue-600',
    glass: 'border-white/40 bg-white/50 backdrop-blur-sm',
  };

  return (
    <div className={cn("relative group mt-3", className)}>
      <div
        className={cn(
          "relative rounded border transition-all focus-within:border-blue-900/50 focus-within:ring-2 focus-within:ring-blue-900/10",
          variantStyles[variant],
          error ? 'border-red-500 focus-within:ring-red-500' : '',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {label && (
          <label
            htmlFor={id || name}
            className={cn(
              "absolute -top-2.5 left-5 bg-white px-2 text-[10px] font-bold tracking-wide transition-colors z-10",
              error ? 'text-red-500' : 'text-blue-900 group-focus-within:text-blue-900'
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            name={name}
            value={value}
            onChange={onChange}
            id={id || name}
            className={cn(
              "w-full bg-transparent border-none text-slate-800 focus:outline-none focus:ring-0 transition-all rounded appearance-none pr-10",
              sizeStyles[size]
            )}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          >
            {placeholder && (
              <option value="" disabled={required}>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ChevronRight size={18} className="rotate-90" />
          </span>
        </div>
      </div>

      {error && (
        <span className="text-[10px] text-red-500 mt-1 block ml-2">
          {error}
        </span>
      )}
    </div>
  );
};

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'minimal', 'highlight', 'glass']),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'compact', 'inline']),
};

export default SelectField;