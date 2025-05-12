import { NextRequest, NextResponse } from 'next/server';
import { Contratos } from '@/modules/contratos/db';

export async function GET(req: NextRequest) {
  const tipo = req.nextUrl.searchParams.get('tipo');

  try {
    let query = '';
    switch (tipo) {
      case 'gestor':
        query = `
          SELECT u.nome AS gestor, COUNT(*) AS total
          FROM historico h
          INNER JOIN usuarios u ON u.id = h.gestor_idh
          WHERE h.statush = 1
            AND h.gestor_idh IN (961, 940, 795, 847, 766, 789, 861)
          GROUP BY u.nome
          ORDER BY total DESC
        `;
        break;

      case 'parte':
        query = `
          SELECT h.partesh AS parte, COUNT(*) AS total
          FROM historico h
          WHERE h.statush = 1
          GROUP BY h.partesh
          ORDER BY total DESC
        `;
        break;

      case 'vencimento':
        query = `
          SELECT h.objetoh AS objeto, h.data_fimh AS vencimento
          FROM historico h
          WHERE h.statush = 1
            AND h.gestor_idh IN (961, 940, 795, 847, 766, 789, 861)
          ORDER BY h.data_fimh ASC
          LIMIT 5
        `;
        break;

      default:
        return NextResponse.json({ erro: 'Tipo de gráfico inválido' }, { status: 400 });
    }

    const [rows] = await Contratos.query(query);
    return NextResponse.json(rows);
  } catch (error: unknown) {
    console.error('Erro ao consultar gráfico:', error instanceof Error ? error.message : error);
    return NextResponse.json({ erro: 'Erro interno' }, { status: 500 });
  }
}
