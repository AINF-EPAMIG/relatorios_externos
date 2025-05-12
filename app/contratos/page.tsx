'use client'

import { ContratosTable } from '@/modules/contratos/ContratosTable'
import { RelatorioMenu } from '@/components/contratos/RelatorioMenu'
import { DashboardHeader } from '@/components/dashboard-header'

export default function ContratosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="p-6">
        <h1 className="text-3xl font-bold text-[#3A8144] mb-4">
          Consulta de Contratos da AINF
        </h1>
        <RelatorioMenu />
        <ContratosTable />
      </main>
    </div>
  )
}
