"use client"

import { useEffect, useState, useRef } from "react"

const mapTipoEdital: Record<string, string> = {
  "1": "Pregão Eletrônico",
  "2": "COTEP",
  "3": "Chamamento Público",
  "4": "Compra Emergencial",
  "5": "Credenciamento",
  "6": "Dispensa de Licitação",
  "7": "Inexigibilidade de Licitação",
  "8": "Leilão",
  "9": "Registro de Preços",
  "10": "Procedimento das Estatais",
  "11": "Compra Direta",
}

const mapTipoPublicacao: Record<string, string> = {
  "1": "Processo de Compras",
  "2": "Homologação",
  "3": "Autorização de Fornecimento",
  "4": "Ratificação",
  "5": "Recurso Administrativo",
  "6": "Retificação",
  "7": "Documentos Complementares",
}

interface Arquivo {
  tipo_arquivo: string
  nome_arquivo: string
  path_servidor: string
}

// Função utilitária para formatar datas do banco (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss.sssZ -> DD/MM/YYYY)
function formatarDataBanco(dataStr?: string) {
  if (!dataStr) return "—";
  // Extrai apenas a parte da data (YYYY-MM-DD)
  const match = dataStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return "—";
  const [, ano, mes, dia] = match;
  return `${dia}/${mes}/${ano}`;
}

export default function ConsultaProcessoCompra() {
  const [dadosOriginais, setDadosOriginais] = useState<any[]>([])
  const [dados, setDados] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<any>(null)
  const [filtros, setFiltros] = useState({
    tipo_edital: "",
    tipo_publicacao: "",
    numero_processo: "",
    numero_sei: "",
    objeto: "",
    data_abertura: "",
  })
  const modalBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/processo_compra")
      .then(res => res.json())
      .then(json => setDadosOriginais(Array.isArray(json) ? json : json.data))
  }, [])

