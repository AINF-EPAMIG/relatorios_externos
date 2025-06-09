import { NextResponse } from "next/server"
import { dbPortaria } from "@/modules/portaria/db"

export async function GET() {
  try {
    const [rows] = await dbPortaria.query(`
     SELECT 
  atos.id AS ato_id,
  tipos.id AS tipo_id,
  tipos.nome_tipo,
  atos.numero,
  atos.descricao,
  atos.data_ato,
  atos.status,
  arquivo.tipo AS tipo_arquivo, 
  arquivo.path_servidor
FROM atos
JOIN tipos ON tipos.id = atos.tipos_id
LEFT JOIN arquivo ON arquivo.atos_id = atos.id
WHERE tipos.nome_tipo IN ('Portarias', 'BIA', 'Deliberações', 'Resoluções')
ORDER BY atos.data_ato DESC
    `)

    return NextResponse.json(rows)
  } catch (error: unknown) {
    console.error('🔥 Erro ao consultar portarias:', error instanceof Error ? error.message : error);
    return NextResponse.json({ erro: 'Erro interno' }, { status: 500 });
  }
}
