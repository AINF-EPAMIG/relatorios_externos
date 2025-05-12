'use client'

import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, Cell, Line, LabelList } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

interface ComparativoAnual {
  ano: number
  total_contratos: number
  valor_total: number
}

interface ComparativoAnualEmpresa {
  ano: number
  valor_total: number
}

export function ComparativoAnual() {
  const [dados, setDados] = useState<ComparativoAnual[]>([])
  const [empresa, setEmpresa] = useState<ComparativoAnualEmpresa[]>([])
  const [anosExibidos, setAnosExibidos] = useState(0);

  useEffect(() => {
    fetch('/api/contratos/relatorio/comparativo-anual')
      .then(res => res.json())
      .then(setDados)
      .catch(console.error);
    fetch('/api/contratos/relatorio/comparativo-anual-empresa')
      .then(res => res.json())
      .then(setEmpresa)
      .catch(console.error);
  }, [anosExibidos]); // Added 'anosExibidos' to dependency array

  const formatarMoeda = (valor: number) =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Garante que todos os valores estejam como número
  const dadosFormatados = dados.map(d => ({
    ...d,
    valor_total: Number(d.valor_total) || 0,
  }));

  // Calcula evolução percentual ano a ano
  const dadosComEvolucao = dadosFormatados.map((item, idx, arr) => {
    if (idx === 0) return { ...item, evolucao: null };
    const anterior = arr[idx - 1].valor_total;
    const evolucao = anterior ? ((item.valor_total - anterior) / anterior) * 100 : null;
    return { ...item, evolucao };
  });

  // Ordena os dados por ano crescente antes de filtrar
  const dadosOrdenados = [...dadosComEvolucao].sort((a, b) => a.ano - b.ano);
  // Filtra apenas anos até o ano atual
  const anoAtual = new Date().getFullYear();
  const dadosValidos = dadosOrdenados.filter(d => d.ano <= anoAtual);

  // Atualiza o filtro para 'Todos' apenas no carregamento inicial
  useEffect(() => {
    if (dadosValidos.length > 0 && anosExibidos === 0) setAnosExibidos(dadosValidos.length);
  }, [dadosValidos.length, anosExibidos]); // Added 'anosExibidos' to dependency array

  // Limita anosExibidos ao máximo disponível
  const anosParaExibir = Math.min(anosExibidos, dadosValidos.length);

  // Corrigir: pegar os N anos passados mais recentes
  const dadosRecentes = [...dadosValidos].sort((a, b) => b.ano - a.ano).slice(0, anosParaExibir);
  const dadosFiltrados = [...dadosRecentes].sort((a, b) => a.ano - b.ano);

  // Unir dados do setor e da empresa por ano
  const dadosComEmpresa = dadosFiltrados.map(item => {
    const empresaAno = empresa.find(e => e.ano === item.ano)
    return {
      ...item,
      valor_total_empresa: empresaAno ? Number(empresaAno.valor_total) : 0
    }
  })

  // Totalizadores para AINF e EPAMIG
  const totalAinf = dadosComEmpresa.reduce((acc, item) => acc + (item.valor_total || 0), 0);
  const totalEpamig = dadosComEmpresa.reduce((acc, item) => acc + (item.valor_total_empresa || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#3A8144] flex items-center gap-2">
          <TrendingUp size={20} /> Comparativo Anual de Contratos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          <div className="w-48 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
            <select
              className="w-full rounded border-2 border-blue-500 text-sm px-3 py-2 appearance-none bg-white cursor-pointer font-semibold shadow"
              value={anosExibidos}
              onChange={e => setAnosExibidos(Number(e.target.value))}
            >
              <option value={3}>Últimos 3 anos</option>
              <option value={5}>Últimos 5 anos</option>
              <option value={10}>Últimos 10 anos</option>
              <option value={dadosValidos.length}>Todos</option>
            </select>
            <span className="absolute right-3 top-9 -translate-y-1/2 pointer-events-none text-blue-500">▼</span>
          </div>
          {/* Gráfico */}
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={dadosComEmpresa} barCategoryGap="40%" barGap={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="ano"
                  tick={({ x, y, payload }) => (
                    <text
                      x={x}
                      y={y + 10}
                      textAnchor="middle"
                      fontWeight={payload.value === anoAtual ? 'bold' : 'normal'}
                      fontSize={payload.value === anoAtual ? 16 : 14}
                      fill={payload.value === anoAtual ? '#3A8144' : '#222'}
                    >
                      {payload.value}{payload.value === anoAtual && ' ★'}
                    </text>
                  )}
                  interval={0}
                  height={30}
                />
                <YAxis tickFormatter={formatarMoeda} tick={{ fontSize: 12, fill: '#4B5563' }} axisLine={{ stroke: '#E5E7EB' }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload.length) return null;
                    const setor = payload.find(p => p.dataKey === 'valor_total');
                    const empresa = payload.find(p => p.dataKey === 'valor_total_empresa');
                    const perc = setor && empresa && typeof setor.value === 'number' && typeof empresa.value === 'number' && empresa.value !== 0
                      ? (setor.value / empresa.value) * 100
                      : null;
                    return (
                      <div className="bg-white p-3 rounded shadow text-sm">
                        <div className="font-bold mb-1">Ano: {label}</div>
                        <div><span className="text-[#2563EB] font-semibold">AINF:</span> {setor && typeof setor.value === 'number' ? formatarMoeda(setor.value) : '-'}</div>
                        <div><span className="text-[#3A8144] font-semibold">EPAMIG:</span> {empresa && typeof empresa.value === 'number' ? formatarMoeda(empresa.value) : '-'}</div>
                        {perc !== null && <div className="mt-1">AINF/EPAMIG: <span className="font-bold">{perc.toFixed(1)}%</span></div>}
                      </div>
                    );
                  }}
                />
                <Legend verticalAlign="top" align="center" wrapperStyle={{ marginBottom: 12 }} />
                <Bar dataKey="valor_total" name="AINF" radius={6} minPointSize={8} barSize={36}>
                  {dadosComEmpresa.map((_, idx) => (
                    <Cell key={idx} fill="#111827" />
                  ))}
                  <LabelList dataKey="valor_total" position="top" formatter={(v: number) => formatarMoeda(Number(v))} style={{ fontSize: 11, fontWeight: 600 }} />
                </Bar>
                <Bar dataKey="valor_total_empresa" name="EPAMIG" fill="#3A8144" radius={6} barSize={36}>
                  <LabelList dataKey="valor_total_empresa" position="top" formatter={(v: number) => formatarMoeda(Number(v))} style={{ fontSize: 11, fontWeight: 600 }} />
                </Bar>
                <Line type="monotone" dataKey="valor_total" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} name="Setor (linha)" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center mt-2">
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1"><span className="w-4 h-4 inline-block rounded bg-[#111827]" /> AINF</span>
                <span className="inline-flex items-center gap-1"><span className="w-4 h-4 inline-block rounded bg-[#3A8144]" /> EPAMIG</span>
                <span className="inline-flex items-center gap-1"><span className="w-4 h-1 inline-block rounded bg-[#2563EB]" /> AINF (linha)</span>
              </div>
            </div>
          </div>
        </div>
        {/* Tabela abaixo do gráfico, horizontal */}
        <div className="w-full flex justify-center mt-8">
          <div className="w-full max-w-4xl bg-gray-50 rounded-xl shadow p-4 overflow-x-auto">
            <h3 className="text-lg font-bold mb-4 text-[#3A8144]">Ano / AINF / EPAMIG</h3>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 font-bold">Ano</th>
                  <th className="py-2 px-4 font-bold text-[#2563EB]">AINF</th>
                  <th className="py-2 px-4 font-bold text-[#3A8144]">EPAMIG</th>
                  <th className="py-2 px-4 font-bold">% AINF/EPAMIG</th>
                  <th className="py-2 px-4 font-bold">Evolução</th>
                </tr>
              </thead>
              <tbody>
                {dadosComEmpresa.map((item, idx, arr) => {
                  const perc = item.valor_total_empresa ? (item.valor_total / item.valor_total_empresa) * 100 : null;
                  const evol = idx > 0 ? ((item.valor_total - arr[idx-1].valor_total) / arr[idx-1].valor_total) * 100 : null;
                  return (
                    <tr key={item.ano} className={`border-b last:border-0 ${item.ano === anoAtual ? 'bg-green-50 font-bold' : ''}`}>
                      <td className="py-2 px-4">{item.ano}{item.ano === anoAtual && <span className="ml-1 text-[#3A8144]">★</span>}</td>
                      <td className="py-2 px-4 text-[#2563EB]">{formatarMoeda(item.valor_total)}</td>
                      <td className="py-2 px-4 text-[#3A8144]">{formatarMoeda(item.valor_total_empresa)}</td>
                      <td className="py-2 px-4">{perc !== null ? perc.toFixed(1) + '%' : '-'}</td>
                      <td className="py-2 px-4">
                        {evol !== null && (
                          <span className={`inline-flex items-center gap-1 ${evol > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {evol > 0 ? '▲' : '▼'} {Math.abs(evol).toFixed(1)}%
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {/* Linha de totalizador */}
                <tr className="border-t-2 border-[#3A8144] bg-gray-100 font-bold">
                  <td className="py-2 px-4">Total</td>
                  <td className="py-2 px-4 text-[#2563EB]">{formatarMoeda(totalAinf)}</td>
                  <td className="py-2 px-4 text-[#3A8144]">{formatarMoeda(totalEpamig)}</td>
                  <td className="py-2 px-4">-</td>
                  <td className="py-2 px-4">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
