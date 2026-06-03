import React from 'react';
import { InputField, SelectField } from '../ui/FormFields';

const AddressBlock = ({ prefix, formData, onChange }) => {
  const addr = formData?.trustDetails?.address || {};
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
      <InputField name={`${prefix}_buildingName`} label="Building / Office Name (इमारत / कार्यालय)" placeholder="Enter" value={addr.buildingName || ''} onChange={onChange} />
      <InputField name={`${prefix}_streetName`} label="Street / Road Name (रस्ता)" placeholder="Enter" value={addr.streetName || ''} onChange={onChange} />
      <InputField name={`${prefix}_landmark`} label="Landmark (खूण)" placeholder="Enter" value={addr.landmark || ''} onChange={onChange} />
      <InputField name={`${prefix}_pin`} label="PIN Code (पिनकोड)" placeholder="000000" value={addr.pin || ''} onChange={onChange} />
      <InputField name={`${prefix}_village`} label="Village / City (गाव / शहर)" placeholder="Enter Village" value={addr.village || ''} onChange={onChange} />
      <InputField name={`${prefix}_taluka`} label="Taluka (तालुका)" placeholder="Enter Taluka" value={addr.taluka || ''} onChange={onChange} />
      <InputField name={`${prefix}_district`} label="District (जिल्हा)" placeholder="Enter District" value={addr.district || ''} onChange={onChange} />
    </div>
  );
};

