import { Menu, ShieldCheck } from "lucide-react";
import type { PageKey } from "../types";

const labels: Record<PageKey, string> = {
  dashboard: "Overview",
  cadets: "Cadet records",
  entry: "Enter data",
  analytics: "Correlation analysis",
  reports: "Reports & export",
};

interface TopbarProps { page: PageKey; onMenu: () => void; }
export default function Topbar({ page, onMenu }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-button menu-button" onClick={onMenu} aria-label="Open navigation"><Menu size={20} /></button>
        <div className="breadcrumb"><span>Research workspace</span><i>/</i><strong>{labels[page]}</strong></div>
      </div>
      <div className="topbar-right"><span className="local-badge"><ShieldCheck size={14} /> Local workspace</span><div className="user-avatar">PI</div></div>
    </header>
  );
}