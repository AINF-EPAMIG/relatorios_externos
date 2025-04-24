import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      {/* Conteúdo principal */}
      <div className="flex-grow p-8 flex flex-col items-center justify-center">
        
        <div className="flex gap-4">

        </div>
      </div>

      <Footer />
    </main>
  )
}
