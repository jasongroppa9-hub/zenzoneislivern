import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";

const C = {
  bg: "#000000",
  surface: "#101018",
  card: "#14141E",
  border: "#1C1C2A",
  recovery: "#00D9C0",
  recoveryDim: "#00D9C020",
  strain: "#FF5C2A",
  strainDim: "#FF5C2A20",
  sleep: "#A78BFA",
  sleepDim: "#A78BFA20",
  yellow: "#F5C842",
  text: "#F0F0F8",
  muted: "#5A5A72",
  dim: "#1E1E2E",
  dimbright: "#2A2A3E",
};

const weekData = [
  { day: "M", recovery: 62, strain: 10.8, sleep: 73, hrv: 58 },
  { day: "T", recovery: 74, strain: 8.2, sleep: 81, hrv: 63 },
  { day: "W", recovery: 44, strain: 17.1, sleep: 61, hrv: 44 },
  { day: "T", recovery: 56, strain: 13.4, sleep: 69, hrv: 51 },
  { day: "F", recovery: 83, strain: 9.5, sleep: 89, hrv: 71 },
  { day: "S", recovery: 67, strain: 15.8, sleep: 77, hrv: 60 },
  { day: "S", recovery: 78, strain: 14.2, sleep: 82, hrv: 67 },
];

function Ring({ value, max = 100, size = 140, stroke = 11, color, bg = C.dim, children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = Math.min(value / max, 1) * circ;
  const dashStr = dash + " " + (circ - dash);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={dashStr}
          strokeLinecap="round"
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}

function WhoopApp() {
  const [tab, setTab] = useState("today");
  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, color: C.text, fontFamily: "system-ui, sans-serif", padding: "20px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ color: C.recovery, marginBottom: 20 }}>ZenZone Fitness Dashboard</h1>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {["today", "week", "trends"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer", backgroundColor: tab === t ? C.recovery : C.dim, color: tab === t ? "#000" : C.text, fontWeight: tab === t ? 700 : 400 }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>
        {tab === "today" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            <div style={{ backgroundColor: C.card, borderRadius: 16, padding: 20, textAlign: "center" }}>
              <Ring value={78} color={C.recovery} size={120}>
                <div style={{ fontSize: 28, fontWeight: 700, color: C.recovery }}>78%</div>
                <div style={{ fontSize: 11, color: C.muted }}>Recovery</div>
              </Ring>
            </div>
            <div style={{ backgroundColor: C.card, borderRadius: 16, padding: 20, textAlign: "center" }}>
              <Ring value={14.2} max={21} color={C.strain} size={120}>
                <div style={{ fontSize: 28, fontWeight: 700, color: C.strain }}>14.2</div>
                <div style={{ fontSize: 11, color: C.muted }}>Strain</div>
              </Ring>
            </div>
            <div style={{ backgroundColor: C.card, borderRadius: 16, padding: 20, textAlign: "center" }}>
              <Ring value={82} color={C.sleep} size={120}>
                <div style={{ fontSize: 28, fontWeight: 700, color: C.sleep }}>82%</div>
                <div style={{ fontSize: 11, color: C.muted }}>Sleep</div>
              </Ring>
            </div>
          </div>
        )}
        {tab === "week" && (
          <div style={{ backgroundColor: C.card, borderRadius: 16, padding: 20 }}>
            <h3 style={{ color: C.muted, marginBottom: 16 }}>Weekly Overview</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weekData}>
                <XAxis dataKey="day" stroke={C.muted} />
                <YAxis stroke={C.muted} />
                <Tooltip contentStyle={{ background: C.surface, border: "none" }} />
                <Line type="monotone" dataKey="recovery" stroke={C.recovery} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="strain" stroke={C.strain} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        {tab === "trends" && (
          <div style={{ backgroundColor: C.card, borderRadius: 16, padding: 20 }}>
            <h3 style={{ color: C.muted, marginBottom: 16 }}>HRV Trends</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weekData}>
                <XAxis dataKey="day" stroke={C.muted} />
                <YAxis stroke={C.muted} />
                <Tooltip contentStyle={{ background: C.surface, border: "none" }} />
                <Area type="monotone" dataKey="hrv" stroke={C.recovery} fill={C.recoveryDim} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default WhoopApp;
