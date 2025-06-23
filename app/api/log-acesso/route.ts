import { NextRequest } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(request: NextRequest) {
  try {
    const { userAgent } = await request.json();

    // Conexão com o banco
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    await conn.execute(
      'INSERT INTO quantitativo_acessos (user_agent) VALUES (?)',
      [userAgent]
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
