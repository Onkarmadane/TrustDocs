import {
  permissionsQuestions,
  scheduleIXItems,
  expenditureItems,
  incomeItems,
  fundsLiabilitiesItems,
  propertyAssetsItems,
  receiptItems,
  paymentItems,
} from '../components/auditreport/reportData';

// Label Lookup Helpers

/** Build a key→label map from expenditureItems */
const buildExpenditureLabelMap = () => {
  const map = {};
  expenditureItems.forEach(item => {
    map[item.key] = item.label;
    // standalone items also have an _inner sibling
    if (item.type === 'standalone') {
      map[`${item.key}_inner`] = item.label + ' (Detail)';
    }
    if (item.subFields) {
      item.subFields.forEach(sub => {
        map[sub.key] = sub.label;
      });
    }
  });
  return map;
};

/** Build a key→label map from incomeItems */
const buildIncomeLabelMap = () => {
  const map = {};
  incomeItems.forEach(item => {
    map[item.key] = item.label;
    if (item.innerKey) map[item.innerKey] = item.label + ' (Detail)';
    if (item.outerKey) map[item.outerKey] = item.label;
    if (item.subFields) {
      item.subFields.forEach(sub => {
        if (sub.innerKey) map[sub.innerKey] = sub.label;
        if (sub.outerKey) map[sub.outerKey] = sub.label + ' (Total)';
      });
    }
  });
  return map;
};

/** Build a key→label map from balance sheet items (fundsLiabilities or propertyAssets) */
const buildBalanceSheetLabelMap = (items) => {
  const map = {};
  items.forEach(item => {
    map[item.key] = item.label;
    if (item.innerKey) map[item.innerKey] = item.label + ' (Detail)';
    if (item.outerKey) map[item.outerKey] = item.label;
    if (item.subFields) {
      item.subFields.forEach(sub => {
        const innerKey = sub.innerKey || sub.key;
        if (innerKey) map[innerKey] = sub.label;
        if (sub.outerKey) map[sub.outerKey] = sub.label + ' (Total)';
      });
    }
  });
  return map;
};

// Pre-build maps (once)
const EXPENDITURE_LABEL_MAP = buildExpenditureLabelMap();
const INCOME_LABEL_MAP = buildIncomeLabelMap();
const FL_LABEL_MAP = buildBalanceSheetLabelMap(fundsLiabilitiesItems);
const PA_LABEL_MAP = buildBalanceSheetLabelMap(propertyAssetsItems);

// Schedule IX helpers 

// Returns a FLAT deductions array with groups expanded into their sub-items.
// Group header rows are included (amount: 0) so the PDF can show section titles.

const buildScheduleIXDeductions = (formData) => {
  const rows = [];
  scheduleIXItems.forEach(item => {
    if (item.type === 'group') {
      // Group header — no amount input for this row itself
      rows.push({ key: item.key, label: item.label, amount: null });
      item.subItems.forEach(sub => {
        rows.push({ key: sub.key, label: sub.label, amount: Number(formData[sub.key]) || 0 });
      });
    } else {
      rows.push({ key: item.key, label: item.label, amount: Number(formData[item.key]) || 0 });
    }
  });
  return rows;
};


// Correctly sums all deductions including group sub-items.

const calcTotalDeductions = (formData) =>
  scheduleIXItems.reduce((sum, item) => {
    if (item.type === 'group') {
      return sum + item.subItems.reduce((s, sub) => s + (Number(formData[sub.key]) || 0), 0);
    }
    return sum + (Number(formData[item.key]) || 0);
  }, 0);

// Income & Expenditure helpers


//Flat list of expenditure rows with proper labels.
// Nested-header rows are included (amount: 0) for PDF section structure.

const buildExpenditureRows = (formData, surplus) => {
  const getNum = (k) => parseFloat(formData[k] || 0);
  const rows = [];

  expenditureItems.forEach(item => {
    if (item.type === 'nested') {
      // Section header
      rows.push({ key: item.key, label: item.label, amount: null });
      item.subFields.forEach(sub => {
        rows.push({ key: sub.key, label: sub.label, amount: getNum(sub.key) });
      });
    } else {
      // Standalone – outer key is the totalling value used in calculations
      rows.push({ key: item.key, label: item.label, amount: getNum(item.key) });
      // Also preserve the _inner detail if the user filled it in
      const innerVal = getNum(`${item.key}_inner`);
      if (innerVal !== 0) {
        rows.push({
          key: `${item.key}_inner`,
          label: (EXPENDITURE_LABEL_MAP[`${item.key}_inner`] || item.label + ' (Detail)'),
          amount: innerVal,
        });
      }
    }
  });

  rows.push({
    key: 'exp_surplus_override',
    label: 'To Surplus Carried Over to Balance Sheet',
    amount: surplus,
  });

  return rows;
};


