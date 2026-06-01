import React from 'react';
import { InputField, SelectField } from '../ui/FormFields';

const ACCOUNTING_YEARS = (() => {
  const years = [];

  const startYear = 2020;
  const currentYear = new Date().getFullYear();

  // Generate 10 years ahead automatically
  const endYear = currentYear + 5;

  for (let y = startYear; y <= endYear; y++) {
    years.push({
      value: `${y}-${y + 1}`,
      label: `${y}-${y + 1}`,
    });
  }

  return years;
})();

const AddressBlock = ({ prefix, formData, onChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
    {/* Building Name */}
    <InputField
      name={`${prefix}_buildingName`}
      label="Building Name Or Office Name"
      placeholder="Enter"
      value={formData[`${prefix}_buildingName`] || ''}
      onChange={onChange}
    />
    {/* <InputField
      name={`${prefix}_buildingNameMarathi`}
      label="इमारतीचे / कार्यालयाचे नाव"
      placeholder="मराठीत प्रविष्ट करा"
      value={formData[`${prefix}_buildingNameMarathi`] || ''}
      onChange={onChange}
    /> */}

    {/* Street Name */}
    <InputField
      name={`${prefix}_streetName`}
      label="Street Name"
      placeholder="Enter"
      value={formData[`${prefix}_streetName`] || ''}
      onChange={onChange}
    />
    {/* <InputField
      name={`${prefix}_streetNameMarathi`}
      label="रस्त्याचे नाव"
      placeholder="मराठीत प्रविष्ट करा"
      value={formData[`${prefix}_streetNameMarathi`] || ''}
      onChange={onChange}
    /> */}

    {/* LandMark */}
    <InputField
      name={`${prefix}_landmark`}
      label="LandMark"
      placeholder="Enter"
      value={formData[`${prefix}_landmark`] || ''}
      onChange={onChange}
    />
    {/* <InputField
      name={`${prefix}_landmarkMarathi`}
      label="खूण"
      placeholder="मराठीत प्रविष्ट करा"
      value={formData[`${prefix}_landmarkMarathi`] || ''}
      onChange={onChange}
    /> */}

    {/* Pin */}
    <InputField
      name={`${prefix}_pin`}
      label="Pin"
      placeholder="000000"
      value={formData[`${prefix}_pin`] || ''}
      onChange={onChange}
    />

    {/* District (plain text) */}
    <InputField
      name={`${prefix}_district`}
      label="District"
      placeholder="Enter District"
      value={formData[`${prefix}_district`] || ''}
      onChange={onChange}
    />

    {/* Taluka (plain text) */}
    <InputField
      name={`${prefix}_taluka`}
      label="Taluka"
      placeholder="Enter Taluka"
      value={formData[`${prefix}_taluka`] || ''}
      onChange={onChange}
    />

    {/* Village (plain text) */}
    <InputField
      name={`${prefix}_village`}
      label="Village"
      placeholder="Enter Village"
      value={formData[`${prefix}_village`] || ''}
      onChange={onChange}
    />
  </div>
);

const Step1BasicDetails = ({ formData, onChange }) => {
  return (
    <div className="divide-y divide-slate-100">

      <div className="p-8 space-y-5">
        <h2 className="input-headings">Trust Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          <InputField
            name="trust_trustNumber"
            label="Trust Number"
            placeholder="E-0000000(JLN)"
            value={formData.trust_trustNumber || ''}
            onChange={onChange}
          />
          <InputField
            name="trust_trustName"
            label="Trust Name"
            placeholder="Enter Trust Name"
            value={formData.trust_trustName || ''}
            onChange={onChange}
          />
        </div>
        <AddressBlock prefix="trust_addr" formData={formData} onChange={onChange} />
      </div>

      <div className="p-8 space-y-5">
        <h2 className="input-headings">Auditor Master Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          <InputField
            name="aud_auditorName"
            label="Auditor Name"
            placeholder="Enter Auditor Name"
            value={formData.aud_auditorName || ''}
            onChange={onChange}
          />
          <InputField
            name="aud_district"
            label="District"
            placeholder="Enter District"
            value={formData.aud_district || ''}
            onChange={onChange}
          />
          <InputField
            name="aud_nameOfFirm"
            label="Name Of The Firm"
            placeholder="Enter Firm Name"
            value={formData.aud_nameOfFirm || ''}
            onChange={onChange}
          />
          <InputField
            name="aud_membershipNumber"
            label="Membership Number"
            placeholder="e.g. 72/2025"
            value={formData.aud_membershipNumber || ''}
            onChange={onChange}
          />
          <InputField
            name="aud_status"
            label="Status"
            placeholder="Enter Status"
            value={formData.aud_status || ''}
            onChange={onChange}
          />
          <InputField
            name="aud_registrationNumber"
            label="Registration Number"
            placeholder="e.g. 72/2025"
            value={formData.aud_registrationNumber || ''}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="p-8 space-y-5">
        <h2 className="input-headings">Accounting Year & Report Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-1">
          <SelectField
            name="accountingYear"
            label="Accounting Year"
            value={formData.accountingYear || ''}
            onChange={onChange}
            options={ACCOUNTING_YEARS}
            placeholder="Select Year"
            size="medium"
          />
          <InputField
            name="date"
            label="Report Date"
            type="date"
            placeholder="Select Date"
            value={formData.date || ''}
            onChange={onChange}
          />
          <InputField
            name="place"
            label="Place"
            placeholder="Enter Place"
            value={formData.place || ''}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="p-8 space-y-5">
        <h2 className="input-headings">Auditors Address</h2>
        <AddressBlock prefix="audaddr" formData={formData} onChange={onChange} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 pt-1">
          <InputField
            name="audaddr_mobileNumber"
            label="Mobile Number"
            placeholder="9400000000"
            value={formData.audaddr_mobileNumber || ''}
            onChange={onChange}
          />
          <InputField
            name="audaddr_emailId"
            label="Email Id"
            placeholder="example@gmail.com"
            type="email"
            value={formData.audaddr_emailId || ''}
            onChange={onChange}
          />
        </div>
      </div>

    </div>
  );
};

export default Step1BasicDetails;
