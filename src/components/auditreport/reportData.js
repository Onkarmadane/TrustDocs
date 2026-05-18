// Step 2: Full permissions/disclosures questions list
export const permissionsQuestions = [
  "a] Whether accounts are maintained regularly and in accordance with the provision or the Act and rules ;",
  "b] Whether receipts and disbursements are properly and correctly shown in the accounts ;",
  "c] Whether the cash balance and vouchers in the custody of the manager or trustee on the data of audit were in agreement with the accounts;",
  "d] Whether all books, deeds, accounts, vouchers or other documents or records required by the auditor were products before him;",
  "e] Whether a register of movable and no changes therein are communicated from time to the regional office, and the defects and inaccuracies mentioned in the previous audit report have been duly complied with;",
  "f] Whether the manager or trustee or any other person required by the auditor to appear before him did so and furnished the necessary information required by him;",
  "g] Whether any property of funds of the Trust were applied for any object or purpose other than the object or purpose of the Trust;",
  "h] The amounts of outstandings for more than one year and the amounts written off, if any;",
  "I] Whether tenders were invited for repairs or construction involving expenditure exceeding Rs. 5000/-;",
  "j] Whether any money of the public trust has been invested contrary to the provisions of Section 35;",
  "k] Alienations, if any, of the immovable property contrary to the provision of section 36 which have come to the notice of the auditor;",
  "l] All cases of irregular, illegal or improper expenditure, or failure or omission to recover monies or other property belonging to the public trust or of loss or waste of money or other property thereof, and whether such expenditure, failure, omission, loss or waste was caused in consequence of breach of trust or misapplication or any other misconduct on the part of the trustees or any other person while in the management of the trust;",
  "m] Whether the budget has been filed in the form provided by rule 16A;",
  "n] Whether the maximum and minimum number of the trustees is maintained;",
  "o] Whether the meetings are held regularly as provided in such instrument;",
  "p] Whether the minute books of the proceedings of the meetings is maintained;",
  "q] Whether any of the trustees has any interest in the investment of the trust;",
  "r] Whether any of the trustees is a debtor or creditor of the trust;",
  "s] Whether the irregularities pointed out by the auditors in the accounts of the previous year have been duly complied with by the trustees during the period of audit;",
  "t] Any special matter which the auditor may think fit or necessary to bring to the notice of the Deputy or Assistant Charity Commissioner."
];

// Step 4: Income & Expenditure — left side (Expenditure)
export const expenditureItems = [
  { key: 'exp_properties', label: 'To Expenditure in respect of properties :-', subItems: ['Rates, Taxes, Cesses', 'Repairs & Maintenance', 'Salaries', 'Insurance', 'Depreciation (by way of provision of adjustments)', 'Other Expenses', 'Rent Exp'] },
  { key: 'exp_establishment', label: 'To Establishment Expenses' },
  { key: 'exp_remuneration_trustees', label: 'To Remuneration to Trustees' },
  { key: 'exp_remuneration_math', label: 'To Remuneration (in the case of a math) to the head of the math, including his household expenditure, if any' },
  { key: 'exp_legal', label: 'To Legal Fees' },
  { key: 'exp_audit', label: 'To Audit Fees' },
  { key: 'exp_contribution', label: 'To Contribution and Fees' },
  { key: 'exp_written_off', label: 'To Amount written off :-', subItems: ['(a) Bad Debts', '(b) Loan Scholarship', '(c) Irrecoverable Rents', '(d) Other Items'] },
  { key: 'exp_misc', label: 'To Miscellaneous Expenses' },
  { key: 'exp_depreciation', label: 'To Depreciation' },
  { key: 'exp_reserve', label: 'To Amount transferred to Reserve or Specific Funds' },
  { key: 'exp_objects', label: 'To Expenditure on Objects of the Trust', subItems: ['(a) Religious', '(b) Educational', '(c) Medical Relief', '(d) Relief of Poverty', '(e) Other Charitable Objects'] },
  { key: 'exp_surplus', label: 'To Surplus carried over to Balance Sheet' },
];

