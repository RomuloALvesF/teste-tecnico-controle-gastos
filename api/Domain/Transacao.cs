using System.ComponentModel.DataAnnotations;

namespace Api.Domain;

public sealed class Transacao
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(400)]
    public string Descricao { get; set; } = "";

    public decimal Valor { get; set; }

    public TipoTransacao Tipo { get; set; }

    public Guid CategoriaId { get; set; }
    public Categoria? Categoria { get; set; }

    public Guid PessoaId { get; set; }
    public Pessoa? Pessoa { get; set; }
}

