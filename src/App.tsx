import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import type { CadetRecord, PageKey } from "./types";
import { loadRecords, persistRecords, resetRecords } from "./utils/storage";
import {
  completePairs,
  describeCorrelation,
  formatNumber,
  mean,
  pearsonCorrelation,
} from "./utils/analytics";
import { downloadText, parseRecordsCsv, recordsToCsv } from "./utils/csv";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ImportModal from "./components/ImportModal";
import Dashboard from "./pages/Dashboard";
import Cadets from "./pages/Cadets";
import DataEntry from "./pages/DataEntry";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";

export default function App() {
  const [records, setRecords] = useState<CadetRecord[]>(() => loadRecords());
  const [page, setPage] = useState<PageKey>("dashboard");
  const [editingRecord, setEditingRecord] = useState<CadetRecord | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [storageWarning, setStorageWarning] = useState("");
  useEffect(() => {
    try {
      persistRecords(records);
      setStorageWarning("");
    } catch (error) {
      setStorageWarning(
        error instanceof Error ? error.message : "Could not save local data.",
      );
    }
  }, [records]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const navigate = useCallback((nextPage: PageKey) => {
    setPage(nextPage);
    if (nextPage !== "entry") setEditingRecord(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  function saveRecord(record: CadetRecord, originalId?: string) {
    setRecords((current) =>
      originalId
        ? current.map((item) => (item.id === originalId ? record : item))
        : [...current, record],
    );
    setEditingRecord(null);
    setToast(
      originalId
        ? "Cadet record updated successfully."
        : "Cadet record saved successfully.",
    );
    navigate("cadets");
  }

  function editRecord(record: CadetRecord) {
    setEditingRecord(record);
    setPage("entry");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function deleteRecord(record: CadetRecord) {
    if (!window.confirm(`Delete record ${record.id}? This cannot be undone.`))
      return;
    setRecords((current) => current.filter((item) => item.id !== record.id));
    setToast("Record deleted.");
  }
  function exportCsv() {
    downloadText(
      recordsToCsv(records),
      "polac_insight_records.csv",
      "text/csv;charset=utf-8",
    );
    setToast("CSV export prepared.");
  }
  function exportSummary() {
    const pairs = completePairs(records);
    const r = pearsonCorrelation(pairs);
    const avgHours = mean(pairs.map((record) => record.hours));
    const avgCgpa = mean(pairs.map((record) => record.cgpa));
    const platformCounts = records.reduce<Record<string, number>>(
      (acc, record) => {
        acc[record.platform] = (acc[record.platform] ?? 0) + 1;
        return acc;
      },
      {},
    );
    const content = [
      "POLAC INSIGHT — RESEARCH SUMMARY",
      `Generated: ${new Date().toLocaleString()}`,
      "",
      `Dataset records: ${records.length}`,
      `Complete usage/CGPA pairs: ${pairs.length}`,
      `Mean daily usage: ${avgHours === null ? "N/A" : `${formatNumber(avgHours)} hours`}`,
      `Mean CGPA: ${formatNumber(avgCgpa)}`,
      `Pearson correlation (r): ${formatNumber(r, 3)}`,
      `Platform counts: ${
        Object.entries(platformCounts)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ") || "No data"
      }`,
      "",
      "INTERPRETATION",
      describeCorrelation(r, pairs.length),
      "",
      "LIMITATIONS",
      "Correlation does not establish causation. Usage data may be self-reported. Verify all data and use anonymized records. This prototype does not calculate p-values or statistical significance.",
    ].join("\n");
    downloadText(content, "polac_insight_summary.txt");
    setToast("Summary report prepared.");
  }
  async function importCsv(file: File) {
    const content = await file.text();
    const imported = parseRecordsCsv(content, records);
    if (!imported.length)
      throw new Error("No data rows were found in the CSV.");
    setRecords((current) => [...current, ...imported]);
    setToast(
      `${imported.length} record${imported.length === 1 ? "" : "s"} imported.`,
    );
  }
  function restoreDemo() {
    if (
      !window.confirm(
        "Replace all current records with the illustrative demo dataset? Export your data first if needed.",
      )
    )
      return;
    setRecords(resetRecords());
    setToast("Illustrative demo dataset restored.");
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={page}
        onNavigate={navigate}
        onImport={() => setImportOpen(true)}
        onReset={restoreDemo}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <main className="main-shell">
        <Topbar page={page} onMenu={() => setMobileOpen(true)} />
        <div className="page-content">
          {storageWarning && (
            <div className="storage-warning">{storageWarning}</div>
          )}
          {page === "dashboard" && (
            <Dashboard records={records} onNavigate={navigate} />
          )}
          {page === "cadets" && (
            <Cadets
              records={records}
              onNavigate={navigate}
              onEdit={editRecord}
              onDelete={deleteRecord}
              onExport={exportCsv}
            />
          )}
          {page === "entry" && (
            <DataEntry
              initialRecord={editingRecord}
              records={records}
              onSave={saveRecord}
              onCancel={() => navigate("cadets")}
            />
          )}
          {page === "analytics" && <Analytics records={records} />}
          {page === "reports" && (
            <Reports
              records={records}
              onExportCsv={exportCsv}
              onExportSummary={exportSummary}
            />
          )}
        </div>
        <footer className="app-footer">
          <span>
            POLAC Insight <i>·</i> Research analytics prototype
          </span>
          <span>
            <span className="online-dot" /> Saved locally in your browser
          </span>
        </footer>
      </main>
      <ImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={importCsv}
      />
      {toast && (
        <div className="toast-message">
          <CheckCircle2 size={17} /> {toast}
          <button
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
