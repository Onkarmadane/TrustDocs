import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import {
  CoverPage,
  PermissionsPage,
  ScheduleIXPage,
  IncomeExpPage,
  BalanceSheetPage,
  ReceiptPaymentPage,
  Schedule9DPage,
  DelayExemptionPage
} from './LivePreview';

const Step9Preview = ({ formData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [containerWidth, setContainerWidth] = useState(600);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const baseScale = Math.min(1, (containerWidth - 32) / 600); // 32 is padding (p-4 * 2) on mobile
  const finalScale = baseScale * (zoom / 100);

  const renderContent = () => {
    switch (currentPage) {
      case 1: return <CoverPage formData={formData} />;
      case 2: return <PermissionsPage formData={formData} />;
      case 3: return <ScheduleIXPage formData={formData} />;
      case 4: return <IncomeExpPage formData={formData} />;
      case 5: return <BalanceSheetPage formData={formData} />;
      case 6: return <ReceiptPaymentPage formData={formData} />;
      case 7: return <Schedule9DPage formData={formData} />;
      case 8: return <DelayExemptionPage formData={formData} />;
      default: return <CoverPage formData={formData} />;
    }
  };

  return (
    <div className="p-4 md:p-10 space-y-8">
      <div>
        <h2 className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-[0.2em]">Step 9: Final Preview</h2>
        <p className="text-xs text-slate-500">Preview all pages of the report before downloading.</p>
      </div>
      <div className="mt-auto pt-6 flex flex-wrap justify-center items-center gap-4 bg-white px-5 py-2 rounded-full text-xs font-bold text-slate-600 border border-slate-100 shadow-sm z-50">
        <span>Page {currentPage} of 8</span>
        <div className="w-px h-4 bg-slate-200 hidden sm:block" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(prev => Math.max(30, prev - 10))}
            className="p-1 hover:bg-slate-50 rounded-full text-slate-400 hover:text-blue-600 transition-all"
            title="Zoom Out"
          >
            <Minus size={16} />
          </button>
          <span className="w-10 text-center tabular-nums">{zoom}%</span>
          <button
            onClick={() => setZoom(prev => Math.min(200, prev + 10))}
            className="p-1 hover:bg-slate-50 rounded-full text-slate-400 hover:text-blue-600 transition-all"
            title="Zoom In"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      <div ref={containerRef} className="relative border border-slate-100 bg-slate-50 rounded-3xl p-4 md:p-8 flex flex-col items-center min-h-[500px] overflow-hidden">
        <div className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-50">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="p-2 md:p-3 bg-white/90 rounded-full shadow-lg hover:bg-white disabled:opacity-50 transition-all"
            disabled={currentPage === 1}
          >
            <ChevronLeft size={20} className="text-blue-600" />
          </button>
        </div>
        <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-50">
          <button
            onClick={() => setCurrentPage(prev => Math.min(8, prev + 1))}
            className="p-2 md:p-3 bg-white/90 rounded-full shadow-lg hover:bg-white disabled:opacity-50 transition-all"
            disabled={currentPage === 8}
          >
            <ChevronRight size={20} className="text-blue-600" />
          </button>
        </div>

        <div
          className="w-full max-w-[600px] transition-all duration-300"
          style={{
            transform: `scale(${finalScale})`,
            transformOrigin: 'top center',
            marginBottom: `${(finalScale - 1) > 0 ? (finalScale - 1) * 848 : 0}px` // 848 is approx height of A4 at 600px width
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>


      </div>
    </div>
  );
};

export default Step9Preview;