// Step 4: Income & Expenditure — right side (Income)
export const incomeItems = [
  { key: 'inc_rent', label: 'By Rent (accrued) (realised)' },
  { key: 'inc_interest', label: 'By Interest (accrued) (realised)' },
  { key: 'inc_dividend', label: 'By Dividend' },
  { key: 'inc_donations', label: 'By Donations in Cash or Kind' },
  { key: 'inc_grants', label: 'By Grants' },
  { key: 'inc_other', label: 'By Income from other sources' },
  { key: 'inc_reserve', label: 'By Transfer from Reserve' },
  { key: 'inc_deficit', label: 'By Deficit carried over to Balance Sheet' },
];

// Step 5: Balance Sheet — left side (Funds & Liabilities)
export const fundsLiabilitiesItems = [
  { key: 'fl_trust_funds', label: 'Trust Funds or Corpus', subItems: [
    { key: 'fl_tf_balance', label: 'Balance as per last B/S' },
  ]},
  { key: 'fl_earmarked', label: 'Other Earmarked Fund (Created under the prov. of deed or scheme or Income)', subItems: [
    { key: 'fl_ef_building', label: 'Building Fund' },
    { key: 'fl_ef_reserve', label: 'Reserve Fund' },
    { key: 'fl_ef_others', label: 'Any other Fund' },
  ]},
  { key: 'fl_loans', label: 'Loans (Secured / Unsecured)', subItems: [
    { key: 'fl_lo_from_trustees', label: "From Trustees/others Anamat" },
    { key: 'fl_lo_addition', label: 'Addition During the Year' },
    { key: 'fl_lo_anamat', label: 'Anamat' },
    { key: 'fl_lo_add_during', label: 'Add:During the year' },
  ]},
  { key: 'fl_liabilities', label: 'Liabilities', subItems: [
    { key: 'fl_li_expenses', label: 'For Expenses' },
    { key: 'fl_li_advances', label: 'For advances' },
    { key: 'fl_li_rent', label: 'For rent and other deposits' },
    { key: 'fl_li_sundry', label: 'For sundry credit balances' },
  ]},
  { key: 'fl_income_exp', label: 'Income & expenditure A/c', subItems: [
    { key: 'fl_ie_balance', label: 'Balance as per last B/S' },
    { key: 'fl_ie_additions', label: 'Add:As per Income & Exp.' },
    { key: 'fl_ie_less', label: 'Less:- Apropriation,if any' },
  ]},
];

// Step 5: Balance Sheet — right side (Property & Assets)
export const propertyAssetsItems = [
  { key: 'pa_immovable', label: 'Immovable Properties (At cost)', subItems: [
    { key: 'pa_im_balance', label: 'Balance as per Last B/S' },
    { key: 'pa_im_const', label: 'Construction' },
    { key: 'pa_im_add', label: 'Add:During the year' },
    { key: 'pa_im_less', label: 'Less: Sales during the year' },
    { key: 'pa_im_dep', label: 'Depreciation up to date' },
  ]},
  { key: 'pa_investments', label: 'Investments', subItems: [
    { key: 'pa_inv_nsc', label: 'NSC' },
  ]},
  { key: 'pa_furniture', label: 'Furniture & Fixtures', subItems: [
    { key: 'pa_fu_balance', label: 'Balance as per last B/S' },
    { key: 'pa_fu_add', label: 'Add:During the year' },
    { key: 'pa_fu_less', label: 'Less: Sales during the year' },
  ]},
  { key: 'pa_books', label: 'Books', subItems: [
    { key: 'pa_bo_add', label: 'Add:During the year' },
    { key: 'pa_bo_comp', label: 'Computer Purchases' },
  ]},
  { key: 'pa_loans', label: 'Loans (Secured or Unsecured)', subItems: [
    { key: 'pa_lo_advances', label: 'Advances' },
    { key: 'pa_lo_trustees', label: 'To Trustees' },
    { key: 'pa_lo_employees', label: 'To Employees' },
  ]},
  { key: 'pa_income_outstanding', label: 'Income outstanding:', subItems: [
    { key: 'pa_io_rent', label: 'Rent' },
    { key: 'pa_io_interest', label: 'Interest' },
    { key: 'pa_io_other', label: 'other Income' },
  ]},
  { key: 'pa_cash', label: 'Cash & Bank Balances', subItems: [
    { key: 'pa_cb_saving', label: '(a) In Saving account in fixed Deposit A/c with' },
    { key: 'pa_cb_trustee', label: '(b) With the Trustee' },
    { key: 'pa_cb_manager', label: '(C) With the Manger' },
  ]},
  { key: 'pa_income_exp', label: 'Income and Expenditure A/c', subItems: [
    { key: 'pa_ie_balance', label: 'Balance as per Last B/S' },
    { key: 'pa_ie_less', label: 'Less Appropriation if any' },
  ]},
];

