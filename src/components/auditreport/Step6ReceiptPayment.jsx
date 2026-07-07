import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import BalanceSheetColumn from './BalanceSheetColumn';
import { receiptItems, paymentItems } from './reportData';
import { InputField } from '../ui/FormFields';

const Step6ReceiptPayment = ({ formData, onChange, setFormData }) => {
  const customReceiptKeys = Object.keys(formData)
    .filter(k => k.startsWith('rec_custom_') && !k.endsWith('_label'))
    .sort();

  const customPaymentKeys = Object.keys(formData)
    .filter(k => k.startsWith('pay_custom_') && !k.endsWith('_label'))
    .sort();

  const handleAddReceipt = () => {
    const id = Date.now();
    setFormData(prev => ({
      ...prev,
      [`rec_custom_${id}_label`]: '',
      [`rec_custom_${id}`]: ''
    }));
  };

  const handleRemoveReceipt = (key) => {
    setFormData(prev => {
      const copy = { ...prev };
      delete copy[key];
      delete copy[`${key}_label`];
      return copy;
    });
  };

  const handleAddPayment = () => {
    const id = Date.now();
    setFormData(prev => ({
      ...prev,
      [`pay_custom_${id}_label`]: '',
      [`pay_custom_${id}`]: ''
    }));
  };

  const handleRemovePayment = (key) => {
    setFormData(prev => {
      const copy = { ...prev };
      delete copy[key];
      delete copy[`${key}_label`];
      return copy;
    });
  };

  return (
    <>
      <div className="border-t border-slate-100 bg-white overflow-x-auto">
        <div className="min-w-[750px]">
          <div className="grid grid-cols-4 bg-slate-50/50 border-b border-slate-100">
            <div className="p-4 text-center font-bold text-[10px] text-black uppercase tracking-widest border-r border-slate-100/50">Receipt</div>
            <div className="p-4 text-center font-bold text-[10px] text-black uppercase tracking-widest border-r border-slate-100/50">Amount</div>
            <div className="p-4 text-center font-bold text-[10px] text-black uppercase tracking-widest border-r border-slate-100/50">Payments</div>
            <div className="p-4 text-center font-bold text-[10px] text-black uppercase tracking-widest">Amount</div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-slate-100 bg-white">
            {/* Receipts Column */}
            <div className="px-5 py-6 space-y-5">
              <BalanceSheetColumn
                items={receiptItems}
                formData={formData}
                onChange={onChange}
                colorClass="text-black"
              />

              {/* Custom Receipts Section */}
              {customReceiptKeys.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-dashed border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-5">Custom Receipts</p>
                  <div className="px-5 space-y-3">
                    {customReceiptKeys.map((key) => (
                      <div key={key} className="flex items-center justify-between gap-3 group">
                        <div className="flex-1">
                          <InputField
                            name={`${key}_label`}
                            type="text"
                            value={formData[`${key}_label`] || ''}
                            onChange={onChange}
                            placeholder="Receipt Label"
                            variant="minimal"
                            size="compact"
                            className="w-full text-[11px] font-bold uppercase tracking-wide"
                          />
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <InputField
                            name={key}
                            type="number"
                            value={formData[key] || ''}
                            onChange={onChange}
                            placeholder="Amount"
                            variant="minimal"
                            size="compact"
                            className="w-20"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveReceipt(key)}
                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="px-5">
                <button
                  type="button"
                  onClick={handleAddReceipt}
                  className="w-full py-2 px-3 border border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-all mt-2"
                >
                  <Plus size={14} />
                  Add Receipt
                </button>
              </div>
            </div>

            {/* Payments Column */}
            <div className="px-5 py-6 space-y-5">
              <BalanceSheetColumn
                items={paymentItems}
                formData={formData}
                onChange={onChange}
                colorClass="text-black"
              />

              {/* Custom Payments Section */}
              {customPaymentKeys.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-dashed border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-5">Custom Payments</p>
                  <div className="px-5 space-y-3">
                    {customPaymentKeys.map((key) => (
                      <div key={key} className="flex items-center justify-between gap-3 group">
                        <div className="flex-1">
                          <InputField
                            name={`${key}_label`}
                            type="text"
                            value={formData[`${key}_label`] || ''}
                            onChange={onChange}
                            placeholder="Payment Label"
                            variant="minimal"
                            size="compact"
                            className="w-full text-[11px] font-bold uppercase tracking-wide"
                          />
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <InputField
                            name={key}
                            type="number"
                            value={formData[key] || ''}
                            onChange={onChange}
                            placeholder="Amount"
                            variant="minimal"
                            size="compact"
                            className="w-20"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePayment(key)}
                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="px-5">
                <button
                  type="button"
                  onClick={handleAddPayment}
                  className="w-full py-2 px-3 border border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-all mt-2"
                >
                  <Plus size={14} />
                  Add Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step6ReceiptPayment;
