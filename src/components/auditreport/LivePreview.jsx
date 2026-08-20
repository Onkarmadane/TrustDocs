import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  permissionsQuestions,
  expenditureItems,
  incomeItems,
  fundsLiabilitiesItems,
  propertyAssetsItems,
  scheduleIXItems,
  receiptItems,
  paymentItems,
} from './reportData';

const fmt = (val) => {
  if (val === null || val === undefined || val === '') return '';
  if (val === '-' || val === '—' || val === '- ') return '-';
  if (val === '0.00') return '0.00';
  const n = parseFloat(String(val).replace(/,/g, ''));
  if (isNaN(n) || n === 0) return '';
  const str = String(val);
  if (str.includes('.') && str.split('.')[1].length === 2) {
    return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return n.toLocaleString('en-IN');
};

// ── Helpers to format addresses from the new Step 1 fields ──
const formatAddress = (prefix, formData) => {
  const parts = [
    formData[`${prefix}_buildingName`],
    formData[`${prefix}_streetName`],
    formData[`${prefix}_landmark`],
    formData[`${prefix}_village`],
    formData[`${prefix}_taluka`],
    formData[`${prefix}_district`],
  ].filter(Boolean);
  const pin = formData[`${prefix}_pin`];
  return parts.join(', ') + (pin ? ` - ${pin}` : '');
};

const getTrustName = (formData) => formData.trust_trustName || formData.trustName || 'Trust Name';
const getRegistrationNo = (formData) => formData.trust_trustNumber || formData.registrationNo || 'F-XXXX/Jalna';
const getFinancialYear = (formData) => formData.accountingYear || formData.financialYear || '31.03.2025';
const getTrustAddress = (formData) => formatAddress('trust_addr', formData) || formData.address || 'Address';
const getDate = (formData) => {
  if (!formData.date) return '__.__.____';
  const parts = formData.date.split('-');
  if (parts.length === 3) return `${parts[2]}.${parts[1]}.${parts[0]}`;
  return formData.date;
};

const getAuditorFirm = (formData) => formData.aud_nameOfFirm || '';
const getAuditorStatus = (formData) => formData.aud_status || '';
const getAuditorName = (formData) => formData.aud_auditorName || '';
const getAuditorMembershipNo = (formData) => formData.aud_membershipNumber || '';
const getAuditorRegistrationNo = (formData) => formData.aud_registrationNumber || '';
const getAuditorAddress = (formData) => formatAddress('audaddr', formData) || '';
const getAuditorEmail = (formData) => formData.audaddr_emailId || '';
const getAuditorMobile = (formData) => formData.audaddr_mobileNumber || '';

export const A4Page = ({ children, pageLabel }) => (
  <div className="bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative w-full aspect-[1/1.414] shrink-0 rounded-[2px] transition-all duration-500 overflow-hidden group">
    {/* Subtle Paper Texture Overlay */}
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

    <div className="h-full p-7 select-none relative z-10">
      {children}
    </div>

    {pageLabel && (
      <div className="absolute bottom-4 left-0 right-0 text-center opacity-40 group-hover:opacity-100 transition-opacity">
        <span className="text-[7px] text-slate-400 font-bold uppercase tracking-[0.3em]">{pageLabel}</span>
      </div>
    )}

    <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
      <span className="text-[7px] font-bold text-green-600 uppercase tracking-widest">Live Sync</span>
    </div>
  </div>
);

// Cover page
export const CoverPage = ({ formData }) => {
  const regNo = getRegistrationNo(formData);
  const trustName = getTrustName(formData);
  const trustAddress = getTrustAddress(formData);
  const finYear = getFinancialYear(formData);
  const date = getDate(formData);
  const audFirm = getAuditorFirm(formData);
  const audStatus = getAuditorStatus(formData) || 'CERTIFIED AUDITORS';
  const audName = getAuditorName(formData);
  const audMem = getAuditorMembershipNo(formData);
  const audReg = getAuditorRegistrationNo(formData);
  const audAddr = getAuditorAddress(formData);
  const audEmail = getAuditorEmail(formData);
  const audMobile = getAuditorMobile(formData);

  return (
    <A4Page pageLabel="Page 1 — Cover">
      <div className="h-full border-2 border-black p-4 flex flex-col justify-between text-center font-serif">
        {/* Top Title */}
        <div className="pt-3">
          <h1 className="text-[17px] font-bold tracking-[0.25em] uppercase text-black">
            AUDIT REPORT
          </h1>
        </div>

        {/* Middle Section */}
        <div className="space-y-2.5 my-auto">
          <p className="text-[10.5px] font-bold uppercase text-black tracking-wide">
            FOR THE YEAR ENDED {finYear}
          </p>
          <p className="text-[13px] font-bold uppercase text-red-600 leading-tight">
            {trustName}
          </p>
          <p className="text-[9.5px] font-bold text-red-600 leading-tight pb-3">
            {trustAddress ? (trustAddress.toLowerCase().startsWith('at') ? trustAddress : `At. ${trustAddress}`) : ''}
          </p>

          <div className="inline-block text-left text-[11px] font-bold space-y-0.5 pt-1">
            <p className="whitespace-nowrap">
              <span className="text-black">Registration No :- </span>
              <span className="text-red-600">{regNo}</span>
            </p>
            <p className="text-black whitespace-nowrap">
              Date : &nbsp; &nbsp; {date}
            </p>
          </div>
        </div>

        {/* Bottom Auditor Details */}
        <div className="pb-1 space-y-0.5 text-black">
          <p className="text-[12px] font-bold uppercase tracking-wider">{audFirm}</p>
          <p className="text-[9.5px] font-bold uppercase tracking-wide">{audStatus}</p>
          <div className="text-[8.5px] font-bold pt-0.5 leading-snug">
            {audName && <p>{audName}</p>}
            {(audMem || audReg) && (
              <p>
                {audMem ? `M.No: ${audMem}` : ''}
                {audReg ? ` | F.R.No: ${audReg}` : ''}
              </p>
            )}
            {audAddr && <p className="max-w-[95%] mx-auto">Address : - {audAddr}</p>}
            {audEmail && <p>Email. Id- {audEmail}</p>}
            {audMobile && <p>Mob.No- {audMobile}</p>}
          </div>
        </div>
      </div>
    </A4Page>
  );
};

// Permissions and Disclosures
export const PermissionsPage = ({ formData }) => (
  <A4Page pageLabel="Page 2 — Permissions">
    <div className="text-[5.5px] leading-relaxed">
      {/* Header */}
      <div className="text-center mb-3 space-y-0.5">
        <p className="font-bold text-[7px] leading-tight">
          Report of an auditor relating to accounts audited under sub section (2) of Section 33 & 34 and the rule 19 of the Bombay Trust Act 1950.
        </p>
        <div className="flex justify-between text-[5px] text-slate-600 mt-2 px-1">
          <div className="text-left space-y-0.5">
            <p><span className="font-bold">Name of the trust:</span> {getTrustName(formData)}</p>
            <p><span className="font-bold">Registration No:</span> {getRegistrationNo(formData)}</p>
          </div>
          <div className="text-right space-y-0.5">
            <p>{getTrustAddress(formData)}</p>
            <p><span className="font-bold">For the Year Ending:</span> {getFinancialYear(formData)}</p>
          </div>
        </div>
      </div>

      <table className="w-full border-collapse border border-slate-300 text-[5px]">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-300 p-1 text-left w-[6%]">Sr.</th>
            <th className="border border-slate-300 p-1 text-left">Particulars</th>
            <th className="border border-slate-300 p-1 text-center w-[18%]">Yes / No / N/A</th>
          </tr>
        </thead>
        <tbody>
          {permissionsQuestions.map((q, i) => {
            const val = formData[`perm_${i}`];
            const displayVal = val === 'yes' ? 'Yes' : val === 'no' ? 'No' : val === 'NA' ? 'N/A' : (val || 'N/A');
            return (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                <td className="border border-slate-200 p-1 text-center font-bold">{i + 1}</td>
                <td className="border border-slate-200 p-1 leading-tight">{q}</td>
                <td className="border border-slate-200 p-1 text-center font-bold">
                  {displayVal}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-3 flex justify-between items-end px-1">
        <p className="text-[5px] text-slate-500">Date :- {getDate(formData)}</p>
        <div className="text-right text-[5px] space-y-0.5">
          <p className="font-bold text-[6px]">{getAuditorFirm(formData)}</p>
          <p className="text-slate-400">{getAuditorStatus(formData)}</p>
        </div>
      </div>
    </div>
  </A4Page>
);

// Schedule & Deductions IX
export const ScheduleIXPage = ({ formData }) => {
  const getNum = (key) => parseFloat(formData[key] || 0);

  const subTotalIncRent = getNum("inc_rent_accrued_inner") + getNum("inc_rent_realised_inner") + getNum("inc_rent_total_outer");
  const subTotalIncInterest =
    getNum("inc_interest_accrued_inner") + getNum("inc_interest_realised_inner") +
    getNum("inc_interest_securities_inner") + getNum("inc_interest_loan_inner") +
    getNum("inc_interest_bank_inner") + getNum("inc_interest_total_outer");

  const autoIncomeShown =
    subTotalIncRent +
    subTotalIncInterest +
    (getNum("inc_dividend_outer") || getNum("inc_dividend_inner") || getNum("inc_dividend")) +
    (getNum("inc_donations_outer") || getNum("inc_donations_inner") || getNum("inc_donations")) +
    (getNum("inc_grants_outer") || getNum("inc_grants_inner") || getNum("inc_grants")) +
    (getNum("inc_other_sources_outer") || getNum("inc_other_sources_inner") || getNum("inc_other_sources")) +
    (getNum("inc_transfer_reserve_outer") || getNum("inc_transfer_reserve_inner") || getNum("inc_transfer_reserve"));

  const grossIncome = autoIncomeShown > 0 ? autoIncomeShown : parseFloat(formData.sch_income_shown || 0);

  const totalDeductions = scheduleIXItems.reduce((sum, item) => {
    if (item.type === 'group') {
      return sum + item.subItems.reduce((s, sub) => s + (parseFloat(formData[sub.key]) || 0), 0);
    }
    return sum + (parseFloat(formData[item.key]) || 0);
  }, 0);
  const netIncome = Math.max(0, grossIncome - totalDeductions);

  return (
    <A4Page pageLabel="Page 3 — Schedule IX C">
      <div className="text-[5.5px] leading-relaxed font-serif">
        <div className="text-center mb-2 space-y-0.5 font-bold">
          <p className="text-[7.5px]">The Bombay Public Trusts Act 1950</p>
          <p className="text-[7px]">SCHEDULE - IX C</p>
          <p className="text-[5.5px] font-normal text-slate-600">( VIDE RULE 32 )</p>
          <p className="text-[5.5px] uppercase">
            STATEMENT IN INCOME TO CONTRIBUTION FOR THE YEAR ENDING : {getFinancialYear(formData)}
          </p>
          <p className="text-[6.5px] uppercase">
            Name of the Trust :- {getTrustName(formData)}
          </p>
          <p className="text-[5.5px]">
            {getTrustAddress(formData) ? (getTrustAddress(formData).toLowerCase().startsWith('at') ? getTrustAddress(formData) : `At. ${getTrustAddress(formData)}`) : ''}
          </p>
          <p className="text-[5.5px]">
            Registration No-{getRegistrationNo(formData)}
          </p>
        </div>

        <table className="w-full border-collapse border border-black text-[5px]">
          <thead>
            <tr>
              <th colSpan={2} className="border border-black h-3"></th>
              <th className="border border-black font-bold text-center w-[18%] text-[6px]">Rs.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black font-bold text-center w-[6%] p-1 align-top">I.</td>
              <td className="border border-black font-bold p-1 align-top">
                Income as showan in the income and Expenditure Account (Schedule IX)
              </td>
              <td className="border border-black font-bold text-center p-1 align-middle">
                {grossIncome ? Number(grossIncome).toLocaleString('en-IN') : ''}
              </td>
            </tr>

            <tr>
              <td className="border border-black font-bold text-center w-[6%] p-1 align-top">II.</td>
              <td className="border border-black p-1 align-top text-[4.8px] leading-tight">
                <p className="font-bold mb-0.5">Items not chargeable to contribution under Section 58 and Rules 32</p>
                <div>i) Donations received from other Public Trust and Dharmadas:</div>
                <div>ii) Grants received from Government and local authorities:</div>
                <div>iii) Interest or Sinking or Depreciation Fund:</div>
                <div>iv) Amount spent for the purpose of secular education:</div>
                <div>v) Amount spent for the purpose of medical relief:</div>
                <div>vi) Amount spent for the purpose of veterinary treatment of animals:</div>
                <div>vii) Expenditure incurred from donations for relief of distress caused by scarcity, drought, flood, fire or other natural calamity:</div>
                <div>viii) Deductions out of income from lands used for agricultural purpose:</div>
                <div className="pl-2">a] Land Revenue and local Fund cess:</div>
                <div className="pl-2">b] Rent payable to superior landlord:</div>
                <div className="pl-2">c] Cost of production, if lands are cultivated by trust:</div>
                <div>ix) Deductions out of income from lands used for non agricultural purpose:</div>
                <div className="pl-2">a] Assessment, cesses and other Government or Municipal taxes:</div>
                <div className="pl-2">b] Ground rent payable to the superior landlord:</div>
                <div className="pl-2">c] Insurance premia:</div>
                <div className="pl-2">d] Repairs at 10% of gross rent of Building let out:</div>
                <div className="pl-2">e] Cost of Collection at 4 percent of gross rent of buildings let out:</div>
                <div>x) Cost of collection of income or receipts from securities, stocks etc at 1% of such income:</div>
                <div>xi) Deduction on account of repairs in respect of building not rented and yielding no income at 10% of the estimated gross annual rent:</div>
              </td>
              <td className="border border-black font-bold text-center p-1 align-middle">
                {totalDeductions > 0 ? totalDeductions.toLocaleString('en-IN') : ''}
              </td>
            </tr>

            <tr>
              <td colSpan={2} className="border border-black font-bold p-1">
                Gross Annual Income chargeable to contribution Rs.
              </td>
              <td className="border border-black font-bold text-center p-1">
                {netIncome > 0 ? netIncome.toLocaleString('en-IN') : (grossIncome > 0 ? '0' : '')}
              </td>
            </tr>
          </tbody>
        </table>

        <p className="text-[4.8px] text-justify leading-tight mt-1.5 px-0.5">
          Certified that while claiming deductions admissible under the above Sehedule,the Trust has not claimedany amount twice either wholly or partly, against any of the items mentioned in the Sehedule while have the effect of double-deductions.
        </p>

        <div className="mt-2 text-[5px] font-bold space-y-0.5">
          <p>Date :- {getDate(formData)}</p>
          <p>Trust Address:- {getTrustAddress(formData)}</p>
        </div>
      </div>
    </A4Page>
  );
};

