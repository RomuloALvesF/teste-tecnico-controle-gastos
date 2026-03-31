namespace Api.Dtos;

public sealed record PessoaCreateRequest(string Nome, int Idade);

public sealed record PessoaUpdateRequest(string Nome, int Idade);

public sealed record PessoaResponse(Guid Id, string Nome, int Idade);

