using Api.Domain;
using Api.Dtos;
using Api.Infrastructure;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Api.Endpoints;

public static class PessoasEndpoints
{
    public static RouteGroupBuilder MapPessoasEndpoints(this RouteGroupBuilder routes)
    {
        var group = routes.MapGroup("/pessoas").WithTags("Pessoas");

        group.MapGet("/", async (AppDbContext db, CancellationToken ct) =>
        {
            var pessoas = await db.Pessoas
                .AsNoTracking()
                .OrderBy(p => p.Nome)
                .Select(p => new PessoaResponse(p.Id, p.Nome, p.Idade))
                .ToListAsync(ct);

            return Results.Ok(pessoas);
        });

        group.MapPost("/", async Task<Results<Created<PessoaResponse>, ValidationProblem>> (
            PessoaCreateRequest request,
            AppDbContext db,
            CancellationToken ct) =>
        {
            var errors = ValidatePessoa(request.Nome, request.Idade);
            if (errors is not null)
            {
                return TypedResults.ValidationProblem(errors);
            }

            var pessoa = new Pessoa
            {
                Nome = request.Nome.Trim(),
                Idade = request.Idade
            };

            db.Pessoas.Add(pessoa);
            await db.SaveChangesAsync(ct);

            return TypedResults.Created($"/pessoas/{pessoa.Id}", new PessoaResponse(pessoa.Id, pessoa.Nome, pessoa.Idade));
        });

        group.MapPut("/{id:guid}", async Task<Results<Ok<PessoaResponse>, NotFound, ValidationProblem>> (
            Guid id,
            PessoaUpdateRequest request,
            AppDbContext db,
            CancellationToken ct) =>
        {
            var pessoa = await db.Pessoas.FirstOrDefaultAsync(p => p.Id == id, ct);
            if (pessoa is null)
            {
                return TypedResults.NotFound();
            }

            var errors = ValidatePessoa(request.Nome, request.Idade);
            if (errors is not null)
            {
                return TypedResults.ValidationProblem(errors);
            }

            pessoa.Nome = request.Nome.Trim();
            pessoa.Idade = request.Idade;

            await db.SaveChangesAsync(ct);

            return TypedResults.Ok(new PessoaResponse(pessoa.Id, pessoa.Nome, pessoa.Idade));
        });

        group.MapDelete("/{id:guid}", async Task<Results<NoContent, NotFound>> (
            Guid id,
            AppDbContext db,
            CancellationToken ct) =>
        {
            var pessoa = await db.Pessoas.FirstOrDefaultAsync(p => p.Id == id, ct);
            if (pessoa is null)
            {
                return TypedResults.NotFound();
            }

            // Regra de negóci ao excluir uma pessoa todas as transações dela devem ser removidas.
            // Isso é garantido pelo cascade delete configurado no mapeamento do EF Core no ver AppDbContext
            db.Pessoas.Remove(pessoa);
            await db.SaveChangesAsync(ct);

            return TypedResults.NoContent();
        });

        return routes;
    }

    private static Dictionary<string, string[]>? ValidatePessoa(string nome, int idade)
    {
        var errors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(nome))
        {
            errors["nome"] = ["Nome é obrigatório."];
        }
        else if (nome.Trim().Length > 200)
        {
            errors["nome"] = ["Nome deve ter no máximo 200 caracteres."];
        }

        if (idade < 0)
        {
            errors["idade"] = ["Idade deve ser um número maior ou igual a zero."];
        }

        return errors.Count == 0 ? null : errors;
    }
}

