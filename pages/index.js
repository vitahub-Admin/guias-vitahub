// pages/index.js
import fs from 'fs'
import path from 'path'
import { useState } from 'react'

export async function getStaticProps() {
  const guiasDir = path.join(process.cwd(), 'public', 'guias')
  let files = []

  try {
    const fileData = fs
      .readdirSync(guiasDir)
      .filter(f => f.endsWith('.pdf'))
      .map(f => {
        const fullPath = path.join(guiasDir, f)
        const stats = fs.statSync(fullPath)
        return {
          name: f,
          createdAt: stats.mtime,
        }
      })

    // Más viejo arriba (ascendente)
    fileData.sort((a, b) => a.createdAt - b.createdAt)

    files = fileData.map(f => f.name)
  } catch (e) {
    console.log('No se pudo leer la carpeta guias:', e)
  }

  return {
    props: { files },
  }
}

export default function Home({ files }) {
  const [copied, setCopied] = useState(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 30

  const baseUrl = 'https://guias.vitahub.mx/guias'

  const copyToClipboard = (file) => {
    const url = `${baseUrl}/${file}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(file)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  // Filtrar resultados por búsqueda
  const filtered = files.filter((file) =>
    file.toLowerCase().includes(search.toLowerCase())
  )

  // Paginación
  const totalPages = Math.ceil(filtered.length / perPage)
  const startIndex = (page - 1) * perPage
  const visible = filtered.slice(startIndex, startIndex + perPage)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-900">
          👉Lista de Guías PDF 👈 
        </h1>

        <input
          type="text"
          placeholder="Buscar guía por n° de Orden ..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {visible.length === 0 ? (
          <p className="text-center text-gray-500">No hay PDFs disponibles.</p>
        ) : (
          <ul className="space-y-3">
            {visible.map((file) => (
              <li
                key={file}
                className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition rounded-lg px-3 py-1"
              >
                <span className="truncate">{file}</span>
                <button
                  onClick={() => copyToClipboard(file)}
                  className={`px-3 py-1 text-sm rounded-lg transition ${
                    copied === file
                      ? 'bg-green-500 text-white'
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  }`}
                >
                  {copied === file ? 'Copiado!' : 'Copiar URL'}
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-40"
            >
              ←
            </button>
            <span className="text-gray-700">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-40"
            >
              →
            </button>
          </div>
        )}
      </div>

      <footer className="mt-10 text-sm text-gray-400">
        © {new Date().getFullYear()} Vitahub — Guías PDF 😛
      </footer>
    </div>
  )
}
