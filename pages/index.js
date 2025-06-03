// pages/index.js
import fs from 'fs'
import path from 'path'
import { useState } from 'react'

export async function getStaticProps() {
  const guiasDir = path.join(process.cwd(), 'public', 'guias')
  let files = []

  try {
    files = fs.readdirSync(guiasDir).filter(f => f.endsWith('.pdf'))
  } catch (e) {
    console.log('No se pudo leer la carpeta guias:', e)
  }

  return {
    props: { files },
  }
}

export default function Home({ files }) {
  const [copied, setCopied] = useState(null)

  const baseUrl = 'https://guias.vitahub.mx/guias'

  const copyToClipboard = (file) => {
    const url = `${baseUrl}/${file}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(file)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Lista de Guías PDF</h1>
      {files.length === 0 && <p>No hay PDFs en la carpeta guias.</p>}
      <ul>
        {files.map((file) => (
          <li key={file} style={{ marginBottom: 10 }}>
            {file}{' '}
            <button onClick={() => copyToClipboard(file)}>
              {copied === file ? 'Copiado!' : 'Copiar URL'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
