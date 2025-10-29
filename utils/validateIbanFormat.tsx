/**
 * Validate an IBAN (International Bank Account Number) according to ISO 13616.
 * @param iban - The IBAN string to validate (can include spaces).
 * @returns true if valid, false otherwise.
 */
export default function validateIban(iban: string): boolean {
  if (!iban) return false;

  // 1️⃣ Remove spaces and make uppercase
  const cleanIban = iban.replace(/\s+/g, "").toUpperCase();

  // 2️⃣ Basic pattern check — 2 letters + 2 digits + 11–30 alphanumeric
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(cleanIban)) {
    return false;
  }

  // 3️⃣ Check length by country (optional but recommended)
  const ibanLengths: Record<string, number> = {
    AD: 24,
    AE: 23,
    AL: 28,
    AT: 20,
    AZ: 28,
    BA: 20,
    BE: 16,
    BG: 22,
    BH: 22,
    BR: 29,
    BY: 28,
    CH: 21,
    CR: 22,
    CY: 28,
    CZ: 24,
    DE: 22,
    DK: 18,
    DO: 28,
    EE: 20,
    ES: 24,
    FI: 18,
    FO: 18,
    FR: 27,
    GB: 22,
    GE: 22,
    GI: 23,
    GL: 18,
    GR: 27,
    GT: 28,
    HR: 21,
    HU: 28,
    IE: 22,
    IL: 23,
    IQ: 23,
    IS: 26,
    IT: 27,
    JO: 30,
    KW: 30,
    KZ: 20,
    LB: 28,
    LC: 32,
    LI: 21,
    LT: 20,
    LU: 20,
    LV: 21,
    MC: 27,
    MD: 24,
    ME: 22,
    MK: 19,
    MR: 27,
    MT: 31,
    MU: 30,
    NL: 18,
    NO: 15,
    PK: 24,
    PL: 28,
    PS: 29,
    PT: 25,
    QA: 29,
    RO: 24,
    RS: 22,
    SA: 24,
    SC: 31,
    SE: 24,
    SI: 19,
    SK: 24,
    SM: 27,
    ST: 25,
    TL: 23,
    TN: 24,
    TR: 26,
    UA: 29,
    VG: 24,
    XK: 20,
  };

  const countryCode = cleanIban.slice(0, 2);
  const expectedLength = ibanLengths[countryCode];
  if (!expectedLength || cleanIban.length !== expectedLength) {
    return false;
  }

  // 4️⃣ Move first four chars to the end
  const rearranged = cleanIban.slice(4) + cleanIban.slice(0, 4);

  // 5️⃣ Replace letters with numbers (A = 10, B = 11, ..., Z = 35)
  const numericIban = rearranged
    .split("")
    .map((char) =>
      char.match(/[A-Z]/) ? (char.charCodeAt(0) - 55).toString() : char
    )
    .join("");

  // 6️⃣ Perform MOD97 check — remainder must equal 1
  let remainder = "";
  for (let i = 0; i < numericIban.length; i += 7) {
    const part = remainder + numericIban.substring(i, i + 7);
    remainder = (parseInt(part, 10) % 97).toString();
  }

  return parseInt(remainder, 10) === 1;
}
