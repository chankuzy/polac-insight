import { ArrowLeft, CheckCircle2, Save } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import type { AcademicLevel, CadetRecord, Platform, UsagePurpose } from "../types";

interface DataEntryProps {
  initialRecord: CadetRecord | null;
  records: CadetRecord[];
  onSave: (record: CadetRecord, originalId?: string) => void;
  onCancel: () => void;
}
const emptyForm = { id: "", name: "", level: "" as AcademicLevel | "", platform: "" as Platform | "", hours: "", cgpa: "", purpose: "" as UsagePurpose | "", notes: "" };
export default function DataEntry({ initialRecord, records, onSave, onCancel }: DataEntryProps) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  useEffect(() => {
    if (initialRecord) setForm({ id: initialRecord.id, name: initialRecord.name, level: initialRecord.level, platform: initialRecord.platform, hours: String(initialRecord.hours), cgpa: String(initialRecord.cgpa), purpose: initialRecord.purpose, notes: initialRecord.notes ?? "" });
    else setForm(emptyForm);
    setError("");
  }, [initialRecord]);
  function update<K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) { setForm((current) => ({ ...current, [key]: value })); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const id = form.id.trim();
    if (records.some((record) => record.id.toLowerCase() === id.toLowerCase() && record.id !== initialRecord?.id)) { setError("That research ID already exists. Use a unique ID."); return; }
    const hours = Number(form.hours);
    const cgpa = Number(form.cgpa);
    if (!Number.isFinite(hours) || hours < 0 || hours > 24) { setError("Daily usage must be between 0 and 24 hours."); return; }
    if (!Number.isFinite(cgpa) || cgpa < 0 || cgpa > 5) { setError("CGPA must be between 0 and 5 on the assumed 5.00 scale."); return; }
    onSave({ id, name: form.name.trim(), level: form.level as AcademicLevel, platform: form.platform as Platform, hours, cgpa, purpose: form.purpose as UsagePurpose, notes: form.notes.trim(), createdAt: initialRecord?.createdAt ?? new Date().toISOString() }, initialRecord?.id);
  }
  return (
    <>
      <div className="page-heading"><div><div className="eyebrow">QUESTIONNAIRE DATA</div><h1>{initialRecord ? "Edit cadet record" : "Add cadet data"}</h1><p>Enter the reported usage details and academic result collected for your study.</p></div><button className="button button-quiet" onClick={onCancel}><ArrowLeft size={16} /> Back to records</button></div>
      <div className="entry-layout">
        <section className="panel form-panel">
          <div className="panel-heading"><div><h2>Cadet information</h2><p>Complete the required fields marked with an asterisk.</p></div><span className="soft-badge">DATA ENTRY</span></div>
          <form onSubmit={submit}>
            <div className="form-grid">
              <div className="field"><label htmlFor="cadet-id">Cadet research ID <span>*</span></label><input id="cadet-id" required maxLength={30} value={form.id} onChange={(event) => update("id", event.target.value)} placeholder="e.g. POL-001" /><small>Use a study ID rather than a sensitive identity number.</small></div>
              <div className="field"><label htmlFor="cadet-name">Display name / alias <span>*</span></label><input id="cadet-name" required maxLength={70} value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="e.g. Cadet 001" /></div>
              <div className="field"><label htmlFor="level">Academic level <span>*</span></label><select id="level" required value={form.level} onChange={(event) => update("level", event.target.value as AcademicLevel | "")}><option value="">Select level</option>{["100", "200", "300", "400"].map((level) => <option key={level} value={level}>{level} Level</option>)}</select></div>
              <div className="field"><label htmlFor="platform">Most-used platform <span>*</span></label><select id="platform" required value={form.platform} onChange={(event) => update("platform", event.target.value as Platform | "")}><option value="">Choose platform</option>{["WhatsApp", "Facebook", "Instagram", "X", "TikTok", "Other"].map((platform) => <option key={platform}>{platform}</option>)}</select></div>
              <div className="field"><label htmlFor="hours">Average use (hours/day) <span>*</span></label><input id="hours" type="number" required min="0" max="24" step="0.25" value={form.hours} onChange={(event) => update("hours", event.target.value)} placeholder="e.g. 2.5" /></div>
              <div className="field"><label htmlFor="cgpa">CGPA <span>*</span></label><input id="cgpa" type="number" required min="0" max="5" step="0.01" value={form.cgpa} onChange={(event) => update("cgpa", event.target.value)} placeholder="e.g. 3.75" /><small>This prototype assumes a 5.00 grading scale.</small></div>
              <div className="field field-full"><label htmlFor="purpose">Primary purpose of use <span>*</span></label><select id="purpose" required value={form.purpose} onChange={(event) => update("purpose", event.target.value as UsagePurpose | "")}><option value="">Select purpose</option>{["Academic", "Entertainment", "Socializing", "Mixed"].map((purpose) => <option key={purpose}>{purpose}</option>)}</select></div>
              <div className="field field-full"><label htmlFor="notes">Research note <small>(optional)</small></label><textarea id="notes" rows={3} value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Optional non-identifying note" /></div>
            </div>
            {error && <div className="form-error">{error}</div>}
            <div className="form-footer"><span><CheckCircle2 size={15} /> Changes are stored in this browser</span><div><button type="button" className="button button-quiet" onClick={() => setForm(emptyForm)}>Clear form</button><button type="submit" className="button button-primary"><Save size={16} /> {initialRecord ? "Save changes" : "Save cadet record"}</button></div></div>
          </form>
        </section>
        <aside className="entry-aside">
          <div className="entry-help-card"><div className="help-icon">✦</div><h3>Good research starts with good data.</h3><p>Keep records consistent and use the same questionnaire definitions for every participant.</p><ul><li>Use anonymized cadet research IDs.</li><li>Check CGPA against approved records.</li><li>Enter average usage as hours per day.</li><li>Review unusual values before analysis.</li></ul></div>
          <div className="privacy-note"><strong>Local by design</strong><p>This prototype saves to your browser. Data is not sent to a server. Export a backup before clearing browser storage.</p></div>
        </aside>
      </div>
    </>
  );
}