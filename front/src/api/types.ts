// Com erasableSyntaxOnly no TS enumnão é ideal (gera JS) usei constantes alinhadas aos números da API
export const TipoTransacao = {
  Despesa: 1,
  Receita: 2,
} as const
export type TipoTransacao = (typeof TipoTransacao)[keyof typeof TipoTransacao]

export const FinalidadeCategoria = {
  Despesa: 1,
  Receita: 2,
  Ambas: 3,
} as const
export type FinalidadeCategoria =
  (typeof FinalidadeCategoria)[keyof typeof FinalidadeCategoria]

export type Pessoa = {
  id: string
  nome: string
  idade: number
}

export type Categoria = {
  id: string
  descricao: string
  finalidade: FinalidadeCategoria
}

export type Transacao = {
  id: string
  descricao: string
  valor: number
  tipo: TipoTransacao
  categoriaId: string
  categoriaDescricao: string
  pessoaId: string
  pessoaNome: string
}

export type TotaisPorPessoaItem = {
  pessoaId: string
  nome: string
  idade: number
  totalReceitas: number
  totalDespesas: number
  saldo: number
}

export type TotaisPorPessoaResponse = {
  pessoas: TotaisPorPessoaItem[]
  totalReceitasGeral: number
  totalDespesasGeral: number
  saldoLiquidoGeral: number
}

export type TotaisPorCategoriaItem = {
  categoriaId: string
  descricao: string
  totalReceitas: number
  totalDespesas: number
  saldo: number
}

export type TotaisPorCategoriaResponse = {
  categorias: TotaisPorCategoriaItem[]
  totalReceitasGeral: number
  totalDespesasGeral: number
  saldoLiquidoGeral: number
}

