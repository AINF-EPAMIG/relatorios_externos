import Link from "next/link"
import { Globe, Mail, LayoutDashboard } from "lucide-react"
import Image from 'next/image'

export function DashboardHeader() {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="flex h-20 items-center px-4 md:px-6 justify-between w-full">

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

        {/* Ações */}
        <div className="ml-auto flex items-center gap-2">
          <Link href="#" className="flex items-center gap-2 px-3 py-1.5 rounded-md text-white bg-[#3A8144] hover:bg-[#2f6b39] transition text-sm font-medium">
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">Site</span>
          </Link>
          <Link href="#" className="flex items-center gap-2 px-3 py-1.5 rounded-md text-white bg-[#3A8144] hover:bg-[#2f6b39] transition text-sm font-medium">
            <Mail className="h-4 w-4" />
            <span className="hidden md:inline">E-mail</span>
          </Link>
          <Link href="#" className="flex items-center gap-2 px-3 py-1.5 rounded-md text-white bg-[#3A8144] hover:bg-[#2f6b39] transition text-sm font-medium">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden md:inline">Portal ADM</span>
          </Link>
        </div>
      </div>


            <div className="border-t-4 border-green-700"></div> {/* Linha de separação abaixo do header */}

    </header>
  )
}