import { NextResponse } from 'next/server';
import { Contratos } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await Contratos.query(
      `
 SELECT 
  h.id,
  h.partesh AS parte,
  h.objetoh AS objeto,
  h.valorh AS valor,
  h.data_inicioh AS data_inicio,
  h.data_fimh AS data_fim,
  h.statush AS status,
  a.path_servidor,
  u.nome AS gestor
FROM historico h
LEFT JOIN arquivo a ON a.historico_id = h.id
LEFT JOIN usuario u ON u.id = h.gestor_idh
WHERE h.statush = 1 
  AND h.gestor_idh IN (961, 940, 795, 847, 766, 789, 861)

    `
      
    );

    return NextResponse.json(rows);
  } catch (error: unknown) {
    console.error('🔥 Erro ao consultar contratos:', error instanceof Error ? error.message : error);
    return NextResponse.json({ erro: 'Erro interno ao buscar contratos' }, { status: 500 });
  }
}
