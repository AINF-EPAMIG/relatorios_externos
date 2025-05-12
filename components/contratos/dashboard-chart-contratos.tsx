'use client'

import { useEffect, useState } from 'react'

interface Contrato {
  valorh: number
  data_inicioh: string
}

export function DashboardChartContratos() {
  const [contratos, setContratos] = useState<Contrato[]>([])

  useEffect(() => {
    fetch('/api/contratos')
      .then(res => res.json())
      .then(setContratos)
      .catch(console.error)
  }, [])

  const totalValue = contratos.reduce((sum, contrato) => sum + contrato.valorh, 0)
  const activeContracts = contratos.filter(c => new Date(c.data_inicioh) <= new Date()).length

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <h3 className="font-semibold mb-2">Total em Contratos</h3>
        <p className="text-2xl font-bold">R$ {totalValue.toLocaleString('pt-BR')}</p>
      </div>
      <div className="rounded-lg border p-4">
        <h3 className="font-semibold mb-2">Contratos Ativos1</h3>
        <p className="text-2xl font-bold">{activeContracts}</p>
      </div>
    </div>
  )
} 