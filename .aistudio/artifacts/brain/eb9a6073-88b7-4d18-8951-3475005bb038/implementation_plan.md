# HardwareDex — Plataforma Educacional de Hardware e Simulador de Montagem

Uma reconstrução integral e profissional da plataforma educacional **HardwareDex**, unificando a **Biblioteca de Hardware** (`biblioteca.html`) e a **Bancada Virtual** (`ferramenta.html`) sob um sistema de design técnico refinado, máquina de estados determinística, suporte completo a múltiplas plataformas de placa-mãe e acessibilidade universal para sala de aula.

### User Review & Critical Decisions

> [!IMPORTANT]
> Como as perguntas iniciais foram avançadas diretamente, adotamos as recomendações técnicas ideais para garantir máxima fidelidade pedagógica, funcionamento imediato na pré-visualização e compatibilidade total com hospedagem estática ou execução direta no navegador:

- **Entrega Dual (Aplicação Web Integrada + Arquivos HTML Estáticos Executáveis)**: A plataforma funcionará instantaneamente na visualização principal e também disponibilizará os arquivos independentes `biblioteca.html` e `ferramenta.html` prontos para abertura direta (`file://` ou GitHub Pages) e download com um clique.
- **Imagens Locais com Fallback SVG Técnico de Alta Precisão**: A Biblioteca referencia prioritariamente os arquivos originais (`placa.jpg`, `cpu.jpg`, `cooler.jpg`, `ram.jpg`, `ssd.jpg`, `video.jpg`, `fonte.jpg`) e exibe automaticamente ilustrações vetoriais técnicas detalhadas caso os arquivos locais de imagem não estejam presentes no diretório.
- **Seleção de Plataforma de Placa-Mãe na Bancada**: O estudante pode alternar entre duas arquiteturas reais de placa-mãe — **Plataforma AMD (Socket AM4 · DDR4)** e **Plataforma Intel (Socket LGA1700 · DDR5)** — permitindo que 100% dos componentes do inventário original sejam testados em cenários válidos e inválidos.

---

### 1. Overview & Core Concept

