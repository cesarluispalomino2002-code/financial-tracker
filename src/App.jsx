import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import CategoryManager from './components/CategoryManager';
import { MonthFilter } from './components/MonthFilter';
import styles from './App.module.scss';

const DEFAULT_CATEGORIES = ['Comida', 'Gasolina', 'Ropa', 'Servicios', 'Entretenimiento'];

export default function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses_data');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('categories_data');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('all');

  useEffect(() => {
    localStorage.setItem('expenses_data', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('categories_data', JSON.stringify(categories));
  }, [categories]);

  const handleSaveExpense = (expenseData) => {
    if (editingExpense) {
      setExpenses(expenses.map(e => e.id === editingExpense.id ? { ...expenseData, id: e.id } : e));
      setEditingExpense(null);
    } else {
      setExpenses([{ ...expenseData, id: crypto.randomUUID() }, ...expenses]);
    }
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const handleAddCategory = (newCat) => {
    if (newCat && !categories.includes(newCat)) {
      setCategories([...categories, newCat]);
    }
  };

  // 🔍 Lógica para filtrar gastos por mes seleccionado
  const filteredExpenses = expenses.filter((expense) => {
    if (selectedMonth === 'all') return true;

    // Ajuste de fecha local para evitar desfases de zona horaria UTC
    const dateStr = expense.date.includes('T') ? expense.date : `${expense.date}T00:00:00`;
    const expenseDate = new Date(dateStr);

    return expenseDate.getMonth().toString() === selectedMonth;
  });

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <h1>Control Financiero</h1>
        <span className={styles.badge}>SaaS Edition</span>
      </header>

      <main className={styles.mainGrid}>
        <section className={styles.leftColumn}>
          {/* Se añade el selector de mes y se envía filteredExpenses */}
          <MonthFilter
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
          />
          <Dashboard expenses={filteredExpenses} categories={categories} />
        </section>

        <section className={styles.rightColumn}>
          <ExpenseForm 
            categories={categories} 
            onSave={handleSaveExpense} 
            editingExpense={editingExpense}
            onCancelEdit={() => setEditingExpense(null)}
          />
          <CategoryManager categories={categories} onAddCategory={handleAddCategory} />
          <ExpenseList 
            expenses={filteredExpenses} 
            onEdit={setEditingExpense} 
            onDelete={handleDeleteExpense} 
          />
        </section>
      </main>
    </div>
  );
}