import React from 'react';
import { MoreVertical } from 'lucide-react';
import { InputField } from '../ui/FormFields';
import { cn } from '../../lib/utils';

const BalanceSheetColumn = ({ items, formData, onChange, colorClass = 'text-blue-600', borderColor = 'border-blue-50' }) => (
  <div className="px-10 py-6 space-y-5">
    {items.map((item) => (
      <div key={item.key} className="space-y-3">
        <div className="flex items-center justify-between">
          <p className={cn("text-[11px] font-bold uppercase tracking-wide pb-1 border-b flex-1", colorClass, borderColor)}>
            {item.label}
          </p>
          <div className="flex items-center gap-2 ml-3 shrink-0">
            <InputField
              name={item.key}
              type="number"
              value={formData[item.key] || ''}
              onChange={onChange}
              placeholder="Amount"
              variant="minimal"
              size="compact"
              className="w-20"
            />
            <InputField
              name={`${item.key}_total`}
              type="number"
              value={formData[`${item.key}_total`] || ''}
              onChange={onChange}
              placeholder="Total"
              variant="minimal"
              size="compact"
              className="w-20"
            />
          </div>
        </div>
        {item.subItems && (
          <div className="pl-3 space-y-2">
            {item.subItems.map((sub, i) => {
              const subKey = typeof sub === 'string' ? `${item.key}_s${i}` : sub.key;
              const subLabel = typeof sub === 'string' ? sub : sub.label;
              return (
                <div key={i} className="flex items-center justify-between gap-3 group">
                  <p className="text-[9px] text-slate-500 font-medium group-hover:text-slate-700 transition-colors flex-1">{subLabel}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <InputField
                      name={subKey}
                      type="number"
                      value={formData[subKey] || ''}
                      onChange={onChange}
                      placeholder="0"
                      variant="minimal"
                      size="compact"
                      className="w-20"
                    />
                    {/* <button className="p-1 text-slate-300 hover:text-slate-500 transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical size={12} />
                    </button> */}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    ))}
  </div>
);

export default BalanceSheetColumn;
