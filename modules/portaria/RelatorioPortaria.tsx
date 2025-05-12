'use client'

import { useEffect, useState } from 'react'

export default function RelatorioPortaria() {
  const [dados, setDados] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/portaria')
      .then(res => res.json())
      .then(setDados)
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#3A8144]">Relatório de Portarias</h1>
      <table className="w-full table-auto border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Número</th>
            <th className="p-2">Descrição</th>
            <th className="p-2">Data</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.numero}</td>
              <td className="p-2">{item.descricao}</td>
              <td className="p-2">{new Date(item.data_ato).toLocaleDateString()}</td>
              <td className="p-2">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