useEffect(() => {
  let filtrado = dadosOriginais
  if (filtros.tipo_edital) {
    filtrado = filtrado.filter(item => String(item.tipo_edital) === filtros.tipo_edital)
  }
  if (filtros.tipo_publicacao) {
    filtrado = filtrado.filter(item => String(item.tipo_publicacao) === filtros.tipo_publicacao)
  }
  if (filtros.numero_processo) {
    const termo = filtros.numero_processo.trim().toLowerCase()
    filtrado = filtrado.filter(item =>
      item.numero_processo?.toLowerCase().includes(termo)
    )
  }
  if (filtros.numero_sei) {
    const termo = filtros.numero_sei.trim().toLowerCase()
    filtrado = filtrado.filter(item =>
      item.numero_sei?.toLowerCase().includes(termo)
    )
  }
 if (filtros.objeto) {
  const termo = filtros.objeto.trim().toLowerCase()
  filtrado = filtrado.filter(item =>
    item.objeto?.toLowerCase().includes(termo)
  )
}

  if (filtros.data_abertura) {
    filtrado = filtrado.filter(item =>
      item.data_abertura?.startsWith(filtros.data_abertura)
    )
  }

  // Ordenação por data_abertura DESC e depois por id DESC
  filtrado = [...filtrado].sort((a, b) => {
    // Garante que datas nulas ou inválidas fiquem por último
    const dataA = a.data_abertura ? Date.parse(a.data_abertura) : -Infinity
    const dataB = b.data_abertura ? Date.parse(b.data_abertura) : -Infinity
    if (dataB !== dataA) {
      return dataB - dataA // data_abertura DESC
    }
    return (b.id ?? 0) - (a.id ?? 0) // id DESC
  })

  setDados(filtrado)
}, [filtros, dadosOriginais])

  function openModal(item: any) {
    setModalData(item)
    setModalOpen(true)
  }
  function closeModal() {
    setModalOpen(false)
    setModalData(null)
  }
  function handleBgClick(e: any) {
    if (e.target === modalBgRef.current) closeModal()
  }


  return (
    <div className="w-full px-0 py-8">
      {/* Card de filtros ocupa toda a largura */}
     
<div className="bg-white border border-gray-200 rounded-xl shadow px-6 py-6 mb-8 w-full max-w-6xl mx-auto">
  {/* Cabeçalho ícone + texto horizontal centralizado com ícone pequeno */}
  <div className="flex justify-center items-center gap-2 mb-6">
    <svg className="w-4 h-4 text-[#3A8144]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 32 32">
      <circle cx={14} cy={14} r={10} stroke="currentColor" strokeWidth={2.3} />
      <line x1={22} y1={22} x2={29} y2={29} stroke="currentColor" strokeWidth={2.3} strokeLinecap="round" />
    </svg>
    <span className="text-[#3A8144] text-base font-semibold">Filtros de Busca</span>
  </div>

  {/* Grid com labels */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
    {/* Tipo do Edital */}
    <div>
      <label className="text-sm text-gray-700 font-medium mb-1 block">Tipo do Edital</label>
      <select
        className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-[#3A8144] focus:border-[#3A8144]"
        value={filtros.tipo_edital}
        onChange={e => setFiltros(f => ({ ...f, tipo_edital: e.target.value }))}
      >
        <option value="">Selecione</option>
        {Object.entries(mapTipoEdital).map(([k, v]) => (
          <option value={k} key={k}>{v}</option>
        ))}
      </select>
    </div>

    {/* Tipo de Publicação */}
    <div>
      <label className="text-sm text-gray-700 font-medium mb-1 block">Tipo de Publicação</label>
      <select
        className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-[#3A8144] focus:border-[#3A8144]"
        value={filtros.tipo_publicacao}
        onChange={e => setFiltros(f => ({ ...f, tipo_publicacao: e.target.value }))}
      >
        <option value="">Selecione</option>
        {Object.entries(mapTipoPublicacao).map(([k, v]) => (
          <option value={k} key={k}>{v}</option>
        ))}
      </select>
    </div>

    <div>
  <label className="text-sm text-gray-700 font-medium mb-1 block">Número do Processo</label>
  <input
    className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full placeholder-[#3A8144] focus:ring-2 focus:ring-[#3A8144] focus:border-[#3A8144]"
    value={filtros.numero_processo}
    onChange={e => setFiltros(f => ({ ...f, numero_processo: e.target.value }))}
    placeholder="Número do Processo"
  />
</div>

{/* Número do SEI */}
<div>
  <label className="text-sm text-gray-700 font-medium mb-1 block">Número do SEI</label>
  <input
    className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full placeholder-[#3A8144] focus:ring-2 focus:ring-[#3A8144] focus:border-[#3A8144]"
    value={filtros.numero_sei}
    onChange={e => setFiltros(f => ({ ...f, numero_sei: e.target.value }))}
    placeholder="Número do SEI"
  />
</div>
{/* Objeto */}
<div>
  <label className="text-sm text-gray-700 font-medium mb-1 block">Objeto</label>
  <input
    className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full"
    value={filtros.objeto}
    onChange={e => setFiltros(f => ({ ...f, objeto: e.target.value }))}
    placeholder="Objeto"
  />
</div>



    {/* Data da Abertura / Ratificação */}
    <div>
      <label className="text-sm text-gray-700 font-medium mb-1 block">Data da Abertura / Ratificação</label>
      <input
        type="date"
        className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-[#3A8144] focus:border-[#3A8144]"
        value={filtros.data_abertura}
        onChange={e => setFiltros(f => ({ ...f, data_abertura: e.target.value }))}
      />
    </div>

    {/* Botão Limpar com borda arredondada */}
    <div className="flex items-end justify-start pt-2">
    <button
      className="bg-[#3A8144] hover:bg-[#25622c] text-white text-sm font-semibold px-6 py-1.5 rounded-full shadow-sm transition mt-2"
      onClick={() => setFiltros({
        tipo_edital: "",
        tipo_publicacao: "",
        numero_processo: "",
        numero_sei: "",
        objeto: "",
        data_abertura: "",
      })}
      type="button"
    >
      Limpar Pesquisa
    </button>
  </div>
  </div>
</div>

      {/* Listagem de processos em cards horizontais */}
      <div className="flex flex-col gap-8">
        {dados.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-2xl px-8 py-6 shadow-lg flex flex-col relative overflow-hidden transition w-full max-w-6xl mx-auto"
          >
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-base text-gray-700">
                  <b>Tipo do Edital:</b> <span className="text-[#3A8144]">{mapTipoEdital[String(item.tipo_edital)] || "Processo"}</span>
                </span>
                <span className="font-semibold text-base text-gray-700">
                  <b>Tipo da Publicação:</b>{" "}
                  <span className="text-[#3A8144]">
                    {mapTipoPublicacao[String(item.tipo_publicacao)] || "—"}
                  </span>
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <span><b>Número do Processo:</b> {item.numero_processo || <span className="text-gray-400">—</span>}</span>
                <span><b>Número do SEI:</b> {item.numero_sei || <span className="text-gray-400">—</span>}</span>
              </div>
              <div className="flex flex-col mt-2">
                <span className="font-semibold text-gray-700">Objeto:</span>
                <span className="text-gray-800 text-sm leading-relaxed break-words">{item.objeto}</span>
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-sm">
                <span>
                  <b>Data da Retificação:</b>{" "}
                  <span className="text-gray-700">
                    {formatarDataBanco(item.data_retificacao)}
                  </span>
                </span>
                <span>
                  <b>Data da Abertura:</b>{" "}
                  <span className="text-gray-700">
                    {formatarDataBanco(item.data_abertura)}
                  </span>
                </span>
                <span>
                  <b>Data de Fechamento:</b>{" "}
                  <span className="text-gray-700">
                    {formatarDataBanco(item.data_fechamento)}
                  </span>
                </span>
              </div>
            </div>
            {/* Arquivos */}
        
            {/* Rodapé do Card */}
            <div className="flex justify-between items-center mt-6">
              {/* Abrir em outra aba = primeiro anexo */}
            {Array.isArray(item.arquivos) && item.arquivos.length > 0 ? (
<ul className="text-sm text-gray-700">
  <li className="flex items-center gap-2">
    <span className="text-xl">📁</span>
    <a
      href={`https://epamigsistema.com/processo_compra/web/${item.arquivos[0].path_servidor.replace(/\\/g, '/')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="underline text-[#3A8144] hover:text-[#25622c] font-medium"
    >
      Acessar Arquivo
    </a>
  </li>
</ul>
) : (
  <span />
)}

              <button
                className="bg-[#3A8144] text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-[#25622c] transition focus:outline-none"
                onClick={() => openModal(item)}
              >
                Detalhes
              </button>
            </div>
          </div>
        ))}
        {dados.length === 0 && (
          <div className="text-center text-gray-500 py-8">Nenhum resultado encontrado.</div>
        )}
      </div>

     {/* Modal de Detalhes */}


{modalOpen && modalData && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="relative bg-white rounded-xl border-2 border-[#3A8144] shadow-2xl max-w-md w-full mx-2 flex flex-col">
      {/* Cabeçalho */}
      <div className="bg-[#3A8144] rounded-t-xl px-4 py-3 flex items-center">
        <h2 className="text-lg font-bold text-white">Detalhes do Processo</h2>
      </div>
      {/* Corpo */}
      <div className="p-4 text-base text-gray-800 flex flex-col gap-2">
        <div><b>Responsável:</b> {modalData.responsa?.nome || modalData.responsavel || "—"}</div>
        <div><b>Data da Publicação:</b> {modalData.data_cadastro ? new Date(modalData.data_cadastro).toLocaleDateString("pt-BR") : "—"}</div>
        <div><b>Data da Abertura:</b> {modalData.data_abertura ? new Date(modalData.data_abertura).toLocaleDateString("pt-BR") : "—"}</div>
        <div><b>Hora da Abertura:</b> {modalData.hora_abertura || "—"}</div>
        <div><b>Data de Fechamento:</b> {modalData.data_fechamento ? new Date(modalData.data_fechamento).toLocaleDateString("pt-BR") : "—"}</div>
        <div><b>Hora de Fechamento:</b> {modalData.hora_fechamento || "—"}</div>
        <div><b>Fonte:</b> {modalData.fonte || "—"}</div>
        {/* Botão de fechar alinhado à direita */}
        <div className="flex justify-end mt-6">
          <button
            onClick={closeModal}
            className="bg-[#dc2626] hover:bg-[#b91c1c] text-white text-base font-bold px-6 py-2 rounded-full shadow transition focus:outline-none"
            style={{ minWidth: 120, background: '#dc2626', color: '#fff' }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  )
}


