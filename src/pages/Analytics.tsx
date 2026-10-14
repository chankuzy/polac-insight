import { Activity, AlertTriangle, ChartNoAxesCombined, Info } from "lucide-react";
import { CartesianGrid, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import type { CadetRecord } from "../types";
import { completePairs, describeCorrelation, formatNumber, mean, pearsonCorrelation } from "../utils/analytics";
import StatCard from "../components/StatCard";

export default function Analytics({ records }: { records: CadetRecord[] }) {
  const pairs = completePairs(records);
  const r = pearsonCorrelation(pairs);
  const averageHours = mean(pairs.map((record) => record.hours));
  const averageCgpa = mean(pairs.map((record) => record.cgpa));
  const data = pairs.map((record) => ({ hours: record.hours, cgpa: record.cgpa, name: record.name }));
  return (
    <>
      <div className="page-heading"><div><div className="eyebrow">STATISTICAL EXPLORATION</div><h1>Correlation analysis</h1><p>Explore the relationship between reported daily social media usage and CGPA.</p></div><span className="analysis-pill"><Activity size={15} /> Pearson Product Moment Correlation</span></div>
      <div className="stats-grid analytics-stats">
        <StatCard label="Complete pairs" value={String(pairs.length)} detail="Usage hours + CGPA" icon={<ChartNoAxesCombined size={19} />} tint="teal" />
        <StatCard label="Pearson's r" value={formatNumber(r, 3)} detail="Linear association strength" icon={<Activity size={19} />} tint="purple" />
        <StatCard label="Mean usage" value={averageHours === null ? "—" : `${formatNumber(averageHours, 2)} h`} detail="Hours per day" icon={<Activity size={19} />} tint="amber" />
        <StatCard label="Mean CGPA" value={formatNumber(averageCgpa)} detail="Assumed 5.00 scale" icon={<ChartNoAxesCombined size={19} />} tint="blue" />
      </div>
      <div className="analytics-grid">
        <section className="panel">
          <div className="panel-heading"><div><h2>Correlation scatter plot</h2><p>Look for broad patterns, not proof of cause and effect.</p></div><span className="soft-badge">PEARSON PPMC</span></div>
          <div className="analytics-chart"><ResponsiveContainer width="100%" height="100%"><ScatterChart margin={{ top: 14, right: 18, bottom: 16, left: 4 }}>
            <CartesianGrid stroke="#e9eef4" strokeDasharray="4 5" />
            <XAxis type="number" dataKey="hours" name="Daily hours" domain={[0, "dataMax + 1"]} tick={{ fill: "#8190a2", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#dfe7ef" }} label={{ value: "Social media hours per day", position: "insideBottom", offset: -8, fill: "#8190a2", fontSize: 11 }} />
            <YAxis type="number" dataKey="cgpa" name="CGPA" domain={[0, 5]} tick={{ fill: "#8190a2", fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip cursor={{ strokeDasharray: "4 4" }} contentStyle={{ border: "1px solid #e4ebf2", borderRadius: 12, fontSize: 12 }} formatter={(value, name) => [Number(value).toFixed(2), name]} labelFormatter={(_, payload) => payload?.[0]?.payload?.name ?? "Cadet"} />
            <ReferenceLine y={averageCgpa ?? undefined} stroke="#9eb2c6" strokeDasharray="5 5" />
            <Scatter data={data} fill="#21b6a8" />
          </ScatterChart></ResponsiveContainer></div>
          <div className="chart-legend"><span><i className="legend-dot" /> Cadet records</span><span><i className="legend-line" /> Mean CGPA</span></div>
        </section>
        <div className="analysis-side">
          <section className="panel interpretation-panel"><div className="panel-heading"><div><h2>What the result suggests</h2><p>Rule-of-thumb interpretation</p></div><span className="stat-icon teal"><Info size={18} /></span></div><div className="interpretation-result"><div className="r-label">PEARSON CORRELATION</div><strong>{formatNumber(r, 3)}</strong><p>{describeCorrelation(r, pairs.length)}</p></div><div className="strength-scale"><div><span>Near zero</span><b>Little linear association</b></div><div className="scale-bar"><span style={{ width: `${r === null ? 0 : Math.abs(r) * 100}%` }} /></div><div className="scale-ends"><span>0</span><span>1.0 absolute strength</span></div></div></section>
          <section className="caution-card"><div className="caution-title"><AlertTriangle size={17} /><strong>Interpret with care</strong></div><p>Correlation is not causation. Study habits, prior grades, course load, sleep and other factors may influence academic performance.</p><p>This prototype reports descriptive correlation only; it does not calculate p-values, statistical significance, or causal effects.</p></section>
        </div>
      </div>
    </>
  );
}