import React, { useState, useCallback, useEffect, useRef } from 'react';
import Card from '../components/ui/Card';
import { InputField, RadioGroup, SelectField } from '../components/ui/FormFields';
import { ChevronLeft, ChevronRight, MoreVertical, Search, Maximize2, Upload, Download, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';
import LivePreview from '../components/auditreport/LivePreview';
import { reportService } from '../services/reportService';
import { mapFormDataToBackendPayload } from '../utils/reportMapper';
import useDocumentTitle from '../utils/useDocumentTitle';
import { FaEye, FaEyeSlash } from "react-icons/fa";
// Import subcomponents
import StepIndicator from '../components/auditreport/StepIndicator';
import UploadBox from '../components/auditreport/UploadBox';
import AccountingRow from '../components/auditreport/AccountingRow';
import BalanceSheetColumn from '../components/auditreport/BalanceSheetColumn';
import { steps } from '../components/auditreport/steps';
import Step9Preview from '../components/auditreport/Step9Preview';
import Step1BasicDetails from '../components/auditreport/Step1BasicDetails';
import Step2Permissions from '../components/auditreport/Step2Permissions';
import Step3ScheduleIX from '../components/auditreport/Step3ScheduleIX';
import Step4IncomeExpenditure from '../components/auditreport/Step4IncomeExpenditure';
import Step5BalanceSheet from '../components/auditreport/Step5BalanceSheet';
import Step6ReceiptPayment from '../components/auditreport/Step6ReceiptPayment';
import Step7Schedule9D from '../components/auditreport/Step7Schedule9D';
import Step8DelayExemption from '../components/auditreport/Step8DelayExemption';


/*                    MAIN COMPONENT                      */

const CreateReport = () => {
  useDocumentTitle('Create Audit Report');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [zoom, setZoom] = useState(100);
  const [reportId, setReportId] = useState(null);
  const [isReportSaved, setIsReportSaved] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);

  const lastSavedData = useRef({});
  const formDataRef = useRef(formData);
  const currentStepRef = useRef(currentStep);
  const reportIdRef = useRef(reportId);

  useEffect(() => {
    formDataRef.current = formData;
    currentStepRef.current = currentStep;
    reportIdRef.current = reportId;
  }, [formData, currentStep, reportId]);

  const [debouncedFormData, setDebouncedFormData] = useState(formData);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFormData(formData);
    }, 300);
    return () => clearTimeout(timer);
  }, [formData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowBackToTop(window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const saveDraft = async (data) => {
    const currentData = data || formDataRef.current;
    const step = currentStepRef.current;
    const id = reportIdRef.current;

    if (Object.keys(currentData).length === 0) return id;
    if (JSON.stringify(currentData) === JSON.stringify(lastSavedData.current)) return id;

    try {
      const payload = mapFormDataToBackendPayload(currentData, step, 'draft');

      if (!id) {
        const result = await reportService.createReport(payload);
        if (result.success && result.data?._id) {
          setReportId(result.data._id);
          lastSavedData.current = currentData;
          console.log('Background Saved (Created Draft):', result.data._id);
          return result.data._id;
        }
      } else {
        const result = await reportService.updateReport(id, payload);
        if (result.success) {
          lastSavedData.current = currentData;
          console.log('Background Saved (Updated Draft):', id);
          return id;
        }
      }
    } catch (err) {
      console.error('Background save failed:', err);
    }
    return id;
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleImageUpload = async (file, key) => {
    try {
      const result = await reportService.uploadImage(file);
      if (result.success && result.data?.url) {
        const url = result.data.url;
        setFormData(prev => ({ ...prev, [key]: url }));

        // Save draft immediately after image upload to ensure it's in the payload
        const newData = { ...formDataRef.current, [key]: url };
        saveDraft(newData);

        toast.success('Image uploaded');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleNext = () => {
    saveDraft();
    setCurrentStep(prev => Math.min(9, prev + 1));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };


  const handleSaveReport = async () => {
    try {
      const payload = mapFormDataToBackendPayload(formData, currentStep, 'completed');

      let result;
      if (!reportId) {
        result = await reportService.createReport(payload);
        if (result.success && result.data?._id) {
          setReportId(result.data._id);
        }
      } else {
        result = await reportService.updateReport(reportId, payload);
      }

      if (result.success) {
        setIsReportSaved(true);
        toast.success('Report saved successfully!');
        lastSavedData.current = formData;
      } else {
        toast.error('Error saving report: ' + result.message);
      }
    } catch (error) {
      console.error('Save Report Error:', error);
      toast.error('Failed to save report');
    }
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const id = await saveDraft();

      if (!id) {
        toast.error("Please save the report first");
        setIsDownloading(false);
        return;
      }

      const blob = await reportService.downloadPdf(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Audit_Report_${formData.trustName || 'Trust'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">

      <main className="max-w-[1600px] mx-auto px-4 md:px-8 pt-8 space-y-8">
        {/* Header Row: Steps */}
        <div className="w-full flex justify-between items-center">
          <div className="flex-1">
            <StepIndicator currentStep={currentStep} />
          </div>
          {currentStep !== 9 && (
            <button
              onClick={() => setIsPreviewCollapsed(!isPreviewCollapsed)}
              className="ml-4 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 flex-shrink-0"
            >
              {isPreviewCollapsed ? <FaEye /> : <FaEyeSlash />}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Form Area */}
          <div className={cn("space-y-6 transition-all duration-500", (currentStep === 9 || isPreviewCollapsed) ? "lg:col-span-12" : "lg:col-span-7")}>
            <Card className="p-0 border-slate-100 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
              <AnimatePresence mode="wait">

                {/* ─── STEP 1: Basic Details ─── */}
                {currentStep === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <Step1BasicDetails formData={formData} onChange={handleChange} />
                  </motion.div>
                )}

                {/* ─── STEP 2: Permissions ─── */}
                {currentStep === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <Step2Permissions formData={formData} onChange={handleChange} />
                  </motion.div>
                )}

                {/* ─── STEP 3: Schedule IX ─── */}
                {currentStep === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <Step3ScheduleIX formData={formData} onChange={handleChange} />
                  </motion.div>
                )}

                {/* ─── STEP 4: Income & Expenditure ─── */}
                {currentStep === 4 && (
                  <motion.div key="step4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <Step4IncomeExpenditure formData={formData} onChange={handleChange} />
                  </motion.div>
                )}

                {/* ─── STEP 5: Balance Sheet ─── */}
                {currentStep === 5 && (
                  <motion.div key="step5" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <Step5BalanceSheet formData={formData} onChange={handleChange} />
                  </motion.div>
                )}

                {/* ─── STEP 6: Receipt & Payment Account ─── */}
                {currentStep === 6 && (
                  <motion.div key="step6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <Step6ReceiptPayment formData={formData} onChange={handleChange} />
                  </motion.div>
                )}

                {/* ─── STEP 7: Schedule 9-D (अनुसूची नऊ - ड) ─── */}
                {currentStep === 7 && (
                  <motion.div key="step7" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <Step7Schedule9D formData={formData} onChange={handleChange} setFormData={setFormData} />
                  </motion.div>
                )}

                {/* ─── STEP 8: Delay Exemption (विलंब माफीचा अर्ज) ─── */}
                {currentStep === 8 && (
                  <motion.div key="step8" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <Step8DelayExemption formData={formData} onChange={handleChange} />
                  </motion.div>
                )}

                {/* ─── STEP 9: Preview & Save ─── */}
                {currentStep === 9 && (
                  <motion.div key="step9" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <Step9Preview formData={formData} />
                  </motion.div>
                )}

              </AnimatePresence>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              {currentStep > 1 ? (
                <button
                  onClick={handleBack}
                  className="px-8 py-3 rounded-2xl bg-blue-50 text-blue-600 font-bold flex items-center gap-2 hover:bg-blue-100 transition-all"
                >
                  <ChevronLeft size={20} />
                  Back
                </button>
              ) : (
                <div />
              )}
              {currentStep === 9 ? (
                <div className="flex items-center gap-4">
                  {isReportSaved && (
                    <button
                      onClick={handleDownloadPdf}
                      disabled={isDownloading}
                      className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/40 transition-all disabled:opacity-50"
                    >
                      <Download size={20} />
                      {isDownloading ? 'Generating...' : 'Download PDF'}
                    </button>
                  )}
                  <button
                    onClick={handleSaveReport}
                    className="px-10 py-3 rounded-2xl bg-green-600 text-white font-bold flex items-center gap-2 shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/40 transition-all"
                  >
                    Save Report
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-10 py-3 rounded-2xl gradient text-white font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Right: Live Preview */}
          {currentStep !== 9 && !isPreviewCollapsed && (
            <div className="lg:col-span-5 h-full">
              <LivePreview currentStep={currentStep} formData={debouncedFormData} zoom={zoom} setZoom={setZoom} />
            </div>
          )}
        </div>
      </main>

      {/* Premium Back to Top Button */}
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
              {/* Rotating Text */}
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

              {/* Central Button */}
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
