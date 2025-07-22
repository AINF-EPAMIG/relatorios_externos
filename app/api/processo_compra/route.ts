import { NextResponse } from "next/server"
import { dbEditais } from "@/modules/processo_compra/db"
export const dynamic = "force-dynamic"

// Definições de tipos
interface Arquivo {
  nome_arquivo: string
  path_servidor: string
  tipo_arquivo: string
}

interface EditalRow {
  id: number
  tipo_edital: number | string
  tipo_publicacao: number | string
  numero_processo: string
  numero_sei: string
  objeto: string
  responsavel: string
  fonte: string
  data_retificacao: string | null
  data_abertura: string | null
  hora_abertura: string | null
  data_fechamento: string | null
  hora_fechamento: string | null
  nome_arquivo?: string
  path_servidor?: string
  tipo_arquivo?: string
}

interface EditalResult {
  id: number
  tipo_edital: number | string
  tipo_publicacao: number | string
  numero_processo: string
  numero_sei: string
  objeto: string
  responsavel: string
  fonte: string
  data_retificacao: string | null
  data_abertura: string | null
  hora_abertura: string | null
  data_fechamento: string | null
  hora_fechamento: string | null
  arquivos: Arquivo[]
}

// Função utilitária para garantir array de resultados independente do driver
function getRowsFromQueryResult<T>(result: unknown): T[] {
  if (Array.isArray(result)) {
    if (Array.isArray(result[0])) {
      return result[0] as T[];
    }
    if (result.every((r) => typeof r === "object")) {
      return result as T[];
    }
  }
  return [];
}

export async function GET() {
  try {
    const result = await dbEditais.query(`
      SELECT
        p.id,
        p.tipo_edital,
        p.tipo_publicacao,
        p.numero_processo,
        p.numero_sei,
        p.objeto,
        u.nome AS responsavel,
        f.nome AS fonte,
        p.data_retificacao,
        p.data_abertura,
        p.hora_abertura,
        p.data_fechamento,
        p.hora_fechamento,
        a.nome_arquivo,
        a.path_servidor,
        a.tipo AS tipo_arquivo
      FROM editais AS p
      LEFT JOIN usuario AS u ON u.id = p.responsavel
      LEFT JOIN fonte AS f ON f.id = p.fonte_id
      LEFT JOIN arquivo AS a ON a.processo_id = p.id
      WHERE 
        (p.tipo_publicacao != 7 OR (p.tipo_publicacao = 7 AND p.publicar_site = 1))
      ORDER BY 
        p.id DESC
    `);

    const rows: EditalRow[] = getRowsFromQueryResult<EditalRow>(result);

    // Agrupar arquivos por processo_id
    const agrupado: Record<number, EditalResult> = {};

    for (const row of rows) {
      const id = row.id;
      if (!agrupado[id]) {
        agrupado[id] = {
          id: row.id,
          tipo_edital: row.tipo_edital,
          tipo_publicacao: row.tipo_publicacao,
          numero_processo: row.numero_processo,
          numero_sei: row.numero_sei,
          objeto: row.objeto,
          responsavel: row.responsavel,
          fonte: row.fonte,
          data_retificacao: row.data_retificacao,
          data_abertura: row.data_abertura,
          hora_abertura: row.hora_abertura,
          data_fechamento: row.data_fechamento,
          hora_fechamento: row.hora_fechamento,

          arquivos: [],
        };
      }
      if (row.nome_arquivo && row.path_servidor) {
        agrupado[id].arquivos.push({
          nome_arquivo: row.nome_arquivo,
          path_servidor: row.path_servidor,
          tipo_arquivo: row.tipo_arquivo ?? "",
        });
      }
    }

    // NÃO reordene novamente, apenas agrupe os arquivos
    const resultadoFinal = Object.values(agrupado);

    return NextResponse.json(resultadoFinal);

  } catch (error) {
    console.error(
      "🔥 Erro ao consultar processo de compra:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}
