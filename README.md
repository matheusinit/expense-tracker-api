# expense-tracker-api

## O que é essa API?

A Expense Tracker API fornece, por meio de requisições HTTP, uma maneira de gerenciar suas despesas financeiras para ajudar nos seus custos diários.

## Configuração

### Instalar dependências

É necessário instalar as dependências localmente para iniciar o processo:

```bash
pnpm i
```

### Configurar variáveis de ambiente

Para garantir que as aplicações sejam executadas com credenciais, é necessário configurar segredos e variáveis que **não devem ser compartilhados** no arquivo `.env`. O exemplo para `.env` é o seguinte:

```env
# Banco de dados
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=schema_name"
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=dbname

# Servidor da aplicação
CSRF_TOKEN_SECRET=secret
SESSION_SECRET=secret

# ORM
PRISMA_CLIENT_LOG="info, warn"
```
> As opções disponíveis para `PRISMA_CLIENT_LOG` são info, warn, query e error na versão atual do Prisma ORM (5.18)

> Defina suas próprias informações para `POSTGRES_USER`, `POSTGRES_DB` e `POSTGRES_PASSWORD`, e preencha apenas em `DATABASE_URL`.

Copie o conteúdo de `.env.sample` para um novo arquivo `.env` (para produção, staging ou desenvolvimento), em seguida, defina os valores para as variáveis de ambiente. No caso de executar o ambiente de teste, use `.env.test.local`

Para gerar o segredo para `CSRF_TOKEN_SECRET` e `SESSION_SECRET`, também para **senhas**, use o seguinte comando:

```bash
openssl rand -base64 24 | tr -d '=' | cut -c1-32
```

> Mas lembre-se, o conteúdo não deve ser o mesmo!

## Executar testes

### Testes unitários

Para executar os testes unitários, execute apenas o seguinte comando:

```bash
pnpm test:unit
```

### Testes de integração

Para iniciar o serviço PostgreSQL para testes de integração, é necessário o Docker. Para iniciar, execute:

```bash
docker compose --env-file .env.test.local up -d database-test
```

Agora, vamos gerar os tipos para a aplicação com base nos modelos:

```bash
pnpm prisma generate
```

Precisamos aplicar as migrações ao nosso banco de dados usando o ORM escolhido. Para desenvolvimento, você pode executar o seguinte comando:

```bash
pnpm migrate:test
```

Para executar apenas os testes de integração, execute:

```
pnpm test:integration
```

> No caso de executar todos os testes, incluindo integração e unitários, execute `pnpm test`

## Execução

### Banco de dados

Para iniciar o serviço PostgreSQL, é necessário o Docker. Para iniciar, execute:

```bash
docker compose up -d database
```

Agora, vamos gerar os tipos para a aplicação com base nos modelos:

```bash
pnpm prisma generate
```

Precisamos aplicar as migrações ao nosso banco de dados usando o ORM escolhido. Para desenvolvimento, você pode executar o seguinte comando:

```bash
pnpm migrate:dev
```

> Para produção, o comando a ser executado é `pnpm migrate:prod`

## Contribuir

Se você deseja saber mais sobre o processo de desenvolvimento e fluxo de trabalho do Git, leia o [guia de contribuição](./CONTRIBUTING.md).
