# Especificações do Projeto

<span style="color:red">Pré-requisitos: <a href="1-Documentação de Contexto.md"> Documentação de Contexto</a></span>

Definição do problema e ideia de solução a partir da perspectiva do usuário. É composta pela definição do  diagrama de personas, histórias de usuários, requisitos funcionais e não funcionais além das restrições do projeto.

Apresente uma visão geral do que será abordado nesta parte do documento, enumerando as técnicas e/ou ferramentas utilizadas para realizar a especificações do projeto

## Personas

Pedro Paulo tem 26 anos, é arquiteto recém-formado e autônomo. Pensa em se desenvolver profissionalmente através de um mestrado fora do país, pois adora viajar, é solteiro e sempre quis fazer um intercâmbio. Está buscando uma agência que o ajude a encontrar universidades na Europa que aceitem alunos estrangeiros.

Enumere e detalhe as personas da sua solução. Para tanto, baseie-se tanto nos documentos disponibilizados na disciplina e/ou nos seguintes links:

> **Links Úteis**:
> - [Rock Content](https://rockcontent.com/blog/personas/)
> - [Hotmart](https://blog.hotmart.com/pt-br/como-criar-persona-negocio/)
> - [O que é persona?](https://resultadosdigitais.com.br/blog/persona-o-que-e/)
> - [Persona x Público-alvo](https://flammo.com.br/blog/persona-e-publico-alvo-qual-a-diferenca/)
> - [Mapa de Empatia](https://resultadosdigitais.com.br/blog/mapa-da-empatia/)
> - [Mapa de Stalkeholders](https://www.racecomunicacao.com.br/blog/como-fazer-o-mapeamento-de-stakeholders/)
>
Lembre-se que você deve ser enumerar e descrever precisamente e personalizada todos os clientes ideais que sua solução almeja.

## Histórias de Usuários

Com base na análise das personas forma identificadas as seguintes histórias de usuários:

|EU COMO... `PERSONA`| QUERO/PRECISO ... `FUNCIONALIDADE` |PARA ... `MOTIVO/VALOR`                 |
|--------------------|------------------------------------|----------------------------------------|
|Usuário do sistema  | Registrar minhas tarefas           | Não esquecer de fazê-las               |
|Administrador       | Alterar permissões                 | Permitir que possam administrar contas |

Apresente aqui as histórias de usuário que são relevantes para o projeto de sua solução. As Histórias de Usuário consistem em uma ferramenta poderosa para a compreensão e elicitação dos requisitos funcionais e não funcionais da sua aplicação. Se possível, agrupe as histórias de usuário por contexto, para facilitar consultas recorrentes à essa parte do documento.

> **Links Úteis**:
> - [Histórias de usuários com exemplos e template](https://www.atlassian.com/br/agile/project-management/user-stories)
> - [Como escrever boas histórias de usuário (User Stories)](https://medium.com/vertice/como-escrever-boas-users-stories-hist%C3%B3rias-de-usu%C3%A1rios-b29c75043fac)
> - [User Stories: requisitos que humanos entendem](https://www.luiztools.com.br/post/user-stories-descricao-de-requisitos-que-humanos-entendem/)
> - [Histórias de Usuários: mais exemplos](https://www.reqview.com/doc/user-stories-example.html)
> - [9 Common User Story Mistakes](https://airfocus.com/blog/user-story-mistakes/)

## Requisitos

As tabelas a seguir apresentam os requisitos funcionais e não funcionais que definem o escopo da solução proposta.
Para a definição da prioridade foi utilizada a técnica ***MoSCoW***, que classifica os requisitos de acordo com sua importância para o funcionamento do sistema.

**A classificação utilizada foi:**
- **Alta prioridade:**  funcionalidades essenciais para o funcionamento da plataforma.
- **Média prioridade:** funcionalidades importantes, mas que não impedem o funcionamento básico do sistema.
- **Baixa prioridade:** funcionalidades complementares ou melhorias futuras.

<strong>Cada aluno será responsável pela execução completa (back, web e mobile) de pelo menos 2 requisitos que será acompanhado pelo professor.</strong>

### Requisitos Funcionais

|ID    | Descrição do Requisito  | Prioridade | Responsável |
|------|-----------------------------------------|----|----|
|RF-001| Permitir que instituições cadastrem abrigos ou centros de apoio | ALTA | Mayara |
|RF-002| Permitir visualizar abrigos disponíveis em um mapa interativo  | MÉDIA | Mayara |
|RF-003| Permitir que instituições registrem necessidades de doações (água, alimentos, medicamentos etc.) | ALTA | NOME|
|RF-004| Permitir que usuários visualizem pedidos de doação registrados por instituições  | ALTA | NOME |
|RF-005| Permitir que voluntários se candidatem para realizar missões de ajuda | ALTA | NOME |
|RF-006| Permitir que instituições atualizem o status de necessidades (atendida, pendente etc.)*   | MÉDIA | NOME |
|RF-007| Permitir que instituições troquem recursos entre si dentro da plataforma | MÉDIA | NOME |
|RF-008| Permitir que usuários reportem situações de emergência ou novas áreas afetadas   | MÉDIA | NOME |
|RF-009| Permitir que usuários iniciem conversa ou solicitem contato com um abrigo ou instituição | ALTA | NOME |
|RF-010| Permitir que usuários consultem informações detalhadas sobre cada abrigo (capacidade, serviços disponíveis, contato)  | ALTA | NOME |
|RF-011| Permitir envio de notificações para informar novas missões ou necessidades urgentes | ALTA | NOME |
|RF-012| Permitir que administradores validem instituições cadastradas na plataforma   | ALTA | NOME |
|RF-013| Permitir que usuários compartilhem abrigos, pedidos de doação ou missões de ajuda em redes sociais   | ALTA | NOME |



### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-001| O sistema deve ser responsivo e compatível com dispositivos móveis e navegadores web modernos | ALTA | 
|RNF-002| O sistema deve processar requisições do usuário em no máximo 3 segundos |  BAIXA | 
|RNF-003| O sistema deve garantir segurança dos dados utilizando autenticação e criptografia | ALTA | 
|RNF-004| A interface do sistema deve ser simples e intuitiva para facilitar o uso em situações de crise |  ALTA | 
|RNF-005| O sistema deve permitir integração com serviços de geolocalização para exibir abrigos próximos ao usuário | MÉDIA | 
|RNF-006| O sistema deve estar disponível 24 horas por dia durante situações de emergência | ALTA | 




## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser desenvolvido utilizando tecnologias compatíveis com desenvolvimento web e mobile |
|02| O sistema deverá ser entregue até o final do semestre letivo      |
|03| O desenvolvimento será realizado pela equipe de alunos definida na disciplina     |



## Diagrama de Casos de Uso

O diagrama de casos de uso é o próximo passo após a elicitação de requisitos, que utiliza um modelo gráfico e uma tabela com as descrições sucintas dos casos de uso e dos atores. Ele contempla a fronteira do sistema e o detalhamento dos requisitos funcionais com a indicação dos atores, casos de uso e seus relacionamentos. 

As referências abaixo irão auxiliá-lo na geração do artefato “Diagrama de Casos de Uso”.

> **Links Úteis**:
> - [Criando Casos de Uso](https://www.ibm.com/docs/pt-br/elm/6.0?topic=requirements-creating-use-cases)
> - [Como Criar Diagrama de Caso de Uso: Tutorial Passo a Passo](https://gitmind.com/pt/fazer-diagrama-de-caso-uso.html/)
> - [Lucidchart](https://www.lucidchart.com/)
> - [Astah](https://astah.net/)
> - [Diagrams](https://app.diagrams.net/)


# Gerenciamento de Projeto

De acordo com o PMBoK v6 as dez áreas que constituem os pilares para gerenciar projetos, e que caracterizam a multidisciplinaridade envolvida, são: Integração, Escopo, Cronograma (Tempo), Custos, Qualidade, Recursos, Comunicações, Riscos, Aquisições, Partes Interessadas. Para desenvolver projetos um profissional deve se preocupar em gerenciar todas essas dez áreas. Elas se complementam e se relacionam, de tal forma que não se deve apenas examinar uma área de forma estanque. É preciso considerar, por exemplo, que as áreas de Escopo, Cronograma e Custos estão muito relacionadas. Assim, se eu amplio o escopo de um projeto eu posso afetar seu cronograma e seus custos.

## Gerenciamento de Tempo

Com diagramas bem organizados que permitem gerenciar o tempo nos projetos, o gerente de projetos agenda e coordena tarefas dentro de um projeto para estimar o tempo necessário de conclusão.

![Diagrama de rede simplificado notação francesa (método francês)](img/02-diagrama-rede-simplificado.png)

O gráfico de Gantt ou diagrama de Gantt também é uma ferramenta visual utilizada para controlar e gerenciar o cronograma de atividades de um projeto. Com ele, é possível listar tudo que precisa ser feito para colocar o projeto em prática, dividir em atividades e estimar o tempo necessário para executá-las.

![Gráfico de Gantt](img/02-grafico-gantt.png)

## Gerenciamento de Equipe

O gerenciamento adequado de tarefas contribuirá para que o projeto alcance altos níveis de produtividade. Por isso, é fundamental que ocorra a gestão de tarefas e de pessoas, de modo que os times envolvidos no projeto possam ser facilmente gerenciados. 

![Simple Project Timeline](img/02-project-timeline.png)

