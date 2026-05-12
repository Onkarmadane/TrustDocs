import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Search as SearchIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';

const Search = ({
  name,
  value,
  onChange,
  placeholder = 'Search...',
  label,
  id,
  className = '',
  disabled = false,
  required = false,
  error,
  variant = 'default',
  size = 'medium',
  ...props
}) => {
  const inputRef = useRef(null);
  const isMac = typeof navigator !== 'undefined' && navigator.platform?.toLowerCase().includes('mac');

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const sizeStyles = {
    small: 'px-4 py-2 text-xs',
    medium: 'px-6 py-3 text-sm',
    large: 'px-6 py-4 text-base',
  };

  const variantStyles = {
    default: 'border-slate-100 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
    glass: 'border-white/40 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20',
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label htmlFor={id} className={cn("text-sm font-medium", error ? 'text-red-500' : 'text-slate-600')}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        <span className="absolute left-4 text-slate-400">
          <SearchIcon size={16} />
        </span>
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          id={id || name}
          className={cn(
            "w-full pl-10 rounded-2xl border font-bold text-slate-800 focus:outline-none transition-all",
            sizeStyles[size],
            variantStyles[variant],
            disabled && 'opacity-50 cursor-not-allowed',
            error && 'border-red-500 focus:ring-red-500',
          )}
          disabled={disabled}
          required={required}
          ref={inputRef}
          {...props}
        />
        <kbd className="pointer-events-none absolute right-3 flex h-5 select-none items-center gap-1 rounded bg-slate-100 px-1.5 font-mono text-[10px] font-medium text-slate-400 hidden lg:flex">
          <span>{isMac ? '⌘' : 'Ctrl'}</span>K
        </kbd>
      </div>
      {error && <span className="text-[10px] text-red-500 mt-1">{error}</span>}
    </div>
  );
};

Search.propTypes = {
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
  variant: PropTypes.oneOf(['default', 'glass']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default Search;