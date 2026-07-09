import React from 'react';
import { RadioGroup } from '../ui/FormFields';
import { permissionsQuestions } from './reportData';

const Step2Permissions = ({ formData, onChange }) => {
  return (
    <div className="space-y-4 p-1">
      <div className="space-y-3">
        {permissionsQuestions.map((question, i) => (
          <div key={i} className="p-4 rounded-2xl border border-slate-50 bg-white/50 space-y-3 hover:border-blue-100 transition-colors">
            <p className="text-[13px] text-slate-700 leading-relaxed font-medium">{question}</p>
            <RadioGroup
              name={`perm_${i}`}
              value={formData[`perm_${i}`] || ''}
              onChange={onChange}
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
                { value: 'NA', label: 'N/A' },
              ]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step2Permissions;
