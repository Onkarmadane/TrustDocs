import React from 'react';
import { InputField } from '../ui/FormFields';

const Step7Schedule9D = ({ formData, onChange, setFormData }) => {
  return (
    <div className="p-10 space-y-8">
      <div>
        <h2 className="text-[11px] font-bold text-black mb-6 uppercase tracking-wider">Schedule IX-D</h2>
        
        <div className="grid grid-cols-1 gap-y-5">
          <InputField 
            name="sch9d_trustPan" 
            label="1. PAN No. of Trust." 
            placeholder="Enter PAN Here..." 
            value={formData.sch9d_trustPan || ''} 
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase();
              onChange(e);
            }} 
            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
            maxLength={10}
            title="Please enter a valid PAN (e.g., ABCDE1234F)"
          />
          
          <InputField 
            name="sch9d_incomeTaxRegistration" 
            label="2. Registration No. with date of registration under section 12AA of Income Tax Act, 1961 (43 of 1961)." 
            placeholder="Enter Details Here..." 
            value={formData.sch9d_incomeTaxRegistration || ''} 
            onChange={onChange} 
          />
        </div>

        {/* Previous 3 Years IT Returns */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[11px] font-bold text-black uppercase tracking-[0.1em]">3. Acknowledgement No. with date of filing of the Return of Income for earlier three years.</h3>
            <button
              type="button"
              onClick={() => {
                const base = (formData.sch9d_previousITReturns && formData.sch9d_previousITReturns.length > 0)
                  ? formData.sch9d_previousITReturns
                  : Array(3).fill().map(() => ({ receiptNo: '', year: '' }));
                setFormData(prev => ({
                  ...prev,
                  sch9d_previousITReturns: [...base, { receiptNo: '', year: '' }]
                }));
              }}
              className="text-xs text-blue-600 font-bold hover:text-blue-700"
            >
              + Add More
            </button>
          </div>
          <div className="space-y-3">
            {((formData.sch9d_previousITReturns && formData.sch9d_previousITReturns.length > 0)
              ? formData.sch9d_previousITReturns
              : Array(3).fill().map(() => ({ receiptNo: '', year: '' }))).map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="col-span-1 hidden md:block text-center text-xs text-slate-500 pb-3">{['i', 'ii', 'iii', 'iv', 'v'][index] || index + 1}</div>
                <div className="col-span-12 md:col-span-5">
                  <InputField
                    name={`sch9d_it_receipt_${index}`}
                    label="Acknowledgement No."
                    placeholder="Enter Acknowledgement No Here..."
                    value={item.receiptNo}
                    onChange={(e) => {
                      const base = (formData.sch9d_previousITReturns && formData.sch9d_previousITReturns.length > 0)
                        ? formData.sch9d_previousITReturns
                        : Array(3).fill().map(() => ({ receiptNo: '', year: '' }));
                      const updated = [...base];
                      updated[index] = { ...updated[index], receiptNo: e.target.value };
                      setFormData(prev => ({ ...prev, sch9d_previousITReturns: updated }));
                    }}
                  />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <InputField
                    name={`sch9d_it_year_${index}`}
                    label="Year"
                    placeholder="Enter Year Here..."
                    value={item.year}
                    onChange={(e) => {
                      const base = (formData.sch9d_previousITReturns && formData.sch9d_previousITReturns.length > 0)
                        ? formData.sch9d_previousITReturns
                        : Array(3).fill().map(() => ({ receiptNo: '', year: '' }));
                      const updated = [...base];
                      updated[index] = { ...updated[index], year: e.target.value };
                      setFormData(prev => ({ ...prev, sch9d_previousITReturns: updated }));
                    }}
                  />
                </div>
                <div className="col-span-12 md:col-span-1 pb-2">
                  <button
                    type="button"
                    onClick={() => {
                      const base = (formData.sch9d_previousITReturns && formData.sch9d_previousITReturns.length > 0)
                        ? formData.sch9d_previousITReturns
                        : Array(3).fill().map(() => ({ receiptNo: '', year: '' }));
                      const updated = base.filter((_, i) => i !== index);
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
            <h3 className="text-[11px] font-bold text-black uppercase tracking-[0.1em]">4. PAN No. of all Trustees.</h3>
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
            {((formData.sch9d_trusteesPan && formData.sch9d_trusteesPan.length > 0)
              ? formData.sch9d_trusteesPan
              : Array(9).fill().map(() => ({ name: '', pan: '' }))).map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="col-span-1 hidden md:block text-center text-xs text-slate-500 pb-3">{index + 1}</div>
                <div className="col-span-12 md:col-span-5">
                  <InputField
                    name={`sch9d_trustee_name_${index}`}
                    label="Name of Trustee"
                    placeholder="Enter Name Here..."
                    value={item.name || ''}
                    onChange={(e) => {
                      const base = (formData.sch9d_trusteesPan && formData.sch9d_trusteesPan.length > 0)
                        ? formData.sch9d_trusteesPan
                        : Array(9).fill().map(() => ({ name: '', pan: '' }));
                      const updated = [...base];
                      updated[index] = { ...updated[index], name: e.target.value };
                      setFormData(prev => ({ ...prev, sch9d_trusteesPan: updated }));
                    }}
                  />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <InputField
                    name={`sch9d_trustee_pan_${index}`}
                    label="PAN No."
                    placeholder="Enter PAN Here..."
                    value={item.pan || ''}
                    onChange={(e) => {
                      const base = (formData.sch9d_trusteesPan && formData.sch9d_trusteesPan.length > 0)
                        ? formData.sch9d_trusteesPan
                        : Array(9).fill().map(() => ({ name: '', pan: '' }));
                      const updated = [...base];
                      updated[index] = { ...updated[index], pan: e.target.value.toUpperCase() };
                      setFormData(prev => ({ ...prev, sch9d_trusteesPan: updated }));
                    }}
                    pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                    maxLength={10}
                    title="Please enter a valid PAN (e.g., ABCDE1234F)"
                  />
                </div>
                <div className="col-span-12 md:col-span-1 pb-2">
                  <button
                    type="button"
                    onClick={() => {
                      const base = (formData.sch9d_trusteesPan && formData.sch9d_trusteesPan.length > 0)
                        ? formData.sch9d_trusteesPan
                        : Array(9).fill().map(() => ({ name: '', pan: '' }));
                      const updated = base.filter((_, i) => i !== index);
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
