import { BarChart3, ClipboardList, Database, FileChartColumn, LayoutDashboard, Plus, RotateCcw, Upload, Users, X } from "lucide-react";
import type { PageKey } from "../types";

interface SidebarProps {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
  onImport: () => void;
  onReset: () => void;
  mobileOpen: boolean;
  onClose: () => void;
}

const navItems: { key: PageKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", label: "Overview", icon: LayoutDashboard },
  { key: "cadets", label: "Cadet records", icon: Users },
  { key: "entry", label: "Enter data", icon: Plus },
  { key: "analytics", label: "Correlation analysis", icon: BarChart3 },
  { key: "reports", label: "Reports & export", icon: FileChartColumn },
];

export default function Sidebar({ activePage, onNavigate, onImport, onReset, mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={onClose} />}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">Pi</div>
          <div><strong>POLAC Insight</strong><span>RESEARCH ANALYTICS</span></div>
          <button className="sidebar-close" onClick={onClose} aria-label="Close menu"><X size={18} /></button>
        </div>
        <div className="nav-group">
          <p className="nav-label">Workspace</p>
          <nav className="side-nav">
            {navItems.map(({ key, label, icon: Icon }) => (
              <button key={key} className={activePage === key ? "nav-item active" : "nav-item"} onClick={() => { onNavigate(key); onClose(); }}>
                <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="nav-group">
          <p className="nav-label">Data tools</p>
          <nav className="side-nav">
            <button className="nav-item" onClick={onImport}><Upload size={18} /><span>Import CSV</span></button>
            <button className="nav-item" onClick={() => onNavigate("reports")}><Database size={18} /><span>Export records</span></button>
            <button className="nav-item" onClick={onReset}><RotateCcw size={18} /><span>Restore demo data</span></button>
          </nav>
        </div>
        <div className="sidebar-note">
          <span className="note-kicker">RESEARCH WORKSPACE</span>
          <strong>Social media & CGPA</strong>
          <p>Understand reported digital habits and explore their relationship with academic performance.</p>
        </div>
        <div className="sidebar-foot"><ClipboardList size={14} /> Local research prototype <span className="online-dot" /></div>
      </aside>
    </>
  );
}