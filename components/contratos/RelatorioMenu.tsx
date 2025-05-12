'use client'

import Link from 'next/link'
import { BarChart3, Users, TrendingUp } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function RelatorioMenu() {
  const pathname = usePathname()

  const botaoClasse = (path: string) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition text-white ${
      pathname === path ? 'bg-[#2f6b39]' : 'bg-[#3A8144] hover:bg-[#2f6b39]'
    }`

  return (
    <div className="flex justify-center gap-4 flex-wrap mb-6">
      <Link href="/contratos" className={botaoClasse('/contratos')}>
        <BarChart3 size={20} /> Relatório Geral
      </Link>
      
      <Link href="/contratos/graficos/gestor" className={botaoClasse('/contratos/graficos/gestor')}>
        <Users size={20} /> Por Gestor
      </Link>

      <Link href="/contratos/graficos/comparativo-anual" className={botaoClasse('/contratos/graficos/comparativo-anual')}>
    <TrendingUp size={20} /> Comparativo Anual
  </Link>


    </div>
  )
}
