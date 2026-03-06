jsx
import React, { useState, useRef } from 'react';

export default function CajaControl() {
  const [movimientos, setMovimientos] = useState([
    { fecha: '2024-03-05', tipo: 'Ingreso', categoria: 'Ventas', descripcion: 'Venta de camisetas', monto: 250 },
    { fecha: '2024-03-05', tipo: 'Egreso', categoria: 'Compras', descripcion: 'Compra de tela', monto: 120 },
    { fecha: '2024-03-06', tipo: 'Ingreso', categoria: 'Servicios', descripcion: 'Servicio de reparación', monto: 400 },
    { fecha: '2024-03-06', tipo: 'Egreso', categoria: 'Utilities', descripcion: 'Pago de luz', monto: 85 },
    { fecha: '2024-03-07', tipo: 'Ingreso', categoria: 'Ventas', descripcion: 'Venta de pantalones', monto: 600 },
    { fecha: '2024-03-07', tipo: 'Egreso', categoria: 'Sueldos', descripcion: 'Pago de sueldo', monto: 1500 },
    { fecha: '2024-03-08', tipo: 'Ingreso', categoria: 'Ventas', descripcion: 'Venta mayorista', monto: 1200 },
    { fecha: '2024-03-08', tipo: 'Egreso', categoria: 'Alquiler', descripcion: 'Alquiler del local', monto: 1200 },
    { fecha: '2024-03-09', tipo: 'Ingreso', categoria: 'Servicios', descripcion: 'Consultoría', monto: 300 },
    { fecha: '2024-03-09', tipo: 'Egreso', categoria: 'Marketing', descripcion: 'Publicidad online', monto: 100 },
  ]);

  const [pestaña, setPestaña] = useState('dashboard');
  const fileInputRef = useRef(null);

  const handleImportarCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target.result;
        const lineas = csv.split('\n');
        const nuevosMovimientos = [];
        
        for (let i = 1; i < lineas.length; i++) {
          if (!lineas[i].trim()) continue;
          const valores = lineas[i].split(',');
          nuevosMovimientos.push({
            fecha: valores[0]?.trim() || '',
            tipo: valores[1]?.trim() || '',
            categoria: valores[2]?.trim() || '',
            descripcion: valores[3]?.trim() || '',
            monto: parseFloat(valores[4]) || 0,
          });
        }

        setMovimientos(nuevosMovimientos);
        alert(`✅ Importados ${nuevosMovimientos.length} movimientos`);
      } catch (error) {
        alert('❌ Error al importar CSV');
      }
    };
    reader.readAsText(file);
  };

  // Cálculos
  const totalIngresos = movimientos
    .filter(m => m.tipo === 'Ingreso')
    .reduce((sum, m) => sum + m.monto, 0);

  const totalEgresos = movimientos
    .filter(m => m.tipo === 'Egreso')
    .reduce((sum, m) => sum + m.monto, 0);

  const ganancia = totalIngresos - totalEgresos;
  const margen = totalIngresos > 0 ? ((ganancia / totalIngresos) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md border-b border-blue-500/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black text-white">📊 CajaControl</h1>
              <p className="text-blue-300 text-sm mt-1">Control de caja profesional</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg"
            >
              📥 Importar CSV
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleImportarCSV}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Pestañas */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-4 border-b border-blue-500/20 mb-8">
          <button
            onClick={() => setPestaña('dashboard')}
            className={`px-6 py-3 font-bold ${pestaña === 'dashboard' ? 'border-b-2 border-blue-500 text-blue-300' : 'text-gray-400'}`}
          >
            📈 Dashboard
          </button>
          <button
            onClick={() => setPestaña('transacciones')}
            className={`px-6 py-3 font-bold ${pestaña === 'transacciones' ? 'border-b-2 border-blue-500 text-blue-300' : 'text-gray-400'}`}
          >
            📋 Transacciones
          </button>
        </div>

        {/* Dashboard */}
        {pestaña === 'dashboard' && (
          <div className="space-y-8">
            {/* Tarjetas KPI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border border-emerald-500/30 rounded-xl p-6">
                <p className="text-emerald-300 text-sm font-bold">INGRESOS</p>
                <p className="text-3xl font-black text-emerald-300 mt-2">S/. {totalIngresos.toLocaleString('es-PE')}</p>
              </div>

              <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 border border-red-500/30 rounded-xl p-6">
                <p className="text-red-300 text-sm font-bold">EGRESOS</p>
                <p className="text-3xl font-black text-red-300 mt-2">S/. {totalEgresos.toLocaleString('es-PE')}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-xl p-6">
                <p className="text-blue-300 text-sm font-bold">GANANCIA NETA</p>
                <p className="text-3xl font-black text-blue-300 mt-2">S/. {ganancia.toLocaleString('es-PE')}</p>
                <p className="text-blue-400/60 text-xs mt-2">Margen: {margen}%</p>
              </div>
            </div>

            {/* Tabla de datos */}
            <div className="bg-black/30 border border-blue-500/20 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-blue-500/20 bg-blue-900/20">
                      <th className="text-left px-6 py-4 text-gray-300">Fecha</th>
                      <th className="text-left px-6 py-4 text-gray-300">Tipo</th>
                      <th className="text-left px-6 py-4 text-gray-300">Categoría</th>
                      <th className="text-left px-6 py-4 text-gray-300">Descripción</th>
                      <th className="text-right px-6 py-4 text-gray-300">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimientos.map((m, idx) => (
                      <tr key={idx} className="border-b border-blue-500/10 hover:bg-blue-900/20">
                        <td className="px-6 py-4 text-white">{m.fecha}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded text-xs font-bold ${
                            m.tipo === 'Ingreso' ? 'bg-emerald-900/40 text-emerald-300' : 'bg-red-900/40 text-red-300'
                          }`}>
                            {m.tipo}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{m.categoria}</td>
                        <td className="px-6 py-4 text-gray-300">{m.descripcion}</td>
                        <td className={`px-6 py-4 text-right font-bold ${m.tipo === 'Ingreso' ? 'text-emerald-300' : 'text-red-300'}`}>
                          {m.tipo === 'Ingreso' ? '+' : '-'} S/. {m.monto.toLocaleString('es-PE')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Transacciones */}
        {pestaña === 'transacciones' && (
          <div className="bg-black/30 border border-blue-500/20 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Todas las Transacciones</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-500/20">
                    <th className="text-left px-4 py-2 text-gray-300">Fecha</th>
                    <th className="text-left px-4 py-2 text-gray-300">Tipo</th>
                    <th className="text-left px-4 py-2 text-gray-300">Categoría</th>
                    <th className="text-left px-4 py-2 text-gray-300">Descripción</th>
                    <th className="text-right px-4 py-2 text-gray-300">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientos.map((m, idx) => (
                    <tr key={idx} className="border-b border-blue-500/10 hover:bg-blue-900/20">
                      <td className="px-4 py-3 text-white">{m.fecha}</td>
                      <td className="px-4 py-3 text-gray-300">{m.tipo}</td>
                      <td className="px-4 py-3 text-gray-300">{m.categoria}</td>
                      <td className="px-4 py-3 text-gray-300">{m.descripcion}</td>
                      <td className={`px-4 py-3 text-right font-bold ${m.tipo === 'Ingreso' ? 'text-emerald-300' : 'text-red-300'}`}>
                        {m.tipo === 'Ingreso' ? '+' : '-'} S/. {m.monto.toLocaleString('es-PE')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
