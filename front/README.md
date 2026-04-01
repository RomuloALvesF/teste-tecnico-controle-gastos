# Front — Controle de Gastos Residenciais

Interface em **React + TypeScript** Vite que consome a Web API do diretório `../api`.

Para visão geral da solução (API + front + testes), use o [`README.md`](../README.md) na raiz do repositório.

## Pré-requisitos

- Node.js (recomendado: versão compatível com o Vite do projeto; em caso de aviso de engine, prefira atualizar o Node)
- API rodando (veja `../api/README.md`)

## Configuração

Quem clona o repositório deve criar o arquivo **`.env`** a partir do modelo versionado:

```bash
# Na pasta front
cp .env.example .env
```

No **PowerShell** ou **CMD**, na pasta `front/`:

```bat
copy .env.example .env
```

O arquivo **`.env.example`** contém a variável `VITE_API_BASE_URL` (ex.: `http://localhost:5000`) — endereço onde a API está escutando, **sem barra no final**.

Se a API subir em outra porta, edite o `.env` e **reinicie** o `npm run dev` (o Vite lê o `.env` ao iniciar).

> O `.env` real não vai para o Git (está no `.gitignore`); só o `.env.example` serve de modelo.

## Como rodar em desenvolvimento

Na pasta `front/`:

```bash
npm install
npm run dev
```

Abra o endereço indicado no terminal (geralmente `http://localhost:5173`).

**Importante:** com a API em `http://localhost:5000`, inicie-a antes ou em paralelo, por exemplo:

```bash
cd ../api
dotnet run --urls http://localhost:5000
```

## Build de produção (opcional)

```bash
npm run build
```

Os arquivos gerados ficam em `dist/`. Para servir localmente você pode usar `npx vite preview` após o build.

## Estrutura útil

- `src/api/` — cliente HTTP e tipos alinhados à API
- `src/pages/` — telas (pessoas, categorias, transações, relatórios)
- `src/App.tsx` — rotas e layout com menu lateral
