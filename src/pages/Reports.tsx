import { Download, FileText, ShieldCheck } from "lucide-react";
import type { CadetRecord } from "../types";
import { completePairs, describeCorrelation, formatNumber, mean, pearsonCorrelation } from "../utils/analytics";

interface ReportsProps { records: CadetRecord[]; onExportCsv: () => void; onExportSummary: () => void; }
export default function Reports({ records, onExportCsv, onExportSummary }: ReportsProps) {
  const pairs = completePairs(records);
  const r = pearsonCorrelation(pairs);
  const hours = mean(pairs.map((record) => record.hours));
  const cgpa = mean(pairs.map((record) => record.cgpa));
  const counts = records.reduce<Record<string, number>>((acc, record) => { acc[record.platform] = (acc[record.platform] ?? 0) + 1; return acc; }, {});
  return (
    <>
      <div className="page-heading"><div><div className="eyebrow">RESEARCH OUTPUT</div><h1>Reports & export</h1><p>Prepare a compact summary of the records entered into this local workspace.</p></div><div className="heading-actions"><button className="button button-quiet" onClick={onExportCsv}><Download size={16} /> Export CSV</button><button className="button button-primary" onClick={onExportSummary}><FileText size={16} /> Download summary</button></div></div>
      <div className="reports-grid">
        <section className="panel report-panel"><div className="panel-heading"><div><h2>Dataset summary</h2><p>Calculated from records currently saved.</p></div><span className="soft-badge">LIVE SUMMARY</span></div>
          <div className="summary-metrics"><div><span>Dataset records</span><strong>{records.length}</strong></div><div><span>Complete data pairs</span><strong>{pairs.length}</strong></div><div><span>Mean daily usage</span><strong>{hours === null ? "—" : `${formatNumber(hours, 2)} h`}</strong></div><div><span>Mean CGPA</span><strong>{formatNumber(cgpa)}</strong></div><div><span>Pearson correlation</span><strong>{formatNumber(r, 3)}</strong></div></div>
          <div className="report-section"><h3>Platform counts</h3>{Object.keys(counts).length ? <div className="report-platforms">{Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([platform, count]) => <span key={platform}>{platform}<b>{count}</b></span>)}</div> : <p>No platform data yet.</p>}</div>
          <div className="report-section"><h3>Interpretation</h3><p>{describeCorrelation(r, pairs.length)}</p></div>
          <div className="generated-note">Generated locally · {new Date().toLocaleString()}</div>
        </section>
        <div className="report-side">
          <section className="panel checklist-panel"><div className="panel-heading"><div><h2>Data quality checklist</h2><p>Before using findings in your project.</p></div><span className="stat-icon teal"><ShieldCheck size={18} /></span></div><label><input type="checkbox" /> Questionnaire responses verified</label><label><input type="checkbox" /> CGPA values checked against approved records</label><label><input type="checkbox" /> Cadet IDs anonymized</label><label><input type="checkbox" /> Missing or inconsistent data reviewed</label><label><input type="checkbox" /> Supervisor approved analysis approach</label></section>
          <section className="notice-card"><div className="notice-symbol">i</div><div><strong>Research scope reminder</strong><p>The proposal describes a sample of 120 cadets. This app does not collect official records automatically; enter approved data or import a prepared CSV.</p></div></section>
          <section className="privacy-note"><strong>Data stays on this device</strong><p>Exports are downloaded to your device. Records are stored in this browser's local storage, not a central database.</p></section>
        </div>
      </div>
    </>
  );
}