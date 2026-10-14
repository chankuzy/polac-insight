import { Pencil, Trash2 } from "lucide-react";
import type { CadetRecord } from "../types";

interface RecordTableProps {
  records: CadetRecord[];
  showActions?: boolean;
  onEdit?: (record: CadetRecord) => void;
  onDelete?: (record: CadetRecord) => void;
}
const initials = (name: string) => name.split(/\s+/).slice(0, 2).map((part) => part[0] ?? "").join("").toUpperCase();

export default function RecordTable({ records, showActions = false, onEdit, onDelete }: RecordTableProps) {
  if (!records.length) return <div className="empty-state"><div className="empty-icon">↗</div><strong>No records found</strong><p>Try a different search or add a new cadet record.</p></div>;
  return (
    <div className="table-scroll"><table className="data-table">
      <thead><tr><th>Cadet</th><th>Level</th><th>Platform</th><th>Hours/day</th><th>CGPA</th><th>Purpose</th>{showActions && <th>Actions</th>}</tr></thead>
      <tbody>{records.map((record) => (
        <tr key={record.id}>
          <td><div className="person-cell"><span className="person-avatar">{initials(record.name)}</span><span><b>{record.name}</b><small>{record.id}</small></span></div></td>
          <td>{record.level} level</td><td><span className="platform-tag">{record.platform}</span></td>
          <td>{record.hours.toFixed(1)} h</td><td><strong className="cgpa-value">{record.cgpa.toFixed(2)}</strong></td>
          <td><span className={`purpose-tag purpose-${record.purpose.toLowerCase()}`}>{record.purpose}</span></td>
          {showActions && <td><div className="table-actions"><button title="Edit record" onClick={() => onEdit?.(record)}><Pencil size={15} /></button><button title="Delete record" className="delete-action" onClick={() => onDelete?.(record)}><Trash2 size={15} /></button></div></td>}
        </tr>
      ))}</tbody>
    </table></div>
  );
}