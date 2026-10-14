import { Activity, ArrowRight, Clock3, GraduationCap, Plus, Sparkles, Users } from "lucide-react";
import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import type { CadetRecord, PageKey } from "../types";
import { completePairs, formatNumber, mean, pearsonCorrelation } from "../utils/analytics";
import StatCard from "../components/StatCard";
import RecordTable from "../components/RecordTable";

interface DashboardProps { records: CadetRecord[]; onNavigate: (page: PageKey) => void; }
export default function Dashboard({ records, onNavigate }: DashboardProps) {
  const pairs = completePairs(records);
  const r = pearsonCorrelation(pairs);
  const hours = mean(pairs.map((record) => record.hours));
  const cgpa = mean(pairs.map((record) => record.cgpa));
  const platformCounts = Object.entries(records.reduce<Record<string, number>>((acc, record) => { acc[record.platform] = (acc[record.platform] ?? 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const chartData = pairs.map((record) => ({ hours: record.hours, cgpa: record.cgpa, name: record.name }));
  const isDemo = records.some((record) => record.id.startsWith("DEMO-"));
  const magnitude = r === null ? "" : Math.abs(r) < .2 ? "very weak" : Math.abs(r) < .4 ? "weak" : Math.abs(r) < .6 ? "moderate" : Math.abs(r) < .8 ? "strong" : "very strong";

  return (
    <>
      <div className="page-heading">
        <div><div className="eyebrow">POLAC · RESEARCH OVERVIEW</div><h1>Good evening, researcher.</h1><p>A clearer view of reported social media habits and academic performance.</p></div>
        <div className="heading-actions"><button className="button button-quiet" onClick={() => onNavigate("reports")}>View reports <ArrowRight size={15} /></button><button className="button button-primary" onClick={() => onNavigate("entry")}><Plus size={17} /> Add cadet data</button></div>
      </div>
      <div className="stats-grid">
        <StatCard label="Cadets in dataset" value={String(records.length)} detail="Records currently saved" icon={<Users size={18} />} tint="teal" />
        <StatCard label="Average daily usage" value={hours === null ? "—" : `${formatNumber(hours, 1)}h`} detail="Self-reported hours per day" icon={<Clock3 size={18} />} tint="amber" />
        <StatCard label="Average CGPA" value={formatNumber(cgpa)} detail="Across complete records" icon={<GraduationCap size={19} />} tint="blue" />
        <StatCard label="Pearson correlation" value={formatNumber(r)} detail={pairs.length < 3 ? "Needs 3+ complete pairs" : "Linear association (r)"} icon={<Activity size={19} />} tint="purple" />
      </div>
      <div className="dashboard-main-grid">
        <section className="panel chart-panel">
          <div className="panel-heading"><div><h2>Usage hours vs. CGPA</h2><p>Each dot represents one cadet with complete data.</p></div><span className="soft-badge">SCATTER PLOT</span></div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 18, bottom: 10, left: 0 }}>
                <CartesianGrid stroke="#e9eef4" strokeDasharray="4 5" />
                <XAxis type="number" dataKey="hours" name="Daily hours" domain={[0, "dataMax + 1"]} tick={{ fill: "#8190a2", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#dfe7ef" }} label={{ value: "Social media hours / day", position: "insideBottom", offset: -3, fill: "#8190a2", fontSize: 10 }} />
                <YAxis type="number" dataKey="cgpa" name="CGPA" domain={[0, 5]} tick={{ fill: "#8190a2", fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ strokeDasharray: "4 4" }} contentStyle={{ border: "1px solid #e4ebf2", borderRadius: 12, fontSize: 12 }} formatter={(value, name) => [Number(value).toFixed(2), name]} labelFormatter={(_, payload) => payload?.[0]?.payload?.name ?? "Cadet"} />
                <Scatter name="Cadets" data={chartData} fill="#21b6a8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend"><span><i className="legend-dot" /> Cadet records</span><span>Correlation is not causation</span></div>
        </section>
        <section className="insight-card">
          <div className="insight-orbit" /><div className="insight-kicker"><Sparkles size={14} /> QUICK INSIGHT</div>
          <h2>{pairs.length >= 3 && r !== null ? `A ${magnitude} ${r < 0 ? "negative" : "positive"} association appears.` : "Your research starts with good data."}</h2>
          <p>{pairs.length >= 3 && r !== null ? "Pearson's r describes the linear relationship between reported daily hours and CGPA in the current dataset. It cannot tell you that one caused the other." : "Add questionnaire responses and CGPA records to see a statistical summary here."}</p>
          <div className="insight-score"><strong>{formatNumber(r, 3)}</strong><span>Pearson's r</span></div>
          <div className="insight-track"><span style={{ width: `${r === null ? 0 : Math.abs(r) * 100}%` }} /></div>
          <div className="insight-foot">{isDemo ? "Demo records are illustrative only—not actual POLAC data." : "Use approved research data and interpret findings cautiously."}</div>
        </section>
      </div>
      <div className="dashboard-bottom-grid">
        <section className="panel">
          <div className="panel-heading"><div><h2>Recently added cadets</h2><p>Latest saved records in this workspace.</p></div><button className="text-button" onClick={() => onNavigate("cadets")}>View all <ArrowRight size={14} /></button></div>
          <RecordTable records={[...records].reverse().slice(0, 4)} />
        </section>
        <section className="panel platform-panel">
          <div className="panel-heading"><div><h2>Platform mix</h2><p>Most frequently reported platforms.</p></div><span className="soft-badge">USAGE</span></div>
          {platformCounts.length ? <div className="platform-list">{platformCounts.map(([platform, count]) => <div className="platform-row" key={platform}><div className="platform-symbol">{platform[0]}</div><div className="platform-info"><div><b>{platform}</b><span>{count} {count === 1 ? "record" : "records"}</span></div><div className="progress-track"><span style={{ width: `${(count / Math.max(...platformCounts.map((item) => item[1]))) * 100}%` }} /></div></div></div>)}</div> : <p className="muted-empty">Add records to see the platform mix.</p>}
        </section>
      </div>
    </>
  );
}