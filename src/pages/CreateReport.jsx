import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AuditReportForm from '../components/auditreport/AuditReportForm';
import NondaniReportForm from '../components/nondanireport/NondaniReportForm';
import { SelectField } from '../components/ui/FormFields';
import { ChevronUp } from 'lucide-react';

const CreateReport = () => {
  const location = useLocation();
  const initialReportType = location.state?.reportType || 'audit';
  const [reportType, setReportType] = useState(initialReportType);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className=" sticky top-[69px] z-40 ">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
            <div className="w-full sm:w-80 flex items-center justify-end gap-3 bg-white p-2 rounded-2xl">
              <span className="text-sm font-semibold text-slate-600 whitespace-nowrap">Report Type:</span>
              <div className="flex-1">
                <SelectField
                  name="reportType"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  options={[
                    { value: 'audit', label: 'Audit Report' },
                    { value: 'nondani', label: 'Nondani Report' }
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {reportType === 'audit' && <AuditReportForm reportType={reportType} setReportType={setReportType} />}
        {reportType === 'nondani' && <NondaniReportForm reportType={reportType} setReportType={setReportType} />}
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 group"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-20 h-20 flex items-center justify-center"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    id="circlePathTop"
                    d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                    fill="none"
                  />
                  <text className="text-[9px] font-bold fill-indigo-600/60 uppercase tracking-[0.15em]">
                    <textPath href="#circlePathTop">
                      BACK TO TOP • BACK TO TOP • BACK TO TOP • BACK TO TOP •
                    </textPath>
                  </text>
                </svg>
              </motion.div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-gradient-to-tr from-indigo-900 to-blue-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-500/30 relative z-10 overflow-hidden"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                <ChevronUp
                  size={22}
                  className="group-hover:scale-110 transition-transform"
                  strokeWidth={2}
                />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateReport;
