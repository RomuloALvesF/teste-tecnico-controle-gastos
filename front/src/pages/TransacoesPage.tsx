// Lançamentos criar e listar, o front ajuda a filtrar categorias compatíveis, mas a API valida tudo.
import { useEffect, useMemo, useState } from 'react'
import type { ApiError } from '../api/http'
import { categoriasApi, pessoasApi, transacoesApi } from '../api/endpoints'
import {
  FinalidadeCategoria,
  TipoTransacao,
  type Categoria,
  type Pessoa,
  type Transacao,
} from '../api/types'
import { ApiErrorBox } from '../components/ApiErrorBox'

function tipoLabel(v: TipoTransacao) {
  switch (v) {
    case TipoTransacao.Despesa:
      return 'Despesa'
    case TipoTransacao.Receita:
      return 'Receita'
    default:
      return String(v)
  }
}

export function TransacoesPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [transacoes, setTransacoes] = useState<Transacao[]>([])

  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [tipo, setTipo] = useState<TipoTransacao>(TipoTransacao.Despesa)
  const [pessoaId, setPessoaId] = useState('')
  const [categoriaId, setCategoriaId] = useState('')

  const pessoaSelecionada = useMemo(
    () => pessoas.find((p) => p.id === pessoaId) ?? null,
    [pessoaId, pessoas],
  )

  const categoriasCompatíveis = useMemo(() => {
    return categorias.filter((c) => {
      if (c.finalidade === FinalidadeCategoria.Ambas) return true
      if (tipo === TipoTransacao.Despesa) return c.finalidade === FinalidadeCategoria.Despesa
      return c.finalidade === FinalidadeCategoria.Receita
    })
  }, [categorias, tipo])

  async function refreshAll() {
    setLoading(true)
    setError(null)
    try {
      const [ps, cs, ts] = await Promise.all([
        pessoasApi.list(),
        categoriasApi.list(),
        transacoesApi.list(),
      ])
      setPessoas(ps)
      setCategorias(cs)
      setTransacoes(ts)
    } catch (e) {
      setError(e as ApiError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshAll()
  }, [])

  // Menor de 18 só pode despesa se a pessoa mudar e isso ficar inválido, voltamos para Despesa a API barra receita mesmo assim.
  useEffect(() => {
    if (pessoaSelecionada && pessoaSelecionada.idade < 18 && tipo === TipoTransacao.Receita) {
      setTipo(TipoTransacao.Despesa)
    }
  }, [pessoaSelecionada, tipo])

  // Trocou o tipo a categoria antiga pode não servir mais aí limpamos o campo para o usuário escolher de novo.
  useEffect(() => {
    if (categoriaId && !categoriasCompatíveis.some((c) => c.id === categoriaId)) {
      setCategoriaId('')
    }
  }, [categoriaId, categoriasCompatíveis])

  async function onCreate() {
    setError(null)
    try {
      await transacoesApi.create({
        descricao,
        valor: Number(valor),
        tipo,
        pessoaId,
        categoriaId,
      })
      setDescricao('')
      setValor('')
      setCategoriaId('')
      await refreshAll()
    } catch (e) {
      setError(e as ApiError)
    }
  }

  const bloqueiaReceita = pessoaSelecionada ? pessoaSelecionada.idade < 18 : false

  return (
    <div className="page">
      <header className="pageHeader">
        <h1>Transações</h1>
        <p className="muted">
          Regras: valor positivo; menor de 18 apenas despesa; categoria deve ser compatível com o tipo.
        </p>
      </header>

      <ApiErrorBox error={error} />

      <section className="card">
        <h2>Criar</h2>
        <div className="grid2">
          <label>
            <span>Pessoa</span>
            <select value={pessoaId} onChange={(e) => setPessoaId(e.target.value)}>
              <option value="">Selecione…</option>
              {pessoas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} ({p.idade})
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Tipo</span>
            <select value={tipo} onChange={(e) => setTipo(Number(e.target.value) as TipoTransacao)}>
              <option value={TipoTransacao.Despesa}>Despesa</option>
              <option value={TipoTransacao.Receita} disabled={bloqueiaReceita}>
                Receita{bloqueiaReceita ? ' (bloqueado para menor)' : ''}
              </option>
            </select>
          </label>

          <label className="full">
            <span>Descrição</span>
            <input value={descricao} onChange={(e) => setDescricao(e.target.value)} maxLength={400} />
          </label>

          <label>
            <span>Valor</span>
            <input value={valor} onChange={(e) => setValor(e.target.value)} inputMode="decimal" />
          </label>

          <label>
            <span>Categoria</span>
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
              <option value="">Selecione…</option>
              {categoriasCompatíveis.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.descricao}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          onClick={onCreate}
          disabled={loading || !pessoaId || !categoriaId || !descricao.trim() || !valor.trim()}
        >
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
              <th>Tipo</th>
              <th>Categoria</th>
              <th>Pessoa</th>
              <th className="right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {transacoes.map((t) => (
              <tr key={t.id}>
                <td>{t.descricao}</td>
                <td>{tipoLabel(t.tipo)}</td>
                <td>{t.categoriaDescricao}</td>
                <td>{t.pessoaNome}</td>
                <td className="right">{t.valor.toFixed(2)}</td>
              </tr>
            ))}
            {!transacoes.length && !loading ? (
              <tr>
                <td colSpan={5} className="muted">
                  Nenhuma transação cadastrada.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </div>
  )
}

