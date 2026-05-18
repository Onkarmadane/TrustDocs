import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';
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

/* ── Reusable A4 page wrapper ── */
const A4Page = ({ children, pageLabel }) => (
  <div className="bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative w-full aspect-[1/1.414] shrink-0 rounded-[2px] transition-all duration-500 overflow-hidden group">
    {/* Subtle Paper Texture Overlay */}
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

    <div className="h-full p-10 select-none relative z-10">
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

/* ═══════════════════════════════════════════════════════════ */
/*  PAGE 1 — Cover Page                                       */
/* ═══════════════════════════════════════════════════════════ */
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
            For the year ended {formData.financialYear || '31.03.2025'}
          </p>
          <p className="text-[7px] text-slate-600 italic mt-2">
            {formData.trustName || 'Trust Name'}
          </p>
          <p className="text-[6px] text-slate-500">
            {formData.address || 'Address'}
          </p>
        </div>

        <div className="pt-6">
          <p className="text-[8px] font-bold text-slate-800">
            Registration No :- {formData.registrationNo || 'F-XXXX/Jalna'}
          </p>
          <p className="text-[8px] font-bold text-slate-800 mt-1">
            Date :- {formData.date || '__.__.____'}
          </p>
        </div>
      </div>

      <div className="mt-auto pb-4 space-y-0.5">
        <p className="text-[8px] font-bold uppercase tracking-wide">THE RVD & ASSOCIATES</p>
        <p className="text-[6px] text-slate-500 font-bold uppercase">Certified Auditor</p>
        <p className="text-[5px] text-slate-400">Address :- Shop No-07, Ambika Complex Near</p>
        <p className="text-[5px] text-slate-400">Shani Mandir Old Jalna, Jalna(M.S) 431203</p>
      </div>
    </div>
  </A4Page>
);