// Step 3: Schedule IX — Deduction items
export const scheduleIXItems = [
  { key: 'sch_grants', label: 'ii) Grants received from Government and local authorities' },
  { key: 'sch_sinking', label: 'iii) Interest or Sinking or Depreciation Fund' },
  { key: 'sch_education', label: 'iv) Amount spent for the purpose of secular education.' },
  { key: 'sch_medical', label: 'v) Amount spent for the purpose of medical relief' },
  { key: 'sch_veterinary', label: 'vi) Amount spent for the purpose of veterinary treatment of animals' },
  { key: 'sch_calamity', label: 'vii) Expenditure incurred from donations for relief of distress caused by scarcity, drought, flood, fire or other natural calamity' },
  { key: 'sch_agri', label: 'viii) Deductions out of income from lands used for agricultural purpose:', subItems: [
    { key: 'sch_agri_a', label: 'a] Land Revenue and local Fund cess' },
    { key: 'sch_agri_b', label: 'b] Rent payable to superior landlord' },
    { key: 'sch_agri_c', label: 'c] Cost of production, if lands are cultivated by trust' },
  ]},
  { key: 'sch_non_agri', label: 'ix) Deductions out of income from lands used for non agricultural purpose:', subItems: [
    { key: 'sch_non_agri_a', label: 'a] Assessment, cesses and other Government or Municipal taxes' },
    { key: 'sch_non_agri_b', label: 'b] Ground rent payable to the superior landlord' },
    { key: 'sch_non_agri_c', label: 'c] Insurance premium' },
    { key: 'sch_non_agri_d', label: 'd] Repairs at 10% of gross rent of Building let out' },
    { key: 'sch_non_agri_e', label: 'e] Cost of Collection at 4 percent of gross rent of buildings let out.' },
  ]},
  { key: 'sch_securities_1', label: 'x) Cost of collection of income or receipts from securities, stocks etc at 1% of such income' },
  { key: 'sch_securities_2', label: 'xi) Cost of collection of income or receipts from securities, stocks etc at 1% of such income' }, // Duplicated as per image
  { key: 'sch_repairs', label: 'Deduction on account of repairs in respect of building not rented and yielding no income at 10% of the estimated gross annual rent' },
];

// Step 6: Receipt & Payment Account
export const receiptItems = [
  { key: 'rec_open', label: 'To Opening Balance', subItems: [
    { key: 'rec_op_cash', label: 'Cash' },
    { key: 'rec_op_bank', label: 'Bank' },
  ]},
  { key: 'rec_receipts', label: 'To Receipts' },
  { key: 'rec_members', label: 'To Members Contribution' },
  { key: 'rec_donation', label: 'To Donation Received' },
];

export const paymentItems = [
  { key: 'pay_expenses', label: 'By Expenses' },
  { key: 'pay_meeting', label: 'By Meeting Exp.' },
  { key: 'pay_traveling', label: 'By Traveling Exp.' },
  { key: 'pay_printing', label: 'By Printing & Stationery Exp.' },
  { key: 'pay_misc', label: 'By Miscellaneous Expenses' },
  { key: 'pay_education', label: 'By Education Exp.' },
  { key: 'pay_bank', label: 'By Bank Charges Exp.' },
  { key: 'pay_swachata', label: 'By Swachata Abhiyan Exp.' },
  { key: 'pay_cultural', label: 'By Cultural Program Exp.' },
  { key: 'pay_tree', label: 'By Tree Plantation Fees' },
  { key: 'pay_audit', label: 'By Audit Fees' },
  { key: 'pay_close', label: 'By Closing Balances', subItems: [
    { key: 'pay_cl_cash', label: 'Cash In Hand' },
    { key: 'pay_cl_bank', label: 'Bank' },
  ]},
];
