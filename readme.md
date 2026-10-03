# Cadence — Gestão de Tarefas e Planejamento Pessoal

**Versão Demo — v0.0.2**

O **Cadence** (v0.0.2) é uma aplicação web autônoma desenvolvida em arquivo único (*Single-File Web Application*), projetada para oferecer uma experiência minimalista de gerenciamento de tempo, foco diário e planejamento contínuo. 

Esta versão serve como demonstração funcional da arquitetura client-side do Cadence, operando sem a necessidade de dependências externas, servidores ou compiladores.

---

## Recursos da Versão Demo

### 1. Painel Foco (Focus)
* **Organização Diária:** Centralização e exibição das atividades agendadas para o dia atual (*Today*), ordenadas cronologicamente.
* **Indicador de Progresso:** Acompanhamento dinâmico da taxa de conclusão das tarefas diárias através de barra visual e contador percentual.
* **Módulo de Atenção (Now Stage):** Área de alta visibilidade reservada para a execução imediata das prioridades do dia.

### 2. Planejador (Planner)
* **Visualização Semanal (Week View):** Agrupamento linear das tarefas programadas para os próximos 7 dias.
* **Calendário Mensal Contínuo (Calendar View):** Visão macro estendida cobrindo 12 meses com marcadores visuais da densidade de tarefas diárias.
* **Agendamento Direto via Calendário:** Seleção rápida de qualquer data do calendário para criação imediata de novos compromissos.

### 3. Usabilidade e Interface
* **Edição Inline de Tarefas:** Alteração ágil do título das atividades diretamente na lista, confirmada via tecla `Enter` ou desfocagem (`focusout`).
* **Suporte a Temas:** Alternância entre os modos Claro (*Light*) e Escuro (*Dark*), com detecção automática do tema do sistema operacional (`prefers-color-scheme`).
* **Menu de Ações Rápidas (FAB Menu):** Interface flutuante para criação acelerada de tarefas, navegação de telas e configurações.

### 4. Gestão e Privacidade de Dados
* **Persistência Local (Local-First):** Armazenamento automático e privado das informações no `localStorage` do navegador do usuário.
* **Exportação JSON:** Funcionalidade para download de backup das tarefas cadastradas em formato `.json`.
* **Redefinição de Estado:** Ferramenta para limpeza rápida do banco de dados local.

---

## Arquitetura Técnica

A versão 0.0.2 adota uma arquitetura simplificada e altamente portátil:

* **Single-File Distribution:** Todo o código da aplicação (estrutura HTML, estilização CSS e lógica JavaScript) está contido em um único arquivo, garantindo fácil distribuição e execução.
* **Sem Compilação:** Executado nativamente em qualquer navegador moderno usando APIs web padronizadas (ES6+, DOM Manipulation e CSS Custom Properties).
* **Internacionalização Base:** Interface estruturada em língua inglesa, utilizando a API `Intl.DateTimeFormat` para formatação nativa de datas e horas.

---

## Estrutura do Projeto

```
cadence/
├── cadence.html    # Arquivo único da aplicação (HTML, CSS e JavaScript)
└── README.md       # Documentação técnica e guia do usuário
```

---

## Como Executar a Demonstração

Por não requerer ambiente Node.js, empacotadores ou servidores HTTP:

1. Faça o download ou clone o repositório contendo o arquivo `cadence.html`.
2. Abra o arquivo `cadence.html` diretamente em seu navegador web (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge ou equivalente).
3. A aplicação estará pronta para uso imediato.

---

## Licença

Esta versão de demonstração é disponibilizada para avaliação técnica, testes de usabilidade e estudos de implementação client-side.