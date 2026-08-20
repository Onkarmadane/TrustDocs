import React from 'react';
import { scheduleIXItems } from './reportData';

const Step3ScheduleIX = ({ formData, onChange }) => {
  const getNum = (key) => parseFloat(formData[key] || 0);

  // Auto-calculate income from I&E Account income-side outer totals (baseIncomeTotal)
  const subTotalIncRent = getNum("inc_rent_accrued_inner") + getNum("inc_rent_realised_inner");
  const subTotalIncInterest =
    getNum("inc_interest_accrued_inner") + getNum("inc_interest_realised_inner") +
    getNum("inc_interest_securities_inner") + getNum("inc_interest_loan_inner") +
    getNum("inc_interest_bank_inner");

  const autoIncomeShown =
    subTotalIncRent +
    subTotalIncInterest +
    getNum("inc_dividend_outer") +
    getNum("inc_donations_outer") +
    getNum("inc_grants_outer") +
    getNum("inc_other_sources_outer") +
    getNum("inc_transfer_reserve_outer");

  // Use auto-calculated value; fallback to manual entry if I&E data not yet filled
  const grossIncome = autoIncomeShown > 0 ? autoIncomeShown : getNum('sch_income_shown');

  const getAllKeys = () => {
    const keys = [];
    scheduleIXItems.forEach(item => {
      if (item.type === 'group') {
        item.subItems.forEach(sub => keys.push(sub.key));
      } else {
        keys.push(item.key);
      }
    });
    return keys;
  };

  const totalDeductions = getAllKeys().reduce((s, k) => s + getNum(k), 0);
  const netIncome = grossIncome - totalDeductions;

  const renderInput = (name, value) => (
    <input
      type="number"
      name={name}
      className="border border-slate-300 rounded px-1.5 py-1 text-right font-mono text-xs w-28 focus:outline-blue-500 bg-white"
      value={value}
      onChange={(e) => onChange({ target: { name, value: e.target.value } })}
      onWheel={(e) => e.target.blur()}
      placeholder="0.00"
    />
  );

  return (
    <div className="bg-white overflow-x-auto text-[11px] text-slate-800 font-sans p-4">
      <div className="min-w-[700px]">

        <h2 className="text-base font-bold text-black border-b border-slate-300 pb-2 mb-4">
          Statement Of Income With Contribution
        </h2>

        <table className="w-full border-collapse text-[11px]">
          <tbody>

            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4 text-slate-800 font-medium w-[75%]">
                <span className="font-bold">I. Income As Shown In The Income And Expenditure Account (Schedule IX):</span>
                {autoIncomeShown > 0 && (
                  <span className="block text-[9px] text-blue-500 font-normal mt-0.5">
                    Auto-calculated from Income & Expenditure Account
                  </span>
                )}
              </td>
              <td className="py-2 text-right">
                {autoIncomeShown > 0 ? (
                  <div className="border border-blue-200 bg-blue-50/50 rounded px-1.5 py-1 text-right font-mono text-xs w-28 ml-auto text-blue-700 font-semibold">
                    {grossIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                ) : (
                  renderInput('sch_income_shown', formData.sch_income_shown || '')
                )}
              </td>
            </tr>

            <tr className="border-b border-slate-200 bg-slate-50/50">
              <td className="py-2 pr-4 font-bold text-slate-800" colSpan={2}>
                II. Items Not Chargeable To Contribution Under Section 58 And Rule 32 -
              </td>
            </tr>

            {scheduleIXItems.map((item) => {
              if (item.type === 'group') {
                return (
                  <React.Fragment key={item.key}>
                    {/* Group header - no input */}
                    <tr className="border-b border-slate-100">
                      <td className="py-1.5 pr-4 font-semibold text-slate-800" colSpan={2}>
                        {item.label}
                      </td>
                    </tr>
                    {/* Sub-items */}
                    {item.subItems.map((sub) => (
                      <tr key={sub.key} className="border-b border-slate-100">
                        <td className="py-1.5 pl-8 pr-4 text-slate-600">{sub.label}</td>
                        <td className="py-1.5 text-right">
                          {renderInput(sub.key, formData[sub.key] || '')}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              }
              return (
                <tr key={item.key} className="border-b border-slate-100">
                  <td className="py-1.5 pr-4 text-slate-700">{item.label}</td>
                  <td className="py-1.5 text-right">
                    {renderInput(item.key, formData[item.key] || '')}
                  </td>
                </tr>
              );
            })}

            <tr className="border-t-2 border-slate-300 border-b border-slate-200">
              <td className="py-2 pr-4 text-right font-bold text-slate-800">Total Deductions</td>
              <td className="py-2 text-right">
                <div className="border border-slate-300 rounded px-1.5 py-1 text-right font-mono text-xs w-28 ml-auto bg-slate-50">
                  {totalDeductions.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </td>
            </tr>

            <tr><td colSpan={2} className="py-2" /></tr>

            <tr className="border-t border-slate-200 bg-green-50/50">
              <td className="py-2.5 pr-4 font-bold text-slate-800">
                Gross Annual Income Chargeable To Contribution
                <span className="block text-[9px] text-green-600 font-normal mt-0.5">
                  = Income ({grossIncome.toLocaleString('en-IN')}) − Deductions ({totalDeductions.toLocaleString('en-IN')})
                </span>
              </td>
              <td className="py-2.5 text-right">
                <div className="border border-green-300 bg-green-50 rounded px-1.5 py-1 text-right font-mono text-xs w-28 ml-auto text-green-700 font-bold">
                  {netIncome > 0
                    ? netIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : '0.00'}
                </div>
              </td>
            </tr>

            {/* Amount of Contribution */}
            {/* <tr className="border-t border-slate-200">
              <td className="py-2.5 pr-4 font-bold text-slate-800">
                Amount Of Contribution Computed At The Rate Fixed Under The Subsection (1) Of Section 58 And Payable
              </td>
              <td className="py-2.5 text-right">
                {renderInput('sch_contribution', formData.sch_contribution || '')}
              </td>
            </tr> */}

          </tbody>
        </table>

      </div>
    </div>
  );
};

export default Step3ScheduleIX;
