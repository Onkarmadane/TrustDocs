import React from 'react';
import { InputField } from '../ui/FormFields';

const Step8DelayExemption = ({ formData, onChange }) => {
  return (
    <div className="p-10 space-y-8">
      <div>
        <h2 className="text-[11px] font-bold text-black mb-6 uppercase ">Delay Exemption (विलंब माफीचा अर्ज)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <InputField name="delay_applicantName" label="अर्जदाराचे नाव (Applicant Name)" placeholder="Enter Name Here..." value={formData.delay_applicantName || ''} onChange={onChange} />
          <InputField name="delay_applicantAge" label="वय (Age)" placeholder="Enter Age Here..." value={formData.delay_applicantAge || ''} onChange={onChange} />
          <InputField name="delay_applicantAddress" label="पत्ता (Address)" placeholder="Enter Address Here..." value={formData.delay_applicantAddress || ''} onChange={onChange} />
          <InputField name="delay_designation" label="हुद्दा (Designation)" placeholder="विश्वस्त / सचिव / अध्यक्ष" value={formData.delay_designation || ''} onChange={onChange} />
          <InputField name="delay_trustRegistrationDate" label="न्यास नोंदणी दिनांक (Trust Reg Date)" type="date" placeholder="Select Date" value={formData.delay_trustRegistrationDate || ''} onChange={onChange} />
          <InputField name="delay_financialYearMarathi" label="आर्थिक वर्ष (Financial Year for delay)" placeholder="Enter Financial Year Here..." value={formData.delay_financialYearMarathi || ''} onChange={onChange} />
          <InputField name="delay_place" label="स्थळ (Place)" placeholder="Enter Place Here..." value={formData.delay_place || ''} onChange={onChange} />
          <InputField name="delay_date" label="दिनांक (Date)" placeholder="Select Date" type="date" value={formData.delay_date || ''} onChange={onChange} />
        </div>
      </div>
    </div>
  );
};

export default Step8DelayExemption;
