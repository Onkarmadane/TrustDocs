import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '../../lib/utils';

const UploadBox = ({ label, value, onUpload }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && onUpload) {
      setIsUploading(true);
      await onUpload(file);
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1">
      <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wide">{label}</label>
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border border-slate-100 rounded-xl px-4 py-3 flex items-center justify-between hover:bg-slate-50 hover:border-blue-200 transition-all cursor-pointer group bg-white shadow-sm"
      >
        <span className="text-xs text-slate-400 group-hover:text-blue-500 truncate max-w-[80%]">
          {isUploading ? 'Uploading...' : (value ? 'Uploaded' : 'Upload')}
        </span>
        <Upload size={18} className={cn("text-slate-300 transition-colors", value ? "text-green-500" : "group-hover:text-blue-500")} />
      </div>
      {value && <img src={value} alt={label} className="mt-2 h-16 object-contain rounded border border-slate-100" />}
    </div>
  );
};

export default UploadBox;
