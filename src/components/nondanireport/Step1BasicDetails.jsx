import React from 'react';
import { InputField, SelectField } from '../ui/FormFields';

const DEFAULT_OBJECTIVES = [
  "लोकांना वाचनाची आवड निर्माण करणे.",
  "साहित्यिक, कलावंतास पुरस्कार देऊन कौतुक करणे.",
  "व्याख्याने कविसंमेलन, वादविवाद, परिसंवाद, साहित्यसंमेलन इत्यादी साहित्यिक उपक्रम राबविणे.",
  "लेखक वाचक सुसंवाद घडवून आणणे.",
  "विविध भाषिक पुस्तके उपलब्ध करून देणे.",
  "समाजातील विविध घटकात वाचनाची आवड निर्माण करण्यासाठी वाचनालय सुरू करणे ते चालविणे.",
  "सार्वजनिक वाचनालयाद्वारे दैनिक, साप्ताहिक, मासिक इ. उपलब्ध करून देणे, शहरी व ग्रामीण भागात वाचनालये सुरू करणे.",
  "प्रौढांमध्ये साक्षरतेचा प्रचार व प्रसार करणे वाचनाची आवड निर्माण करणे.",
  "मनोरंजनातुन ज्ञानवृध्दी होईल अशा प्रकारचे साहित्य वाचनालयाला पुरविणे.",
  "चर्चासत्रे, वाद-संवाद, मेळावे भरवुन विविध प्रकारचे साहित्य निर्मितीस हातभार लावणे.",
  "सामाजिक, पौराणिक, विज्ञानविषयक माहिती संपन्न पुस्तके उपलब्ध करणे.",
  "संगणकीकृत तसेच ऑनलाईन (डीजीटल) वाचनालये सुरू करणे.",
  "लहान मुलांसाठी व प्रौढ साक्षरांसाठी आवश्यक ती पुस्तके वाचनालयात उपलब्ध करून देणे.",
  "विविध प्रकाराचे वर्तमानपत्र, साप्ताहिके, पाक्षिके, मासिके व वार्षिक अंक तसेच विशेषांक ची माहिती इ. वाचनालयात उपलब्ध करून देणे.",
  "दुर्मिळ ग्रंथांचे व पुस्तकाचे जतन करणे."
];

