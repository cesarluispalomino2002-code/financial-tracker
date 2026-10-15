import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import styles from './ExpenseList.module.scss';

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className={styles.listCard}>
        <h3>Historial</h3>
        <p className={styles.empty}>No hay registros guardados.</p>
      </div>
    );
  }

  return (
    <div className={styles.listCard}>
      <h3>Historial Reciente</h3>
      <div className={styles.list}>
        {expenses.map((expense) => (
          <div key={expense.id} className={styles.item}>
            <div className={styles.info}>
              <span className={styles.reason}>{expense.reason}</span>
              <div className={styles.subInfo}>
                <span className={styles.category}>{expense.category}</span>
                <span>•</span>
                <span className={styles.date}>{expense.date}</span>
              </div>
            </div>

            <div className={styles.right}>
              <span className={styles.amount}>-${Number(expense.amount).toFixed(2)}</span>
              <div className={styles.actions}>
                <button onClick={() => onEdit(expense)} title="Editar">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => onDelete(expense.id)} title="Eliminar" className={styles.deleteBtn}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}