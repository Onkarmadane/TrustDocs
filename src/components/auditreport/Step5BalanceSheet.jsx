import React from 'react';
import { fundsLiabilitiesItems, propertyAssetsItems } from './reportData';

const Step5BalanceSheet = ({ formData, onChange }) => {
  const getNum = (key) => parseFloat(formData[key] || 0);

  const calcGroupSubTotal = (itemKey) => {
    if (itemKey === 'fl_trust_funds') {
      const bal = getNum('fl_tf_balance');
      const adjOuter = getNum('fl_tf_adjustment_outer');
      const adjInner = getNum('fl_tf_adjustment_inner');
      return adjOuter > 0 ? adjOuter : (bal + adjInner);
    } else if (itemKey === 'fl_earmarked') {
      const outer = getNum('fl_ef_other_outer');
      return outer > 0 ? outer : (getNum('fl_ef_depreciation') + getNum('fl_ef_sinking') + getNum('fl_ef_reserve') + getNum('fl_ef_other_inner'));
    } else if (itemKey === 'fl_loans') {
      const outer = getNum('fl_lo_others_outer');
      return outer > 0 ? outer : (getNum('fl_lo_trustee') + getNum('fl_lo_others_inner'));
    } else if (itemKey === 'fl_liabilities') {
      const outer = getNum('fl_li_sundry_outer');
      return outer > 0 ? outer : (getNum('fl_li_expenses') + getNum('fl_li_advances') + getNum('fl_li_rent') + getNum('fl_li_sundry_inner'));
    } else if (itemKey === 'fl_income_exp') {
      const ieBal = getNum('fl_ie_balance');
      const surplus = getNum('fl_ie_surplus');
      const deficit = getNum('fl_ie_deficit');
      const appInner = getNum('fl_ie_appropriation_inner');
      const appOuter = getNum('fl_ie_appropriation_outer');
      return appOuter > 0 ? appOuter : (ieBal + surplus - deficit - appInner);
    } else if (itemKey === 'pa_immovable') {
      const bal = getNum('pa_im_balance');
      const add = getNum('pa_im_add');
      const ded = getNum('pa_im_deduction');
      const depInner = getNum('pa_im_dep_inner');
      const depOuter = getNum('pa_im_dep_outer');
      return depOuter > 0 ? depOuter : (bal + add - ded - depInner);
    } else if (itemKey === 'pa_furniture') {
      const bal = getNum('pa_fu_balance');
      const add = getNum('pa_fu_add');
      const less = getNum('pa_fu_less');
      const depInner = getNum('pa_fu_dep_inner');
      const depOuter = getNum('pa_fu_dep_outer');
      return depOuter > 0 ? depOuter : (bal + add - less - depInner);
    } else if (itemKey === 'pa_loans') {
      const outer = getNum('pa_lo_others_outer');
      return outer > 0 ? outer : (getNum('pa_lo_scholarships') + getNum('pa_lo_others_inner'));
    } else if (itemKey === 'pa_advances') {
      const outer = getNum('pa_ad_others_outer');
      return outer > 0 ? outer : (getNum('pa_ad_trustees') + getNum('pa_ad_employees') + getNum('pa_ad_contractor') + getNum('pa_ad_lawyers') + getNum('pa_ad_others_inner'));
    } else if (itemKey === 'pa_income_outstanding') {
      const outer = getNum('pa_io_other_outer');
      return outer > 0 ? outer : (getNum('pa_io_rent') + getNum('pa_io_interest') + getNum('pa_io_other_inner'));
    } else if (itemKey === 'pa_cash') {
      const outer = getNum('pa_cb_manager_outer');
      return outer > 0 ? outer : (getNum('pa_cb_saving') + getNum('pa_cb_current') + getNum('pa_cb_fixed') + getNum('pa_cb_trustee') + getNum('pa_cb_manager_inner'));
    }
    return 0;
  };

  // Calculate totals for Funds & Liabilities
  let flTotal = 0;
  fundsLiabilitiesItems.forEach(item => {
    if (item.type === 'nested') {
      flTotal += calcGroupSubTotal(item.key);
    } else if (item.type === 'double_field') {
      const outV = getNum(item.outerKey);
      const inV = getNum(item.innerKey);
      flTotal += (outV > 0 ? outV : inV);
    } else {
      flTotal += (getNum(item.outerKey) || getNum(item.key));
    }
  });

  // Calculate totals for Property & Assets
  let paTotal = 0;
  propertyAssetsItems.forEach(item => {
    if (item.type === 'nested') {
      paTotal += calcGroupSubTotal(item.key);
    } else if (item.type === 'double_field') {
      const outV = getNum(item.outerKey);
      const inV = getNum(item.innerKey);
      paTotal += (outV > 0 ? outV : inV);
    } else {
      paTotal += (getNum(item.outerKey) || getNum(item.key));
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
        onWheel={(e) => e.target.blur()}
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
        <div className="grid grid-cols-2 divide-x divide-slate-300 items-stretch">
          
          {/* LEFT SECTION: FUNDS & LIABILITIES */}
          <div className="pr-4 pb-4 flex flex-col justify-between">
            <div className="flex-1">
              {fundsLiabilitiesItems.map((item) => (
                <div key={item.key} className="mb-4">
                  {item.type === "nested" ? (
                    <div>
                      <div className="font-bold text-black mb-2">{item.label}</div>
                      <div className="space-y-2 pl-4">
                        {item.subFields.map((sub, index) => {
                          const isLast = index === item.subFields.length - 1;
                          const groupSubTotal = calcGroupSubTotal(item.key);
                          const outerVal = sub.outerKey
                            ? (formData[sub.outerKey] !== undefined && formData[sub.outerKey] !== ''
                                ? formData[sub.outerKey]
                                : (isLast && groupSubTotal !== 0 ? groupSubTotal.toFixed(2) : ''))
                            : '';

                          return (
                            <div key={sub.key || sub.innerKey} className="grid grid-cols-12 items-center">
                              <span className="col-span-6 text-slate-700">{sub.label}</span>
                              <div className="col-span-6 flex justify-end space-x-4">
                                {/* Inner Input */}
                                {renderInput(sub.innerKey || sub.key, formData[sub.innerKey || sub.key] || "", false, isLast)}
                                
                                {/* Outer Input */}
                                {sub.type === "double_field" || sub.outerKey ? (
                                  renderInput(sub.outerKey, outerVal, false, true)
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
            </div>

            {/* Total Row */}
            <div className="mt-auto pt-6 border-t border-slate-200">
              <div className="grid grid-cols-12 items-center">
                <span className="col-span-6 font-bold text-black text-xs">Funds And Liabilities Total</span>
                <div className="col-span-6 flex justify-end space-x-4">
                  <div className="w-24" />
                  <div className="flex flex-col w-24">
                    <div className="border border-slate-300 rounded px-1.5 py-1 text-right font-mono text-xs w-full bg-slate-50 font-bold">
                      {flTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="h-[1px] bg-slate-400 w-full mt-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION: PROPERTY & ASSETS */}
          <div className="pl-4 pb-4 flex flex-col justify-between">
            <div className="flex-1">
              {propertyAssetsItems.map((item) => (
                <div key={item.key} className="mb-4">
                  {item.type === "nested" ? (
                    <div>
                      <div className="font-bold text-black mb-2">{item.label}</div>
                      <div className="space-y-2 pl-4">
                        {item.subFields.map((sub, index) => {
                          const isLast = index === item.subFields.length - 1;
                          const groupSubTotal = calcGroupSubTotal(item.key);
                          const outerVal = sub.outerKey
                            ? (formData[sub.outerKey] !== undefined && formData[sub.outerKey] !== ''
                                ? formData[sub.outerKey]
                                : (isLast && groupSubTotal !== 0 ? groupSubTotal.toFixed(2) : ''))
                            : '';

                          return (
                            <div key={sub.key || sub.innerKey} className="grid grid-cols-12 items-center">
                              <span className="col-span-6 text-slate-700">{sub.label}</span>
                              <div className="col-span-6 flex justify-end space-x-4">
                                {/* Inner Input */}
                                {renderInput(sub.innerKey || sub.key, formData[sub.innerKey || sub.key] || "", false, isLast)}
                                
                                {/* Outer Input */}
                                {sub.type === "double_field" || sub.outerKey ? (
                                  renderInput(sub.outerKey, outerVal, false, true)
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
            </div>

            <div className="mt-auto pt-6 border-t border-slate-200">
              <div className="grid grid-cols-12 items-center">
                <span className="col-span-6 font-bold text-black text-xs">Property And Assets Total</span>
                <div className="col-span-6 flex justify-end space-x-4">
                  <div className="w-24" />
                  <div className="flex flex-col w-24">
                    <div className="border border-slate-300 rounded px-1.5 py-1 text-right font-mono text-xs w-full bg-slate-50 font-bold">
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
    </div>
  );
};

export default Step5BalanceSheet;
