/**
 * @file mockData.js
 * @path ./taxbuddy-chat-demo/src/data/mockData.js
 * @version 1.0.0
 * @lastModified 2025-06-17
 * @changeLog
 * - v1.0.0 (2025-06-17): Initial creation - Mock tax data for conversation scenarios
 */

export const mockTaxData = {
  commonDeductions: [
    {
      id: 'std_deduction',
      name: 'Standard Deduction',
      description: 'Fixed deduction amount based on filing status',
      maxAmount: 13850,
      category: 'standard',
      eligibility: 'All taxpayers',
      requirements: []
    },
    {
      id: 'charitable',
      name: 'Charitable Contributions',
      description: 'Donations to qualified charitable organizations',
      maxAmount: null,
      category: 'itemized',
      eligibility: 'Must itemize deductions',
      requirements: ['Receipt for donations over $250', 'Qualified organization']
    },
    {
      id: 'mortgage_interest',
      name: 'Mortgage Interest',
      description: 'Interest paid on home mortgage loans',
      maxAmount: 750000,
      category: 'itemized',
      eligibility: 'Homeowners with mortgage',
      requirements: ['Form 1098 from lender', 'Primary or secondary residence']
    },
    {
      id: 'state_local_tax',
      name: 'State and Local Taxes (SALT)',
      description: 'State income tax, local taxes, property taxes',
      maxAmount: 10000,
      category: 'itemized',
      eligibility: 'Taxpayers in states with income tax',
      requirements: ['Tax receipts', 'Property tax statements']
    },
    {
      id: 'medical_expenses',
      name: 'Medical and Dental Expenses',
      description: 'Unreimbursed medical expenses exceeding 7.5% of AGI',
      maxAmount: null,
      category: 'itemized',
      eligibility: 'High medical expenses relative to income',
      requirements: ['Medical receipts', 'Must exceed 7.5% AGI threshold']
    },
    {
      id: 'student_loan_interest',
      name: 'Student Loan Interest',
      description: 'Interest paid on qualified student loans',
      maxAmount: 2500,
      category: 'above_line',
      eligibility: 'Income limits apply',
      requirements: ['Form 1098-E from lender', 'Qualified educational loan']
    },
    {
      id: 'home_office',
      name: 'Home Office Deduction',
      description: 'Business use of home for self-employed individuals',
      maxAmount: 1500,
      category: 'business',
      eligibility: 'Self-employed or business owners',
      requirements: ['Exclusive business use', 'Regular business use', 'Principal place of business']
    },
    {
      id: 'business_meals',
      name: 'Business Meals',
      description: 'Meals while conducting business',
      maxAmount: null,
      category: 'business',
      eligibility: 'Business owners and employees',
      requirements: ['Business purpose', 'Receipt', '50% deductible (100% for 2021-2022)']
    }
  ],

  filingProcess: {
    overview: 'Step-by-step tax filing process for individual taxpayers',
    steps: [
      {
        id: 'gather_documents',
        title: 'Gather Documents',
        description: 'Collect W-2s, 1099s, receipts, and other tax documents'
      },
      {
        id: 'choose_filing_status',
        title: 'Determine Filing Status',
        description: 'Single, Married Filing Jointly, Married Filing Separately, Head of Household, or Qualifying Widow(er)'
      },
      {
        id: 'calculate_income',
        title: 'Calculate Total Income',
        description: 'Add up all sources of income including wages, interest, dividends, business income'
      },
      {
        id: 'determine_deductions',
        title: 'Choose Deductions',
        description: 'Decide between standard deduction or itemizing deductions'
      },
      {
        id: 'calculate_tax',
        title: 'Calculate Tax Liability',
        description: 'Apply tax rates to taxable income and subtract credits'
      },
      {
        id: 'complete_forms',
        title: 'Complete Tax Forms',
        description: 'Fill out Form 1040 and any required schedules'
      },
      {
        id: 'review_and_file',
        title: 'Review and File',
        description: 'Double-check everything and submit electronically or by mail'
      }
    ]
  },

  businessTaxInfo: {
    overview: 'Tax considerations for business owners and self-employed individuals',
    considerations: [
      {
        category: 'Quarterly Payments',
        description: 'Self-employed individuals must make estimated tax payments four times per year'
      },
      {
        category: 'Self-Employment Tax',
        description: '15.3% tax on net self-employment earnings (Social Security and Medicare)'
      },
      {
        category: 'Business Expenses',
        description: 'Deduct ordinary and necessary business expenses like supplies, equipment, travel'
      },
      {
        category: 'Business Structure',
        description: 'Tax implications vary by entity type: sole proprietorship, LLC, S-Corp, C-Corp'
      },
      {
        category: 'Record Keeping',
        description: 'Maintain detailed records of all business income and expenses'
      },
      {
        category: 'Home Office',
        description: 'May deduct portion of home expenses if used exclusively for business'
      }
    ]
  },

  taxDeadlines: {
    individual_filing: {
      name: 'Individual Tax Return Filing',
      date: 'April 15, 2025',
      description: 'Deadline to file Form 1040 for 2024 tax year',
      canExtend: true,
      extensionDeadline: 'October 15, 2025'
    },
    quarterly_q1: {
      name: 'Q1 Estimated Tax Payment',
      date: 'April 15, 2025',
      description: 'First quarter estimated tax payment for 2025',
      canExtend: false
    },
    quarterly_q2: {
      name: 'Q2 Estimated Tax Payment',
      date: 'June 16, 2025',
      description: 'Second quarter estimated tax payment for 2025',
      canExtend: false
    },
    quarterly_q3: {
      name: 'Q3 Estimated Tax Payment',
      date: 'September 15, 2025',
      description: 'Third quarter estimated tax payment for 2025',
      canExtend: false
    },
    quarterly_q4: {
      name: 'Q4 Estimated Tax Payment',
      date: 'January 15, 2026',
      description: 'Fourth quarter estimated tax payment for 2025',
      canExtend: false
    }
  },

  refundInformation: {
    overview: 'Information about tax refund processing and timing',
    averageProcessingTime: {
      efile_direct_deposit: '21 days',
      efile_check: '21-28 days',
      paper_filing: '6-8 weeks'
    },
    factors: [
      'Filing method (electronic vs. paper)',
      'Refund method (direct deposit vs. check)',
      'Accuracy of return information',
      'Need for additional review or verification',
      'Claiming Earned Income Tax Credit or Additional Child Tax Credit',
      'IRS processing volumes during filing season'
    ],
    delayReasons: [
      'Incomplete or incorrect information',
      'Identity verification required',
      'Amended return processing',
      'Tax law changes requiring manual review',
      'Suspected fraud or identity theft'
    ]
  },

  taxScenarios: [
    {
      id: 'first_time_filer',
      title: 'First-Time Tax Filer',
      description: 'Guidance for someone filing taxes for the first time',
      keyPoints: [
        'Understand filing requirements',
        'Gather necessary documents',
        'Choose appropriate filing method',
        'Understand basic tax concepts'
      ]
    },
    {
      id: 'self_employed',
      title: 'Self-Employed Individual',
      description: 'Tax considerations for freelancers and business owners',
      keyPoints: [
        'Quarterly estimated payments',
        'Business expense tracking',
        'Self-employment tax',
        'Home office deduction'
      ]
    },
    {
      id: 'recent_graduate',
      title: 'Recent College Graduate',
      description: 'Tax implications for new graduates with student loans',
      keyPoints: [
        'Student loan interest deduction',
        'Job search expense deductions',
        'Moving expense considerations',
        'Education credits'
      ]
    },
    {
      id: 'homeowner',
      title: 'New Homeowner',
      description: 'Tax benefits and obligations for homeowners',
      keyPoints: [
        'Mortgage interest deduction',
        'Property tax deduction',
        'PMI deduction eligibility',
        'Home office considerations'
      ]
    },
    {
      id: 'retiree',
      title: 'Retiree',
      description: 'Tax considerations for retirement income',
      keyPoints: [
        'Social Security taxation',
        'Retirement account distributions',
        'Required minimum distributions',
        'Medicare premium considerations'
      ]
    }
  ],

  commonQuestions: [
    {
      id: 'when_to_file',
      question: 'When should I file my taxes?',
      answer: 'The deadline for filing your 2024 tax return is April 15, 2025. However, you can file as early as late January once the IRS begins accepting returns.',
      category: 'filing'
    },
    {
      id: 'need_to_file',
      question: 'Do I need to file a tax return?',
      answer: 'Generally, you need to file if your income exceeds certain thresholds based on your filing status and age. For 2024, single filers under 65 need to file if income exceeds $13,850.',
      category: 'filing'
    },
    {
      id: 'standard_vs_itemized',
      question: 'Should I take the standard deduction or itemize?',
      answer: 'Take the standard deduction if it\'s larger than your itemized deductions. For 2024, the standard deduction is $13,850 for single filers and $27,700 for married filing jointly.',
      category: 'deductions'
    },
    {
      id: 'refund_timing',
      question: 'When will I get my tax refund?',
      answer: 'Most refunds are issued within 21 days of electronic filing with direct deposit. Paper returns and refund checks take longer - typically 6-8 weeks.',
      category: 'refunds'
    }
  ]
}