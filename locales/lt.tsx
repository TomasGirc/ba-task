export const lt = {
  form: {
    title: "Forma",
    amount: "Suma",
    payeeAccount: "Gavėjo sąskaita",
    purpose: "Mokėjimo paskirtis",
    payerAccount: "Mokėtojo sąskaita",
    payee: "Gavėjas",
    submit: "Pateikti",
    submitted: "Pateikta",
    currentBalance: "Sąskaitos likutis",
    balance: "Likutis",
  },
  error: {
    validIban: "Galiojantis IBAN",
    invalidIban: "Negaliojantis IBAN",
    validationFailed: "Patikra nepavyko",
    cannotTransferNegativeBalance:
      "Negalima pervesti. Sąskaitos likutis yra neigiamas",
    minAmount: "Suma turi būti bent 0.01",
    maxAmount: "Suma negali viršyti sąskaitos likučio",
    accountIsRequired: "Reikalinga sąskaita",
    invalidIbanFormat: "Neteisingas IBAN formatas",
    purposeTooShort: "Paskirtis turi būti bent 3 simboliai",
    purposeTooLong: "Paskirtis negali viršyti 135 simbolių",
    payeeIsRequired: "Reikalingas gavėjas",
    payeeTooLong: "Gavėjas negali viršyti 70 simbolių",
  },
} as const;
