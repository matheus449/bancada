# HardwareDex — Refatoração e Modernização Profissional Completa

Refatoração estrutural, visual, pedagógica e de acessibilidade (WCAG 2.2 AA) da plataforma **HardwareDex**, elevando a **Biblioteca Técnica** (`biblioteca.html`), a **Bancada Virtual** (`ferramenta.html`) e o motor compartilhado (`hardwaredex-standalone.js`) ao padrão de uma plataforma educacional de engenharia pronta para produção e hospedagem no GitHub Pages.

### User Review & Critical Decisions

> [!IMPORTANT]
> As decisões abaixo foram confirmadas na etapa de alinhamento e orientam toda a implementação:

- **Confirmed Decision 1 — Fluxo do Novo Quiz (35 Questões)**: Apresentação de **uma questão por vez** (4 alternativas plausíveis por questão), onde o estudante seleciona e confirma sua resposta para receber **feedback técnico imediato** com explicação detalhada antes de avançar, encerrando com o painel consolidado de desempenho (acertos, erros, percentual, revisão completa e histórico persistido localmente).
- **Confirmed Decision 2 — Progresso Educacional em Dois Estados**: Diferenciação entre **Visualizado** (registrado automaticamente quando o estudante abre e lê a ficha técnica) e **Estudado** (declaração ativa do estudante ao concluir o estudo do componente, com opção de desfazer), preservando integralmente a chave `hardwaredex_studied` já existente no `localStorage`.
- **Confirmed Decision 3 — Sincronização Total (GitHub Pages + Preview Principal)**: Todas as melhorias serão aplicadas de forma sincronizada nos arquivos estáticos (`biblioteca.html`, `ferramenta.html` e `hardwaredex-standalone.js` na raiz e em `public/`) e na visualização principal da aplicação.

---

### 1. Overview & Core Concept

- **What It Does**: Guia o estudante pela jornada **Aprender → Compreender → Revisar → Praticar**, conectando fichas técnicas profundas, busca indexada em todos os atributos técnicos, acompanhamento de leitura/estudo, avaliação estruturada de 35 questões e simulação prática na Bancada Virtual.
- **Target Audience / Persona**: Estudantes e professores de tecnologia, informática e manutenção de computadores em desktop, tablets ou celulares, operando tanto online (GitHub Pages) quanto localmente.
- **Key Value**: Corrige as limitações anteriores de busca parcial, quiz reduzido e modais sem gerenciamento de foco, entregando um ambiente confiável, acessível por teclado e tecnicamente rigoroso.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Orientação e Acompanhamento de Progresso**: No topo da Biblioteca, o estudante visualiza imediatamente seu progresso separado em componentes **Visualizados** (`0/7`) e **Estudados** (`0/7` com percentual e barra de progresso), além do resumo do último desempenho no Quiz e acesso rápido à avaliação ou à Bancada Virtual.
  2. **Pesquisa Inteligente Multi-Campo e Filtragem Combinada**: Ao digitar termos como `"DDR4"`, `"LGA1700"`, `"AM4"`, `"M.2"`, `"NVMe"`, `"pasta térmica"` ou `"alimentação"`, o mecanismo normaliza acentos e caixa alta/baixa e consulta simultaneamente nome, categoria, resumo, função, funcionamento, características, compatibilidade, cuidados, erros frequentes e sinônimos técnicos, exibindo a contagem exata de resultados encontrados e filtros ativos.
  3. **Estudo em Ficha Técnica Acessível**: Ao abrir um componente, o modal bloqueia a rolagem de fundo, move o foco para o cabeçalho da ficha, permite fechar com `Esc` e devolve o foco exatamente ao botão de origem ao fechar. As seções de **Compatibilidade**, **Cuidados na Montagem** e **Erros Frequentes** possuem destaque semântico próprio para facilitar a leitura rápida, e os botões de **Componentes Relacionados** navegam entre fichas reiniciando o scroll interno no topo.
  4. **Avaliação no Módulo de Quiz (35 Questões)**:
     - *Tela Inicial do Quiz*: Permite escolher entre **Revisão Geral** (10 questões sorteadas, 15 questões ou todas as 35 questões) ou **Avaliação por Componente Específico** (5 questões dedicadas a qualquer um dos 7 componentes), além de exibir o histórico das tentativas anteriores.
     - *Execução Passo a Passo*: Exibe 1 questão por vez com barra de progresso, nível de dificuldade/tópico (*Fundamentos, Identificação, Funcionamento, Compatibilidade, Instalação, Diagnóstico, Aplicação Prática*), 4 alternativas acessíveis por teclado e botão **Confirmar Resposta**, revelando a explicação técnica antes de passar à próxima questão.
     - *Relatório Final*: Apresenta acertos, erros, percentual de aproveitamento, revisão comentada e botão para nova tentativa.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Sistema de design técnico de alta precisão inspirado em Apple e Linear, utilizando superfícies sóbrias, bordas sutis de `1px` e ausência total de gradientes exagerados, brilhos neon ou elementos decorativos sem função.
  - *Color Palette & Mood*:
    - **Modo Escuro**: Background `#0C1118`, Surface `#151D28`, Surface Elevated `#1C2734`, Primary `#3979B7`, Primary Hover `#5397D1`, Text `#F2F5F8`, Secondary Text `#A2AFBE`, Border `#2A3542`.
    - **Modo Claro**: Background `#F8FAFC`, Surface `#FFFFFF`, Surface Elevated `#F1F5F9`, Primary `#2563EB`, Primary Hover `#1D4ED8`, Text `#0F172A`, Secondary Text `#475569`, Border `#E2E8F0`.
  - *Typography & Hierarchy*: `Plus Jakarta Sans` para títulos e leitura longa (medida de 65–75 caracteres por linha) combinada com `IBM Plex Mono` (`tabular-nums`) para métricas, contadores, tensões, potências e cronômetro.
  - *Responsive Breakpoints*: Layout testado e fluido para `320px`, `375px`, `390px`, `768px`, `1024px`, `1440px` e `1920px`, sem larguras mínimas rígidas que causem corte ou rolagem horizontal.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Base de Dados Centralizada e Compartilhada (`hardwaredex-standalone.js` + Módulo TS)**
  - *Chosen Approach*: Consolidar os 7 componentes revisados, os índices de sinônimos técnicos e o banco de **35 questões de múltipla escolha (4 alternativas cada, 5 por componente)** tanto no módulo TypeScript quanto no motor Vanilla JS (`hardwaredex-standalone.js`).
  - *Why*: Garante que qualquer pessoa acessando `biblioteca.html` ou `ferramenta.html` no GitHub Pages tenha exatamente o mesmo banco de 35 questões, a mesma busca inteligente e o mesmo comportamento de acessibilidade da aplicação principal.

