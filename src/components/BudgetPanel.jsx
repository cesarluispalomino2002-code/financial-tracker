import React, { useState } from 'react';

export default function BudgetPanel({
  categories,
  budgets,
  expenses,
  selectedMonth,
  onSetBudget,
  onRemoveBudget,
  onAddCategory,
}) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || '');
  const [amountInput, setAmountInput] = useState('');
  const [newCatName, setNewCatName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = parseFloat(amountInput);
    if (!selectedCategory || Number.isNaN(value) || value <= 0) return;
    onSetBudget(selectedCategory, value);
    setAmountInput('');
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    onAddCategory(trimmed);
    setSelectedCategory(trimmed);
    setNewCatName('');
  };

  const startEditingCategory = (category) => {
    setSelectedCategory(category);
    setAmountInput(budgets[category] ? String(budgets[category]) : '');
  };

  // Calcular gasto acumulado por categoría en el periodo filtrado
  const spentByCategory = expenses.reduce((acc, item) => {
    const cat = item.category || 'General';
    const amt = Number(item.amount) || 0;
    acc[cat] = (acc[cat] || 0) + amt;
    return acc;
  }, {});

  const allCategories = Array.from(new Set([...categories, ...Object.keys(budgets)]));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div
        style={{
          backgroundColor: '#1e293b',
          padding: '1rem',
          borderRadius: '12px',
          color: '#f8fafc',
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.15rem' }}>
          Presupuestos por categoría {selectedMonth === 'all' ? '(Todos los meses)' : '(Mes seleccionado)'}
        </h2>
        <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: '#cbd5e1' }}>
          Asigna un monto máximo en S/. para controlar cuánto gastas y cuánto te queda disponible.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}
        >
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.55rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #475569',
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              minWidth: '150px',
            }}
          >
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Monto máx. S/."
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            style={{
              padding: '0.55rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #475569',
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              width: '150px',
            }}
          />

          <button
            type="submit"
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#10b981',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Guardar límite
          </button>
        </form>

        <form
          onSubmit={handleCreateCategory}
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '0.9rem',
            paddingTop: '0.9rem',
            borderTop: '1px solid #334155',
            flexWrap: 'wrap',
          }}
        >
          <input
            type="text"
            placeholder="Nueva categoría..."
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            style={{
              padding: '0.45rem 0.7rem',
              borderRadius: '8px',
              border: '1px solid #475569',
              backgroundColor: '#0f172a',
              color: '#f8fafc',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #475569',
              backgroundColor: '#334155',
              color: '#f8fafc',
              cursor: 'pointer',
            }}
          >
            + Añadir categoría
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gap: '0.9rem' }}>
        {allCategories.map((category) => {
          const limit = budgets[category];
          const spent = spentByCategory[category] || 0;
          const hasLimit = typeof limit === 'number' && limit > 0;
          const percentage = hasLimit ? Math.min((spent / limit) * 100, 100) : 0;
          const rawPercentage = hasLimit ? (spent / limit) * 100 : 0;
          const remaining = hasLimit ? limit - spent : null;

          let barColor = '#10b981'; // verde
          let statusText = '';

          if (hasLimit) {
            if (spent > limit) {
              barColor = '#ef4444'; // rojo: excedido
              statusText = `Excedido por S/. ${(spent - limit).toFixed(2)}`;
            } else if (rawPercentage >= 80) {
              barColor = '#f59e0b'; // ámbar: cerca del límite
              statusText = `Te queda S/. ${remaining.toFixed(2)} (${rawPercentage.toFixed(0)}% usado)`;
            } else {
              statusText = `Disponible: S/. ${remaining.toFixed(2)}`;
            }
          }

          return (
            <div
              key={category}
              style={{
                backgroundColor: '#1e293b',
                padding: '1rem',
                borderRadius: '12px',
                color: '#f8fafc',
                border: spent > limit && hasLimit ? '1px solid #ef4444' : '1px solid #334155',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <strong style={{ fontSize: '1rem' }}>{category}</strong>
                  <div style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                    Gastado: <strong>S/. {spent.toFixed(2)}</strong>
                    {hasLimit ? ` de S/. ${limit.toFixed(2)}` : ' · Sin monto asignado'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.45rem' }}>
                  <button
                    type="button"
                    onClick={() => startEditingCategory(category)}
                    style={{
                      padding: '0.35rem 0.7rem',
                      borderRadius: '6px',
                      border: '1px solid #475569',
                      backgroundColor: '#0f172a',
                      color: '#e2e8f0',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                    }}
                  >
                    {hasLimit ? 'Editar' : 'Asignar'}
                  </button>

                  {hasLimit && (
                    <button
                      type="button"
                      onClick={() => onRemoveBudget(category)}
                      style={{
                        padding: '0.35rem 0.7rem',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#7f1d1d',
                        color: '#fecaca',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>

              {hasLimit && (
                <div style={{ marginTop: '0.75rem' }}>
                  <div
                    style={{
                      width: '100%',
                      height: '10px',
                      backgroundColor: '#0f172a',
                      borderRadius: '999px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: barColor,
                        transition: 'width 0.25s ease',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: '0.4rem',
                      fontSize: '0.82rem',
                      color: spent > limit ? '#fca5a5' : '#94a3b8',
                    }}
                  >
                    {statusText}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}