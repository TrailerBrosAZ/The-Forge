import React from "react";

export function Surface({ children, style, className = "", ...props }) {
  return <section className={`forge-surface ${className}`.trim()} style={{ padding: 16, ...style }} {...props}>{children}</section>;
}

export function SectionHeading({ kicker, title, action }) {
  return <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
    <div>{kicker && <div className="forge-section-kicker">{kicker}</div>}<div className="forge-section-title">{title}</div></div>
    {action}
  </div>;
}

export function MetricStrip({ items }) {
  return <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`, gap: 8 }}>
    {items.map((item) => <div key={item.label} style={{ minWidth: 0, padding: "10px 9px", borderRadius: 10, background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.055)" }}>
      <div className="forge-metric-number" style={{ color: item.color || "var(--forge-text-primary)", fontSize: 18, fontWeight: 720, whiteSpace: "nowrap" }}>{item.value}</div>
      <div style={{ color: "var(--forge-text-muted)", fontSize: 10, marginTop: 3 }}>{item.label}</div>
    </div>)}
  </div>;
}

export function Sparkline({ values, color = "#E9A642", label = "Trend", height = 52 }) {
  const numeric = values.map(Number).filter(Number.isFinite);
  if (!numeric.length) return <div style={{ color: "var(--forge-text-muted)", fontSize: 12 }}>Not enough data yet.</div>;
  const width = 240;
  const min = Math.min(...numeric);
  const max = Math.max(...numeric);
  const span = max - min || 1;
  const points = numeric.map((value, index) => `${numeric.length === 1 ? width / 2 : index / (numeric.length - 1) * width},${height - 5 - (value - min) / span * (height - 12)}`).join(" ");
  return <div style={{ position: "relative" }}>
    <svg viewBox={`0 0 ${width} ${height}`} style={{ display: "block", width: "100%", height }} role="img" aria-label={`${label}: ${numeric[0].toFixed(1)} to ${numeric.at(-1).toFixed(1)}`}>
      <line x1="0" x2={width} y1={height - 5} y2={height - 5} stroke="rgba(255,255,255,.08)" />
      {numeric.length > 1 && <polyline points={points} fill="none" stroke={color} strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" />}
      <circle cx={numeric.length === 1 ? width / 2 : width} cy={height - 5 - (numeric.at(-1) - min) / span * (height - 12)} r="3.5" fill={color} />
    </svg>
  </div>;
}

export function ComparisonBars({ rows, series, height = 76 }) {
  const maxima = Object.fromEntries(series.map((item) => [item.key, Math.max(1, ...rows.map((row) => Number(row[item.key]) || 0))]));
  return <div>
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${rows.length}, 1fr)`, gap: 5, height, alignItems: "end" }}>
      {rows.map((row, index) => <div key={row.date || row.end || index} style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 2, height: "100%" }}>
        {series.map((item) => <i key={item.key} title={`${item.label}: ${row[item.key] ?? "no data"}`} style={{ width: Math.max(3, 10 / series.length), minHeight: row[item.key] == null ? 2 : 4, height: `${Math.max(3, (Number(row[item.key]) || 0) / maxima[item.key] * 100)}%`, borderRadius: "3px 3px 1px 1px", background: row[item.key] == null ? "var(--forge-border-strong)" : item.color, opacity: row[item.key] == null ? .45 : .9 }} />)}
      </div>)}
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 12px", marginTop: 8 }}>{series.map((item) => <span key={item.key} style={{ color: "var(--forge-text-muted)", fontSize: 10 }}><i style={{ display: "inline-block", width: 7, height: 7, borderRadius: 2, background: item.color, marginRight: 5 }} />{item.label}</span>)}</div>
  </div>;
}

export function ConsistencyGrid({ days }) {
  const rows = [
    ["training", "Train"],
    ["calories", "Calories"],
    ["protein", "Protein"],
    ["weight", "Weight"],
  ];
  return <div role="img" aria-label={`${days.length}-day consistency: ${rows.map(([key, label]) => `${label} ${days.filter((day) => day[key]).length} days`).join(", ")}`}>
    <div style={{ display: "grid", gridTemplateColumns: `64px repeat(${days.length}, 1fr)`, gap: 5, alignItems: "center" }}>
      <span />
      {days.map((day) => <span key={day.date} style={{ color: "var(--forge-text-muted)", textAlign: "center", fontSize: 9 }}>{day.label}</span>)}
      {rows.flatMap(([key, label]) => [
        <span key={`${key}-label`} style={{ color: "var(--forge-text-secondary)", fontSize: 10 }}>{label}</span>,
        ...days.map((day) => <span key={`${key}-${day.date}`} aria-hidden="true" style={{ display: "grid", placeItems: "center", height: 18, borderRadius: 5, background: day[key] ? "rgba(100,189,130,.2)" : "rgba(255,255,255,.035)", border: `1px solid ${day[key] ? "rgba(100,189,130,.45)" : "rgba(255,255,255,.055)"}`, color: day[key] ? "#64BD82" : "#59616b", fontSize: 9 }}>{day[key] ? "✓" : "·"}</span>),
      ])}
    </div>
  </div>;
}
