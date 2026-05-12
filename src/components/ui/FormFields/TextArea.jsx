import React from 'react';
import PropTypes from 'prop-types';

const Textarea = ({
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
  variant = 'primary',
  size = 'medium',
  iconLeft,
  iconRight,
  ...props
}) => {
  // Base styles
  const baseStyles = ' text-text p-1 border rounded-lg focus:outline-none transition-all duration-500 w-full min-h-[5px]';

  // Variant styles
  const variantStyles = {
    primary: 'border-primary  focus:border-primary focus:ring-2 focus:ring-primary bg-background text-text',
    secondary: 'border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 bg-gray-50',
    minimal: 'border-transparent focus:border-gray-200 bg-transparent',
  };

  // Size styles
  const sizeStyles = {
    small: 'p-2 text-sm min-h-[80px]',
    medium: 'p-3 text-base min-h-[120px]',
    large: 'p-4 text-lg min-h-[160px]',
  };

  // Combined textarea classes
  const textareaClasses = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${error ? 'border-red-500 focus:ring-red-500' : ''}
    ${iconLeft ? 'pl-10' : ''}
    ${iconRight ? 'pr-10' : ''}
  `.trim();

  return (
    <div className="flex flex-col gap-1" style={{width: '100%'}}>
      {label && (
        <label
          htmlFor={id}
          className={`text-sm font-medium ${error ? 'text-red-500' : 'text-gray-700'
            }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {iconLeft && (
          <span className="absolute left-3 top-4 text-text">
            {iconLeft}
          </span>
        )}
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          id={id}
          className={textareaClasses}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {iconRight && (
          <span className="absolute right-3 top-4 text-text">
            {iconRight}
          </span>
        )}
      </div>
      {error && (
        <span
          id={`${id}-error`}
          className="text-sm text-red-500 mt-1"
        >
          {error}
        </span>
      )}
    </div>
  );
};

// PropTypes for type checking
Textarea.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'minimal']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
};

export default Textarea;