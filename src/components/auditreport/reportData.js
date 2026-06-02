// Step 2: Full permissions/disclosures questions list
export const permissionsQuestions = [
  "Whether accounts are maintained regularly and in accordance with the provision or the Act and rules?",
  "Whether receipts and disbursements are properly and correctly shown in the accounts?",
  "Whether the cash balance and vouchers in the custody of the manager or trustee on the data of audit were in agreement with the accounts?",
  "Whether all books, deeds, accounts, vouchers or other documents or records required by the auditor were products before him?",
  "Whether a register of movable and no changes therein are communicated from time to the regional office, and the defects and inaccuracies mentioned in the previous audit report have been duly complied with?",
  "Whether the manager or trustee or any other person required by the auditor to appear before him did so and furnished the necessary information required by him?",
  "Whether any property of funds of the Trust were applied for any object or purpose other than the object or purpose of the Trust?",
  "The amounts of outstandings for more than one year and the amounts written off, if any",
  "Whether tenders were invited for repairs or construction involving expenditure exceeding Rs. 5000/-?",
  "Whether any money of the public trust has been invested contrary to the provisions of Section 35?",
  "Alienations, if any, of the immovable property contrary to the provision of section 36 which have come to the notice of the auditor",
  "All cases of irregular, illegal or improper expenditure, or failure or omission to recover monies or other property belonging to the public trust or of loss or waste of money or other property thereof, and whether such expenditure, failure, omission, loss or waste was caused in consequence of breach of trust or misapplication or any other misconduct on the part of the trustees or any other person while in the management of the trust;",
  "Whether the budget has been filed in the form provided by rule 16A?",
  "Whether the maximum and minimum number of the trustees is maintained.",
  "Whether the meetings are held regularly as provided in such instrument.",
  "Whether the minute books of the proceedings of the meetings is maintained.",
  "Whether any of the trustees has any interest in the investment of the trust.",
  "Whether any of the trustees is a debtor or creditor of the trust.",
  "Whether the irregularities pointed out by the auditors in the accounts of the previous year have been duly complied with by the trustees during the period of audit.",
  "Any special matter which the auditor may think fit or necessary to bring to the notice of the Deputy or Assistant Charity Commissioner."
];

// Step 4: Income & Expenditure — Left Side (Expenditure)
export const expenditureItems = [
  {
    key: "exp_properties",
    label: "To Expenditure In Respect Of Properties",
    type: "nested",
    subFields: [
      { key: "exp_rates_taxes", label: "Plates, Taxes, Cesses" },
      { key: "exp_repairs_maintenance", label: "Repairs And Maintenance" },
      { key: "exp_salaries_honorarium", label: "Salaries/Honorarium" },
      { key: "exp_insurance", label: "Insurance" },
      { key: "exp_depreciation_prop", label: "Depreciation" },
      { key: "exp_other_expenses", label: "Other Expenses" }
    ]
  },
  { key: "exp_establishment", label: "To Establishment Expenses", type: "standalone" },
  { key: "exp_remuneration_trustees", label: "To Remuneration To Trustees", type: "standalone" },
  { key: "exp_remuneration_head", label: "To Remuneration To Head Of Math", type: "standalone" },
  { key: "exp_legal", label: "To Legal Expenses", type: "standalone" },
  { key: "exp_audit", label: "To Audit Fees", type: "standalone" },
  { key: "exp_contribution_fees", label: "To Contribution And Fees", type: "standalone" },
  {
    key: "exp_amount_written_off",
    label: "To Amount Written Off",
    type: "nested",
    subFields: [
      { key: "exp_bad_debts", label: "Bad Debts" },
      { key: "exp_loan_scholarships", label: "Loan/Scholarships" },
      { key: "exp_irrecoverable_rents", label: "Irrecoverable Rents" },
      { key: "exp_other_items", label: "Other Items" }
    ]
  },
  { key: "exp_misc", label: "To Miscellaneous Expenses", type: "standalone" },
  { key: "exp_depreciations", label: "To Depreciations", type: "standalone" },
  { key: "exp_transfer_reserve", label: "To Amounts Transferred To Reserve or Specific Funds", type: "standalone" },
  {
    key: "exp_objects_of_trust",
    label: "To Expenditure On Objects Of The Trust",
    type: "nested",
    subFields: [
      { key: "exp_obj_religious", label: "Religious" },
      { key: "exp_obj_educational", label: "Educational" },
      { key: "exp_obj_medical", label: "Medical Relief" },
      { key: "exp_obj_poverty", label: "Relief of Poverty" },
      { key: "exp_obj_other_charitable", label: "Other Charitable Objects" }
    ]
  }
];