// Flat list of income rows with proper labels.
const buildIncomeRows = (formData, deficit) => {
  const getNum = (k) => parseFloat(formData[k] || 0);
  const rows = [];

  incomeItems.forEach(item => {
    if (item.type === 'nested') {
      rows.push({ key: item.key, label: item.label, amount: null });
      item.subFields.forEach(sub => {
        rows.push({ key: sub.innerKey, label: sub.label, amount: getNum(sub.innerKey) });
        if (sub.type === 'double_field' && sub.outerKey) {
          rows.push({
            key: sub.outerKey,
            label: sub.label + ' (Total)',
            amount: getNum(sub.outerKey),
          });
        }
      });
    } else if (item.type === 'double_field') {
      rows.push({ key: item.innerKey, label: item.label + ' (Detail)', amount: getNum(item.innerKey) });
      rows.push({ key: item.outerKey, label: item.label, amount: getNum(item.outerKey) });
    } else if (item.type === 'single_outer') {
      rows.push({
        key: item.outerKey || item.key,
        label: item.label,
        amount: getNum(item.outerKey || item.key),
      });
    }
  });

  rows.push({
    key: 'inc_deficit_calc',
    label: 'By Deficit Carried Over to Balance Sheet',
    amount: deficit,
  });

  return rows;
};

//Balance Sheet helpers 

// Flat list of balance sheet rows (fundsLiabilities or propertyAssets) with labels.
const buildBalanceSheetRows = (items, formData, labelMap) => {
  const getNum = (k) => (k ? parseFloat(formData[k] || 0) : 0);
  const rows = [];

  items.forEach(item => {
    if (item.type === 'nested') {
      rows.push({ key: item.key, label: item.label, amount: null, total: null });
      item.subFields.forEach(sub => {
        const innerKey = sub.innerKey || sub.key;
        if (sub.type === 'double_field' || sub.outerKey) {
          // Both inner and outer stored; inner→amount, outer→total
          rows.push({
            key: innerKey,
            label: labelMap[innerKey] || sub.label,
            amount: getNum(innerKey),
            total: getNum(sub.outerKey),
          });
          // Also persist outer key as its own row so backward mapping restores it
          rows.push({
            key: sub.outerKey,
            label: (labelMap[sub.outerKey] || sub.label + ' (Total)'),
            amount: getNum(sub.outerKey),
            total: null,
          });
        } else {
          rows.push({
            key: innerKey,
            label: labelMap[innerKey] || sub.label,
            amount: getNum(innerKey),
            total: null,
          });
        }
      });
    } else if (item.type === 'double_field') {
      rows.push({ key: item.innerKey, label: item.label + ' (Detail)', amount: getNum(item.innerKey), total: null });
      rows.push({ key: item.outerKey, label: item.label, amount: getNum(item.outerKey), total: null });
    }
  });

  return rows;
};

// Receipt & Payment helpers

//Flat list of receipt/payment rows, expanding subItems so cash/bank entries
//under "Opening Balance" / "Closing Balance" are individually stored.

const buildAccountingRows = (items, formData) => {
  const getNum = (k) => parseFloat(formData[k] || 0);
  const rows = [];

  items.forEach(item => {
    if (item.subItems && item.subItems.length > 0) {
      rows.push({ key: item.key, label: item.label, amount: null, total: null });
      item.subItems.forEach(sub => {
        rows.push({ key: sub.key, label: sub.label, amount: getNum(sub.key), total: null });
      });
    } else {
      rows.push({ key: item.key, label: item.label, amount: getNum(item.key), total: null });
    }
  });

  return rows;
};

/** Compute receipt total from leaf keys only (skip parent header keys). */
const calcAccountingTotal = (items, formData) => {
  const getNum = (k) => parseFloat(formData[k] || 0);
  return items.reduce((sum, item) => {
    if (item.subItems && item.subItems.length > 0) {
      return sum + item.subItems.reduce((s, sub) => s + getNum(sub.key), 0);
    }
    return sum + getNum(item.key);
  }, 0);
};

//MAIN EXPORT: mapFormDataToBackendPayload

