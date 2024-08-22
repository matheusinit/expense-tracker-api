# Git Workflow

<div align="center">

[English](./CONTRIBUTING.md) · Brazilian Portuguese

</div>

O Fluxo de Trabalho de Branch de Feature (Feature Branch Workflow) assume um repositório central, e a main representa o histórico oficial do projeto. Em vez de fazer commits diretamente na sua branch main local, os desenvolvedores criam uma nova branch toda vez que começam a trabalhar em uma nova funcionalidade. As branches de feature devem ter nomes descritivos, como add-expense ou issue-913. A ideia é dar um propósito claro e altamente focado a cada branch. O Git não faz distinção técnica entre a branch main e as branches de feature, então os desenvolvedores podem editar, fazer staging e commit de mudanças em uma branch de feature.

Além disso, as branches de feature podem (e devem) ser enviadas para o repositório central. Isso torna possível compartilhar uma feature com outros desenvolvedores sem tocar em nenhum código oficial. Como a main é a única branch “especial”, armazenar várias branches de feature no repositório central não apresenta nenhum problema. Claro, essa também é uma maneira conveniente de fazer backup dos commits locais de todos.

## Como funciona?

1. **Checkout da branch release**

Todas as branches de feature são criadas a partir do código mais recente de um projeto.

```bash
git checkout main
git fetch origin
git reset --hard origin/main
```

Isso muda para a branch `main`, puxa os commits mais recentes e reseta as mudanças locais da `main` para corresponder à versão mais recente.

2. **Criar uma nova branch**

Use uma branch separada para cada feature ou issue em que você trabalhar. Após criar a branch, faça checkout dela localmente para que quaisquer mudanças que você fizer estejam nessa branch.

```bash
git checkout -b issue-xxxx
```

Isso faz checkout de uma branch chamada `issue-xxxx` baseada na `main`, e a flag -b diz ao Git para criar a branch se ela ainda não existir.

3. **Atualizar, adicionar, fazer commit e enviar mudanças**

Nesta branch, edite, faça o staging e commit das mudanças como de costume, construindo a feature com tantos commits quantos forem necessários. Trabalhe na feature e faça commits como faria normalmente ao usar Git. Quando estiver pronto, envie seus commits.

```bash
git status
git add <algum-arquivo>
git commit -m "tipo: mensagem"
```

4. **Enviar a branch de feature para o repositório remoto**

É uma boa ideia enviar a branch de feature para o repositório central. Isso serve como um backup conveniente, e ao colaborar com outros desenvolvedores, isso lhes dá acesso para visualizar os commits na nova branch.

```bash
git push -u origin issue-xxxx
```

Esse comando envia a `issue-xxxx` para o repositório central (origin), e a flag -u a adiciona como uma branch de rastreamento remoto. Após configurar a branch de rastreamento, git push pode ser invocado sem quaisquer parâmetros para enviar automaticamente a branch issue-xxxx para o repositório central.