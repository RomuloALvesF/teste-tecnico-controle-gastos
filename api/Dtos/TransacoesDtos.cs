using Api.Domain;

namespace Api.Dtos;

public sealed record TransacaoCreateRequest(
    string Descricao,
    decimal Valor,
    TipoTransacao Tipo,
    Guid CategoriaId,
    Guid PessoaId
);

public sealed record TransacaoResponse(
    Guid Id,
    string Descricao,
    decimal Valor,
    TipoTransacao Tipo,
    Guid CategoriaId,
    string CategoriaDescricao,
    Guid PessoaId,
    string PessoaNome
);

