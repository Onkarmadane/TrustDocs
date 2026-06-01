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
    default: 'border-slate-200 bg-white',
    minimal: 'border-slate-100 bg-slate-50/30',
    highlight: 'border-blue-200 bg-white text-blue-600',
    glass: 'border-white/40 bg-white/50 backdrop-blur-sm',
  };

  return (
    <div className={cn("relative group mt-3", className)}>
      <div className={cn(
        "relative rounded border transition-all focus-within:border-blue-900/50 focus-within:ring-2 focus-within:ring-blue-900/10",
        variantStyles[variant],
        error ? 'border-red-500 focus-within:ring-red-500' : '',
        disabled && 'opacity-50 cursor-not-allowed',
        readOnly && 'bg-slate-50'
      )}>
        {label && (
          <label className={cn(
            "absolute -top-2.5 left-5 bg-white px-2 text-[12px] font-bold tracking-wide transition-colors z-10",
            error ? 'text-red-500' : 'text-blue-900 group-focus-within:text-blue-900'
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
              "w-full bg-transparent border-none font-bold text-slate-800 focus:outline-none focus:ring-0 transition-all rounded",
              sizeStyles[size],
              iconLeft && 'pl-12',
              iconRight && 'pr-12',
              readOnly && 'cursor-default',
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
      </div>
      {error && (
        <span className="text-[10px] text-red-500 mt-1 block ml-2">{error}</span>
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