// Step 4: Income & Expenditure — Right Side (Income)
export const incomeItems = [
  {
    key: "inc_rent_header",
    label: "By Rent",
    type: "nested",
    subFields: [
      { 
        label: "Accrued", 
        type: "single_inner",
        innerKey: "inc_rent_accrued_inner" 
      },
      { 
        label: "Realised", 
        type: "double_field", // <--- 2-2 input fields on this line
        innerKey: "inc_rent_realised_inner", 
        outerKey: "inc_rent_total_outer" 
      }
    ]
  },
  {
    key: "inc_interest_header",
    label: "By Interest",
    type: "nested",
    subFields: [
      { label: "Accrued", type: "single_inner", innerKey: "inc_interest_accrued_inner" },
      { label: "Realised", type: "single_inner", innerKey: "inc_interest_realised_inner" },
      { label: "On Securities", type: "single_inner", innerKey: "inc_interest_securities_inner" },
      { label: "On Loan", type: "single_inner", innerKey: "inc_interest_loan_inner" },
      { 
        label: "On Bank Account", 
        type: "double_field", // <--- 2-2 input fields on this line
        innerKey: "inc_interest_bank_inner", 
        outerKey: "inc_interest_total_outer" 
      }
    ]
  },
  {
    key: "inc_dividend_header",
    label: "By Dividend",
    type: "double_field",
    innerKey: "inc_dividend_inner",
    outerKey: "inc_dividend_outer"
  },
  {
    key: "inc_donations_header",
    label: "By Donations In Cash or Kind",
    type: "double_field",
    innerKey: "inc_donations_inner",
    outerKey: "inc_donations_outer"
  },
  {
    key: "inc_grants_header",
    label: "By Grants",
    type: "double_field",
    innerKey: "inc_grants_inner",
    outerKey: "inc_grants_outer"
  },
  {
    key: "inc_other_sources_header",
    label: "By Income From Other Sources",
    type: "double_field",
    innerKey: "inc_other_sources_inner",
    outerKey: "inc_other_sources_outer"
  },
  {
    key: "inc_transfer_reserve_header",
    label: "By Transfer From Reserve",
    type: "double_field",
    innerKey: "inc_transfer_reserve_inner",
    outerKey: "inc_transfer_reserve_outer"
  },
  {
    key: "inc_deficit_row",
    label: "By Deficit Carried Over To Balance Sheet",
    type: "single_outer",
    outerKey: "inc_deficit_outer"
  }
];

