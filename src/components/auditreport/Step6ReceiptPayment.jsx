import React from 'react';
import BalanceSheetColumn from './BalanceSheetColumn';
import { receiptItems, paymentItems } from './reportData';

const Step6ReceiptPayment = ({ formData, onChange }) => {
  return (
    <>
      <div className="border-t border-slate-100 bg-white overflow-x-auto">
        <div className="min-w-[750px]">
          {/* Header */}
          <div className="grid grid-cols-4 bg-slate-50/50 border-b border-slate-100">
            <div className="p-4 text-center font-bold text-[10px] text-black uppercase tracking-widest border-r border-slate-100/50">Receipt</div>
            <div className="p-4 text-center font-bold text-[10px] text-black uppercase tracking-widest border-r border-slate-100/50">Amount</div>
            <div className="p-4 text-center font-bold text-[10px] text-black uppercase tracking-widest border-r border-slate-100/50">Payments</div>
            <div className="p-4 text-center font-bold text-[10px] text-black uppercase tracking-widest">Amount</div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-2 divide-x divide-slate-100 bg-white">
            <div className="px-5 py-6 space-y-5">
              <BalanceSheetColumn
                items={receiptItems}
                formData={formData}
                onChange={onChange}
                colorClass="text-black"
              />
            </div>
            <div className="px-5 py-6 space-y-5">
              <BalanceSheetColumn
                items={paymentItems}
                formData={formData}
                onChange={onChange}
                colorClass="text-black"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step6ReceiptPayment;
