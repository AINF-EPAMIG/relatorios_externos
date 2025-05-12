import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardCharts } from "@/components/dashboard-charts"
import { ManagementActsTable } from "@/modules/portaria/ManagementActsTable"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-6 px-6 py-6">
        <header className="w-full text-center py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-black leading-tight tracking-tight">
            Consulta de Atos de Gestão
          </h1>
          
          <div className="w-16 h-1 bg-[#3A8144] mx-auto mt-4 rounded-full" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <ManagementActsTable />
          </div>

          <DashboardCharts />
        </div>
      </main>
    </div>
  )
}