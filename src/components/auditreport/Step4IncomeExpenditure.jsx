import React from 'react';
import { expenditureItems, incomeItems } from './reportData';

const Step4IncomeExpenditure = ({ formData, onChange }) => {
  const getNum = (key) => parseFloat(formData[key] || 0);

  // EXPENDITURE SUBTOTAL CALCULATIONS
  const subTotalExpProperties =
    getNum("exp_rates_taxes") + getNum("exp_repairs_maintenance") +
    getNum("exp_salaries_honorarium") + getNum("exp_insurance") +
    getNum("exp_depreciation_prop") + getNum("exp_other_expenses");

  const subTotalWrittenOff =
    getNum("exp_bad_debts") + getNum("exp_loan_scholarships") +
    getNum("exp_irrecoverable_rents") + getNum("exp_other_items");

  const subTotalObjectsTrust =
    getNum("exp_obj_religious") + getNum("exp_obj_educational") +
    getNum("exp_obj_medical") + getNum("exp_obj_poverty") +
    getNum("exp_obj_other_charitable");

  const baseExpenditureTotal =
    subTotalExpProperties +
    getNum("exp_establishment") +
    getNum("exp_remuneration_trustees") +
    getNum("exp_remuneration_head") +
    getNum("exp_legal") +
    getNum("exp_audit") +
    getNum("exp_contribution_fees") +
    subTotalWrittenOff +
    getNum("exp_misc") +
    getNum("exp_depreciations") +
    getNum("exp_transfer_reserve") +
    subTotalObjectsTrust;

  //  INCOME SUBTOTAL CALCULATIONS (Updated mapping to the new keys) 
  const subTotalIncRent = getNum("inc_rent_accrued_inner") + getNum("inc_rent_realised_inner");
  const subTotalIncInterest =
    getNum("inc_interest_accrued_inner") + getNum("inc_interest_realised_inner") +
    getNum("inc_interest_securities_inner") + getNum("inc_interest_loan_inner") +
    getNum("inc_interest_bank_inner");

  const baseIncomeTotal =
    subTotalIncRent +
    subTotalIncInterest +
    getNum("inc_dividend_outer") +
    getNum("inc_donations_outer") +
    getNum("inc_grants_outer") +
    getNum("inc_other_sources_outer") +
    getNum("inc_transfer_reserve_outer");

  //  BALANCING STRATEGY
  const netBalance = baseIncomeTotal - baseExpenditureTotal;
  const autoCalculatedSurplus = netBalance > 0 ? netBalance : 0;

  const surplus = formData["exp_surplus_override"] !== undefined && formData["exp_surplus_override"] !== ""
    ? getNum("exp_surplus_override")
    : autoCalculatedSurplus;

  const deficit = netBalance < 0 ? Math.abs(netBalance) : 0;

  const finalGrandExpenditure = baseExpenditureTotal + surplus;
  const finalGrandIncome = baseIncomeTotal + deficit;

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
            <h2 className="text-lg font-bold text-black border-b border-slate-300 pb-1">Expenditure</h2>
          </div>
          <div className="px-4">
            <h2 className="text-lg font-bold text-black border-b border-slate-300 pb-1">Income</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-slate-300 items-stretch">

          {/* LEFT SECTION: EXPENDITURE*/}
          <div className="pr-4 pb-4 flex flex-col justify-between">
            <div className="flex-1">
              {expenditureItems.map((item) => (
                <div key={item.key} className="mb-4">
                  {item.type === "nested" ? (
                    <div>
                      <div className="font-bold text-black mb-2">{item.label}</div>
                      <div className="space-y-2 pl-4">
                        {item.subFields.map((sub, index) => {
                          const isLast = index === item.subFields.length - 1;
                          let subTotal = "";
                          if (isLast) {
                            if (item.key === "exp_properties") subTotal = subTotalExpProperties.toFixed(2);
                            if (item.key === "exp_amount_written_off") subTotal = subTotalWrittenOff.toFixed(2);
                            if (item.key === "exp_objects_of_trust") subTotal = subTotalObjectsTrust.toFixed(2);
                          }

                          return (
                            <div key={sub.key} className="grid grid-cols-12 items-center">
                              <span className="col-span-6 text-slate-700">{sub.label}</span>
                              <div className="col-span-6 flex justify-end space-x-4">
                                {/* Inner Input */}
                                {renderInput(sub.key, formData[sub.key] || "", false, isLast)}

                                {/* Outer Input / Subtotal */}
                                {isLast ? (
                                  renderInput("", subTotal, true, true)
                                ) : (
                                  <div className="w-24" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-12 items-center">
                      <span className="col-span-6 font-bold text-black">{item.label}</span>
                      <div className="col-span-6 flex justify-end space-x-4">
                        {renderInput(`${item.key}_inner`, formData[`${item.key}_inner`] || "", false, true)}
                        {renderInput(item.key, formData[item.key] || "", false, true)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-slate-200">
              <div className="grid grid-cols-12 items-center mb-4">
                <span className="col-span-6 font-bold text-black">To Surplus Carried Over to Balance Sheet</span>
                <div className="col-span-6 flex justify-end space-x-4">
                  <div className="w-24" />
                  {renderInput("exp_surplus_override", formData["exp_surplus_override"] !== undefined ? formData["exp_surplus_override"] : surplus.toFixed(2), false, true)}
                </div>
              </div>

              <div className="grid grid-cols-12 items-center pt-2">
                <span className="col-span-6 font-bold text-black text-xs">Total</span>
                <div className="col-span-6 flex justify-end space-x-4">
                  <div className="w-24" />
                  <div className="flex flex-col w-24">
                    <div className="border border-slate-300 rounded px-1.5 py-1 text-right font-mono text-xs w-full bg-slate-50 font-bold">
                      {finalGrandExpenditure.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="h-[1px] bg-slate-400 w-full mt-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*RIGHT SECTION: INCOME*/}
          <div className="pl-4 pb-4 flex flex-col justify-between">
            <div className="flex-1">
              {incomeItems.filter((item) => item.key !== 'inc_deficit_row').map((item) => (
                <div key={item.key} className="mb-4">
                  {item.type === "nested" ? (
                    <div>
                      <div className="font-bold text-black mb-2">{item.label}</div>
                      <div className="space-y-2 pl-4">
                        {item.subFields.map((sub, index) => {
                          const isLast = index === item.subFields.length - 1;
                          return (
                            <div key={sub.innerKey} className="grid grid-cols-12 items-center">
                              <span className="col-span-6 text-slate-700">{sub.label}</span>
                              <div className="col-span-6 flex justify-end space-x-4">
                                {/* Inner Input box */}
                                {renderInput(sub.innerKey, formData[sub.innerKey] || "", false, isLast)}

                                {/* Outer field column */}
                                {sub.type === "double_field" || isLast ? (
                                  renderInput(sub.outerKey, formData[sub.outerKey] || (isLast ? (item.key === "inc_rent_header" ? subTotalIncRent.toFixed(2) : subTotalIncInterest.toFixed(2)) : ""), sub.type !== "double_field", isLast)
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
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-slate-200">
              <div className="grid grid-cols-12 items-center mb-4">
                <span className="col-span-6 font-bold text-black">By Deficit Carried Over to Balance Sheet</span>
                <div className="col-span-6 flex justify-end space-x-4">
                  <div className="w-24" />
                  {renderInput("", deficit.toFixed(2), true, true)}
                </div>
              </div>

              <div className="grid grid-cols-12 items-center pt-2">
                <span className="col-span-6 font-bold text-black text-xs">Total</span>
                <div className="col-span-6 flex justify-end space-x-4">
                  <div className="w-24" />
                  <div className="flex flex-col w-24">
                    <div className="border border-slate-300 rounded px-1.5 py-1 text-right font-mono text-xs w-full bg-slate-50 font-bold">
                      {finalGrandIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

export default Step4IncomeExpenditure;