```javascript
import React, { useState, useRef } from 'react';
import { Plus, TrendingUp, TrendingDown, BarChart3, PieChart, Calendar, Trash2, Download, Upload, Eye, EyeOff } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as PieChartComponent, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ComposedChart } from 'recharts';

export default function CajaControlPro() {
  const [movimientos, setMovimientos] = useState([
    { fecha: '2024-02-28', tipo: 'Ingreso', categoria: 'Ventas', descripcion: 'Venta producto A', monto: 500, comprobante: 'Boleta', notas: '' },
    { fecha: '2024-02-28', tipo: 'Egreso', categoria: 'Compras', descripcion: 'Compra de stock', monto: 200, comprobante: 'Factura', notas: '' },
    { fecha: '2024-02-29', tipo: 'Ingreso', categoria: 'Ventas', descripcion: 'Venta producto B', monto: 750, comprobante: 'Boleta', notas: '' },
    { fecha: '2024-02-29', tipo: 'Egreso', categoria: 'Alquiler', descripcion: 'Alquiler local', monto: 1200, comprobante: 'Factura', notas: '' },
    { fecha: '2024-03-01', tipo: 'Ingreso', categoria: 'Servicios', descripcion: 'Servicio de consultoría', monto: 400, comprobante: 'Boleta', notas: '' },
    { fecha: '2024-03-02', tipo: 'Egreso', categoria: 'Utilities', descripcion: 'Luz y agua', monto: 150, comprobante: 'Recibo', notas: '' },
    { fecha: '2024-03-03', tipo: 'Ingreso', categoria: 'Ventas', descripcion: 'Venta producto C', monto: 600, comprobante: 'Boleta', notas: '' },
    { fecha: '2024-03-04', tipo: 'Egreso', categoria: 'Sueldos', descripcion: 'Pago de sueldo', monto: 1500, comprobante: 'Voucher', notas: '' },
    { fecha: '2024-03-05', tipo: 'Ingreso', categoria: 'Ventas', descripcion: 'Venta producto D', monto: 800, comprobante: 'Boleta', notas: '' },
    { fecha: '2024-03-05', tipo: 'Egreso', categoria: 'Marketing', descripcion: 'Publicidad online', monto: 100, comprobante: 'Digital', notas: '' },
  ]);

  const [pestaña, setPestaña] = useState('dashboard');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const fileInputRef = useRef(null);

  const handleImportarCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target.result;
        const lineas = csv.split('\n');
        const encabezados = lineas[0].split(',');

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
            comprobante: valores[5]?.trim() || '',
            notas: valores[6]?.trim() || '',
          });
        }

        setMovimientos(nuevosMovimientos);
        alert(`✅ Importados ${nuevosMovimientos.length} movimientos`);
      } catch (error) {
        alert('❌ Error al importar CSV. Verifica el formato.');
      }
    };
    reader.readAsText(file);
  };

  const datosFiltrados = movimientos.filter(m => {
    const cumpleCategoria = filtroCategoria === 'Todas' || m.categoria === filtroCategoria;
    const cumpleTipo = filtroTipo === 'Todos' || m.tipo === filtroTipo;
    return cumpleCategoria && cumpleTipo;
  });

  const totalIngresos = datosFiltrados
    .filter(m => m.tipo === 'Ingreso')
    .reduce((sum, m) => sum + m.monto, 0);

  const totalEgresos = datosFiltrados
    .filter(m => m.tipo === 'Egreso')
    .reduce((sum, m) => sum + m.monto, 0);

  const gananciaNetа = totalIngresos - totalEgresos;
  const margenGanancia = totalIngresos > 0 ? ((gananciaNetа / totalIngresos) * 100).toFixed(1) : 0;

  const datosLinea = [];
  const fechas = [...new Set(datosFiltrados.map(m => m.fecha))].sort();
  fechas.forEach(fecha => {
    const movsFecha = datosFiltrados.filter(m => m.fecha === fecha);
    const ingresos = movsFecha.filter(m => m.tipo === 'Ingreso').reduce((s, m) => s + m.monto, 0);
    const egresos = movsFecha.filter(m => m.tipo === 'Egreso').reduce((s, m) => s + m.monto, 0);
    datosLinea.push({ fecha: fecha.slice(-2), ingresos, egresos });
  });

  const categoriasIngreso = {};
  datosFiltrados
    .filter(m => m.tipo === 'Ingreso')
    .forEach(m => {
      categoriasIngreso[m.categoria] = (categoriasIngreso[m.categoria] || 0) + m.monto;
    });
  const datosPastel = Object.entries(categoriasIngreso).map(([name, value]) => ({
    name,
    value,
    fill: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'][
      Object.keys(categoriasIngreso).indexOf(name)
    ],
  }));

  const categoriasGasto = {};
  datosFiltrados
    .filter(m => m.tipo === 'Egreso')
    .forEach(m => {
      categoriasGasto[m.categoria] = (categoriasGasto[m.categoria] || 0) + m.monto;
    });
  const datosGastosPorCategoria = Object.entries(categoriasGasto)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  let acumulado = 0;
  const datosAcumulado = datosFiltrados
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .map(m => {
      const cambio = m.tipo === 'Ingreso' ? m.monto : -m.monto;
      acumulado += cambio;
      return {
        fecha: m.fecha.slice(-5),
        descripcion: m.descripcion,
        acumulado,
      };
    });

  const top10 = [...datosFiltrados]
    .sort((a, b) => b.monto - a.monto)
    .slice(0, 10);

  const promedioDiarioIngreso = (totalIngresos / (fechas.length || 1)).toFixed(0);
  const promedioDiarioEgreso = (totalEgresos / (fechas.length || 1)).toFixed(0);

  const ingresosPorTipo = {};
  datosFiltrados.forEach(m => {
    if (m.tipo === 'Ingreso') {
      ingresosPorTipo[m.categoria] = (ingresosPorTipo[m.categoria] || 0) + m.monto;
    }
  });
  const mejorCategoria = Object.entries(ingresosPorTipo).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-black/50 backdrop-blur-md border-b border-blue-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-black text-white">📊 CajaControl PRO</h1>
              <p className="text-blue-300 text-sm mt-1">Analytics Avanzado para tu Negocio</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
            >
              <Upload className="w-4 h-4" />
              Importar CSV
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleImportarCSV}
              className="hidden"
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="bg-slate-700/50 border border-blue-500/30 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Todos</option>
              <option>Ingreso</option>
              <option>Egreso</option>
            </select>

            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="bg-slate-700/50 border border-blue-500/30 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Todas</option>
              {[...new Set(movimientos.map(m => m.categoria))].map(cat => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex gap-4 border-b border-blue-500/20 overflow-x-auto pb-2">
          {[
            { id: 'dashboard', label: '📈 Dashboard' },
            { id: 'graficos', label: '📊 Gráficos Avanzados' },
            { id: 'transacciones', label: '📋 Historial' },
            { id: 'analisis', label: '🔍 Análisis' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setPestaña(tab.id)}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all whitespace-nowrap ${
                pestaña === tab.id
                  ? 'border-blue-500 text-blue-300'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {pestaña === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border border-emerald-500/30 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-emerald-300 font-bold text-xs">INGRESOS</span>
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-3xl font-black text-emerald-300">S/. {totalIngresos.toLocaleString('es-PE')}</p>
                <p className="text-emerald-400/60 text-xs mt-2">Promedio: S/. {promedioDiarioIngreso}/día</p>
              </div>

              <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-red-300 font-bold text-xs">EGRESOS</span>
                  <TrendingDown className="w-5 h-5 text-red-400" />
                </div>
                <p className="text-3xl font-black text-red-300">S/. {totalEgresos.toLocaleString('es-PE')}</p>
                <p className="text-red-400/60 text-xs mt-2">Promedio: S/. {promedioDiarioEgreso}/día</p>
              </div>

              <div className={`bg-gradient-to-br ${gananciaNetа >= 0 ? 'from-blue-900/40 to-blue-800/20 border border-blue-500/30' : 'from-orange-900/40 to-orange-800/20 border border-orange-500/30'} rounded-xl p-6 backdrop-blur-sm`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`${gananciaNetа >= 0 ? 'text-blue-300' : 'text-orange-300'} font-bold text-xs`}>GANANCIA NETA</span>
                  <BarChart3 className={`w-5 h-5 ${gananciaNetа >= 0 ? 'text-blue-400' : 'text-orange-400'}`} />
                </div>
                <p className={`text-3xl font-black ${gananciaNetа >= 0 ? 'text-blue-300' : 'text-orange-300'}`}>
                  S/. {gananciaNetа.toLocaleString('es-PE')}
                </p>
                <p className={`${gananciaNetа >= 0 ? 'text-blue-400/60' : 'text-orange-400/60'} text-xs mt-2`}>
                  Margen: {margenGanancia}%
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-purple-300 font-bold text-xs">MEJOR CATEGORÍA</span>
                  <PieChart className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-2xl font-black text-purple-300">{mejorCategoria?.[0] || '-'}</p>
                <p className="text-purple-400/60 text-xs mt-2">S/. {(mejorCategoria?.[1] || 0).toLocaleString('es-PE')}</p>
              </div>
            </div>

            <div className="bg-black/30 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Ingresos vs Egresos Diarios
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={datosLinea}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
                  <XAxis stroke="rgba(59, 130, 246, 0.5)" />
                  <YAxis stroke="rgba(59, 130, 246, 0.5)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #3b82f6' }}
                    formatter={(value) => `S/. ${value.toLocaleString('es-PE')}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
                  <Line type="monotone" dataKey="egresos" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-black/30 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-blue-400" />
                  Ingresos por Categoría
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChartComponent>
                    <Pie data={datosPastel} cx="50%" cy="50%" labelLine={false} label={{ fill: '#fff', fontSize: 12 }} outerRadius={90} dataKey="value">
                      {datosPastel.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `S/. ${value.toLocaleString('es-PE')}`} />
                  </PieChartComponent>
                </ResponsiveContainer>
              </div>

              <div className="bg-black/30 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Gastos por Categoría
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={datosGastosPorCategoria}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
                    <XAxis stroke="rgba(59, 130, 246, 0.5)" dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="rgba(59, 130, 246, 0.5)" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #3b82f6' }} formatter={(value) => `S/. ${value.toLocaleString('es-PE')}`} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {pestaña === 'graficos' && (
          <div className="space-y-8">
            <div className="bg-black/30 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Flujo de Caja Acumulado
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={datosAcumulado}>
                  <defs>
                    <linearGradient id="colorAcumulado" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
                  <XAxis stroke="rgba(59, 130, 246, 0.5)" dataKey="fecha" />
                  <YAxis stroke="rgba(59, 130, 246, 0.5)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #3b82f6' }}
                    formatter={(value) => `S/. ${value.toLocaleString('es-PE')}`}
                  />
                  <Area type="monotone" dataKey="acumulado" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAcumulado)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-black/30 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold mb-4">Comparativa Diaria Detallada</h3>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={datosLinea}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
                  <XAxis stroke="rgba(59, 130, 246, 0.5)" dataKey="fecha" />
                  <YAxis stroke="rgba(59, 130, 246, 0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #3b82f6' }} />
                  <Legend />
                  <Bar dataKey="ingresos" fill="#10b981" opacity={0.8} />
                  <Bar dataKey="egresos" fill="#ef4444" opacity={0.8} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-black/30 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold mb-4">Top 10 Transacciones</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-blue-500/20">
                      <th className="text-left px-4 py-2 text-gray-300">Descripción</th>
                      <th className="text-center px-4 py-2 text-gray-300">Tipo</th>
                      <th className="text-right px-4 py-2 text-gray-300">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {top10.map((m, idx) => (
                      <tr key={idx} className="border-b border-blue-500/10 hover:bg-blue-900/20">
                        <td className="px-4 py-3 text-gray-300">{m.descripcion}</td>
                        <td className="text-center px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            m.tipo === 'Ingreso' ? 'bg-emerald-900/40 text-emerald-300' : 'bg-red-900/40 text-red-300'
                          }`}>
                            {m.tipo}
                          </span>
                        </td>
                        <td className={`text-right px-4 py-3 font-bold ${m.tipo === 'Ingreso' ? 'text-emerald-300' : 'text-red-300'}`}>
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

        {pestaña === 'transacciones' && (
          <div className="bg-black/30 border border-blue-500/20 rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-500/20 bg-blue-900/20">
                    <th className="text-left px-6 py-4 font-semibold text-gray-300">Fecha</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-300">Tipo</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-300">Categoría</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-300">Descripción</th>
                    <th className="text-right px-6 py-4 font-semibold text-gray-300">Monto</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-300">Comprobante</th>
                  </tr>
                </thead>
                <tbody>
                  {datosFiltrados.map((m, idx) => (
                    <tr key={idx} className={`border-b border-blue-500/10 ${idx % 2 === 0 ? 'bg-blue-900/5' : ''} hover:bg-blue-900/20`}>
                      <td className="px-6 py-4 text-white">{m.fecha}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
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
                      <td className="px-6 py-4 text-gray-300 text-xs">{m.comprobante}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {pestaña === 'analisis' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-blue-300 font-bold mb-2">📊 Índice de Salud Financiera</h3>
                <p className="text-3xl font-black text-blue-200 mb-2">{margenGanancia}%</p>
                <p className="text-gray-400 text-sm">
                  {margenGanancia > 30 ? '✅ Excelente margen' : margenGanancia > 15 ? '✓ Margen saludable' : '⚠️ Revisar gastos'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-purple-300 font-bold mb-2">📈 Transacciones Totales</h3>
                <p className="text-3xl font-black text-purple-200 mb-2">{datosFiltrados.length}</p>
                <p className="text-gray-400 text-sm">
                  {datosFiltrados.filter(m => m.tipo === 'Ingreso').length} ingresos, {datosFiltrados.filter(m => m.tipo === 'Egreso').length} egresos
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-green-300 font-bold mb-2">💡 Promedio Diario</h3>
                <p className="text-3xl font-black text-green-200 mb-2">S/. {promedioDiarioIngreso}</p>
                <p className="text-gray-400 text-sm">Ingreso promedio por día</p>
              </div>

              <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 border border-orange-500/30 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-orange-300 font-bold mb-2">🎯 Ratio Ingreso/Egreso</h3>
                <p className="text-3xl font-black text-orange-200 mb-2">{(totalIngresos / (totalEgresos || 1)).toFixed(2)}x</p>
                <p className="text-gray-400 text-sm">
                  {(totalIngresos / (totalEgresos || 1)) > 2 ? 'Muy saludable' : 'Necesita análisis'}
                </p>
              </div>
            </div>

            <div className="bg-black/30 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold mb-4">💡 Recomendaciones Inteligentes</h3>
              <ul className="space-y-3">
                {margenGanancia < 20 && (
                  <li className="flex items-start gap-3 text-gray-300">
                    <span className="text-orange-400 font-bold">⚠️</span>
                    <span>Tu margen de ganancia es bajo ({margenGanancia}%). Revisa si puedes reducir gastos operativos.</span>
                  </li>
                )}
                {totalEgresos > totalIngresos * 0.6 && (
                  <li className="flex items-start gap-3 text-gray-300">
                    <span className="text-orange-400 font-bold">⚠️</span>
                    <span>Tus gastos representan {((totalEgresos / totalIngresos) * 100).toFixed(1)}% de ingresos. Considera optimizar.</span>
                  </li>
                )}
                {mejorCategoria && (
                  <li className="flex items-start gap-3 text-gray-300">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>{mejorCategoria[0]} es tu mejor categoría (S/. {mejorCategoria[1].toLocaleString('es-PE')}). Potencia este producto/servicio.</span>
                  </li>
                )}
                <li className="flex items-start gap-3 text-gray-300">
                  <span className="text-blue-400 font-bold">ℹ️</span>
                  <span>Registra continuamente para obtener patrones más precisos. Mínimo 30 días de datos.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```
