export const payerAccounts = [
  {
    iban: "LT307300010172619160",
    id: "1",
    balance: 1000.12,
  },
  {
    iban: "LT307300010172619161",
    id: "2",
    balance: 2.43,
  },

  {
    iban: "LT307300010172619162",
    id: "3",
    balance: -5.87,
  },
];

function validateIban(iban: string): boolean {
  const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;
  return ibanRegex.test(iban);
}
export default validateIban;
