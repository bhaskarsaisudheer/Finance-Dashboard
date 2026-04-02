export function formatMoney(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return "$0.00";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(number);
}

export function formatSignedAmount(transaction) {
  const sign = transaction.type === "expense" ? -1 : 1;
  const amount = Number(transaction.amount) || 0;
  const signed = amount * sign;
  return formatMoney(signed);
}

export function parseISODate(iso) {
  // Store dates as ISO strings; normalize with Date object.
  return new Date(iso);
}

export function monthKeyFromDate(iso) {
  const d = parseISODate(iso);
  if (Number.isNaN(d.getTime())) return "Invalid";
  // YYYY-MM in UTC.
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function dateLabel(iso) {
  const d = parseISODate(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "2-digit" }).format(d);
}

export function monthLabelFromKey(key) {
  const [y, m] = key.split("-").map((x) => Number(x));
  if (!y || !m) return key;
  const d = new Date(Date.UTC(y, m - 1, 1));
  return new Intl.DateTimeFormat(undefined, { month: "short" }).format(d);
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function stableHashToHue(input) {
  const str = String(input ?? "");
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return hash % 360;
}

export function csvEscape(value) {
  const s = String(value ?? "");
  if (/[,"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

