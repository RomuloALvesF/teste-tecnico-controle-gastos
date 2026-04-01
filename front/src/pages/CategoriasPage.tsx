// ategorias criar e listar a finalidade define quais tipos de transação podem usar cada categoria
import { useEffect, useState } from 'react'
import type { ApiError } from '../api/http'
import { categoriasApi } from '../api/endpoints'
import { FinalidadeCategoria, type Categoria } from '../api/types'
import { ApiErrorBox } from '../components/ApiErrorBox'

function finalidadeLabel(v: FinalidadeCategoria) {
  switch (v) {
    case FinalidadeCategoria.Despesa:
      return 'Despesa'
    case FinalidadeCategoria.Receita:
      return 'Receita'
    case FinalidadeCategoria.Ambas:
      return 'Ambas'
    default:
      return String(v)
  }
}

export function CategoriasPage() {
  const [items, setItems] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const [descricao, setDescricao] = useState('')
  const [finalidade, setFinalidade] = useState<FinalidadeCategoria>(FinalidadeCategoria.Despesa)

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      setItems(await categoriasApi.list())
    } catch (e) {
      setError(e as ApiError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function onCreate() {
    setError(null)
    try {
      await categoriasApi.create({ descricao, finalidade })
      setDescricao('')
      setFinalidade(FinalidadeCategoria.Despesa)
      await refresh()
    } catch (e) {
      setError(e as ApiError)
    }
  }

  return (
    <div className="page">
      <header className="pageHeader">
        <h1>Categorias</h1>
        <p className="muted">
          A finalidade restringe quais categorias podem ser usadas em transações de despesa/receita.
        </p>
      </header>

      <ApiErrorBox error={error} />

      <section className="card">
        <h2>Criar</h2>
        <div className="grid2">
          <label>
            <span>Descrição</span>
            <input value={descricao} onChange={(e) => setDescricao(e.target.value)} maxLength={400} />
          </label>
          <label>
            <span>Finalidade</span>
            <select
              value={finalidade}
              onChange={(e) => setFinalidade(Number(e.target.value) as FinalidadeCategoria)}
            >
              <option value={FinalidadeCategoria.Despesa}>Despesa</option>
              <option value={FinalidadeCategoria.Receita}>Receita</option>
              <option value={FinalidadeCategoria.Ambas}>Ambas</option>
            </select>
          </label>
        </div>
        <button onClick={onCreate} disabled={loading}>
          Salvar
        </button>
      </section>

      <section className="card">
        <h2>Lista</h2>
        {loading ? <div className="muted">Carregando…</div> : null}
        <table className="table">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Finalidade</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}>
                <td>{c.descricao}</td>
                <td>{finalidadeLabel(c.finalidade)}</td>
              </tr>
            ))}
            {!items.length && !loading ? (
              <tr>
                <td colSpan={2} className="muted">
                  Nenhuma categoria cadastrada.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </div>
  )
}

