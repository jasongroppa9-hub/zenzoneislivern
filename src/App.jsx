import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";

const C = {
  bg: "#08080E",
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
  dimBright: "#2A2A3E",
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

const sleepStages = [
  { t: "10p", rem: 0, deep: 0, light: 85, awake: 15 },
  { t: "11p", rem: 10, deep: 20, light: 65, awake: 5 },
  { t: "12a", rem: 20, deep: 45, light: 35, awake: 0 },
  { t: "1a", rem: 25, deep: 55, light: 20, awake: 0 },
  { t: "2a", rem: 35, deep: 40, light: 25, awake: 0 },
  { t: "3a", rem: 45, deep: 25, light: 30, awake: 0 },
  { t: "4a", rem: 40, deep: 15, light: 40, awake: 5 },
  { t: "5a", rem: 30, deep: 5, light: 55, awake: 10 },
  { t: "6a", rem: 10, deep: 0, light: 60, awake: 30 },
];

const activities = [
  { name: "Morning Run", type: "run", strain: 14.2, duration: "48 min", calories: 410, avgHR: 152, zone: "Challenging" },
  { name: "Strength Training", type: "lift", strain: 11.8, duration: "62 min", calories: 380, avgHR: 138, zone: "Moderate" },
  { name: "Cycling", type: "bike", strain: 16.4, duration: "75 min", calories: 590, avgHR: 164, zone: "Hard" },
  { name: "Yoga Flow", type: "yoga", strain: 5.2, duration: "45 min", calories: 180, avgHR: 98, zone: "Light" },
];

const hrZones = [
  { zone: "Max", pct: 8, color: "#FF2A2A", range: "185+" },
  { zone: "Hard", pct: 22, color: "#FF5C2A", range: "163–184" },
  { zone: "Moderate", pct: 35, color: "#F5C842", range: "141–162" },
  { zone: "Light", pct: 25, color: "#00D9C0", range: "114–140" },
  { zone: "Warm-up", pct: 10, color: "#A78BFA", range: "<114" },
];

function Ring({ value, max = 100, size = 140, stroke = 11, color, bg = C.dim, children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = Math.min(value / max, 1) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}

function ScoreCard({ label, value, max, color, unit = "", sub, size = 140 }) {
  const [displayVal, setDisplayVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / 40;
    const t = setInterval(() => {
      start += step;
      if (start >= value) { setDisplayVal(value); clearInterval(t); }
      else setDisplayVal(Math.floor(start));
    }, 20);
    return () => clearInterval(t);
  }, [value]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <Ring value={value} max={max} size={size} color={color}>
        <span style={{ fontSize: size > 120 ? 30 : 22, fontWeight: 700, color, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
          {displayVal}{unit}
        </span>
        {sub && <span style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{sub}</span>}
      </Ring>
      <span style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>{label}</span>
    </div>
  );
}

function MetricTile({ label, value, unit, color = C.text, icon }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 14 }}>{icon}</span>{label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color, fontVariantNumeric: "tabular-nums" }}>
        {value}<span style={{ fontSize: 13, color: C.muted, fontWeight: 400, marginLeft: 3 }}>{unit}</span>
      </div>
    </div>
  );
}

