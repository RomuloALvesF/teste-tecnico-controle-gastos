using Api.Domain;

namespace Api.Tests;

// Testes das regras em TransacaoBusinessRules: menor de idade só pode despesa e categoria precisa combinar com o tipo.
public sealed class TransacaoBusinessRulesTests
{
    [Fact]
    public void MenorDeIdadeNaoPodeRegistrarReceita()
    {
        var error = TransacaoBusinessRules.ValidateMinorRule(17, TipoTransacao.Receita);
        Assert.NotNull(error);
    }

    [Fact]
    public void MenorDeIdadePodeRegistrarDespesa()
    {
        var error = TransacaoBusinessRules.ValidateMinorRule(17, TipoTransacao.Despesa);
        Assert.Null(error);
    }

    [Fact]
    public void Com18AnosOuMaisPodeRegistrarReceita()
    {
        var error = TransacaoBusinessRules.ValidateMinorRule(18, TipoTransacao.Receita);
        Assert.Null(error);
    }

    [Fact]
    public void FinalidadeDaCategoriaIncompativelComTipoGeraErro()
    {
        Assert.NotNull(TransacaoBusinessRules.ValidateCategoriaCompatibilidade(FinalidadeCategoria.Despesa, TipoTransacao.Receita));
        Assert.NotNull(TransacaoBusinessRules.ValidateCategoriaCompatibilidade(FinalidadeCategoria.Receita, TipoTransacao.Despesa));
    }

    [Fact]
    public void CategoriaComFinalidadeAmbasAceitaDespesaEReceita()
    {
        Assert.Null(TransacaoBusinessRules.ValidateCategoriaCompatibilidade(FinalidadeCategoria.Ambas, TipoTransacao.Despesa));
        Assert.Null(TransacaoBusinessRules.ValidateCategoriaCompatibilidade(FinalidadeCategoria.Ambas, TipoTransacao.Receita));
    }
}
