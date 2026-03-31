using System.ComponentModel.DataAnnotations;

namespace Api.Domain;

public sealed class Categoria
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(400)]
    public string Descricao { get; set; } = "";

    public FinalidadeCategoria Finalidade { get; set; }

    public List<Transacao> Transacoes { get; set; } = new();
}

