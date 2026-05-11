import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Card from '../components/ui/Card';
import { ChevronRight, ChevronLeft, Upload, Search, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const steps = [
  { id: 1, name: 'Basic Details' },
  { id: 2, name: 'Permissions' },
  { id: 3, name: 'Income & Expenditure' },
  { id: 4, name: 'Balance Sheet' },
  { id: 5, name: 'Receipt & Payment Account' },
  { id: 6, name: 'Preview & Save' },
];

const StepIndicator = ({ currentStep }) => (
  <div className="flex items-center justify-between max-w-4xl mx-auto mb-12">
    {steps.map((step, index) => (
      <div key={step.id} className="flex flex-col items-center relative flex-1">
        {/* Line */}
        {index < steps.length - 1 && (
          <div className={cn(
            "absolute top-5 left-[60%] right-[-40%] h-[2px] transition-colors duration-500",
            currentStep > step.id ? "bg-blue-600" : "bg-slate-200"
          )} />
        )}
        
        {/* Circle */}
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 z-10",
          currentStep === step.id ? "gradient text-white shadow-lg shadow-blue-500/40 scale-110" : 
          currentStep > step.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
        )}>
          {step.id}
        </div>
        
        {/* Label */}
        <span className={cn(
          "mt-3 text-[10px] font-bold uppercase tracking-wider text-center max-w-[80px]",
          currentStep === step.id ? "text-blue-600" : "text-slate-400"
        )}>
          {step.name}
        </span>
      </div>
    ))}
  </div>
);

const InputField = ({ label, placeholder, type = "text", icon: Icon }) => (
  <div className="relative group">
    <label className="absolute -top-2.5 left-4 px-2 bg-white text-[11px] font-bold text-slate-400 group-focus-within:text-blue-600 transition-colors">
      {label}
    </label>
    <div className="flex items-center">
      <input 
        type={type}
        placeholder={placeholder}
        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
      />
      {Icon && <Icon size={18} className="absolute right-4 text-slate-300" />}
    </div>
  </div>
);

const UploadBox = ({ label }) => (
  <div className="flex-1">
    <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wide">{label}</label>
    <div className="border-2 border-dashed border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-slate-50 hover:border-blue-200 transition-all cursor-pointer group h-32 relative overflow-hidden">
      <Upload size={24} className="text-slate-300 mb-2 group-hover:text-blue-500 transition-colors" />
      <span className="text-[11px] font-bold text-slate-400 group-hover:text-blue-500 uppercase">Upload</span>
      <div className="absolute right-4 bottom-4 text-blue-500/20 group-hover:text-blue-500/40 transition-colors">
         <Maximize2 size={16} />
      </div>
    </div>
  </div>
);

