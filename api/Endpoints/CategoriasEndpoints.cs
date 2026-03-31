using Api.Domain;
using Api.Dtos;
using Api.Infrastructure;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Api.Endpoints;

public static class CategoriasEndpoints
{
    public static RouteGroupBuilder MapCategoriasEndpoints(this RouteGroupBuilder routes)
    {
        var group = routes.MapGroup("/categorias").WithTags("Categorias");

        group.MapGet("/", async (AppDbContext db, CancellationToken ct) =>
        {
            var categorias = await db.Categorias
                .AsNoTracking()
                .OrderBy(c => c.Descricao)
                .Select(c => new CategoriaResponse(c.Id, c.Descricao, c.Finalidade))
                .ToListAsync(ct);

            return Results.Ok(categorias);
        });

        group.MapPost("/", async Task<Results<Created<CategoriaResponse>, ValidationProblem>> (
            CategoriaCreateRequest request,
            AppDbContext db,
            CancellationToken ct) =>
        {
            var errors = ValidateCategoria(request.Descricao);
            if (errors is not null)
            {
                return TypedResults.ValidationProblem(errors);
            }

            if (!Enum.IsDefined(typeof(FinalidadeCategoria), request.Finalidade))
            {
                return TypedResults.ValidationProblem(new Dictionary<string, string[]>
                {
                    ["finalidade"] = ["Finalidade inválida."]
                });
            }

            var categoria = new Categoria
            {
                Descricao = request.Descricao.Trim(),
                Finalidade = request.Finalidade
            };

            db.Categorias.Add(categoria);
            await db.SaveChangesAsync(ct);

            return TypedResults.Created($"/categorias/{categoria.Id}", new CategoriaResponse(categoria.Id, categoria.Descricao, categoria.Finalidade));
        });

        return routes;
    }

    private static Dictionary<string, string[]>? ValidateCategoria(string descricao)
    {
        var errors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(descricao))
        {
            errors["descricao"] = ["Descrição é obrigatória."];
        }
        else if (descricao.Trim().Length > 400)
        {
            errors["descricao"] = ["Descrição deve ter no máximo 400 caracteres."];
        }

        return errors.Count == 0 ? null : errors;
    }
}

