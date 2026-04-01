// rotas da API agrupadas por recurso pessoas, categorias, transações, relatórios).
import { apiDelete, apiGet, apiPost, apiPut } from './http'
import type { Categoria, Pessoa, TotaisPorCategoriaResponse, TotaisPorPessoaResponse, Transacao } from './types'

export const pessoasApi = {
  list: () => apiGet<Pessoa[]>('/pessoas'),
  create: (payload: { nome: string; idade: number }) => apiPost<Pessoa>('/pessoas', payload),
  update: (id: string, payload: { nome: string; idade: number }) =>
    apiPut<Pessoa>(`/pessoas/${id}`, payload),
  remove: (id: string) => apiDelete(`/pessoas/${id}`),
}

export const categoriasApi = {
  list: () => apiGet<Categoria[]>('/categorias'),
  create: (payload: { descricao: string; finalidade: number }) =>
    apiPost<Categoria>('/categorias', payload),
}

export const transacoesApi = {
  list: () => apiGet<Transacao[]>('/transacoes'),
  create: (payload: {
    descricao: string
    valor: number
    tipo: number
    categoriaId: string
    pessoaId: string
  }) => apiPost<Transacao>('/transacoes', payload),
}

export const relatoriosApi = {
  totaisPorPessoa: () => apiGet<TotaisPorPessoaResponse>('/relatorios/totais-por-pessoa'),
  totaisPorCategoria: () => apiGet<TotaisPorCategoriaResponse>('/relatorios/totais-por-categoria'),
}

