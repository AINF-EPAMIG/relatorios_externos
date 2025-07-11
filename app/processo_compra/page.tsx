import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardCharts } from "@/modules/processo_compra/DashboardCharts"
import ConsultaProcessoCompra from "@/modules/processo_compra/ConsultaProcessoCompra"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <DashboardHeader />
      <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-2 md:px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-black leading-tight tracking-tight text-center mb-2">
          Consulta de Processos de Compras
        </h1>
        <div className="w-16 h-1 bg-[#3A8144] mx-auto mt-3 rounded-full mb-8" />

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-8/12">
            <ConsultaProcessoCompra />
          </div>
          <div className="w-full md:w-4/12">
            <DashboardCharts />
          </div>
        </div>
      </main>
    </div>
  )
}
