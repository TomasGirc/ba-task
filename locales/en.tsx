export const en = {
  form: {
    title: "Form",
    amount: "Amount",
    payeeAccount: "Payee Account",
    purpose: "Purpose",
    payerAccount: "Payer Account",
    payee: "Payee",
    submit: "Submit",
    submitted: "Submitted",
    currentBalance: "Current Balance",
    balance: "Balance",
  },
  error: {
    validIban: "Valid IBAN",
    invalidIban: "Invalid IBAN",
    validationFailed: "Validation failed",
    cannotTransferNegativeBalance:
      "Cannot transfer. Account balance is negative",
    minAmount: "Amount must be at least 0.01",
    maxAmount: "Amount cannot exceed account balance",
    accountIsRequired: "Account is required",
    invalidIbanFormat: "Invalid IBAN format",
    purposeTooShort: "Purpose must be at least 3 characters",
    purposeTooLong: "Purpose must not exceed 135 characters",
    payeeIsRequired: "Payee is required",
    payeeTooLong: "Payee must not exceed 70 characters",
  },
} as const;
