import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadialBarChart, RadialBar
} from "recharts";

const C = {
  bg: "#0E0B07",
  surface: "#13100A",
  card: "#191410",
  border: "#2E2618",
  borderGold: "#6B5428",
  recovery: "#C9973A",
  recoveryDim: "#C9973A18",
  strain: "#8B2A2A",
  strainDim: "#8B2A2A20",
  sleep: "#7A6B9A",
  sleepDim: "#7A6B9A20",
  gold: "#D4A843",
  goldBright: "#F0C96A",
  goldDim: "#D4A84318",
  text: "#E8DFC8",
  muted: "#6B5E45",
  parchment: "#C4B08A",
  dim: "#1C1710",
  dimBright: "#26200F",
  deepRed: "#6B1A1A",
  ink: "#2A2218",
};

const FONT = {
  serif: "'Georgia', 'Garamond', 'Times New Roman', serif",
  sansSerif: "'Georgia', serif",
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
  { zone: "Max", pct: 8, color: "#8B2A2A", range: "185+" },
  { zone: "Hard", pct: 22, color: "#A33A20", range: "163–184" },
  { zone: "Moderate", pct: 35, color: "#C9973A", range: "141–162" },
  { zone: "Light", pct: 25, color: "#7A9A6B", range: "114–140" },
  { zone: "Warm-up", pct: 10, color: "#7A6B9A", range: "<114" },
];

const Divider = ({ style = {} }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, ...style }}>
    <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${C.borderGold})` }} />
    <span style={{ color: C.gold, fontSize: 12, lineHeight: 1 }}>✦</span>
    <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C.borderGold}, transparent)` }} />
  </div>
);

const SectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{
      fontFamily: FONT.serif,
      fontSize: 10,
      letterSpacing: "0.25em",
      color: C.gold,
      textTransform: "uppercase",
      marginBottom: 4,
    }}>{children}</div>
    {sub && <div style={{ fontFamily: FONT.serif, fontSize: 11, color: C.muted, fontStyle: "italic" }}>{sub}</div>}
  </div>
);

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
          strokeLinecap="butt"
          style={{ filter: `drop-shadow(0 0 5px ${color}55)` }}
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <Ring value={value} max={max} size={size} color={color} bg={C.ink}>
        <span style={{
          fontSize: size > 120 ? 28 : 20,
          fontWeight: 700,
          fontFamily: FONT.serif,
          color,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          textShadow: `0 0 12px ${color}66`,
        }}>
          {displayVal}{unit}
        </span>
        {sub && <span style={{ fontSize: 9, color: C.muted, marginTop: 3, fontFamily: FONT.serif, fontStyle: "italic" }}>{sub}</span>}
      </Ring>
      <span style={{
        fontFamily: FONT.serif,
        fontSize: 9,
        color: C.parchment,
        textTransform: "uppercase",
        letterSpacing: "0.2em",
        fontWeight: 400,
      }}>{label}</span>
    </div>
  );
}

function MetricTile({ label, value, unit, color = C.text, icon }) {
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 4,
      padding: "14px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 5,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${C.borderGold}, transparent)`
      }} />
      <div style={{
        fontSize: 9,
        color: C.muted,
        textTransform: "uppercase",
        letterSpacing: "0.18em",
        fontFamily: FONT.serif,
        display: "flex", alignItems: "center", gap: 5,
      }}>
        <span style={{ fontSize: 13 }}>{icon}</span>{label}
      </div>
      <div style={{
        fontSize: 22,
        fontWeight: 700,
        fontFamily: FONT.serif,
        color,
        fontVariantNumeric: "tabular-nums",
        textShadow: `0 0 10px ${color}44`,
      }}>
        {value}<span style={{ fontSize: 12, color: C.muted, fontWeight: 400, marginLeft: 3 }}>{unit}</span>
      </div>
    </div>
  );
}

function ZoneBars() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      {hrZones.map(z => (
        <div key={z.zone} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 10, color: C.parchment, width: 64, flexShrink: 0, fontFamily: FONT.serif, fontStyle: "italic" }}>{z.zone}</span>
          <div style={{ flex: 1, height: 6, background: C.ink, borderRadius: 0, overflow: "hidden" }}>
            <div style={{ width: `${z.pct}%`, height: "100%", background: z.color, transition: "width 1s ease" }} />
          </div>
          <span style={{ fontSize: 11, color: z.color, width: 30, textAlign: "right", fontFamily: FONT.serif, fontVariantNumeric: "tabular-nums" }}>{z.pct}%</span>
          <span style={{ fontSize: 10, color: C.muted, width: 56, textAlign: "right", fontFamily: FONT.serif }}>{z.range}</span>
        </div>
      ))}
    </div>
  );
}