- **What It Does**: Ensina estudantes a identificar, compreender, dimensionar, selecionar e instalar componentes internos de um computador pessoal por meio de um ciclo contínuo: **Aprender → Explorar → Selecionar → Montar → Testar → Receber feedback**.
- **Target Audience / Persona**: Estudantes do ensino fundamental II, médio e técnico, além de professores de informática e tecnologia em laboratório ou sala de aula, sem necessidade de conta, login ou conexão com a internet.
- **Key Value**: Substitui a memorização passiva e o antigo simulador com regras fixas/defeituosas por um laboratório técnico interativo onde cada decisão (escolha de socket, geração de memória, aplicação de pasta térmica, interface de armazenamento M.2 vs. SATA, fixação da placa-mãe no gabinete e dimensionamento da fonte) produz diagnóstico técnico claro, reversível e educativo.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Exploração na Biblioteca**: O estudante pesquisa ou filtra os 7 componentes fundamentais, acompanha seu progresso de estudo salvo localmente, abre a visualização técnica estruturada em 8 tópicos pedagógicos (*O que é, Como funciona, Analogia, Características, Compatibilidade, Cuidados, Erros frequentes, Na bancada*) e responde ao quiz de verificação conceitual com explicações imediatas para cada alternativa.
  2. **Preparação na Bancada Virtual**: Ao entrar na bancada, o estudante escolhe a configuração da placa-mãe base (**Kit AMD B550 · Socket AM4 · DDR4** ou **Kit Intel B760 · Socket LGA1700 · DDR5**) e visualiza o chassi técnico 2D com regiões claramente distintas entre gabinete (baia da fonte PSU, baia 2,5" SATA, espaçadores de fixação) e placa-mãe (socket CPU, slots DIMM, slot M.2 PCIe, slot PCIe x16).
  3. **Instalação Multimodal e Correção**: O estudante instala peças arrastando com o mouse, clicando para selecionar e clicar no slot (mouse/toque), ou navegando via teclado (`Tab` + `Enter`). Se instalar Super Bonder ou quiser trocar a CPU, pode remover componentes respeitando a ordem física de dependências (ex.: remover o cooler antes de remover o processador; limpar superfície com álcool isopropílico educativo após erro de material térmico).
  4. **Diagnóstico e Inicialização (POST)**: Ao acionar **Ligar Computador**, o sistema valida todas as condições elétricas, térmicas e lógicas. Se houver falhas, exibe um relatório de diagnóstico técnico detalhado; se a montagem estiver íntegra, executa a sequência visual de POST/BIOS e apresenta o relatório final de desempenho com análise pedagógica.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Engenharia de precisão inspirada em instrumentos técnicos, documentação da Linear/Vercel e esquemáticos de hardware — limpa, sóbria, funcional e sem ornamentos artificiais.
  - *Color Palette & Mood*:
    - **Modo Escuro (Padrão)**: Background `#0C1118`, Surface `#151D28`, Surface Elevated `#1C2734`, Primary `#3979B7`, Primary Hover `#5397D1`, Text `#F2F5F8`, Secondary Text `#A2AFBE`, Border `#2A3542`, além de tokens semânticos sempre acompanhados de ícone e rótulo textual (`#10B981` Sucesso/Nominal, `#F59E0B` Alerta/Atenção, `#EF4444` Erro/Incompatível).
    - **Modo Claro**: Background `#F8FAFC`, Surface `#FFFFFF`, Surface Elevated `#F1F5F9`, Primary `#2563EB`, Primary Hover `#1D4ED8`, Text `#0F172A`, Secondary Text `#475569`, Border `#E2E8F0`.
  - *Typography & Hierarchy*: Títulos e cabeçalhos em `Plus Jakarta Sans` (ou `IBM Plex Sans`), corpo de leitura confortável (65–75 caracteres por linha) e métricas técnicas/consumo elétrico/cronômetro em `IBM Plex Mono` com `tabular-nums`.
  - *Component Styling & Layout*:
    - Cabeçalho global em linha única com 3 zonas bem definidas: Identidade `HardwareDex`, navegação entre `Biblioteca` e `Bancada Virtual` com indicador de ambiente ativo, e controles utilitários de tema e consulta rápida.
    - Bancada em 3 zonas no desktop (Inventário categorizado à esquerda, Chassi + Placa-Mãe SVG interativo ao centro ocupando 60–65% da largura, e Painel de Diagnóstico e Energia à direita) com adaptação responsiva por abas/gavetas em tablets e smartphones.
    - Metadados técnicos exibidos em texto limpo com separadores tipográficos (`Socket AM4 · 65 W · 6 Núcleos`), sem uso de cápsulas coloridas decorativas.

- **Interactive Feedback & Motion**:
  - Transições rápidas (`150ms cubic-bezier(0.16, 1, 0.3, 1)`) restritas a `transform` e `opacity`, respeitando `prefers-reduced-motion`.
  - Realce visual imediato das zonas de encaixe compatíveis ao selecionar um componente no inventário.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Resolução dos 10 Defeitos Estruturais da Auditoria Obrigatória**
  - *Chosen Approach*: Substituir a verificação baseada em `target.children.length` e manipulação direta do DOM por uma máquina de estados centralizada (`AssemblyEngine`).
  - *Why*: Na versão original, parafusos podiam ser soltos em qualquer slot vazio e contabilizados, o cooler ignorava validações de ocupação, o SSD SATA 2,5" e memórias DDR5/Intel LGA1700 eram impossíveis de usar, e peças instaladas desapareciam ou ficavam presas sem opção de remoção. Com o estado centralizado, cada slot aceita exclusivamente sua categoria física e valida pré-requisitos antes de mutar o estado.

- **Decision 2: Modelo Realista de Energia e Dimensionamento de Fonte**
  - *Chosen Approach*: Calcular o consumo total somando CPU + GPU + RAM + Armazenamento + Cooler + Carga Base da Placa-Mãe/VRM (~35 W), comparando tanto com a capacidade nominal da fonte quanto com a margem de segurança operacional recomendada (folga de ~20% para picos transitórios e eficiência) e conectores PCIe necessários.
  - *Why*: Ensina ao estudante a diferença entre consumo estimado do sistema, capacidade nominal e margem segura de operação.

- **Decision 3: Interação Híbrida (Pointer/Click-to-Install + Drag-and-Drop + Teclado)**
  - *Chosen Approach*: Suportar simultaneamente arrastar e soltar, clicar na peça no inventário e clicar no slot de destino na placa-mãe/gabinete, e operar via teclado.
  - *Why*: Garante usabilidade perfeita em desktops, notebooks com trackpad, tablets/smartphones em sala de aula e leitores de tela/navegação por teclado.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Cabeçalho Global HardwareDex                         │
│   [Marca HardwareDex]     [Biblioteca | Bancada Virtual]     [Tema Claro/Escuro] │
└───────────────────┬─────────────────────────────────────┬───────────────────┘
                    │                                     │
                    ▼                                     ▼
┌───────────────────────────────────────┐ ┌───────────────────────────────────┐
│     AMBIENTE A: BIBLIOTECA            │ │     AMBIENTE B: BANCADA VIRTUAL   │
│                                       │ │                                   │
│ ┌───────────────────────────────────┐ │ │ ┌───────────────────────────────┐ │
│ │ Barra de Pesquisa + Filtro Categ. │ │ │ │ Seletor de Placa-Mãe          │ │
│ │ Progresso de Estudo (0/7) + Quiz  │ │ │ │ [AMD AM4/DDR4] [Intel/DDR5]   │ │
│ └─────────────────┬─────────────────┘ │ │ └───────────────┬───────────────┘ │
│                   ▼                   │ │                 ▼                 │
│ ┌───────────────────────────────────┐ │ │ ┌─────────┬───────────┬─────────┐ │
│ │ Catálogo de Cartões de Hardware   │ │ │ │Inventário│ Chassi &  │Painel de│ │
│ │ (Imagem real + Fallback SVG)      │ │ │ │Agrupado │ Placa-Mãe │Diagnóst.│ │
│ └─────────────────┬─────────────────┘ │ │ │por Tipo │ (SVG 2D)  │& Energia│ │
│                   ▼                   │ │ └────┬────┴─────┬─────┴────┬────┘ │
│ ┌───────────────────────────────────┐ │ │      │          │          │      │
│ │ Modal / Painel de Estudo Profundo │ │ │      └──────────┼──────────┘      │
│ │ 8 Seções + Link Direto p/ Bancada │ │ │                 ▼                 │
│ └───────────────────────────────────┘ │ │ ┌───────────────────────────────┐ │
└───────────────────┬───────────────────┘ │ │ Máquina de Estados de Montagem│ │
                    │                     │ │ Validação · Remoção · POST    │ │
                    │                     │ └───────────────┬───────────────┘ │
                    └──────────────────┬──┴─────────────────┘                 │
                                       ▼                                      │
                    ┌─────────────────────────────────────┐                   │
                    │ Persistência Local (LocalStorage)   │                   │
                    │ Tema · Progresso · Estado Bancada   │                   │
                    └─────────────────────────────────────┘                   ┘
```

- **Data Model & State**:
  - `HardwareCatalog`: Base de conhecimento estruturada para os 7 componentes (Placa-mãe, Processador, Cooler, Memória RAM, SSD, Placa de vídeo, Fonte de alimentação), contendo especificações, analogias revisadas, guia passo a passo para a bancada e banco de questões de revisão com justificativas técnicas.
  - `MotherboardProfiles`:
    - `AM4_DDR4`: Socket `AM4`, padrão `DDR4`, slots M.2 NVMe + portas SATA III, PCIe x16, consumo base da placa `35 W`.
    - `LGA1700_DDR5`: Socket `LGA1700`, padrão `DDR5`, slots M.2 NVMe + portas SATA III, PCIe x16, consumo base da placa `40 W`.
  - `WorkbenchState`:
    - `motherboardId`: plataforma ativa (`AM4_DDR4` | `LGA1700_DDR5`).
    - `slots`: `{ cpu, thermalCompound, cooler, ram1, m2, sataBay, gpu, psu, screws: [boolean, boolean, boolean, boolean] }`.
    - `telemetry`: `{ score (inicia em 250), elapsedSeconds, timerActive, finished, powerState ('idle' | 'ready' | 'booting' | 'running' | 'failed'), actionLog[], mistakes[] }`.

- **Interactive Component & State Mapping**:
  - **Validação de Pré-Requisitos e Dependências**:
    - Instalar `Pasta Térmica` exige `cpu !== null` e `cooler === null`.
    - Aplicar `Super Bonder` registra o erro técnico, aplica penalidade proporcional e disponibiliza a ação educativa **"Limpar superfície e remover resíduo"** para destravar a montagem sem obrigar o reinício total.
    - Instalar `Cooler` exige `cpu !== null`, `thermalCompound === 'pasta-termica'` e compatibilidade do suporte (`socket === motherboard.socket`).
    - Remover `CPU` ou `Pasta Térmica` enquanto o `Cooler` estiver instalado informa que é necessário desinstalar o cooler primeiro.
    - `SSD NVMe M.2` instala apenas no conector M.2 da placa-mãe; `SSD SATA 2,5"` instala exclusivamente na baia de 2,5" do gabinete com conexão SATA.
    - `Parafusos` (4 unidades) só podem ser aplicados nos 4 pontos de fixação (`screw-hole-1` a `screw-hole-4`), impedindo reuso do mesmo furo ou aplicação em slots de hardware.
  - **Consulta Contextual Biblioteca ↔ Bancada**:
    - Cada componente e alerta de erro na bancada possui um botão de consulta rápida que abre a ficha técnica correspondente da Biblioteca (ou permite navegar entre `biblioteca.html` e `ferramenta.html`) preservando integralmente o estado da montagem no `localStorage`.
