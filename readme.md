# Cadence — Hoje, no seu ritmo.

**Versão v0.1.4**

O **Cadence** (v0.1.4) é uma aplicação web de gerenciamento de tempo, foco diário e planejamento pessoal. Desenvolvido com uma arquitetura leve e nativa (*Vanilla JavaScript*), o projeto combina um painel de foco diário com um planejador semanal e mensal interativo.

---

## Recursos da Versão v0.1.4

### 1. Painel Foco (Focus)
* **Gestão do Dia (Hoje):** Listagem centralizada das atividades agendadas para o dia atual, organizadas por ordem cronológica.
* **Indicadores de Urgência e Atraso:** Identificação visual de tarefas com os emblemas *Atrasada* (tarefas pendentes de dias anteriores) e *Urgente* (tarefas cujo horário agendado já passou).
* **Progresso do Dia:** Barra visual e estatística descritiva mostrando a quantidade e porcentagem de tarefas concluídas no dia.

### 2. Planejador Interativo (Planner)
* **Grade Semanal de 24 Horas (Week Grid View):** Grade de horários interativa no estilo calendário, com exibição de colunas por dia da semana (GMT-3), marcador de linha de tempo atual em tempo real e algoritmo para ajuste visual de tarefas sobrepostas.
* **Navegação Semanal:** Botões de controle para avançar, retroceder ou retornar à semana atual.
* **Agendamento Direto na Grade:** Clique direto em qualquer bloco de hora na grade semanal para preencher automaticamente a data e horário no formulário de agendamento.
* **Calendário Mensal Contínuo (Calendar View):** Visualização estendida dos 12 meses do ano com indicadores visuais da quantidade de tarefas agendadas por dia.

### 3. Usabilidade e Interface
* **Barra Lateral (Sidebar Drawer):** Menu retrátil com atalhos de navegação rápida, contador de tarefas pendentes no painel Foco, seleção de tema e atalhos para gerenciamento de dados.
* **Modal de Agendamento (Task Sheet):** Interface modal dedicada com campos específicos para nome da tarefa, data (`input[type="date"]`) e horário (`input[type="time"]`), com suporte à criação e edição de tarefas existentes.
* **Suporte a Temas:** Alternância entre os modos Claro (*Light*) e Escuro (*Dark*), salvando a preferência do usuário e respeitando o tema do sistema operacional (`prefers-color-scheme`).
* **Menu de Ações Rápidas (FAB Menu):** Botão flutuante para criação rápida de tarefas, abertura do planejador ou acesso às configurações.

### 4. Gestão e Privacidade de Dados
* **Persistência Local (Local-First):** Armazenamento de dados realizado de forma privada no `localStorage` do dispositivo do usuário (`cadence-tasks-v2`).
* **Exportação JSON:** Download de backup completo das tarefas cadastradas em formato `.json`.
* **Redefinição de Estado:** Opção para exclusão completa dos dados locais com confirmação de segurança.

---

## Arquitetura Técnica

A versão v0.1.4 adota uma estrutura organizada em módulos web padrão:

* **Arquitetura Modular:** Separação limpa entre estrutura HTML (`index.html`), estilização CSS (`src/style.css`) e lógica de aplicação (`src/script.js`).
* **Zero Dependências de Compilação:** Execução nativa em qualquer navegador moderno usando JavaScript ES6+, manipulação direta da DOM e Variáveis CSS (Custom Properties).
* **Localização (pt-BR):** Interface nativa em português do Brasil com formatação de datas e horas via API `Intl.DateTimeFormat`.

---

## Estrutura do Projeto

```
cadence/
├── index.html        # Estrutura HTML principal da aplicação
├── src/
│   ├── style.css     # Estilos da interface, temas e leiaute responsivo
│   └── script.js     # Lógica de estado, manipulação de DOM e calendário
└── README.md         # Documentação técnica do projeto
```

---

## Como Executar

Por ser uma aplicação web nativa que não requer ambiente Node.js ou servidores de compilação:

1. Obtenha os arquivos do projeto clonando o repositório ou baixando o pacote de código.
2. Abra o arquivo `index.html` em qualquer navegador web moderno (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge ou equivalente).
3. A aplicação estará pronta para uso.

---

## Licença

Esta versão é disponibilizada para avaliação técnica, testes de usabilidade e uso pessoal.