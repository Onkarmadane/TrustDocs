import React from 'react';
import { MoreVertical } from 'lucide-react';
import { InputField } from '../ui/FormFields';

const AccountingRow = ({ item, formData, onChange }) => {
  const hasSubItems = item.subItems && item.subItems.length > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-3 group">
        <p className="text-[10px] font-bold text-slate-700 leading-relaxed flex-1">{item.label}</p>
        <div className="flex items-center gap-2 shrink-0">
          <InputField
            name={item.key}
            type="number"
            value={formData[item.key] || ''}
            onChange={onChange}
            placeholder="0"
            variant="minimal"
            size="compact"
            className="w-24"
          />
          <button className="p-1 text-slate-300 hover:text-slate-500 transition-colors opacity-0 group-hover:opacity-100">
            <MoreVertical size={14} />
          </button>
        </div>
      </div>
      {hasSubItems && (
        <div className="pl-4 border-l-2 border-blue-50 space-y-1.5">
          {item.subItems.map((sub, i) => {
            const subKey = typeof sub === 'string' ? `${item.key}_sub${i}` : sub.key;
            const subLabel = typeof sub === 'string' ? sub : sub.label;
            return (
              <div key={i} className="flex items-center justify-between gap-3 group">
                <p className="text-[9px] text-slate-500 font-medium group-hover:text-slate-700 transition-colors flex-1">{subLabel}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <ConfirmInputField
                    name={subKey}
                    type="number"
                    value={formData[subKey] || ''}
                    onChange={onChange}
                    placeholder="0"
                    variant="minimal"
                    size="compact"
                    className="w-20"
                  />
                  <button className="p-1 text-slate-300 hover:text-slate-500 transition-colors opacity-0 group-hover:opacity-100">
                    <MoreVertical size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Internal InputField wrapper or import
const ConfirmInputField = (props) => <InputField {...props} />;

export default AccountingRow;
