

import { dbPortaria } from './db'

export async function listarPortarias() {
  const [rows] = await dbPortaria.query(
    'SELECT id, numero, descricao, data_ato, status FROM atos'
  )
  return rows as any[] // ou defina um tipo Portaria[]
}

