'use client';

import { useEffect, useState } from 'react';

export function ContratosTable() {
  const [contratos, setContratos] = useState<any[]>([]);
  const [filtroParte, setFiltroParte] = useState('');
  const [filtroAno, setFiltroAno] = useState('');
  const [filtroObjeto, setFiltroObjeto] = useState('');
  const [filtroGestor, setFiltroGestor] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [arquivoAtual, setArquivoAtual] = useState('');

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/contratos');
      const data = await res.json();
      setContratos(data);
    }
    fetchData();
  }, []);

  const formatarValor = (valor: any) => {
    const numero = parseFloat(valor);
    return isNaN(numero)
      ? ''
      : numero.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
  };

  const formatarData = (data: string) =>
    new Date(data).toLocaleDateString('pt-BR');

  const getAno = (data: string) => new Date(data).getFullYear().toString();

  const calcularDiasRestantes = (dataFim: string) => {
    const hoje = new Date();
    const fim = new Date(dataFim);
    const diff = Math.ceil((fim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const contratosFiltrados = (Array.isArray(contratos) ? contratos : [])
  .filter((c) => {
    const anoInicio = getAno(c.data_inicio);
    return (
      (!filtroParte || c.parte === filtroParte) &&
      (!filtroAno || anoInicio === filtroAno) &&
      (!filtroObjeto || c.objeto.toLowerCase().includes(filtroObjeto.toLowerCase())) &&
      (!filtroGestor || c.gestor?.toLowerCase().includes(filtroGestor.toLowerCase()))
    );
  })
  .map((c) => ({ ...c, dias_restantes: calcularDiasRestantes(c.data_fim) }))
  .sort((a, b) => a.dias_restantes - b.dias_restantes);


  const total = contratosFiltrados.reduce((acc: number, c: any) => {
    const valor = parseFloat(c.valor);
    return isNaN(valor) ? acc : acc + valor;
  }, 0);

  const partesUnicas = [...new Set(contratos.map((c) => c.parte))];
  const anosUnicos = [...new Set(contratos.map((c) => getAno(c.data_inicio)))].sort();

  const limparFiltros = () => {
    setFiltroParte('');
    setFiltroAno('');
    setFiltroObjeto('');
    setFiltroGestor('');
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-2xl p-6">
        <div className="flex flex-wrap justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-bold text-[#3A8144]">
              Contratos Ativos: <span className="text-green-700 font-extrabold">{contratosFiltrados.length} contratos</span> - <span className="text-green-800 font-extrabold">{formatarValor(total)}</span>
            </h2>
            <br />
          </div>
          <div className="flex flex-wrap gap-2 items-end">
  <select
    className="border border-gray-300 rounded px-3 py-2 text-sm"
    value={filtroParte}
    onChange={(e) => setFiltroParte(e.target.value)}
  >
    <option value="">Todas as partes</option>
    {partesUnicas.map((parte) => (
      <option key={parte} value={parte}>{parte}</option>
    ))}
  </select>

  <select
    className="border border-gray-300 rounded px-3 py-2 text-sm"
    value={filtroAno}
    onChange={(e) => setFiltroAno(e.target.value)}
  >
    <option value="">Todos os anos</option>
    {anosUnicos.map((ano) => (
      <option key={ano} value={ano}>{ano}</option>
    ))}
  </select>

  <input
    type="text"
    placeholder="Buscar objeto..."
    className="border border-gray-300 rounded px-3 py-2 text-sm"
    value={filtroObjeto}
    onChange={(e) => setFiltroObjeto(e.target.value)}
  />

  <select
    className="border border-gray-300 rounded px-2 py-2 text-sm w-40"
    value={filtroGestor}
    onChange={(e) => setFiltroGestor(e.target.value)}
  >
    <option value="">Todos os gestores</option>
    {[...new Set(contratos.map((c) => c.gestor).filter(Boolean).sort())].map((gestor) => (
      <option key={gestor} value={gestor}>{gestor}</option>
    ))}
  </select>

  <button
    onClick={limparFiltros}
    className="bg-[#3A8144] text-white rounded px-3 py-2 text-sm hover:bg-[#2f6b39] transition"
  >
    Limpar filtros
  </button>
</div>

          
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm text-gray-800 border-separate border-spacing-y-1">
            <thead className="bg-[#3A8144] text-white text-xs uppercase">
              <tr>
                <th className="px-4 py-2 text-left">Nº</th>
                <th className="px-4 py-2 text-left">Objeto</th>
                <th className="px-4 py-2 text-left">Parte</th>
                <th className="px-4 py-2 text-left">Gestor</th>
                <th className="px-4 py-2 text-left">Valor</th>
                <th className="px-4 py-2 text-left">Início</th>
                <th className="px-4 py-2 text-left">Fim</th>
                <th className="px-4 py-2 text-left">Dias p/ vencer</th>
                <th className="px-4 py-2 text-left">Anexo</th>
              </tr>
            </thead>
            <tbody>
              {contratosFiltrados.map((c) => (
                <tr
                  key={c.id}
                  className="bg-white shadow-sm rounded transition hover:bg-green-50"
                >
                  <td className="px-4 py-2 font-semibold text-[#3A8144]">{c.id}</td>
                  <td className="px-4 py-2">{c.objeto}</td>
                  <td className="px-4 py-2 text-gray-700">{c.parte}</td>
                  <td className="px-4 py-2 text-gray-700">{c.gestor || '-'}</td>
                  <td className="px-4 py-2 text-green-700 font-medium">
                    {formatarValor(c.valor)}
                  </td>
                  <td className="px-4 py-2">{formatarData(c.data_inicio)}</td>
                  <td className="px-4 py-2">{formatarData(c.data_fim)}</td>
                  <td className="px-4 py-2">{c.dias_restantes} dias</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap justify-between items-center text-sm gap-2">
                      {c.path_servidor ? (
                        <button
                          onClick={() => {
                            setArquivoAtual(`https://epamig.tech/contratos/web/${c.path_servidor.replace(/\\/g, '/')}`);
                            setModalAberto(true);
                          }}
                          className="text-white px-3 py-1 text-xs transition rounded-full"
                          style={{ backgroundColor: '#3A8144' }}
                        >
                          Visualizar Arquivo
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">Sem anexo</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalAberto && arquivoAtual && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-6xl h-[95vh] mx-4 rounded-lg shadow-xl flex flex-row relative overflow-hidden">
            <div className="w-56 bg-[#f4f4f4] border-r px-4 py-6 flex flex-col justify-start items-stretch gap-4">
              <h2 className="text-lg font-bold text-[#3A8144] text-left">Ações</h2>
              <a
                href={arquivoAtual}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white text-center bg-[#3A8144] rounded px-4 py-2 hover:bg-[#2f6b39] transition"
              >
                Abrir em nova aba
              </a>
              <button
                onClick={() => setModalAberto(false)}
                className="text-sm text-white text-center bg-[#3A8144] rounded px-4 py-2 hover:bg-[#2f6b39] transition"
              >
                Fechar
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 p-4 flex justify-center items-start">
              <iframe
                src={arquivoAtual}
                className="w-full max-w-[900px] aspect-[794/1123] bg-white border shadow-lg rounded"
                style={{ minHeight: '90vh' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}