export const mapFormDataToBackendPayload = (formData, currentStep, status = 'draft') => {
  const getNum = (key) => parseFloat(formData[key] || 0);

  // Step 4: Expenditure sub-totals 
  const subTotalExpProperties =
    getNum('exp_rates_taxes') + getNum('exp_repairs_maintenance') +
    getNum('exp_salaries_honorarium') + getNum('exp_insurance') +
    getNum('exp_depreciation_prop') + getNum('exp_other_expenses');

  const subTotalWrittenOff =
    getNum('exp_bad_debts') + getNum('exp_loan_scholarships') +
    getNum('exp_irrecoverable_rents') + getNum('exp_other_items');

  const subTotalObjectsTrust =
    getNum('exp_obj_religious') + getNum('exp_obj_educational') +
    getNum('exp_obj_medical') + getNum('exp_obj_poverty') +
    getNum('exp_obj_other_charitable');

  const baseExpenditureTotal =
    subTotalExpProperties +
    getNum('exp_establishment') + getNum('exp_remuneration_trustees') +
    getNum('exp_remuneration_head') + getNum('exp_legal') +
    getNum('exp_audit') + getNum('exp_contribution_fees') +
    subTotalWrittenOff +
    getNum('exp_misc') + getNum('exp_depreciations') +
    getNum('exp_transfer_reserve') + subTotalObjectsTrust;

  //Step 4: Income sub-totals
  const subTotalIncRent =
    getNum('inc_rent_accrued_inner') + getNum('inc_rent_realised_inner');

  const subTotalIncInterest =
    getNum('inc_interest_accrued_inner') + getNum('inc_interest_realised_inner') +
    getNum('inc_interest_securities_inner') + getNum('inc_interest_loan_inner') +
    getNum('inc_interest_bank_inner');

  const baseIncomeTotal =
    subTotalIncRent + subTotalIncInterest +
    getNum('inc_dividend_outer') + getNum('inc_donations_outer') +
    getNum('inc_grants_outer') + getNum('inc_other_sources_outer') +
    getNum('inc_transfer_reserve_outer');

  const netBalance = baseIncomeTotal - baseExpenditureTotal;
  const autoCalculatedSurplus = netBalance > 0 ? netBalance : 0;
  const surplus =
    formData['exp_surplus_override'] !== undefined && formData['exp_surplus_override'] !== ''
      ? getNum('exp_surplus_override')
      : autoCalculatedSurplus;
  const deficit = netBalance < 0 ? Math.abs(netBalance) : 0;

  const expTotal = baseExpenditureTotal + surplus;
  const incTotal = baseIncomeTotal + deficit;

  //Step 5: Balance sheet totals
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

  // ── Schedule IX
  const totalDeductions = calcTotalDeductions(formData);
  const grossAnnualIncome = Math.max(0, (Number(formData.sch_income_shown) || 0) - totalDeductions);

  // Receipt & Payment totals 
  const recTotal = calcAccountingTotal(receiptItems, formData);
  const payTotal = calcAccountingTotal(paymentItems, formData);

  return {
    reportType: formData.reportType || 'audit',

    // ── Trust Details (Step 1)
    trustDetails: {
      trustNumber: formData.trust_trustNumber || '',
      trustName: formData.trust_trustName || '',
      address: {
        buildingName: formData.trust_addr_buildingName || '',
        buildingNameMarathi: formData.trust_addr_buildingNameMarathi || '',
        streetName: formData.trust_addr_streetName || '',
        streetNameMarathi: formData.trust_addr_streetNameMarathi || '',
        landmark: formData.trust_addr_landmark || '',
        landmarkMarathi: formData.trust_addr_landmarkMarathi || '',
        pin: formData.trust_addr_pin || '',
        district: formData.trust_addr_district || '',
        taluka: formData.trust_addr_taluka || '',
        village: formData.trust_addr_village || '',
      },
    },

    // Auditor Master Details 
    auditorDetails: {
      auditorName: formData.aud_auditorName || '',
      nameOfFirm: formData.aud_nameOfFirm || '',
      status: formData.aud_status || '',
      district: formData.aud_district || '',
      membershipNumber: formData.aud_membershipNumber || '',
      registrationNumber: formData.aud_registrationNumber || '',
    },

    accountingYear: formData.accountingYear || '',

    // Auditor Address
    auditorAddress: {
      address: {
        buildingName: formData.audaddr_buildingName || '',
        buildingNameMarathi: formData.audaddr_buildingNameMarathi || '',
        streetName: formData.audaddr_streetName || '',
        streetNameMarathi: formData.audaddr_streetNameMarathi || '',
        landmark: formData.audaddr_landmark || '',
        landmarkMarathi: formData.audaddr_landmarkMarathi || '',
        pin: formData.audaddr_pin || '',
        district: formData.audaddr_district || '',
        taluka: formData.audaddr_taluka || '',
        village: formData.audaddr_village || '',
      },
      mobileNumber: formData.audaddr_mobileNumber || '',
      emailId: formData.audaddr_emailId || '',
    },

    //Legacy / global fields 
    trustName: formData.trust_trustName || formData.trustName || '',
    registrationNo: formData.registrationNo || '',
    financialYear: formData.financialYear || '',
    address: formData.address || '',
    date: formData.date || '',
    place: formData.place || '',

    currentStep,
    status,

    //Signatures & Stamps
    signatures: [
      { label: 'Signature 1', file: formData.signature_1 },
      { label: 'Signature 2', file: formData.signature_2 },
    ].filter(s => s.file),

    stamps: [
      { label: 'Stamp 1', file: formData.stamp_1 },
      { label: 'Stamp 2', file: formData.stamp_2 },
    ].filter(s => s.file),

    // Step 2: Permissions
    permissions: permissionsQuestions.map((q, i) => ({
      question: q,
      answer: formData[`perm_${i}`] || '',
    })),

    // Step 3: Schedule IX 
    scheduleIX: {
      incomeShown: Number(formData.sch_income_shown) || 0,
      deductions: buildScheduleIXDeductions(formData),
      grossAnnualIncome: grossAnnualIncome,
      contribution: Number(formData.sch_contribution) || 0,
    },

    // Step 4: Income & Expenditure
    incomeExpenditure: {
      expenditures: buildExpenditureRows(formData, surplus),
      incomes: buildIncomeRows(formData, deficit),
      totalExpenditure: expTotal,
      totalIncome: incTotal,
    },

    //Step 5: Balance Sheet
    balanceSheet: {
      fundsLiabilities: buildBalanceSheetRows(fundsLiabilitiesItems, formData, FL_LABEL_MAP),
      propertyAssets: buildBalanceSheetRows(propertyAssetsItems, formData, PA_LABEL_MAP),
      totalFundsLiabilities: flTotal,
      totalPropertyAssets: paTotal,
    },

    //Step 6: Receipt & Payment
    receiptPayment: {
      receipts: buildAccountingRows(receiptItems, formData),
      payments: buildAccountingRows(paymentItems, formData),
      totalReceipts: recTotal,
      totalPayments: payTotal,
    },

    //Step 7: Schedule 9-D
    schedule9D: {
      trustPan: formData.sch9d_trustPan || '',
      incomeTaxRegistration: formData.sch9d_incomeTaxRegistration || '',
      previousITReturns: (formData.sch9d_previousITReturns || []).map((item, i) => ({
        srNo: (i + 1).toString(),
        receiptNo: item.receiptNo || '',
        year: item.year || '',
      })),
      trusteesPan: (formData.sch9d_trusteesPan || []).map((item, i) => ({
        srNo: (i + 1).toString(),
        name: item.name || '',
        pan: item.pan || '',
      })),
    },

    // Step 8: Delay Exemption
    delayExemption: {
      applicantName: formData.delay_applicantName || '',
      applicantAge: formData.delay_applicantAge || '',
      applicantAddress: formData.delay_applicantAddress || '',
      designation: formData.delay_designation || '',
      trustRegistrationDate: formData.delay_trustRegistrationDate || '',
      financialYearMarathi: formData.delay_financialYearMarathi || '',
      place: formData.delay_place || '',
      date: formData.delay_date || '',
    },
  };
};


