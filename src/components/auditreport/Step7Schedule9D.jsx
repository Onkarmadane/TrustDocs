import React from 'react';
import { InputField } from '../ui/FormFields';

const Step7Schedule9D = ({ formData, onChange, setFormData }) => {
  return (
    <div className="p-10 space-y-8">
      <div>
        <h2 className="text-[11px] font-bold text-black mb-6 uppercase ">Schedule 9-D (अनुसूची नऊ - ड)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          <InputField name="sch9d_trustNameMarathi" label="संस्थेचे नाव (Trust Name)" placeholder="Enter in Marathi" value={formData.sch9d_trustNameMarathi || ''} onChange={onChange} />
          <InputField name="sch9d_registrationNoMarathi" label="नोंदणी क्रमांक (Reg No)" placeholder="Enter in Marathi" value={formData.sch9d_registrationNoMarathi || ''} onChange={onChange} />
          <InputField name="sch9d_financialYearMarathi" label="आर्थिक वर्ष (Financial Year)" placeholder="उदा. सन 2025-26" value={formData.sch9d_financialYearMarathi || ''} onChange={onChange} />
          <InputField name="sch9d_trustPan" label="विश्वस्त व्यवस्थेच्या स्थायी खाते क्रमांक (Trust PAN)" placeholder="Enter PAN" value={formData.sch9d_trustPan || ''} onChange={onChange} />
          <div className="sm:col-span-2">
            <InputField name="sch9d_incomeTaxRegistration" label="12AA नोंदणी क्रमांक व दिनांक (12AA Reg Details)" placeholder="Enter Details" value={formData.sch9d_incomeTaxRegistration || ''} onChange={onChange} />
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
    </div>
  );
};

export default Step7Schedule9D;
