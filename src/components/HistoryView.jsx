import React, { useState, useEffect } from 'react';

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

function normalizeDateInput(dateValue) {
  if (!dateValue) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return dateValue;
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return '';
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function HistoryView({
  expenses,
  categories,
  initialMonth = 'all',
  onEdit,
  onDelete,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    setSelectedMonth(initialMonth);
  }, [initialMonth]);

  const filtered = expenses.filter((expense) => {
    const catMatch =
      selectedCategory === 'all' || (expense.category || 'General') === selectedCategory;

    let monthMatch = true;
    if (selectedMonth !== 'all') {
      const normalized = normalizeDateInput(expense.date);
      if (!normalized) {
        monthMatch = false;
      } else {
        const d = new Date(`${normalized}T00:00:00`);
        monthMatch = d.getMonth().toString() === selectedMonth;
      }
    }

    let dateMatch = true;
    if (selectedDate) {
      dateMatch = normalizeDateInput(expense.date) === selectedDate;
    }

    return catMatch && monthMatch && dateMatch;
  });

  const totalFiltered = filtered.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedMonth('all');
    setSelectedDate('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#f8fafc' }}>
      <div
        style={{
          backgroundColor: '#1e293b',
          padding: '1rem',
          borderRadius: '12px',
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '1.15rem' }}>
          Historial y filtros de gastos
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '0.75rem',
          }}
        >
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
              Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid #475569',
                backgroundColor: '#0f172a',
                color: '#f8fafc',
              }}
            >
              <option value="all">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
              Mes
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid #475569',
                backgroundColor: '#0f172a',
                color: '#f8fafc',
              }}
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
              Fecha exacta
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem',
                borderRadius: '8px',
                border: '1px solid #475569',
                backgroundColor: '#0f172a',
                color: '#f8fafc',
              }}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: '0.9rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid #334155',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>
              Movimientos: <strong>{filtered.length}</strong> · Total filtrado:{' '}
            </span>
            <strong style={{ color: '#34d399', fontSize: '1.05rem' }}>
              S/. {totalFiltered.toFixed(2)}
            </strong>
          </div>

          <button
            type="button"
            onClick={handleClearFilters}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              border: '1px solid #475569',
              backgroundColor: '#334155',
              color: '#f8fafc',
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            backgroundColor: '#1e293b',
            padding: '1.5rem',
            borderRadius: '12px',
            textAlign: 'center',
            color: '#94a3b8',
          }}
        >
          No hay gastos que coincidan con los filtros seleccionados.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#1e293b',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.75rem',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>
                  {item.title || item.description || 'Gasto sin título'}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  {item.category || 'General'} · {normalizeDateInput(item.date) || item.date}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <strong style={{ color: '#f8fafc', fontSize: '0.98rem' }}>
                  S/. {(Number(item.amount) || 0).toFixed(2)}
                </strong>
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid #475569',
                      backgroundColor: '#0f172a',
                      color: '#e2e8f0',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    Editar
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: '#7f1d1d',
                      color: '#fecaca',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    Borrar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}