// Step 5: Balance Sheet — left side (Funds & Liabilities)
export const fundsLiabilitiesItems = [
  {
    key: 'fl_trust_funds',
    label: 'Trust Funds or Corpus',
    type: 'nested',
    subFields: [
      { key: 'fl_tf_balance', label: 'Balance As Per Last Balance-Sheet' },
      { key: 'fl_tf_adjustment_inner', outerKey: 'fl_tf_adjustment_outer', label: 'Adjustment during the year (give details)', type: 'double_field' },
    ]
  },
  {
    key: 'fl_earmarked',
    label: 'Other Earmarked Funds (Created under the Provisions of the trust-deed or scheme or out of the income)',
    type: 'nested',
    subFields: [
      { key: 'fl_ef_depreciation', label: 'Depreciation Fund' },
      { key: 'fl_ef_sinking', label: 'Sinking Fund' },
      { key: 'fl_ef_reserve', label: 'Reserve Fund' },
      { key: 'fl_ef_other_inner', outerKey: 'fl_ef_other_outer', label: 'Any Other Fund', type: 'double_field' },
    ]
  },
  {
    key: 'fl_loans',
    label: 'Loans (Secured or Unsecured)',
    type: 'nested',
    subFields: [
      { key: 'fl_lo_trustee', label: 'From Trustee' },
      { key: 'fl_lo_others_inner', outerKey: 'fl_lo_others_outer', label: 'From Others', type: 'double_field' },
    ]
  },
  {
    key: 'fl_liabilities',
    label: 'Liabilities',
    type: 'nested',
    subFields: [
      { key: 'fl_li_expenses', label: 'For Expenses' },
      { key: 'fl_li_advances', label: 'For Advances' },
      { key: 'fl_li_rent', label: 'For Rent & Other Deposits' },
      { key: 'fl_li_sundry_inner', outerKey: 'fl_li_sundry_outer', label: 'For Sundry Credit Balances', type: 'double_field' },
    ]
  },
  {
    key: 'fl_income_exp',
    label: 'Income And Expenditure Account',
    type: 'nested',
    subFields: [
      { key: 'fl_ie_balance', label: 'Add : Balance As Per Last Balance-Sheet' },
      { key: 'fl_ie_surplus', label: 'Add : Surplus as per Income' },
      { key: 'fl_ie_deficit', label: 'Less : Deficit Expenditure Account' },
      { key: 'fl_ie_appropriation_inner', outerKey: 'fl_ie_appropriation_outer', label: 'Less : Appropriation If Any', type: 'double_field' },
    ]
  }
];

// Step 5: Balance Sheet — right side (Property & Assets)
export const propertyAssetsItems = [
  {
    key: 'pa_immovable',
    label: 'Immovable Properties',
    type: 'nested',
    subFields: [
      { key: 'pa_im_balance', label: 'Balance As Per Last Balance-Sheet' },
      { key: 'pa_im_add', label: 'Additions during the year' },
      { key: 'pa_im_deduction', label: 'Less : Deductions during the Year (U/S 36 permission must be taken)' },
      { key: 'pa_im_dep_inner', outerKey: 'pa_im_dep_outer', label: 'Less : Depreciation up to date', type: 'double_field' },
    ]
  },
  {
    key: 'pa_investments',
    label: 'Investments',
    type: 'double_field',
    innerKey: 'pa_inv_inner',
    outerKey: 'pa_inv_outer'
  },
  {
    key: 'pa_furniture',
    label: 'Furniture And Fixtures',
    type: 'nested',
    subFields: [
      { key: 'pa_fu_balance', label: 'Balance As Per Last Balance-Sheet' },
      { key: 'pa_fu_add', label: 'Additions during the year' },
      { key: 'pa_fu_less', label: 'Less : Sales during the year' },
      { key: 'pa_fu_dep_inner', outerKey: 'pa_fu_dep_outer', label: 'Less : Depreciation up to date', type: 'double_field' },
    ]
  },
  {
    key: 'pa_loans',
    label: 'Loans (Secured or Unsecured) - Good/Doubtful',
    type: 'nested',
    subFields: [
      { key: 'pa_lo_scholarships', label: 'Loan Scholarships' },
      { key: 'pa_lo_others_inner', outerKey: 'pa_lo_others_outer', label: 'Other Loans', type: 'double_field' },
    ]
  },
  {
    key: 'pa_advances',
    label: 'Advances',
    type: 'nested',
    subFields: [
      { key: 'pa_ad_trustees', label: 'To Trustees' },
      { key: 'pa_ad_employees', label: 'To Employees' },
      { key: 'pa_ad_contractor', label: 'To Contractor' },
      { key: 'pa_ad_lawyers', label: 'To Lawyers' },
      { key: 'pa_ad_others_inner', outerKey: 'pa_ad_others_outer', label: 'To Others', type: 'double_field' },
    ]
  },
  {
    key: 'pa_income_outstanding',
    label: 'Income Outstanding',
    type: 'nested',
    subFields: [
      { key: 'pa_io_rent', label: 'Rent' },
      { key: 'pa_io_interest', label: 'Interest' },
      { key: 'pa_io_other_inner', outerKey: 'pa_io_other_outer', label: 'Other Income', type: 'double_field' },
    ]
  },
  {
    key: 'pa_cash',
    label: 'Cash And Bank Balances',
    type: 'nested',
    subFields: [
      { key: 'pa_cb_saving', label: 'In Savings Account' },
      { key: 'pa_cb_current', label: 'In Current Account' },
      { key: 'pa_cb_fixed', label: 'In Fixed Deposit Account' },
      { key: 'pa_cb_trustee', label: 'With The Trustee' },
      { key: 'pa_cb_manager_inner', outerKey: 'pa_cb_manager_outer', label: 'With The Manager', type: 'double_field' },
    ]
  }
];

