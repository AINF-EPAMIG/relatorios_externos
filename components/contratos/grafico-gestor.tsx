'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, LabelList, Cell, ReferenceLine
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import { Dialog } from '@headlessui/react'

interface DadoGestor {
  gestor_idh: number
  gestor: string
  total_contratos: number
  valor_total: number
}

interface ContratoGestor {
  id: number
  parte: string
  objeto: string
  valor: number
  data_inicio: string
  data_fim: string
}

export function GraficoGestor() {
  const [loadingContratos, setLoadingContratos] = useState(false);
  const [dados, setDados] = useState<DadoGestor[]>([])
  const [gestorSelecionado, setGestorSelecionado] = useState<number | null>(null);
  const [contratosGestor, setContratosGestor] = useState<ContratoGestor[]>([]);
  const [pagina, setPagina] = useState(1);
  const contratosPorPagina = 10;
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    fetch('/api/contratos/relatorio/gestor')
      .then(res => res.json())
      .then(setDados)
      .catch(console.error)
  }, [])

  // Paleta de cores vivas (sem verde)
  const coresVivas = [
    '#FF5733', // laranja
    '#2980FF', // azul
    '#F333FF', // rosa
    '#FFC300', // amarelo
    '#FF33A8', // magenta
    '#33FFF3', // ciano
    '#FF8C00', // laranja escuro
    '#8D33FF', // roxo
    '#FF3333', // vermelho
  ];

  // Calcule os totais antes do return
  const totalContratos = dados.reduce((acc, curr) => acc + Number(curr.total_contratos), 0);
  const totalValor = dados.reduce((acc, curr) => acc + Number(curr.valor_total), 0);
  const mediaValor = dados.length > 0 ? totalValor / dados.length : 0;

  // Percentual do total para cada gestor
  const dadosComPercentual = dados.map(d => ({
    ...d,
    percentual: totalContratos > 0 ? (d.total_contratos / totalContratos) * 100 : 0
  }));

  // Estado para ordenação da tabela
  const [ordem, setOrdem] = useState<'gestor' | 'total_contratos' | 'valor_total' | 'percentual'>('total_contratos');
  const [ordemCrescente, setOrdemCrescente] = useState(false);
  const dadosOrdenados = [...dadosComPercentual].sort((a, b) => {
    if (ordem === 'gestor') return ordemCrescente ? a.gestor.localeCompare(b.gestor) : b.gestor.localeCompare(a.gestor);
    if (ordem === 'total_contratos') return ordemCrescente ? a.total_contratos - b.total_contratos : b.total_contratos - a.total_contratos;
    if (ordem === 'valor_total') return ordemCrescente ? a.valor_total - b.valor_total : b.valor_total - a.valor_total;
    if (ordem === 'percentual') return ordemCrescente ? a.percentual - b.percentual : b.percentual - a.percentual;
    return 0;
  });

  // gestorDetalhe deve vir de dadosComPercentual para ter o campo percentual
  const gestorDetalhe = useMemo(() =>
    dadosComPercentual.find(g => Number(g.gestor_idh) === Number(gestorSelecionado)),
    [gestorSelecionado, dadosComPercentual]
  );
  
  const formatadorBRL = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Tooltip customizado para exibir nome, quantidade, valor e percentual
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white border rounded-lg shadow-lg">
          <p className="font-semibold text-[#3A8144]">{label}</p>
          <p className="text-sm">
            Quantidade: <span className="font-medium">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Função para abreviar nomes para o eixo X
  function abreviaNome(nome: string) {
    const partes = nome.split(' ');
    if (partes.length === 1) return nome;
    return `${partes[0]} ${partes[partes.length - 1]}`;
  }

  // Responsividade: gráfico horizontal se poucos pixels
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 700;

  // Rotacionar nomes se muitos gestores
  const xAxisProps = dados.length > 6
    ? { angle: -25, textAnchor: 'end', height: 60 }
    : { angle: 0, textAnchor: 'middle', height: 30 };

  // Carregar contratos do gestor selecionado (lazy loading)
  useEffect(() => {
    if (gestorSelecionado === null || typeof gestorSelecionado !== 'number') return;
  
    setLoadingContratos(true);
  
    fetch(`/api/contratos/relatorio/por-gestor?gestor_idh=${gestorSelecionado}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const contratos = data.map((d: { id: number; parte: string; objeto: string; valor: number; data_inicio: string; data_fim: string }) => ({
            id: d.id,
            parte: d.parte,
            objeto: d.objeto,
            valor: d.valor,
            data_inicio: d.data_inicio,
            data_fim: d.data_fim
          }));
          setContratosGestor(contratos);
          setModalAberto(true);
        } else {
          console.warn('API retornou um formato inválido:', data);
          setContratosGestor([]);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingContratos(false));
  }, [gestorSelecionado]);
  
  
  
  
  
  

  // Resetar página para 1 sempre que contratosGestor mudar
  useEffect(() => {
    setPagina(1);
  }, [contratosGestor]);

  const contratosPaginados = useMemo(() => {
    return Array.isArray(contratosGestor)
      ? contratosGestor.slice((pagina - 1) * contratosPorPagina, pagina * contratosPorPagina)
      : [];
  }, [contratosGestor, pagina]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#3A8144] text-lg flex items-center gap-2">
            <TrendingUp size={18} /> Contratos por Gestor
          </CardTitle>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#27AE60]" />
              <span className="text-gray-600">Valor Total</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#8E44AD]" />
              <span className="text-gray-600">Quantidade</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resumo */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total de Contratos</p>
              <p className="text-2xl font-semibold text-[#8E44AD]">
                {totalContratos.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Valor Total</p>
              <p className="text-2xl font-semibold text-[#27AE60]">
                R$ {totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Média por Gestor</p>
              <p className="text-2xl font-semibold text-[#3A8144]">
                R$ {mediaValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Gráfico Principal */}
          <div className="lg:col-span-2 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              {isMobile ? (
                <BarChart
                  layout="vertical"
                  data={dadosComPercentual}
                  margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <YAxis
                    dataKey="gestor"
                    type="category"
                    tick={{ fontWeight: 'bold', fontSize: 13, fill: '#222' }}
                  />
                  <XAxis
                    type="number"
                    tickFormatter={value => `R$ ${(value / 1000).toLocaleString('pt-BR')}k`}
                    tick={{ fontSize: 12, fill: '#4B5563' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine x={mediaValor} stroke="#3A8144" strokeDasharray="3 3" label={{ value: 'Média', position: 'top', fill: '#3A8144', fontWeight: 700 }} />
                  <Bar
                    dataKey="valor_total"
                    radius={[4, 4, 4, 4]}
                    maxBarSize={40}
                  >
                    {dadosComPercentual.map((_, idx) => (
                      <Cell key={idx} fill={coresVivas[idx % coresVivas.length]} />
                    ))}
                    <LabelList
                      dataKey="total_contratos"
                      position="center"
                      fill="#fff"
                      style={{ fontSize: 13, fontWeight: 700 }}
                      formatter={(v: number) => v ? Number(v).toLocaleString('pt-BR') : '0'}
                    />
                  </Bar>
                </BarChart>
              ) : (
                <BarChart
                  data={dadosComPercentual}
                  margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis
                    dataKey="gestor"
                    interval={0}
                    tick={{ fontWeight: 'bold', fontSize: 13, fill: '#222' }}
                    tickFormatter={abreviaNome}
                    {...xAxisProps}
                  />
                  <YAxis
                    tickFormatter={value => `R$ ${(value / 1000).toLocaleString('pt-BR')}k`}
                    tick={{ fontSize: 12, fill: '#4B5563' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={mediaValor} stroke="#3A8144" strokeDasharray="3 3" label={{ value: 'Média', position: 'right', fill: '#3A8144', fontWeight: 700 }} />
                  <Bar
                    dataKey="valor_total"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  >
                    {dadosComPercentual.map((g, idx) => (
                      <Cell
                        key={idx}
                        fill={coresVivas[idx % coresVivas.length]}
                        aria-label={`Barra do gestor ${g.gestor}`}
                        tabIndex={0}
                        onClick={() => {
                          if (g?.gestor_idh) {
                            setGestorSelecionado(g.gestor_idh);
                            setModalAberto(true); // ← você esqueceu de abrir o modal aqui
                            setPagina(1);
                          } else {
                            console.warn('gestor_idh ausente:', g);
                          }
                        }}
                        
                        onKeyDown={e => { if (e.key === 'Enter') { setGestorSelecionado(g.gestor_idh); setModalAberto(true); setPagina(1); } }}
                      />
                    ))}
                    <LabelList
                      dataKey="total_contratos"
                      position="center"
                      fill="#fff"
                      style={{ fontSize: 13, fontWeight: 700 }}
                      formatter={(v: number) => v ? Number(v).toLocaleString('pt-BR') : '0'}
                    />
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Tabela Resumida */}
          <div className="lg:col-span-1 mt-6">
  <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
    <h3 className="text-base font-bold text-[#3A8144] mb-4">Resumo por Gestor</h3>
    <table className="w-full text-xs">
      <thead className="text-gray-600 border-b border-gray-200">
        <tr>
          <th
            className="py-2 cursor-pointer text-left hover:text-[#3A8144] transition"
            onClick={() => { setOrdem('gestor'); setOrdemCrescente(!ordemCrescente); }}
          >
            Gestor
          </th>
          <th
            className="py-2 cursor-pointer text-right hover:text-[#3A8144] transition"
            onClick={() => { setOrdem('total_contratos'); setOrdemCrescente(!ordemCrescente); }}
          >
            Qtde
          </th>
          <th
            className="py-2 cursor-pointer text-right hover:text-[#3A8144] transition"
            onClick={() => { setOrdem('valor_total'); setOrdemCrescente(!ordemCrescente); }}
          >
            Valor
          </th>
          <th
            className="py-2 cursor-pointer text-right hover:text-[#3A8144] transition"
            onClick={() => { setOrdem('percentual'); setOrdemCrescente(!ordemCrescente); }}
          >
            % do Total
          </th>
        </tr>
      </thead>
      <tbody>
        {dadosOrdenados.map((gestor, idx) => (
          <tr key={idx} className="border-b last:border-0 hover:bg-green-50 transition">
            <td className="py-3 pl-2">
              <button
                className="text-[#3A8144] font-medium underline hover:text-green-800 transition cursor-pointer"
                title="Clique para visualizar detalhes"
                onClick={(e) => {
                  e.stopPropagation(); // evita conflito com outros cliques de linha, caso existam
                  setGestorSelecionado(gestor.gestor_idh);
                  setModalAberto(true);
                  setPagina(1);
                }}
              >
                {gestor.gestor}
              </button>
            </td>
            <td className="py-3 pr-2 text-right text-gray-700 font-semibold">{gestor.total_contratos}</td>
            <td className="py-3 pr-2 text-right text-green-700 font-semibold">
  {formatadorBRL.format(gestor.valor_total)}
</td>

            <td className="py-3 pr-2 text-right text-gray-700 font-semibold">{gestor.percentual.toFixed(1)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

        </div>
      </CardContent>

      {/* Modal de Detalhes do Gestor */}
      <Dialog open={modalAberto} onClose={() => setModalAberto(false)} className="relative z-50">
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
  <div className="fixed inset-0 flex items-center justify-center p-6">
    <Dialog.Panel className="mx-auto max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <Dialog.Title className="p-6 border-b flex items-center justify-between bg-[#f9f9f9]">
        <div>
          <p className="text-sm text-gray-500">Contratos do Gestor</p>
          <h2 className="text-xl font-bold text-[#3A8144]">{gestorDetalhe?.gestor || ''}</h2>
        </div>
        <button
          onClick={() => setModalAberto(false)}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </Dialog.Title>

      {/* Conteúdo com scroll */}
      <div className="p-6 space-y-8 overflow-y-auto">
        {/* Cards Resumo */}
        {gestorDetalhe && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cards... mantidos como estão */}
          </div>
        )}

        {/* Tabela */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
          <tbody>
  {loadingContratos ? (
    <tr>
      <td colSpan={5} className="text-center py-8 text-gray-500">
        Carregando contratos...
      </td>
    </tr>
  ) : contratosPaginados.length === 0 ? (
    <tr>
      <td colSpan={5} className="text-center py-8 text-gray-500">
        Nenhum contrato vinculado a este gestor.
      </td>
    </tr>
  ) : (
    contratosPaginados.map((contrato) => (
      <tr key={contrato.id} className="border-b hover:bg-gray-50">
        <td className="py-3 px-4">{contrato.parte}</td>
        <td className="py-3 px-4">{contrato.objeto}</td>
        <td className="py-3 px-4 text-right text-green-700 font-semibold">
          {formatadorBRL.format(contrato.valor)}
        </td>
        <td className="py-3 px-4 text-center">
          {new Date(contrato.data_inicio).toLocaleDateString('pt-BR')}
        </td>
        <td className="py-3 px-4 text-center">
          {new Date(contrato.data_fim).toLocaleDateString('pt-BR')}
        </td>
      </tr>
    ))
  )}
</tbody>

          </table>
        </div>

        {/* Paginação dentro do modal */}
        {!loadingContratos && contratosPaginados.length > 0 && (
          <div className="flex flex-wrap justify-between items-center mt-6">
            <span className="text-sm text-gray-500">
              Página {pagina} de {Math.ceil(contratosGestor.length / contratosPorPagina)}
            </span>
            <div className="flex gap-2 mt-2 md:mt-0">
              <button
                disabled={pagina === 1}
                onClick={() => setPagina(pagina - 1)}
                className={`px-4 py-2 text-sm rounded-lg border transition ${
                  pagina === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-[#3A8144] border-[#3A8144] hover:bg-green-50'
                }`}
              >
                ◀ Anterior
              </button>
              <button
                disabled={pagina === Math.ceil(contratosGestor.length / contratosPorPagina)}
                onClick={() => setPagina(pagina + 1)}
                className={`px-4 py-2 text-sm rounded-lg border transition ${
                  pagina === Math.ceil(contratosGestor.length / contratosPorPagina)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-[#3A8144] border-[#3A8144] hover:bg-green-50'
                }`}
              >
                Próximo ▶
              </button>
            </div>
          </div>
        )}
      </div>
    </Dialog.Panel>
  </div>
</Dialog>


    </Card>
  )

  
}

