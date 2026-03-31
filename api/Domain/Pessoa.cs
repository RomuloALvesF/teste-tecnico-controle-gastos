using System.ComponentModel.DataAnnotations;

namespace Api.Domain;

public sealed class Pessoa
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(200)]
    public string Nome { get; set; } = "";

    public int Idade { get; set; }

    public List<Transacao> Transacoes { get; set; } = new();
}

