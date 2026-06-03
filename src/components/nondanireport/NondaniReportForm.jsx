import React, { useState, useEffect, useRef } from 'react';
import Card from '../ui/Card';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import useDocumentTitle from '../../utils/useDocumentTitle';
import StepIndicator from '../auditreport/StepIndicator';
import { useLocation, useNavigate } from 'react-router-dom';

import { nondaniReportService } from '../../services/nondaniReportService';

import Step1BasicDetails from './Step1BasicDetails';
import Step2Documents from './Step2Documents';
import Step3Preview from './Step3Preview';
import LivePreview from './LivePreview';

const steps = [
  { id: 1, title: 'Basic Details' },
  { id: 2, title: 'Documents Checklist' },
  { id: 3, title: 'Preview & Submit' }
];

const NondaniReportForm = ({ reportType, setReportType }) => {
  useDocumentTitle('Create Nondani Report');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [reportId, setReportId] = useState(null);
  const [isReportSaved, setIsReportSaved] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);
  const [zoom, setZoom] = useState(100);

  const lastSavedData = useRef({});
  const formDataRef = useRef(formData);
  const currentStepRef = useRef(currentStep);
  const reportIdRef = useRef(reportId);

  useEffect(() => {
    formDataRef.current = formData;
    currentStepRef.current = currentStep;
    reportIdRef.current = reportId;
  }, [formData, currentStep, reportId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const saveDraft = async (data, status = 'draft') => {
    const currentData = data || formDataRef.current;
    const step = currentStepRef.current;
    const id = reportIdRef.current;

    if (Object.keys(currentData).length === 0) return id;

    try {
      const payload = { ...currentData, currentStep: step, status };

      if (!id) {
        const result = await nondaniReportService.createReport(payload);
        if (result.success && result.data?._id) {
          setReportId(result.data._id);
          lastSavedData.current = currentData;
          return result.data._id;
        }
      } else {
        const result = await nondaniReportService.updateReport(id, payload);
        if (result.success) {
          lastSavedData.current = currentData;
        }
        return id;
      }
    } catch (error) {
      console.error('Save Draft Error:', error);
      toast.error('Failed to save progress automatically');
    }
    return id;
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      saveDraft(formData);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinalSubmit = async () => {
    const toastId = toast.loading('Finalizing report...');
    try {
      await saveDraft(formData, 'completed');
      setIsReportSaved(true);
      toast.success('Report saved successfully!', { id: toastId });
    } catch (error) {
      toast.error('Failed to save report', { id: toastId });
    }
  };

  const handleDownloadPdf = async () => {
    if (!reportId) {
      toast.error('Please save the report first.');
      return;
    }
    const toastId = toast.loading('Generating PDF...');
    setIsDownloading(true);
    try {
      const response = await nondaniReportService.downloadPdf(reportId);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Nondani_Report_${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success('PDF Downloaded successfully!', { id: toastId });
    } catch (error) {
      toast.error('Failed to generate PDF', { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('trust_addr_')) {
      const field = name.replace('trust_addr_', '');
      setFormData(prev => ({
        ...prev,
        trustDetails: {
          ...(prev.trustDetails || {}),
          address: {
            ...((prev.trustDetails || {}).address || {}),
            [field]: value,
          }
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicDetails formData={formData} onChange={handleInputChange} reportType={reportType} setReportType={setReportType} />;
      case 2:
        return <Step2Documents formData={formData} setFormData={setFormData} />;
      case 3:
        return <Step3Preview formData={formData} />;
      default:
        return <Step1BasicDetails formData={formData} onChange={handleInputChange} reportType={reportType} setReportType={setReportType} />;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <main className="max-w-[1600px] mx-auto px-4 md:px-8 pt-8 space-y-8">
        <div className="w-full flex justify-between items-center">
          <div className="flex-1">
            <StepIndicator currentStep={currentStep} steps={steps} />
          </div>
          {currentStep !== 3 && (
            <button
              onClick={() => setIsPreviewCollapsed(!isPreviewCollapsed)}
              className="ml-4 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 flex-shrink-0"
            >
              {isPreviewCollapsed ? <FaEye /> : <FaEyeSlash />}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className={cn("space-y-6 transition-all duration-500", (currentStep === 3 || isPreviewCollapsed) ? "lg:col-span-12" : "lg:col-span-7")}>
            <Card className="p-0 border-slate-100 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="min-h-[400px]">
                {renderStep()}
              </div>

              <div className="border-t border-slate-100 p-4 sm:p-6 bg-slate-50/50 rounded-b-2xl">
                <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                  <button
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                    className="w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </button>
                  
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {currentStep === steps.length ? (
                      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button
                          onClick={handleFinalSubmit}
                          disabled={isReportSaved}
                          className={cn(
                            "w-full sm:w-auto px-8 py-2.5 flex items-center justify-center gap-2 text-white font-medium rounded-xl transition-colors shadow-sm",
                            isReportSaved ? "bg-green-500 hover:bg-green-600 cursor-default" : "bg-indigo-600 hover:bg-indigo-700"
                          )}
                        >
                          {isReportSaved ? 'Saved Successfully' : 'Save Report'}
                        </button>
                        
                        {(isReportSaved || reportId) && (
                          <button
                            onClick={handleDownloadPdf}
                            disabled={isDownloading}
                            className="w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2 bg-slate-800 text-white font-medium hover:bg-slate-900 rounded-xl transition-colors shadow-sm disabled:opacity-70"
                          >
                            <Download className="w-5 h-5" />
                            {isDownloading ? 'Generating...' : 'Download PDF'}
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="w-full sm:w-auto px-8 py-2.5 flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
                      >
                        Next Step
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Right: Live Preview */}
          {currentStep !== 3 && !isPreviewCollapsed && (
            <div className="lg:col-span-5 h-full">
              <LivePreview currentStep={currentStep} formData={formData} zoom={zoom} setZoom={setZoom} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NondaniReportForm;
