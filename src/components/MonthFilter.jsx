import React from 'react';

const MONTHS = [
  { value: 'all', label: 'Todos los meses' },
  { value: '0', label: 'Enero' },
  { value: '1', label: 'Febrero' },
  { value: '2', label: 'Marzo' },
  { value: '3', label: 'Abril' },
  { value: '4', label: 'Mayo' },
  { value: '5', label: 'Junio' },
  { value: '6', label: 'Julio' },
  { value: '7', label: 'Agosto' },
  { value: '8', label: 'Septiembre' },
  { value: '9', label: 'Octubre' },
  { value: '10', label: 'Noviembre' },
  { value: '11', label: 'Diciembre' },
];

export function MonthFilter({ selectedMonth, onSelectMonth }) {
  return (
    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <label htmlFor="month-select" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
        Filtrar por mes:
      </label>
      <select
        id="month-select"
        value={selectedMonth}
        onChange={(e) => onSelectMonth(e.target.value)}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          backgroundColor: '#1e293b',
          color: '#f8fafc',
          border: '1px solid #334155',
          outline: 'none',
          fontSize: '0.9rem',
          cursor: 'pointer',
        }}
      >
        {MONTHS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
    </div>
  );
}