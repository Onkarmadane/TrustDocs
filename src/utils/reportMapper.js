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
    map[`${item.key}_inner`] = item.label;
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
    if (item.innerKey) map[item.innerKey] = item.label;
    if (item.outerKey) map[item.outerKey] = item.label;
    if (item.subFields) {
      item.subFields.forEach(sub => {
        if (sub.innerKey) map[sub.innerKey] = sub.label;
        if (sub.outerKey) map[sub.outerKey] = sub.label;
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
    if (item.innerKey) map[item.innerKey] = item.label;
    if (item.outerKey) map[item.outerKey] = item.label;
    if (item.subFields) {
      item.subFields.forEach(sub => {
        const innerKey = sub.innerKey || sub.key;
        if (innerKey) map[innerKey] = sub.label;
        if (sub.outerKey) map[sub.outerKey] = sub.label;
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
      rows.push({ key: item.key, label: item.label, amount: null, isHeader: true });
      item.subFields.forEach(sub => {
        const val = getNum(sub.key);
        rows.push({ key: sub.key, label: sub.label, amount: val > 0 ? val : null, isSubItem: true });
      });
    } else {
      // Standalone – outer key is the totalling value used in calculations
      const innerVal = getNum(`${item.key}_inner`);
      const outerVal = getNum(item.key);
      rows.push({
        key: item.key,
        innerKey: `${item.key}_inner`,
        label: item.label,
        amount: innerVal !== 0 ? innerVal : (outerVal !== 0 ? outerVal : null),
        total: outerVal !== 0 ? outerVal : null,
        isHeader: true
      });
    }
  });

  rows.push({
    key: 'exp_surplus_override',
    label: 'To Surplus Carried Over to Balance Sheet',
    amount: surplus > 0 ? surplus : null,
    isHeader: true,
  });

  return rows;
};


// Flat list of income rows with proper labels.
const buildIncomeRows = (formData, deficit) => {
  const getNum = (k) => parseFloat(formData[k] || 0);
  const rows = [];

  incomeItems.forEach(item => {
    if (item.key === 'inc_deficit_row') return; // Skip deficit item here, added explicitly at bottom

    if (item.type === 'nested') {
      rows.push({ key: item.key, label: item.label, amount: null, isHeader: true });
      item.subFields.forEach(sub => {
        const innerVal = getNum(sub.innerKey);
        const outerVal = sub.outerKey ? (getNum(sub.outerKey) || getNum(sub.key)) : null;
        rows.push({
          key: sub.innerKey,
          outerKey: sub.outerKey,
          label: sub.label,
          amount: innerVal !== 0 ? innerVal : (outerVal !== null && outerVal !== 0 ? outerVal : null),
          total: outerVal !== null && outerVal !== 0 ? outerVal : null,
          isSubItem: true
        });
      });
    } else if (item.type === 'double_field') {
      const innerVal = getNum(item.innerKey);
      const outerVal = getNum(item.outerKey) || getNum(item.key);
      rows.push({
        key: item.innerKey,
        outerKey: item.outerKey,
        label: item.label,
        amount: innerVal !== 0 ? innerVal : (outerVal !== 0 ? outerVal : null),
        total: outerVal !== 0 ? outerVal : (innerVal !== 0 ? innerVal : null),
        isHeader: true
      });
    } else if (item.type === 'single_outer') {
      const val = getNum(item.outerKey || item.key);
      rows.push({
        key: item.outerKey || item.key,
        label: item.label,
        amount: val > 0 ? val : null,
        isHeader: true,
      });
    }
  });

  rows.push({
    key: 'inc_deficit_calc',
    label: 'By Deficit Carried Over to Balance Sheet',
    amount: deficit > 0 ? deficit : null,
    isHeader: true,
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
      rows.push({ key: item.key, label: item.label, amount: null, total: null, isHeader: true });

      // Calculate group subtotal if outerKey not manually entered
      let calcGroupTotal = 0;
      let hasAnyVal = false;

      if (item.key === 'fl_trust_funds') {
        const bal = getNum('fl_tf_balance');
        const adjOuter = getNum('fl_tf_adjustment_outer');
        const adjInner = getNum('fl_tf_adjustment_inner');
        calcGroupTotal = adjOuter > 0 ? adjOuter : (bal + adjInner);
        hasAnyVal = bal !== 0 || adjInner !== 0 || adjOuter !== 0;
      } else if (item.key === 'fl_earmarked') {
        const outer = getNum('fl_ef_other_outer');
        calcGroupTotal = outer > 0 ? outer : (getNum('fl_ef_depreciation') + getNum('fl_ef_sinking') + getNum('fl_ef_reserve') + getNum('fl_ef_other_inner'));
        hasAnyVal = calcGroupTotal !== 0;
      } else if (item.key === 'fl_loans') {
        const outer = getNum('fl_lo_others_outer');
        calcGroupTotal = outer > 0 ? outer : (getNum('fl_lo_trustee') + getNum('fl_lo_others_inner'));
        hasAnyVal = calcGroupTotal !== 0;
      } else if (item.key === 'fl_liabilities') {
        const outer = getNum('fl_li_sundry_outer');
        calcGroupTotal = outer > 0 ? outer : (getNum('fl_li_expenses') + getNum('fl_li_advances') + getNum('fl_li_rent') + getNum('fl_li_sundry_inner'));
        hasAnyVal = calcGroupTotal !== 0;
      } else if (item.key === 'fl_income_exp') {
        const ieBal = getNum('fl_ie_balance');
        const surplus = getNum('fl_ie_surplus');
        const deficit = getNum('fl_ie_deficit');
        const appInner = getNum('fl_ie_appropriation_inner');
        const appOuter = getNum('fl_ie_appropriation_outer');
        calcGroupTotal = appOuter > 0 ? appOuter : (ieBal + surplus - deficit - appInner);
        hasAnyVal = ieBal !== 0 || surplus !== 0 || deficit !== 0 || appInner !== 0 || appOuter !== 0;
      } else if (item.key === 'pa_immovable') {
        const bal = getNum('pa_im_balance');
        const add = getNum('pa_im_add');
        const ded = getNum('pa_im_deduction');
        const depInner = getNum('pa_im_dep_inner');
        const depOuter = getNum('pa_im_dep_outer');
        calcGroupTotal = depOuter > 0 ? depOuter : (bal + add - ded - depInner);
        hasAnyVal = bal !== 0 || add !== 0 || ded !== 0 || depInner !== 0 || depOuter !== 0;
      } else if (item.key === 'pa_furniture') {
        const bal = getNum('pa_fu_balance');
        const add = getNum('pa_fu_add');
        const less = getNum('pa_fu_less');
        const depInner = getNum('pa_fu_dep_inner');
        const depOuter = getNum('pa_fu_dep_outer');
        calcGroupTotal = depOuter > 0 ? depOuter : (bal + add - less - depInner);
        hasAnyVal = bal !== 0 || add !== 0 || less !== 0 || depInner !== 0 || depOuter !== 0;
      } else if (item.key === 'pa_loans') {
        const outer = getNum('pa_lo_others_outer');
        calcGroupTotal = outer > 0 ? outer : (getNum('pa_lo_scholarships') + getNum('pa_lo_others_inner'));
        hasAnyVal = calcGroupTotal !== 0;
      } else if (item.key === 'pa_advances') {
        const outer = getNum('pa_ad_others_outer');
        calcGroupTotal = outer > 0 ? outer : (getNum('pa_ad_trustees') + getNum('pa_ad_employees') + getNum('pa_ad_contractor') + getNum('pa_ad_lawyers') + getNum('pa_ad_others_inner'));
        hasAnyVal = calcGroupTotal !== 0;
      } else if (item.key === 'pa_income_outstanding') {
        const outer = getNum('pa_io_other_outer');
        calcGroupTotal = outer > 0 ? outer : (getNum('pa_io_rent') + getNum('pa_io_interest') + getNum('pa_io_other_inner'));
        hasAnyVal = calcGroupTotal !== 0;
      } else if (item.key === 'pa_cash') {
        const outer = getNum('pa_cb_manager_outer');
        calcGroupTotal = outer > 0 ? outer : (getNum('pa_cb_saving') + getNum('pa_cb_current') + getNum('pa_cb_fixed') + getNum('pa_cb_trustee') + getNum('pa_cb_manager_inner'));
        hasAnyVal = calcGroupTotal !== 0;
      }

      item.subFields.forEach((sub, index) => {
        const isLast = index === item.subFields.length - 1;
        const innerKey = sub.innerKey || sub.key;
        const rawInner = formData[innerKey];
        const innerVal = rawInner !== undefined && rawInner !== '' ? parseFloat(rawInner) : null;
        const outerVal = sub.outerKey && formData[sub.outerKey] !== undefined && formData[sub.outerKey] !== '' ? parseFloat(formData[sub.outerKey]) : null;

        let finalAmount = innerVal !== null && (innerVal !== 0 || rawInner === '0' || rawInner === 0) ? innerVal : null;
        let finalTotal = null;

        // If Trust Funds has only balance (opening balance) without adjustments, place it in total column on the balance row
        if (item.key === 'fl_trust_funds' && index === 0 && getNum('fl_tf_adjustment_inner') === 0 && getNum('fl_tf_adjustment_outer') === 0 && getNum('fl_tf_balance') > 0) {
          finalTotal = getNum('fl_tf_balance');
          finalAmount = null;
        } else if (outerVal !== null && outerVal !== 0) {
          finalTotal = outerVal;
        } else if (isLast && hasAnyVal && calcGroupTotal !== 0) {
          finalTotal = calcGroupTotal;
        }

        rows.push({
          key: innerKey,
          outerKey: sub.outerKey,
          label: labelMap[innerKey] || sub.label,
          amount: finalAmount,
          total: finalTotal,
          isSubItem: true,
        });
      });
    } else if (item.type === 'double_field') {
      const innerVal = getNum(item.innerKey);
      const outerVal = getNum(item.outerKey);
      rows.push({
        key: item.innerKey,
        outerKey: item.outerKey,
        label: item.label,
        amount: innerVal !== 0 ? innerVal : null,
        total: outerVal !== 0 ? outerVal : (innerVal !== 0 ? innerVal : null),
        isHeader: true,
      });
    } else {
      const val = getNum(item.outerKey || item.key);
      rows.push({
        key: item.key,
        label: item.label,
        amount: null,
        total: val !== 0 ? val : null,
        isHeader: true,
      });
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

  const isPayment = items.some(i => i.key === 'pay_expenses');

  if (isPayment) {
    let expensesSubTotal = 0;
    const expenseKeys = [
      'pay_meeting', 'pay_traveling', 'pay_printing', 'pay_misc',
      'pay_education', 'pay_bank', 'pay_swachata', 'pay_cultural',
      'pay_tree', 'pay_audit'
    ];
    expenseKeys.forEach(k => { expensesSubTotal += (getNum(k) || getNum(`${k}_total`)); });

    const enteredExpTotal = getNum('pay_expenses_total') || getNum('pay_expenses') || getNum('pay_audit_total');
    const finalExpSubTotal = expensesSubTotal > 0 ? expensesSubTotal : enteredExpTotal;

    items.forEach(item => {
      if (item.key === 'pay_expenses') {
        rows.push({
          key: item.key,
          label: item.label,
          amount: null,
          total: null,
          isHeader: true
        });
      } else if (expenseKeys.includes(item.key)) {
        const isLastExp = item.key === 'pay_audit';
        const val = getNum(item.key);
        const enteredTotal = getNum(`${item.key}_total`);
        rows.push({
          key: item.key,
          label: item.label,
          amount: val !== 0 ? val : null,
          total: enteredTotal > 0 ? enteredTotal : (isLastExp && finalExpSubTotal > 0 ? finalExpSubTotal : null),
          isSubItem: true
        });
      } else if (item.key === 'pay_close') {
        const cash = getNum('pay_cl_cash');
        const bank = getNum('pay_cl_bank');
        const closeTotal = getNum('pay_close_total') || (cash + bank);
        rows.push({
          key: item.key,
          label: item.label,
          amount: null,
          total: null,
          isHeader: true
        });
        (item.subItems || []).forEach((sub, sIdx) => {
          const isLastSub = sIdx === item.subItems.length - 1;
          const subVal = getNum(sub.key);
          rows.push({
            key: sub.key,
            label: sub.label,
            amount: subVal !== 0 ? subVal : (cash > 0 ? 0 : null),
            total: isLastSub && closeTotal > 0 ? closeTotal : null,
            isSubItem: true
          });
        });
      } else {
        const innerVal = getNum(item.key);
        const outerVal = getNum(`${item.key}_total`);
        const finalTotal = outerVal > 0 ? outerVal : (innerVal > 0 ? innerVal : null);
        const finalAmount = innerVal > 0 && outerVal > 0 ? innerVal : null;
        rows.push({
          key: item.key,
          label: item.label,
          amount: finalAmount,
          total: finalTotal,
          isHeader: false
        });
      }
    });
  } else {
    items.forEach(item => {
      if (item.subItems && item.subItems.length > 0) {
        const subSum = item.subItems.reduce((s, sub) => s + (getNum(sub.key) || getNum(`${sub.key}_total`)), 0);
        const outerVal = getNum(`${item.key}_total`);
        const innerVal = getNum(item.key);
        const finalSubTotal = outerVal > 0 ? outerVal : (subSum > 0 ? subSum : (innerVal > 0 ? innerVal : 0));

        rows.push({
          key: item.key,
          label: item.label,
          amount: null,
          total: null,
          isHeader: true
        });
        item.subItems.forEach((sub, sIdx) => {
          const isLastSub = sIdx === item.subItems.length - 1;
          const subVal = getNum(sub.key);
          rows.push({
            key: sub.key,
            label: sub.label,
            amount: subVal !== 0 ? subVal : (subSum > 0 ? 0 : null),
            total: isLastSub && finalSubTotal > 0 ? finalSubTotal : null,
            isSubItem: true
          });
        });
      } else {
        const innerVal = getNum(item.key);
        const outerVal = getNum(`${item.key}_total`);
        const finalTotal = outerVal > 0 ? outerVal : (innerVal > 0 ? innerVal : null);
        const finalAmount = innerVal > 0 && outerVal > 0 ? innerVal : null;
        rows.push({
          key: item.key,
          label: item.label,
          amount: finalAmount,
          total: finalTotal,
          isHeader: false
        });
      }
    });
  }

  return rows;
};

/** Compute receipt total from leaf keys or parent outer/inner totals */
const calcAccountingTotal = (items, formData) => {
  const getNum = (k) => parseFloat(formData[k] || 0);
  const isPayment = items.some(i => i.key === 'pay_expenses');

  if (isPayment) {
    const expenseKeys = [
      'pay_meeting', 'pay_traveling', 'pay_printing', 'pay_misc',
      'pay_education', 'pay_bank', 'pay_swachata', 'pay_cultural',
      'pay_tree', 'pay_audit'
    ];
    const expensesIndividualSum = expenseKeys.reduce((s, k) => s + (getNum(k) || getNum(`${k}_total`)), 0);
    const expensesEnteredTotal = getNum('pay_expenses_total') || getNum('pay_expenses') || getNum('pay_audit_total');
    const finalExpenses = expensesIndividualSum > 0 ? expensesIndividualSum : expensesEnteredTotal;

    const closeCash = getNum('pay_cl_cash');
    const closeBank = getNum('pay_cl_bank');
    const closeTotal = getNum('pay_close_total') || (closeCash + closeBank);

    let otherPaySum = 0;
    items.forEach(item => {
      if (item.key !== 'pay_expenses' && !expenseKeys.includes(item.key) && item.key !== 'pay_close') {
        const outerVal = getNum(`${item.key}_total`);
        const innerVal = getNum(item.key);
        otherPaySum += (outerVal > 0 ? outerVal : innerVal);
      }
    });

    return finalExpenses + closeTotal + otherPaySum;
  } else {
    let sum = 0;
    items.forEach(item => {
      if (item.subItems && item.subItems.length > 0) {
        const subSum = item.subItems.reduce((s, sub) => s + (getNum(sub.key) || getNum(`${sub.key}_total`)), 0);
        const outerVal = getNum(`${item.key}_total`);
        const innerVal = getNum(item.key);
        const parentVal = outerVal > 0 ? outerVal : (subSum > 0 ? subSum : innerVal);
        sum += parentVal;
      } else {
        const outerVal = getNum(`${item.key}_total`);
        const innerVal = getNum(item.key);
        sum += (outerVal > 0 ? outerVal : innerVal);
      }
    });
    return sum;
  }
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
    (getNum('exp_establishment') || getNum('exp_establishment_inner')) +
    (getNum('exp_remuneration_trustees') || getNum('exp_remuneration_trustees_inner')) +
    (getNum('exp_remuneration_head') || getNum('exp_remuneration_head_inner')) +
    (getNum('exp_legal') || getNum('exp_legal_inner')) +
    (getNum('exp_audit') || getNum('exp_audit_inner')) +
    (getNum('exp_contribution_fees') || getNum('exp_contribution_fees_inner')) +
    subTotalWrittenOff +
    (getNum('exp_misc') || getNum('exp_misc_inner')) +
    (getNum('exp_depreciations') || getNum('exp_depreciations_inner')) +
    (getNum('exp_transfer_reserve') || getNum('exp_transfer_reserve_inner')) +
    subTotalObjectsTrust;

  //Step 4: Income sub-totals
  const subTotalIncRent =
    getNum('inc_rent_accrued_inner') + getNum('inc_rent_realised_inner') + getNum('inc_rent_total_outer');

  const subTotalIncInterest =
    getNum('inc_interest_accrued_inner') + getNum('inc_interest_realised_inner') +
    getNum('inc_interest_securities_inner') + getNum('inc_interest_loan_inner') +
    getNum('inc_interest_bank_inner') + getNum('inc_interest_total_outer');

  const baseIncomeTotal =
    subTotalIncRent + subTotalIncInterest +
    (getNum('inc_dividend_outer') || getNum('inc_dividend_inner') || getNum('inc_dividend')) +
    (getNum('inc_donations_outer') || getNum('inc_donations_inner') || getNum('inc_donations')) +
    (getNum('inc_grants_outer') || getNum('inc_grants_inner') || getNum('inc_grants')) +
    (getNum('inc_other_sources_outer') || getNum('inc_other_sources_inner') || getNum('inc_other_sources')) +
    (getNum('inc_transfer_reserve_outer') || getNum('inc_transfer_reserve_inner') || getNum('inc_transfer_reserve'));

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
      let groupTotal = 0;
      let hasOuter = false;
      item.subFields.forEach(sub => {
        if (sub.type === 'double_field' || sub.outerKey) {
          const outV = getNum(sub.outerKey);
          if (outV > 0) {
            groupTotal += outV;
            hasOuter = true;
          }
        }
      });
      if (!hasOuter) {
        if (item.key === 'fl_trust_funds') {
          groupTotal = getNum('fl_tf_balance') + getNum('fl_tf_adjustment_inner');
        } else if (item.key === 'fl_earmarked') {
          groupTotal = getNum('fl_ef_depreciation') + getNum('fl_ef_sinking') + getNum('fl_ef_reserve') + getNum('fl_ef_other_inner');
        } else if (item.key === 'fl_loans') {
          groupTotal = getNum('fl_lo_trustee') + getNum('fl_lo_others_inner');
        } else if (item.key === 'fl_liabilities') {
          groupTotal = getNum('fl_li_expenses') + getNum('fl_li_advances') + getNum('fl_li_rent') + getNum('fl_li_sundry_inner');
        } else if (item.key === 'fl_income_exp') {
          groupTotal = getNum('fl_ie_balance') + getNum('fl_ie_surplus') - getNum('fl_ie_deficit') - getNum('fl_ie_appropriation_inner');
        }
      }
      flTotal += groupTotal;
    } else if (item.type === 'double_field') {
      const outV = getNum(item.outerKey);
      const inV = getNum(item.innerKey);
      flTotal += (outV > 0 ? outV : inV);
    } else {
      flTotal += (getNum(item.outerKey) || getNum(item.key));
    }
  });

  let paTotal = 0;
  propertyAssetsItems.forEach(item => {
    if (item.type === 'nested') {
      let groupTotal = 0;
      let hasOuter = false;
      item.subFields.forEach(sub => {
        if (sub.type === 'double_field' || sub.outerKey) {
          const outV = getNum(sub.outerKey);
          if (outV > 0) {
            groupTotal += outV;
            hasOuter = true;
          }
        }
      });
      if (!hasOuter) {
        if (item.key === 'pa_immovable') {
          groupTotal = getNum('pa_im_balance') + getNum('pa_im_add') - getNum('pa_im_deduction') - getNum('pa_im_dep_inner');
        } else if (item.key === 'pa_furniture') {
          groupTotal = getNum('pa_fu_balance') + getNum('pa_fu_add') - getNum('pa_fu_less') - getNum('pa_fu_dep_inner');
        } else if (item.key === 'pa_loans') {
          groupTotal = getNum('pa_lo_scholarships') + getNum('pa_lo_others_inner');
        } else if (item.key === 'pa_advances') {
          groupTotal = getNum('pa_ad_trustees') + getNum('pa_ad_employees') + getNum('pa_ad_contractor') + getNum('pa_ad_lawyers') + getNum('pa_ad_others_inner');
        } else if (item.key === 'pa_income_outstanding') {
          groupTotal = getNum('pa_io_rent') + getNum('pa_io_interest') + getNum('pa_io_other_inner');
        } else if (item.key === 'pa_cash') {
          groupTotal = getNum('pa_cb_saving') + getNum('pa_cb_current') + getNum('pa_cb_fixed') + getNum('pa_cb_trustee') + getNum('pa_cb_manager_inner');
        }
      }
      paTotal += groupTotal;
    } else if (item.type === 'double_field') {
      const outV = getNum(item.outerKey);
      const inV = getNum(item.innerKey);
      paTotal += (outV > 0 ? outV : inV);
    } else {
      paTotal += (getNum(item.outerKey) || getNum(item.key));
    }
  });

  // ── Schedule IX
  const incomeShown = baseIncomeTotal > 0 ? baseIncomeTotal : (Number(formData.sch_income_shown) || 0);
  const totalDeductions = calcTotalDeductions(formData);
  const grossAnnualIncome = Math.max(0, incomeShown - totalDeductions);

  // Receipt & Payment totals 
  const customRecTotal = Object.keys(formData)
    .filter(k => k.startsWith('rec_custom_') && !k.endsWith('_label'))
    .reduce((sum, key) => sum + (Number(formData[key]) || 0), 0);

  const customPayTotal = Object.keys(formData)
    .filter(k => k.startsWith('pay_custom_') && !k.endsWith('_label'))
    .reduce((sum, key) => sum + (Number(formData[key]) || 0), 0);

  const recTotal = calcAccountingTotal(receiptItems, formData) + customRecTotal;
  const payTotal = calcAccountingTotal(paymentItems, formData) + customPayTotal;

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
      incomeShown: incomeShown,
      deductions: buildScheduleIXDeductions(formData),
      totalDeductions: totalDeductions,
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
      receipts: [
        ...buildAccountingRows(receiptItems, formData),
        ...Object.keys(formData)
          .filter(k => k.startsWith('rec_custom_') && !k.endsWith('_label'))
          .map(key => ({
            key,
            label: formData[`${key}_label`] || 'Custom Receipt',
            amount: null,
            total: Number(formData[key]) || null
          }))
      ],
      payments: [
        ...buildAccountingRows(paymentItems, formData),
        ...Object.keys(formData)
          .filter(k => k.startsWith('pay_custom_') && !k.endsWith('_label'))
          .map(key => ({
            key,
            label: formData[`${key}_label`] || 'Custom Payment',
            amount: Number(formData[key]) || null,
            total: null
          }))
      ],
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
  if (!report) return {};

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

  // Step 2: Permissions
  if (report.permissions && Array.isArray(report.permissions)) {
    report.permissions.forEach((p, i) => {
      formData[`perm_${i}`] = p.answer || '';
    });
  }

  // Step 3: Schedule IX 
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
      if (e.key) {
        formData[e.key] = e.amount || 0;
        if (e.innerKey) {
          formData[e.innerKey] = e.amount || 0;
        }
        if (e.key.includes('surplus')) {
          formData.exp_surplus_override = e.amount || 0;
        }
      }
    });

    (report.incomeExpenditure.incomes || []).forEach(i => {
      if (i.key) {
        formData[i.key] = i.amount || 0;
        if (i.outerKey) {
          formData[i.outerKey] = i.total || i.amount || 0;
        } else if (i.key.endsWith('_inner') && i.total) {
          formData[i.key.replace('_inner', '_outer')] = i.total;
        }
      }
    });
  }

  // Step 5: Balance Sheet
  if (report.balanceSheet) {
    (report.balanceSheet.fundsLiabilities || []).forEach(fl => {
      if (fl.key) {
        formData[fl.key] = fl.amount !== null && fl.amount !== undefined ? fl.amount : (fl.total || 0);
        if (fl.outerKey) {
          formData[fl.outerKey] = fl.total || 0;
        } else if (fl.key.endsWith('_inner') && fl.total) {
          formData[fl.key.replace('_inner', '_outer')] = fl.total;
        }
      }
    });

    (report.balanceSheet.propertyAssets || []).forEach(pa => {
      if (pa.key) {
        formData[pa.key] = pa.amount !== null && pa.amount !== undefined ? pa.amount : (pa.total || 0);
        if (pa.outerKey) {
          formData[pa.outerKey] = pa.total || 0;
        } else if (pa.key.endsWith('_inner') && pa.total) {
          formData[pa.key.replace('_inner', '_outer')] = pa.total;
        }
      }
    });
  }

  // Step 6: Receipt & Payment 
  if (report.receiptPayment) {
    (report.receiptPayment.receipts || []).forEach(r => {
      if (r.key) {
        if (r.key.startsWith('rec_custom_')) {
          formData[r.key] = r.total !== null && r.total !== undefined ? r.total : (r.amount || 0);
          formData[`${r.key}_label`] = r.label || '';
        } else {
          formData[r.key] = r.amount !== null && r.amount !== undefined ? r.amount : 0;
          if (r.total !== null && r.total !== undefined) {
            formData[`${r.key}_total`] = r.total;
          }
        }
      }
    });

    (report.receiptPayment.payments || []).forEach(p => {
      if (p.key) {
        if (p.key.startsWith('pay_custom_')) {
          formData[p.key] = p.amount !== null && p.amount !== undefined ? p.amount : (p.total || 0);
          formData[`${p.key}_label`] = p.label || '';
        } else {
          formData[p.key] = p.amount !== null && p.amount !== undefined ? p.amount : 0;
          if (p.total !== null && p.total !== undefined) {
            formData[`${p.key}_total`] = p.total;
          }
        }
      }
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