/* ═══════════════════════════════════════════════════════════ */
/*  PAGE 2 — Permissions & Disclosures                        */
/* ═══════════════════════════════════════════════════════════ */
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
            <p><span className="font-bold">Name of the trust:</span> {formData.trustName || '—'}</p>
            <p><span className="font-bold">Registration No:</span> {formData.registrationNo || '—'}</p>
          </div>
          <div className="text-right space-y-0.5">
            <p>{formData.address || '—'}</p>
            <p><span className="font-bold">For the Year Ending:</span> {formData.financialYear || '31.03.2025'}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-slate-300 text-[5px]">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-300 p-1 text-left w-[6%]">Sr.</th>
            <th className="border border-slate-300 p-1 text-left">Particulars</th>
            <th className="border border-slate-300 p-1 text-center w-[10%]">Yes</th>
            <th className="border border-slate-300 p-1 text-center w-[10%]">No</th>
          </tr>
        </thead>
        <tbody>
          {permissionsQuestions.map((q, i) => {
            const val = formData[`perm_${i}`];
            return (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                <td className="border border-slate-200 p-1 text-center font-bold">{i + 1}</td>
                <td className="border border-slate-200 p-1 leading-tight">{q}</td>
                <td className="border border-slate-200 p-1 text-center">
                  {val === 'yes' && <span className="text-green-600 font-bold">✓</span>}
                </td>
                <td className="border border-slate-200 p-1 text-center">
                  {val === 'no' && <span className="text-red-500 font-bold">✓</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Footer */}
      <div className="mt-3 flex justify-between items-end px-1">
        <p className="text-[5px] text-slate-500">Date :- {formData.date || '__.__.____'}</p>
        <div className="text-right text-[5px] space-y-0.5">
          <p className="font-bold text-[6px]">THE RVD & ASSOCIATES</p>
          <p className="text-slate-400">Certified Auditor</p>
        </div>
      </div>
    </div>
  </A4Page>
);

/* ═══════════════════════════════════════════════════════════ */
/*  PAGE 3.1 — Schedule IX (Deductions)                       */
/* ═══════════════════════════════════════════════════════════ */

export const ScheduleIXPage = ({ formData }) => {
  const grossIncome = parseFloat(formData.sch_income_shown || 0);
  const totalDeductions = scheduleIXItems.reduce((s, item) => s + (parseFloat(formData[item.key]) || 0), 0);
  const netIncome = grossIncome - totalDeductions;

  return (
    <A4Page pageLabel="Page 3.1 — Schedule IX">
      <div className="text-[5.5px] leading-relaxed">
        {/* Header */}
        <div className="text-center mb-3 space-y-0.5">
          <p className="font-bold text-[7px]">The Bombay Public Trusts Act 1950</p>
          <p className="font-bold text-[6px]">SCHEDULE - IX C</p>
          <p className="text-[5px] text-slate-500">( VIDE RULE 32 )</p>
          <p className="text-[5px] mt-1">
            STATEMENT OF INCOME TO CONTRIBUTION FOR THE YEAR ENDING :- {formData.financialYear || '31.03.2025'}
          </p>
          <p className="text-[5px] text-slate-600">
            Name of the Trust — {formData.trustName || '—'} | Reg. No:- {formData.registrationNo || '—'}
          </p>
        </div>

        {/* Items */}
        <div className="border border-slate-300 text-[5px]">
          {/* Row: Income shown */}
          <div className="flex items-center justify-between border-b border-slate-200 p-1.5 bg-slate-50">
            <p className="font-bold flex-1">I. Income as shown in the Income and Expenditure Account (Schedule IX)</p>
            <span className="font-bold font-mono w-16 text-right">{fmt(formData.sch_income_shown)}</span>
          </div>

          {/* Row: Section header */}
          <div className="p-1.5 border-b border-slate-200 bg-white">
            <p className="font-bold">II. Items not chargeable to contribution under Section 58 and Rules 32</p>
          </div>

          {/* Sub-items */}
          {scheduleIXItems.map((item) => (
            <div key={item.key} className="flex items-center justify-between border-b border-slate-100 px-2 py-1 hover:bg-blue-50/30">
              <p className="flex-1 text-slate-600 pr-2">{item.label}</p>
              <span className="font-mono w-16 text-right text-slate-700">{fmt(formData[item.key])}</span>
            </div>
          ))}

          {/* Gross Annual Income */}
          <div className="flex items-center justify-between p-1.5 bg-blue-50 border-t border-blue-200">
            <p className="font-bold text-blue-800">Gross Annual Income chargeable to contribution Rs.</p>
            <span className="font-bold font-mono w-16 text-right text-blue-700">{fmt(netIncome > 0 ? netIncome : '')}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 flex justify-between items-end px-1">
          <div className="text-[5px] text-slate-500">
            <p>Date :- {formData.date || '__.__.____'}</p>
            <p>Trust Address: {formData.address || '—'}</p>
          </div>
          <div className="text-right text-[5px] space-y-0.5">
            <p className="font-bold text-[6px]">THE RVD & ASSOCIATES</p>
            <p className="text-slate-400">Certified Auditor</p>
          </div>
        </div>
      </div>
    </A4Page>
  );
};

/* ═══════════════════════════════════════════════════════════ */
/*  PAGE 3.2 — Income & Expenditure Account Table             */
/* ═══════════════════════════════════════════════════════════ */
export const IncomeExpPage = ({ formData }) => {
  const expTotal = expenditureItems.reduce((s, item) => s + (parseFloat(formData[item.key]) || 0), 0);
  const incTotal = incomeItems.reduce((s, item) => s + (parseFloat(formData[item.key]) || 0), 0);
  const maxRows = Math.max(expenditureItems.length, incomeItems.length);

  return (
    <A4Page pageLabel="Page 3.2 — Income & Expenditure">
      <div className="text-[5.5px]">
        {/* Header */}
        <div className="text-center mb-2 space-y-0.5">
          <p className="font-bold text-[7px]">The Bombay Public Trusts Act 1950</p>
          <p className="font-bold text-[6px]">SCHEDULE IX (VIDE RULE 17(1))</p>
          <p className="text-[5px] mt-1">
            INCOME AND EXPENDITURE A/C FOR THE YEAR {formData.financialYear || '31.03.2025'}
          </p>
          <p className="text-[5px] text-slate-500">{formData.trustName || '—'}</p>
        </div>

        {/* Table */}
        <table className="w-full border-collapse border border-slate-300 text-[5px]">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 p-1 text-left w-[35%]">EXPENDITURE</th>
              <th className="border border-slate-300 p-1 text-right w-[15%]">AMOUNT</th>
              <th className="border border-slate-300 p-1 text-left w-[35%]">INCOME</th>
              <th className="border border-slate-300 p-1 text-right w-[15%]">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxRows }).map((_, i) => {
              const exp = expenditureItems[i];
              const inc = incomeItems[i];
              return (
                <tr key={i} className={i % 2 === 0 ? '' : 'bg-slate-50/40'}>
                  <td className="border border-slate-200 p-1 leading-tight">
                    {exp && (
                      <div>
                        <span className="font-bold">{exp.label}</span>
                        {exp.subItems && (
                          <div className="pl-1.5 text-slate-500 text-[4.5px] mt-0.5">
                            {exp.subItems.map((s, j) => (
                              <div key={j}>{typeof s === 'string' ? s : s.label}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="border border-slate-200 p-1 text-right font-mono align-top">
                    {exp && fmt(formData[exp.key])}
                  </td>
                  <td className="border border-slate-200 p-1 leading-tight">
                    {inc && <span className="font-bold">{inc.label}</span>}
                  </td>
                  <td className="border border-slate-200 p-1 text-right font-mono align-top">
                    {inc && fmt(formData[inc.key])}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-blue-50 font-bold">
              <td className="border border-blue-200 p-1.5 text-blue-800">TOTAL</td>
              <td className="border border-blue-200 p-1.5 text-right font-mono text-blue-700">{fmt(expTotal) || '0.00'}</td>
              <td className="border border-blue-200 p-1.5 text-blue-800">TOTAL</td>
              <td className="border border-blue-200 p-1.5 text-right font-mono text-blue-700">{fmt(incTotal) || '0.00'}</td>
            </tr>
          </tfoot>
        </table>

        {/* Footer */}
        <div className="mt-2 flex justify-between items-end px-1 text-[5px]">
          <p className="text-slate-500">As per our report of even date.</p>
          <div className="text-right space-y-0.5">
            <p className="font-bold text-[6px]">THE RVD & ASSOCIATES</p>
            <p className="text-slate-400">Certified Auditor</p>
          </div>
        </div>
      </div>
    </A4Page>
  );
};

/* ═══════════════════════════════════════════════════════════ */
/*  PAGE 4 — Balance Sheet                                    */
/* ═══════════════════════════════════════════════════════════ */
export const BalanceSheetPage = ({ formData }) => {
  const flTotal = Object.entries(formData).filter(([k]) => k.startsWith('fl_')).reduce((s, [, v]) => s + (parseFloat(v) || 0), 0);
  const paTotal = Object.entries(formData).filter(([k]) => k.startsWith('pa_')).reduce((s, [, v]) => s + (parseFloat(v) || 0), 0);

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
    <A4Page pageLabel="Page 4 — Balance Sheet">
      <div className="text-[5px]">
        {/* Header */}
        <div className="text-center mb-2 space-y-0.5">
          <p className="font-bold text-[7px]">The Bombay Public Trusts Act 1950.</p>
          <p className="font-bold text-[6px]">SCHEDULE VII (VIDE RULE 17(1))</p>
          <p className="text-[5px] mt-1">
            Name of the Trust :- {formData.trustName || '—'} | Reg. No:- {formData.registrationNo || '—'}
          </p>
          <p className="font-bold text-[6px] mt-1">BALANCE SHEET AS ON {formData.financialYear || '31.03.2025'}</p>
        </div>

        {/* Two-column tables side by side */}
        <div className="grid grid-cols-2 gap-0.5">
          {/* Funds & Liabilities */}
          <table className="border-collapse border border-slate-300 text-[4.5px] w-full">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-1 text-left">Funds & Liabilities</th>
                <th className="border border-slate-300 p-0.5 text-center w-[22%]">Amount</th>
                <th className="border border-slate-300 p-0.5 text-center w-[22%]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {renderColumn(fundsLiabilitiesItems)}
            </tbody>
            <tfoot>
              <tr className="bg-blue-50 font-bold">
                <td className="border border-blue-200 p-1">TOTAL</td>
                <td className="border border-blue-200 p-1 text-right font-mono" colSpan={2}>{fmt(flTotal) || '0.00'}</td>
              </tr>
            </tfoot>
          </table>

          {/* Property & Assets */}
          <table className="border-collapse border border-slate-300 text-[4.5px] w-full">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-1 text-left">Property & Assets</th>
                <th className="border border-slate-300 p-0.5 text-center w-[22%]">Amount</th>
                <th className="border border-slate-300 p-0.5 text-center w-[22%]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {renderColumn(propertyAssetsItems)}
            </tbody>
            <tfoot>
              <tr className="bg-blue-50 font-bold">
                <td className="border border-blue-200 p-1">TOTAL</td>
                <td className="border border-blue-200 p-1 text-right font-mono" colSpan={2}>{fmt(paTotal) || '0.00'}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-2 flex justify-between items-end px-1 text-[5px]">
          <p className="text-slate-500">As per our report of even date.</p>
          <div className="text-right space-y-0.5">
            <p className="font-bold text-[6px]">THE RVD & ASSOCIATES</p>
            <p className="text-slate-400">Certified Auditor</p>
          </div>
        </div>
      </div>
    </A4Page>
  );
};

/* ═══════════════════════════════════════════════════════════ */
/*  PAGE 5 — Receipt & Payment Account                         */
/* ═══════════════════════════════════════════════════════════ */
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
        {/* Header */}
        <div className="text-center mb-2 space-y-0.5">
          <p className="font-bold text-[7px]">Name of the Trust :- {formData.trustName || '—'}</p>
          <p className="text-[5px] mt-1">{formData.address || '—'}</p>
          <p className="font-bold text-[6px] mt-1">Receipt & Payment Account</p>
          <p className="text-[5px] mt-1">For the Period from 01.04.2025 to {formData.financialYear || '31.03.2026'}</p>
        </div>

        {/* Two-column tables side by side */}
        <div className="grid grid-cols-2 gap-0.5">
          {/* Receipts */}
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
            </tbody>
            <tfoot>
              <tr className="bg-emerald-50 font-bold">
                <td className="border border-emerald-200 p-1">Total</td>
                <td className="border border-emerald-200 p-1 text-right font-mono" colSpan={2}>{fmt(recTotal) || '0.00'}</td>
              </tr>
            </tfoot>
          </table>

          {/* Payments */}
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
          <p>Registration No- {formData.registrationNo || '—'}</p>
          <p>Date :- {formData.date || '__.__.____'}</p>
        </div>
      </div>
    </A4Page>
  );
};

/* ═══════════════════════════════════════════════════════════ */
/*  PAGE 6.1 — Schedule 9-D (Marathi)                          */
/* ═══════════════════════════════════════════════════════════ */
export const Schedule9DPage = ({ formData }) => {
  return (
    <A4Page pageLabel="Page 6 — Schedule 9-D">
      <div className="text-[6px] font-sans">
        <div className="text-center space-y-1 mb-4 font-bold border-b pb-2">
          <p>महाराष्ट्र शासन राजपत्र असाधारण भाग चार - ब, मे 15 , 2019/वैशाख 25, शके 1941</p>
          <p className="text-[7px]">मुख्य नियमांना जोडण्यात आलेल्या अनुसूची 9-क नंतर पुढील अनुसूची समाविष्ट करण्यात येईल.</p>
          <p className="text-[8px]">अनुसूची नऊ - ड</p>
          <p>(नियम 19 ( 2 अ) पहा )</p>
          <p>महाराष्ट्र सार्वजनिक विश्वस्तव्यवस्था अधिनियम, 1950 या अधिनियमाच्या कलम 34 च्या पोट- कलम</p>
          <p>(1) खाली लेखापरीक्षा अहवालासोबत लेखापरीक्षकाने सादर करावयाचे माहिती.</p>
        </div>

        <table className="w-full border-collapse border border-slate-400">
          <tbody>
            <tr>
              <td className="border border-slate-400 p-1 font-bold w-6 text-center">1)</td>
              <td className="border border-slate-400 p-1 font-bold w-1/3">संस्थेचे नाव</td>
              <td className="border border-slate-400 p-1">{formData.sch9d_trustNameMarathi || formData.trustName}</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-1 font-bold text-center">2)</td>
              <td className="border border-slate-400 p-1 font-bold">नोंदणी क्रमांक</td>
              <td className="border border-slate-400 p-1">{formData.sch9d_registrationNoMarathi || formData.registrationNo}</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-1 font-bold text-center">3)</td>
              <td className="border border-slate-400 p-1 font-bold">आर्थिक वर्ष</td>
              <td className="border border-slate-400 p-1 font-bold text-center">सन {formData.sch9d_financialYearMarathi || formData.financialYear}</td>
            </tr>
          </tbody>
        </table>

        <table className="w-full border-collapse border border-slate-400 mt-2">
          <thead>
            <tr className="font-bold bg-slate-100">
              <td className="border border-slate-400 p-1 w-6 text-center">अ क्रं</td>
              <td className="border border-slate-400 p-1 w-1/3 text-center">तपशील</td>
              <td className="border border-slate-400 p-1 text-center">वर्णन</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-400 p-1 text-center">1</td>
              <td className="border border-slate-400 p-1">विश्वस्त व्यवस्थेच्या स्थायी खाते क्रमांक</td>
              <td className="border border-slate-400 p-1 text-center">{formData.sch9d_trustPan}</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-1 text-center">2</td>
              <td className="border border-slate-400 p-1">आयकर अधिनियम, 196(1961 चा 43) याच्या कलम 12 A A खाली नोंदणीच्या दिनांका सह नोंदणी क्रमांक</td>
              <td className="border border-slate-400 p-1 text-center">{formData.sch9d_incomeTaxRegistration}</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-1 text-center">3</td>
              <td className="border border-slate-400 p-1">आधीच्या तीन वर्षाचे आयकर विवरण दाखल करण्याच्या दिनांक सह पोच पावती क्रमांक.</td>
              <td className="border border-slate-400 p-0 align-top">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b border-r border-slate-400 p-1 w-10">अ क्र</th>
                      <th className="border-b border-r border-slate-400 p-1">पोच पावती क्रमांक</th>
                      <th className="border-b border-slate-400 p-1 w-20">वर्ष</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(formData.sch9d_previousITReturns || [{ receiptNo: '-', year: '-' }]).map((item, index) => (
                      <tr key={index}>
                        <td className={`border-r border-slate-400 p-1 text-center ${index !== (formData.sch9d_previousITReturns?.length || 1) - 1 ? 'border-b' : ''}`}>{index + 1}</td>
                        <td className={`border-r border-slate-400 p-1 text-center ${index !== (formData.sch9d_previousITReturns?.length || 1) - 1 ? 'border-b' : ''}`}>{item.receiptNo || '-'}</td>
                        <td className={`p-1 text-center ${index !== (formData.sch9d_previousITReturns?.length || 1) - 1 ? 'border-b' : ''}`}>{item.year || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-1 text-center">4</td>
              <td className="border border-slate-400 p-1">सर्व विश्वस्तांचे स्थायी खाते क्रमांक</td>
              <td className="border border-slate-400 p-0 align-top">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b border-r border-slate-400 p-1 w-10">अ क्र</th>
                      <th className="border-b border-r border-slate-400 p-1">विश्वस्तांचे नांव</th>
                      <th className="border-b border-slate-400 p-1 w-32">स्थायी खाते क्रमांक</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(formData.sch9d_trusteesPan || [{ name: '', pan: '' }]).map((item, index) => (
                      <tr key={index}>
                        <td className="border-b border-r border-slate-400 p-1 text-center">{index + 1}</td>
                        <td className="border-b border-r border-slate-400 p-1 text-center">{item.name}</td>
                        <td className="border-b border-slate-400 p-1 text-center">{item.pan}</td>
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

/* ═══════════════════════════════════════════════════════════ */
/*  PAGE 6.2 — Delay Exemption (Marathi)                       */
/* ═══════════════════════════════════════════════════════════ */
export const DelayExemptionPage = ({ formData }) => {
  return (
    <A4Page pageLabel="Page 7 — Delay Exemption">
      <div className="text-[7px] font-sans leading-relaxed space-y-3">
        <h2 className="text-[12px] font-bold text-center border-b border-slate-300 pb-2 mb-4">विलंब माफीचा अर्ज</h2>

        <p className="pl-4">
          वय {formData.delay_applicantAge || '४०'} वर्ष पत्ता- {formData.delay_applicantAddress || 'रा.कोपर्डी ता.भोकरदन जि.जालना'} सत्य प्रतिज्ञेवर खालील प्रमाणे कथन करतो की,
        </p>

        <p>
          1) मी {formData.delay_applicantName || '__________________'} {formData.sch9d_trustNameMarathi || formData.trustName || '__________________'} {formData.delay_applicantAddress || '__________________'} या सार्वजनिक न्यास नोंदणी क्रमांक {formData.sch9d_registrationNoMarathi || formData.registrationNo || '__________________'} या न्यासाचा {formData.delay_designation || 'विश्वस्त / सचिव / अध्यक्ष'} आहे.
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

/* ═══════════════════════════════════════════════════════════ */
/*  MAIN LIVE PREVIEW COMPONENT                               */
/* ═══════════════════════════════════════════════════════════ */
const LivePreview = ({ currentStep, formData, zoom = 100, setZoom }) => {
  const viewportRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

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

  // Handle Fullscreen state changes and Auto-Fit
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      // Trigger fit calculation after a small delay to allow for transition
      setTimeout(handleFit, 100);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    // Initial fit
    handleFit();

    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [handleFit]);

  // Also fit on window resize
  React.useEffect(() => {
    window.addEventListener('resize', handleFit);
    return () => window.removeEventListener('resize', handleFit);
  }, [handleFit]);

  // Handle Wheel Zoom (Ctrl + Wheel)
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
    return (
      <motion.div
        key={`${currentStep}`}
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="w-full"
      >
        {(() => {
          switch (currentStep) {
            case 1: return <CoverPage formData={formData} />;
            case 2: return <PermissionsPage formData={formData} />;
            case 3: return <ScheduleIXPage formData={formData} />;
            case 4: return <IncomeExpPage formData={formData} />;
            case 5: return <BalanceSheetPage formData={formData} />;
            case 6: return <ReceiptPaymentPage formData={formData} />;
            case 7: return <Schedule9DPage formData={formData} />;
            case 8: return <DelayExemptionPage formData={formData} />;
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
          ? "fixed inset-0 z-[100] h-screen w-screen bg-slate-950 flex flex-col items-center justify-center p-0 overflow-hidden"
          : "h-[calc(100vh-10rem)]"
      )}
    >
      {/* Background Decor for Fullscreen */}
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

      {/* Floating Controls in Fullscreen */}
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

      {/* Preview Viewport */}
      <div
        ref={viewportRef}
        className={cn(
          "relative transition-all duration-500 flex flex-col items-center overflow-auto scrollbar-hide select-none w-full",
          isFullscreen
            ? "h-full bg-transparent p-12 md:p-20"
            : "h-full bg-slate-50 border border-slate-100 shadow-inner  rounded-3xl"
        )}
      >
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
