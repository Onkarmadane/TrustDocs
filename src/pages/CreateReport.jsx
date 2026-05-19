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

// Import subcomponents
import StepIndicator from '../components/auditreport/StepIndicator';
import UploadBox from '../components/auditreport/UploadBox';
import AccountingRow from '../components/auditreport/AccountingRow';
import BalanceSheetColumn from '../components/auditreport/BalanceSheetColumn';
import { steps } from '../components/auditreport/steps';
import Step9Preview from '../components/auditreport/Step9Preview';

import {
  permissionsQuestions,
  expenditureItems,
  incomeItems,
  fundsLiabilitiesItems,
  propertyAssetsItems,
  scheduleIXItems,
  receiptItems,
  paymentItems,
} from '../components/auditreport/reportData';


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
        <div className="w-full">
          <StepIndicator currentStep={currentStep} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Form Area */}
          <div className={cn("space-y-6", currentStep === 9 ? "lg:col-span-12" : "lg:col-span-7")}>
            <Card className="p-0 border-slate-100 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
              <AnimatePresence mode="wait">

                {/* ─── STEP 1: Basic Details ─── */}
                {currentStep === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8 p-10">
                    <div>
                      <h2 className="input-headings">Report Type</h2>
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
                      <h2 className="input-headings">Global Information</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                        <InputField name="trustName" label="Trust Name" placeholder="Enter" value={formData.trustName || ''} onChange={handleChange} />
                        <InputField name="registrationNo" label="Registration No" placeholder="Enter" value={formData.registrationNo || ''} onChange={handleChange} />
                        <InputField name="date" label="Date" placeholder="Select" type="date" value={formData.date || ''} onChange={handleChange} />
                        <InputField name="place" label="Place" placeholder="Enter Place" value={formData.place || ''} onChange={handleChange} />
                        <InputField name="financialYear" label="Financial Year" placeholder="2025-26" value={formData.financialYear || ''} onChange={handleChange} />
                        <div className="sm:col-span-2">
                          <InputField name="address" label="Address" placeholder="Enter" value={formData.address || ''} onChange={handleChange} />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-50">
                      <h2 className="input-headings">Upload Stamp & Signature</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
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
                  <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4 p-1">
                    {/* <h2 className="text-sm font-bold text-slate-800 mb-8 uppercase tracking-widest">Permissions & Disclosures</h2> */}
                    <div className="space-y-3">
                      {permissionsQuestions.map((question, i) => (
                        <div key={i} className="p-4 rounded-2xl border border-slate-50 bg-white/50 space-y-3 hover:border-blue-100 transition-colors">
                          <p className="text-[13px] text-slate-700 leading-relaxed font-medium">{question}</p>
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

                {/* ─── STEP 3: Schedule IX ─── */}
                {currentStep === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-1 space-y-4">
                    <div className="space-y-4">
                      {/* Income as shown */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white/50 gap-4">
                        <p className="text-xs font-bold text-slate-700">(I) Income as shown in the Income and Expenditure Account (Schedule IX)</p>
                        <InputField
                          name="sch_income_shown"
                          type="number"
                          value={formData.sch_income_shown || ''}
                          onChange={handleChange}
                          placeholder="0.00"
                          variant="default"
                          size="inline"
                          className="w-full sm:w-32"
                        />
                      </div>

                      {/* Deduction items */}
                      <div className="p-5 rounded-2xl border border-slate-50 bg-white/50 space-y-4">
                        <p className="text-xs font-bold text-slate-700">(II) Items not chargeable to contribution under Section 58 and Rules 32</p>
                        <div className="space-y-3 pl-4 border-l-2 border-blue-50">
                          {scheduleIXItems.map((item) => (
                            <div key={item.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 group">
                              <p className="text-[11px] text-slate-500 font-medium group-hover:text-slate-800 transition-colors flex-1">{item.label}</p>
                              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                                <InputField
                                  name={item.key}
                                  type="number"
                                  value={formData[item.key] || ''}
                                  onChange={handleChange}
                                  placeholder="0"
                                  variant="minimal"
                                  size="compact"
                                  className="w-full sm:w-28"
                                />
                                {/* <button className="p-1 text-slate-300 hover:text-slate-500 transition-colors opacity-0 group-hover:opacity-100">
                                  <MoreVertical size={12} />
                                </button> */}
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
                  </motion.div>
                )}

                {/* ─── STEP 4: Income & Expenditure ─── */}
                {currentStep === 4 && (
                  <motion.div key="step4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    {/* <div className="px-10 pt-10 pb-4">
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Step 4: Income & Expenditure A/C</h2>
                      <p className="text-[11px] text-black font-medium">Detailed accounting for the current financial year</p>
                    </div> */}
                    <div className="border-t border-slate-100 bg-white overflow-x-auto">
                      <div className="min-w-[750px]">
                        {/* Header */}
                        <div className="grid grid-cols-4 bg-slate-50/50 border-b border-slate-100">
                          <div className="p-4 text-center font-bold text-[10px] text-black uppercase tracking-widest border-r border-slate-100/50">Expenditure</div>
                          <div className="p-4 text-center font-bold text-[10px] text-black uppercase tracking-widest border-r border-slate-100/50">Amount</div>
                          <div className="p-4 text-center font-bold text-[10px] text-black uppercase tracking-widest border-r border-slate-100/50">Income</div>
                          <div className="p-4 text-center font-bold text-[10px] text-black uppercase tracking-widest">Amount</div>
                        </div>

                        {/* Body */}
                        <div className="grid grid-cols-2 divide-x divide-slate-100 bg-white">
                          {/* Expenditure Column */}
                          <div className="px-5 py-6 space-y-5">
                            {expenditureItems.map((item) => (
                              <AccountingRow key={item.key} item={item} formData={formData} onChange={handleChange} />
                            ))}
                          </div>

                          {/* Income Column */}
                          <div className="px-5 py-6 space-y-5">
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
                  </motion.div>
                )}

                {/* ─── STEP 5: Balance Sheet ─── */}
                {currentStep === 5 && (
                  <motion.div key="step5" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    {/* <div className="px-10 pt-10 pb-4">
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Step 5: Balance Sheet</h2>
                      <p className="text-[11px] text-black font-medium">Funds, Liabilities, Property & Assets statement</p>
                    </div> */}
                    <div className="border-t border-slate-100 bg-white overflow-x-auto">
                      <div className="min-w-[750px]">
                        {/* Header */}
                        <div className="grid grid-cols-4 bg-slate-50/50 border-b border-slate-100">
                          <div className="p-4 text-center font-bold text-[10px] text-black uppercase tracking-widest border-r border-slate-100/50">Funds & Liabilities</div>
                          <div className="p-4 text-center font-bold text-[10px] text-black uppercase tracking-widest border-r border-slate-100/50">Amount</div>
                          <div className="p-4 text-center font-bold text-[10px] text-black uppercase tracking-widest border-r border-slate-100/50">Property & Assets</div>
                          <div className="p-4 text-center font-bold text-[10px] text-black uppercase tracking-widest">Amount</div>
                        </div>

                        {/* Body */}
                        <div className="grid grid-cols-2 divide-x divide-slate-100 bg-white">
                          <BalanceSheetColumn
                            items={fundsLiabilitiesItems}
                            formData={formData}
                            onChange={handleChange}
                            colorClass="text-black"
                          // borderColor="border-blue-50"
                          />
                          <BalanceSheetColumn
                            items={propertyAssetsItems}
                            formData={formData}
                            onChange={handleChange}
                            colorClass="text-black"
                          // borderColor="border-indigo-50"
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
                    </div>
                  </motion.div>
                )}

                {/* ─── STEP 6: Receipt & Payment Account ─── */}
                {currentStep === 6 && (
                  <motion.div key="step6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <div className="px-10 pt-10 pb-4">
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Step 6: Receipt & Payment Account</h2>
                      <p className="text-[11px] text-black font-medium">Receipt and Payment details for the year</p>
                    </div>
                    <div className="border-t border-slate-100 bg-white overflow-x-auto">
                      <div className="min-w-[750px]">
                        {/* Header */}
                        <div className="grid grid-cols-4 bg-slate-50/50 border-b border-slate-100">
                          <div className="p-4 text-center font-bold text-[10px] text-black uppercase tracking-widest border-r border-slate-100/50">Receipt</div>
                          <div className="p-4 text-center font-bold text-[10px] text-black uppercase tracking-widest border-r border-slate-100/50">Amount</div>
                          <div className="p-4 text-center font-bold text-[10px] text-black uppercase tracking-widest border-r border-slate-100/50">Payments</div>
                          <div className="p-4 text-center font-bold text-[10px] text-black uppercase tracking-widest">Amount</div>
                        </div>

                        {/* Body */}
                        <div className="grid grid-cols-2 divide-x divide-slate-100 bg-white">
                          <div className="px-5 py-6 space-y-5">
                            {/* Receipt Items would normally use AccountingRow or similar, but since we updated reportData we should manually map or use BalanceSheetColumn logic if nested. Let's use BalanceSheetColumn logic as they have nested amounts. */}
                            <BalanceSheetColumn
                              items={receiptItems}
                              formData={formData}
                              onChange={handleChange}
                              colorClass="text-black"
                            // borderColor="border-emerald-50"
                            />
                          </div>
                          <div className="px-5 py-6 space-y-5">
                            <BalanceSheetColumn
                              items={paymentItems}
                              formData={formData}
                              onChange={handleChange}
                              colorClass="text-black"
                            // borderColor="border-rose-50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ─── STEP 7: Schedule 9-D (अनुसूची नऊ - ड) ─── */}
                {currentStep === 7 && (
                  <motion.div key="step7" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-10 space-y-8">
                    <div>
                      <h2 className="text-[11px] font-bold text-black mb-6 uppercase ">Schedule 9-D (अनुसूची नऊ - ड)</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                        <InputField name="sch9d_trustNameMarathi" label="संस्थेचे नाव (Trust Name)" placeholder="Enter in Marathi" value={formData.sch9d_trustNameMarathi || ''} onChange={handleChange} />
                        <InputField name="sch9d_registrationNoMarathi" label="नोंदणी क्रमांक (Reg No)" placeholder="Enter in Marathi" value={formData.sch9d_registrationNoMarathi || ''} onChange={handleChange} />
                        <InputField name="sch9d_financialYearMarathi" label="आर्थिक वर्ष (Financial Year)" placeholder="उदा. सन 2025-26" value={formData.sch9d_financialYearMarathi || ''} onChange={handleChange} />
                        <InputField name="sch9d_trustPan" label="विश्वस्त व्यवस्थेच्या स्थायी खाते क्रमांक (Trust PAN)" placeholder="Enter PAN" value={formData.sch9d_trustPan || ''} onChange={handleChange} />
                        <div className="sm:col-span-2">
                          <InputField name="sch9d_incomeTaxRegistration" label="12AA नोंदणी क्रमांक व दिनांक (12AA Reg Details)" placeholder="Enter Details" value={formData.sch9d_incomeTaxRegistration || ''} onChange={handleChange} />
                        </div>
                      </div>

                      {/* Previous 3 Years IT Returns */}
                      <div className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-[11px] font-bold text-black uppercase tracking-[0.1em]">आधीच्या तीन वर्षाचे आयकर विवरण (Prev IT Returns)</h3>
                          <button
                            type="button"
                            onClick={() => {
                              const current = formData.sch9d_previousITReturns || [];
                              setFormData(prev => ({
                                ...prev,
                                sch9d_previousITReturns: [...current, { receiptNo: '', year: '' }]
                              }));
                            }}
                            className="text-xs text-blue-600 font-bold hover:text-blue-700"
                          >
                            + Add More
                          </button>
                        </div>
                        <div className="space-y-3">
                          {(formData.sch9d_previousITReturns || [{ receiptNo: '', year: '' }]).map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                              <div className="col-span-1 hidden md:block text-center text-xs text-slate-500 pb-3">{index + 1}</div>
                              <div className="col-span-12 md:col-span-5">
                                <InputField
                                  name={`sch9d_it_receipt_${index}`}
                                  label="पोच पावती क्रमांक"
                                  placeholder="Receipt No"
                                  value={item.receiptNo}
                                  onChange={(e) => {
                                    const updated = [...(formData.sch9d_previousITReturns || [])];
                                    updated[index] = { ...updated[index], receiptNo: e.target.value };
                                    setFormData(prev => ({ ...prev, sch9d_previousITReturns: updated }));
                                  }}
                                />
                              </div>
                              <div className="col-span-12 md:col-span-5">
                                <InputField
                                  name={`sch9d_it_year_${index}`}
                                  label="वर्ष"
                                  placeholder="Year"
                                  value={item.year}
                                  onChange={(e) => {
                                    const updated = [...(formData.sch9d_previousITReturns || [])];
                                    updated[index] = { ...updated[index], year: e.target.value };
                                    setFormData(prev => ({ ...prev, sch9d_previousITReturns: updated }));
                                  }}
                                />
                              </div>
                              <div className="col-span-12 md:col-span-1 pb-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (formData.sch9d_previousITReturns || []).filter((_, i) => i !== index);
                                    setFormData(prev => ({ ...prev, sch9d_previousITReturns: updated }));
                                  }}
                                  className="text-red-500 hover:text-red-700 text-xs"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* All Trustees PAN */}
                      <div className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-[11px] font-bold text-black uppercase tracking-[0.1em]">सर्व विश्वस्तांचे स्थायी खाते क्रमांक (All Trustees PAN)</h3>
                          <button
                            type="button"
                            onClick={() => {
                              const current = formData.sch9d_trusteesPan || [];
                              setFormData(prev => ({
                                ...prev,
                                sch9d_trusteesPan: [...current, { name: '', pan: '' }]
                              }));
                            }}
                            className="text-xs text-blue-600 font-bold hover:text-blue-700"
                          >
                            + Add More
                          </button>
                        </div>
                        <div className="space-y-3">
                          {(formData.sch9d_trusteesPan || [{ name: '', pan: '' }]).map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                              <div className="col-span-1 hidden md:block text-center text-xs text-slate-500 pb-3">{index + 1}</div>
                              <div className="col-span-12 md:col-span-5">
                                <InputField
                                  name={`sch9d_trustee_name_${index}`}
                                  label="विश्वस्तांचे नांव"
                                  placeholder="Name"
                                  value={item.name}
                                  onChange={(e) => {
                                    const updated = [...(formData.sch9d_trusteesPan || [])];
                                    updated[index] = { ...updated[index], name: e.target.value };
                                    setFormData(prev => ({ ...prev, sch9d_trusteesPan: updated }));
                                  }}
                                />
                              </div>
                              <div className="col-span-12 md:col-span-5">
                                <InputField
                                  name={`sch9d_trustee_pan_${index}`}
                                  label="स्थायी खाते क्रमांक"
                                  placeholder="PAN"
                                  value={item.pan}
                                  onChange={(e) => {
                                    const updated = [...(formData.sch9d_trusteesPan || [])];
                                    updated[index] = { ...updated[index], pan: e.target.value };
                                    setFormData(prev => ({ ...prev, sch9d_trusteesPan: updated }));
                                  }}
                                />
                              </div>
                              <div className="col-span-12 md:col-span-1 pb-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (formData.sch9d_trusteesPan || []).filter((_, i) => i !== index);
                                    setFormData(prev => ({ ...prev, sch9d_trusteesPan: updated }));
                                  }}
                                  className="text-red-500 hover:text-red-700 text-xs"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ─── STEP 8: Delay Exemption (विलंब माफीचा अर्ज) ─── */}
                {currentStep === 8 && (
                  <motion.div key="step8" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-10 space-y-8">
                    <div>
                      <h2 className="text-[11px] font-bold text-black mb-6 uppercase ">Delay Exemption (विलंब माफीचा अर्ज)</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                        <InputField name="delay_applicantName" label="अर्जदाराचे नाव (Applicant Name)" placeholder="Enter Name" value={formData.delay_applicantName || ''} onChange={handleChange} />
                        <InputField name="delay_applicantAge" label="वय (Age)" placeholder="Enter Age" value={formData.delay_applicantAge || ''} onChange={handleChange} />
                        <InputField name="delay_applicantAddress" label="पत्ता (Address)" placeholder="Enter Address" value={formData.delay_applicantAddress || ''} onChange={handleChange} />
                        <InputField name="delay_designation" label="हुद्दा (Designation)" placeholder="विश्वस्त / सचिव / अध्यक्ष" value={formData.delay_designation || ''} onChange={handleChange} />
                        <InputField name="delay_trustRegistrationDate" label="न्यास नोंदणी दिनांक (Trust Reg Date)" type="date" placeholder="Date" value={formData.delay_trustRegistrationDate || ''} onChange={handleChange} />
                        <InputField name="delay_financialYearMarathi" label="आर्थिक वर्ष (Financial Year for delay)" placeholder="2023-24" value={formData.delay_financialYearMarathi || ''} onChange={handleChange} />
                        <InputField name="delay_place" label="स्थळ (Place)" placeholder="जालना" value={formData.delay_place || ''} onChange={handleChange} />
                        <InputField name="delay_date" label="दिनांक (Date)" placeholder="Date" type="date" value={formData.delay_date || ''} onChange={handleChange} />
                      </div>
                    </div>
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
          {currentStep !== 9 && (
            <LivePreview currentStep={currentStep} formData={debouncedFormData} zoom={zoom} setZoom={setZoom} />
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
