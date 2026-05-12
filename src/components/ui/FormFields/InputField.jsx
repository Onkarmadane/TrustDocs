import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../../lib/utils';

const InputField = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  label,
  id,
  className = '',
  disabled = false,
  required = false,
  error,
  variant = 'default',
  size = 'medium',
  iconLeft,
  iconRight,
  readOnly = false,
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
    default: 'border-slate-100 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
    minimal: 'border-slate-50 bg-slate-50/30 focus:bg-white',
    highlight: 'border-blue-200 bg-white text-blue-600',
    glass: 'border-white/40 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
  };

  return (
    <div className={cn("relative group", className)}>
      {label && (
        <label className={cn(
          "block text-[11px] font-bold uppercase tracking-wide mb-2 transition-colors",
          error ? 'text-red-500' : 'text-slate-500 group-focus-within:text-blue-600'
        )}>
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="flex items-center relative">
        {iconLeft && (
          <span className="absolute left-4 text-slate-300 z-10">{iconLeft}</span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          id={id || name}
          className={cn(
            "w-full rounded-2xl border font-bold text-slate-800 focus:outline-none transition-all",
            sizeStyles[size],
            variantStyles[variant],
            disabled && 'opacity-50 cursor-not-allowed',
            error && 'border-red-500 focus:ring-red-500',
            readOnly && 'cursor-default bg-slate-50',
            iconLeft && 'pl-10',
            iconRight && 'pr-10',
          )}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
        {iconRight && (
          <span className="absolute right-4 text-slate-300">{iconRight}</span>
        )}
      </div>
      {error && (
        <span className="text-[10px] text-red-500 mt-1 block">{error}</span>
      )}
    </div>
  );
};

InputField.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'minimal', 'highlight', 'glass']),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'compact', 'inline']),
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  readOnly: PropTypes.bool,
};

export default InputField;