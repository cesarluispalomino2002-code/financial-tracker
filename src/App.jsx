import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import CategoryManager from './components/CategoryManager';
import { MonthFilter } from './components/MonthFilter';
import DataBackup from './components/DataBackup';
import BudgetPanel from './components/BudgetPanel';
import HistoryView from './components/HistoryView';
import BottomNav from './components/BottomNav';
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

  // Presupuestos mensuales por categoría: { [categoria]: montoMaximo }
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('budgets_data');
    return saved ? JSON.parse(saved) : {};
  });

  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'history' | 'budgets'

  useEffect(() => {
    localStorage.setItem('expenses_data', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('categories_data', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('budgets_data', JSON.stringify(budgets));
  }, [budgets]);

  const handleSaveExpense = (expenseData) => {
    if (editingExpense) {
      setExpenses(expenses.map((e) => (e.id === editingExpense.id ? { ...expenseData, id: e.id } : e)));
      setEditingExpense(null);
    } else {
      setExpenses([{ ...expenseData, id: crypto.randomUUID() }, ...expenses]);
    }
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const handleAddCategory = (newCat) => {
    if (newCat && !categories.includes(newCat)) {
      setCategories([...categories, newCat]);
    }
  };

  const handleSetBudget = (category, amount) => {
    const numericAmount = Number(amount);
    if (!category || Number.isNaN(numericAmount) || numericAmount <= 0) return;
    setBudgets((prev) => ({
      ...prev,
      [category]: numericAmount,
    }));
  };

  const handleRemoveBudget = (category) => {
    setBudgets((prev) => {
      const updated = { ...prev };
      delete updated[category];
      return updated;
    });
  };

  const getExpenseMonthIndex = (dateValue) => {
    if (!dateValue) return null;
    const dateStr = dateValue.includes('T') ? dateValue : `${dateValue}T00:00:00`;
    const parsedDate = new Date(dateStr);
    if (Number.isNaN(parsedDate.getTime())) return null;
    return parsedDate.getMonth().toString();
  };

  // Gastos filtrados por el mes seleccionado (usado en Inicio y Presupuestos)
  const monthFilteredExpenses = expenses.filter((expense) => {
    if (selectedMonth === 'all') return true;
    return getExpenseMonthIndex(expense.date) === selectedMonth;
  });

  return (
    <div className={styles.appContainer} style={{ paddingBottom: '84px' }}>
      <header className={styles.header}>
        <h1>Control Financiero</h1>
        <span className={styles.badge}>SaaS Edition</span>
      </header>

      <main className={styles.mainGrid}>
        {activeTab === 'home' && (
          <>
            <section className={styles.leftColumn}>
              <MonthFilter
                selectedMonth={selectedMonth}
                onSelectMonth={setSelectedMonth}
              />
              <DataBackup expenses={expenses} setExpenses={setExpenses} />
              <Dashboard expenses={monthFilteredExpenses} categories={categories} />
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
                expenses={monthFilteredExpenses}
                onEdit={(exp) => {
                  setEditingExpense(exp);
                  setActiveTab('home');
                }}
                onDelete={handleDeleteExpense}
              />
            </section>
          </>
        )}

        {activeTab === 'budgets' && (
          <section style={{ gridColumn: '1 / -1' }}>
            <MonthFilter
              selectedMonth={selectedMonth}
              onSelectMonth={setSelectedMonth}
            />
            <BudgetPanel
              categories={categories}
              budgets={budgets}
              expenses={monthFilteredExpenses}
              selectedMonth={selectedMonth}
              onSetBudget={handleSetBudget}
              onRemoveBudget={handleRemoveBudget}
              onAddCategory={handleAddCategory}
            />
          </section>
        )}

        {activeTab === 'history' && (
          <section style={{ gridColumn: '1 / -1' }}>
            <HistoryView
              expenses={expenses}
              categories={categories}
              initialMonth={selectedMonth}
              onEdit={(exp) => {
                setEditingExpense(exp);
                setActiveTab('home');
              }}
              onDelete={handleDeleteExpense}
            />
          </section>
        )}
      </main>

      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}