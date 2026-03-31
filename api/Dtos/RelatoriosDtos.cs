namespace Api.Dtos;

public sealed record TotaisPorPessoaItem(
    Guid PessoaId,
    string Nome,
    int Idade,
    decimal TotalReceitas,
    decimal TotalDespesas,
    decimal Saldo
);

public sealed record TotaisPorPessoaResponse(
    IReadOnlyList<TotaisPorPessoaItem> Pessoas,
    decimal TotalReceitasGeral,
    decimal TotalDespesasGeral,
    decimal SaldoLiquidoGeral
);

public sealed record TotaisPorCategoriaItem(
    Guid CategoriaId,
    string Descricao,
    decimal TotalReceitas,
    decimal TotalDespesas,
    decimal Saldo
);

public sealed record TotaisPorCategoriaResponse(
    IReadOnlyList<TotaisPorCategoriaItem> Categorias,
    decimal TotalReceitasGeral,
    decimal TotalDespesasGeral,
    decimal SaldoLiquidoGeral
);

