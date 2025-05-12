import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { ManagementActsTable } from "@/components/management-acts-table"
import { DashboardCharts } from "@/components/dashboard-charts"

export const metadata: Metadata = {
  title: "EPAMIG - Consulta de Atos de Gestão",
  description: "Sistema de consulta de atos de gestão da EPAMIG",
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-6 px-6 py-6">

        {/* Título centralizado */}
        <div className="flex justify-center">
          <h2 className="text-3xl font-bold tracking-tight text-green-700 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-file-text"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" x2="8" y1="13" y2="13" />
              <line x1="16" x2="8" y1="17" y2="17" />
              <line x1="10" x2="8" y1="9" y2="9" />
            </svg>
            Consulta de Atos de Gestão
          </h2>
        </div>

        {/* Seção lado a lado: Filtros/Tabela + Gráfico */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Tabela e Filtros (2/3 da largura) */}
          <div className="lg:col-span-2">
            <ManagementActsTable />
          </div>

          {/* Gráfico de pizza (1/3 da largura) */}
          <DashboardCharts />
        </div>
      </main>
    </div>
  )
}
