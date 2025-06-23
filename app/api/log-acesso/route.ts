import { NextRequest } from 'next/server';
import mysql from 'mysql2/promise';

// Função para pegar a data/hora de Brasília no formato MySQL DATETIME
function getBrasilDatetime() {
  const now = new Date();
  // Ajusta para UTC-3 (Brasília)
  const brasilTime = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  return brasilTime.toISOString().slice(0, 19).replace('T', ' ');
}

export async function POST(request: NextRequest) {
  try {
    const { userAgent } = await request.json();
    const dataCadastro = getBrasilDatetime();

    // Conexão com o banco
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    await conn.execute(
      'INSERT INTO quantitativo_acessos (user_agent, data_cadastro) VALUES (?, ?)',
      [userAgent, dataCadastro]
    );
    await conn.end();

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    console.error('Erro ao registrar acesso:', error);
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ ok: false, error: errorMessage }), { status: 500 });
  }
}
