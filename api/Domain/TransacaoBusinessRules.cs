namespace Api.Domain;

public static class TransacaoBusinessRules
{
    public static string? ValidateMinorRule(int idade, TipoTransacao tipo)
    {
        if (idade < 18 && tipo == TipoTransacao.Receita)
        {
            return "Para menor de idade (menor de 18), apenas despesas são aceitas.";
        }

        return null;
    }

    public static string? ValidateCategoriaCompatibilidade(FinalidadeCategoria finalidadeCategoria, TipoTransacao tipo)
    {
        if (finalidadeCategoria == FinalidadeCategoria.Ambas)
        {
            return null;
        }

        var ok =
            (finalidadeCategoria == FinalidadeCategoria.Despesa && tipo == TipoTransacao.Despesa) ||
            (finalidadeCategoria == FinalidadeCategoria.Receita && tipo == TipoTransacao.Receita);

        if (!ok)
        {
            return $"Categoria com finalidade '{finalidadeCategoria}' não é compatível com transação do tipo '{tipo}'.";
        }

        return null;
    }
}

