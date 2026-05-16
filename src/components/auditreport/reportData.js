// Step 2: Full permissions/disclosures questions list
export const permissionsQuestions = [
  "(a) Whether accounts are maintained regularly and in accordance with the provisions of the Act and the Rules made thereunder.",
  "(b) Whether receipts and disbursements are properly and correctly shown in the accounts.",
  "(c) Whether the cash balance and vouchers in the custody of the manager or trustee on the date of audit were in agreement with the accounts.",
  "(d) Whether all books, deeds, accounts, vouchers or other documents or records required by the auditor were produced before him.",
  "(e) Whether a register of movable and immovable properties is maintained and particulars communicated from time to time to his regional office, and the public trust administration has been informed about any change in management.",
  "(f) Whether the manager or trustee or any other person has any interest in the investment of the trust and has furnished the necessary information to the auditor.",
  "(g) Whether any property of the Trust was applied for any object or purpose other than the objects or purpose of the Trust.",
  "(h) The amounts of outstanding for more than one year and the amounts written off, if any.",
  "(i) Whether the trust's money was lent to any person in contravention involving expenditure exceeding Rs. 5000/-",
  "(j) Whether any change of the public trust is retrospect contrary to the provisions of Section 38.",
  "(k) Attention, if any, of the immovable property, contrary to the provisions of section 36 which have come to the notice of the auditor.",
  "(l) Any case of irregular, illegal or improper expenditure, or failure or omission to recover monies or other property belonging to the public trust or any loss or waste of money or other property thereof and whether such expenditure, failure, omission, loss or waste was caused in consequence of breach of trust or misapplication or any other misconduct of the trustee.",
  "(m) Whether the trust(ee) has been issued the form prescribed by the Act and has any return been filed by him.",
  "(n) Whether the income and expenditure status of the trust is maintained.",
  "(o) Whether the meetings were held regularly as provided in such instrument.",
  "(p) Whether the return/accounts of the proceedings of the meetings are maintained.",
  "(q) Whether any office or place is used for purpose of the trust.",
  "(r) Whether any office is situated on a public or private property of the trust.",
  "(s) Whether the expenditure of the trust on the particular event is fulfilled.",
  "(t) Whether the income and expenditure account of the charity trust fund has not been complied with or has not been audited during the period of audit.",
  "(u) Any special matter which the auditor may think fit or is necessary to bring to the notice of the Deputy or Assistant Charity Commissioner.",
];

// Step 3: Income & Expenditure — left side (Expenditure)
export const expenditureItems = [
  { key: 'exp_properties', label: 'To Expenditure in respect of properties :-', subItems: ['Rates, Taxes, Cesses Repairs & Maintenance', 'Salary', 'Insurance', 'Depreciation (by way of provision of adjustment)', 'Other Expenses'] },
  { key: 'exp_establishment', label: 'To Establishment Expenses' },
  { key: 'exp_remuneration_trustees', label: 'To Remuneration to Trustees' },
  { key: 'exp_remuneration_math', label: 'To Remuneration (in the case of a math) to the head of the math, including his household expenditure, if any' },
  { key: 'exp_legal', label: 'To Legal Fees' },
  { key: 'exp_audit', label: 'To Audit Fees' },
  { key: 'exp_contribution', label: 'To Contribution and Fees' },
  { key: 'exp_written_off', label: 'To Amount written off :-', subItems: ['(a) Bad Debts', '(b) Loan Scholarship', '(c) Irrecoverable Rents (d)', 'Other Items'] },
  { key: 'exp_misc', label: 'To Miscellaneous Expenses' },
  { key: 'exp_depreciation', label: 'To Depreciation' },
  { key: 'exp_reserve', label: 'To Amount transferred to Reserve or Specific Funds' },
  { key: 'exp_objects', label: 'To Expenditure on Objects of the Trust', subItems: ['(a) Religious', '(b) Educational', '(c) Medical Relief', '(d) Relief of Poverty', '(e) Other Charitable Objects'] },
  { key: 'exp_surplus', label: 'To Surplus carried over to Balance Sheet' },
];

// Step 3: Income & Expenditure — right side (Income)
export const incomeItems = [
  { key: 'inc_rent', label: 'By Rent (accrued) (realized)' },
  { key: 'inc_interest', label: 'By Interest (accrued) (realized)' },
  { key: 'inc_dividend', label: 'By Dividend' },
  { key: 'inc_donations', label: 'By Donations in Cash or Kind' },
  { key: 'inc_grants', label: 'By Grants' },
  { key: 'inc_other', label: 'By Income from other sources (in details as far as possible)' },
  { key: 'inc_reserve', label: 'By Transfer from Reserve' },
  { key: 'inc_deficit', label: 'By Deficit carried over to Balance Sheet' },
];

