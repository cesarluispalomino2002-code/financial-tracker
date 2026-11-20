import React from 'react';

export default function BottomNav({ activeTab, onChangeTab }) {
  const navItems = [
    { id: 'home', label: 'Inicio', icon: '🏠' },
    { id: 'history', label: 'Historial', icon: '📜' },
    { id: 'budgets', label: 'Presupuestos', icon: '🎯' },
  ];

  return (
    <nav
      aria-label="Navegación principal"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '66px',
        backgroundColor: '#0f172a',
        borderTop: '1px solid #334155',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChangeTab(item.id)}
            style={{
              flex: 1,
              height: '100%',
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              cursor: 'pointer',
              color: isActive ? '#38bdf8' : '#94a3b8',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.78rem',
            }}
          >
            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}