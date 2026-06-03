import React from 'react';
import { fundsLiabilitiesItems, propertyAssetsItems } from './reportData';

const Step5BalanceSheet = ({ formData, onChange }) => {
  const getNum = (key) => parseFloat(formData[key] || 0);
x``  // Calculate totals for Funds & Liabilities
  let flTotal = 0;
  fundsLiabilitiesItems.forEach(item => {
    if (item.type === 'nested') {
      item.subFields.forEach(sub => {
        if (sub.type === 'double_field' || sub.outerKey) {
          flTotal += getNum(sub.outerKey);
        }
      });
    } else if (item.type === 'double_field' || item.outerKey) {
      flTotal += getNum(item.outerKey);
    }
  });

  // Calculate totals for Property & Assets
  let paTotal = 0;
  propertyAssetsItems.forEach(item => {
    if (item.type === 'nested') {
      item.subFields.forEach(sub => {
        if (sub.type === 'double_field' || sub.outerKey) {
          paTotal += getNum(sub.outerKey);
        }
      });
    } else if (item.type === 'double_field' || item.outerKey) {
      paTotal += getNum(item.outerKey);
    }
  });

  const renderInput = (name, value, isReadOnly, showUnderline) => (
    <div className="flex flex-col">
      <input
        type={isReadOnly ? "text" : "number"}
        name={name}
        readOnly={isReadOnly}
        className={`border border-slate-300 rounded px-1.5 py-1 text-right font-mono text-xs w-24 focus:outline-blue-500 ${isReadOnly ? 'bg-transparent text-slate-800' : 'bg-white'}`}
        value={value}
        onChange={isReadOnly ? undefined : (e) => onChange({ target: { name, value: e.target.value } })}
        placeholder="0.00"
      />
      {showUnderline && <div className="h-[1px] bg-slate-400 w-full mt-1"></div>}
    </div>
  );

  return (
    <div className="bg-white overflow-x-auto text-[11px] text-slate-800 font-sans p-4">
      <div className="min-w-[950px]">
        {/* Ledger Main Table Columns */}
        <div className="grid grid-cols-2 mb-4">
          <div className="px-4">
            <h2 className="text-lg font-bold text-black border-b border-slate-300 pb-1">Funds And Liabilities</h2>
          </div>
          <div className="px-4">
            <h2 className="text-lg font-bold text-black border-b border-slate-300 pb-1">Property And Assets</h2>
          </div>
        </div>

        {/* Ledger Columns Split Wrapper */}
        <div className="grid grid-cols-2 divide-x divide-slate-300 items-start">
          
          {/* LEFT SECTION: FUNDS & LIABILITIES */}
          <div className="pr-4 pb-4">
            {fundsLiabilitiesItems.map((item) => (
              <div key={item.key} className="mb-4">
                {item.type === "nested" ? (
                  <div>
                    <div className="font-bold text-black mb-2">{item.label}</div>
                    <div className="space-y-2 pl-4">
                      {item.subFields.map((sub, index) => {
                        const isLast = index === item.subFields.length - 1;
                        return (
                          <div key={sub.key || sub.innerKey} className="grid grid-cols-12 items-center">
                            <span className="col-span-6 text-slate-700">{sub.label}</span>
                            <div className="col-span-6 flex justify-end space-x-4">
                              {/* Inner Input */}
                              {renderInput(sub.innerKey || sub.key, formData[sub.innerKey || sub.key] || "", false, isLast)}
                              
                              {/* Outer Input */}
                              {sub.type === "double_field" || sub.outerKey ? (
                                renderInput(sub.outerKey, formData[sub.outerKey] || "", false, true)
                              ) : (
                                <div className="w-24" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : item.type === "double_field" ? (
                  <div className="grid grid-cols-12 items-center">
                    <span className="col-span-6 font-bold text-black">{item.label}</span>
                    <div className="col-span-6 flex justify-end space-x-4">
                      {renderInput(item.innerKey, formData[item.innerKey] || "", false, true)}
                      {renderInput(item.outerKey, formData[item.outerKey] || "", false, true)}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-12 items-center">
                    <span className="col-span-6 font-bold text-black">{item.label}</span>
                    <div className="col-span-6 flex justify-end space-x-4">
                      <div className="w-24" />
                      {renderInput(item.outerKey || item.key, formData[item.outerKey || item.key] || "", false, true)}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Total Row */}
            <div className="grid grid-cols-12 items-center mt-6 pt-4">
              <span className="col-span-6 font-bold text-black">Funds And Liabilities Total</span>
              <div className="col-span-6 flex justify-end space-x-4">
                <div className="w-24" />
                <div className="flex flex-col w-24">
                  <div className="border border-slate-300 rounded px-1.5 py-1 text-right font-mono text-xs w-full bg-transparent">
                    {flTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="h-[1px] bg-slate-400 w-full mt-1"></div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION: PROPERTY & ASSETS */}
          <div className="pl-4 pb-4">
            {propertyAssetsItems.map((item) => (
              <div key={item.key} className="mb-4">
                {item.type === "nested" ? (
                  <div>
                    <div className="font-bold text-black mb-2">{item.label}</div>
                    <div className="space-y-2 pl-4">
                      {item.subFields.map((sub, index) => {
                        const isLast = index === item.subFields.length - 1;
                        return (
                          <div key={sub.key || sub.innerKey} className="grid grid-cols-12 items-center">
                            <span className="col-span-6 text-slate-700">{sub.label}</span>
                            <div className="col-span-6 flex justify-end space-x-4">
                              {/* Inner Input */}
                              {renderInput(sub.innerKey || sub.key, formData[sub.innerKey || sub.key] || "", false, isLast)}
                              
                              {/* Outer Input */}
                              {sub.type === "double_field" || sub.outerKey ? (
                                renderInput(sub.outerKey, formData[sub.outerKey] || "", false, true)
                              ) : (
                                <div className="w-24" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : item.type === "double_field" ? (
                  <div className="grid grid-cols-12 items-center">
                    <span className="col-span-6 font-bold text-black">{item.label}</span>
                    <div className="col-span-6 flex justify-end space-x-4">
                      {renderInput(item.innerKey, formData[item.innerKey] || "", false, true)}
                      {renderInput(item.outerKey, formData[item.outerKey] || "", false, true)}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-12 items-center">
                    <span className="col-span-6 font-bold text-black">{item.label}</span>
                    <div className="col-span-6 flex justify-end space-x-4">
                      <div className="w-24" />
                      {renderInput(item.outerKey || item.key, formData[item.outerKey || item.key] || "", false, true)}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="grid grid-cols-12 items-center mt-6 pt-4">
              <span className="col-span-6 font-bold text-black">Property And Assets Total</span>
              <div className="col-span-6 flex justify-end space-x-4">
                <div className="w-24" />
                <div className="flex flex-col w-24">
                  <div className="border border-slate-300 rounded px-1.5 py-1 text-right font-mono text-xs w-full bg-transparent">
                    {paTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="h-[1px] bg-slate-400 w-full mt-1"></div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Step5BalanceSheet;