// Step 4: Balance Sheet — left side (Funds & Liabilities)
export const fundsLiabilitiesItems = [
  { key: 'fl_trust_funds', label: 'Trust Funds or Corpus', subItems: [
    { key: 'fl_tf_balance', label: 'Balance as per last Balance Sheet' },
    { key: 'fl_tf_adjustments', label: 'Adjustments, if any, during the year (give details)' },
  ]},
  { key: 'fl_earmarked', label: 'Other Earmarked Funds', subItems: [
    { key: 'fl_ef_depreciation', label: 'Depreciation fund (or Provision for Depreciation)' },
    { key: 'fl_ef_sinking', label: 'Sinking Fund' },
    { key: 'fl_ef_reserve', label: 'Reserve Fund (for specific purposes)' },
    { key: 'fl_ef_others', label: 'Any other Fund' },
  ]},
  { key: 'fl_loans', label: 'Loans (Secured or Unsecured)', subItems: [
    { key: 'fl_lo_from_trustees', label: "From Trustee's/Office Bearer's" },
    { key: 'fl_lo_from_others', label: 'From Others' },
    { key: 'fl_lo_mortgage', label: 'Mortgage' },
    { key: 'fl_lo_on_hypothecation', label: 'On hypothecation' },
  ]},
  { key: 'fl_liabilities', label: 'Liabilities', subItems: [
    { key: 'fl_li_audit', label: 'For Audit Fee' },
    { key: 'fl_li_expenses', label: 'For Expenses' },
    { key: 'fl_li_rent', label: 'For Rent' },
    { key: 'fl_li_for_advances', label: 'For Advances' },
    { key: 'fl_li_sundry', label: 'For Sundry Credit Balances' },
  ]},
  { key: 'fl_income_exp', label: 'Income & expenditure A/c', subItems: [
    { key: 'fl_ie_balance', label: 'Balance as per last Balance Sheet' },
    { key: 'fl_ie_additions', label: 'Add: Surplus/(Deficit) as per I&E A/c' },
    { key: 'fl_ie_less', label: 'Less :- Appropriations, if any' },
  ]},
];

// Step 4: Balance Sheet — right side (Property & Assets)
export const propertyAssetsItems = [
  { key: 'pa_immovable', label: 'Immovable Properties (at cost)', subItems: [
    { key: 'pa_im_balance', label: 'Balance as per last Balance Sheet' },
    { key: 'pa_im_add', label: 'Add: During the year' },
    { key: 'pa_im_less', label: 'Less: Sales during the year' },
    { key: 'pa_im_dep', label: 'Less:Depreciation up to date' },
  ]},
  { key: 'pa_investments', label: 'Investments', subItems: [
    { key: 'pa_inv_nic', label: 'NIC' },
    { key: 'pa_inv_other', label: 'Others' },
  ]},
  { key: 'pa_furniture', label: 'Furniture & Fixtures', subItems: [
    { key: 'pa_fu_balance', label: 'Add: During the year' },
    { key: 'pa_fu_less', label: 'Less: Sales during the year' },
    { key: 'pa_fu_dep', label: 'Depreciation' },
  ]},
  { key: 'pa_loans', label: 'Loans (Secured or Unsecured)', subItems: [
    { key: 'pa_lo_balance', label: 'Balance as per last Balance Sheet' },
    { key: 'pa_lo_add', label: 'Add: During the year' },
    { key: 'pa_lo_less', label: 'Less: Recovered during the year' },
  ]},
  { key: 'pa_advances', label: 'Advances', subItems: [
    { key: 'pa_ad_deposits', label: 'Deposits' },
    { key: 'pa_ad_prepaid', label: 'Prepaid Expenses' },
    { key: 'pa_ad_to_employees', label: 'To Employees' },
  ]},
  { key: 'pa_income_outstanding', label: 'Income Outstanding', subItems: [
    { key: 'pa_io_rent', label: 'Rent' },
    { key: 'pa_io_interest', label: 'Interest' },
    { key: 'pa_io_other', label: 'Other Income' },
  ]},
  { key: 'pa_cash', label: 'Cash & Bank Balances', subItems: [
    { key: 'pa_cb_cash', label: 'Cash in Hand' },
    { key: 'pa_cb_postoffice', label: 'In Post Office Savings A/C' },
    { key: 'pa_cb_fixed', label: 'Fixed Deposits' },
    { key: 'pa_cb_savings', label: 'With the Branch' },
    { key: 'pa_cb_other', label: 'With the Manager' },
  ]},
];

// Step 3: Schedule IX — Deduction items (Page 3.1)
export const scheduleIXItems = [
  { key: 'sch_grants', label: 'i) Grants received from Government and local authorities' },
  { key: 'sch_sinking', label: 'ii) Interest on Sinking or Depreciation Fund' },
  { key: 'sch_education', label: 'iii) Amount spent for the purpose of secular education.' },
  { key: 'sch_medical', label: 'iv) Amount spent for the purpose of medical relief' },
  { key: 'sch_veterinary', label: 'v) Amount spent for the purpose of veterinary treatment of animals' },
  { key: 'sch_calamity', label: 'vi) Expenditure incurred from donations for relief of distress caused by scarcity, drought, flood, fire or other natural calamity' },
  { key: 'sch_agri', label: 'vii) Deductions out of income from lands used for agricultural purposes' },
  { key: 'sch_non_agri', label: 'viii) Deductions out of income from lands used for non-agricultural purposes' },
  { key: 'sch_production', label: 'ix) Cost of production, if lands are cultivated by Trust' },
  { key: 'sch_securities', label: 'x) Deductions out of income from securities, stocks etc. at 1% of such income' },
  { key: 'sch_repairs', label: 'xi) Deduction on account of repairs in respect of building not rented and yielding no income at 10% of the estimated gross annual rent' },
];
