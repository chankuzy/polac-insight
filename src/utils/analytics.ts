import type { CadetRecord } from "../types";

export function mean(values: number[]): number | null {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

export function completePairs(records: CadetRecord[]): CadetRecord[] {
  return records.filter((record) => Number.isFinite(record.hours) && Number.isFinite(record.cgpa));
}

export function pearsonCorrelation(records: CadetRecord[]): number | null {
  if (records.length < 2) return null;
  const xs = records.map((record) => record.hours);
  const ys = records.map((record) => record.cgpa);
  const xMean = mean(xs)!;
  const yMean = mean(ys)!;
  let numerator = 0;
  let xSquares = 0;
  let ySquares = 0;
  xs.forEach((x, index) => {
    const dx = x - xMean;
    const dy = ys[index] - yMean;
    numerator += dx * dy;
    xSquares += dx * dx;
    ySquares += dy * dy;
  });
  if (xSquares === 0 || ySquares === 0) return null;
  return numerator / Math.sqrt(xSquares * ySquares);
}

export function describeCorrelation(r: number | null, count: number): string {
  if (count < 3) return "At least three complete data pairs are recommended before interpreting the pattern.";
  if (r === null) return "Correlation could not be calculated. Check for variation in both variables and verify the entered values.";
  const magnitude = Math.abs(r);
  const strength = magnitude < 0.2 ? "very weak" : magnitude < 0.4 ? "weak" : magnitude < 0.6 ? "moderate" : magnitude < 0.8 ? "strong" : "very strong";
  return `This dataset shows a ${strength} ${r < 0 ? "negative" : "positive"} linear association (r = ${r.toFixed(3)}). Correlation does not establish causation.`;
}

export function formatNumber(value: number | null, decimals = 2): string {
  return value === null || !Number.isFinite(value) ? "—" : value.toFixed(decimals);
}