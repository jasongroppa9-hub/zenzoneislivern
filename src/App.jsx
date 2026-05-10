import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

var bg = '#08080E';
var surface = '#101018';
var card = '#14141E';
var border = '#1C1C2A';
var recovery = '#00D9C0';
var strain = '#FF5C2A';
var sleep = '#A78BFA';
var yellow = '#F5C842';
var text = '#F0F0F8';
var muted = '#5A5A72';

var weekData = [
  { day: 'M', recovery: 62, strain: 10.8, sleep: 73 },
  { day: 'T', recovery: 74, strain: 8.2, sleep: 81 },
  { day: 'W', recovery: 44, strain: 17.1, sleep: 61 },
  { day: 'T', recovery: 56, strain: 13.4, sleep: 69 },
  { day: 'F', recovery: 83, strain: 9.5, sleep: 89 },
  { day: 'S', recovery: 67, strain: 15.8, sleep: 77 },
  { day: 'S', recovery: 78, strain: 14.2, sleep: 82 },
];

var activities = [
  { name: 'Morning Run', strain: 14.2, duration: '48 min', calories: 410 },
  { name: 'Strength Training', strain: 11.8, duration: '62 min', calories: 380 },
  { name: 'Cycling', strain: 16.4, duration: '75 min', calories: 590 },
  { name: 'Yoga Flow', strain: 5.2, duration: '45 min', calories: 180 },
];