function ZoneBars() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {hrZones.map(z => (
        <div key={z.zone} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, color: C.muted, width: 60, flexShrink: 0 }}>{z.zone}</span>
          <div style={{ flex: 1, height: 8, background: C.dim, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${z.pct}%`, height: "100%", background: z.color, borderRadius: 4, transition: "width 1s ease" }} />
          </div>
          <span style={{ fontSize: 11, color: z.color, width: 30, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{z.pct}%</span>
          <span style={{ fontSize: 10, color: C.muted, width: 56, textAlign: "right" }}>{z.range}</span>
        </div>
      ))}
    </div>
  );
}

function ActivityIcon({ type }) {
  const icons = { run: "🏃", lift: "🏋️", bike: "🚴", yoga: "🧘" };
  return <span style={{ fontSize: 22 }}>{icons[type] || "⚡"}</span>;
}

function TodayTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px 20px" }}>
        <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>Today's Readiness</div>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <ScoreCard label="Recovery" value={78} max={100} color={C.recovery} size={160} />
          <ScoreCard label="Strain" value={14} max={21} color={C.strain} unit="" sub="of 21" size={160} />
          <ScoreCard label="Sleep" value={82} max={100} color={C.sleep} size={160} />
        </div>
        <div style={{ marginTop: 20, padding: "12px 16px", background: `${C.recovery}15`, borderRadius: 10, borderLeft: `3px solid ${C.recovery}` }}>
          <div style={{ fontSize: 12, color: C.recovery, fontWeight: 600 }}>✓ Good Recovery</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Your body is well-recovered. Optimal day for a challenging workout.</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        <MetricTile label="HRV" value="67" unit="ms" color={C.recovery} icon="💚" />
        <MetricTile label="Resting HR" value="52" unit="bpm" color={C.text} icon="❤️" />
        <MetricTile label="SpO₂" value="98" unit="%" color={C.text} icon="🫁" />
        <MetricTile label="Resp. Rate" value="16" unit="rpm" color={C.text} icon="🌬️" />
        <MetricTile label="Calories" value="2,480" unit="kcal" color={C.yellow} icon="🔥" />
        <MetricTile label="Steps" value="7,842" unit="" color={C.text} icon="👟" />
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px" }}>
        <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Weekly Recovery</div>
        <div style={{ height: 120 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weekData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.recovery} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.recovery} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, color: C.text }}
                labelStyle={{ color: C.muted }}
                formatter={(v) => [`${v}%`, "Recovery"]}
              />
              <Area type="monotone" dataKey="recovery" stroke={C.recovery} strokeWidth={2} fill="url(#recGrad)" dot={{ fill: C.recovery, r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: C.recovery }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function SleepTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Last Night</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: C.text, marginTop: 4 }}>7h 42m</div>
            <div style={{ fontSize: 12, color: C.muted }}>10:48 PM → 6:30 AM</div>
          </div>
          <ScoreCard label="Sleep Score" value={82} max={100} color={C.sleep} size={120} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {[
            { label: "Deep Sleep", value: "1h 24m", color: "#4A3FA0" },
            { label: "REM Sleep", value: "1h 52m", color: C.sleep },
            { label: "Light Sleep", value: "4h 06m", color: "#6D6D9A" },
            { label: "Awake", value: "20m", color: C.muted },
          ].map(s => (
            <div key={s.label} style={{ background: C.surface, borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: C.muted }}>{s.label}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: s.color }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px" }}>
        <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Sleep Architecture</div>
        <div style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sleepStages} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="deepGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4A3FA0" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#4A3FA0" stopOpacity={0.4} />
                </linearGradient>
                <linearGradient id="remGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.sleep} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={C.sleep} stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={false} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, color: C.text }}
                labelStyle={{ color: C.muted }}
              />
              <Area type="monotone" dataKey="deep" stackId="1" stroke="#4A3FA0" fill="url(#deepGrad)" strokeWidth={0} />
              <Area type="monotone" dataKey="rem" stackId="1" stroke={C.sleep} fill="url(#remGrad)" strokeWidth={0} />
              <Area type="monotone" dataKey="light" stackId="1" stroke="#3A3A5A" fill="#3A3A5A88" strokeWidth={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
          {[{ label: "Deep", color: "#4A3FA0" }, { label: "REM", color: C.sleep }, { label: "Light", color: "#3A3A5A" }].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
              <span style={{ fontSize: 11, color: C.muted }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px" }}>
        <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>7-Day Sleep Trend</div>
        <div style={{ height: 110 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, color: C.text }}
                formatter={(v) => [`${v}%`, "Sleep Score"]}
              />
              <Bar dataKey="sleep" radius={[4, 4, 0, 0]}>
                {weekData.map((entry, i) => (
                  <Cell key={i} fill={i === 6 ? C.sleep : `${C.sleep}55`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ActivityTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px" }}>
        <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Today's Strain</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 42, fontWeight: 700, color: C.strain, fontVariantNumeric: "tabular-nums" }}>14.2</span>
          <span style={{ fontSize: 14, color: C.muted }}>/ 21.0 — Challenging</span>
        </div>
        <div style={{ height: 8, background: C.dim, borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
          <div style={{ width: `${(14.2 / 21) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.recovery}, ${C.yellow}, ${C.strain})`, borderRadius: 4 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {["Rest", "Light", "Moderate", "Challenging", "All Out"].map((l, i) => (
            <span key={l} style={{ fontSize: 9, color: i === 3 ? C.strain : C.muted, fontWeight: i === 3 ? 600 : 400, textTransform: "uppercase" }}>{l}</span>
          ))}
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px" }}>
        <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Heart Rate Zones</div>
        <ZoneBars />
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px" }}>
        <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Recent Activities</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {activities.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", background: C.surface, borderRadius: 10, border: `1px solid ${C.border}` }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: `${C.strain}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ActivityIcon type={a.type} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{a.name}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{a.duration} · {a.avgHR} avg bpm · {a.calories} kcal</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.strain }}>{a.strain}</div>
                <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase" }}>strain</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrendsTab() {
  const [range, setRange] = useState("7d");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {["7d", "28d", "90d"].map(r => (
          <button key={r} onClick={() => setRange(r)} style={{
            padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
            background: range === r ? C.recovery : "transparent",
            color: range === r ? "#000" : C.muted,
            border: `1px solid ${range === r ? C.recovery : C.border}`,
            transition: "all 0.2s"
          }}>{r}</button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Recovery vs Strain</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>7-day overlay</div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: C.recovery }} /><span style={{ fontSize: 11, color: C.muted }}>Recovery</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: C.strain }} /><span style={{ fontSize: 11, color: C.muted }}>Strain</span></div>
          </div>
        </div>
        <div style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, color: C.text }} labelStyle={{ color: C.muted }} />
              <Line type="monotone" dataKey="recovery" stroke={C.recovery} strokeWidth={2.5} dot={{ fill: C.recovery, r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="strain" stroke={C.strain} strokeWidth={2.5} strokeDasharray="5 3" dot={{ fill: C.strain, r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px" }}>
        <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>HRV Baseline Trend</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 32, fontWeight: 700, color: C.recovery }}>67</span>
          <span style={{ fontSize: 13, color: C.muted }}>ms · 7-day avg</span>
          <span style={{ fontSize: 12, color: C.recovery, marginLeft: "auto" }}>+8% ↑</span>
        </div>
        <div style={{ height: 100 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weekData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="hrvGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.recovery} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={C.recovery} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[30, 90]} tick={false} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, color: C.text }} labelStyle={{ color: C.muted }} formatter={(v) => [v + " ms", "HRV"]} />
              <Area type="monotone" dataKey="hrv" stroke={C.recovery} strokeWidth={2} fill="url(#hrvGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { label: "Avg Recovery", value: "66%", delta: "+5%", color: C.recovery },
          { label: "Avg Strain", value: "12.4", delta: "-0.8", color: C.strain },
          { label: "Avg Sleep", value: "7h 38m", delta: "+12m", color: C.sleep },
          { label: "Avg HRV", value: "59 ms", delta: "+4ms", color: C.recovery },
        ].map(s => (
          <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px" }}>
            <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: s.delta.startsWith("+") ? C.recovery : C.strain, marginTop: 2 }}>{s.delta} vs last week</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const tabs = [
  { id: "today", label: "Today", icon: "⚡" },
  { id: "sleep", label: "Sleep", icon: "🌙" },
  { id: "activity", label: "Activity", icon: "🏃" },
  { id: "trends", label: "Trends", icon: "📈" },
];

export default function WhoopApp() {
  const [tab, setTab] = useState("today");

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, 'Segoe UI', sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.recovery, boxShadow: `0 0 8px ${C.recovery}` }} />
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: C.text }}>ZENZONE</span>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 12, color: C.muted }}>Sunday, May 10</div>
          <div style={{ fontSize: 11, color: C.recovery }}>Day 142 · Streak 🔥</div>
        </div>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${C.recovery}20`, border: `1.5px solid ${C.recovery}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
          👤
        </div>
      </div>

      <div style={{ flex: 1, padding: "20px 16px", paddingBottom: 80, overflowY: "auto" }}>
        {tab === "today" && <TodayTab />}
        {tab === "sleep" && <SleepTab />}
        {tab === "activity" && <ActivityTab />}
        {tab === "trends" && <TrendsTab />}
      </div>

      <div style={{ position: "sticky", bottom: 0, background: C.surface, borderTop: `1px solid ${C.border}`, display: "flex", zIndex: 10 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "12px 4px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            background: "transparent", border: "none", cursor: "pointer",
            borderTop: tab === t.id ? `2px solid ${C.recovery}` : "2px solid transparent",
            transition: "all 0.2s"
          }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span style={{ fontSize: 10, color: tab === t.id ? C.recovery : C.muted, fontWeight: tab === t.id ? 600 : 400, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
