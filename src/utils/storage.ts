import type { CadetRecord } from "../types";
import { demoRecords } from "../data/demo";

const STORAGE_KEY = "polac-insight:cadet-records:v1";

export function loadRecords(): CadetRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as CadetRecord[];
    }
  } catch (error) {
    console.warn("Could not read POLAC Insight local data.", error);
  }
  return demoRecords.map((record) => ({ ...record }));
}

export function persistRecords(records: CadetRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error("Could not save records to localStorage.", error);
    throw new Error("Browser storage is unavailable or full. Export your data and try again.");
  }
}

export function resetRecords(): CadetRecord[] {
  const records = demoRecords.map((record) => ({ ...record }));
  persistRecords(records);
  return records;
}