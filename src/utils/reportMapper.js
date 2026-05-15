import {
  permissionsQuestions,
  scheduleIXItems,
  expenditureItems,
  incomeItems,
  fundsLiabilitiesItems,
  propertyAssetsItems,
} from '../pages/reportData';

export const mapFormDataToBackendPayload = (formData, currentStep, status = 'draft') => {
  const expTotal = Object.entries(formData).filter(([k]) => k.startsWith('exp_')).reduce((s, [, v]) => s + (parseFloat(v) || 0), 0);
  const incTotal = Object.entries(formData).filter(([k]) => k.startsWith('inc_')).reduce((s, [, v]) => s + (parseFloat(v) || 0), 0);
  const flTotal = Object.entries(formData).filter(([k]) => k.startsWith('fl_')).reduce((s, [, v]) => s + (parseFloat(v) || 0), 0);
  const paTotal = Object.entries(formData).filter(([k]) => k.startsWith('pa_')).reduce((s, [, v]) => s + (parseFloat(v) || 0), 0);

  return {
    reportType: formData.reportType || 'audit',
    trustName: formData.trustName || '',
    registrationNo: formData.registrationNo || '',
    financialYear: formData.financialYear || '',
    address: formData.address || '',
    date: formData.date || new Date().toISOString().split('T')[0],
    currentStep: currentStep,
    status: status,
    signatures: [
      { label: 'Signature 1', file: formData.signature_1 },
      { label: 'Signature 2', file: formData.signature_2 }
    ].filter(s => s.file),
    stamps: [
      { label: 'Stamp 1', file: formData.stamp_1 },
      { label: 'Stamp 2', file: formData.stamp_2 }
    ].filter(s => s.file),
    permissions: permissionsQuestions.map((q, i) => ({
      question: q,
      answer: formData[`perm_${i}`] || ''
    })),
    scheduleIX: {
      incomeShown: Number(formData.sch_income_shown) || 0,
      deductions: scheduleIXItems.map(item => ({
        key: item.key,
        label: typeof item.label === 'string' ? item.label : item.label?.toString() || '',
        amount: Number(formData[item.key]) || 0
      })),
      grossAnnualIncome: (Number(formData.sch_income_shown) || 0) - scheduleIXItems.reduce((s, item) => s + (Number(formData[item.key]) || 0), 0)
    },
    incomeExpenditure: {
      expenditures: expenditureItems.map(item => ({
         key: item.key,
         label: item.label,
         amount: Number(formData[item.key]) || 0
      })),
      incomes: incomeItems.map(item => ({
         key: item.key,
         label: item.label,
         amount: Number(formData[item.key]) || 0
      })),
      totalExpenditure: expTotal,
      totalIncome: incTotal
    },
    balanceSheet: {
      fundsLiabilities: fundsLiabilitiesItems.map(item => ({
         key: item.key,
         label: item.label,
         amount: Number(formData[item.key]) || 0,
         total: Number(formData[`${item.key}_total`]) || 0
      })),
      propertyAssets: propertyAssetsItems.map(item => ({
         key: item.key,
         label: item.label,
         amount: Number(formData[item.key]) || 0,
         total: Number(formData[`${item.key}_total`]) || 0
      })),
      totalFundsLiabilities: flTotal,
      totalPropertyAssets: paTotal
    }
  };
};

export const mapBackendPayloadToFormData = (report) => {
  const formData = {
    reportType: report.reportType || 'audit',
    trustName: report.trustName || '',
    registrationNo: report.registrationNo || '',
    financialYear: report.financialYear || '',
    address: report.address || '',
    date: report.date || '',
    signature_1: report.signatures?.[0]?.file || '',
    signature_2: report.signatures?.[1]?.file || '',
    stamp_1: report.stamps?.[0]?.file || '',
    stamp_2: report.stamps?.[1]?.file || '',
  };

  if (report.permissions) {
    report.permissions.forEach((p, i) => {
      formData[`perm_${i}`] = p.answer || '';
    });
  }

  if (report.scheduleIX) {
    formData.sch_income_shown = report.scheduleIX.incomeShown || 0;
    report.scheduleIX.deductions?.forEach(d => {
      formData[d.key] = d.amount;
    });
  }

  if (report.incomeExpenditure) {
    report.incomeExpenditure.expenditures?.forEach(e => {
      formData[e.key] = e.amount;
    });
    report.incomeExpenditure.incomes?.forEach(i => {
      formData[i.key] = i.amount;
    });
  }

  if (report.balanceSheet) {
    report.balanceSheet.fundsLiabilities?.forEach(fl => {
      formData[fl.key] = fl.amount;
      formData[`${fl.key}_total`] = fl.total;
    });
    report.balanceSheet.propertyAssets?.forEach(pa => {
      formData[pa.key] = pa.amount;
      formData[`${pa.key}_total`] = pa.total;
    });
  }

  return formData;
};
