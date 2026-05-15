import React, { useState, useEffect, forwardRef, useRef } from 'react';
import { X } from 'lucide-react';
import { getResolvedImageUrl } from '../../utils/imageUtils';

/**
 * Main Modal Component
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = 'max-w-md',
  disableBackdropClick = false,
  ariaLabelledBy = 'modal-title',
}) => {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-dm-sans">
      {!disableBackdropClick && (
        <div className="absolute inset-0 w-full h-full" onClick={onClose} />
      )}
      <div
        className={`bg-white rounded-3xl shadow-2xl w-full relative z-[1001] flex flex-col overflow-hidden border border-gray-100 ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 id={ariaLabelledBy} className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all text-gray-400 hover:text-gray-600 hover:rotate-90">
            <X size={20} />
          </button>
        </div>
        <div className="h-px bg-gray-100 mx-6" />
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto flex flex-col gap-4">
          {children}
        </div>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────
   FORM BUILDING BLOCKS
──────────────────────────────────────────── */

/**
 * FormField Wrapper
 * Handles Label, Required Asterisk, and Error Message
 */
export const FormField = ({ label, children, error, required, className = '' }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <div className="flex items-center gap-1">
      <label className="text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1" title="Required field">*</span>}
      </label>
    </div>
    {/* We clone the child to pass the error state down if needed, 
        or simply rely on the child receiving the error prop independently */}
    {children}
    {error && (
      <span className="text-[11px] font-medium text-red-500 ml-1 mt-0.5 animate-in fade-in slide-in-from-top-1">
        {error}
      </span>
    )}
  </div>
);

// Shared logic for input styling
const inputClasses = (hasError) => `
  w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none
  ${hasError
    ? 'border-red-500 bg-red-50/30 focus:ring-red-100'
    : 'border-gray-200 bg-gray-50 focus:border-[#7E1080] focus:bg-white focus:ring-purple-100'}
  text-gray-800 placeholder-gray-400 focus:ring-2
`;

export const FormInput = forwardRef(({ type = 'text', error, ...rest }, ref) => (
  <input
    ref={ref}
    type={type}
    aria-invalid={!!error}
    className={inputClasses(!!error)}
    {...rest}
  />
));

export const FormSelect = forwardRef(({ children, error, ...rest }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      aria-invalid={!!error}
      className={`${inputClasses(!!error)} appearance-none cursor-pointer`}
      {...rest}
    >
      {children}
    </select>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
    </div>
  </div>
));

export const FormTextarea = forwardRef(({ error, rows = 3, ...rest }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    aria-invalid={!!error}
    className={`${inputClasses(!!error)} resize-none`}
    {...rest}
  />
));

export const FormImageUpload = ({ label = 'Image', name, onChange, currentImage, previewUrl, error, required }) => {
  const displaySrc = previewUrl || (currentImage ? getResolvedImageUrl(currentImage) : null);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <label className={`
        flex flex-col items-center justify-center gap-2 w-full h-28 rounded-xl border-2 border-dashed cursor-pointer transition-all group overflow-hidden relative
        ${error ? 'border-red-300 bg-red-50/30' : 'border-gray-200 bg-gray-50 hover:border-[#7E1080] hover:bg-purple-50/30'}
      `}>
        {displaySrc ? (
          <img src={displaySrc} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <>
            <div className={`text-2xl ${error ? 'text-red-400' : 'text-gray-300 group-hover:text-[#7E1080]'}`}>+</div>
            <span className={`text-xs font-medium ${error ? 'text-red-400' : 'text-gray-400 group-hover:text-[#7E1080]'}`}>
              Click to Upload
            </span>
          </>
        )}
        <input type="file" name={name} accept="image/*" className="hidden" onChange={onChange} />
      </label>
      {error && <span className="text-[11px] font-medium text-red-500 ml-1">{error}</span>}
    </div>
  );
};

export const FormMultiSelect = ({ options, selectedValues, onChange, placeholder = "Select options", error }) => {
  const handleSelect = (e) => {
    const value = e.target.value;
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <select
        multiple
        value={selectedValues}
        onChange={handleSelect}
        className={`${inputClasses(!!error)} min-h-[100px] py-2`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="p-2 rounded-lg m-1 checked:bg-purple-600 checked:text-white">
            {option.label}
          </option>
        ))}
      </select>
      <span className="text-[10px] text-gray-400 italic px-1">Hold Ctrl (Cmd) to select multiple</span>
    </div>
  );
};

export const FormAutocomplete = ({ options, selectedValues, onChange, placeholder = "Select...", error }) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase()) &&
    !selectedValues.includes(opt.value)
  );

  const handleSelect = (value) => {
    onChange([...selectedValues, value]);
    setSearch('');
    setIsOpen(false);
  };

  const handleRemove = (value) => {
    onChange(selectedValues.filter(v => v !== value));
  };

  return (
    <div ref={containerRef} className="relative flex flex-col gap-2">
      {/* Selected Items Tags */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-1 animate-in fade-in slide-in-from-top-1">
          {selectedValues.map(val => {
            const label = options.find(o => o.value === val)?.label || val;
            return (
              <span key={val} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7E1080]/10 text-[#7E1080] text-[11px] font-bold rounded-lg border border-[#7E1080]/20 hover:bg-[#7E1080]/20 transition-all">
                {label}
                <button type="button" onClick={() => handleRemove(val)} className="text-[#7E1080] hover:text-red-500 transition-colors">
                  <X size={14} />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={selectedValues.length > 0 ? "Select more..." : placeholder}
          className={`${inputClasses(!!error)} !py-3`}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className="px-4 py-3 text-sm text-gray-700 hover:bg-[#7E1080]/5 hover:text-[#7E1080] cursor-pointer transition-all border-b border-gray-50 last:border-none font-medium"
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-4 text-sm text-gray-400 italic text-center">No more services found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const ModalSubmitBtn = ({ children, isLoading, ...props }) => (
  <button
    disabled={isLoading}
    {...props}
    className="w-full max-w-[200px] py-3.5 mt-2 rounded-xl mx-auto font-semibold text-sm text-white bg-[linear-gradient(180deg,#7E1080_0%,#1A031A_100%)] shadow-lg shadow-purple-200 hover:opacity-90 active:scale-[.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isLoading ? (
      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    ) : children}
  </button>
);

export default Modal;