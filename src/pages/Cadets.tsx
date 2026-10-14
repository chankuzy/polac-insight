import { Search, SlidersHorizontal, Plus, FileDown } from "lucide-react";
import { useMemo, useState } from "react";
import type { CadetRecord, PageKey } from "../types";
import RecordTable from "../components/RecordTable";

interface CadetsProps { records: CadetRecord[]; onNavigate: (page: PageKey) => void; onEdit: (record: CadetRecord) => void; onDelete: (record: CadetRecord) => void; onExport: () => void; }
export default function Cadets({ records, onNavigate, onEdit, onDelete, onExport }: CadetsProps) {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [platform, setPlatform] = useState("");
  const filtered = useMemo(() => [...records].reverse().filter((record) =>
    (!search || `${record.name} ${record.id}`.toLowerCase().includes(search.toLowerCase())) &&
    (!level || record.level === level) && (!platform || record.platform === platform)
  ), [records, search, level, platform]);
  return (
    <>
      <div className="page-heading"><div><div className="eyebrow">DATA MANAGEMENT</div><h1>Cadet records</h1><p>Review, search, edit, or remove records from your research dataset.</p></div><div className="heading-actions"><button className="button button-quiet" onClick={onExport}><FileDown size={16} /> Export CSV</button><button className="button button-primary" onClick={() => onNavigate("entry")}><Plus size={17} /> Add record</button></div></div>
      <section className="panel records-panel">
        <div className="filter-row"><label className="search-field"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or cadet ID…" /></label><label className="select-field"><SlidersHorizontal size={15} /><select value={level} onChange={(event) => setLevel(event.target.value)}><option value="">All academic levels</option>{["100", "200", "300", "400"].map((value) => <option key={value} value={value}>{value} level</option>)}</select></label><select className="filter-select" value={platform} onChange={(event) => setPlatform(event.target.value)}><option value="">All platforms</option>{["WhatsApp", "Facebook", "Instagram", "X", "TikTok", "Other"].map((value) => <option key={value}>{value}</option>)}</select></div>
        <div className="table-meta"><span><b>{filtered.length}</b> records shown</span><span>Stored locally in this browser</span></div>
        <RecordTable records={filtered} showActions onEdit={onEdit} onDelete={onDelete} />
      </section>
    </>
  );
}