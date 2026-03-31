# API — Controle de Gastos Residenciais

## Como rodar

Pré-requisitos:
- .NET SDK instalado

No diretório `api/`:

```bash
dotnet run
```

A API aplica migrations automaticamente ao iniciar (SQLite) e persiste os dados no arquivo `app.db`.

## CORS (front em dev)

Em desenvolvimento, a API permite requests do front em `http://localhost:5173`.

## OpenAPI

Em desenvolvimento, o OpenAPI fica disponível em `/openapi/v1.json`.

## Endpoints

### Pessoas
- `GET /pessoas`
- `POST /pessoas`
- `PUT /pessoas/{id}`
- `DELETE /pessoas/{id}` (apaga também todas as transações da pessoa)

Exemplo de payload (criar/editar):

```json
{ "nome": "Ana", "idade": 30 }
```

### Categorias
- `GET /categorias`
- `POST /categorias`

Exemplo:

```json
{ "descricao": "Alimentação", "finalidade": 1 }
```

`finalidade`: `1=Despesa`, `2=Receita`, `3=Ambas`

### Transações
- `GET /transacoes`
- `POST /transacoes`

Exemplo:

```json
{
  "descricao": "Salário",
  "valor": 3500,
  "tipo": 2,
  "categoriaId": "00000000-0000-0000-0000-000000000000",
  "pessoaId": "00000000-0000-0000-0000-000000000000"
}
```

Regras principais (validadas na API):
- `valor` deve ser positivo
- menor de 18: apenas `tipo=Despesa`
- categoria deve ser compatível com o tipo (finalidade `Despesa/Receita/Ambas`)

### Relatórios
- `GET /relatorios/totais-por-pessoa`
- `GET /relatorios/totais-por-categoria` (opcional)

Retorna todas as pessoas com total de receitas, despesas e saldo (receita - despesa), além dos totais gerais.