function App() {
  var tabState = useState('today');
  var tab = tabState[0];
  var setTab = tabState[1];

  var tabs = ['today', 'sleep', 'activity', 'trends'];

  var cardStyle = {
    background: card,
    border: '1px solid ' + border,
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '12px',
  };

  function TodayContent() {
    return React.createElement('div', null,
      React.createElement('div', { style: { display: 'flex', gap: '10px', marginBottom: '16px' } },
        React.createElement('div', { style: Object.assign({}, cardStyle, { flex: 1, marginBottom: 0 }) },
          React.createElement('div', { style: { fontSize: '11px', color: muted, textTransform: 'uppercase', marginBottom: '6px' } }, 'Recovery'),
          React.createElement('div', { style: { fontSize: '32px', fontWeight: 700, color: recovery } }, '78'),
          React.createElement('div', { style: { fontSize: '12px', color: muted, marginTop: '4px' } }, 'Good')
        ),
        React.createElement('div', { style: Object.assign({}, cardStyle, { flex: 1, marginBottom: 0 }) },
          React.createElement('div', { style: { fontSize: '11px', color: muted, textTransform: 'uppercase', marginBottom: '6px' } }, 'Strain'),
          React.createElement('div', { style: { fontSize: '32px', fontWeight: 700, color: strain } }, '14.2'),
          React.createElement('div', { style: { fontSize: '12px', color: muted, marginTop: '4px' } }, 'High')
        ),
        React.createElement('div', { style: Object.assign({}, cardStyle, { flex: 1, marginBottom: 0 }) },
          React.createElement('div', { style: { fontSize: '11px', color: muted, textTransform: 'uppercase', marginBottom: '6px' } }, 'Sleep'),
          React.createElement('div', { style: { fontSize: '32px', fontWeight: 700, color: sleep } }, '82'),
          React.createElement('div', { style: { fontSize: '12px', color: muted, marginTop: '4px' } }, '7h 40m')
        )
      ),
      React.createElement('div', { style: cardStyle },
        React.createElement('div', { style: { fontSize: '12px', color: muted, marginBottom: '10px' } }, 'Weekly Recovery'),
        React.createElement(ResponsiveContainer, { width: '100%', height: 130 },
          React.createElement(AreaChart, { data: weekData },
            React.createElement(XAxis, { dataKey: 'day', stroke: muted, tick: { fontSize: 10, fill: muted } }),
            React.createElement(Tooltip, { contentStyle: { background: surface, border: 'none', borderRadius: '8px', color: text, fontSize: 12 } }),
            React.createElement(Area, { type: 'monotone', dataKey: 'recovery', stroke: recovery, fill: recovery + '20', strokeWidth: 2 })
          )
        )
      ),
      React.createElement('div', { style: cardStyle },
        React.createElement('div', { style: { fontSize: '12px', color: muted, marginBottom: '10px' } }, 'Weekly Strain'),
        React.createElement(ResponsiveContainer, { width: '100%', height: 130 },
          React.createElement(BarChart, { data: weekData },
            React.createElement(XAxis, { dataKey: 'day', stroke: muted, tick: { fontSize: 10, fill: muted } }),
            React.createElement(Tooltip, { contentStyle: { background: surface, border: 'none', borderRadius: '8px', color: text, fontSize: 12 } }),
            React.createElement(Bar, { dataKey: 'strain', fill: strain, radius: [4, 4, 0, 0] })
          )
        )
      )
    );
  }

  function SleepContent() {
    return React.createElement('div', null,
      React.createElement('div', { style: cardStyle },
        React.createElement('div', { style: { fontSize: '12px', color: muted, marginBottom: '4px' } }, 'Last Night'),
        React.createElement('div', { style: { fontSize: '40px', fontWeight: 700, color: sleep } }, '7h 40m'),
        React.createElement('div', { style: { fontSize: '12px', color: muted, marginTop: '4px' } }, 'Sleep Score: 82')
      ),
      React.createElement('div', { style: cardStyle },
        React.createElement('div', { style: { fontSize: '12px', color: muted, marginBottom: '12px' } }, 'Sleep Trend'),
        React.createElement(ResponsiveContainer, { width: '100%', height: 130 },
          React.createElement(LineChart, { data: weekData },
            React.createElement(XAxis, { dataKey: 'day', stroke: muted, tick: { fontSize: 10, fill: muted } }),
            React.createElement(Tooltip, { contentStyle: { background: surface, border: 'none', borderRadius: '8px', color: text, fontSize: 12 } }),
            React.createElement(Line, { type: 'monotone', dataKey: 'sleep', stroke: sleep, strokeWidth: 2, dot: false })
          )
        )
      )
    );
  }

  function ActivityContent() {
    return React.createElement('div', null,
      activities.map(function(a) {
        return React.createElement('div', { key: a.name, style: cardStyle },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: '15px', fontWeight: 600, color: text, marginBottom: '4px' } }, a.name),
              React.createElement('div', { style: { fontSize: '12px', color: muted } }, a.duration + ' - ' + a.calories + ' cal')
            ),
            React.createElement('div', { style: { textAlign: 'right' } },
              React.createElement('div', { style: { fontSize: '22px', fontWeight: 700, color: strain } }, a.strain),
              React.createElement('div', { style: { fontSize: '10px', color: muted, textTransform: 'uppercase' } }, 'Strain')
            )
          )
        );
      })
    );
  }

  function TrendsContent() {
    var stats = [
      { label: 'Avg Recovery', value: '68%', color: recovery },
      { label: 'Avg Strain', value: '12.7', color: strain },
      { label: 'Avg Sleep', value: '76%', color: sleep },
      { label: 'Weekly Load', value: '89.4', color: yellow },
    ];
    return React.createElement('div', null,
      React.createElement('div', { style: cardStyle },
        React.createElement('div', { style: { fontSize: '12px', color: muted, marginBottom: '10px' } }, 'Recovery vs Sleep'),
        React.createElement(ResponsiveContainer, { width: '100%', height: 160 },
          React.createElement(LineChart, { data: weekData },
            React.createElement(XAxis, { dataKey: 'day', stroke: muted, tick: { fontSize: 10, fill: muted } }),
            React.createElement(YAxis, { stroke: muted, tick: { fontSize: 10, fill: muted } }),
            React.createElement(Tooltip, { contentStyle: { background: surface, border: 'none', borderRadius: '8px', color: text, fontSize: 12 } }),
            React.createElement(Line, { type: 'monotone', dataKey: 'recovery', stroke: recovery, strokeWidth: 2, dot: false }),
            React.createElement(Line, { type: 'monotone', dataKey: 'sleep', stroke: sleep, strokeWidth: 2, dot: false })
          )
        )
      ),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' } },
        stats.map(function(s) {
          return React.createElement('div', { key: s.label, style: cardStyle },
            React.createElement('div', { style: { fontSize: '11px', color: muted, marginBottom: '6px' } }, s.label),
            React.createElement('div', { style: { fontSize: '26px', fontWeight: 700, color: s.color } }, s.value)
          );
        })
      )
    );
  }

  return React.createElement('div', { style: { background: bg, minHeight: '100vh', color: text, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' } },
    React.createElement('div', { style: { background: surface, borderBottom: '1px solid ' + border, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 } },
      React.createElement('div', { style: { fontSize: '22px', fontWeight: 700, color: recovery, letterSpacing: '-0.02em' } }, 'ZENZONE'),
      React.createElement('div', { style: { fontSize: '12px', color: muted } }, 'May 11, 2026')
    ),
    React.createElement('div', { style: { display: 'flex', padding: '12px 16px 0', gap: '4px', borderBottom: '1px solid ' + border } },
      tabs.map(function(t) {
        var active = tab === t;
        return React.createElement('button', {
          key: t,
          onClick: function() { setTab(t); },
          style: { flex: 1, padding: '8px 4px', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: active ? '2px solid ' + recovery : '2px solid transparent', transition: 'all 0.2s', marginBottom: '-1px' }
        }, React.createElement('span', { style: { fontSize: '10px', color: active ? recovery : muted, fontWeight: active ? 700 : 400, textTransform: 'uppercase', letterSpacing: '0.05em' } }, t.toUpperCase()));
      })
    ),
    React.createElement('div', { style: { padding: '16px' } },
      tab === 'today' ? React.createElement(TodayContent, null) : null,
      tab === 'sleep' ? React.createElement(SleepContent, null) : null,
      tab === 'activity' ? React.createElement(ActivityContent, null) : null,
      tab === 'trends' ? React.createElement(TrendsContent, null) : null
    )
  );
}

export default App;
