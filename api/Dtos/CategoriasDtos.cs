using Api.Domain;

namespace Api.Dtos;

public sealed record CategoriaCreateRequest(string Descricao, FinalidadeCategoria Finalidade);

public sealed record CategoriaResponse(Guid Id, string Descricao, FinalidadeCategoria Finalidade);

