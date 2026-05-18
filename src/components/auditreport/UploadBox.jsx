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
    <div className="relative group mt-3 flex-1">
      <div className="relative border border-slate-200 bg-white rounded-2xl transition-all hover:border-blue-900/50">
        {label && (
          <label className="absolute -top-2.5 left-5 bg-white px-2 text-[11px] font-medium tracking-wide text-blue-900 transition-colors z-10">
            {label}
          </label>
        )}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        <div
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group rounded-2xl"
        >
          <span className="text-[12px] font-medium text-slate-800 group-hover:text-blue-900 truncate max-w-[80%]">
            {isUploading ? 'Uploading...' : (value ? 'Uploaded' : 'Upload')}
          </span>
          <Upload size={18} className={cn("text-slate-400 transition-colors", value ? "text-green-500" : "group-hover:text-blue-900")} />
        </div>
      </div>
      {value && <img src={value} alt={label} className="mt-2 h-16 object-contain rounded-2xl border border-slate-100" />}
    </div>
  );
};

export default UploadBox;
