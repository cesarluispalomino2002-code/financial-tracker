import React, { useRef } from 'react';

export default function DataBackup({ expenses, setExpenses }) {
  const fileInputRef = useRef(null);

  // 📤 Función para exportar los gastos a un archivo CSV
  const handleExportCSV = () => {
    if (expenses.length === 0) {
      alert('No hay gastos registrados para exportar.');
      return;
    }

    // Cabeceras del CSV
    const headers = ['ID', 'Concepto/Titulo', 'Monto (S/.)', 'Categoría', 'Fecha'];
    
    // Mapear los gastos a filas de texto
    const rows = expenses.map(e => [
      e.id,
      `"${(e.title || e.description || 'Gasto').replace(/"/g, '""')}"`, // Sanitizar comillas
      e.amount,
      `"${(e.category || 'General').replace(/"/g, '""')}"`,
      e.date
    ]);

    // Unir todo con comas y saltos de línea
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Crear un archivo virtual descargable
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mis_gastos_finanzas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 📥 Función para importar los gastos desde un archivo CSV
  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n');
        
        // Validar que tenga contenido mínimo (cabecera + al menos 1 fila)
        if (lines.length < 2) {
          alert('El archivo CSV está vacío o no tiene el formato correcto.');
          return;
        }

        const importedExpenses = [];

        // Empezamos desde i = 1 para saltarnos la cabecera
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // Parseo básico de CSV manejando comas dentro de comillas
          const row = [];
          let insideQuotes = false;
          let entry = '';
          
          for (let char of line) {
            if (char === '"') {
              insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
              row.push(entry);
              entry = '';
            } else {
              entry += char;
            }
          }
          row.push(entry);

          if (row.length >= 5) {
            importedExpenses.push({
              id: row[0] || crypto.randomUUID(),
              title: row[1]?.replace(/^"|"$/g, '') || 'Gasto importado',
              amount: parseFloat(row[2]) || 0,
              category: row[3]?.replace(/^"|"$/g, '') || 'General',
              date: row[4] || new Date().toISOString().slice(0, 10)
            });
          }
        }

        if (importedExpenses.length > 0) {
          // Combinar con los existentes o reemplazar (aquí los unimos evitando duplicados por ID si deseas, o los agregamos)
          setExpenses(prev => {
            const existingIds = new Set(prev.map(item => item.id));
            const newItems = importedExpenses.filter(item => !existingIds.has(item.id));
            return [...newItems, ...prev];
          });
          alert(`¡Se importaron ${importedExpenses.length} gastos correctamente!`);
        } else {
          alert('No se pudieron leer registros válidos en el archivo.');
        }
      } catch (error) {
        console.error(error);
        alert('Hubo un error al procesar el archivo CSV.');
      }

      // Limpiar input para permitir reimportar el mismo archivo si es necesario
      e.target.value = '';
    };

    reader.readAsText(file);
  };

  return (
    <div style={{ display: 'flex', gap: '10px', margin: '1rem 0', flexWrap: 'wrap' }}>
      <button
        onClick={handleExportCSV}
        style={{
          padding: '8px 14px',
          borderRadius: '8px',
          backgroundColor: '#059669',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontWeight: '500',
          fontSize: '0.85rem'
        }}
      >
        📥 Exportar CSV
      </button>

      <button
        onClick={() => fileInputRef.current.click()}
        style={{
          padding: '8px 14px',
          borderRadius: '8px',
          backgroundColor: '#2563eb',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontWeight: '500',
          fontSize: '0.85rem'
        }}
      >
        📤 Importar CSV
      </button>

      {/* Input oculto para cargar archivos */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportCSV}
        accept=".csv"
        style={{ display: 'none' }}
      />
    </div>
  );
}