const formatDateForInput = (dateValue) => {
  if (!dateValue) return '';
  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return dateValue;
  return d.toISOString().split('T')[0];
};

export const mapBackendPayloadToFormData = (report) => {
  const formData = {
    reportType: report.reportType || 'audit',
    trustName: report.trustName || '',
    registrationNo: report.registrationNo || '',
    financialYear: report.financialYear || '',
    address: report.address || '',
    date: formatDateForInput(report.date),
    signature_1: report.signatures?.[0]?.file || '',
    signature_2: report.signatures?.[1]?.file || '',
    stamp_1: report.stamps?.[0]?.file || '',
    stamp_2: report.stamps?.[1]?.file || '',

    trust_trustNumber: report.trustDetails?.trustNumber || '',
    trust_trustName: report.trustDetails?.trustName || report.trustName || '',

    trust_addr_buildingName: report.trustDetails?.address?.buildingName || '',
    trust_addr_buildingNameMarathi: report.trustDetails?.address?.buildingNameMarathi || '',
    trust_addr_streetName: report.trustDetails?.address?.streetName || '',
    trust_addr_streetNameMarathi: report.trustDetails?.address?.streetNameMarathi || '',
    trust_addr_landmark: report.trustDetails?.address?.landmark || '',
    trust_addr_landmarkMarathi: report.trustDetails?.address?.landmarkMarathi || '',
    trust_addr_pin: report.trustDetails?.address?.pin || '',
    trust_addr_district: report.trustDetails?.address?.district || '',
    trust_addr_taluka: report.trustDetails?.address?.taluka || '',
    trust_addr_village: report.trustDetails?.address?.village || '',

    aud_auditorName: report.auditorDetails?.auditorName || '',
    aud_nameOfFirm: report.auditorDetails?.nameOfFirm || '',
    aud_status: report.auditorDetails?.status || '',
    aud_district: report.auditorDetails?.district || '',
    aud_membershipNumber: report.auditorDetails?.membershipNumber || '',
    aud_registrationNumber: report.auditorDetails?.registrationNumber || '',

    accountingYear: report.accountingYear || '',

    audaddr_buildingName: report.auditorAddress?.address?.buildingName || '',
    audaddr_buildingNameMarathi: report.auditorAddress?.address?.buildingNameMarathi || '',
    audaddr_streetName: report.auditorAddress?.address?.streetName || '',
    audaddr_streetNameMarathi: report.auditorAddress?.address?.streetNameMarathi || '',
    audaddr_landmark: report.auditorAddress?.address?.landmark || '',
    audaddr_landmarkMarathi: report.auditorAddress?.address?.landmarkMarathi || '',
    audaddr_pin: report.auditorAddress?.address?.pin || '',
    audaddr_district: report.auditorAddress?.address?.district || '',
    audaddr_taluka: report.auditorAddress?.address?.taluka || '',
    audaddr_village: report.auditorAddress?.address?.village || '',
    audaddr_mobileNumber: report.auditorAddress?.mobileNumber || '',
    audaddr_emailId: report.auditorAddress?.emailId || '',
  };

  //Step 2: Permissions
  if (report.permissions) {
    report.permissions.forEach((p, i) => {
      formData[`perm_${i}`] = p.answer || '';
    });
  }

  //Step 3: Schedule IX 
  if (report.scheduleIX) {
    formData.sch_income_shown = report.scheduleIX.incomeShown || 0;
    formData.sch_contribution = report.scheduleIX.contribution || 0;
    (report.scheduleIX.deductions || []).forEach(d => {
      if (d.key) formData[d.key] = d.amount || 0;
    });
  }

  // Step 4: Income & Expenditure
  if (report.incomeExpenditure) {
    (report.incomeExpenditure.expenditures || []).forEach(e => {
      if (e.key) formData[e.key] = e.amount || 0;
    });
    (report.incomeExpenditure.incomes || []).forEach(i => {
      if (i.key) formData[i.key] = i.amount || 0;
    });
  }

  //Step 5: Balance Sheet
  if (report.balanceSheet) {
    (report.balanceSheet.fundsLiabilities || []).forEach(fl => {
      if (fl.key) formData[fl.key] = fl.amount || 0;
    });
    (report.balanceSheet.propertyAssets || []).forEach(pa => {
      if (pa.key) formData[pa.key] = pa.amount || 0;
    });
  }

  // Step 6: Receipt & Payment 
  if (report.receiptPayment) {
    (report.receiptPayment.receipts || []).forEach(r => {
      if (r.key) formData[r.key] = r.amount || 0;
    });
    (report.receiptPayment.payments || []).forEach(p => {
      if (p.key) formData[p.key] = p.amount || 0;
    });
  }

  // Step 7: Schedule 9-D
  if (report.schedule9D) {
    formData.sch9d_trustPan = report.schedule9D.trustPan || '';
    formData.sch9d_incomeTaxRegistration = report.schedule9D.incomeTaxRegistration || '';
    formData.sch9d_previousITReturns = report.schedule9D.previousITReturns || [];
    formData.sch9d_trusteesPan = report.schedule9D.trusteesPan || [];
  }

  // Step 8: Delay Exemption
  if (report.delayExemption) {
    formData.delay_applicantName = report.delayExemption.applicantName || '';
    formData.delay_applicantAge = report.delayExemption.applicantAge || '';
    formData.delay_applicantAddress = report.delayExemption.applicantAddress || '';
    formData.delay_designation = report.delayExemption.designation || '';
    formData.delay_trustRegistrationDate = formatDateForInput(report.delayExemption.trustRegistrationDate);
    formData.delay_financialYearMarathi = report.delayExemption.financialYearMarathi || '';
    formData.delay_place = report.delayExemption.place || '';
    formData.delay_date = formatDateForInput(report.delayExemption.date);
  }

  return formData;
};
