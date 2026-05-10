import { useState } from "react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const C = {
  bg: "#08080E",
  surface: "#101018",
  card: "#14141E",
  border: "#1C1C2A",
  recovery: "#00D9C0",
  strain: "#FF5C2A",
  sleep: "#A78BFA",
  yellow: "#F5C842",
  text: "#F0F0F8",
  muted: "#5A5A72",
};

const weekData = [
  { day: "M", recovery: 62, strain: 10.8, sleep: 73 },
  { day: "T", recovery: 74, strain: 8.2, sleep: 81 },
  { day: "W", recovery: 44, strain: 17.1, sleep: 61 },
  { day: "T", recovery: 56, strain: 13.4, sleep: 69 },
  { day: "F", recovery: 83, strain: 9.5, sleep: 89 },
  { day: "S", recovery: 67, strain: 15.8, sleep: 77 },
  { day: "S", recovery: 78, strain: 14.2, sleep: 82 },
];

const activities = [
  { name: "Morning Run", strain: 14.2, duration: "48 min", calories: 410 },
  { name: "Strength Training", strain: 11.8, duration: "62 min", calories: 380 },
  { name: "Cycling", strain: 16.4, duration: "75 min", calories: 590 },
  { name: "Yoga Flow", strain: 5.2, duration: "45 min", calories: 180 },
];

function Card({ children, style }) {
  return (
    <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 16, padding: 20, ...style }}>
      {children}
    </div>
  );
}

function ScoreCard({ label, value, max, color, sub }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <Card style={{ flex: 1 }}>
      <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color: color, marginBottom: 2 }}>{value}</div>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>{sub}</div>
      <div style={{ height: 4, background: C.border, borderRadius: 2 }}>
        <div style={{ width: pct + "%", height: "100%", background: color, borderRadius: 2 }} />
      </div>
    </Card>
  );
}

function TodayTab() {
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <ScoreCard label="Recovery" value={78} max={100} color={C.recovery} sub="Good" />
        <ScoreCard label="Strain" value={14.2} max={21} color={C.strain} sub="High" />
        <ScoreCard label="Sleep" value={82} max={100} color={C.sleep} sub="7h 40m" />
      </div>
      <Card style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>Weekly Recovery</div>
        <ResponsiveContainer width="100%" height={130}>
          <AreaChart data={weekData}>
            <XAxis dataKey="day" stroke={C.muted} tick={{ fontSize: 10, fill: C.muted }} />
            <Tooltip contentStyle={{ background: C.surface, border: "none", borderRadius: 8, color: C.text, fontSize: 12 }} />
            <Area type="monotone" dataKey="recovery" stroke={C.recovery} fill={C.recovery + "20"} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>Weekly Strain</div>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={weekData}>
            <XAxis dataKey="day" stroke={C.muted} tick={{ fontSize: 10, fill: C.muted }} />
            <Tooltip contentStyle={{ background: C.surface, border: "none", borderRadius: 8, color: C.text, fontSize: 12 }} />
            <Bar dataKey="strain" fill={C.strain} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function SleepTab() {
  const stages = [
    { label: "Deep", time: "1h 45m", pct: 22, color: "#6366F1" },
    { label: "REM", time: "2h 10m", pct: 28, color: C.sleep },
    { label: "Light", time: "3h 25m", pct: 43, color: "#818CF8" },
    { label: "Awake", time: "20m", pct: 4, color: C.muted },
  ];
  return (
    <div>
      <Card style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Last Night</div>
        <div style={{ fontSize: 40, fontWeight: 700, color: C.sleep }}>7h 40m</div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Sleep Score: 82</div>
      </Card>
      <Card style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>Sleep Stages</div>
        {stages.map(function(s) {
          return (
            <div key={s.label} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: C.text }}>{s.label}</span>
                <span style={{ fontSize: 12, color: C.muted }}>{s.time}</span>
              </div>
              <div style={{ height: 6, background: C.border, borderRadius: 3 }}>
                <div style={{ width: s.pct + "%", height: "100%", background: s.color, borderRadius: 3 }} />
              </div>
            </div>
          );
        })}
      </Card>
      <Card>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>Sleep Trend</div>
        <ResponsiveContainer width="100%" height={130}>
          <LineChart data={weekData}>
            <XAxis dataKey="day" stroke={C.muted} tick={{ fontSize: 10, fill: C.muted }} />
            <Tooltip contentStyle={{ background: C.surface, border: "none", borderRadius: 8, color: C.text, fontSize: 12 }} />
            <Line type="monotone" dataKey="sleep" stroke={C.sleep} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function ActivityTab() {
  return (
    <div>
      {activities.map(function(a) {
        return (
          <Card key={a.name} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 4 }}>{a.name}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{a.duration} - {a.calories} cal</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.strain }}>{a.strain}</div>
                <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase" }}>Strain</div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function TrendsTab() {
  const stats = [
    { label: "Avg Recovery", value: "68%", color: C.recovery },
    { label: "Avg Strain", value: "12.7", color: C.strain },
    { label: "Avg Sleep", value: "76%", color: C.sleep },
    { label: "Weekly Load", value: "89.4", color: C.yellow },
  ];
  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>Recovery vs Sleep</div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={weekData}>
            <XAxis dataKey="day" stroke={C.muted} tick={{ fontSize: 10, fill: C.muted }} />
            <YAxis stroke={C.muted} tick={{ fontSize: 10, fill: C.muted }} />
            <Tooltip contentStyle={{ background: C.surface, border: "none", borderRadius: 8, color: C.text, fontSize: 12 }} />
            <Line type="monotone" dataKey="recovery" stroke={C.recovery} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="sleep" stroke={C.sleep} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {stats.map(function(s) {
          return (
            <Card key={s.label}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function WhoopApp() {
  const [tab, setTab] = useState("today");
  const tabs = [
    { id: "today", label: "TODAY" },
    { id: "sleep", label: "SLEEP" },
    { id: "activity", label: "ACTIVITY" },
    { id: "trends", label: "TRENDS" },
  ];
  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" }}>
      <div style={{ background: C.surface, borderBottom: "1px solid " + C.border, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.recovery, letterSpacing: "-0.02em" }}>ZENZONE</div>
        <div style={{ fontSize: 12, color: C.muted }}>May 10, 2026</div>
      </div>
      <div style={{ display: "flex", padding: "12px 16px 0", gap: 4, borderBottom: "1px solid " + C.border }}>
        {tabs.map(function(t) {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={function() { setTab(t.id); }} style={{ flex: 1, padding: "8px 4px", background: "transparent", border: "none", cursor: "pointer", borderBottom: active ? "2px solid " + C.recovery : "2px solid transparent", transition: "all 0.2s", marginBottom: -1 }}>
              <span style={{ fontSize: 10, color: active ? C.recovery : C.muted, fontWeight: active ? 700 : 400, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.label}</span>
            </button>
          );
        })}
      </div>
      <div style={{ padding: "16px 16px 80px" }}>
        {tab === "today" && <TodayTab />}
        {tab === "sleep" && <SleepTab />}
        {tab === "activity" && <ActivityTab />}
        {tab === "trends" && <TrendsTab />}
      </div>
    </div>
  );
}