const Step1BasicDetails = ({ formData, onChange, reportType, setReportType }) => {

  const handleCommitteeChange = (index, field, value) => {
    const updatedMembers = [...(formData.committeeMembers || [])];
    if (!updatedMembers[index]) updatedMembers[index] = {};
    updatedMembers[index][field] = value;
    onChange({ target: { name: 'committeeMembers', value: updatedMembers } });
  };

  const addCommitteeMember = () => {
    const updatedMembers = [...(formData.committeeMembers || []), { name: '', address: '', designation: '', age: '', occupation: '', nationality: 'भारतीय' }];
    onChange({ target: { name: 'committeeMembers', value: updatedMembers } });
  };

  const removeCommitteeMember = (index) => {
    const updatedMembers = (formData.committeeMembers || []).filter((_, i) => i !== index);
    onChange({ target: { name: 'committeeMembers', value: updatedMembers } });
  };

  const handleObjectiveChange = (index, value) => {
    const updatedObjectives = [...(formData.objectives || [])];
    updatedObjectives[index] = value;
    onChange({ target: { name: 'objectives', value: updatedObjectives } });
  };

  const addObjective = () => {
    const updatedObjectives = [...(formData.objectives || []), ''];
    onChange({ target: { name: 'objectives', value: updatedObjectives } });
  };

  const removeObjective = (index) => {
    const updatedObjectives = (formData.objectives || []).filter((_, i) => i !== index);
    onChange({ target: { name: 'objectives', value: updatedObjectives } });
  };

  const handleNOCChange = (e) => {
    const { name, value } = e.target;
    onChange({ target: { name: 'landlordNOC', value: { ...(formData.landlordNOC || {}), [name]: value } } });
  };

  return (
    <div className="divide-y divide-slate-100">

      {/* Section 1: Global Info */}
      <div className="p-8 space-y-5">
        <h2 className="input-headings text-xl font-bold mb-4">संस्थेची मूलभूत माहिती (Global Information)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          <InputField name="trustName" label="Trust / Society Name (संस्थेचे नाव) *" placeholder="Enter Trust Name" value={formData.trustName || ''} onChange={onChange} />
          <InputField name="registrationNo" label="Registration No. (नोंदणी क्रमांक)" placeholder="e.g. JLN/2025/001" value={formData.registrationNo || ''} onChange={onChange} />
          <InputField name="date" label="Application Date (दिनांक) *" type="date" value={formData.date || ''} onChange={onChange} />
          <InputField name="financialYear" label="Financial Year (आर्थिक वर्ष)" placeholder="e.g. 2025-26" value={formData.financialYear || ''} onChange={onChange} />
          <InputField name="place" label="Place (स्थळ) *" placeholder="e.g. Jalna" value={formData.place || ''} onChange={onChange} />
        </div>
        <h3 className="font-semibold text-md mt-6 mb-2 text-slate-700">Society / Office Address (संस्थेच्या कार्यालयाचा पत्ता)</h3>
        <AddressBlock prefix="trust_addr" formData={formData} onChange={onChange} />
      </div>

      {/* Section 2: Officers */}
      <div className="p-8 space-y-5">
        <h2 className="input-headings text-xl font-bold mb-4">पदाधिकाऱ्यांची माहिती (Key Officers)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          <InputField name="presidentName" label="President Name (अध्यक्ष) *" placeholder="Full Name" value={formData.presidentName || ''} onChange={onChange} />
          <InputField name="vicePresidentName" label="Vice President Name (उपाध्यक्ष)" placeholder="Full Name" value={formData.vicePresidentName || ''} onChange={onChange} />
          <InputField name="secretaryName" label="Secretary Name (सचिव) *" placeholder="Full Name" value={formData.secretaryName || ''} onChange={onChange} />
          <InputField name="jointSecretaryName" label="Joint Secretary Name (सहसचिव)" placeholder="Full Name" value={formData.jointSecretaryName || ''} onChange={onChange} />
          <InputField name="treasurerName" label="Treasurer Name (कोषाध्यक्ष)" placeholder="Full Name" value={formData.treasurerName || ''} onChange={onChange} />
        </div>
      </div>

      {/* Section 3: Committee Members */}
      <div className="p-8 space-y-5 bg-slate-50">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="input-headings text-xl font-bold">कार्यकारी मंडळ (Committee Members)</h2>
            <p className="text-sm text-slate-500 mt-1">Min 7, Max 13 members as per rules</p>
          </div>
          <button onClick={addCommitteeMember} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">+ Add Member</button>
        </div>
        {(formData.committeeMembers || []).length === 0 && (
          <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
            No members added yet. Click "+ Add Member" to start.
          </div>
        )}
        {(formData.committeeMembers || []).map((member, index) => (
          <div key={index} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-600 text-sm">Member #{index + 1}</span>
              <button onClick={() => removeCommitteeMember(index)} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100">Remove</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField label="Full Name (संपूर्ण नाव)" placeholder="Name" value={member.name || ''} onChange={(e) => handleCommitteeChange(index, 'name', e.target.value)} />
              <InputField label="Address (पत्ता)" placeholder="Full Address" value={member.address || ''} onChange={(e) => handleCommitteeChange(index, 'address', e.target.value)} />
              <SelectField
                label="Designation (पद)"
                value={member.designation || ''}
                onChange={(e) => handleCommitteeChange(index, 'designation', e.target.value)}
                options={[
                  { value: '', label: 'Select Designation' },
                  { value: 'अध्यक्ष', label: 'अध्यक्ष (President)' },
                  { value: 'उपाध्यक्ष', label: 'उपाध्यक्ष (Vice President)' },
                  { value: 'सचिव', label: 'सचिव (Secretary)' },
                  { value: 'सहसचिव', label: 'सहसचिव (Joint Secretary)' },
                  { value: 'कोषाध्यक्ष', label: 'कोषाध्यक्ष (Treasurer)' },
                  { value: 'सदस्य', label: 'सदस्य (Member)' },
                ]}
              />
              <InputField label="Age (वय)" type="number" placeholder="Age" value={member.age || ''} onChange={(e) => handleCommitteeChange(index, 'age', e.target.value)} />
              <InputField label="Occupation (व्यवसाय)" placeholder="e.g. शेती, नोकरी" value={member.occupation || ''} onChange={(e) => handleCommitteeChange(index, 'occupation', e.target.value)} />
              <InputField label="Nationality (राष्ट्रीयत्व)" value={member.nationality || 'भारतीय'} onChange={(e) => handleCommitteeChange(index, 'nationality', e.target.value)} />
            </div>
          </div>
        ))}
      </div>

      {/* Section 4: Objectives */}
      <div className="p-8 space-y-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="input-headings text-xl font-bold">संस्थेचे उद्देश (Objectives)</h2>
            <p className="text-sm text-slate-500 mt-1">Default 15 objectives are pre-filled. Edit as needed.</p>
          </div>
          <button onClick={addObjective} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">+ Add Objective</button>
        </div>
        {(formData.objectives || []).length === 0 && (
          <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
            No objectives added. Click "+ Add Objective" or they will be auto-filled from defaults on PDF generation.
          </div>
        )}
        {(formData.objectives || []).map((obj, index) => (
          <div key={index} className="flex gap-3 items-start">
            <span className="mt-3 font-bold text-slate-500 min-w-[24px]">{index + 1}.</span>
            <div className="flex-1">
              <InputField placeholder={`Objective ${index + 1}`} value={obj || ''} onChange={(e) => handleObjectiveChange(index, e.target.value)} />
            </div>
            <button onClick={() => removeObjective(index)} className="mt-2 px-3 py-2 bg-red-50 text-red-500 rounded-lg text-sm hover:bg-red-100">✕</button>
          </div>
        ))}
      </div>

      {/* Section 5: Landlord NOC */}
      <div className="p-8 space-y-5 bg-slate-50">
        <h2 className="input-headings text-xl font-bold mb-4">नाहरकत प्रमाणपत्र (Landlord NOC Details)</h2>
        <p className="text-sm text-slate-500 -mt-3">Details of the property owner who has given space to the society for its office</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          <InputField name="name" label="Landlord Full Name (घरमालकाचे नाव) *" placeholder="Full Name" value={formData.landlordNOC?.name || ''} onChange={handleNOCChange} />
          <InputField name="age" label="Landlord Age (वय)" type="number" placeholder="Age in years" value={formData.landlordNOC?.age || ''} onChange={handleNOCChange} />
          <InputField name="address" label="Landlord Full Address (पत्ता)" placeholder="Full address" value={formData.landlordNOC?.address || ''} onChange={handleNOCChange} />
          <InputField name="propertyNumber" label="Property / House / Municipal No. (घर नंबर)" placeholder="e.g. 101 / 5A" value={formData.landlordNOC?.propertyNumber || ''} onChange={handleNOCChange} />
        </div>
      </div>

    </div>
  );
};

export default Step1BasicDetails;
