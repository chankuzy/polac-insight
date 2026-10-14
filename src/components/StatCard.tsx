import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
  tint: "teal" | "amber" | "blue" | "purple";
}
export default function StatCard({ label, value, detail, icon, tint }: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="stat-top"><span>{label}</span><span className={`stat-icon ${tint}`}>{icon}</span></div>
      <div className="stat-value">{value}</div>
      <div className="stat-detail">{detail}</div>
    </article>
  );
}