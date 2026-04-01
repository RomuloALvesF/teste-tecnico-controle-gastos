# Teste Técnico — Controle de Gastos Residenciais

Solução separada em:
- `api/`: ASP.NET Core Web API + EF Core + SQLite (persistência em arquivo)
- `front/`: React + TypeScript (Vite) consumindo a API

## Como rodar

### API (.NET)

No diretório `api/`:

```bash
dotnet run
```

- A API aplica migrations automaticamente ao iniciar.
- O SQLite fica no arquivo `api/app.db` (dados persistem após reiniciar).
- OpenAPI em desenvolvimento: `/openapi/v1.json`

### Front (React + TS)

No diretório `front/`:

```bash
npm install
npm run dev
```

Configuração da URL da API:
- copie `front/.env.example` para `front/.env` e ajuste se precisar
- variável: `VITE_API_BASE_URL` (ex.: `http://localhost:5000`)

## Regras de negócio implementadas (servidor)

- **Pessoa**: `nome` até 200 chars; CRUD completo; ao excluir pessoa, **transações são apagadas** (cascade).
- **Categoria**: `descricao` até 400 chars; finalidade `Despesa/Receita/Ambas`; criar/listar.
- **Transação**: `descricao` até 400 chars; `valor` positivo; tipo `Despesa/Receita`.
  - menor de 18: **apenas despesa**
  - categoria deve ser compatível com o tipo (finalidade)
- **Relatórios**:
  - `GET /relatorios/totais-por-pessoa` (obrigatório)
  - `GET /relatorios/totais-por-categoria` (opcional)

## Testes

Projeto de testes em `api.tests/` (xUnit), cobrindo regras de negócio centrais:

```bash
dotnet test .\api.tests\api.tests.csproj
```

