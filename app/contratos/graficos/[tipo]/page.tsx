'use client'

import { useParams } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard-header'
import { RelatorioMenu } from '@/components/contratos/RelatorioMenu'
import { GraficoGestor } from '@/components/contratos/grafico-gestor'
import { ComparativoAnual } from '@/components/contratos/comparativo-anual'

export default function GraficoDinamicoPage() {
  const { tipo } = useParams()

  const renderGrafico = () => {
    switch (tipo) {
      case 'gestor':
        return <GraficoGestor />

        case 'comparativo-anual':
          return <ComparativoAnual />
    
      default:
        return <p>Gráfico não encontrado: {String(tipo)}</p>
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="p-6">
        
        <RelatorioMenu />
        {renderGrafico()}
      </main>
    </div>
  )
}
