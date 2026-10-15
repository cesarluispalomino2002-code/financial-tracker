import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import CategoryManager from './components/CategoryManager';
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

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <h1>Control Financiero</h1>
        <span className={styles.badge}>SaaS Edition</span>
      </header>

      <main className={styles.mainGrid}>
        <section className={styles.leftColumn}>
          <Dashboard expenses={expenses} categories={categories} />
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
            expenses={expenses} 
            onEdit={setEditingExpense} 
            onDelete={handleDeleteExpense} 
          />
        </section>
      </main>
    </div>
  );
}