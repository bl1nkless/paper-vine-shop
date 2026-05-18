const hryvniaFormatter = new Intl.NumberFormat("uk-UA", {
  style: "currency",
  currency: "UAH",
  maximumFractionDigits: 0,
});

export function formatMoneyFromCents(amountInCents: number) {
  return hryvniaFormatter.format(amountInCents / 100);
}