const CreateReport = () => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <main className="max-w-[1600px] mx-auto px-8 pt-8">
        <StepIndicator currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Form Area */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-10 border-slate-100 bg-white/40">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-10"
                  >
                    <div>
                      <h2 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-widest">Report Type</h2>
                      <div className="relative">
                         <select className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none">
                            <option>Select</option>
                            <option>Audit Report</option>
                            <option>Non-Dini Register</option>
                         </select>
                         <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ChevronRight size={20} className="text-slate-400 rotate-90" />
                         </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-widest">Global Information</h2>
                      <div className="grid grid-cols-2 gap-6">
                        <InputField label="Trust Name" placeholder="Enter" />
                        <InputField label="Registration No" placeholder="Enter" />
                        <InputField label="Date" placeholder="Select" />
                        <InputField label="Financial Year" placeholder="2025-26" />
                        <div className="col-span-2">
                           <InputField label="Address" placeholder="Enter" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-widest">Upload Stamp & Signature</h2>
                      <div className="grid grid-cols-2 gap-8">
                        <UploadBox label="Signature 1" />
                        <UploadBox label="Stamp 1" />
                        <UploadBox label="Signature 2" />
                        <UploadBox label="Stamp 2" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <h2 className="text-sm font-bold text-slate-800 mb-8 uppercase tracking-widest">Permissions & Disclosures</h2>
                    {[
                      "(a) Whether accounts are maintained regularly and in accordance with the provisions of the Act and the rules...",
                      "(b) Whether receipts and disbursements are properly and correctly shown in the accounts",
                      "(c) Whether the cash balance and vouchers in the custody of the manager or trustee on the date of audit were in agreement with the accounts",
                      "(d) Whether all books, deeds, accounts, vouchers and other documents or records required by the auditor were produced before him",
                    ].map((question, i) => (
                      <div key={i} className="p-4 rounded-2xl border border-slate-50 bg-white/50 space-y-4">
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">{question}</p>
                        <div className="flex gap-6">
                           <label className="flex items-center gap-2 cursor-pointer group">
                              <input type="radio" name={`q-${i}`} className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
                              <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600 transition-colors">Yes</span>
                           </label>
                           <label className="flex items-center gap-2 cursor-pointer group">
                              <input type="radio" name={`q-${i}`} className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
                              <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600 transition-colors">No</span>
                           </label>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                  >
                    <h2 className="text-sm font-bold text-slate-800 mb-8 uppercase tracking-widest">Income & Expenditure Account (Schedule IX)</h2>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4 scrollbar-hide">
                       <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-white/50">
                          <p className="text-xs font-bold text-slate-700">(I) Income as shown in the income and Expenditure Account (Schedule IX)</p>
                          <input type="number" className="w-32 px-4 py-2 rounded-xl border border-slate-100 text-right text-xs font-bold" placeholder="0.00" />
                       </div>
                       <div className="p-6 rounded-2xl border border-slate-50 bg-white/50 space-y-4">
                          <p className="text-xs font-bold text-slate-700">(II) Items not chargeable to contribution under Section 58 and Rules 32</p>
                          <div className="space-y-4 pl-4 border-l-2 border-blue-50">
                             {[
                               "i) Grants received from Government and local authorities",
                               "ii) Interest on Sinking or Depreciation Fund",
                               "iii) Amount spent for the purpose of secular education.",
                               "iv) Amount spent for the purpose of medical relief",
                               "v) Amount spent for the purpose of veterinary treatment of animals",
                               "vi) Expenditure incurred from donations for relief of distress caused by scarcity, drought, flood, fire or other natural calamity",
                               "vii) Deductions out of income from lands used for agricultural purposes",
                               "viii) Deductions out of income from lands used for non-agricultural purposes",
                               "ix) Cost of production, if lands are cultivated by Trust",
                               "x) Deductions out of income from securities, stocks etc. at 1% of such income",
                               "xi) Deduction on account of repairs in respect of building not rented and yielding no income at 10% of the estimated gross annual rent",
                             ].map((item, i) => (
                               <div key={i} className="flex items-center justify-between gap-6 group">
                                  <p className="text-[11px] text-slate-500 font-medium group-hover:text-slate-800 transition-colors">{item}</p>
                                  <div className="flex items-center gap-2">
                                     <input type="number" className="w-28 px-3 py-1.5 rounded-lg border border-slate-100 text-right text-[11px] font-bold focus:ring-2 focus:ring-blue-500/20 outline-none" placeholder="0" />
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                       <div className="flex items-center justify-between p-4 rounded-2xl border border-blue-100 bg-blue-50/30">
                          <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Gross Annual Income chargeable to contribution Rs.</p>
                          <input type="number" className="w-32 px-4 py-2 rounded-xl border border-blue-200 bg-white text-right text-xs font-bold text-blue-600" placeholder="0.00" readOnly />
                       </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                  >
                    <h2 className="text-sm font-bold text-slate-800 mb-8 uppercase tracking-widest">Balance Sheet</h2>
                    <div className="rounded-2xl overflow-hidden border border-slate-100 bg-white shadow-sm max-h-[60vh] overflow-y-auto scrollbar-hide">
                      <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-100">
                         <div className="p-4 text-center font-bold text-[10px] text-slate-500 uppercase tracking-widest border-r border-slate-100">Expenditure</div>
                         <div className="p-4 text-center font-bold text-[10px] text-slate-500 uppercase tracking-widest">Income</div>
                      </div>
                      
                      <div className="grid grid-cols-2 divide-x divide-slate-100 min-h-[500px]">
                         {/* Left: Expenditure */}
                         <div className="p-6 space-y-6">
                            {[
                               "To Expenditure in respect of properties",
                               "To Establishment Expenses",
                               "To Remuneration to Trustees",
                               "To Remuneration (in the case of a math) to the head of the math, including his household expenditure if any",
                               "To Legal Fees",
                               "To Audit Fees",
                               "To Contribution and Fees",
                               "To Amount written off :- (a) Bad Debts (b) Loan Scholarship (c) Irrecoverable Rents (d) Other items",
                               "To Miscellaneous Expenses",
                               "To Depreciation",
                               "To Amount transferred to Reserve or Specific Funds",
                            ].map((label, i) => (
                               <div key={i} className="flex flex-col gap-2">
                                  <p className="text-[10px] font-bold text-slate-700 leading-relaxed">{label}</p>
                                  <input type="number" className="w-full px-3 py-2 rounded-lg border border-slate-50 bg-slate-50/30 text-right text-[10px] font-bold focus:bg-white transition-all" placeholder="0" />
                               </div>
                            ))}
                         </div>

                         {/* Right: Income */}
                         <div className="p-6 space-y-6">
                            {[
                               "By Rent (accrued / realized)",
                               "By Interest (accrued / realized)",
                               "By Dividend",
                               "By Donations in Cash or Kind",
                               "By Grants",
                               "By Income from other sources",
                               "By Transfer from Reserve",
                               "By Deficit carried over to Balance Sheet",
                            ].map((label, i) => (
                               <div key={i} className="flex flex-col gap-2">
                                  <p className="text-[10px] font-bold text-slate-700 leading-relaxed">{label}</p>
                                  <input type="number" className="w-full px-3 py-2 rounded-lg border border-slate-50 bg-slate-50/30 text-right text-[10px] font-bold focus:bg-white transition-all" placeholder="0" />
                               </div>
                            ))}
                         </div>
                      </div>
                      
                      {/* Footer Totals */}
                      <div className="grid grid-cols-2 border-t border-slate-100 bg-slate-50/50">
                         <div className="p-4 flex justify-between items-center px-6 border-r border-slate-100">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Total</span>
                            <span className="text-xs font-bold text-slate-800">123456</span>
                         </div>
                         <div className="p-4 flex justify-between items-center px-6">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Total</span>
                            <span className="text-xs font-bold text-slate-800">123456</span>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                  >
                    <h2 className="text-sm font-bold text-slate-800 mb-8 uppercase tracking-widest">Receipt & Payment Account</h2>
                    <div className="rounded-2xl overflow-hidden border border-slate-100 bg-white shadow-sm max-h-[60vh] overflow-y-auto scrollbar-hide">
                      <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-100">
                         <div className="p-4 text-center font-bold text-[10px] text-slate-500 uppercase tracking-widest border-r border-slate-100">Funds & Liabilities</div>
                         <div className="p-4 text-center font-bold text-[10px] text-slate-500 uppercase tracking-widest">Property & Assets</div>
                      </div>
                      
                      <div className="grid grid-cols-2 divide-x divide-slate-100 min-h-[500px]">
                         <div className="p-6 space-y-6">
                            {[
                               "Trust Funds or Corpus",
                               "Other Earmarked Funds",
                               "Loans (Secured or Unsecured)",
                               "Liabilities",
                               "Income and Expenditure",
                            ].map((label, i) => (
                               <div key={i} className="space-y-3">
                                  <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wide border-b border-blue-50 pb-1">{label}</p>
                                  <div className="flex gap-2">
                                     <input type="number" className="flex-1 px-3 py-2 rounded-lg border border-slate-50 bg-slate-50/30 text-right text-[10px] font-bold" placeholder="Amount" />
                                     <input type="number" className="flex-1 px-3 py-2 rounded-lg border border-slate-50 bg-slate-50/30 text-right text-[10px] font-bold" placeholder="Total" />
                                  </div>
                               </div>
                            ))}
                         </div>

                         <div className="p-6 space-y-6">
                            {[
                               "Immovable Properties",
                               "Investments",
                               "Furniture & Fixtures",
                               "Loans",
                               "Cash & Bank Balances",
                            ].map((label, i) => (
                               <div key={i} className="space-y-3">
                                  <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wide border-b border-indigo-50 pb-1">{label}</p>
                                  <div className="flex gap-2">
                                     <input type="number" className="flex-1 px-3 py-2 rounded-lg border border-slate-50 bg-slate-50/30 text-right text-[10px] font-bold" placeholder="Amount" />
                                     <input type="number" className="flex-1 px-3 py-2 rounded-lg border border-slate-50 bg-slate-50/30 text-right text-[10px] font-bold" placeholder="Total" />
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep > 5 && (
                  <motion.div
                    key="others"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="py-20 text-center"
                  >
                    <p className="text-slate-400 font-bold uppercase tracking-widest">Ready to Finalize your Report?</p>
                    <div className="mt-8 flex justify-center">
                       <Card className="p-8 border-green-100 bg-green-50/30 max-w-md">
                          <p className="text-sm text-green-700 leading-relaxed">Your report has been successfully prepared. Click "Finalize" to generate the PDF and save it to your records.</p>
                       </Card>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button 
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                className="px-8 py-3 rounded-2xl bg-blue-50 text-blue-600 font-bold flex items-center gap-2 hover:bg-blue-100 transition-all"
              >
                <ChevronLeft size={20} />
                Back
              </button>
              <button 
                onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                className="px-10 py-3 rounded-2xl gradient text-white font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="lg:col-span-5 space-y-6 sticky top-28">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Live Preview</h3>
                <p className="text-xs text-slate-500 mt-1 font-bold">A4 - Real Time</p>
              </div>
              <div className="flex items-center gap-2 bg-white/50 p-1.5 rounded-xl border border-white shadow-sm">
                <button className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-all"><Search size={16} /></button>
                <span className="text-[11px] font-bold text-slate-400 px-2">100%</span>
                <button className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-all"><Maximize2 size={16} /></button>
              </div>
            </div>

            <Card className="p-8 aspect-[1/1.414] bg-white shadow-2xl relative overflow-hidden group">
              {/* Paper Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />
              
              {/* Mock Content */}
              <div className="relative h-full border border-slate-100 p-10 flex flex-col items-center">
                <div className="w-full text-center space-y-6 pt-10">
                   <h1 className="text-3xl font-serif font-bold text-slate-800 tracking-wider">AUDIT REPORT</h1>
                   <div className="h-[2px] w-24 bg-slate-800 mx-auto" />
                   
                   <div className="space-y-2 py-10">
                      <p className="text-[10px] font-bold uppercase tracking-widest">For the year ended 31.03.2025</p>
                      <p className="text-[9px] text-slate-500 italic">Farog-e-urdu Akhliyati Khawatine Hind Amanulla Wachnalay Jalna</p>
                      <p className="text-[9px] text-slate-500">AT Jalna Tq. Dist. Jalna</p>
                   </div>

                   <div className="py-10">
                      <p className="text-[11px] font-bold">Registration No :- F-6825/Jalna</p>
                   </div>

                   <div className="mt-auto space-y-2 pt-20">
                      <p className="text-[10px] font-bold uppercase">THE RVD & ASSOCIATES</p>
                      <p className="text-[8px] text-slate-400">CERTIFIED AUDITOR</p>
                   </div>
                </div>

                {/* Live Indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">Live</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateReport;
