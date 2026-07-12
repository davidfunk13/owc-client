export function parseNumeric(text: string): number | null {
  const value = Number.parseFloat(text);
  return Number.isNaN(value) ? null : value;
}