- **Decision 2: Gerenciamento Estrito de Foco e Acessibilidade WCAG 2.2 AA**
  - *Chosen Approach*: Implementar trap de foco (`Tab` / `Shift+Tab`), fechamento por tecla `Esc`, restauração de foco para o elemento acionador (`lastFocusedElement.focus()`), atributos `aria-modal="true"`, `aria-labelledby` e regiões `aria-live="polite"` para contagem de resultados da busca e feedback do quiz.
  - *Why*: Atende integralmente aos requisitos de navegação exclusiva por teclado e leitores de tela.

- **Decision 3: Preservação e Migração Segura de `localStorage`**
  - *Chosen Approach*: Ler e validar com `try/catch` e verificação de tipo (`Array.isArray`) as chaves existentes (`hardwaredex_studied`, `hardwaredex_theme`, `hardwaredex_workbench_v2`) e adicionar chaves complementares (`hardwaredex_viewed`, `hardwaredex_quiz_history`) sem jamais sobrescrever ou corromper o progresso anterior do usuário.
  - *Why*: Protege os dados de estudantes que já utilizam a plataforma e evita que um JSON inválido no navegador trave a renderização.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   Cabeçalho Global Responsivo HardwareDex                   │
│       [HardwareDex]        [Biblioteca | Bancada Virtual]       [Tema]      │
└───────────────────┬─────────────────────────────────────┬───────────────────┘
                    │                                     │
                    ▼                                     ▼
