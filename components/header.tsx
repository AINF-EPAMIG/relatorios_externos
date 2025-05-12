"use client";

import Image from "next/image";
import Link from "next/link";
import { Globe, User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      {/* Topo do header com logo e título */}
      <div className="container mx-auto px-4 py-3 flex flex-col items-center md:flex-row justify-between">
        {/* Logo */}
        <div>
          <Image
            src="/epamig_logo.svg"
            alt="EPAMIG Logo"
            width={180}
            height={60}
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
        <div className="flex gap-3 md:gap-4 mt-3 md:mt-0">
          <Link
            href="https://epamig.br"
            className="flex items-center gap-2 text-sm text-white bg-green-700 hover:bg-green-800 px-4 py-2 rounded-md transition-all duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Globe size={18} />
            <span>Site</span>
          </Link>
          {session ? (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 text-sm text-white bg-green-700 hover:bg-green-800 px-4 py-2 rounded-md transition-all duration-300"
            >
              <User size={18} />
              <span>Sair</span>
            </button>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="flex items-center gap-2 text-sm text-white bg-green-700 hover:bg-green-800 px-4 py-2 rounded-md transition-all duration-300"
            >
              <User size={18} />
              <span>Login Google</span>
            </button>
          )}
        </div>
      </div>

      {/* Linha de separação verde visível */}
      <div className="h-1 bg-green-700 w-full"></div>
    </header>
  );
}
