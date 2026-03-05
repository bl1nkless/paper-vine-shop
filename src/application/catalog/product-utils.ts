export function parseMoneyToCents(rawValue: string) {
  const normalized = rawValue.replace(",", ".").trim();
  const numeric = Number(normalized);

  if (!Number.isFinite(numeric) || numeric < 0) {
    throw new Error("Некоректна ціна.");
  }

  return Math.round(numeric * 100);
}
