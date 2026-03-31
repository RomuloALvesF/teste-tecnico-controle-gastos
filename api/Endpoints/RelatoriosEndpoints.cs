using Api.Domain;
using Api.Dtos;
using Api.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Api.Endpoints;

public static class RelatoriosEndpoints
{
    public static RouteGroupBuilder MapRelatoriosEndpoints(this RouteGroupBuilder routes)
    {
        var group = routes.MapGroup("/relatorios").WithTags("Relatórios");

        group.MapGet("/totais-por-pessoa", async (AppDbContext db, CancellationToken ct) =>
        {
            var pessoas = await db.Pessoas
                .AsNoTracking()
                .OrderBy(p => p.Nome)
                .Select(p => new { p.Id, p.Nome, p.Idade })
                .ToListAsync(ct);

            var totais = await db.Transacoes
                .AsNoTracking()
                .GroupBy(t => t.PessoaId)
                .Select(g => new
                {
                    PessoaId = g.Key,
                    TotalReceitas = g.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => (decimal?)t.Valor) ?? 0m,
                    TotalDespesas = g.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => (decimal?)t.Valor) ?? 0m
                })
                .ToListAsync(ct);

            var totaisByPessoa = totais.ToDictionary(t => t.PessoaId, t => (t.TotalReceitas, t.TotalDespesas));

            var items = pessoas
                .Select(p =>
                {
                    var (receitas, despesas) = totaisByPessoa.TryGetValue(p.Id, out var x) ? x : (0m, 0m);
                    return new TotaisPorPessoaItem(p.Id, p.Nome, p.Idade, receitas, despesas, receitas - despesas);
                })
                .ToList();

            var totalReceitasGeral = items.Sum(i => i.TotalReceitas);
            var totalDespesasGeral = items.Sum(i => i.TotalDespesas);

            return Results.Ok(new TotaisPorPessoaResponse(
                Pessoas: items,
                TotalReceitasGeral: totalReceitasGeral,
                TotalDespesasGeral: totalDespesasGeral,
                SaldoLiquidoGeral: totalReceitasGeral - totalDespesasGeral
            ));
        });

        group.MapGet("/totais-por-categoria", async (AppDbContext db, CancellationToken ct) =>
        {
            var categorias = await db.Categorias
                .AsNoTracking()
                .OrderBy(c => c.Descricao)
                .Select(c => new { c.Id, c.Descricao })
                .ToListAsync(ct);

            var totais = await db.Transacoes
                .AsNoTracking()
                .GroupBy(t => t.CategoriaId)
                .Select(g => new
                {
                    CategoriaId = g.Key,
                    TotalReceitas = g.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => (decimal?)t.Valor) ?? 0m,
                    TotalDespesas = g.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => (decimal?)t.Valor) ?? 0m
                })
                .ToListAsync(ct);

            var totaisByCategoria = totais.ToDictionary(t => t.CategoriaId, t => (t.TotalReceitas, t.TotalDespesas));

            var items = categorias
                .Select(c =>
                {
                    var (receitas, despesas) = totaisByCategoria.TryGetValue(c.Id, out var x) ? x : (0m, 0m);
                    return new TotaisPorCategoriaItem(c.Id, c.Descricao, receitas, despesas, receitas - despesas);
                })
                .ToList();

            var totalReceitasGeral = items.Sum(i => i.TotalReceitas);
            var totalDespesasGeral = items.Sum(i => i.TotalDespesas);

            return Results.Ok(new TotaisPorCategoriaResponse(
                Categorias: items,
                TotalReceitasGeral: totalReceitasGeral,
                TotalDespesasGeral: totalDespesasGeral,
                SaldoLiquidoGeral: totalReceitasGeral - totalDespesasGeral
            ));
        });

        return routes;
    }
}

