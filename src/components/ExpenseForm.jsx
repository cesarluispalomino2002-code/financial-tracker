import React, { useState, useEffect } from 'react';
import styles from './ExpenseForm.module.scss';

export default function ExpenseForm({ categories, onSave, editingExpense, onCancelEdit }) {
  const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // Devuelve YYYY-MM-DD en hora local
};

  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [category, setCategory] = useState(categories[0] || '');
  const [date, setDate] = useState(getTodayString());

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount);
      setReason(editingExpense.reason);
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
    } else {
      setAmount('');
      setReason('');
      setCategory(categories[0] || '');
      setDate(getTodayString());
    }
  }, [editingExpense, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !reason) return;

    onSave({
      amount: parseFloat(amount),
      reason,
      category,
      date,
    });

    if (!editingExpense) {
      setAmount('');
      setReason('');
    }
  };

  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>
      <h3>{editingExpense ? 'Editar Gasto' : 'Registrar Nuevo Gasto'}</h3>

      <div className={styles.inputGroup}>
        <label>Monto ($)</label>
        <input 
          type="number" 
          step="0.01" 
          placeholder="0.00" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          required 
        />
      </div>

      <div className={styles.inputGroup}>
        <label>Motivo / Descripción</label>
        <input 
          type="text" 
          placeholder="Ej. Almuerzo de trabajo" 
          value={reason} 
          onChange={(e) => setReason(e.target.value)} 
          required 
        />
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label>Categoría</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>Fecha</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.btnPrimary}>
          {editingExpense ? 'Actualizar' : 'Guardar Gasto'}
        </button>
        {editingExpense && (
          <button type="button" className={styles.btnSecondary} onClick={onCancelEdit}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}