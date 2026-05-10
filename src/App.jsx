import React, { useState } from 'react';

function App() {
  const [tab, setTab] = useState('today');

  const days = [
    { day: 'M', recovery: 62, strain: 10.8, sleep: 73 },
    { day: 'T', recovery: 74, strain: 8.2, sleep: 81 },
    { day: 'W', recovery: 44, strain: 17.1, sleep: 61 },
    { day: 'T', recovery: 56, strain: 13.4, sleep: 69 },
    { day: 'F', recovery: 83, strain: 9.5, sleep: 89 },
    { day: 'S', recovery: 67, strain: 15.8, sleep: 77 },
    { day: 'S', recovery: 78, strain: 14.2, sleep: 82 },
  ];

  const s = {
    app: { minHeight: '100vh', backgroundColor: '#000', color: '#f0f0f8', fontFamily: 'system-ui, sans-serif', padding: '24px' },
    container: { maxWidth: '900px', margin: '0 auto' },
    title: { color: '#00D9C0', fontSize: '28px', fontWeight: '700', marginBottom: '8px' },
    subtitle: { color: '#5A5A72', marginBottom: '24px' },
    tabs: { display: 'flex', gap: '10px', marginBottom: '24px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
    card: { backgroundColor: '#14141E', borderRadius: '16px', padding: '24px', textAlign: 'center' },
    cardLabel: { fontSize: '12px', color: '#5A5A72', marginTop: '4px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { color: '#5A5A72', textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #1E1E2E', fontSize: '12px' },
    td: { padding: '10px 12px', borderBottom: '1px solid #1E1E2E', fontSize: '14px' },
    section: { backgroundColor: '#14141E', borderRadius: '16px', padding: '24px' },
    sectionTitle: { color: '#5A5A72', marginBottom: '16px' },
  };

  const tabStyle = (active) => ({
    padding: '8px 20px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: active ? '700' : '400',
    backgroundColor: active ? '#00D9C0' : '#1E1E2E',
    color: active ? '#000' : '#f0f0f8',
    fontSize: '14px',
  });

  return (
    <div style={s.app}>
      <div style={s.container}>
        <h1 style={s.title}>ZenZone</h1>
        <p style={s.subtitle}>Fitness Dashboard</p>
        <div style={s.tabs}>
          <button style={tabStyle(tab === 'today')} onClick={() => setTab('today')}>Today</button>
          <button style={tabStyle(tab === 'week')} onClick={() => setTab('week')}>Week</button>
          <button style={tabStyle(tab === 'trends')} onClick={() => setTab('trends')}>Trends</button>
        </div>

        {tab === 'today' && (
          <div style={s.grid}>
            <div style={s.card}>
              <div style={{ fontSize: '40px', fontWeight: '700', color: '#00D9C0' }}>78%</div>
              <div style={s.cardLabel}>Recovery</div>
            </div>
            <div style={s.card}>
              <div style={{ fontSize: '40px', fontWeight: '700', color: '#FF5C2A' }}>14.2</div>
              <div style={s.cardLabel}>Strain</div>
            </div>
            <div style={s.card}>
              <div style={{ fontSize: '40px', fontWeight: '700', color: '#A7BBFA' }}>82%</div>
              <div style={s.cardLabel}>Sleep</div>
            </div>
          </div>
        )}

        {tab === 'week' && (
          <div style={s.section}>
            <h3 style={s.sectionTitle}>Weekly Overview</h3>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Day</th>
                  <th style={s.th}>Recovery</th>
                  <th style={s.th}>Strain</th>
                  <th style={s.th}>Sleep</th>
                </tr>
              </thead>
              <tbody>
                {days.map((d) => (
                  <tr key={d.day + d.recovery}>
                    <td style={s.td}>{d.day}</td>
                    <td style={{ ...s.td, color: '#00D9C0' }}>{d.recovery}%</td>
                    <td style={{ ...s.td, color: '#FF5C2A' }}>{d.strain}</td>
                    <td style={{ ...s.td, color: '#A7BBFA' }}>{d.sleep}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'trends' && (
          <div style={s.section}>
            <h3 style={s.sectionTitle}>HRV Trends</h3>
            <p style={{ color: '#f0f0f8' }}>Average HRV this week: 59ms</p>
            <p style={{ color: '#00D9C0', fontSize: '32px', fontWeight: '700' }}>+12% vs last week</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