// Income & Expenditure Account Table          
export const IncomeExpPage = ({ formData }) => {
  const getNum = (key) => parseFloat(formData[key] || 0);

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
    subTotalExpProperties + getNum("exp_establishment") + getNum("exp_remuneration_trustees") +
    getNum("exp_remuneration_head") + getNum("exp_legal") + getNum("exp_audit") +
    getNum("exp_contribution_fees") + subTotalWrittenOff + getNum("exp_misc") +
    getNum("exp_depreciations") + getNum("exp_transfer_reserve") + subTotalObjectsTrust;

  const subTotalIncRent = getNum("inc_rent_accrued_inner") + getNum("inc_rent_realised_inner") + getNum("inc_rent_total_outer");
  const subTotalIncInterest =
    getNum("inc_interest_accrued_inner") + getNum("inc_interest_realised_inner") +
    getNum("inc_interest_securities_inner") + getNum("inc_interest_loan_inner") +
    getNum("inc_interest_bank_inner") + getNum("inc_interest_total_outer");

  const baseIncomeTotal =
    subTotalIncRent + subTotalIncInterest +
    (getNum("inc_dividend_outer") || getNum("inc_dividend_inner") || getNum("inc_dividend")) +
    (getNum("inc_donations_outer") || getNum("inc_donations_inner") || getNum("inc_donations")) +
    (getNum("inc_grants_outer") || getNum("inc_grants_inner") || getNum("inc_grants")) +
    (getNum("inc_other_sources_outer") || getNum("inc_other_sources_inner") || getNum("inc_other_sources")) +
    (getNum("inc_transfer_reserve_outer") || getNum("inc_transfer_reserve_inner") || getNum("inc_transfer_reserve"));

  const netBalance = baseIncomeTotal - baseExpenditureTotal;
  const autoCalculatedSurplus = netBalance > 0 ? netBalance : 0;
  const surplus = formData["exp_surplus_override"] !== undefined && formData["exp_surplus_override"] !== ""
    ? getNum("exp_surplus_override")
    : autoCalculatedSurplus;
  const deficit = netBalance < 0 ? Math.abs(netBalance) : 0;

  const expTotal = baseExpenditureTotal + surplus;
  const incTotal = baseIncomeTotal + deficit;

  // Build flattened rows to match 6-column table layout perfectly
  const expRows = [];
  expenditureItems.forEach((exp) => {
    if (exp.type === 'standalone') {
      expRows.push({
        label: <span className="font-bold">{exp.label}</span>,
        inner: formData[`${exp.key}_inner`],
        outer: formData[exp.key],
        isLastNested: true
      });
    } else if (exp.type === 'nested') {
      expRows.push({ label: <span className="font-bold text-black">{exp.label}</span>, inner: '', outer: '' });
      exp.subFields.forEach((sub, idx) => {
        const isLast = idx === exp.subFields.length - 1;
        let subTotal = "";
        if (isLast) {
          if (exp.key === "exp_properties") subTotal = subTotalExpProperties;
          if (exp.key === "exp_amount_written_off") subTotal = subTotalWrittenOff;
          if (exp.key === "exp_objects_of_trust") subTotal = subTotalObjectsTrust;
        }
        expRows.push({
          label: <span className="pl-3.5 text-slate-700 font-normal">{sub.label}</span>,
          inner: formData[sub.key],
          outer: subTotal,
          isLastNested: isLast
        });
      });
    }
  });
  expRows.push({
    label: <span className="font-bold text-black">To Surplus Carried Over To Balance Sheet</span>,
    inner: '',
    outer: surplus > 0 ? surplus : '',
    isLastNested: true
  });

  const incRows = [];
  incomeItems.forEach((inc) => {
    if (inc.key === 'inc_deficit_row') return; // Skip, will add explicitly at the bottom

    if (inc.type === 'nested') {
      incRows.push({ label: <span className="font-bold text-black">{inc.label}</span>, inner: '', outer: '' });
      inc.subFields.forEach((sub, idx) => {
        const isLast = idx === inc.subFields.length - 1;
        let outerVal = '';
        if (sub.type === "double_field" || isLast) {
          if (formData[sub.outerKey]) {
            outerVal = formData[sub.outerKey];
          } else if (isLast) {
            outerVal = inc.key === "inc_rent_header" ? subTotalIncRent : subTotalIncInterest;
          }
        }
        incRows.push({
          label: <span className="pl-3.5 text-slate-700 font-normal">{sub.label}</span>,
          inner: formData[sub.innerKey],
          outer: outerVal,
          isLastNested: isLast
        });
      });
    } else if (inc.type === 'double_field') {
      const innerVal = formData[inc.innerKey];
      const outerVal = formData[inc.outerKey] || formData[inc.key];
      incRows.push({
        label: <span className="font-bold">{inc.label}</span>,
        inner: innerVal,
        outer: outerVal,
        isLastNested: true
      });
    } else {
      incRows.push({
        label: <span className="font-bold">{inc.label}</span>,
        inner: '',
        outer: inc.outerKey ? formData[inc.outerKey] : '',
        isLastNested: true
      });
    }
  });
  incRows.push({
    label: <span className="font-bold">By Deficit Carried Over To Balance Sheet</span>,
    inner: '',
    outer: deficit > 0 ? deficit : '',
    isLastNested: true
  });

  const maxRows = Math.max(expRows.length, incRows.length);

  return (
    <A4Page pageLabel="Page 3.2 — Income & Expenditure">
      <div className="text-[5.5px]">
        <div className="text-center mb-2 space-y-0.5">
          <p className="font-bold text-[7px]">The Bombay Public Trusts Act 1950</p>
          <p className="font-bold text-[6px]">SCHEDULE IX (VIDE RULE 17(1))</p>
          <p className="text-[5px] mt-1">
            INCOME AND EXPENDITURE A/C FOR THE YEAR {getFinancialYear(formData)}
          </p>
          <p className="text-[5px] text-slate-500">{getTrustName(formData)}</p>
        </div>

        <table className="w-full border-collapse border border-slate-300 text-[5px]">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 p-1 text-left w-[26%]">EXPENDITURE</th>
              <th className="border border-slate-300 p-1 text-right w-[12%]">Rs.</th>
              <th className="border border-slate-300 p-1 text-right w-[12%]">Rs.</th>
              <th className="border border-slate-300 p-1 text-left w-[26%]">INCOME</th>
              <th className="border border-slate-300 p-1 text-right w-[12%]">Rs.</th>
              <th className="border border-slate-300 p-1 text-right w-[12%]">Rs.</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxRows }).map((_, i) => {
              const eRow = expRows[i];
              const iRow = incRows[i];

              return (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="border-l border-r border-slate-300 p-1 leading-tight">{eRow?.label}</td>
                  <td className={`border-r border-slate-300 p-1 text-right font-mono align-bottom ${eRow?.isLastNested && eRow?.inner ? 'border-b' : ''}`}>
                    {eRow && fmt(eRow.inner)}
                  </td>
                  <td className={`border-r border-slate-300 p-1 text-right font-mono align-bottom ${eRow?.isLastNested ? 'border-b' : ''}`}>
                    {eRow && fmt(eRow.outer)}
                  </td>

                  <td className="border-r border-slate-300 p-1 leading-tight">{iRow?.label}</td>
                  <td className={`border-r border-slate-300 p-1 text-right font-mono align-bottom ${iRow?.isLastNested && iRow?.inner ? 'border-b' : ''}`}>
                    {iRow && fmt(iRow.inner)}
                  </td>
                  <td className={`border-r border-slate-300 p-1 text-right font-mono align-bottom ${iRow?.isLastNested ? 'border-b' : ''}`}>
                    {iRow && fmt(iRow.outer)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-blue-50 font-bold">
              <td className="border border-blue-200 p-1.5 text-blue-800">TOTAL</td>
              <td className="border border-blue-200 p-1.5 text-right font-mono"></td>
              <td className="border border-blue-200 p-1.5 text-right font-mono text-blue-700">{fmt(expTotal) || '0.00'}</td>
              <td className="border border-blue-200 p-1.5 text-blue-800">TOTAL</td>
              <td className="border border-blue-200 p-1.5 text-right font-mono"></td>
              <td className="border border-blue-200 p-1.5 text-right font-mono text-blue-700">{fmt(incTotal) || '0.00'}</td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-2 flex justify-between items-end px-1 text-[5px]">
          <p className="text-slate-500">As per our report of even date.</p>
          <div className="text-right space-y-0.5">
            <p className="font-bold text-[6px]">{getAuditorFirm(formData)}</p>
            <p className="text-slate-400">{getAuditorStatus(formData)}</p>
          </div>
        </div>
      </div>
    </A4Page>
  );
};

// PAGE 4 — Balance Sheet                                    
export const BalanceSheetPage = ({ formData }) => {
  const getNum = (key) => parseFloat(formData[key] || 0);

  // Balance Sheet Totals & Subtotals calculation
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

  let flTotal = 0;
  fundsLiabilitiesItems.forEach(item => {
    if (item.type === 'nested') {
      flTotal += calcGroupSubTotal(item.key);
    } else if (item.type === 'double_field') {
      flTotal += getNum(item.outerKey) || getNum(item.innerKey);
    } else {
      flTotal += getNum(item.outerKey || item.key);
    }
  });

  let paTotal = 0;
  propertyAssetsItems.forEach(item => {
    if (item.type === 'nested') {
      paTotal += calcGroupSubTotal(item.key);
    } else if (item.type === 'double_field') {
      paTotal += getNum(item.outerKey) || getNum(item.innerKey);
    } else {
      paTotal += getNum(item.outerKey || item.key);
    }
  });

  const buildRows = (items) => {
    const rows = [];
    items.forEach(item => {
      if (item.type === 'nested') {
        rows.push({ label: item.label, inner: null, outer: null, isHeader: true });
        const groupTotal = calcGroupSubTotal(item.key);
        item.subFields.forEach((sub, idx) => {
          const isLast = idx === item.subFields.length - 1;
          const innerKey = sub.innerKey || sub.key;
          const innerVal = formData[innerKey];
          const outerVal = sub.outerKey ? formData[sub.outerKey] : null;
          const finalOuter = outerVal !== null && outerVal !== undefined && outerVal !== ''
            ? outerVal
            : (isLast && groupTotal !== 0 ? groupTotal : null);

          rows.push({
            label: sub.label,
            inner: innerVal !== undefined && innerVal !== '' && Number(innerVal) !== 0 ? innerVal : null,
            outer: finalOuter,
            isLast,
            isSubItem: true
          });
        });
      } else if (item.type === 'double_field') {
        const innerVal = formData[item.innerKey];
        const outerVal = formData[item.outerKey];
        rows.push({
          label: item.label,
          inner: innerVal !== undefined && innerVal !== '' && Number(innerVal) !== 0 ? innerVal : null,
          outer: outerVal || innerVal || null,
          isHeader: true,
          isLast: true
        });
      } else {
        const val = formData[item.outerKey || item.key];
        rows.push({
          label: item.label,
          inner: null,
          outer: val || null,
          isHeader: true,
          isLast: true
        });
      }
    });
    return rows;
  };

  const flRows = buildRows(fundsLiabilitiesItems);
  const paRows = buildRows(propertyAssetsItems);
  const maxRows = Math.max(flRows.length, paRows.length);

  return (
    <A4Page pageLabel="Page 4 — Balance Sheet">
      <div className="text-[5px]">
        <div className="text-center mb-2 space-y-0.5">
          <p className="font-bold text-[7px]">The Bombay Public Trusts Act 1950.</p>
          <p className="font-bold text-[6px]">SCHEDULE VII (VIDE RULE 17(1))</p>
          <p className="text-[5px] mt-1">
            Name of the Trust :- {getTrustName(formData)} | Reg. No:- {getRegistrationNo(formData)}
          </p>
          <p className="font-bold text-[6px] mt-1">BALANCE SHEET AS ON {getFinancialYear(formData)}</p>
        </div>

        <table className="w-full border-collapse border border-slate-300 text-[4.5px]">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 p-1 text-left w-[26%]">Funds &amp; Liabilities</th>
              <th className="border border-slate-300 p-0.5 text-center w-[10%]">Rs.</th>
              <th className="border border-slate-300 p-0.5 text-center w-[10%]">Rs.</th>
              <th className="border border-slate-300 p-1 text-left w-[26%]">Property &amp; Assets</th>
              <th className="border border-slate-300 p-0.5 text-center w-[10%]">Rs.</th>
              <th className="border border-slate-300 p-0.5 text-center w-[10%]">Rs.</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxRows }).map((_, i) => {
              const fl = flRows[i];
              const pa = paRows[i];
              return (
                <tr key={i}>
                  {/* FL side */}
                  <td className="border-l border-r border-slate-200 p-0.5 leading-tight">
                    {fl && <span className={fl.isSubItem ? 'pl-3.5 text-slate-700 font-normal' : 'font-bold text-black'}>{fl.label}</span>}
                  </td>
                  <td className={`border-r border-slate-200 p-0.5 text-right font-mono align-bottom ${fl?.isLast && fl?.inner != null ? 'border-b border-slate-400' : ''}`}>
                    {fl && fl.inner != null ? fmt(fl.inner) : ''}
                  </td>
                  <td className={`border-r border-slate-200 p-0.5 text-right font-mono font-bold align-bottom ${fl?.isLast && fl?.outer != null ? 'border-b border-slate-400' : ''}`}>
                    {fl && fl.outer != null ? fmt(fl.outer) : ''}
                  </td>
                  {/* PA side */}
                  <td className="border-r border-slate-200 p-0.5 leading-tight">
                    {pa && <span className={pa.isSubItem ? 'pl-3.5 text-slate-700 font-normal' : 'font-bold text-black'}>{pa.label}</span>}
                  </td>
                  <td className={`border-r border-slate-200 p-0.5 text-right font-mono align-bottom ${pa?.isLast && pa?.inner != null ? 'border-b border-slate-400' : ''}`}>
                    {pa && pa.inner != null ? fmt(pa.inner) : ''}
                  </td>
                  <td className={`border-r border-slate-200 p-0.5 text-right font-mono font-bold align-bottom ${pa?.isLast && pa?.outer != null ? 'border-b border-slate-400' : ''}`}>
                    {pa && pa.outer != null ? fmt(pa.outer) : ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-blue-50 font-bold">
              <td className="border border-blue-200 p-1 text-blue-800">TOTAL</td>
              <td className="border border-blue-200 p-1 text-right font-mono"></td>
              <td className="border border-blue-200 p-1 text-right font-mono text-blue-700">{fmt(flTotal) || '0.00'}</td>
              <td className="border border-blue-200 p-1 text-blue-800">TOTAL</td>
              <td className="border border-blue-200 p-1 text-right font-mono"></td>
              <td className="border border-blue-200 p-1 text-right font-mono text-blue-700">{fmt(paTotal) || '0.00'}</td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-2 flex justify-between items-end px-1 text-[5px]">
          <p className="text-slate-500">As per our report of even date.</p>
          <div className="text-right space-y-0.5">
            <p className="font-bold text-[6px]">{getAuditorFirm(formData)}</p>
            <p className="text-slate-400">{getAuditorStatus(formData)}</p>
          </div>
        </div>
      </div>
    </A4Page>
  );
};

//  PAGE 5 — Receipt & Payment Account                        
export const ReceiptPaymentPage = ({ formData }) => {
  const getNum = (k) => parseFloat(formData[k] || 0);

  // Opening Balance
  const openCash = getNum('rec_op_cash');
  const openBank = getNum('rec_op_bank');
  const openTotal = getNum('rec_open_total') || (openCash + openBank);

  // Receipts
  const recReceipts = getNum('rec_receipts_total') || getNum('rec_receipts');
  const recMembers = getNum('rec_members_total') || getNum('rec_members');
  const recDonation = getNum('rec_donation_total') || getNum('rec_donation');

  const customRecs = Object.keys(formData)
    .filter(k => k.startsWith('rec_custom_') && !k.endsWith('_label'))
    .map(k => ({ label: formData[`${k}_label`] || 'Custom Receipt', value: getNum(k) }));

  const customRecTotal = customRecs.reduce((s, r) => s + r.value, 0);
  const recTotal = openTotal + recReceipts + recMembers + recDonation + customRecTotal;

  // Expenses
  const expItems = [
    { key: 'pay_meeting', label: 'By Meeting Exp.' },
    { key: 'pay_traveling', label: 'By Travaling Exp.' },
    { key: 'pay_printing', label: 'By Printing & Stationery Exp.' },
    { key: 'pay_misc', label: 'By Miscellenious Exp.' },
    { key: 'pay_education', label: 'By Education Exp.' },
    { key: 'pay_swachata', label: 'By Swachata Abhiyan Exp.' },
    { key: 'pay_cultural', label: 'By Cultural Program Exp.' },
    { key: 'pay_tree', label: 'By Tree Plantation Exp.' },
    { key: 'pay_audit', label: 'By Audit Fess' }
  ];

  const expIndividualSum = expItems.reduce((s, it) => s + (getNum(it.key) || getNum(`${it.key}_total`)), 0);
  const expTotalEntered = getNum('pay_expenses_total') || getNum('pay_expenses') || getNum('pay_audit_total');
  const finalExpensesTotal = expIndividualSum > 0 ? expIndividualSum : expTotalEntered;

  // Closing Balance
  const closeCash = getNum('pay_cl_cash');
  const closeBank = getNum('pay_cl_bank');
  const closeTotal = getNum('pay_close_total') || (closeCash + closeBank);

  const customPays = Object.keys(formData)
    .filter(k => k.startsWith('pay_custom_') && !k.endsWith('_label'))
    .map(k => ({ label: formData[`${k}_label`] || 'Custom Payment', value: getNum(k) }));

  const customPayTotal = customPays.reduce((s, p) => s + p.value, 0);
  const payTotal = finalExpensesTotal + closeTotal + customPayTotal;

  // Build Left (Receipts) rows list matching SHISODE2026 format
  const leftRows = [
    { label: 'To Opening Balance', inner: null, outer: null, isHeader: true },
    { label: 'CASH', inner: openCash > 0 ? openCash : null, outer: null, isSubItem: true },
    { label: 'BANK', inner: (openBank > 0 || openCash > 0) ? (openBank === 0 ? '0.00' : openBank) : null, outer: openTotal > 0 ? openTotal : null, isSubItem: true },
    { label: '', inner: null, outer: null },
    { label: '', inner: null, outer: null },
    { label: 'To Receipts', inner: null, outer: null, isHeader: true },
    { label: 'To Member Contribution', inner: null, outer: recMembers > 0 ? recMembers : null, isHeader: false },
  ];

  if (recDonation > 0) {
    leftRows.push({ label: 'To Donation Received', inner: null, outer: recDonation, isHeader: false });
  }
  customRecs.forEach(cr => {
    if (cr.value > 0) {
      leftRows.push({ label: cr.label, inner: null, outer: cr.value, isHeader: false });
    }
  });

  // Build Right (Payments) rows list matching SHISODE2026 format
  const rightRows = [
    { label: 'By Expenses', inner: null, outer: null, isHeader: true },
  ];

  expItems.forEach((it, idx) => {
    const isLast = idx === expItems.length - 1;
    const val = getNum(it.key) || getNum(`${it.key}_total`);
    const outerVal = isLast && finalExpensesTotal > 0 ? finalExpensesTotal : null;
    rightRows.push({
      label: it.label,
      inner: val > 0 ? val : null,
      outer: outerVal,
      isSubItem: true
    });
  });

  rightRows.push({ label: '', inner: null, outer: null });
  rightRows.push({ label: '', inner: null, outer: null });
  rightRows.push({ label: 'BY CLOSING BALANCE', inner: null, outer: null, isHeader: true });
  rightRows.push({ label: 'CASH IN HAND', inner: closeCash > 0 ? closeCash : null, outer: null, isSubItem: true });
  rightRows.push({ label: 'BANK', inner: (closeBank > 0 || closeCash > 0) ? (closeBank === 0 ? '0.00' : closeBank) : null, outer: closeTotal > 0 ? closeTotal : null, isSubItem: true });

  customPays.forEach(cp => {
    if (cp.value > 0) {
      rightRows.push({ label: cp.label, inner: null, outer: cp.value, isHeader: false });
    }
  });

  const maxRows = Math.max(leftRows.length, rightRows.length);

  return (
    <A4Page pageLabel="Page 5 — Receipt & Payment">
      <div className="text-[5px]">
        <div className="text-center mb-2 space-y-0.5">
          <p className="font-bold text-[7px]">Name of the Trust :- {getTrustName(formData)}</p>
          <p className="text-[5px] mt-1">{getTrustAddress(formData)}</p>
          <p className="font-bold text-[6px] mt-1">Receipt &amp; Payment Account</p>
          <p className="text-[5px] mt-1">For the Period from 01.04.2025 to {getFinancialYear(formData)}</p>
        </div>

        <table className="w-full border-collapse border border-slate-300 text-[4.5px]">
          <thead>
            <tr className="bg-slate-100 font-bold">
              <th className="border border-slate-300 p-1 text-left w-[29%]">Receipt</th>
              <th className="border border-slate-300 p-0.5 text-center w-[10.5%]">Amount</th>
              <th className="border border-slate-300 p-0.5 text-center w-[10.5%]">Amount</th>
              <th className="border border-slate-300 p-1 text-left w-[29%]">Payments</th>
              <th className="border border-slate-300 p-0.5 text-center w-[10.5%]">Amount</th>
              <th className="border border-slate-300 p-0.5 text-center w-[10.5%]">Amount</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxRows }).map((_, i) => {
              const l = leftRows[i];
              const r = rightRows[i];
              return (
                <tr key={i} className="border-b border-slate-200">
                  {/* Receipt side */}
                  <td className="border-l border-r border-slate-200 p-0.5 leading-tight">
                    {l && (
                      <span className={l.isHeader ? 'font-bold text-black' : (l.isSubItem ? 'pl-3.5 text-slate-700 font-normal' : 'font-bold text-black')}>
                        {l.label}
                      </span>
                    )}
                  </td>
                  <td className="border-r border-slate-200 p-0.5 text-right font-mono align-bottom">
                    {l && l.inner != null ? (typeof l.inner === 'string' ? l.inner : fmt(l.inner)) : ''}
                  </td>
                  <td className="border-r border-slate-200 p-0.5 text-right font-mono font-bold align-bottom">
                    {l && l.outer != null ? fmt(l.outer) : ''}
                  </td>

                  {/* Payment side */}
                  <td className="border-r border-slate-200 p-0.5 leading-tight">
                    {r && (
                      <span className={r.isHeader ? 'font-bold text-black' : (r.isSubItem ? 'pl-3.5 text-slate-700 font-normal' : 'font-bold text-black')}>
                        {r.label}
                      </span>
                    )}
                  </td>
                  <td className="border-r border-slate-200 p-0.5 text-right font-mono align-bottom">
                    {r && r.inner != null ? (typeof r.inner === 'string' ? r.inner : fmt(r.inner)) : ''}
                  </td>
                  <td className="border-r border-slate-200 p-0.5 text-right font-mono font-bold align-bottom">
                    {r && r.outer != null ? fmt(r.outer) : ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 font-bold border-t-2 border-black">
              <td className="border border-slate-300 p-1 text-center font-bold">Total</td>
              <td className="border border-slate-300 p-0.5"></td>
              <td className="border border-slate-300 p-0.5 text-right font-mono font-bold text-[5.5px]">{fmt(recTotal) || '0.00'}</td>
              <td className="border border-slate-300 p-1 text-center font-bold">Total</td>
              <td className="border border-slate-300 p-0.5"></td>
              <td className="border border-slate-300 p-0.5 text-right font-mono font-bold text-[5.5px]">{fmt(payTotal) || '0.00'}</td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-2 flex justify-between items-end px-1 text-[5px]">
          <p className="text-slate-500">Examined As Per Books.</p>
          <div className="text-right space-y-0.5 mt-8">
            <p className="font-bold text-[6px]">Trustee</p>
          </div>
        </div>
        <div className="mt-4 px-1 text-[5px] space-y-0.5">
          <p>Registration No- {getRegistrationNo(formData)}</p>
          <p>Date :- {getDate(formData)}</p>
        </div>
      </div>
    </A4Page>
  );
};

// PAGE 6.1 — Schedule 9-D
export const Schedule9DPage = ({ formData }) => {
  const previousReturnsData = formData.sch9d_previousITReturns && formData.sch9d_previousITReturns.length > 0 
    ? formData.sch9d_previousITReturns 
    : [];
  const minReturns = 3;
  const totalReturns = Math.max(minReturns, previousReturnsData.length);
  const previousReturns = Array.from({ length: totalReturns }).map((_, i) => previousReturnsData[i] || { receiptNo: '', year: '' });
    
  const trusteesPanData = formData.sch9d_trusteesPan && formData.sch9d_trusteesPan.length > 0 
    ? formData.sch9d_trusteesPan 
    : [];
  const minTrustees = 9;
  const totalTrustees = Math.max(minTrustees, trusteesPanData.length);
  const trusteesPan = Array.from({ length: totalTrustees }).map((_, i) => trusteesPanData[i] || { name: '', pan: '' });

  return (
    <A4Page pageLabel="Page 7 — Schedule 9-D">
      <div className="text-[7.5px] font-sans leading-relaxed">
        <div className="text-center space-y-0.5 mb-3 font-bold">
          <p className="text-[11px] tracking-wide">"SCHEDULE IX-D"</p>
          <p className="text-[8px] font-normal">[See rule 19 (2A)]</p>
          <p className="mt-1 text-[8px] font-normal">Information to be submitted by the Auditor along with Audit Report under</p>
          <p className="text-[8px] font-normal">sub-section (1) of section 34 of the Maharashtra Public Trusts Act.</p>
        </div>

        <table className="w-full border-collapse border border-black text-[7.5px] mt-2">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-black p-1.5 w-[8%] text-center font-bold">Sr.<br/>No.</th>
              <th className="border border-black p-1.5 w-[44%] text-center font-bold">Particulars</th>
              <th className="border border-black p-1.5 text-center font-bold">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2 text-center align-middle font-bold">1.</td>
              <td className="border border-black p-2 align-middle">PAN No. of Trust.</td>
              <td className="border border-black p-2 align-middle font-mono font-bold">{formData.sch9d_trustPan}</td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-center align-middle font-bold">2.</td>
              <td className="border border-black p-2 align-middle">Registration No. with date of registration under section 12AA of Income Tax Act, 1961 (43 of 1961).</td>
              <td className="border border-black p-2 align-middle">{formData.sch9d_incomeTaxRegistration}</td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-center align-middle font-bold">3.</td>
              <td className="border border-black p-2 align-middle">Acknowledgement No. with date of filing of the Return of Income for earlier three years.</td>
              <td className="border border-black p-0 align-top">
                <table className="w-full h-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border-b border-r border-black p-1.5 font-bold w-12 text-center">Sr.<br/>No.</th>
                      <th className="border-b border-r border-black p-1.5 font-bold text-center">Acknowledgement No.</th>
                      <th className="border-b border-black p-1.5 font-bold w-20 text-center">Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previousReturns.map((item, index) => (
                      <tr key={index}>
                        <td className={`border-r border-black p-1.5 text-center ${index !== previousReturns.length - 1 ? 'border-b' : ''}`}>{['(i)', '(ii)', '(iii)', '(iv)', '(v)'][index] || `(${index + 1})`}</td>
                        <td className={`border-r border-black p-1.5 text-center font-mono ${index !== previousReturns.length - 1 ? 'border-b' : ''}`}>{item.receiptNo || ''}</td>
                        <td className={`p-1.5 text-center ${index !== previousReturns.length - 1 ? 'border-b' : ''}`}>{item.year || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-center align-middle font-bold">4.</td>
              <td className="border border-black p-2 align-middle">PAN No. of all Trustees.</td>
              <td className="border border-black p-0 align-top">
                <table className="w-full h-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border-b border-r border-black p-1.5 font-bold w-12 text-center">Sr.<br/>No.</th>
                      <th className="border-b border-r border-black p-1.5 font-bold text-center">Name of Trustee</th>
                      <th className="border-b border-black p-1.5 font-bold w-24 text-center">PAN No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trusteesPan.map((item, index) => (
                      <tr key={index}>
                        <td className={`border-r border-black p-1.5 text-center ${index !== trusteesPan.length - 1 ? 'border-b' : ''}`}>{`(${index + 1})`}</td>
                        <td className={`border-r border-black p-1.5 text-left ${index !== trusteesPan.length - 1 ? 'border-b' : ''}`}>{item.name}</td>
                        <td className={`p-1.5 text-center font-mono ${index !== trusteesPan.length - 1 ? 'border-b' : ''}`}>{item.pan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </A4Page>
  );
};

// PAGE 6.2 — Delay Exemption (Marathi)
export const DelayExemptionPage = ({ formData }) => {
  return (
    <A4Page pageLabel="Page 8 — Delay Exemption">
      <div className="text-[7px] font-sans leading-relaxed space-y-3">
        <div style={{ float: 'left', width: '45px', height: '55px', border: '1px dashed #000', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '5px', padding: '2px', lineHeight: '1.25', fontWeight: 'bold' }}>
          तिकीट चिकटविण्याची जागा
        </div>
        <h2 className="text-[12px] font-bold text-center border-b border-slate-300 pb-2 mb-4" style={{ marginTop: '10px' }}>विलंब माफीचा अर्ज</h2>
        <div style={{ clear: 'both' }}></div>

        <p className="pl-4">
          वय {formData.delay_applicantAge || '४०'} वर्ष पत्ता- {formData.delay_applicantAddress || 'रा.कोपर्डी ता.भोकरदन जि.जालना'} सत्य प्रतिज्ञेवर खालील प्रमाणे कथन करतो की,
        </p>

        <p>
          1) मी {formData.delay_applicantName || '__________________'} {formData.sch9d_trustNameMarathi || getTrustName(formData)} {formData.delay_applicantAddress || '__________________'} या सार्वजनिक न्यास नोंदणी क्रमांक {formData.sch9d_registrationNoMarathi || getRegistrationNo(formData)} या न्यासाचा {formData.delay_designation || 'विश्वस्त / सचिव / अध्यक्ष'} आहे.
        </p>

        <p className="pl-4">
          सदर न्यास हा दिनांक {formData.delay_trustRegistrationDate || '-  /  /20  '} रोजी नोंदविण्यात आलेला आहे.
        </p>

        <p>
          2) सदर न्यासाचे आर्थिक वर्ष {formData.delay_financialYearMarathi || '2023-24'} चे लेखापरिक्षण अहवाल या कार्यालयात एक एप्रिल पासुन सहा महिन्याच्या आत दाखल करणे आवश्यक होते. परंतु सदर <span className="font-bold">अनावधाने</span> आज रोजी सदर न्यासाचा लेखापरिक्षण अहवाल या कार्यालयात दाखल करीत आहे. सदरचा लेखापरिक्षण अहवाल वेळेत दाखल करण्यात झालेला विलंब हा हेतुपुरस्कर झालेला नाही. या पुढे लेखापरिक्षण अहवाल वेळेत दाखल करण्यात येईल याची दक्षता घेण्यात येईल.
        </p>

        <p>
          3) सदर लेखापरिक्षण अहवाल दाखल करण्यास झालेला उशीर न्यासाचे हितार्थ दृष्टीकोनातुन माफ करण्यात येवून लेखापरिक्षण अहवाल स्विकृत करावा हि विनंती.
        </p>

        <div className="mt-8 flex justify-between items-start">
          <div className="space-y-2">
            <p>स्थळ - {formData.delay_place || 'जालना'}</p>
            <p>दिनांक - {formData.delay_date || '07/01/2026'}</p>
          </div>
          <div className="text-right space-y-8">
            <p>अर्जदाराची</p>
            <p>स्वाक्षरी</p>
          </div>
        </div>

        <h3 className="font-bold text-center mt-6">-: सत्यापन :-</h3>

        <p>
          मी {formData.delay_applicantName || 'कृष्णा लक्ष्मण साबळे'} वय {formData.delay_applicantAge || '४०'} वर्ष पत्ता- {formData.delay_applicantAddress || 'रा. कोपर्डी ता. भोकरदन जि. जालना'} सत्य प्रतिज्ञेवर प्रमाणे कथन करतो की, सदर अर्जातील परिच्छेद क्रमांक 1 ते 3 मजकुर हा माझ्या माहितीप्रमाणे खरा व बरोबर असुन त्याचे सत्यतेसाठी मी सदर प्रतिज्ञापत्र सादर करीत आहे.
        </p>

        <div className="mt-8 flex justify-between items-start">
          <div className="space-y-2">
            <p>स्थळ - {formData.delay_place || 'जालना'}</p>
            <p>दिनांक - {formData.delay_date || '07/01/2026'}</p>
          </div>
          <div className="text-right space-y-8">
            <p>अर्जदाराची</p>
            <p>स्वाक्षरी</p>
          </div>
        </div>
        <div className="text-center mt-8 font-bold">
          माझे समक्ष
        </div>
      </div>
    </A4Page>
  );
};

// PAGE 9 — Trustee List (Marathi)
export const TrusteeListPage = ({ formData }) => {
  const trusteesPan = formData.sch9d_trusteesPan && formData.sch9d_trusteesPan.length > 0 
    ? formData.sch9d_trusteesPan 
    : [];

  const minRows = 9;
  const totalRows = Math.max(minRows, trusteesPan.length);
  const rows = Array.from({ length: totalRows }).map((_, i) => trusteesPan[i] || { name: '', pan: '' });

  return (
    <A4Page pageLabel="Page 9 — Trustee List">
      <div className="text-[6.5px] font-sans">
        <div className="text-center space-y-1 mb-6 font-bold pb-2">
          <h2 className="text-[9px] font-bold">विश्वस्तांची यादी</h2>
          <p className="text-[7px] font-normal">(List of Trustees)</p>
        </div>

        <table className="w-full border-collapse border border-black text-[6.5px]">
          <thead>
            <tr>
              <th className="border border-black p-1.5 w-[10%] text-center font-bold">अ.क्र.</th>
              <th className="border border-black p-1.5 w-[60%] text-center font-bold">विश्वस्ताचे नाव (Name of Trustee)</th>
              <th className="border border-black p-1.5 w-[30%] text-center font-bold">पॅन कार्ड क्रमांक (PAN No.)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item, index) => (
              <tr key={index}>
                <td className="border border-black p-1.5 text-center font-bold">{index + 1}</td>
                <td className="border border-black p-1.5 text-left">{item.name || ''}</td>
                <td className="border border-black p-1.5 text-center font-mono">{item.pan || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </A4Page>
  );
};

//MAIN LIVE PREVIEW COMPONENT                               
const LivePreview = ({ currentStep, formData, zoom = 100, setZoom }) => {
  const viewportRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [previewPage, setPreviewPage] = React.useState(1);

  const handleFit = React.useCallback(() => {
    if (!viewportRef.current) return;

    const viewport = viewportRef.current;
    const vWidth = viewport.clientWidth - (isFullscreen ? 120 : 80); // Subtract padding
    const vHeight = viewport.clientHeight - (isFullscreen ? 120 : 80);

    // Base dimensions for our document container (maxWidths)
    const baseWidth = isFullscreen ? 1000 : 500;
    const baseHeight = baseWidth * 1.414;

    const scaleX = vWidth / baseWidth;
    const scaleY = vHeight / baseHeight;

    // Choose the smaller scale to fit entirely within the viewport
    const fitScale = Math.min(scaleX, scaleY);
    const fitZoom = Math.round(fitScale * 100);

    // Clamp between 30% and 250%
    setZoom?.(Math.min(250, Math.max(30, fitZoom)));
  }, [isFullscreen, setZoom]);

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      setTimeout(handleFit, 100);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [handleFit]);

  React.useEffect(() => {
    window.addEventListener('resize', handleFit);
    return () => window.removeEventListener('resize', handleFit);
  }, [handleFit]);

  React.useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -10 : 10;
        setZoom?.(prev => Math.min(250, Math.max(30, prev + delta)));
      }
    };

    const viewport = viewportRef.current;
    if (viewport) {
      viewport.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (viewport) {
        viewport.removeEventListener('wheel', handleWheel);
      }
    };
  }, [setZoom]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const renderContent = () => {
    const stepToRender = currentStep === 9 ? previewPage : currentStep;
    return (
      <motion.div
        key={`${stepToRender}`}
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="w-full"
      >
        {(() => {
          switch (stepToRender) {
            case 1: return <CoverPage formData={formData} />;
            case 2: return <ReceiptPaymentPage formData={formData} />;
            case 3: return <PermissionsPage formData={formData} />;
            case 4: return <ScheduleIXPage formData={formData} />;
            case 5: return <IncomeExpPage formData={formData} />;
            case 6: return <BalanceSheetPage formData={formData} />;
            case 7: return <Schedule9DPage formData={formData} />;
            case 8: return <DelayExemptionPage formData={formData} />;
            case 9: return <TrusteeListPage formData={formData} />;
            default: return <CoverPage formData={formData} />;
          }
        })()}
      </motion.div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "lg:col-span-5 sticky top-8 transition-all duration-700 ease-in-out",
        isFullscreen
          ? "fixed inset-0 z-[100] h-auto w-screen bg-slate-950 flex flex-col items-center justify-center p-0 overflow-hidden"
          : "h-auto "
      )}
    >
      {!isFullscreen && (
        <div className="flex items-center justify-between mb-4 bg-white/80 p-3 rounded-2xl border border-slate-100 shadow-sm backdrop-blur-md">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Live Preview</h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              A4 — Real Time
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom(prev => Math.max(30, prev - 10))}
              className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all active:scale-95"
              title="Zoom Out"
            >
              <Search size={14} className="scale-x-[-1]" />
            </button>
            <div className="w-14 text-center">
              <span className="text-[10px] font-bold text-slate-600 tabular-nums">{zoom}%</span>
            </div>
            <button
              onClick={() => setZoom(prev => Math.min(250, prev + 10))}
              className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all active:scale-95"
              title="Zoom In"
            >
              <Search size={14} />
            </button>
            <div className="w-px h-4 bg-slate-100 mx-1" />
            <button
              onClick={() => setZoom(100)}
              className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all active:scale-95"
              title="Reset Zoom"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>
      )}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-4 bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-2.5 rounded-[2rem] shadow-2xl"
          >
            <div className="flex items-center gap-1 px-2">
              <button
                onClick={() => setZoom(prev => Math.max(30, prev - 10))}
                className="p-3 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"
              >
                <Minimize2 size={18} />
              </button>
              <span className="w-16 text-center text-xs font-bold text-white tabular-nums">{zoom}%</span>
              <button
                onClick={() => setZoom(prev => Math.min(250, prev + 10))}
                className="p-3 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"
              >
                <Maximize2 size={18} />
              </button>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <button
              onClick={toggleFullscreen}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
            >
              <Minimize2 size={16} />
              Exit Full View
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={viewportRef}
        className={cn(
          "relative transition-all duration-500 flex flex-col items-center overflow-auto scrollbar-hide select-none w-full",
          isFullscreen
            ? "h-auto bg-transparent p-12 md:p-20"
            : "h-auto bg-slate-50 border border-slate-100 shadow-inner  rounded-3xl"
        )}
      >
        {currentStep === 9 && (
          <>
            <button
              onClick={() => setPreviewPage(prev => Math.max(1, prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 bg-white/80 rounded-full shadow-md hover:bg-white disabled:opacity-50"
              disabled={previewPage === 1}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setPreviewPage(prev => Math.min(9, prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 bg-white/80 rounded-full shadow-md hover:bg-white disabled:opacity-50"
              disabled={previewPage === 9}
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 px-3 py-1 rounded-full text-xs font-bold text-slate-600 z-50">
              Page {previewPage} of 9
            </div>
          </>
        )}
        {/* {!isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-6 right-6 z-50 p-3 bg-white/80 hover:bg-white backdrop-blur-md border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 shadow-sm transition-all active:scale-95 group"
            title="Expand to Full View"
          >
            <Maximize2 size={16} className="group-hover:scale-110 transition-transform" />
          </button>
        )} */}

        <motion.div
          layout
          drag={zoom > 100}
          dragMomentum={false}
          onClick={(e) => {
            if (zoom <= 100) toggleFullscreen();
          }}
          className={cn(
            "flex-shrink-0 origin-top mb-12 transition-shadow duration-500",
            zoom > 100 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in hover:shadow-[0_30px_60px_rgba(0,0,0,0.2)]"
          )}
          style={{
            width: '100%',
            maxWidth: isFullscreen ? '1000px' : '500px',
            scale: zoom / 100,
          }}
          animate={{
            scale: zoom / 100,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8
          }}
        >
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default LivePreview;
