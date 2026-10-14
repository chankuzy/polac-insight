import type { CadetRecord, AcademicLevel, Platform, UsagePurpose } from "../types";

const columns = ["id", "name", "level", "platform", "hours", "cgpa", "purpose", "notes"] as const;

export function escapeCsv(value: unknown): string {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function recordsToCsv(records: CadetRecord[]): string {
  return [columns.join(","), ...records.map((record) => columns.map((column) => escapeCsv(record[column])).join(","))].join("\r\n");
}

export function downloadText(text: string, filename: string, type = "text/plain;charset=utf-8"): void {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') { value += '"'; index += 1; }
      else if (char === '"') quoted = false;
      else value += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") { row.push(value); value = ""; }
    else if (char === "\n") { row.push(value.replace(/\r$/, "")); rows.push(row); row = []; value = ""; }
    else value += char;
  }
  if (value.length || row.length) { row.push(value.replace(/\r$/, "")); rows.push(row); }
  return rows;
}

export function parseRecordsCsv(text: string, existing: CadetRecord[]): CadetRecord[] {
  const rows = parseCsv(text);
  if (rows.length < 2) throw new Error("The CSV does not contain any data rows.");
  const headers = rows[0].map((header) => header.trim().toLowerCase());
  const required = ["id", "name", "level", "platform", "hours", "cgpa", "purpose"];
  const missing = required.filter((header) => !headers.includes(header));
  if (missing.length) throw new Error(`Missing columns: ${missing.join(", ")}`);
  const get = (row: string[], key: string) => row[headers.indexOf(key)]?.trim() ?? "";
  const seen = new Set(existing.map((record) => record.id.toLowerCase()));
  return rows.slice(1).filter((row) => row.some((cell) => cell.trim())).map((row, index) => {
    let id = get(row, "id");
    const name = get(row, "name");
    const level = get(row, "level");
    const platform = get(row, "platform");
    const hours = Number(get(row, "hours"));
    const cgpa = Number(get(row, "cgpa"));
    const purpose = get(row, "purpose");
    if (!id || !name) throw new Error(`Row ${index + 2}: ID and name are required.`);
    if (!["100", "200", "300", "400"].includes(level)) throw new Error(`Row ${index + 2}: level must be 100, 200, 300, or 400.`);
    if (!["WhatsApp", "Facebook", "Instagram", "X", "TikTok", "Other"].includes(platform)) throw new Error(`Row ${index + 2}: unsupported platform "${platform}".`);
    if (!Number.isFinite(hours) || hours < 0 || hours > 24) throw new Error(`Row ${index + 2}: hours must be between 0 and 24.`);
    if (!Number.isFinite(cgpa) || cgpa < 0 || cgpa > 5) throw new Error(`Row ${index + 2}: CGPA must be between 0 and 5.`);
    if (!["Academic", "Entertainment", "Socializing", "Mixed"].includes(purpose)) throw new Error(`Row ${index + 2}: unsupported purpose "${purpose}".`);
    if (seen.has(id.toLowerCase())) id = `${id}-${index + 1}`;
    seen.add(id.toLowerCase());
    return {
      id, name, level: level as AcademicLevel, platform: platform as Platform, hours, cgpa,
      purpose: purpose as UsagePurpose, notes: get(row, "notes"),
      createdAt: new Date().toISOString(),
    };
  });
}