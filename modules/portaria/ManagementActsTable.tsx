"use client"

import { useEffect, useState } from "react"

interface Arquivo {
  tipo_arquivo: string
  path_servidor: string
}

export function ManagementActsTable() {
  const [dadosOriginais, setDadosOriginais] = useState<any[]>([])
  const [dados, setDados] = useState<any[]>([])
  const [filtros, setFiltros] = useState({ numero: "", descricao: "", tipo_id: "1" })
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState(10)
  const [modalAberto, setModalAberto] = useState(false)
  const [arquivoAtual, setArquivoAtual] = useState<string | null>(null)

  const tipoMap: { [key: string]: string } = {
    "1": "Portaria",
    "4": "Deliberações",
    "5": "Resoluções",
    "3": "BIA"
  }

  // ✅ CORRETO: agora dentro do useEffect
  useEffect(() => {
    fetch("/api/portaria")
      .then(res => res.json())
      .then(response => {
        const data = Array.isArray(response) ? response : response.data

        if (!Array.isArray(data)) {
          console.error("❌ Erro: dados não são um array válido.")
          return
        }

        const agrupado = data.reduce((acc: any, item: any) => {
          const id = item.ato_id
          if (!acc[id]) {
            acc[id] = {
              id,
              tipo_id: item.tipo_id,
              nome_tipo: item.nome_tipo,
              numero: item.numero,
              descricao: item.descricao,
              data_ato: item.data_ato,
              status: item.status,
              arquivos: [],
            }
          }
          if (item.path_servidor && item.path_servidor.trim() !== "" && item.path_servidor !== "null") {
            acc[id].arquivos.push({
              tipo_arquivo: item.tipo_arquivo,
              path_servidor: item.path_servidor,
            })
          }
          

          return acc
        }, {})

        const resultado = Object.values(agrupado).sort((a: any, b: any) => {
          return new Date(b.data_ato).getTime() - new Date(a.data_ato).getTime()
        })

        setDadosOriginais(resultado)
      })
  }, [])

  useEffect(() => {
    let filtrado = dadosOriginais
  
    if (filtros.tipo_id) {
      filtrado = filtrado.filter((item) => item.tipo_id?.toString() === filtros.tipo_id)
    }
  
    if (filtros.numero) {
      filtrado = filtrado.filter((item) =>
        item.numero?.toString().toLowerCase().includes(filtros.numero.toLowerCase())
      )
    }
  
    if (filtros.descricao) {
      filtrado = filtrado.filter((item) =>
        item.descricao?.toLowerCase().includes(filtros.descricao.toLowerCase())
      )
    }
  
    setPaginaAtual(1)
    setDados(filtrado)
  }, [filtros, dadosOriginais])
  

  const indiceInicial = (paginaAtual - 1) * itensPorPagina
  const dadosPaginados = dados.slice(indiceInicial, indiceInicial + itensPorPagina)
  const totalPaginas = Math.ceil(dados.length / itensPorPagina)

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2 items-end">
        <select
          value={itensPorPagina}
          onChange={(e) => setItensPorPagina(Number(e.target.value))}
          className="border p-2 rounded text-sm w-40"
        >
          <option value={5}>5 por página</option>
          <option value={10}>10 por página</option>
          <option value={25}>25 por página</option>
          <option value={50}>50 por página</option>
        </select>

        <input
          type="text"
          placeholder="Número"
          value={filtros.numero}
          onChange={(e) => setFiltros({ ...filtros, numero: e.target.value })}
          className="border p-2 rounded text-sm w-40"
        />

<input
  type="text"
  placeholder="Descrição"
  value={filtros.descricao}
  onChange={(e) => setFiltros({ ...filtros, descricao: e.target.value })}
  className="border p-2 rounded text-sm w-60"
/>


        <select
          value={filtros.tipo_id}
          onChange={(e) => setFiltros({ ...filtros, tipo_id: e.target.value })}
          className="border p-2 rounded text-sm w-48"
        >
          <option value="">Todos os tipos</option>
          <option value="1">Portarias</option>
          <option value="4">Deliberações</option>
          <option value="5">Resoluções</option>
          <option value="3">BIA</option>
        </select>

        <button
          onClick={() => setFiltros({ numero: "", descricao: "", tipo_id: "1" })}
          className="text-white border border-[#3A8144] rounded-lg px-4 py-2 text-sm"
          style={{ backgroundColor: "#3A8144" }}
        >
          Limpar
        </button>
      </div>

      {/* Lista de Cards */}
      <div className="space-y-4">
        {dadosPaginados.map((item, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-2 rounded">
              <h3 className="font-semibold" style={{ color: "#3A8144" }}>
                {`${tipoMap[item.tipo_id] || item.nome_tipo} - Número: ${item.numero}`}
              </h3>
              <span className="text-sm font-bold" style={{ color: "#3A8144" }}>
                Data do documento: {new Date(item.data_ato).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed mb-2">
              {item.descricao}
            </p>

           <div className="flex flex-wrap justify-between items-center text-sm gap-2">
  <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
    {item.status}
  </span>

  {Array.isArray(item.arquivos) && item.arquivos.length > 0 ? (
  <div className="flex gap-6 items-center">
    {item.arquivos.map((arq: Arquivo, index: number) => {
      const url = `https://epamigsistema.com/atos_gestao/web/${arq.path_servidor.replace(/\\/g, '/')}`
      const isAtualizado = arq.tipo_arquivo == "Atualizado"

      return (
        <div
          key={index}
          className="flex flex-col items-center cursor-pointer group"
          title={isAtualizado ? "Visualizar PDF Atualizado" : "Visualizar o PDF Original"}
          onClick={() => {
            setArquivoAtual(url)
            setModalAberto(true)
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 mb-1 group-hover:scale-105 transition"
            fill={isAtualizado ? "#3A8144" : "#B91C1C"}
            viewBox="0 0 24 24"
          >
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm1 7H8V7h7v2zm0 4H8v-2h7v2zm0 4H8v-2h7v2z"/>
          </svg>
          <span className="text-xs font-medium text-blue-800 underline hover:text-blue-600 transition">
            {isAtualizado ? "Versão Atualizada" : "Arquivo Original"}
          </span>
        </div>
      )
    })}
  </div>
) : (
  <span className="text-gray-400 text-xs">Sem anexo</span>
)}
</div>

          </div>
        ))}
        {dadosPaginados.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            Nenhum resultado encontrado.
          </div>
        )}
      </div>

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex justify-center gap-2 text-sm">
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPaginaAtual(i + 1)}
              className={`px-3 py-1 rounded border transition ${
                paginaAtual === i + 1
                  ? "bg-[#3A8144] text-white"
                  : "bg-white text-[#3A8144] border-[#3A8144] hover:bg-[#3A8144]/10"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
{modalAberto && arquivoAtual && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white w-full max-w-6xl h-[95vh] mx-4 rounded-lg shadow-xl flex flex-col relative overflow-hidden">

      {/* Cabeçalho branco fixo com botão de fechar */}
      <div className="w-full flex justify-between items-center px-6 py-3 border-b bg-white shadow-sm z-50">
        <h2 className="text-lg font-bold text-[#3A8144]"></h2>
        <button
          onClick={() => setModalAberto(false)}
          className="text-sm text-white bg-[#3A8144] rounded px-4 py-2 hover:bg-[#2f6b39] transition"
        >
          Fechar
        </button>
      </div>

      {/* Corpo com PDF e lateral de ações */}
      <div className="flex flex-1 overflow-hidden">
        {/* Lateral esquerda */}
        <div className="w-56 bg-[#f4f4f4] border-r px-4 py-6 flex flex-col justify-start gap-4">
          <h2 className="text-lg font-bold text-[#3A8144]">Ações</h2>
          <a
            href={arquivoAtual}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white bg-[#3A8144] rounded px-4 py-2 text-center hover:bg-[#2f6b39] transition"
          >
            Abrir em nova aba
          </a>
        </div>

        {/* Área PDF */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4 flex justify-center items-start">
          <iframe
            src={arquivoAtual}
            className="w-full max-w-[900px] aspect-[794/1123] bg-white border shadow-lg rounded"
            style={{ minHeight: '90vh' }}
          />
        </div>
      </div>
    </div>
  </div>
)}













    </div>
  )
}
