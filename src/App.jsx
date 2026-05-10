import React, { useState } from 'react';

function App() {
  var state = useState('today');
  var tab = state[0];
  var setTab = state[1];

  var days = [
    { day: 'M', recovery: 62, strain: 10.8, sleep: 73 },
    { day: 'T', recovery: 74, strain: 8.2, sleep: 81 },
    { day: 'W', recovery: 44, strain: 17.1, sleep: 61 },
    { day: 'T', recovery: 56, strain: 13.4, sleep: 69 },
    { day: 'F', recovery: 83, strain: 9.5, sleep: 89 },
    { day: 'S', recovery: 67, strain: 15.8, sleep: 77 },
    { day: 'S', recovery: 78, strain: 14.2, sleep: 82 },
  ];

  var styles = {
    app: { minHeight: '100vh', backgroundColor: '#000', color: '#f0f0f8', fontFamily: 'system-ui, sans-serif', padding: '24px' },
    container: { maxWidth: '900px', margin: '0 auto' },
    title: { color: '#00D9C0', fontSize: '28px', fontWeight: '700', marginBottom: '8px' },
    subtitle: { color: '#5A5A72', marginBottom: '24px' },
    tabs: { display: 'flex', gap: '10px', marginBottom: '24px' },
    tab: function(active) { return { padding: '8px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: active ? '700' : '400', backgroundColor: active ? '#00D9C0' : '#1E1E2E', color: active ? '#000' : '#f0f0f8', fontSize: '14px' }; },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
    card: { backgroundColor: '#14141E', borderRadius: '16px', padding: '24px', textAlign: 'center' },
    cardVal: function(color) { return { fontSize: '40px', fontWeight: '700', color: color }; },
    cardLabel: { fontSize: '12px', color: '#5A5A72', marginTop: '4px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { color: '#5A5A72', textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #1E1E2E', fontSize: '12px' },
    td: { padding: '10px 12px', borderBottom: '1px solid #1E1E2E', fontSize: '14px' },
  };

  return (
    React.createElement('div', { style: styles.app },
      React.createElement('div', { style: styles.container },
        React.createElement('h1', { style: styles.title }, 'ZenZone'),
        React.createElement('p', { style: styles.subtitle }, 'Fitness Dashboard'),
        React.createElement('div', { style: styles.tabs },
          React.createElement('button', { style: styles.tab(tab === 'today'), onClick: function() { setTab('today'); } }, 'Today'),
          React.createElement('button', { style: styles.tab(tab === 'week'), onClick: function() { setTab('week'); } }, 'Week'),
          React.createElement('button', { style: styles.tab(tab === 'trends'), onClick: function() { setTab('trends'); } }, 'Trends')
        ),
        tab === 'today' && React.createElement('div', { style: styles.grid },
          React.createElement('div', { style: styles.card },
            React.createElement('div', { style: styles.cardVal('#00D9C0') }, '78%'),
            React.createElement('div', { style: styles.cardLabel }, 'Recovery')
          ),
          React.createElement('div', { style: styles.card },
            React.createElement('div', { style: styles.cardVal('#FF5C2A') }, '14.2'),
            React.createElement('div', { style: styles.cardLabel }, 'Strain')
          ),
          React.createElement('div', { style: styles.card },
            React.createElement('div', { style: styles.cardVal('#A7BBFA') }, '82%'),
            React.createElement('div', { style: styles.cardLabel }, 'Sleep')
          )
        ),
        tab === 'week' && React.createElement('div', { style: { backgroundColor: '#14141E', borderRadius: '16px', padding: '24px' } },
          React.createElement('h3', { style: { color: '#5A5A72', marginBottom: '16px' } }, 'Weekly Overview'),
          React.createElement('table', { style: styles.table },
            React.createElement('thead', null,
              React.createElement('tr', null,
                React.createElement('th', { style: styles.th }, 'Day'),
                React.createElement('th', { style: styles.th }, 'Recovery'),
                React.createElement('th', { style: styles.th }, 'Strain'),
                React.createElement('th', { style: styles.th }, 'Sleep')
              )
            ),
            React.createElement('tbody', null,
              days.map(function(d) {
                return React.createElement('tr', { key: d.day + d.recovery },
                  React.createElement('td', { style: styles.td }, d.day),
                  React.createElement('td', { style: Object.assign({}, styles.td, { color: '#00D9C0' }) }, d.recovery + '%'),
                  React.createElement('td', { style: Object.assign({}, styles.td, { color: '#FF5C2A' }) }, d.strain),
                  React.createElement('td', { style: Object.assign({}, styles.td, { color: '#A7BBFA' }) }, d.sleep + '%')
                );
              })
            )
          )
        ),
        tab === 'trends' && React.createElement('div', { style: { backgroundColor: '#14141E', borderRadius: '16px', padding: '24px' } },
          React.createElement('h3', { style: { color: '#5A5A72', marginBottom: '16px' } }, 'HRV Trends'),
          React.createElement('p', { style: { color: '#f0f0f8' } }, 'Average HRV this week: 59ms'),
          React.createElement('p', { style: { color: '#00D9C0', fontSize: '32px', fontWeight: '700' } }, '+12% vs last week')
        )
      )
    )
  );
}

export default App;
