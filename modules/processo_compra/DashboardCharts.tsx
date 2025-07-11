"use client"

import { useEffect, useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LabelList, PieChart, Pie, Legend, CartesianGrid
} from "recharts"

import { BarChart as BarChartIcon, PieChart as PieChartIcon, Table as TableIcon, Loader2, Gavel as GavelIcon } from "lucide-react"

import {
  Card, CardContent, CardHeader,
} from "@/components/ui/card"

import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs"

// Mapeamento do tipo_publicacao
const mapTipoPublicacao: Record<string, string> = {
  "1": "Processo de Compras",
  "2": "Homologação",
  "3": "Autorização de Fornecimento",
  "4": "Ratificação",
  "5": "Recurso Administrativo",
  "6": "Retificação",
  "7": "Documentos Complementares",
}

export function DashboardCharts() {
  const [dados, setDados] = useState<any[]>([])
  const [currentTab, setCurrentTab] = useState("bar")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await fetch("/api/processo_compra")
        if (!res.ok) throw new Error('Failed to fetch data')
        const data = await res.json()
        setDados(Array.isArray(data) ? data : data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const tabs = ["bar", "pie", "data", "pregao"]
    const interval = setInterval(() => {
      setCurrentTab(prev => {
        const nextIndex = (tabs.indexOf(prev) + 1) % tabs.length
        return tabs[nextIndex]
      })
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  // Contagem por tipo_publicacao
  const counts = dados.reduce((acc, curr) => {
    const tipo = curr.tipo_publicacao?.toString()
    if (tipo) acc[tipo] = (acc[tipo] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Montando os dados para os gráficos
  const typeData = Object.entries(mapTipoPublicacao).map(([key, name]) => ({
    name,
    value: counts[key] || 0,
  }))

  // Quantidade de Pregões Eletrônicos em aberto
  const pregoesEmAberto = dados.filter(
    d => d.tipo_edital?.toString() === "1" && d.tipo_publicacao?.toString() !== "2"
  ).length

  const COLORS = ["#3A8144", "#357EDD", "#EA580C", "#C026D3", "#475569", "#059669", "#F59E42"]
  const totalPublicacoes = typeData.reduce((sum, d) => sum + d.value, 0)
  const dataAtual = new Date().toLocaleDateString("pt-BR")

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white border rounded-lg shadow-lg">
          <p className="font-semibold text-[#3A8144]">{label}</p>
          <p className="text-sm">
            Quantidade: <span className="font-medium">{payload[0].value}</span>
          </p>
          <p className="text-xs text-gray-500">
            {((payload[0].value / totalPublicacoes) * 100).toFixed(1)}% do total
          </p>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl h-[400px] border border-[#3A8144] rounded-lg flex items-center justify-center mx-auto">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-[#3A8144]" />
          <p className="text-sm text-gray-600">Carregando dados...</p>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl h-[400px] border border-red-500 rounded-lg flex items-center justify-center mx-auto">
        <div className="text-center">
          <p className="text-red-500 font-medium">Erro ao carregar dados</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl h-auto min-h-[400px] border border-[#3A8144] rounded-lg mx-auto">
      <CardHeader>
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-semibold text-[#3A8144]">Distribuição por Tipo de Publicação</span>
            <span className="bg-[#3A8144] text-white text-xs font-medium px-3 py-1 rounded-full">
              Total: {totalPublicacoes.toLocaleString('pt-BR')}
            </span>
          </div>
          <span className="text-xs text-gray-500">Atualizado em {dataAtual}</span>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4 w-full">
          <TabsList
            className={`
              w-full flex flex-row justify-between gap-1 bg-gray-100 p-1 rounded-lg shadow-sm
              text-[13px] md:text-sm
            `}
            style={{ overflowX: "hidden" }}
          >
            <TabsTrigger
              value="bar"
              className="flex-1 min-w-0 data-[state=active]:bg-[#3A8144] data-[state=active]:text-white hover:bg-[#3A8144]/90 rounded-md font-medium py-2 flex items-center justify-center gap-2 transition"
            >
              <BarChartIcon size={16} />
              <span className="hidden xs:inline">Gráfico</span>
            </TabsTrigger>
            <TabsTrigger
              value="pie"
              className="flex-1 min-w-0 data-[state=active]:bg-[#3A8144] data-[state=active]:text-white hover:bg-[#3A8144]/90 rounded-md font-medium py-2 flex items-center justify-center gap-2 transition"
            >
              <PieChartIcon size={16} />
              <span className="hidden xs:inline">Pizza</span>
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="flex-1 min-w-0 data-[state=active]:bg-[#3A8144] data-[state=active]:text-white hover:bg-[#3A8144]/90 rounded-md font-medium py-2 flex items-center justify-center gap-2 transition"
            >
              <TableIcon size={16} />
              <span className="hidden xs:inline">Dados</span>
            </TabsTrigger>
            <TabsTrigger
              value="pregao"
              className="flex-1 min-w-0 data-[state=active]:bg-[#3A8144] data-[state=active]:text-white hover:bg-[#3A8144]/90 rounded-md font-medium py-2 flex items-center justify-center gap-2 transition"
            >
              <GavelIcon size={16} />
              <span className="hidden xs:inline">Pregões em Aberto</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bar">
            <div className="w-full h-[300px] sm:h-[320px] md:h-[360px] lg:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" barSize={40} radius={[6, 6, 0, 0]} animationDuration={800} isAnimationActive minPointSize={5}>
                    <LabelList dataKey="value" position="top" fill="#333" fontSize={12} />
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

         <TabsContent value="pie">
  <div className="relative w-full px-2 h-[400px] sm:h-[480px]">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={typeData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius="65%" // aumentei um pouco para caber melhor
          innerRadius="45%"
          paddingAngle={2}
          isAnimationActive={true}
        >
          {typeData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{
            fontSize: '13px',
            marginTop: 16,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            width: '100%',
            lineHeight: '22px'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center text-sm sm:text-base font-semibold text-[#3A8144]">
        Total<br />
        <span className="text-xl font-bold">{totalPublicacoes.toLocaleString("pt-BR")}</span>
      </div>
    </div>
  </div>
</TabsContent>


          <TabsContent value="data">
            <div className="space-y-2 text-sm sm:text-base">
              {typeData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{item.value}</span>
                    <span className="text-gray-500 text-sm">
                      ({totalPublicacoes > 0 ? ((item.value / totalPublicacoes) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-4 mt-2 border-t">
                <p className="text-right text-sm text-gray-600">
                  Total: <strong className="text-[#3A8144] font-semibold">{totalPublicacoes}</strong>
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pregao">
            <div className="flex flex-col items-center justify-center h-48">
              <GavelIcon size={32} className="text-[#3A8144] mb-2" />
              <span className="text-3xl font-bold text-[#3A8144]">{pregoesEmAberto}</span>
              <span className="text-base font-medium text-gray-700 mt-1">Pregões Eletrônicos em Aberto</span>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
