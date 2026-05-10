import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const C = {
  bg: '#080808',
  surface: '#101018',
  card: '#14141E',
  border: '#1C1C2A',
  recovery: '#00D9C0',
  strain: '#FF5C2A',
  sleep: '#A78BFA',
  yellow: '#F5C842',
  text: '#F0F0F8',
  muted: '#5A5A72',
};

const weekData = [
  { day: 'M', recovery: 62, strain: 10.8, sleep: 73 },
  { day: 'T', recovery: 74, strain: 8.2, sleep: 81 },
  { day: 'W', recovery: 44, strain: 17.1, sleep: 61 },
  { day: 'T', recovery: 56, strain: 13.4, sleep: 69 },
  { day: 'F', recovery: 83, strain: 9.5, sleep: 89 },
  { day: 'S', recovery: 67, strain: 15.8, sleep: 77 },
  { day: 'S', recovery: 78, strain: 14.2, sleep: 82 },
];

const activities = [
  { name: 'Morning Run', strain: 14.2, duration: '48 min', calories: 410 },
  { name: 'Strength Training', strain: 11.8, duration: '62 min', calories: 380 },
  { name: 'Cycling', strain: 16.4, duration: '75 min', calories: 590 },
  { name: 'Yoga Flow', strain: 5.2, duration: '45 min', calories: 180 },
];

function Card({ children, style }) {
  return (
    <div style={{ background: C.card, border: '1px solid ' + C.border, borderRadius: 16, padding: 20, ...style }}>
      {children}
    </div>
  );
}

function ScoreCard({ label, value, max, color, sub }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <Card style={{ flex: 1 }}>
      <div style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color: color, marginBottom: 2 }}>{value}</div>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>{sub}</div>
      <div style={{ height: 6, background: C.border, borderRadius: 3 }}>
        <div style={{ width: pct + '%', height: '100%', background: color, borderRadius: 3 }} />
      </div>
    </Card>
  );
}

function TodayContent() {
  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <ScoreCard label="Recovery" value={78} max={100} color={C.recovery} sub="Good" />
        <ScoreCard label="Strain" value={14.2} max={21} color={C.strain} sub="High" />
        <ScoreCard label="Sleep" value={82} max={100} color={C.sleep} sub="7h 42m" />
        <ScoreCard label="HRV" value={67} max={120} color={C.yellow} sub="ms" />
      </div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>WEEKLY RECOVERY TREND</div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={weekData}>
            <XAxis dataKey="day" stroke={C.muted} tick={{ fill: C.muted, fontSize: 11 }} />
            <YAxis stroke={C.muted} tick={{ fill: C.muted, fontSize: 11 }} />
            <Tooltip contentStyle={{ background: C.surface, border: '1px solid ' + C.border, borderRadius: 8, color: C.text }} />
            <Area type="monotone" dataKey="recovery" stroke={C.recovery} fill={C.recovery + '22'} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function SleepContent() {
  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: 16 }}>
        <ScoreCard label="Sleep Score" value={82} max={100} color={C.sleep} sub="Good" />
        <ScoreCard label="Duration" value={'7h 42m'} max={100} color={C.recovery} sub="Goal: 8h" />
        <ScoreCard label="REM" value={'1h 48m'} max={100} color={C.yellow} sub="22%" />
      </div>
      <Card>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>WEEKLY SLEEP SCORES</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weekData}>
            <XAxis dataKey="day" stroke={C.muted} tick={{ fill: C.muted, fontSize: 11 }} />
            <YAxis stroke={C.muted} tick={{ fill: C.muted, fontSize: 11 }} />
            <Tooltip contentStyle={{ background: C.surface, border: '1px solid ' + C.border, borderRadius: 8, color: C.text }} />
            <Bar dataKey="sleep" fill={C.sleep} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function ActivityContent() {
  return (
    <div>
      {activities.map(function(a, i) {
        return (
          <Card key={i} style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 4 }}>{a.name}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{a.duration} &bull; {a.calories} cal</div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: C.strain }}>{a.strain}</div>
          </Card>
        );
      })}
    </div>
  );
}

function TrendsContent() {
  return (
    <Card>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>STRAIN vs RECOVERY</div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={weekData}>
          <XAxis dataKey="day" stroke={C.muted} tick={{ fill: C.muted, fontSize: 11 }} />
          <YAxis stroke={C.muted} tick={{ fill: C.muted, fontSize: 11 }} />
          <Tooltip contentStyle={{ background: C.surface, border: '1px solid ' + C.border, borderRadius: 8, color: C.text }} />
          <Line type="monotone" dataKey="recovery" stroke={C.recovery} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="strain" stroke={C.strain} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default function App() {
  const [tab, setTab] = useState('today');
  const tabs = ['today', 'sleep', 'activity', 'trends'];

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>ZenZone Fitness</div>
            <div style={{ fontSize: 13, color: C.muted }}>Your daily performance dashboard</div>
          </div>
          <div style={{ fontSize: 13, color: C.muted }}>Today</div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {tabs.map(function(t) {
            return (
              <button
                key={t}
                onClick={function() { setTab(t); }}
                style={{
                  padding: '8px 18px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                  background: tab === t ? C.recovery : C.card,
                  color: tab === t ? '#000' : C.muted,
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            );
          })}
        </div>
        {tab === 'today' && <TodayContent />}
        {tab === 'sleep' && <SleepContent />}
        {tab === 'activity' && <ActivityContent />}
        {tab === 'trends' && <TrendsContent />}
      </div>
    </div>
  );
}