// Step 3: Schedule IX — Deduction items
export const scheduleIXItems = [
  { key: 'sch_donations', label: '(i) Donations Received From Other Public Trust And Dharmadas:' },
  { key: 'sch_grants', label: '(ii) Grants Received From Government And Local Authorities:' },
  { key: 'sch_sinking', label: '(iii) Interest On Sinking Or Depreciation Fund:' },
  { key: 'sch_education', label: '(iv) Amount Spent For The Purposes Of Secular Education:' },
  { key: 'sch_medical', label: '(v) Amount Spent For The Purpose Of Medical Relief:' },
  { key: 'sch_veterinary', label: '(vi) Amount Spent For The Purpose Of Veterinary Treatment Of Animals:' },
  { key: 'sch_calamity', label: '(vii) Expenditure Incurred From Donations For Relief Of Distress Caused By Scarcity, Drought, Flood, Fire Or Other Natural Calamity:' },
  {
    key: 'sch_agri',
    label: '(viii) Deduction Out Of Income From Lands Used For Agricultural Purpose -',
    type: 'group',
    subItems: [
      { key: 'sch_agri_a', label: '(a) Land Revenue And Local Fund Cess:' },
      { key: 'sch_agri_b', label: '(b) Rent Payable To The Superior Landlord:' },
      { key: 'sch_agri_c', label: '(c) Cost Of Production if lands are cultivated by the trust:' },
    ]
  },
  {
    key: 'sch_non_agri',
    label: '(ix) Deduction Out Of Income From Lands Used For Non-Agricultural Purpose -',
    type: 'group',
    subItems: [
      { key: 'sch_non_agri_a', label: '(a) Assessment, Cess And Other Government or Municipal Taxes:' },
      { key: 'sch_non_agri_b', label: '(b) Ground rent payable to the superior landlord:' },
      { key: 'sch_non_agri_c', label: '(c) Insurance Premia:' },
      { key: 'sch_non_agri_d', label: '(d) Repairs At 10 Per Cent Of Gross Rent Of Buildings:' },
      { key: 'sch_non_agri_e', label: '(e) Cost Of Collection At 4 Per Cent Of Gross Rent Of Buildings Let Out:' },
    ]
  },
  { key: 'sch_securities_1', label: '(x) Cost Of Income Or Receipt From Securities, Stocks, etc. At One Per Cent Of Such Income:' },
  { key: 'sch_repairs', label: '(xi) Deduction On Account Of Repairs In Respect Of Building Not Rented And Yielding No Income, At 10 Per Cent Of The Estimated Gross Annual Rent:' },
];

// Step 6: Receipt & Payment Account
export const receiptItems = [
  {
    key: 'rec_open', label: 'To Opening Balance', subItems: [
      { key: 'rec_op_cash', label: 'Cash' },
      { key: 'rec_op_bank', label: 'Bank' },
    ]
  },
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
  {
    key: 'pay_close', label: 'By Closing Balances', subItems: [
      { key: 'pay_cl_cash', label: 'Cash In Hand' },
      { key: 'pay_cl_bank', label: 'Bank' },
    ]
  },
];
