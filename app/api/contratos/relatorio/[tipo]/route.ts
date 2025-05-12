import { NextRequest, NextResponse } from 'next/server'
import { Contratos } from '@/modules/contratos/db'

export async function GET(req: NextRequest, { params }: { params: { tipo: string } }) {
  try {
    const tipo = params.tipo

    let query = ''
    let values: unknown[] = [] // Updated from 'any[]' to 'unknown[]'

    switch (tipo) {
      case 'gestor':
        query = `
          SELECT 
           u.id AS gestor_idh,
            u.nome AS gestor,
            COUNT(h.id) AS total_contratos,
            SUM(h.valorh) AS valor_total
          FROM historico h
          LEFT JOIN usuario u ON u.id = h.gestor_idh
          WHERE h.statush = 1 
            AND h.gestor_idh IN (961, 940, 795, 847, 766, 789, 861)
          GROUP BY u.nome
          ORDER BY total_contratos DESC
        `
        break

      case 'parte':
        query = `
          SELECT 
            h.partesh AS parte,
            COUNT(*) AS total_contratos,
            SUM(h.valorh) AS valor_total
          FROM historico h
          WHERE h.statush = 1
          GROUP BY h.partesh
          ORDER BY total_contratos DESC
        `
        break

      case 'mes':
        query = `
          SELECT 
            DATE_FORMAT(h.data_inicioh, '%Y-%m') AS mes,
            COUNT(*) AS total_contratos,
            SUM(h.valorh) AS valor_total
          FROM historico h
          WHERE h.statush = 1
          GROUP BY mes
          ORDER BY mes ASC
        `
        break

        case 'comparativo-anual':
          query = `
            SELECT 
        YEAR(h.data_fimh) AS ano,
        COUNT(h.id) AS total_contratos,
        SUM(h.valorh) AS valor_total
      FROM historico h
      WHERE h.gestor_idh IN (961, 940, 795, 847, 766, 789, 861)
      GROUP BY ano
      ORDER BY ano
          `
          break

      case 'comparativo-anual-empresa':
        query = `
          SELECT 
            YEAR(h.data_fimh) AS ano,
            COUNT(h.id) AS total_contratos,
            SUM(h.valorh) AS valor_total
          FROM historico h
          GROUP BY ano
          ORDER BY ano
        `
        break


        case 'por-gestor':
          const idParam = req.nextUrl.searchParams.get('gestor_idh');
          const gestorIdh = parseInt(idParam || '', 10);
        
          if (isNaN(gestorIdh) || gestorIdh <= 0) {
            return NextResponse.json({ error: 'Parâmetro gestor_idh inválido' }, { status: 400 });
          }
      
        
          query = `
          SELECT 
            h.id,
            h.partesh AS parte,
            h.objetoh AS objeto,
            h.valorh AS valor,
            DATE_FORMAT(h.data_inicioh, '%Y-%m-%d') AS data_inicio,
            DATE_FORMAT(h.data_fimh, '%Y-%m-%d')    AS data_fim
          FROM historico h
          WHERE h.statush = 1 AND h.gestor_idh = ?
          ORDER BY h.data_inicioh DESC
        `;
      
        values = [gestorIdh]; // ✅ parâmetro obrigatório para o ?
        break;



      default:
        return NextResponse.json({ erro: 'Tipo de relatório inválido' }, { status: 400 })
    }


    

    const [rows] = await Contratos.query(query, values)
    return NextResponse.json(rows)
  } catch (error: unknown) {
    console.error('Erro ao gerar relatório:', error)
    return NextResponse.json({ erro: 'Erro interno no servidor' }, { status: 500 })
  }
}
