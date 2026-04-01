// relatório obrigatório totais por pessoa + linha de total geral.
import { useEffect, useState } from 'react'
import type { ApiError } from '../api/http'
import { relatoriosApi } from '../api/endpoints'
import type { TotaisPorPessoaResponse } from '../api/types'
import { ApiErrorBox } from '../components/ApiErrorBox'

export function TotaisPorPessoaPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [data, setData] = useState<TotaisPorPessoaResponse | null>(null)

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      setData(await relatoriosApi.totaisPorPessoa())
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
        <h1>Totais por pessoa</h1>
        <p className="muted">Receitas, despesas e saldo (receita − despesa), com total geral ao final.</p>
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
                <th>Pessoa</th>
                <th>Idade</th>
                <th className="right">Receitas</th>
                <th className="right">Despesas</th>
                <th className="right">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {data.pessoas.map((p) => (
                <tr key={p.pessoaId}>
                  <td>{p.nome}</td>
                  <td>{p.idade}</td>
                  <td className="right">{p.totalReceitas.toFixed(2)}</td>
                  <td className="right">{p.totalDespesas.toFixed(2)}</td>
                  <td className="right">{p.saldo.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={2} className="right">
                  Total geral
                </th>
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

