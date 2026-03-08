# Especificações do Projeto

<span style="color:red">Pré-requisitos: <a href="1-Documentação de Contexto.md"> Documentação de Contexto</a></span>

Definição do problema e ideia de solução a partir da perspectiva do usuário. É composta pela definição do  diagrama de personas, histórias de usuários, requisitos funcionais e não funcionais além das restrições do projeto.

Apresente uma visão geral do que será abordado nesta parte do documento, enumerando as técnicas e/ou ferramentas utilizadas para realizar a especificações do projeto

## Personas

 
| Persona | Perfil e Contexto | Necessidades e Objetivos |
|--------------------|------------------------------------|----------------------------------------|
| Maria Luíza <br> ( Vítima ) | 34 anos, mãe de dois filhos. Moradora de área de risco. Teve que abandonar sua casa devido a fortes temporais         | **Necessidade:** Encontrar abrigo seguro imediatamente.  <br> **Objetivo:** Localizar vagas em abrigos próximos que aceitem sua família e suprimentos básicos         |
| Carlos Alberto <br> ( Gestor) | 45 anos, coordenador de uma ONG local. Gerencia um centro de apoio sobrecarregado. | **Necessidade:** Centralizar pedidos de doações e coordenar recursos. <br> **Objetivo:** Atualizar a capacidade do abrigo e solicitar itens urgentes (água, remédios)
 | Juliana Mendes <br> ( Voluntária ) | 22 anos, estudante de enfermagem. Deseja ajudar, mas não sabe onde sua habilidade é mais útil. | **Necessidade:** Visualizar missões de ajuda técnica e pontos de coleta. <br> **Objetivo:** Contribuir de forma segura e eficiente para a mitigação do desastre

## Histórias de Usuários

 | EU COMO ... `PERSONA` | QUERO/PRECISO ... `FUNCIONALIDADE` | PARA ... `MOTIVO/VALOR`                 |
|--------------------|------------------------------------|----------------------------------------|
| Vítima | Visualizar abrigos em um mapa interativo |  Encontrar o local de apoio mais próximo de onde estou            |
| Vítima  | Consultar informações detalhadas do abrigo | Saber a capacidade e serviços (como banheiros ou comida) antes de me deslocar |
| Vítima  | Iniciar uma conversa com uma instituição | Tirar dúvidas urgentes sobre disponibilidade ou itens necessários |
| Vítima  | Reportar uma nova situação de emergência | Alertar outros usuários e autoridades sobre riscos iminentes |
| Instituição  | Cadastrar meu abrigo ou centro de apoio | Tornar o local visível para quem precisa e para doadores |
| Instituição |  Registrar necessidades de doações (alimentos, água) | Informar à comunidade o que é prioritário no momento | 
| Instituição | Atualizar o status das necessidades (atendida/pendente) | Garantir que as doações sejam direcionadas para onde ainda há falta | 
| Instituição | Trocar recursos com outras instituições | Otimizar o estoque regional através da colaboração entre abrigos |
| Voluntário | Me candidatar para missões de ajuda | Colocar meu tempo e habilidades à disposição das instituições | 
| Doador | Visualizar pedidos de doação registrados | Saber exatamente quais itens são necessários em cada local | 
| Usuário | Compartilhar informações em redes sociais | Aumentar o alcance das campanhas e mobilizar mais pessoas |
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

<img width="1412" height="1386" alt="diagrama_caso_uso" src="https://github.com/user-attachments/assets/e80efeac-1eb5-45cd-a8d9-9deebb88d59e" />



# Gerenciamento de Projeto

O projeto será gerenciado através de divisão modular das funcionalidades e desenvolvimento em etapas incrementais, seguindo o cronograma definido. Cada integrante da equipe ficará responsável por um módulo do sistema (CRUD), permitindo desenvolvimento paralelo enquanto se mantém integração entre as partes.

A gestão das tarefas será feita utilizando ferramentas como GitHub para versionamento, Github Projects para acompanhamento das tarefas e reuniões semanais através do Microsoft Teams para alinhar o progresso. Essa abordagem permite controlar o progresso do projeto, reduzir riscos de atraso e garantir que todas as funcionalidades essenciais sejam entregues dentro do prazo.

## Gerenciamento de Tempo

O cronograma do projeto foi dividido em cinco etapas principais, seguindo o calendário da disciplina:

**Etapa 1** – Concepção e Planejamento (09/02 – 08/03)
Formação do grupo, definição do problema, levantamento de requisitos, criação das personas, histórias de usuário, requisitos e arquitetura inicial do sistema.

**Etapa 2** – Desenvolvimento do Back-end (09/03 – 12/04)
Implementação da Web API REST, modelagem do banco de dados NoSQL, definição de rotas e autenticação, além da documentação da arquitetura da API.

**Etapa 3** – Desenvolvimento do Front-end Web (13/04 – 10/05)
Desenvolvimento da interface web, criação de wireframes, modelagem de processos e integração com a API.

**Etapa 4** – Desenvolvimento do Front-end Mobile (11/05 – 31/05)
Desenvolvimento da versão mobile da aplicação, integração com o backend e realização de testes de integração.

**Etapa 5** – Testes Finais e Apresentação (01/06 – 21/06)
Finalização do sistema, documentação final, análise das tecnologias utilizadas e preparação da apresentação e do vídeo do projeto.

<img width="1100" height="500" alt="gantt_projeto_distribuido_dia_mes" src="https://github.com/user-attachments/assets/ea987e3c-e85b-4f00-8405-2a7f2bf7db7d" />


## Gerenciamento de Equipe

A equipe será organizada de forma colaborativa, com divisão de responsabilidades entre os integrantes de acordo com os módulos do sistema. Cada membro será responsável pelo desenvolvimento e manutenção de um conjunto específico de funcionalidades, contribuindo para o avanço do projeto de forma paralela.

Além da divisão de tarefas, a equipe manterá comunicação constante para garantir alinhamento nas decisões técnicas e integração entre os módulos desenvolvidos. A colaboração entre os integrantes será essencial para resolver problemas, revisar implementações e assegurar a qualidade do sistema.

Dessa forma, a gestão da equipe busca promover organização, cooperação e responsabilidade compartilhada, contribuindo para o desenvolvimento eficiente do projeto.

<img width="1507" height="225" alt="cronograma" src="https://github.com/user-attachments/assets/fa7346d9-bcdb-4dc6-ba17-bce58883e7b8" />

