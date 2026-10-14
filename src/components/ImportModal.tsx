import { FileUp, X } from "lucide-react";
import { useRef, useState } from "react";

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>;
}
export default function ImportModal({ open, onClose, onImport }: ImportModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (!open) return null;
  async function submit() {
    if (!file) { setError("Choose a CSV file first."); return; }
    setBusy(true); setError("");
    try { await onImport(file); setFile(null); onClose(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Import failed."); }
    finally { setBusy(false); }
  }
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="import-title">
        <div className="modal-heading"><div className="modal-icon"><FileUp size={20} /></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
        <h2 id="import-title">Import research data</h2>
        <p>Bring your questionnaire data into this local workspace using a CSV file.</p>
        <div className="dropzone" onClick={() => inputRef.current?.click()}><FileUp size={28} /><strong>{file ? file.name : "Choose a CSV file"}</strong><span>{file ? `${(file.size / 1024).toFixed(1)} KB` : "Click to browse from your device"}</span></div>
        <input ref={inputRef} type="file" accept=".csv,text/csv" hidden onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
        <div className="format-note"><b>Required columns</b><code>id, name, level, platform, hours, cgpa, purpose</code><span>Optional column: notes. Duplicate IDs are made unique during import.</span></div>
        {error && <div className="form-error">{error}</div>}
        <div className="modal-actions"><button className="button button-quiet" onClick={onClose}>Cancel</button><button className="button button-primary" disabled={busy} onClick={submit}>{busy ? "Importing…" : "Import records"} <FileUp size={16} /></button></div>
      </section>
    </div>
  );
}