function ActivityIcon({ type }) {
  const icons = { run: "🏃", lift: "🏋️", bike: "🚴", yoga: "🧘" };
  return <span style={{ fontSize: 20 }}>{icons[type] || "⚡"}</span>;
}

const tooltipStyle = {
  contentStyle: {
    background: C.surface,
    border: `1px solid ${C.borderGold}`,
    borderRadius: 2,
    fontSize: 12,
    color: C.text,
    fontFamily: FONT.serif,
  },
  labelStyle: { color: C.gold, fontFamily: FONT.serif, fontSize: 10, letterSpacing: "0.1em" },
};

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 4,
      padding: "20px",
      position: "relative",
      overflow: "hidden",
      ...style,
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${C.borderGold}88, transparent)`
      }} />
      {children}
    </div>
  );
}

function TodayTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <SectionTitle sub="The body speaks — learn to listen">Today's Readiness</SectionTitle>
        <Divider style={{ marginBottom: 24 }} />
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <ScoreCard label="Recovery" value={78} max={100} color={C.gold} size={160} />
          <ScoreCard label="Strain" value={14} max={21} color={C.deepRed} unit="" sub="of 21" size={160} />
          <ScoreCard label="Sleep" value={82} max={100} color={C.sleep} size={160} />
        </div>
        <Divider style={{ margin: "20px 0 16px" }} />
        <div style={{
          padding: "14px 18px",
          background: C.goldDim,
          borderLeft: `2px solid ${C.gold}`,
        }}>
          <div style={{ fontSize: 11, color: C.gold, fontFamily: FONT.serif, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>✦ Good Recovery</div>
          <div style={{ fontSize: 12, color: C.parchment, fontFamily: FONT.serif, fontStyle: "italic", lineHeight: 1.6 }}>
            Your body has restored itself well. The wise general knows when to strike.
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        <MetricTile label="HRV" value="67" unit="ms" color={C.gold} icon="💚" />
        <MetricTile label="Resting HR" value="52" unit="bpm" color={C.text} icon="❤️" />
        <MetricTile label="SpO₂" value="98" unit="%" color={C.text} icon="🫁" />
        <MetricTile label="Resp. Rate" value="16" unit="rpm" color={C.text} icon="🌬️" />
        <MetricTile label="Calories" value="2,480" unit="kcal" color={C.goldBright} icon="🔥" />
        <MetricTile label="Steps" value="7,842" unit="" color={C.text} icon="👟" />
      </div>

      <Card>
        <SectionTitle sub="Seven days of dominion">Weekly Recovery</SectionTitle>
        <div style={{ height: 120 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weekData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.gold} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.gold} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 11, fontFamily: FONT.serif }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: C.muted, fontSize: 10, fontFamily: FONT.serif }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, "Recovery"]} />
              <Area type="monotone" dataKey="recovery" stroke={C.gold} strokeWidth={1.5} fill="url(#recGrad)" dot={{ fill: C.gold, r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: C.gold }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function SleepTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <SectionTitle sub="Rest is the weapon of kings">Last Night's Repose</SectionTitle>
            <div style={{ fontSize: 32, fontWeight: 700, fontFamily: FONT.serif, color: C.goldBright, marginTop: 6, textShadow: `0 0 16px ${C.gold}55` }}>7h 42m</div>
            <div style={{ fontSize: 11, color: C.muted, fontFamily: FONT.serif, fontStyle: "italic", marginTop: 3 }}>10:48 PM — 6:30 AM</div>
          </div>
          <ScoreCard label="Sleep Score" value={82} max={100} color={C.sleep} size={120} />
        </div>
        <Divider style={{ marginBottom: 14 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {[
            { label: "Deep Sleep", value: "1h 24m", color: "#5A4A8A" },
            { label: "REM Sleep", value: "1h 52m", color: C.sleep },
            { label: "Light Sleep", value: "4h 06m", color: "#4A4060" },
            { label: "Awake", value: "20m", color: C.muted },
          ].map(s => (
            <div key={s.label} style={{ background: C.ink, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `2px solid ${s.color}66` }}>
              <span style={{ fontSize: 11, color: C.muted, fontFamily: FONT.serif, fontStyle: "italic" }}>{s.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: s.color, fontFamily: FONT.serif }}>{s.value}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle sub="The architecture of restoration">Sleep Stages</SectionTitle>
        <div style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sleepStages} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="deepGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5A4A8A" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#5A4A8A" stopOpacity={0.4} />
                </linearGradient>
                <linearGradient id="remGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.sleep} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={C.sleep} stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" tick={{ fill: C.muted, fontSize: 11, fontFamily: FONT.serif }} axisLine={false} tickLine={false} />
              <YAxis tick={false} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="deep" stackId="1" stroke="#5A4A8A" fill="url(#deepGrad)" strokeWidth={0} />
              <Area type="monotone" dataKey="rem" stackId="1" stroke={C.sleep} fill="url(#remGrad)" strokeWidth={0} />
              <Area type="monotone" dataKey="light" stackId="1" stroke="#2E2840" fill="#2E284088" strokeWidth={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
          {[{ label: "Deep", color: "#5A4A8A" }, { label: "REM", color: C.sleep }, { label: "Light", color: "#2E2840" }].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 2, background: l.color }} />
              <span style={{ fontSize: 10, color: C.muted, fontFamily: FONT.serif, fontStyle: "italic" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle sub="The week in slumber">Seven-Day Sleep</SectionTitle>
        <div style={{ height: 110 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 11, fontFamily: FONT.serif }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: C.muted, fontSize: 10, fontFamily: FONT.serif }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, "Sleep Score"]} />
              <Bar dataKey="sleep" radius={0}>
                {weekData.map((entry, i) => (
                  <Cell key={i} fill={i === 6 ? C.sleep : `${C.sleep}44`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function ActivityTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <SectionTitle sub="What the body endures today">Today's Strain</SectionTitle>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 48, fontWeight: 700, fontFamily: FONT.serif, color: C.goldBright, fontVariantNumeric: "tabular-nums", textShadow: `0 0 20px ${C.gold}55` }}>14.2</span>
          <span style={{ fontSize: 13, color: C.muted, fontFamily: FONT.serif, fontStyle: "italic" }}>of 21.0 — Challenging</span>
        </div>
        <div style={{ height: 6, background: C.ink, marginBottom: 8, overflow: "hidden" }}>
          <div style={{ width: `${(14.2 / 21) * 100}%`, height: "100%", background: `linear-gradient(90deg, #5A7A4A, ${C.gold}, ${C.deepRed})` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {["Rest", "Light", "Moderate", "Challenging", "All Out"].map((l, i) => (
            <span key={l} style={{ fontSize: 8, color: i === 3 ? C.gold : C.muted, fontWeight: i === 3 ? 600 : 400, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: FONT.serif }}>{l}</span>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle sub="The measure of your fire">Heart Rate Zones</SectionTitle>
        <ZoneBars />
      </Card>

      <Card>
        <SectionTitle sub="The record of battles fought">Recent Activities</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {activities.map((a, i) => (
            <div key={i}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 4px" }}>
                <div style={{ width: 42, height: 42, background: `${C.deepRed}22`, border: `1px solid ${C.borderGold}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ActivityIcon type={a.type} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, fontFamily: FONT.serif, color: C.text, letterSpacing: "0.02em" }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: C.muted, fontFamily: FONT.serif, fontStyle: "italic", marginTop: 2 }}>{a.duration} · {a.avgHR} avg bpm · {a.calories} kcal</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: FONT.serif, color: C.gold, textShadow: `0 0 10px ${C.gold}44` }}>{a.strain}</div>
                  <div style={{ fontSize: 8, color: C.muted, textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: FONT.serif }}>strain</div>
                </div>
              </div>
              {i < activities.length - 1 && <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.border}, transparent)` }} />}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function TrendsTab() {
  const [range, setRange] = useState("7d");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 2 }}>
        {["7d", "28d", "90d"].map(r => (
          <button key={r} onClick={() => setRange(r)} style={{
            padding: "7px 18px",
            fontSize: 11,
            fontFamily: FONT.serif,
            letterSpacing: "0.15em",
            cursor: "pointer",
            background: range === r ? C.gold : "transparent",
            color: range === r ? "#0E0B07" : C.muted,
            border: `1px solid ${range === r ? C.gold : C.border}`,
            fontWeight: range === r ? 700 : 400,
            transition: "all 0.2s",
          }}>{r}</button>
        ))}
      </div>

      <Card>
        <SectionTitle sub="Recovery against exertion — the eternal balance">Recovery vs. Strain</SectionTitle>
        <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 18, height: 1, background: C.gold }} />
            <span style={{ fontSize: 10, color: C.muted, fontFamily: FONT.serif, fontStyle: "italic" }}>Recovery</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 18, height: 1, background: C.deepRed, borderTop: "1px dashed #8B2A2A" }} />
            <span style={{ fontSize: 10, color: C.muted, fontFamily: FONT.serif, fontStyle: "italic" }}>Strain</span>
          </div>
        </div>
        <div style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 11, fontFamily: FONT.serif }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 10, fontFamily: FONT.serif }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="recovery" stroke={C.gold} strokeWidth={1.5} dot={{ fill: C.gold, r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="strain" stroke={C.deepRed} strokeWidth={1.5} strokeDasharray="5 3" dot={{ fill: C.deepRed, r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <SectionTitle sub="The vital signal of readiness">HRV Baseline</SectionTitle>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 38, fontWeight: 700, fontFamily: FONT.serif, color: C.goldBright, textShadow: `0 0 16px ${C.gold}55` }}>67</span>
          <span style={{ fontSize: 12, color: C.muted, fontFamily: FONT.serif, fontStyle: "italic" }}>ms · seven-day average</span>
          <span style={{ fontSize: 11, color: C.gold, marginLeft: "auto", fontFamily: FONT.serif }}>↑ +8%</span>
        </div>
        <div style={{ height: 100 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weekData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="hrvGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.gold} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={C.gold} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 11, fontFamily: FONT.serif }} axisLine={false} tickLine={false} />
              <YAxis domain={[30, 90]} tick={false} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} formatter={(v) => [v + " ms", "HRV"]} />
              <Area type="monotone" dataKey="hrv" stroke={C.gold} strokeWidth={1.5} fill="url(#hrvGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, border: `1px solid ${C.border}`, background: C.border }}>
        {[
          { label: "Avg Recovery", value: "66%", delta: "+5%", color: C.gold, up: true },
          { label: "Avg Strain", value: "12.4", delta: "−0.8", color: C.deepRed, up: false },
          { label: "Avg Sleep", value: "7h 38m", delta: "+12m", color: C.sleep, up: true },
          { label: "Avg HRV", value: "59 ms", delta: "+4ms", color: C.gold, up: true },
        ].map(s => (
          <div key={s.label} style={{ background: C.card, padding: "18px 16px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${C.borderGold}66, transparent)` }} />
            <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.18em", fontFamily: FONT.serif, marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: FONT.serif, color: s.color, textShadow: `0 0 10px ${s.color}33` }}>{s.value}</div>
            <div style={{ fontSize: 10, color: s.up ? C.gold : C.deepRed, marginTop: 4, fontFamily: FONT.serif, fontStyle: "italic" }}>{s.delta} vs last week</div>
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
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: FONT.serif, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{
        background: C.surface,
        borderBottom: `1px solid ${C.borderGold}`,
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: C.gold, fontSize: 10 }}>✦</span>
            <span style={{
              fontSize: 17,
              fontWeight: 700,
              fontFamily: FONT.serif,
              letterSpacing: "0.25em",
              color: C.goldBright,
              textShadow: `0 0 14px ${C.gold}55`,
              textTransform: "uppercase",
            }}>ZenZone</span>
            <span style={{ color: C.gold, fontSize: 10 }}>✦</span>
          </div>
          <div style={{ fontSize: 8, color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: FONT.serif, marginTop: 1 }}>Mastery of the Body</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: C.parchment, fontFamily: FONT.serif, fontStyle: "italic" }}>Sunday, May 10</div>
          <div style={{ fontSize: 10, color: C.gold, fontFamily: FONT.serif, letterSpacing: "0.08em" }}>Day 142 · Streak 🔥</div>
        </div>
        <div style={{
          width: 34, height: 34,
          border: `1px solid ${C.borderGold}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14,
          background: `${C.gold}10`,
        }}>
          👤
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: "20px 16px", paddingBottom: 80, overflowY: "auto" }}>
        {tab === "today" && <TodayTab />}
        {tab === "sleep" && <SleepTab />}
        {tab === "activity" && <ActivityTab />}
        {tab === "trends" && <TrendsTab />}
      </div>

      {/* Nav */}
      <div style={{
        position: "sticky",
        bottom: 0,
        background: C.surface,
        borderTop: `1px solid ${C.borderGold}`,
        display: "flex",
        zIndex: 10,
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1,
            padding: "12px 4px 10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            borderTop: tab === t.id ? `2px solid ${C.gold}` : "2px solid transparent",
            transition: "all 0.2s",
          }}>
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            <span style={{
              fontSize: 8,
              color: tab === t.id ? C.gold : C.muted,
              fontWeight: tab === t.id ? 600 : 400,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontFamily: FONT.serif,
            }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
