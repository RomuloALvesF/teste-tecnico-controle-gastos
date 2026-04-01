// Cadastro de pessoa listar, criar, editar e excluir a API remove as transações em cascata.
import { useEffect, useMemo, useState } from 'react'
import type { ApiError } from '../api/http'
import { pessoasApi } from '../api/endpoints'
import type { Pessoa } from '../api/types'
import { ApiErrorBox } from '../components/ApiErrorBox'

type FormState = { nome: string; idade: string }

export function PessoasPage() {
  const [items, setItems] = useState<Pessoa[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const [creating, setCreating] = useState<FormState>({ nome: '', idade: '' })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editing, setEditing] = useState<FormState>({ nome: '', idade: '' })

  const editingItem = useMemo(
    () => (editingId ? items.find((p) => p.id === editingId) ?? null : null),
    [editingId, items],
  )

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      setItems(await pessoasApi.list())
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
      const idade = Number(creating.idade)
      await pessoasApi.create({ nome: creating.nome, idade })
      setCreating({ nome: '', idade: '' })
      await refresh()
    } catch (e) {
      setError(e as ApiError)
    }
  }

  async function onStartEdit(p: Pessoa) {
    setEditingId(p.id)
    setEditing({ nome: p.nome, idade: String(p.idade) })
  }

  async function onSaveEdit() {
    if (!editingId) return
    setError(null)
    try {
      const idade = Number(editing.idade)
      await pessoasApi.update(editingId, { nome: editing.nome, idade })
      setEditingId(null)
      await refresh()
    } catch (e) {
      setError(e as ApiError)
    }
  }

  async function onDelete(id: string) {
    const ok = confirm('Excluir esta pessoa? (as transações dela serão apagadas)')
    if (!ok) return
    setError(null)
    try {
      await pessoasApi.remove(id)
      if (editingId === id) setEditingId(null)
      await refresh()
    } catch (e) {
      setError(e as ApiError)
    }
  }

  return (
    <div className="page">
      <header className="pageHeader">
        <h1>Pessoas</h1>
        <p className="muted">CRUD completo. Ao excluir uma pessoa, as transações são removidas em cascata.</p>
      </header>

      <ApiErrorBox error={error} />

      <section className="card">
        <h2>Criar</h2>
        <div className="grid2">
          <label>
            <span>Nome</span>
            <input
              value={creating.nome}
              onChange={(e) => setCreating((s) => ({ ...s, nome: e.target.value }))}
              maxLength={200}
            />
          </label>
          <label>
            <span>Idade</span>
            <input
              value={creating.idade}
              onChange={(e) => setCreating((s) => ({ ...s, idade: e.target.value }))}
              inputMode="numeric"
            />
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
              <th>Nome</th>
              <th>Idade</th>
              <th className="right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td>{p.nome}</td>
                <td>{p.idade}</td>
                <td className="right">
                  <button className="secondary" onClick={() => onStartEdit(p)}>
                    Editar
                  </button>{' '}
                  <button className="danger" onClick={() => onDelete(p.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {!items.length && !loading ? (
              <tr>
                <td colSpan={3} className="muted">
                  Nenhuma pessoa cadastrada.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>

      {editingId ? (
        <section className="card">
          <h2>Editar</h2>
          <div className="muted">
            Id: <span className="mono">{editingId}</span>
            {editingItem ? (
              <>
                {' '}
                (atual: <strong>{editingItem.nome}</strong>)
              </>
            ) : null}
          </div>
          <div className="grid2">
            <label>
              <span>Nome</span>
              <input
                value={editing.nome}
                onChange={(e) => setEditing((s) => ({ ...s, nome: e.target.value }))}
                maxLength={200}
              />
            </label>
            <label>
              <span>Idade</span>
              <input
                value={editing.idade}
                onChange={(e) => setEditing((s) => ({ ...s, idade: e.target.value }))}
                inputMode="numeric"
              />
            </label>
          </div>
          <div className="row">
            <button onClick={onSaveEdit} disabled={loading}>
              Salvar alterações
            </button>
            <button className="secondary" onClick={() => setEditingId(null)} disabled={loading}>
              Cancelar
            </button>
          </div>
        </section>
      ) : null}
    </div>
  )
}

