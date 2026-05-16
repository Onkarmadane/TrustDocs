import React, { useState, useCallback, useEffect, useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import Card from '../components/ui/Card';
import { InputField, RadioGroup, SelectField } from '../components/ui/FormFields';
import { ChevronLeft, ChevronRight, MoreVertical, Search, Maximize2, Upload, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';
import LivePreview from '../components/auditreport/LivePreview';
import { reportService } from '../services/reportService';
import { mapFormDataToBackendPayload } from '../utils/reportMapper';

// Import subcomponents
import StepIndicator from '../components/auditreport/StepIndicator';
import UploadBox from '../components/auditreport/UploadBox';
import AccountingRow from '../components/auditreport/AccountingRow';
import BalanceSheetColumn from '../components/auditreport/BalanceSheetColumn';
import { steps } from '../components/auditreport/steps';

import {
  permissionsQuestions,
  expenditureItems,
  incomeItems,
  fundsLiabilitiesItems,
  propertyAssetsItems,
  scheduleIXItems,
} from '../components/auditreport/reportData';






/*                    MAIN COMPONENT                      */

const CreateReport = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [subStep, setSubStep] = useState(1); // For Step 3 (3.1 and 3.2)
  const [formData, setFormData] = useState({});
  const [zoom, setZoom] = useState(100);
  const [reportId, setReportId] = useState(null);
  const [isReportSaved, setIsReportSaved] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const lastSavedData = useRef({});
  const formDataRef = useRef(formData);
  const currentStepRef = useRef(currentStep);
  const reportIdRef = useRef(reportId);

  useEffect(() => {
    formDataRef.current = formData;
    currentStepRef.current = currentStep;
    reportIdRef.current = reportId;
  }, [formData, currentStep, reportId]);

  const saveDraft = async () => {
    const currentData = formDataRef.current;
    const step = currentStepRef.current;
    const id = reportIdRef.current;

    if (Object.keys(currentData).length === 0) return;
    if (JSON.stringify(currentData) === JSON.stringify(lastSavedData.current)) return;

    try {
      const payload = mapFormDataToBackendPayload(currentData, step, 'draft');

      if (!id) {
        const result = await reportService.createReport(payload);
        if (result.success && result.data?._id) {
          setReportId(result.data._id);
          lastSavedData.current = currentData;
          console.log('Background Saved (Created Draft):', result.data._id);
        }
      } else {
        const result = await reportService.updateReport(id, payload);
        if (result.success) {
          lastSavedData.current = currentData;
          console.log('Background Saved (Updated Draft):', id);
        }
      }
    } catch (err) {
      console.error('Background save failed:', err);
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleImageUpload = async (file, key) => {
    try {
      const result = await reportService.uploadImage(file);
      if (result.success && result.data?.url) {
        setFormData(prev => ({ ...prev, [key]: result.data.url }));
        toast.success('Image uploaded');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleNext = () => {
    saveDraft();
    if (currentStep === 3 && subStep === 1) {
      setSubStep(2);
    } else {
      setCurrentStep(prev => Math.min(4, prev + 1));
      if (currentStep === 2) setSubStep(1); // Reset subStep when entering Step 3
    }
  };

  const handleBack = () => {
    if (currentStep === 3 && subStep === 2) {
      setSubStep(1);
    } else {
      setCurrentStep(prev => Math.max(1, prev - 1));
      if (currentStep === 4) setSubStep(2); // Coming back to Step 3 from 4
    }
  };

  // Calculate totals for step 3
  const expTotal = Object.entries(formData).filter(([k]) => k.startsWith('exp_')).reduce((s, [, v]) => s + (parseFloat(v) || 0), 0);
  const incTotal = Object.entries(formData).filter(([k]) => k.startsWith('inc_')).reduce((s, [, v]) => s + (parseFloat(v) || 0), 0);

  // Calculate totals for step 4
  const flTotal = Object.entries(formData).filter(([k]) => k.startsWith('fl_')).reduce((s, [, v]) => s + (parseFloat(v) || 0), 0);
  const paTotal = Object.entries(formData).filter(([k]) => k.startsWith('pa_')).reduce((s, [, v]) => s + (parseFloat(v) || 0), 0);

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
    if (!reportId) {
      toast.error("Please save the report first");
      return;
    }

    setIsDownloading(true);
    try {
      const blob = await reportService.downloadPdf(reportId);
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
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-8 pt-8 space-y-8">
        {/* Header Row: Steps + Live Preview Header */}
        <div className="grid grid-cols-12 gap-8 items-center">
          <div className="col-span-7">
            <StepIndicator currentStep={currentStep} />
          </div>
          <div className="col-span-5 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Live Preview</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                A4 — Real Time
              </p>
            </div>
            <div className="flex items-center gap-1 bg-white/80 p-1.5 rounded-2xl border border-slate-100 shadow-sm backdrop-blur-md">
              <button
                onClick={() => setZoom(prev => Math.max(30, prev - 10))}
                className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all active:scale-95"
                title="Zoom Out"
              >
                <Search size={14} className="scale-x-[-1]" />
              </button>
              <div className="w-14 text-center">
                <span className="text-[10px] font-bold text-slate-600 tabular-nums">{zoom}%</span>
              </div>
              <button
                onClick={() => setZoom(prev => Math.min(250, prev + 10))}
                className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all active:scale-95"
                title="Zoom In"
              >
                <Search size={14} />
              </button>
              <div className="w-px h-4 bg-slate-100 mx-1" />
              <button
                onClick={() => setZoom(100)}
                className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all active:scale-95"
                title="Reset Zoom"
              >
                <Maximize2 size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Form Area */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-0 border-slate-100 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
              <AnimatePresence mode="wait">

                {/* ─── STEP 1: Basic Details ─── */}
                {currentStep === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8 p-10">
                    <div>
                      <h2 className="text-[11px] font-bold text-slate-400 mb-6 uppercase tracking-[0.2em]">Report Type</h2>
                      <SelectField
                        name="reportType"
                        value={formData.reportType || ''}
                        onChange={handleChange}
                        options={[
                          { value: 'audit', label: 'Annual Audit Report' },
                          { value: 'donation', label: 'Donation Report' },
                        ]}
                        placeholder="Select"
                      />
                    </div>

                    <div>
                      <h2 className="text-[11px] font-bold text-slate-400 mb-6 uppercase tracking-[0.2em]">Global Information</h2>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                        <InputField name="trustName" label="Trust Name" placeholder="Enter" value={formData.trustName || ''} onChange={handleChange} />
                        <InputField name="registrationNo" label="Registration No" placeholder="Enter" value={formData.registrationNo || ''} onChange={handleChange} />
                        <InputField name="date" label="Date" placeholder="Select" type="date" value={formData.date || ''} onChange={handleChange} />
                        <InputField name="financialYear" label="Financial Year" placeholder="2025-26" value={formData.financialYear || ''} onChange={handleChange} />
                        <div className="col-span-2">
                          <InputField name="address" label="Address" placeholder="Enter" value={formData.address || ''} onChange={handleChange} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-50">
                      <h2 className="text-[11px] font-bold text-slate-400 mb-6 uppercase tracking-[0.2em]">Upload Stamp & Signature</h2>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                        <UploadBox
                          label="Signature 1"
                          value={formData.signature_1}
                          onUpload={(file) => handleImageUpload(file, 'signature_1')}
                        />
                        <UploadBox
                          label="Stamp 1"
                          value={formData.stamp_1}
                          onUpload={(file) => handleImageUpload(file, 'stamp_1')}
                        />
                        <UploadBox
                          label="Signature 2"
                          value={formData.signature_2}
                          onUpload={(file) => handleImageUpload(file, 'signature_2')}
                        />
                        <UploadBox
                          label="Stamp 2"
                          value={formData.stamp_2}
                          onUpload={(file) => handleImageUpload(file, 'stamp_2')}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ─── STEP 2: Permissions ─── */}
                {currentStep === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4 p-10">
                    {/* <h2 className="text-sm font-bold text-slate-800 mb-8 uppercase tracking-widest">Permissions & Disclosures</h2> */}
                    <div className="space-y-3">
                      {permissionsQuestions.map((question, i) => (
                        <div key={i} className="p-4 rounded-2xl border border-slate-50 bg-white/50 space-y-3 hover:border-blue-100 transition-colors">
                          <p className="text-sm text-slate-700 leading-relaxed font-medium">{question}</p>
                          <RadioGroup
                            name={`perm_${i}`}
                            value={formData[`perm_${i}`] || ''}
                            onChange={handleChange}
                            options={[
                              { value: 'yes', label: 'Yes' },
                              { value: 'no', label: 'No' },
                            ]}
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ─── STEP 3: Schedule IX + Income & Expenditure (Split into sub-steps) ─── */}
                {currentStep === 3 && (
                  <motion.div key={`step3-${subStep}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">

                    {subStep === 1 && (
                      <div className="animate-in fade-in slide-in-from-left-4 duration-500 p-10">
                        {/* <h2 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-widest">Step 3.1: Schedule IX — Statement of Income</h2>
                        <p className="text-[11px] text-slate-400 font-medium mb-6">Items not chargeable to contribution under Section 58 and Rules 32</p> */}

                        <div className="space-y-4">
                          {/* Income as shown */}
                          <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white/50">
                            <p className="text-xs font-bold text-slate-700">(I) Income as shown in the Income and Expenditure Account (Schedule IX)</p>
                            <InputField
                              name="sch_income_shown"
                              type="number"
                              value={formData.sch_income_shown || ''}
                              onChange={handleChange}
                              placeholder="0.00"
                              variant="default"
                              size="inline"
                              className="w-32"
                            />
                          </div>

                          {/* Deduction items */}
                          <div className="p-5 rounded-2xl border border-slate-50 bg-white/50 space-y-4">
                            <p className="text-xs font-bold text-slate-700">(II) Items not chargeable to contribution under Section 58 and Rules 32</p>
                            <div className="space-y-3 pl-4 border-l-2 border-blue-50">
                              {scheduleIXItems.map((item) => (
                                <div key={item.key} className="flex items-center justify-between gap-4 group">
                                  <p className="text-[11px] text-slate-500 font-medium group-hover:text-slate-800 transition-colors flex-1">{item.label}</p>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <InputField
                                      name={item.key}
                                      type="number"
                                      value={formData[item.key] || ''}
                                      onChange={handleChange}
                                      placeholder="0"
                                      variant="minimal"
                                      size="compact"
                                      className="w-28"
                                    />
                                    <button className="p-1 text-slate-300 hover:text-slate-500 transition-colors opacity-0 group-hover:opacity-100">
                                      <MoreVertical size={12} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Gross Annual Income */}
                          <div className="flex items-center justify-between p-4 rounded-2xl border border-blue-100 bg-blue-50/30">
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Gross Annual Income chargeable to contribution Rs.</p>
                            <span className="text-xs font-bold text-blue-600 font-mono w-32 text-right">
                              {(() => {
                                const gross = parseFloat(formData.sch_income_shown || 0);
                                const deductions = scheduleIXItems.reduce((s, item) => s + (parseFloat(formData[item.key]) || 0), 0);
                                const net = gross - deductions;
                                return net > 0 ? net.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00';
                              })()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {subStep === 2 && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="px-10 pt-10 pb-4">
                          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Step 3.2: Income & Expenditure A/C</h2>
                          <p className="text-[11px] text-slate-400 font-medium">Detailed accounting for the current financial year</p>
                        </div>
                        <div className="border-t border-slate-100 bg-white">
                          {/* Header */}
                          <div className="grid grid-cols-4 bg-slate-50/50 border-b border-slate-100">
                            <div className="p-4 text-center font-bold text-[10px] text-slate-400 uppercase tracking-widest border-r border-slate-100/50">Expenditure</div>
                            <div className="p-4 text-center font-bold text-[10px] text-slate-400 uppercase tracking-widest border-r border-slate-100/50">Amount</div>
                            <div className="p-4 text-center font-bold text-[10px] text-slate-400 uppercase tracking-widest border-r border-slate-100/50">Income</div>
                            <div className="p-4 text-center font-bold text-[10px] text-slate-400 uppercase tracking-widest">Amount</div>
                          </div>

                          {/* Body */}
                          <div className="grid grid-cols-2 divide-x divide-slate-100 bg-white">
                            {/* Expenditure Column */}
                            <div className="px-10 py-6 space-y-5">
                              {expenditureItems.map((item) => (
                                <AccountingRow key={item.key} item={item} formData={formData} onChange={handleChange} />
                              ))}
                            </div>

                            {/* Income Column */}
                            <div className="px-10 py-6 space-y-5">
                              {incomeItems.map((item) => (
                                <AccountingRow key={item.key} item={item} formData={formData} onChange={handleChange} />
                              ))}
                            </div>
                          </div>

                          {/* Footer Totals */}
                          <div className="grid grid-cols-4 border-t-2 border-blue-100 bg-blue-50/30">
                            <div className="p-4 flex items-center px-5 border-r border-blue-100">
                              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Total</span>
                            </div>
                            <div className="p-4 flex items-center justify-end px-5 border-r border-blue-100">
                              <span className="text-xs font-bold text-blue-700 font-mono">{expTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="p-4 flex items-center px-5 border-r border-blue-100">
                              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Total</span>
                            </div>
                            <div className="p-4 flex items-center justify-end px-5">
                              <span className="text-xs font-bold text-blue-700 font-mono">{incTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </motion.div>
                )}

                {/* ─── STEP 4: Balance Sheet ─── */}
                {currentStep === 4 && (
                  <motion.div key="step4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <div className="px-10 pt-10 pb-4">
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Step 4: Balance Sheet</h2>
                      <p className="text-[11px] text-slate-400 font-medium">Funds, Liabilities, Property & Assets statement</p>
                    </div>
                    <div className="border-t border-slate-100 bg-white">
                      {/* Header */}
                      <div className="grid grid-cols-4 bg-slate-50/50 border-b border-slate-100">
                        <div className="p-4 text-center font-bold text-[10px] text-slate-400 uppercase tracking-widest border-r border-slate-100/50">Funds & Liabilities</div>
                        <div className="p-4 text-center font-bold text-[10px] text-slate-400 uppercase tracking-widest border-r border-slate-100/50">Amount</div>
                        <div className="p-4 text-center font-bold text-[10px] text-slate-400 uppercase tracking-widest border-r border-slate-100/50">Property & Assets</div>
                        <div className="p-4 text-center font-bold text-[10px] text-slate-400 uppercase tracking-widest">Amount</div>
                      </div>

                      {/* Body */}
                      <div className="grid grid-cols-2 divide-x divide-slate-100 bg-white">
                        <BalanceSheetColumn
                          items={fundsLiabilitiesItems}
                          formData={formData}
                          onChange={handleChange}
                          colorClass="text-blue-600"
                          borderColor="border-blue-50"
                        />
                        <BalanceSheetColumn
                          items={propertyAssetsItems}
                          formData={formData}
                          onChange={handleChange}
                          colorClass="text-indigo-600"
                          borderColor="border-indigo-50"
                        />
                      </div>

                      {/* Footer Totals */}
                      <div className="grid grid-cols-4 border-t border-slate-100 bg-slate-50/30">
                        <div className="p-5 flex items-center px-10 border-r border-slate-100/50">
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Total</span>
                        </div>
                        <div className="p-5 flex items-center justify-end px-10 border-r border-slate-100/50">
                          <span className="text-xs font-bold text-blue-700 font-mono">{flTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="p-5 flex items-center px-10 border-r border-slate-100/50">
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Total</span>
                        </div>
                        <div className="p-5 flex items-center justify-end px-10">
                          <span className="text-xs font-bold text-blue-700 font-mono">{paTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={handleBack}
                className="px-8 py-3 rounded-2xl bg-blue-50 text-blue-600 font-bold flex items-center gap-2 hover:bg-blue-100 transition-all"
              >
                <ChevronLeft size={20} />
                Back
              </button>
              {currentStep === 4 ? (
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
          <LivePreview currentStep={currentStep} subStep={subStep} formData={formData} zoom={zoom} setZoom={setZoom} />
        </div>
      </main>
    </div>
  );
};

export default CreateReport;