┌───────────────────────────────────────┐ ┌───────────────────────────────────┐
│     AMBIENTE A: BIBLIOTECA TÉCNICA    │ │     AMBIENTE B: BANCADA VIRTUAL   │
│                                       │ │                                   │
│ ┌───────────────────────────────────┐ │ │ ┌───────────────────────────────┐ │
│ │ Painel de Progresso Educacional   │ │ │ │ Seletor de Placa-Mãe          │ │
│ │ Visualizados (0/7) · Estudados    │ │ │ │ [AM4 · DDR4]  [LGA1700 · DDR5]│ │
│ └─────────────────┬─────────────────┘ │ │ └───────────────┬───────────────┘ │
│                   ▼                   │ │                 ▼                 │
│ ┌───────────────────────────────────┐ │ │ ┌─────────┬───────────┬─────────┐ │
│ │ Motor de Busca Multi-Campo +      │ │ │ │Inventário│ Chassi &  │Diagnóst.│ │
│ │ Normalização de Acentos + Filtros │ │ │ │Categoriz.│ Placa-Mãe │& Energia│ │
│ └─────────────────┬─────────────────┘ │ │ └─────────┴─────┬─────┴─────────┘ │
│                   ▼                   │ │                 │                 │
│ ┌─────────────────┴─────────────────┐ │ │                 ▼                 │
│ ▼                                   ▼ │ │ ┌───────────────────────────────┐ │
│ ┌─────────────────┐ ┌───────────────┐ │ │ │ Máquina de Estados + POST     │ │
│ │ Modal Acessível │ │ Módulo Quiz   │ │ │ └───────────────┬───────────────┘ │
│ │ Foco + Tecla Esc│ │ 35 Questões   │ │ └─────────────────┼─────────────────┘
│ │ 8 Seções + Rel. │ │ 1 por vez     │ │                   │
│ └────────┬────────┘ └───────┬───────┘ │                   │
└──────────┼──────────────────┼─────────┘                   │
           └──────────────────┴──────────────┬──────────────┘
                                             ▼
                    ┌─────────────────────────────────────┐
                    │ Camada Segura de Persistência Local │
                    │ hardwaredex_studied · _viewed       │
                    │ hardwaredex_quiz_history · _theme   │
                    └─────────────────────────────────────┘
```

- **Data Model & State**:
  - `LibraryComponent`: Contém os 7 componentes com todos os campos indexáveis (`name`, `shortName`, `category`, `summary`, `mainFunction`, `whatIs`, `howItWorks`, `analogyTitle`, `analogyText`, `characteristics[]`, `compatibility[]`, `care[]`, `commonMistakes[]`, `inWorkbench`, `searchKeywords[]`, `relatedIds[]`).
  - `QuizQuestion`: 35 questões distribuídas igualmente (5 por componente: Placa-mãe, Processador, Cooler/Pasta Térmica, Memória RAM, Armazenamento SSD, Placa de Vídeo, Fonte de Alimentação), cada uma com `id`, `componentId`, `difficulty` (`'Fundamentos' | 'Compatibilidade' | 'Instalação & Diagnóstico'`), `question`, `options` (4 alternativas `a`, `b`, `c`, `d`) e explicação técnica detalhada.
  - `StudyProgressState`: `{ viewedIds: string[], studiedIds: string[], quizHistory: QuizAttemptSummary[] }`.

- **Interactive Component & State Mapping**:
  - **Normalizador de Busca (`normalizeSearchText`)**: Remove diacríticos via `.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()`, permitindo que buscas por `"alimentacao"`, `"alimentação"`, `"m.2"`, `"m2"`, `"am4"`, `"lga1700"`, `"ddr4"`, `"ddr5"`, `"nvme"` ou `"pasta termica"` retornem resultados precisos em tempo real, combinados com o filtro de categoria ativo.
  - **Ciclo de Vida do Modal de Ficha Técnica**: Ao abrir, armazena `document.activeElement`, adiciona `viewedIds`, bloqueia `document.body.style.overflow = 'hidden'`, foca o botão de fechamento/título do modal e intercepta `Tab` (focus trap) e `Escape`. Ao navegar para um componente relacionado, mantém o modal aberto, registra a visualização do novo componente e reposiciona o scroll do container do modal no topo (`scrollTop = 0`).
  - **Máquina de Estados do Quiz**: Opera nos estágios `'setup' -> 'active' -> 'summary'`. No estágio `'active'`, o estudante escolhe uma das 4 alternativas e aciona **Confirmar Resposta** para ver a justificativa técnica antes de clicar em **Próxima Questão** (evitando spoilers antecipados das questões seguintes). Ao concluir, grava o resumo no histórico local e exibe o diagnóstico final por área.
