// Relatório opcional totais por categoria + total geral.
import { useEffect, useState } from 'react'
import type { ApiError } from '../api/http'
import { relatoriosApi } from '../api/endpoints'
import type { TotaisPorCategoriaResponse } from '../api/types'
import { ApiErrorBox } from '../components/ApiErrorBox'

export function TotaisPorCategoriaPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [data, setData] = useState<TotaisPorCategoriaResponse | null>(null)

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      setData(await relatoriosApi.totaisPorCategoria())
    } catch (e) {
      setError(e as ApiError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <div className="page">
      <header className="pageHeader">
        <h1>Totais por categoria (opcional)</h1>
        <p className="muted">Mesmo conceito do relatório por pessoa, agrupando por categoria.</p>
      </header>

      <ApiErrorBox error={error} />

      <section className="card">
        <div className="row">
          <h2>Relatório</h2>
          <button className="secondary" onClick={refresh} disabled={loading}>
            Atualizar
          </button>
        </div>

        {loading ? <div className="muted">Carregando…</div> : null}

        {data ? (
          <table className="table">
            <thead>
              <tr>
                <th>Categoria</th>
                <th className="right">Receitas</th>
                <th className="right">Despesas</th>
                <th className="right">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {data.categorias.map((c) => (
                <tr key={c.categoriaId}>
                  <td>{c.descricao}</td>
                  <td className="right">{c.totalReceitas.toFixed(2)}</td>
                  <td className="right">{c.totalDespesas.toFixed(2)}</td>
                  <td className="right">{c.saldo.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th className="right">Total geral</th>
                <th className="right">{data.totalReceitasGeral.toFixed(2)}</th>
                <th className="right">{data.totalDespesasGeral.toFixed(2)}</th>
                <th className="right">{data.saldoLiquidoGeral.toFixed(2)}</th>
              </tr>
            </tfoot>
          </table>
        ) : (
          <div className="muted">Sem dados ainda.</div>
        )}
      </section>
    </div>
  )
}

