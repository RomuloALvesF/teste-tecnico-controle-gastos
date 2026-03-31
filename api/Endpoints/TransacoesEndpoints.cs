using Api.Domain;
using Api.Dtos;
using Api.Infrastructure;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Api.Endpoints;

public static class TransacoesEndpoints
{
    public static RouteGroupBuilder MapTransacoesEndpoints(this RouteGroupBuilder routes)
    {
        var group = routes.MapGroup("/transacoes").WithTags("Transações");

        group.MapGet("/", async (AppDbContext db, CancellationToken ct) =>
        {
            var transacoes = await db.Transacoes
                .AsNoTracking()
                .Include(t => t.Categoria)
                .Include(t => t.Pessoa)
                .OrderByDescending(t => t.Id)
                .Select(t => new TransacaoResponse(
                    t.Id,
                    t.Descricao,
                    t.Valor,
                    t.Tipo,
                    t.CategoriaId,
                    t.Categoria!.Descricao,
                    t.PessoaId,
                    t.Pessoa!.Nome
                ))
                .ToListAsync(ct);

            return Results.Ok(transacoes);
        });

        group.MapPost("/", async Task<Results<Created<TransacaoResponse>, ValidationProblem>> (
            TransacaoCreateRequest request,
            AppDbContext db,
            CancellationToken ct) =>
        {
            var errors = await ValidateTransacaoAsync(request, db, ct);
            if (errors is not null)
            {
                return TypedResults.ValidationProblem(errors);
            }

            var transacao = new Transacao
            {
                Descricao = request.Descricao.Trim(),
                Valor = request.Valor,
                Tipo = request.Tipo,
                CategoriaId = request.CategoriaId,
                PessoaId = request.PessoaId
            };

            db.Transacoes.Add(transacao);
            await db.SaveChangesAsync(ct);

            var dto = await db.Transacoes
                .AsNoTracking()
                .Include(t => t.Categoria)
                .Include(t => t.Pessoa)
                .Where(t => t.Id == transacao.Id)
                .Select(t => new TransacaoResponse(
                    t.Id,
                    t.Descricao,
                    t.Valor,
                    t.Tipo,
                    t.CategoriaId,
                    t.Categoria!.Descricao,
                    t.PessoaId,
                    t.Pessoa!.Nome
                ))
                .FirstAsync(ct);

            return TypedResults.Created($"/transacoes/{dto.Id}", dto);
        });

        return routes;
    }

    private static async Task<Dictionary<string, string[]>?> ValidateTransacaoAsync(
        TransacaoCreateRequest request,
        AppDbContext db,
        CancellationToken ct)
    {
        var errors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(request.Descricao))
        {
            errors["descricao"] = ["Descrição é obrigatória."];
        }
        else if (request.Descricao.Trim().Length > 400)
        {
            errors["descricao"] = ["Descrição deve ter no máximo 400 caracteres."];
        }

        if (request.Valor <= 0)
        {
            errors["valor"] = ["Valor deve ser um número positivo."];
        }

        if (!Enum.IsDefined(typeof(TipoTransacao), request.Tipo))
        {
            errors["tipo"] = ["Tipo inválido."];
        }

        var pessoa = await db.Pessoas.AsNoTracking().FirstOrDefaultAsync(p => p.Id == request.PessoaId, ct);
        if (pessoa is null)
        {
            errors["pessoaId"] = ["Pessoa não encontrada."];
        }
        else
        {
            var minorRuleError = TransacaoBusinessRules.ValidateMinorRule(pessoa.Idade, request.Tipo);
            if (minorRuleError is not null)
            {
                errors["tipo"] = [minorRuleError];
            }
        }

        var categoria = await db.Categorias.AsNoTracking().FirstOrDefaultAsync(c => c.Id == request.CategoriaId, ct);
        if (categoria is null)
        {
            errors["categoriaId"] = ["Categoria não encontrada."];
        }
        else
        {
            var compatError = TransacaoBusinessRules.ValidateCategoriaCompatibilidade(categoria.Finalidade, request.Tipo);
            if (compatError is not null)
            {
                errors["categoriaId"] = [compatError];
            }
        }

        return errors.Count == 0 ? null : errors;
    }
}

