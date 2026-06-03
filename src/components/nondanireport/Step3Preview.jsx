import React from 'react';

const Step3Preview = ({ formData }) => {
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-6 text-center text-indigo-600">Preview & Save</h2>
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Society/Trust Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div><span className="text-slate-500">Name:</span> {formData.trustName || '-'}</div>
          <div><span className="text-slate-500">Date:</span> {formData.date || '-'}</div>
          <div><span className="text-slate-500">Place:</span> {formData.place || '-'}</div>
        </div>

        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Committee Heads</h3>
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div><span className="text-slate-500">President:</span> {formData.presidentName || '-'}</div>
          <div><span className="text-slate-500">Secretary:</span> {formData.secretaryName || '-'}</div>
        </div>

        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Documents Submitted</h3>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {formData.checklist && formData.checklist.map((item, index) => (
            <li key={index} className={item.isSubmitted ? 'text-green-600' : 'text-red-500'}>
              {item.documentName} - <b>{item.isSubmitted ? 'Yes' : 'No'}</b>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-center text-slate-500 mt-6 text-sm">
        Please review the details above. If everything is correct, click <b>Save Report</b>.
      </p>
    </div>
  );
};

export default Step3Preview;
