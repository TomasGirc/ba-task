export const formatNumber = (value: number, locale: string) => {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "lt-LT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
