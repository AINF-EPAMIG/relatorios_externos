import Image from 'next/image'

export function DashboardHeader() {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex flex-col items-center md:flex-row justify-between">
        {/* Logo */}
        <div className="relative h-20 w-52 md:h-16 md:w-48">
          <Image
            src="/epamig_logo.svg"
            alt="EPAMIG Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Título e descrição centralizada */}
        <div className="flex flex-col items-center justify-center text-center mt-4 md:mt-0">
          <h1 className="text-green-700 text-lg md:text-2xl font-semibold leading-tight">
            Empresa de Pesquisa Agropecuária de Minas Gerais
          </h1>
          <p className="text-xs md:text-base text-gray-800 font-bold">
            Secretaria de Estado de Agricultura, Pecuária e Abastecimento de Minas Gerais
          </p>
        </div>

        {/* Links do topo direito */}
<div className="flex items-center gap-4 mt-3 md:mt-0">
  <a
    href="https://www.epamig.br"
    target="_blank"
    className="bg-[#3A8144] text-white font-bold py-2 px-4 rounded-[10px] hover:scale-105 transition"
  >
    Site
  </a>

  <a
    href="https://mail.google.com/mail/u/0/#inbox"
    target="_blank"
    className="bg-[#3A8144] text-white font-bold py-2 px-4 rounded-[10px] hover:scale-105 transition"
  >
    E-mail
  </a>

  <a
    href="https://empresade125369.rm.cloudtotvs.com.br/Corpore.Net/Login.aspx"
    target="_blank"
    className="bg-[#3A8144] text-white font-bold py-2 px-4 rounded-[10px] hover:scale-105 transition"
  >
    Portal ADM
  </a>
</div>

      </div>
            <div className="border-t-4 border-green-700"></div> {/* Linha de separação abaixo do header */}

    </header>
  )
}