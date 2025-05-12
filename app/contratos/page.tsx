'use client'

import { ContratosTable } from '@/modules/contratos/ContratosTable'
import { RelatorioMenu } from '@/components/contratos/RelatorioMenu'
import { DashboardHeader } from '@/components/dashboard-header'

export default function ContratosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="p-6">
         <header className="w-full text-center py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-black leading-tight tracking-tight">
            Consulta de Contratos da AINF
          </h1>
          
          <div className="w-16 h-1 bg-[#3A8144] mx-auto mt-4 rounded-full" />
        </header>
        <RelatorioMenu />
        <ContratosTable />
      </main>
    </div>
  )
}
