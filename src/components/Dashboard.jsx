import React, { useState, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import styles from './Dashboard.module.scss';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#ef4444'];

export default function Dashboard({ expenses, categories }) {
  const [filterPeriod, setFilterPeriod] = useState('month'); // 'day', 'week', 'month'
  const [selectedCategory, setSelectedCategory] = useState('all');

  // En src/components/Dashboard.jsx

const filteredExpenses = useMemo(() => {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  return expenses.filter(expense => {
    // Filtro por categoría
    if (selectedCategory !== 'all' && expense.category !== selectedCategory) return false;

    // Filtro por tiempo
    if (filterPeriod === 'day') {
      return expense.date === todayStr; // Comparación directa sin desfase horaria
    }

    // Para semana y mes, desglosamos la fecha YYYY-MM-DD en hora local
    const [year, month, day] = expense.date.split('-').map(Number);
    const expDate = new Date(year, month - 1, day); // Fuerza interpretación en hora local

    if (filterPeriod === 'week') {
      const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      return expDate >= oneWeekAgo;
    }

    if (filterPeriod === 'month') {
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    }

    return true;
  });
}, [expenses, filterPeriod, selectedCategory]);

  const totalSpent = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }, [filteredExpenses]);

  // Datos para la gráfica de Dona
  const chartData = useMemo(() => {
    const categoryTotals = {};
    filteredExpenses.forEach(e => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: COLORS.slice(0, labels.length),
          borderColor: '#121824',
          borderWidth: 2,
        },
      ],
    };
  }, [filteredExpenses]);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2>Resumen de Gastos</h2>
          <p className={styles.totalAmount}>${totalSpent.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
        </div>

        <div className={styles.filters}>
          <select value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)}>
            <option value="day">Hoy</option>
            <option value="week">Últimos 7 días</option>
            <option value="month">Este mes</option>
          </select>

          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">Todas las categorías</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.chartContainer}>
        {filteredExpenses.length > 0 ? (
          <Doughnut 
            data={chartData} 
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom', labels: { color: '#94a3b8' } },
              },
            }} 
          />
        ) : (
          <p className={styles.empty}>No hay gastos registrados en este periodo.</p>
        )}
      </div>
    </div>
  );
}