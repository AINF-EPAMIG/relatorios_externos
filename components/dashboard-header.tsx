import Link from "next/link"
import { Globe, Mail, LayoutDashboard } from "lucide-react"
import Image from 'next/image'

export function DashboardHeader() {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="flex h-20 items-center px-4 md:px-6 justify-between w-full">

        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/epamig.jpg" alt="EPAMIG Logo" width={56} height={56} />
          </Link>
        </div>

        {/* Título Central */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
          <h1 className="text-lg font-semibold text-[#3A8144]">
            Empresa de Pesquisa Agropecuária de Minas Gerais
          </h1>
          <p className="text-sm font-semibold text-black">
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
    </header>
  )
}
