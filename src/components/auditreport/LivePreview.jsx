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
  const n = parseFloat(val);
  if (isNaN(n) || n === 0) return '';
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2 });
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
export const CoverPage = ({ formData }) => (
  <A4Page pageLabel="Page 1 — Cover">
    <div className="h-full flex flex-col items-center justify-center text-center px-4">
      <div className="space-y-5 flex-1 flex flex-col items-center justify-center">
        <h1 className="text-lg font-serif font-bold text-slate-900 tracking-[0.2em] uppercase">
          Audit Report
        </h1>
        <div className="h-[1.5px] w-20 bg-slate-800 mx-auto" />

        <div className="space-y-1 pt-4">
          <p className="text-[7px] font-bold uppercase tracking-widest text-slate-700">
            For the year ended {getFinancialYear(formData)}
          </p>
          <p className="text-[7px] text-slate-600 italic mt-2">
            {getTrustName(formData)}
          </p>
          <p className="text-[6px] text-slate-500">
            {getTrustAddress(formData)}
          </p>
        </div>

        <div className="pt-6">
          <p className="text-[8px] font-bold text-slate-800">
            Registration No :- {getRegistrationNo(formData)}
          </p>
          <p className="text-[8px] font-bold text-slate-800 mt-1">
            Date :- {getDate(formData)}
          </p>
        </div>
      </div>

      <div className="mt-auto pb-4 space-y-0.5">
        <p className="text-[8px] font-bold uppercase tracking-wide">{getAuditorFirm(formData)}</p>
        <p className="text-[6px] text-slate-500 font-bold uppercase">{getAuditorStatus(formData)}</p>
        <div className="text-[5px] text-slate-400 pt-0.5">
          {getAuditorName(formData) && <p className="font-bold text-slate-600">{getAuditorName(formData)}</p>}
          <p>
            {getAuditorMembershipNo(formData) ? `M.No: ${getAuditorMembershipNo(formData)}` : ''}
            {getAuditorRegistrationNo(formData) ? ` | F.R.No: ${getAuditorRegistrationNo(formData)}` : ''}
          </p>
          <p>Address :- {getAuditorAddress(formData)}</p>
          <p>Email. Id- {getAuditorEmail(formData)}</p>
          <p>Mob.No- {getAuditorMobile(formData)}</p>
        </div>
      </div>
    </div>
  </A4Page>
);

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
  const grossIncome = parseFloat(formData.sch_income_shown || 0);
  const totalDeductions = scheduleIXItems.reduce((s, item) => s + (parseFloat(formData[item.key]) || 0), 0);
  const netIncome = grossIncome - totalDeductions;

  return (
    <A4Page pageLabel="Page 3.1 — Schedule IX">
      <div className="text-[5.5px] leading-relaxed">
        <div className="text-center mb-3 space-y-0.5">
          <p className="font-bold text-[7px]">The Bombay Public Trusts Act 1950</p>
          <p className="font-bold text-[6px]">SCHEDULE - IX C</p>
          <p className="text-[5px] text-slate-500">( VIDE RULE 32 )</p>
          <p className="text-[5px] mt-1">
            STATEMENT OF INCOME TO CONTRIBUTION FOR THE YEAR ENDING :- {getFinancialYear(formData)}
          </p>
          <p className="text-[5px] text-slate-600">
            Name of the Trust — {getTrustName(formData)} | Reg. No:- {getRegistrationNo(formData)}
          </p>
        </div>

        <div className="border border-slate-300 text-[5px]">
          <div className="flex items-center justify-between border-b border-slate-200 p-1.5 bg-slate-50">
            <p className="font-bold flex-1">I. Income as shown in the Income and Expenditure Account (Schedule IX)</p>
            <span className="font-bold font-mono w-16 text-right">{fmt(formData.sch_income_shown)}</span>
          </div>

          <div className="p-1.5 border-b border-slate-200 bg-white">
            <p className="font-bold">II. Items not chargeable to contribution under Section 58 and Rules 32</p>
          </div>

          {scheduleIXItems.map((item) => (
            <div key={item.key} className="flex items-center justify-between border-b border-slate-100 px-2 py-1 hover:bg-blue-50/30">
              <p className="flex-1 text-slate-600 pr-2">{item.label}</p>
              <span className="font-mono w-16 text-right text-slate-700">{fmt(formData[item.key])}</span>
            </div>
          ))}

          <div className="flex items-center justify-between p-1.5 bg-blue-50 border-t border-blue-200">
            <p className="font-bold text-blue-800">Gross Annual Income chargeable to contribution Rs.</p>
            <span className="font-bold font-mono w-16 text-right text-blue-700">{fmt(netIncome > 0 ? netIncome : '')}</span>
          </div>
        </div>

        <div className="mt-3 flex justify-between items-end px-1">
          <div className="text-[5px] text-slate-500">
            <p>Date :- {getDate(formData)}</p>
            <p>Trust Address: {getTrustAddress(formData)}</p>
          </div>
          <div className="text-right text-[5px] space-y-0.5">
            <p className="font-bold text-[6px]">{getAuditorFirm(formData)}</p>
            <p className="text-slate-400">{getAuditorStatus(formData)}</p>
          </div>
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

  const subTotalIncRent = getNum("inc_rent_accrued_inner") + getNum("inc_rent_realised_inner");
  const subTotalIncInterest =
    getNum("inc_interest_accrued_inner") + getNum("inc_interest_realised_inner") +
    getNum("inc_interest_securities_inner") + getNum("inc_interest_loan_inner") +
    getNum("inc_interest_bank_inner");

  const baseIncomeTotal =
    subTotalIncRent + subTotalIncInterest + getNum("inc_dividend_outer") +
    getNum("inc_donations_outer") + getNum("inc_grants_outer") +
    getNum("inc_other_sources_outer") + getNum("inc_transfer_reserve_outer");

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
      expRows.push({ label: <span className="font-bold">{exp.label}</span>, inner: '', outer: '' });
      exp.subFields.forEach((sub, idx) => {
        const isLast = idx === exp.subFields.length - 1;
        let subTotal = "";
        if (isLast) {
          if (exp.key === "exp_properties") subTotal = subTotalExpProperties;
          if (exp.key === "exp_amount_written_off") subTotal = subTotalWrittenOff;
          if (exp.key === "exp_objects_of_trust") subTotal = subTotalObjectsTrust;
        }
        expRows.push({
          label: <span className="pl-2 text-slate-700">{sub.label}</span>,
          inner: formData[sub.key],
          outer: subTotal,
          isLastNested: isLast
        });
      });
    }
  });
  expRows.push({
    label: <span className="font-bold">To Surplus Carried Over To Balance Sheet</span>,
    inner: '',
    outer: surplus,
    isLastNested: true
  });

  const incRows = [];
  incomeItems.forEach((inc) => {
    if (inc.key === 'inc_deficit_row') return; // Skip, will add explicitly at the bottom

    if (inc.type === 'nested') {
      incRows.push({ label: <span className="font-bold">{inc.label}</span>, inner: '', outer: '' });
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
          label: <span className="pl-2 text-slate-700">{sub.label}</span>,
          inner: formData[sub.innerKey],
          outer: outerVal,
          isLastNested: isLast
        });
      });
    } else if (inc.type === 'double_field') {
      incRows.push({
        label: <span className="font-bold">{inc.label}</span>,
        inner: formData[inc.innerKey],
        outer: formData[inc.outerKey],
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
    outer: deficit,
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

  let flTotal = 0;
  fundsLiabilitiesItems.forEach(item => {
    if (item.type === 'nested') {
      item.subFields.forEach(sub => {
        if (sub.type === 'double_field' || sub.outerKey) flTotal += getNum(sub.outerKey);
      });
    } else if (item.type === 'double_field' || item.outerKey) {
      flTotal += getNum(item.outerKey);
    }
  });

  let paTotal = 0;
  propertyAssetsItems.forEach(item => {
    if (item.type === 'nested') {
      item.subFields.forEach(sub => {
        if (sub.type === 'double_field' || sub.outerKey) paTotal += getNum(sub.outerKey);
      });
    } else if (item.type === 'double_field' || item.outerKey) {
      paTotal += getNum(item.outerKey);
    }
  });

  const buildRows = (items) => {
    const rows = [];
    items.forEach(item => {
      if (item.type === 'nested') {
        rows.push({ label: item.label, inner: null, outer: null, isHeader: true });
        item.subFields.forEach((sub, idx) => {
          const isLast = idx === item.subFields.length - 1;
          const innerKey = sub.innerKey || sub.key;
          rows.push({
            label: sub.label,
            inner: formData[innerKey],
            outer: sub.outerKey ? formData[sub.outerKey] : null,
            isLast,
            isSubItem: true
          });
        });
      } else if (item.type === 'double_field') {
        rows.push({ label: item.label, inner: formData[item.innerKey], outer: formData[item.outerKey], isHeader: true, isLast: true });
      } else {
        rows.push({ label: item.label, inner: null, outer: formData[item.outerKey || item.key], isHeader: true, isLast: true });
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
                    {fl && <span className={fl.isSubItem ? 'pl-2 text-slate-600' : 'font-bold text-black'}>{fl.label}</span>}
                  </td>
                  <td className={`border-r border-slate-200 p-0.5 text-right font-mono align-bottom ${fl?.isLast && fl?.inner != null ? 'border-b border-slate-400' : ''}`}>
                    {fl && fl.inner != null ? fmt(fl.inner) : ''}
                  </td>
                  <td className={`border-r border-slate-200 p-0.5 text-right font-mono align-bottom ${fl?.isLast && fl?.outer != null ? 'border-b border-slate-400' : ''}`}>
                    {fl && fl.outer != null ? fmt(fl.outer) : ''}
                  </td>
                  {/* PA side */}
                  <td className="border-r border-slate-200 p-0.5 leading-tight">
                    {pa && <span className={pa.isSubItem ? 'pl-2 text-slate-600' : 'font-bold text-black'}>{pa.label}</span>}
                  </td>
                  <td className={`border-r border-slate-200 p-0.5 text-right font-mono align-bottom ${pa?.isLast && pa?.inner != null ? 'border-b border-slate-400' : ''}`}>
                    {pa && pa.inner != null ? fmt(pa.inner) : ''}
                  </td>
                  <td className={`border-r border-slate-200 p-0.5 text-right font-mono align-bottom ${pa?.isLast && pa?.outer != null ? 'border-b border-slate-400' : ''}`}>
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
  const recTotal = Object.entries(formData).filter(([k]) => k.startsWith('rec_')).reduce((s, [, v]) => s + (parseFloat(v) || 0), 0);
  const payTotal = Object.entries(formData).filter(([k]) => k.startsWith('pay_')).reduce((s, [, v]) => s + (parseFloat(v) || 0), 0);

  const renderColumn = (items) =>
    items.map((item) => (
      <React.Fragment key={item.key}>
        <tr className="bg-slate-50/60">
          <td className="border border-slate-200 p-1 font-bold text-[5.5px]" colSpan={1}>
            {item.label}
          </td>
          <td className="border border-slate-200 p-1 text-right font-mono">{fmt(formData[item.key])}</td>
          <td className="border border-slate-200 p-1 text-right font-mono">{fmt(formData[`${item.key}_total`])}</td>
        </tr>
        {item.subItems && item.subItems.map((sub) => {
          const sk = typeof sub === 'string' ? `${item.key}_s` : sub.key;
          const sl = typeof sub === 'string' ? sub : sub.label;
          return (
            <tr key={sk}>
              <td className="border border-slate-100 p-0.5 pl-2 text-slate-600">{sl}</td>
              <td className="border border-slate-100 p-0.5 text-right font-mono">{fmt(formData[sk])}</td>
              <td className="border border-slate-100 p-0.5"></td>
            </tr>
          );
        })}
      </React.Fragment>
    ));

  return (
    <A4Page pageLabel="Page 5 — Receipt & Payment">
      <div className="text-[5px]">
        <div className="text-center mb-2 space-y-0.5">
          <p className="font-bold text-[7px]">Name of the Trust :- {getTrustName(formData)}</p>
          <p className="text-[5px] mt-1">{getTrustAddress(formData)}</p>
          <p className="font-bold text-[6px] mt-1">Receipt & Payment Account</p>
          <p className="text-[5px] mt-1">For the Period from 01.04.2025 to {getFinancialYear(formData)}</p>
        </div>

        <div className="grid grid-cols-2 gap-0.5">
          <table className="border-collapse border border-slate-300 text-[4.5px] w-full">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-1 text-left">Receipt</th>
                <th className="border border-slate-300 p-0.5 text-center w-[22%]">Amount</th>
                <th className="border border-slate-300 p-0.5 text-center w-[22%]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {renderColumn(receiptItems)}
              {Object.keys(formData)
                .filter(k => k.startsWith('rec_custom_') && !k.endsWith('_label'))
                .map(key => (
                  <tr key={key} className="bg-slate-50/60">
                    <td className="border border-slate-200 p-1 font-bold text-[5.5px]" colSpan={1}>
                      {formData[`${key}_label`] || 'Custom Receipt'}
                    </td>
                    <td className="border border-slate-200 p-1 text-right font-mono">{fmt(formData[key])}</td>
                    <td className="border border-slate-200 p-1 text-right font-mono"></td>
                  </tr>
                ))
              }
            </tbody>
            <tfoot>
              <tr className="bg-emerald-50 font-bold">
                <td className="border border-emerald-200 p-1">Total</td>
                <td className="border border-emerald-200 p-1 text-right font-mono" colSpan={2}>{fmt(recTotal) || '0.00'}</td>
              </tr>
            </tfoot>
          </table>

          <table className="border-collapse border border-slate-300 text-[4.5px] w-full">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-1 text-left">Payments</th>
                <th className="border border-slate-300 p-0.5 text-center w-[22%]">Amount</th>
                <th className="border border-slate-300 p-0.5 text-center w-[22%]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {renderColumn(paymentItems)}
              {Object.keys(formData)
                .filter(k => k.startsWith('pay_custom_') && !k.endsWith('_label'))
                .map(key => (
                  <tr key={key} className="bg-slate-50/60">
                    <td className="border border-slate-200 p-1 font-bold text-[5.5px]" colSpan={1}>
                      {formData[`${key}_label`] || 'Custom Payment'}
                    </td>
                    <td className="border border-slate-200 p-1 text-right font-mono">{fmt(formData[key])}</td>
                    <td className="border border-slate-200 p-1 text-right font-mono"></td>
                  </tr>
                ))
              }
            </tbody>
            <tfoot>
              <tr className="bg-emerald-50 font-bold">
                <td className="border border-emerald-200 p-1">Total</td>
                <td className="border border-emerald-200 p-1 text-right font-mono" colSpan={2}>{fmt(payTotal) || '0.00'}</td>
              </tr>
            </tfoot>
          </table>
        </div>

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
  const previousReturns = formData.sch9d_previousITReturns && formData.sch9d_previousITReturns.length > 0 
    ? formData.sch9d_previousITReturns 
    : [{ receiptNo: '', year: '' }, { receiptNo: '', year: '' }, { receiptNo: '', year: '' }];
    
  const trusteesPan = formData.sch9d_trusteesPan && formData.sch9d_trusteesPan.length > 0 
    ? formData.sch9d_trusteesPan 
    : [{ name: '', pan: '' }, { name: '', pan: '' }, { name: '', pan: '' }];

  return (
    <A4Page pageLabel="Page 6 — Schedule 9-D">
      <div className="text-[6.5px] font-sans">
        <div className="text-center space-y-1 mb-6 font-bold pb-2">
          <p className="text-[9px]">"SCHEDULE IX-D"</p>
          <p className="text-[7px] font-normal">[See rule 19 (2A)]</p>
          <p className="mt-2 text-[7px] font-normal">Information to be submitted by the Auditor along with Audit Report under</p>
          <p className="text-[7px] font-normal">sub-section (1) of section 34 of</p>
          <p className="text-[7px] font-normal">the Maharashtra Public Trusts Act.</p>
        </div>

        <table className="w-full border-collapse border border-black text-[6.5px]">
          <thead>
            <tr>
              <th className="border border-black p-1.5 w-[8%] text-center font-normal">Sr.<br/>No.</th>
              <th className="border border-black p-1.5 w-[45%] text-center font-normal">Particulars</th>
              <th className="border border-black p-1.5 text-center font-normal">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-1.5 text-center align-top">1.</td>
              <td className="border border-black p-1.5 align-top">PAN No. of Trust.</td>
              <td className="border border-black p-1.5 align-top">{formData.sch9d_trustPan}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 text-center align-top">2.</td>
              <td className="border border-black p-1.5 align-top">Registration No. with date of registration under section 12AA of Income Tax Act, 1961 (43 of 1961).</td>
              <td className="border border-black p-1.5 align-top">{formData.sch9d_incomeTaxRegistration}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 text-center align-top">3.</td>
              <td className="border border-black p-1.5 align-top">Acknowledgement No. with date of filing of the Return of Income for earlier three years.</td>
              <td className="border border-black p-0 align-top">
                <table className="w-full h-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b border-r border-black p-1 font-normal w-12 text-center">Sr.<br/>No.</th>
                      <th className="border-b border-r border-black p-1 font-normal text-center">Acknowledgement No.</th>
                      <th className="border-b border-black p-1 font-normal w-20 text-center">Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previousReturns.map((item, index) => (
                      <tr key={index}>
                        <td className={`border-r border-black p-1 text-center ${index !== previousReturns.length - 1 ? 'border-b' : ''}`}>{['(i)', '(ii)', '(iii)', '(iv)', '(v)'][index] || `(${index + 1})`}</td>
                        <td className={`border-r border-black p-1 text-center ${index !== previousReturns.length - 1 ? 'border-b' : ''}`}>{item.receiptNo || ''}</td>
                        <td className={`p-1 text-center ${index !== previousReturns.length - 1 ? 'border-b' : ''}`}>{item.year || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 text-center align-top">4.</td>
              <td className="border border-black p-1.5 align-top">PAN No. of all Trustees.</td>
              <td className="border border-black p-0 align-top">
                <table className="w-full h-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b border-r border-black p-1 font-normal w-12 text-center">Sr.<br/>No.</th>
                      <th className="border-b border-r border-black p-1 font-normal text-center">Name of Trustee</th>
                      <th className="border-b border-black p-1 font-normal w-24 text-center">PAN No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trusteesPan.map((item, index) => (
                      <tr key={index}>
                        <td className={`border-r border-black p-1 text-center ${index !== trusteesPan.length - 1 ? 'border-b' : ''}`}>{`(${index + 1})`}</td>
                        <td className={`border-r border-black p-1 text-center ${index !== trusteesPan.length - 1 ? 'border-b' : ''}`}>{item.name}</td>
                        <td className={`p-1 text-center ${index !== trusteesPan.length - 1 ? 'border-b' : ''}`}>{item.pan}</td>
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