const AddressBlock = ({ prefix, formData, onChange }) => {
  const addr = formData?.trustDetails?.address || {};
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
      <InputField name={`${prefix}_buildingName`} label="Building / Office Name (इमारत / कार्यालय)" placeholder="Enter Building / Office Name Here..." value={addr.buildingName || ''} onChange={onChange} />
      <InputField name={`${prefix}_streetName`} label="Street / Road Name (रस्ता)" placeholder="Enter Street / Road Name Here..." value={addr.streetName || ''} onChange={onChange} />
      <InputField name={`${prefix}_landmark`} label="Landmark (खूण)" placeholder="Enter Landmark Here..." value={addr.landmark || ''} onChange={onChange} />
      <InputField name={`${prefix}_pin`} label="PIN Code (पिनकोड)" placeholder="000000" value={addr.pin || ''} onChange={onChange} />
      <InputField name={`${prefix}_village`} label="Village / City (गाव / शहर)" placeholder="Enter Village Here..." value={addr.village || ''} onChange={onChange} />
      <InputField name={`${prefix}_taluka`} label="Taluka (तालुका)" placeholder="Enter Taluka Here..." value={addr.taluka || ''} onChange={onChange} />
      <InputField name={`${prefix}_district`} label="District (जिल्हा)" placeholder="Enter District Here..." value={addr.district || ''} onChange={onChange} />
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
          <InputField name="trustName" label="Trust / Society Name (संस्थेचे नाव) *" placeholder="Enter Trust Name Here..." value={formData.trustName || ''} onChange={onChange} />
          <InputField name="registrationNo" label="Registration No. (नोंदणी क्रमांक)" placeholder="Enter Registration No. Here..." value={formData.registrationNo || ''} onChange={onChange} />
          <InputField name="date" label="Application Date (दिनांक) *" type="date" value={formData.date || ''} onChange={onChange} />
          <InputField name="financialYear" label="Financial Year (आर्थिक वर्ष)" placeholder="Enter Financial Year Here..." value={formData.financialYear || ''} onChange={onChange} />
          <InputField name="place" label="Place (स्थळ) *" placeholder="Enter Place Here..." value={formData.place || ''} onChange={onChange} />
        </div>
        <h3 className="font-semibold text-md mt-6 mb-2 text-slate-700">Society / Office Address (संस्थेच्या कार्यालयाचा पत्ता)</h3>
        <AddressBlock prefix="trust_addr" formData={formData} onChange={onChange} />
      </div>

      {/* Section 2: Officers */}
      <div className="p-8 space-y-5">
        <h2 className="input-headings text-xl font-bold mb-4">पदाधिकाऱ्यांची माहिती (Key Officers)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          <InputField name="presidentName" label="President Name (अध्यक्ष) *" placeholder="Enter Full Name Here..." value={formData.presidentName || ''} onChange={onChange} />
          <InputField name="vicePresidentName" label="Vice President Name (उपाध्यक्ष)" placeholder="Enter Full Name Here..." value={formData.vicePresidentName || ''} onChange={onChange} />
          <InputField name="secretaryName" label="Secretary Name (सचिव) *" placeholder="Enter Full Name Here..." value={formData.secretaryName || ''} onChange={onChange} />
          <InputField name="jointSecretaryName" label="Joint Secretary Name (सहसचिव)" placeholder="Enter Full Name Here..." value={formData.jointSecretaryName || ''} onChange={onChange} />
          <InputField name="treasurerName" label="Treasurer Name (कोषाध्यक्ष)" placeholder="Enter Full Name Here..." value={formData.treasurerName || ''} onChange={onChange} />
        </div>
      </div>

      {/* Section 3: Committee Members */}
      <div className="p-8 space-y-5 bg-slate-50">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="input-headings text-xl font-bold">कार्यकारी मंडळ (Committee Members)</h2>
            <p className="text-sm text-slate-500 mt-1">Min 7, Max 13 members as per rules</p>
          </div>
          <button 
            type="button"
            onClick={addCommitteeMember} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            + Add Member
          </button>
        </div>

        {(formData.committeeMembers || []).length === 0 && (
          <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-white">
            <p className="font-medium text-sm">No members added yet. Click below to add Member 1.</p>
            <button
              type="button"
              onClick={addCommitteeMember}
              className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              + Add Member
            </button>
          </div>
        )}

        <div className="space-y-4">
          {(formData.committeeMembers || []).map((member, index) => (
            <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-700 text-sm">Member #{index + 1} (सभासद क्र. {index + 1})</span>
                <button 
                  type="button"
                  onClick={() => removeCommitteeMember(index)} 
                  className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InputField label="Full Name (संपूर्ण नाव)" placeholder="Enter Full Name Here..." value={member.name || ''} onChange={(e) => handleCommitteeChange(index, 'name', e.target.value)} />
                <InputField label="Address (पत्ता)" placeholder="Enter Full Address Here..." value={member.address || ''} onChange={(e) => handleCommitteeChange(index, 'address', e.target.value)} />
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

        {/* Add Member button below members list */}
        {(formData.committeeMembers || []).length > 0 && (
          <div className="pt-2">
            <button
              type="button"
              onClick={addCommitteeMember}
              className="w-full py-3 border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              + Add Member (पुढील सभासद जोडा)
            </button>
          </div>
        )}
      </div>

      {/* Section 4: Objectives */}
      <div className="p-8 space-y-5">
        <h2 className="input-headings text-xl font-bold">संस्थेचे उद्देश (Objectives)</h2>
        <p className="text-sm text-slate-500 -mt-3">Select from core objectives below, or add custom ones.</p>

        {(() => {
          const selectedObjectives = formData.objectives !== undefined ? formData.objectives : DEFAULT_OBJECTIVES;
          const customObjectives = selectedObjectives.filter(o => !DEFAULT_OBJECTIVES.includes(o));

          return (
            <div className="space-y-6">
              {/* Static Checkboxes */}
              <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="font-bold text-sm text-slate-700 mb-2">मुख्य उद्देश निवडा (Select Core Objectives)</h3>
                <div className="grid grid-cols-1 gap-2">
                  {DEFAULT_OBJECTIVES.map((obj, i) => {
                    const isChecked = selectedObjectives.includes(obj);
                    return (
                      <label key={i} className="flex items-start gap-3 text-sm text-slate-600 hover:text-slate-900 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            let newSelected;
                            if (isChecked) {
                              newSelected = selectedObjectives.filter(o => o !== obj);
                            } else {
                              const newStatic = DEFAULT_OBJECTIVES.filter(o => selectedObjectives.includes(o) || o === obj);
                              newSelected = [...newStatic, ...customObjectives];
                            }
                            onChange({ target: { name: 'objectives', value: newSelected } });
                          }}
                          className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{i + 1}. {obj}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Custom Objectives */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-700">इतर उद्देश (Other Custom Objectives)</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newSelected = [...selectedObjectives, ''];
                      onChange({ target: { name: 'objectives', value: newSelected } });
                    }}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    + Add Custom Objective
                  </button>
                </div>
                
                {customObjectives.length === 0 ? (
                  <div className="text-center py-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
                    <p className="text-xs text-slate-400 italic mb-2">No custom objectives added yet.</p>
                    <button
                      type="button"
                      onClick={() => {
                        const newSelected = [...selectedObjectives, ''];
                        onChange({ target: { name: 'objectives', value: newSelected } });
                      }}
                      className="px-3.5 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors"
                    >
                      + Add Custom Objective
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customObjectives.map((obj, customIdx) => {
                      let absoluteIndex = -1;
                      let occurrenceCount = 0;
                      for (let i = 0; i < selectedObjectives.length; i++) {
                        if (!DEFAULT_OBJECTIVES.includes(selectedObjectives[i])) {
                          if (occurrenceCount === customIdx) {
                            absoluteIndex = i;
                            break;
                          }
                          occurrenceCount++;
                        }
                      }

                      return (
                        <div key={customIdx} className="flex gap-3 items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                          <span className="text-sm font-bold text-slate-500 min-w-[24px]">#{customIdx + 1}</span>
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Enter custom objective (उद्देश प्रविष्ट करा)"
                              value={obj}
                              onChange={(e) => {
                                const updated = [...selectedObjectives];
                                if (absoluteIndex !== -1) {
                                  updated[absoluteIndex] = e.target.value;
                                  onChange({ target: { name: 'objectives', value: updated } });
                                }
                              }}
                              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = selectedObjectives.filter((_, i) => i !== absoluteIndex);
                              onChange({ target: { name: 'objectives', value: updated } });
                            }}
                            className="px-2.5 py-2 bg-red-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                            title="Remove objective"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}

                    {/* Add Objective button below custom objectives list */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const newSelected = [...selectedObjectives, ''];
                          onChange({ target: { name: 'objectives', value: newSelected } });
                        }}
                        className="w-full py-2.5 border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        + Add Custom Objective (नवीन उद्देश जोडा)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
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
