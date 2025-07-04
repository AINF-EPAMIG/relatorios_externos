"use client"

import { useEffect, useState } from "react"

export const dynamic = "force-dynamic"

interface Arquivo {
  tipo_arquivo: string
  path_servidor: string
}

export function ManagementActsTable() {
  const [dadosOriginais, setDadosOriginais] = useState<any[]>([])
  const [dados, setDados] = useState<any[]>([])
  const [filtros, setFiltros] = useState({ numero: "", descricao: "", tipo_id: "1", data_ato: "",status: "",})
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

  useEffect(() => {
  fetch("/api/log-acesso", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userAgent: navigator.userAgent }),
  });
}, []);

  useEffect(() => {
    fetch("/api/portaria", { cache: "no-store" })
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
          return new Date(b.numero).getTime() - new Date(a.numero).getTime()
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
  const palavras = filtros.descricao.trim().toLowerCase().split(/\s+/)
  filtrado = filtrado.filter((item) =>
    palavras.some(palavra => item.descricao?.toLowerCase().includes(palavra))
  )
}



    if (filtros.data_ato) {
  filtrado = filtrado.filter((item) =>
    item.data_ato?.startsWith(filtros.data_ato)
  )
}

if (filtros.status) {
  filtrado = filtrado.filter((item) =>
    item.status?.toLowerCase() === filtros.status.toLowerCase()
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
<div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
<h2 className="text-sm font-semibold text-[#3A8144] mb-3 flex items-center gap-2 group">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 text-[#3A8144] transition-transform duration-200 group-hover:scale-110"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z"
      clipRule="evenodd"
    />
  </svg>
  <span>Filtros de Busca</span>
</h2>




  <div className="flex flex-wrap gap-4 items-end">
    <select
      value={filtros.tipo_id}
      onChange={(e) => setFiltros({ ...filtros, tipo_id: e.target.value })}
      className="border border-gray-300 p-2 rounded-md text-sm w-48 bg-white focus:ring-2 focus:ring-[#3A8144]"
    >
      <option value="">Todos os tipos</option>
      <option value="1">Portarias</option>
      <option value="4">Deliberações</option>
      <option value="5">Resoluções</option>
      <option value="3">BIA</option>
    </select>

    <input
      type="text"
      placeholder="Número"
      value={filtros.numero}
      onChange={(e) => setFiltros({ ...filtros, numero: e.target.value })}
      className="border border-gray-300 p-2 rounded-md text-sm w-40 focus:ring-2 focus:ring-[#3A8144]"
    />

    <input
      type="text"
      placeholder="Descrição"
      value={filtros.descricao}
      onChange={(e) => setFiltros({ ...filtros, descricao: e.target.value })}
      className="border border-gray-300 p-2 rounded-md text-sm w-60 focus:ring-2 focus:ring-[#3A8144]"
    />

    <input
      type="date"
      value={filtros.data_ato}
      onChange={(e) => setFiltros({ ...filtros, data_ato: e.target.value })}
      className="border border-gray-300 p-2 rounded-md text-sm w-44 focus:ring-2 focus:ring-[#3A8144]"
    />

    <select
      value={filtros.status}
      onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
      className="border border-gray-300 p-2 rounded-md text-sm w-44 bg-white focus:ring-2 focus:ring-[#3A8144]"
    >
      <option value="">Todos os status</option>
      <option value="Vigente">Vigente</option>
      <option value="Revogada">Revogada</option>
      <option value="Cancelada">Cancelada</option>
      <option value="Esgotada">Esgotada</option>
    </select>

    <button
      onClick={() =>
        setFiltros({ numero: "", descricao: "", tipo_id: "1", data_ato: "", status: "" })
      }
      className="text-white font-medium rounded-md px-4 py-2 text-sm bg-[#3A8144] hover:bg-[#2f6b39] transition"
    >
      Limpar
    </button>
  </div>
</div>






      {/* Lista */}
      <div className="space-y-4">
        {dadosPaginados.map((item, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold" style={{ color: "#3A8144" }}>
                {`${tipoMap[item.tipo_id] || item.nome_tipo} - Número: ${item.numero}`}
              </h3>
              <span className="text-sm font-bold" style={{ color: "#3A8144" }}>
  {(() => {
    if (!item.data_ato) return "Data do documento: —"
    
    // Corta só a parte da data (primeiros 10 caracteres: YYYY-MM-DD)
    const [ano, mes, dia] = item.data_ato.substring(0, 10).split("-")
    return `Data do documento: ${dia}/${mes}/${ano}`
  })()}
</span>


            </div>
            <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed mb-2">
              {item.descricao}
            </p>

            <div className="flex justify-between items-end mt-4">
              <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                {item.status}
              </span>
             <div className="flex gap-6 items-center">
  {(() => {
    const arquivosValidos = (item.arquivos || []).filter(
      (arq: Arquivo) =>
        arq.path_servidor &&
        arq.path_servidor.trim() !== "" &&
        arq.path_servidor !== "null"
    )

    const arquivosParaMostrar = arquivosValidos
      .filter(
        (arq: Arquivo) =>
          arq.tipo_arquivo === "Arquivo" || arq.tipo_arquivo === "Atualizado"
      )
      .reverse() // <- inverte a ordem

    return arquivosParaMostrar.length > 0 ? (
      arquivosParaMostrar.map((arq: Arquivo, index: number) => {
        const url = `https://epamigsistema.com/atos_gestao/web/${arq.path_servidor.replace(/\\/g, '/')}`
        const isAtualizado = arq.tipo_arquivo === "Atualizado"

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
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm1 7H8V7h7v2zm0 4H8v-2h7v2zm0 4H8v-2h7v2z" />
            </svg>
            <span className="text-xs font-medium text-blue-800 underline hover:text-blue-600 transition">
              {isAtualizado ? "Arquivo Atualizado" : "Arquivo Original"}
            </span>
          </div>
        )
      })
    ) : (
      <span className="text-gray-400 text-xs">Sem anexo</span>
    )
  })()}
</div>

            </div>
          </div>
        ))}
        {dadosPaginados.length === 0 && (
          <div className="text-center text-gray-500 py-4">Nenhum resultado encontrado.</div>
        )}
      </div>

      {/* Paginação */}
    {totalPaginas > 1 && (
  <div className="flex justify-center items-center gap-4 text-sm mt-4">
    <button
      onClick={() => setPaginaAtual(1)}
      disabled={paginaAtual === 1}
      className="px-2 py-1 rounded border text-[#3A8144] hover:bg-[#3A8144]/10 disabled:opacity-40"
    >
      « Primeira
    </button>

    <button
      onClick={() => setPaginaAtual((prev) => Math.max(1, prev - 1))}
      disabled={paginaAtual === 1}
      className="px-2 py-1 rounded border text-[#3A8144] hover:bg-[#3A8144]/10 disabled:opacity-40"
    >
      ‹ Anterior
    </button>

    <span className="text-gray-700 font-medium">
      Página {paginaAtual} de {totalPaginas}
    </span>

    <button
      onClick={() => setPaginaAtual((prev) => Math.min(totalPaginas, prev + 1))}
      disabled={paginaAtual === totalPaginas}
      className="px-2 py-1 rounded border text-[#3A8144] hover:bg-[#3A8144]/10 disabled:opacity-40"
    >
      Próxima ›
    </button>

    <button
      onClick={() => setPaginaAtual(totalPaginas)}
      disabled={paginaAtual === totalPaginas}
      className="px-2 py-1 rounded border text-[#3A8144] hover:bg-[#3A8144]/10 disabled:opacity-40"
    >
      Última »
    </button>
  </div>
)}


      {/* Modal */}
    {modalAberto && arquivoAtual && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all">
    <div className="bg-white w-full max-w-6xl h-[95vh] mx-4 rounded-xl shadow-2xl flex flex-col relative overflow-hidden border-2 border-[#3A8144]">
      <div className="w-full flex justify-between items-center px-6 py-3 border-b bg-white shadow-sm z-50">
        <h2 className="text-lg font-bold text-[#3A8144]">Visualização do Arquivo</h2>
   <button
  style={{ background: "#dc2626", color: "#fff" }} // #dc2626 = red-600 Tailwind
  className="px-4 py-2 rounded-md font-bold transition"
  onClick={() => setModalAberto(false)}
>
  Fechar
</button>



      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-56 bg-[#f4f4f4] border-r px-4 py-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-[#3A8144]">Ações</h2>
          <a
            href={arquivoAtual}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white bg-[#3A8144] rounded px-4 py-2 text-center hover:bg-[#25622c] transition font-medium shadow"
          >
            Abrir em nova aba
          </a>
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
  </div>
)}

    </div>
  )
}
