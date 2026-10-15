import React, { useState } from 'react';
import styles from './CategoryManager.module.scss';

export default function CategoryManager({ categories, onAddCategory }) {
  const [newCat, setNewCat] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newCat.trim()) {
      onAddCategory(newCat.trim());
      setNewCat('');
    }
  };

  return (
    <div className={styles.card}>
      <h3>Nueva Categoría</h3>
      <form onSubmit={handleAdd} className={styles.row}>
        <input 
          type="text" 
          placeholder="Ej. Mascotas" 
          value={newCat} 
          onChange={(e) => setNewCat(e.target.value)} 
        />
        <button type="submit">Añadir</button>
      </form>
    </div>
  );
}