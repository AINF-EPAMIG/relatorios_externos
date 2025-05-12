'use client'

import { RelatorioMenu } from '@/components/contratos/RelatorioMenu'
import { GraficoGestor } from '@/components/contratos/grafico-gestor'

export default function PorGestorPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#3A8144] mb-4">Gráfico de Contratos por Gestor</h1>
      <RelatorioMenu />
      <GraficoGestor />
    </div>
  )
}
