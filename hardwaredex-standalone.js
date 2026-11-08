/**
 * HardwareDex — Base de Dados Centralizada e Schematics SVG (HTML5 + CSS3 + ES6+)
 * Compartilhada entre biblioteca.html e ferramenta.html para execução estática (GitHub Pages / local).
 */
(function () {
  const SVG_SCHEMATICS = {
    placa: `<svg viewBox="0 0 280 180" style="width:100%;height:100%;max-height:160px;" role="img" aria-label="Esquemático técnico de Placa-Mãe">
      <rect x="35" y="12" width="210" height="156" rx="6" fill="#15202E" stroke="#3979B7" stroke-width="1.5" />
      <path d="M55 40 H110 V80 M175 35 V95 M65 135 H215" stroke="#233549" stroke-width="1.5" fill="none" />
      <rect x="48" y="24" width="18" height="58" rx="2" fill="#2A3A4D" stroke="#5397D1" stroke-width="1" />
      <rect x="74" y="20" width="52" height="14" rx="2" fill="#2A3A4D" stroke="#5397D1" stroke-width="1" />
      <rect x="82" y="42" width="46" height="46" rx="3" fill="#0C1118" stroke="#64A8E0" stroke-width="1.5" />
      <rect x="90" y="50" width="30" height="30" rx="1" fill="#1C2734" stroke="#3979B7" stroke-dasharray="2 2" />
      <text x="105" y="68" text-anchor="middle" fill="#A2AFBE" font-size="7" font-family="monospace">SOCKET</text>
      <rect x="146" y="26" width="7" height="66" rx="1" fill="#0C1118" stroke="#3979B7" stroke-width="1" />
      <rect x="158" y="26" width="7" height="66" rx="1" fill="#0C1118" stroke="#64A8E0" stroke-width="1" />
      <rect x="170" y="26" width="7" height="66" rx="1" fill="#0C1118" stroke="#3979B7" stroke-width="1" />
      <rect x="182" y="26" width="7" height="66" rx="1" fill="#0C1118" stroke="#64A8E0" stroke-width="1" />
      <rect x="82" y="100" width="64" height="12" rx="2" fill="#0C1118" stroke="#5397D1" stroke-width="1" />
      <text x="114" y="108" text-anchor="middle" fill="#64A8E0" font-size="6.5" font-family="monospace">M.2 NVMe</text>
      <rect x="56" y="122" width="125" height="11" rx="2" fill="#0C1118" stroke="#64A8E0" stroke-width="1.2" />
      <text x="118" y="130" text-anchor="middle" fill="#A2AFBE" font-size="6.5" font-family="monospace">PCIe 4.0 x16</text>
      <rect x="166" y="98" width="42" height="32" rx="3" fill="#1E2D3D" stroke="#3979B7" stroke-width="1.2" />
      <text x="187" y="117" text-anchor="middle" fill="#A2AFBE" font-size="6.5" font-family="monospace">CHIPSET</text>
      <circle cx="43" cy="20" r="3.5" fill="#0C1118" stroke="#64A8E0" stroke-width="1.2" />
      <circle cx="237" cy="20" r="3.5" fill="#0C1118" stroke="#64A8E0" stroke-width="1.2" />
      <circle cx="43" cy="160" r="3.5" fill="#0C1118" stroke="#64A8E0" stroke-width="1.2" />
      <circle cx="237" cy="160" r="3.5" fill="#0C1118" stroke="#64A8E0" stroke-width="1.2" />
    </svg>`,
    cpu: `<svg viewBox="0 0 280 180" style="width:100%;height:100%;max-height:160px;" role="img" aria-label="Esquemático técnico de Processador CPU">
      <rect x="80" y="30" width="120" height="120" rx="8" fill="#16302B" stroke="#2D6A5E" stroke-width="2" />
      <rect x="96" y="46" width="88" height="88" rx="6" fill="#2A3644" stroke="#7A8B9E" stroke-width="2" />
      <rect x="106" y="56" width="68" height="68" rx="3" fill="#1F2935" stroke="#3979B7" stroke-width="1" />
      <polygon points="84,146 94,146 84,136" fill="#F59E0B" />
      <text x="140" y="86" text-anchor="middle" fill="#F2F5F8" font-size="11" font-weight="700" font-family="monospace">MULTI-CORE</text>
      <text x="140" y="101" text-anchor="middle" fill="#64A8E0" font-size="8.5" font-family="monospace">CPU ARCHITECTURE</text>
    </svg>`,
    cooler: `<svg viewBox="0 0 280 180" style="width:100%;height:100%;max-height:160px;" role="img" aria-label="Esquemático técnico de Cooler">
      <rect x="76" y="24" width="128" height="132" rx="10" fill="#1A2430" stroke="#47586B" stroke-width="2" />
      <circle cx="92" cy="34" r="4" fill="#C87D4B" /><circle cx="188" cy="34" r="4" fill="#C87D4B" />
      <circle cx="92" cy="146" r="4" fill="#C87D4B" /><circle cx="188" cy="146" r="4" fill="#C87D4B" />
      <circle cx="140" cy="90" r="50" fill="#0E151D" stroke="#3979B7" stroke-width="2" />
      <circle cx="140" cy="90" r="15" fill="#1C2734" stroke="#64A8E0" stroke-width="1.5" />
      <text x="140" y="93" text-anchor="middle" fill="#F2F5F8" font-size="7" font-family="monospace">PWM</text>
    </svg>`,
    ram: `<svg viewBox="0 0 280 180" style="width:100%;height:100%;max-height:160px;" role="img" aria-label="Esquemático técnico de Memória RAM">
      <rect x="26" y="54" width="228" height="62" rx="4" fill="#142824" stroke="#3979B7" stroke-width="1.8" />
      <path d="M30 54 H250 V72 H30 Z" fill="#1F2D3D" />
      <rect x="42" y="76" width="18" height="24" rx="1.5" fill="#0B1016" stroke="#47586B" />
      <rect x="72" y="76" width="18" height="24" rx="1.5" fill="#0B1016" stroke="#47586B" />
      <rect x="102" y="76" width="18" height="24" rx="1.5" fill="#0B1016" stroke="#47586B" />
      <rect x="160" y="76" width="18" height="24" rx="1.5" fill="#0B1016" stroke="#47586B" />
      <rect x="190" y="76" width="18" height="24" rx="1.5" fill="#0B1016" stroke="#47586B" />
      <rect x="220" y="76" width="18" height="24" rx="1.5" fill="#0B1016" stroke="#47586B" />
      <rect x="34" y="116" width="96" height="8" rx="1" fill="#D4AF37" />
      <rect x="138" y="116" width="108" height="8" rx="1" fill="#D4AF37" />
      <text x="140" y="66" text-anchor="middle" fill="#A2AFBE" font-size="8" font-weight="600" font-family="monospace">DIMM DDR4 / DDR5 MEMORY MODULE</text>
    </svg>`,
    ssd: `<svg viewBox="0 0 280 180" style="width:100%;height:100%;max-height:160px;" role="img" aria-label="Esquemático técnico de SSD">
      <rect x="30" y="34" width="215" height="44" rx="4" fill="#111C29" stroke="#5397D1" stroke-width="1.5" />
      <rect x="30" y="42" width="10" height="28" fill="#D4AF37" />
      <text x="135" y="59" text-anchor="middle" fill="#F2F5F8" font-size="8.5" font-family="monospace">NVMe M.2 PCIe 2280</text>
      <rect x="52" y="94" width="176" height="62" rx="6" fill="#1B2531" stroke="#47586B" stroke-width="1.5" />
      <rect x="52" y="112" width="12" height="26" fill="#D4AF37" />
      <text x="144" y="124" text-anchor="middle" fill="#F2F5F8" font-size="9.5" font-weight="600" font-family="monospace">SSD 2.5" SATA III</text>
      <text x="144" y="138" text-anchor="middle" fill="#A2AFBE" font-size="7.5" font-family="monospace">NAND FLASH SOLID STATE</text>
    </svg>`,
    video: `<svg viewBox="0 0 280 180" style="width:100%;height:100%;max-height:160px;" role="img" aria-label="Esquemático técnico de Placa de Vídeo">
      <rect x="28" y="28" width="8" height="122" rx="1" fill="#7A8B9E" />
      <rect x="36" y="38" width="212" height="94" rx="8" fill="#18222F" stroke="#5397D1" stroke-width="1.8" />
      <circle cx="98" cy="85" r="34" fill="#0D131A" stroke="#3979B7" stroke-width="1.5" />
      <circle cx="98" cy="85" r="10" fill="#1C2734" stroke="#64A8E0" />
      <circle cx="184" cy="85" r="34" fill="#0D131A" stroke="#3979B7" stroke-width="1.5" />
      <circle cx="184" cy="85" r="10" fill="#1C2734" stroke="#64A8E0" />
      <rect x="64" y="132" width="118" height="9" rx="1" fill="#D4AF37" />
      <text x="142" y="28" text-anchor="middle" fill="#A2AFBE" font-size="7.5" font-family="monospace">PCIe x16 GRAPHICS PROCESSOR</text>
    </svg>`,
    fonte: `<svg viewBox="0 0 280 180" style="width:100%;height:100%;max-height:160px;" role="img" aria-label="Esquemático técnico de Fonte PSU">
      <rect x="44" y="26" width="192" height="128" rx="8" fill="#151E29" stroke="#47586B" stroke-width="2" />
      <circle cx="105" cy="90" r="44" fill="#0D131A" stroke="#3979B7" stroke-width="1.5" />
      <circle cx="105" cy="90" r="16" fill="#1C2734" stroke="#5397D1" />
      <rect x="162" y="44" width="60" height="92" rx="4" fill="#0D131A" stroke="#3979B7" />
      <text x="192" y="66" text-anchor="middle" fill="#F2F5F8" font-size="10" font-weight="700" font-family="monospace">ATX PSU</text>
      <text x="192" y="84" text-anchor="middle" fill="#64A8E0" font-size="8" font-family="monospace">+12V RAIL</text>
      <text x="192" y="100" text-anchor="middle" fill="#10B981" font-size="8" font-family="monospace">80 PLUS</text>
      <text x="192" y="118" text-anchor="middle" fill="#A2AFBE" font-size="7" font-family="monospace">AC → DC</text>
    </svg>`
  };

  const COMPONENTS = [
    {
      id: 'placa',
      name: 'Placa-Mãe (Motherboard)',
      shortName: 'Placa-Mãe',
      category: 'Estrutura & Conexão',
      image: 'placa.jpg',
      analogy: 'O Esqueleto e Sistema Nervoso',
      summary: 'Circuito impresso central que interconecta fisicamente e eletricamente todos os componentes do computador.',
      mainFunction: 'Interligar CPU, memória, armazenamento, placa de vídeo e distribuir energia e dados entre os barramentos.',
      whatIs: 'A placa-mãe (motherboard) é a principal placa de circuito impresso (PCB) de um computador. Nela estão integrados o socket do processador, os slots de memória RAM, conectores de expansão PCI Express (PCIe), interfaces de armazenamento (M.2 e SATA), o chipset e o circuito regulador de tensão (VRM).',
      howItWorks: 'Sozinha, a placa-mãe não processa softwares do usuário, mas opera como uma malha de comunicação sincronizada. Através de trilhas condutoras de cobre (barramentos) e do chipset, ela coordena o tráfego de dados entre o processador, a memória RAM, unidades de armazenamento e placa de vídeo, além de realizar o diagnóstico inicial do hardware por meio do firmware UEFI/BIOS.',
      analogyText: 'Se o computador fosse uma cidade planejada, a placa-mãe seria o território com todo o sistema de rodovias, pontes e subestações elétricas interligando os edifícios. Sem vias compatíveis, as informações não conseguem circular entre os setores.',
      characteristics: [
        'Socket da CPU: define o padrão físico, mecânico e elétrico do processador suportado (ex.: AMD AM4 ou Intel LGA1700).',
        'Slots DIMM de Memória: determinam a geração de RAM compatível com aquele modelo de placa (DDR4 ou DDR5, nunca ambas no mesmo slot).',
        'Slots de Expansão PCI Express (PCIe): barramentos seriais de alta velocidade, sendo o slot x16 dedicado prioritariamente à placa de vídeo.',
        'Interfaces de Armazenamento: conectores M.2 (para SSDs compactos direto na placa) e portas SATA para cabos de dados.',
        'Furos de Fixação: pontos metalizados projetados para alinhar a placa aos espaçadores (standoffs) do gabinete.'
      ],
      compatibility: [
        'O socket da placa-mãe deve corresponder ao do processador (e ao suporte do cooler), além de exigir versão de BIOS compatível.',
        'Atenção técnica: o socket (como o LGA1700) isoladamente não define o tipo de memória; é o modelo específico da placa-mãe que determina se seus slots físicos são DDR4 ou DDR5.',
        'Requer alimentação principal ATX de 24 pinos e conector EPS 12V (4 ou 8 pinos) para alimentar o VRM do processador.'
      ],
      care: [
        'Instale sempre a placa-mãe sobre os espaçadores metálicos do gabinete utilizando os parafusos corretos para evitar curto-circuito com a chapa.',
        'Manuseie a placa pelas bordas e nunca toque nos pinos internos de sockets LGA ou nos contatos de componentes eletrônicos.'
      ],
      commonMistakes: [
        'Adquirir um processador AMD para uma placa-mãe Intel (ou vice-versa).',
        'Comprar módulos DDR5 para uma placa-mãe construída com slots DDR4.',
        'Deixar a placa-mãe sem parafusos de fixação, causando flexão excessiva da PCB ao encaixar a placa de vídeo ou o cooler.'
      ],
      inWorkbench: 'Na Bancada Virtual, selecione no topo a plataforma desejada (AMD AM4 com DDR4 ou Intel LGA1700 com DDR5) e fixe a placa ao gabinete instalando os 4 parafusos M3 nos cantos.',
      keywords: ['placa-mae', 'placa mae', 'motherboard', 'pcb', 'socket', 'soquete', 'am4', 'lga1700', 'ddr4', 'ddr5', 'm.2', 'm2', 'sata', 'pcie', 'chipset', 'vrm', 'bios', 'uefi', 'parafusos', 'espacadores'],
      related: ['cpu', 'ram', 'ssd', 'fonte']
    },
    {
      id: 'cpu',
      name: 'Processador (CPU)',
      shortName: 'Processador',
      category: 'Processamento',
      image: 'cpu.jpg',
      analogy: 'O Cérebro Lógico',
      summary: 'Unidade Central de Processamento responsável por executar instruções de programas, cálculos lógicos e coordenação do sistema.',
      mainFunction: 'Executar instruções lógicas e aritméticas e coordenar o funcionamento do sistema operacional e dos aplicativos.',
      whatIs: 'O processador, ou CPU (Central Processing Unit), é um circuito integrado contendo bilhões de transistores organizados em múltiplos núcleos de execução (cores), memória cache ultrarrápida e controladores integrados.',
      howItWorks: 'Seguindo o ciclo de busca, decodificação e execução, a CPU lê instruções carregadas na memória RAM, processa operações matemáticas e lógicas em suas unidades internas e grava os resultados. A rápida chaveação elétrica dos transistores converte parte da energia em calor concentrado.',
      analogyText: 'O processador atua como o maestro e cérebro lógico de uma operação: interpreta o plano de ação (código-fonte), toma decisões lógicas imediatas e coordena quando cada componente deve intervir.',
      characteristics: [
        'Padrão de Encaixe (Socket): pode utilizar pinos no próprio processador (PGA, como no AMD AM4) ou contatos planos que repousam sobre pinos na placa-mãe (LGA, como no Intel LGA1700).',
        'TDP (Thermal Design Power): indicador de referência da dissipação térmica sob carga base (ex.: 65 W ou 125 W).',
        'Gráficos Integrados (iGPU): alguns modelos possuem processador gráfico embutido, enquanto outros exigem placa de vídeo dedicada para gerar sinal de monitor.'
      ],
      compatibility: [
        'Deve ser instalado exclusivamente em uma placa-mãe de mesmo socket e chipset/BIOS compatível (Ryzen 5 AM4 em socket AM4; Intel i5 LGA1700 em socket LGA1700).',
        'Exige obrigatoriamente interface térmica (pasta térmica) e dissipador com ventoinha (cooler) compatível antes da energização.'
      ],
      care: [
        'Alinhe a seta dourada (indicador do pino 1) do processador com a marcação do socket na placa-mãe; o encaixe deve ocorrer sem aplicar força.',
        'Nunca ligue o computador sem um cooler devidamente fixado sobre o processador.'
      ],
      commonMistakes: [
        'Tentar instalar um processador em um socket de arquitetura incompatível.',
        'Instalar o cooler diretamente sobre a tampa metálica (IHS) seca, sem pasta térmica.',
        'Tentar retirar a CPU do socket enquanto o cooler ainda está travado sobre ela.'
      ],
      inWorkbench: 'Na Bancada Virtual, selecione o processador compatível com o socket da placa-mãe ativa (AM4 ou LGA1700) e instale-o no socket central antes da pasta térmica e do cooler.',
      keywords: ['processador', 'cpu', 'central processing unit', 'ryzen', 'intel', 'core i5', 'am4', 'lga1700', 'socket', 'soquete', 'pga', 'lga', 'nucleos', 'cores', 'tdp', 'igpu', 'ihs', 'cerebro'],
      related: ['placa', 'cooler', 'ram']
    },
    {
      id: 'cooler',
      name: 'Refrigeração (Cooler & Pasta Térmica)',
      shortName: 'Cooler',
      category: 'Refrigeração',
      image: 'cooler.jpg',
      analogy: 'O Sistema de Climatização',
      summary: 'Conjunto formado pela interface térmica (pasta térmica) e pelo dissipador com ventoinha responsável por manter a CPU em temperatura segura.',
      mainFunction: 'Transferir o calor gerado pelo processador para o dissipador metálico e dissipá-lo no ar.',
      whatIs: 'O sistema de refrigeração da CPU combina dois elementos complementares: a pasta térmica (composto condutor térmico) e o cooler (dissipador metálico aletado acoplado a uma ventoinha controlada por PWM).',
      howItWorks: 'Tanto a tampa metálica do processador (IHS) quanto a base do cooler possuem microimperfeições microscópicas que acumulariam ar — e o ar parado é um mau condutor térmico. A pasta térmica preenche essas microcavidades, conduzindo o calor até o dissipador, onde a ventoinha o remove com fluxo de ar contínuo.',
      analogyText: 'Funciona como o sistema de arrefecimento e radiador de um motor: sem transferência térmica eficiente, a temperatura do processador sobe rapidamente, provocando redução de desempenho (thermal throttling) ou desligamento de proteção.',
      characteristics: [
        'Suporte de Fixação (Bracket): a distância entre os pontos de ancoragem varia conforme o socket (furação AM4 difere da furação LGA1700).',
        'Pasta Térmica: composto formulado para alta condutividade térmica e fácil remoção futura em manutenções.',
        'Nota prática: alguns coolers novos trazem pasta pré-aplicada de fábrica; na bancada didática realizamos a aplicação manual para exercitar o procedimento completo.'
      ],
      compatibility: [
        'Exige que o processador já esteja instalado no socket.',
        'Requer aplicação prévia de pasta térmica adequada sobre o centro do processador.',
        'O mecanismo de fixação do cooler deve ser compatível com o socket da placa-mãe ativa (AM4 ou LGA1700).'
      ],
      care: [
        'Aplique apenas uma pequena quantidade de pasta térmica no centro do difusor metálico da CPU; jamais utilize colas ou adesivos como Super Bonder.',
        'Caso um material incorreto seja aplicado, realize a limpeza completa da superfície com álcool isopropílico antes de aplicar a pasta térmica correta.'
      ],
      commonMistakes: [
        'Montar o cooler esquecendo a pasta térmica.',
        'Aplicar cola rápida (Super Bonder), que atua como isolante térmico e cola fisicamente o cooler ao processador.',
        'Tentar fixar um cooler com suporte exclusivo AMD em uma placa-mãe Intel.'
      ],
      inWorkbench: 'Na Bancada Virtual, após instalar a CPU, aplique a Pasta Térmica sobre ela e, em seguida, instale o Cooler compatível com o socket da placa-mãe.',
      keywords: ['cooler', 'refrigeracao', 'dissipador', 'ventoinha', 'fan', 'pwm', 'pasta termica', 'interface termica', 'super bonder', 'temperatura', 'calor', 'aquecimento', 'thermal throttling', 'am4', 'lga1700'],
      related: ['cpu', 'placa']
    },
    {
      id: 'ram',
      name: 'Memória RAM',
      shortName: 'Memória RAM',
      category: 'Memória',
      image: 'ram.jpg',
      analogy: 'A Bancada de Trabalho Rápida',
      summary: 'Memória volátil de baixa latência onde ficam carregados o sistema operacional e os programas em execução imediata.',
      mainFunction: 'Armazenar temporariamente dados e instruções ativos para leitura e escrita rápidas pelo processador.',
      whatIs: 'A Memória RAM (Random Access Memory) é uma memória semicondutora volátil montada em módulos DIMM (em desktops) ou SO-DIMM (em notebooks), servindo como área de trabalho imediata da CPU.',
      howItWorks: 'Como o armazenamento permanente (SSD ou HD) é mais lento que os registradores da CPU, o sistema operacional carrega os programas e arquivos abertos para a RAM. Por ser volátil, depende de alimentação elétrica contínua: ao desligar o computador, seus dados temporários são esvaziados.',
      analogyText: 'Se o SSD é o armário onde todos os seus livros ficam guardados permanentemente, a Memória RAM é a mesa de estudos à sua frente. Uma mesa ampla permite manter vários livros abertos ao mesmo tempo.',
      characteristics: [
        'Padrão de Geração (DDR4 vs. DDR5): diferem na arquitetura de canais, tensão de operação, gerenciamento de energia e posição do chanfro físico nos contatos.',
        'Capacidade (ex.: 16 GB): determina o volume de aplicações e dados simultâneos mantidos em memória rápida.',
        'Taxa de Transferência (ex.: 3200 MT/s em DDR4; 5200 MT/s em DDR5): indica a largura de banda de comunicação.'
      ],
      compatibility: [
        'Módulos DDR4 encaixam apenas em slots DDR4; módulos DDR5 encaixam apenas em slots DDR5.',
        'A compatibilidade depende dos slots físicos da placa-mãe e do controlador de memória do processador.'
      ],
      care: [
        'Verifique a posição do chanfro (entalhe) na fileira de contatos dourados antes de pressionar o módulo verticalmente até que as travas laterais se fechem.',
        'Segure o módulo pelas extremidades superiores sem tocar nos contatos dourados.'
      ],
      commonMistakes: [
        'Tentar forçar um módulo DDR5 em uma placa-mãe DDR4 (ou vice-versa).',
        'Confundir a capacidade da memória RAM (memória de trabalho volátil) com o espaço de armazenamento do SSD.'
      ],
      inWorkbench: 'Na Bancada Virtual, confira se a placa-mãe ativa utiliza DDR4 ou DDR5 e instale o módulo correspondente no slot DIMM.',
      keywords: ['memoria', 'ram', 'ddr4', 'ddr5', 'dimm', 'volatil', '3200mhz', '5200mhz', '16gb', 'chanfro', 'slot de memoria', 'mesa de trabalho'],
      related: ['placa', 'cpu', 'ssd']
    },
    {
      id: 'ssd',
      name: 'Armazenamento (SSD M.2 & SATA)',
      shortName: 'SSD',
      category: 'Armazenamento',
      image: 'ssd.jpg',
      analogy: 'O Arquivo Permanente de Alta Velocidade',
      summary: 'Unidade de estado sólido não-volátil onde o sistema operacional, aplicativos e arquivos do usuário permanecem gravados.',
      mainFunction: 'Armazenar dados de forma persistente (não-volátil), preservando os arquivos mesmo com o computador desligado.',
      whatIs: 'O SSD (Solid State Drive) é uma unidade de armazenamento persistente construída com chips de memória Flash NAND e um controlador eletrônico, sem discos magnéticos giratórios nem cabeçotes mecânicos.',
      howItWorks: 'Grava e lê dados eletronicamente em células de memória flash. Na plataforma moderna destacam-se dois padrões: o SSD M.2 NVMe (formato compacto conectado diretamente à placa-mãe através de linhas PCI Express) e o SSD SATA de 2,5" (formato retangular conectado por cabos usando o protocolo SATA III).',
      analogyText: 'O SSD funciona como o arquivo permanente da instituição: mesmo quando todo o prédio é desligado no fim do dia, todos os documentos continuam salvos e organizados para a próxima inicialização.',
      characteristics: [
        'Formato M.2 (ex.: 2280): encaixa diretamente no conector M.2 da placa-mãe sem usar cabos.',
        'Formato 2,5" SATA: fixado em uma baia do gabinete e ligado por cabo de dados SATA (na placa-mãe) e cabo de energia SATA (vindo da fonte).',
        'Memória Não-Volátil: retém o sistema operacional e os arquivos pessoais sem necessidade de energia contínua.'
      ],
      compatibility: [
        'Um SSD M.2 deve ser instalado exclusivamente no conector M.2 compatível da placa-mãe.',
        'Um SSD SATA de 2,5 polegadas não pode ser instalado em um conector M.2; ele exige uma baia de 2,5" no gabinete e conexão SATA.'
      ],
      care: [
        'Insira o SSD M.2 suavemente no conector e fixe sua extremidade sobre o espaçador M.2.',
        'No SSD SATA 2,5", certifique-se de conectar tanto o cabo lógico SATA quanto a alimentação elétrica SATA da fonte.'
      ],
      commonMistakes: [
        'Tentar encaixar uma unidade SSD SATA de 2,5" no conector M.2 da placa-mãe.',
        'Esquecer de instalar qualquer unidade de armazenamento, deixando o computador sem sistema operacional.'
      ],
      inWorkbench: 'Na Bancada Virtual, instale o SSD NVMe M.2 diretamente no slot M.2 da placa-mãe ou instale o SSD SATA 2,5" na baia lateral dedicada do gabinete.',
      keywords: ['ssd', 'armazenamento', 'disco', 'hd', 'm.2', 'm2', 'nvme', 'sata', '2.5', '2,5', 'nao volatil', 'flash nand', '1tb', '480gb'],
      related: ['placa', 'ram', 'fonte']
    },
    {
      id: 'video',
      name: 'Placa de Vídeo (GPU)',
      shortName: 'Placa de Vídeo',
      category: 'Gráficos',
      image: 'video.jpg',
      analogy: 'O Estúdio de Renderização Visual',
      summary: 'Unidade de processamento gráfico dedicada com memória própria (VRAM) voltada à renderização de imagens, vídeo e ambientes 3D.',
      mainFunction: 'Processar cálculos gráficos, geometria 3D e sombreamento em paralelo para gerar os quadros exibidos no monitor.',
      whatIs: 'A Placa de Vídeo dedicada é uma placa de expansão equipada com uma GPU (Graphics Processing Unit), memória de vídeo dedicada de alta largura de banda (VRAM GDDR), circuito regulador de tensão próprio e sistema de refrigeração.',
      howItWorks: 'Enquanto o processador central (CPU) possui núcleos projetados para tarefas sequenciais complexas, a GPU conta com milhares de núcleos menores otimizados para processamento massivamente paralelo — ideal para calcular milhões de vértices, texturas e pixels simultaneamente.',
      analogyText: 'Se a CPU é o engenheiro que calcula as regras e a física de uma cena, a Placa de Vídeo é um estúdio com milhares de artistas pintando cada fração do quadro ao mesmo tempo.',
      characteristics: [
        'Interface PCI Express x16: instala-se no slot de expansão longo principal da placa-mãe.',
        'VRAM Dedicada (ex.: 6 GB ou 12 GB GDDR6): armazena texturas e modelos 3D sem consumir a RAM principal.',
        'Demanda Energética Significativa: placas dedicadas intermediárias e avançadas (~120 W a ~170 W ou mais) exigem conectores de alimentação PCIe dedicados da fonte.'
      ],
      compatibility: [
        'Encaixa no barramento PCIe x16 da placa-mãe e requer espaço físico adequado no gabinete.',
        'Sistemas cujo processador não possui vídeo integrado necessitam obrigatoriamente de uma placa de vídeo dedicada para exibir imagem.',
        'Exige uma fonte de alimentação capaz de suprir a carga combinada do sistema e equipada com os cabos PCIe exigidos.'
      ],
      care: [
        'Alinhe o conector PCIe x16 com o slot da placa-mãe até o travamento completo e conecte firmemente os cabos de energia PCIe da fonte.',
        'Conecte o cabo do monitor diretamente nas saídas da placa de vídeo dedicada quando ela estiver instalada.'
      ],
      commonMistakes: [
        'Instalar uma placa de vídeo de alto consumo em uma fonte sem potência ou margem operacional suficiente.',
        'Encaixar a placa no slot PCIe x16 mas esquecer de plugar o cabo de alimentação suplementar vindo da fonte.'
      ],
      inWorkbench: 'Na Bancada Virtual, instale a RTX 3060 (170 W estimados) ou a GTX 1660 Super (120 W estimados) no slot PCIe x16 e verifique o impacto no consumo elétrico total.',
      keywords: ['placa de video', 'gpu', 'vram', 'gddr6', 'pcie', 'pci express', 'x16', 'rtx 3060', 'gtx 1660', 'graficos', 'renderizacao'],
      related: ['placa', 'fonte', 'cpu']
    },
    {
      id: 'fonte',
      name: 'Fonte de Alimentação (PSU)',
      shortName: 'Fonte (PSU)',
      category: 'Energia',
      image: 'fonte.jpg',
      analogy: 'O Coração e Subestação Energética',
      summary: 'Unidade que converte a energia alternada da rede elétrica em tensões contínuas estabilizadas e seguras para todo o hardware.',
      mainFunction: 'Converter corrente alternada (AC) em corrente contínua regulada (+12V, +5V, +3,3V) e proteger o sistema contra anomalias elétricas.',
      whatIs: 'A Fonte de Alimentação, ou PSU (Power Supply Unit), é um conversor chaveado de potência instalado em um compartimento próprio do gabinete (PSU Shroud), conectando-se aos demais componentes por meio de cabos padronizados.',
      howItWorks: 'Recebe a tensão em Corrente Alternada (110V/220V AC) da tomada, corrige o fator de potência (PFC ativo), retifica e transforma em linhas de Corrente Contínua de baixa oscilação (ripple), fornecendo +12V principalmente para CPU e GPU, além de +5V e +3,3V para memórias, SSDs e lógica da placa-mãe.',
      analogyText: 'A fonte atua como o coração e a estação de tratamento elétrico do computador: recebe uma energia bruta externa e distribui o fluxo contínuo e estável que cada componente sensível exige.',
      characteristics: [
        'Potência Nominal Contínua (ex.: 450 W ou 650 W): capacidade máxima que a fonte consegue entregar de forma sustentada.',
        'Certificação 80 Plus (White, Bronze, Gold, etc.): atesta a eficiência energética na conversão (menor desperdício de energia em forma de calor).',
        'Margem Operacional Recomendada: dimensionar a fonte com folga (20% a 30% acima do consumo contínuo estimado) permite absorver picos transitórios e operar com segurança.'
      ],
      compatibility: [
        'Deve ser instalada no compartimento de fonte do gabinete — nunca sobre a placa-mãe.',
        'A capacidade da fonte e sua disponibilidade de conectores (ATX 24 pinos, EPS 8 pinos, PCIe 6+2 pinos e SATA) devem atender toda a configuração escolhida.'
      ],
      care: [
        'Diferencie sempre Consumo Estimado do Sistema, Margem Recomendada de Segurança e Capacidade Nominal da fonte.',
        'Evite operar fontes no limite nominal máximo com combinações de CPU e GPU de alto consumo.'
      ],
      commonMistakes: [
        'Achar que basta a potência nominal da fonte ser numericamente igual ou 5 W maior que a soma simples das peças.',
        'Tentar posicionar a fonte diretamente sobre os slots da placa-mãe em vez do compartimento do gabinete.'
      ],
      inWorkbench: 'Na Bancada Virtual, instale a Fonte de 650 W ou 450 W no compartimento inferior do gabinete e avalie se ela cobre tanto o Consumo Estimado quanto a Margem Recomendada.',
      keywords: ['fonte', 'fonte de alimentacao', 'alimentacao', 'energia', 'psu', 'power supply', 'watts', 'potencia', '450w', '650w', '80 plus', 'bronze', 'white', '12v'],
      related: ['placa', 'video', 'cpu']
    }
  ];

  const QUIZ_QUESTIONS = [
    // PLACA-MÃE (5)
    {
      id: 'q-placa-1', componentId: 'placa', topic: 'Fundamentos',
      question: 'Qual é o papel estrutural e lógico desempenhado pela placa-mãe (motherboard) na arquitetura de um computador?',
      options: [
        { id: 'a', text: 'Executar diretamente os cálculos de renderização 3D no lugar da placa de vídeo.', isCorrect: false, explanation: 'Incorreto. A renderização gráfica pesada cabe à GPU; a placa-mãe fornece o barramento PCIe e a comunicação entre as peças.' },
        { id: 'b', text: 'Interconectar fisicamente e eletricamente todos os componentes, coordenando a comunicação por barramentos e pelo chipset.', isCorrect: true, explanation: 'Correto! A placa-mãe atua como a espinha dorsal e malha de comunicação onde CPU, RAM, armazenamento, GPU e alimentação se integram.' },
        { id: 'c', text: 'Converter a tensão alternada (110V/220V) da tomada elétrica em corrente contínua de 12V.', isCorrect: false, explanation: 'Incorreto. Quem realiza a conversão AC para DC da tomada é a Fonte de Alimentação (PSU).' },
        { id: 'd', text: 'Armazenar permanentemente os arquivos pessoais do usuário quando o computador é desligado.', isCorrect: false, explanation: 'Incorreto. O armazenamento permanente é função do SSD ou HD.' }
      ]
    },
    {
      id: 'q-placa-2', componentId: 'placa', topic: 'Compatibilidade',
      question: 'Um estudante observa que uma placa-mãe possui o socket Intel LGA1700. Como ele deve determinar se deve adquirir memória RAM DDR4 ou DDR5?',
      options: [
        { id: 'a', text: 'Pelo modelo específico da placa-mãe, pois os slots físicos soldados nela aceitam exclusivamente DDR4 ou exclusivamente DDR5.', isCorrect: true, explanation: 'Correto! O socket LGA1700 define o processador, mas cada modelo de placa-mãe é fabricado com slots físicos de apenas um desses padrões.' },
        { id: 'b', text: 'Qualquer módulo DDR4 ou DDR5 encaixa no mesmo slot DIMM, bastando alterar uma opção na BIOS.', isCorrect: false, explanation: 'Incorreto. Os chanfros físicos e tensões de DDR4 e DDR5 são diferentes.' },
        { id: 'c', text: 'Pela potência nominal da fonte de alimentação escolhida para o gabinete.', isCorrect: false, explanation: 'Incorreto. A fonte não define o tipo de slot DIMM da placa-mãe.' },
        { id: 'd', text: 'Pelo formato do SSD instalado no conector M.2 da placa.', isCorrect: false, explanation: 'Incorreto. O armazenamento M.2 é independente do padrão físico dos slots de memória RAM.' }
      ]
    },
    {
      id: 'q-placa-3', componentId: 'placa', topic: 'Instalação',
      question: 'Qual é a função técnica dos espaçadores (standoffs) e dos parafusos M3 utilizados ao instalar a placa-mãe no gabinete?',
      options: [
        { id: 'a', text: 'Aumentar a frequência de operação do processador por condução magnética.', isCorrect: false, explanation: 'Incorreto. Parafusos de fixação têm função mecânica e de aterramento.' },
        { id: 'b', text: 'Apenas estética, sendo opcional instalar parafusos caso o gabinete fique na posição vertical.', isCorrect: false, explanation: 'Incorreto. Jamais se deve deixar a placa-mãe solta no gabinete.' },
        { id: 'c', text: 'Manter a placa-mãe mecanicamente firme, aterrada e afastada da chapa metálica do gabinete para evitar curto-circuitos.', isCorrect: true, explanation: 'Correto! Os espaçadores impedem que as soldas traseiras encostem no metal do gabinete e os parafusos garantem firmeza e aterramento.' },
        { id: 'd', text: 'Substituir a aplicação de pasta térmica no processador.', isCorrect: false, explanation: 'Incorreto. A fixação da placa-mãe não tem relação com a pasta térmica da CPU.' }
      ]
    },
    {
      id: 'q-placa-4', componentId: 'placa', topic: 'Funcionamento',
      question: 'Na placa-mãe, qual é a função do circuito VRM (Voltage Regulator Module) localizado próximo ao socket do processador?',
      options: [
        { id: 'a', text: 'Regular e converter a linha de +12V da fonte para a tensão baixa e precisa exigida pelos núcleos da CPU.', isCorrect: true, explanation: 'Correto! O VRM reduz e estabiliza a tensão de +12V para alimentar o processador com precisão.' },
        { id: 'b', text: 'Armazenar os arquivos do sistema operacional quando o SSD está cheio.', isCorrect: false, explanation: 'Incorreto. O VRM é um circuito eletrônico de potência.' },
        { id: 'c', text: 'Gerar o sinal de áudio para as caixas de som externas.', isCorrect: false, explanation: 'Incorreto. O áudio é processado pelo codec de som.' },
        { id: 'd', text: 'Servir de encaixe físico para unidades SATA de 2,5 polegadas.', isCorrect: false, explanation: 'Incorreto. Unidades SATA 2,5" ficam nas baias do gabinete.' }
      ]
    },
    {
      id: 'q-placa-5', componentId: 'placa', topic: 'Diagnóstico',
      question: 'Durante o processo de inicialização, qual é o papel do firmware UEFI/BIOS presente na placa-mãe?',
      options: [
        { id: 'a', text: 'Realizar o autoteste inicial do hardware (POST), inicializar os barramentos e entregar o controle ao sistema operacional.', isCorrect: true, explanation: 'Correto! O firmware UEFI/BIOS executa o POST, verifica CPU, RAM, vídeo e armazenamento, e inicia o sistema operacional.' },
        { id: 'b', text: 'Resfriar fisicamente a placa de vídeo desligando seus ventiladores.', isCorrect: false, explanation: 'Incorreto. O UEFI/BIOS é o firmware de inicialização da placa-mãe.' },
        { id: 'c', text: 'Aumentar fisicamente a quantidade de gigabytes do SSD instalado.', isCorrect: false, explanation: 'Incorreto. Nenhum firmware altera a capacidade física de chips NAND.' },
        { id: 'd', text: 'Dispensa a necessidade de instalar memória RAM no computador.', isCorrect: false, explanation: 'Incorreto. O POST exige obrigatoriamente memória RAM funcional.' }
      ]
    },
    // PROCESSADOR (5)
    {
      id: 'q-cpu-1', componentId: 'cpu', topic: 'Fundamentos',
      question: 'Qual é a função primordial do Processador (CPU) durante a utilização do computador?',
      options: [
        { id: 'a', text: 'Manter arquivos salvos permanentemente quando o cabo de força é desconectado.', isCorrect: false, explanation: 'Incorreto. O armazenamento permanente é realizado pelo SSD.' },
        { id: 'b', text: 'Buscar, decodificar e executar instruções de programas, realizando cálculos lógicos, aritméticos e controle do sistema.', isCorrect: true, explanation: 'Correto! A CPU processa as instruções de máquina do sistema operacional e dos aplicativos.' },
        { id: 'c', text: 'Transformar a energia da tomada em tensões contínuas para alimentar o gabinete.', isCorrect: false, explanation: 'Incorreto. Essa é a função da Fonte de Alimentação (PSU).' },
        { id: 'd', text: 'Substituir a placa-mãe na conexão física dos cabos SATA.', isCorrect: false, explanation: 'Incorreto. Os conectores SATA ficam na placa-mãe.' }
      ]
    },
    {
      id: 'q-cpu-2', componentId: 'cpu', topic: 'Identificação',
      question: 'Qual é a diferença física fundamental entre os padrões de encaixe PGA (como no socket AMD AM4) e LGA (como no socket Intel LGA1700)?',
      options: [
        { id: 'a', text: 'No PGA os pinos ficam na base do processador; no LGA os pinos delicados ficam no socket da placa-mãe e o processador possui contatos planos.', isCorrect: true, explanation: 'Correto! PGA traz os pinos no próprio processador, enquanto LGA posiciona os pinos no socket da placa-mãe.' },
        { id: 'b', text: 'O padrão PGA é soldado de fábrica e não permite troca, enquanto o LGA usa cabos USB.', isCorrect: false, explanation: 'Incorreto. Ambos são sockets que permitem instalação do processador.' },
        { id: 'c', text: 'Processadores PGA não aquecem e dispensam o uso de cooler.', isCorrect: false, explanation: 'Incorreto. Ambos dissipam calor e exigem refrigeração.' },
        { id: 'd', text: 'O padrão LGA é exclusivo para memórias RAM e o PGA é exclusivo para placas de vídeo.', isCorrect: false, explanation: 'Incorreto. Ambos são padrões de socket para processadores.' }
      ]
    },
    {
      id: 'q-cpu-3', componentId: 'cpu', topic: 'Funcionamento',
      question: 'O que representa a especificação de TDP (Thermal Design Power, ex.: 65 W ou 125 W) informada nas características de um processador?',
      options: [
        { id: 'a', text: 'A velocidade máxima de leitura de arquivos do SSD em megabytes por segundo.', isCorrect: false, explanation: 'Incorreto. O TDP é medido em Watts (W) e refere-se à potência térmica.' },
        { id: 'b', text: 'Uma referência da potência térmica dissipada sob carga base, usada para dimensionar o sistema de refrigeração e estimar o consumo elétrico.', isCorrect: true, explanation: 'Correto! O TDP orienta o dimensionamento do cooler e auxilia na estimativa de carga elétrica da CPU.' },
        { id: 'c', text: 'A quantidade máxima de memória RAM em gigabytes que o processador reconhece.', isCorrect: false, explanation: 'Incorreto. Capacidade de memória é medida em GB.' },
        { id: 'd', text: 'A potência máxima que a fonte pode ter antes de queimar o processador.', isCorrect: false, explanation: 'Incorreto. Uma fonte maior fornece apenas a corrente solicitada pela carga.' }
      ]
    },
    {
      id: 'q-cpu-4', componentId: 'cpu', topic: 'Compatibilidade',
      question: 'Quando um processador NÃO possui gráficos integrados (iGPU), qual condição é necessária para que o computador exiba imagem no monitor?',
      options: [
        { id: 'a', text: 'Instalar dois módulos de memória RAM em vez de apenas um.', isCorrect: false, explanation: 'Incorreto. A memória RAM não gera sinal de vídeo.' },
        { id: 'b', text: 'Instalar uma placa de vídeo dedicada (GPU) em um slot PCIe compatível e conectar o monitor a ela.', isCorrect: true, explanation: 'Correto! Sem unidade gráfica integrada na CPU, é indispensável uma placa de vídeo dedicada.' },
        { id: 'c', text: 'Substituir o SSD M.2 por um SSD SATA de 2,5 polegadas.', isCorrect: false, explanation: 'Incorreto. O tipo de armazenamento não substitui o processador gráfico.' },
        { id: 'd', text: 'Aplicar uma camada dupla de pasta térmica sobre o processador.', isCorrect: false, explanation: 'Incorreto. A pasta térmica atua apenas na condução de calor.' }
      ]
    },
    {
      id: 'q-cpu-5', componentId: 'cpu', topic: 'Instalação',
      question: 'Qual procedimento técnico deve ser respeitado ao instalar ou remover um processador na Bancada Virtual ou em um computador real?',
      options: [
        { id: 'a', text: 'Na instalação, alinhar a marcação do pino 1 sem forçar; na remoção, retirar primeiro o cooler e limpar a pasta térmica antes de abrir o socket.', isCorrect: true, explanation: 'Correto! O processador deve encaixar suavemente alinhado ao pino 1 e nunca pode ser removido com o cooler preso sobre ele.' },
        { id: 'b', text: 'Pressionar o processador com uma chave de fenda para dobrar os pinos.', isCorrect: false, explanation: 'Incorreto. Entortar pinos inutiliza o processador ou a placa-mãe.' },
        { id: 'c', text: 'Aplicar pasta térmica dentro dos furos do socket antes de encaixar o processador.', isCorrect: false, explanation: 'Incorreto! A pasta térmica vai exclusivamente sobre a tampa metálica superior (IHS) após instalar a CPU.' },
        { id: 'd', text: 'Ligar o computador por 5 minutos sem cooler para aquecer o processador.', isCorrect: false, explanation: 'Incorreto. Ligar a CPU sem dissipador causa superaquecimento imediato.' }
      ]
    },
    // COOLER (5)
    {
      id: 'q-cooler-1', componentId: 'cooler', topic: 'Fundamentos',
      question: 'Qual é a função física específica da pasta térmica aplicada entre a tampa metálica do processador (IHS) e a base do cooler?',
      options: [
        { id: 'a', text: 'Colar permanentemente o cooler ao processador para dispensar suportes mecânicos.', isCorrect: false, explanation: 'Incorreto. A pasta térmica não é cola; a fixação mecânica cabe ao suporte do cooler.' },
        { id: 'b', text: 'Preencher microimperfeições superficiais eliminando o ar retido, facilitando a condução do calor da CPU para o dissipador.', isCorrect: true, explanation: 'Correto! Como o ar é um mau condutor térmico, a pasta térmica preenche as micro-ranhuras entre as superfícies metálicas.' },
        { id: 'c', text: 'Gerar ar frio quimicamente sem necessidade de dissipador metálico.', isCorrect: false, explanation: 'Incorreto. A pasta térmica apenas conduz o calor até o dissipador.' },
        { id: 'd', text: 'Aumentar a tensão elétrica fornecida aos pinos do socket.', isCorrect: false, explanation: 'Incorreto. A pasta térmica atua na transferência de calor no topo da CPU.' }
      ]
    },
    {
      id: 'q-cooler-2', componentId: 'cooler', topic: 'Diagnóstico',
      question: 'Por que o uso de adesivo cianoacrilato (Super Bonder) no lugar da pasta térmica representa um erro grave de montagem?',
      options: [
        { id: 'a', text: 'Porque atua como isolante térmico impedindo a dissipação de calor, além de fundir mecanicamente o cooler ao processador.', isCorrect: true, explanation: 'Correto! Colas rápidas bloqueiam a transferência térmica e travam mecanicamente as peças.' },
        { id: 'b', text: 'Porque faz a ventoinha do cooler girar rápido demais.', isCorrect: false, explanation: 'Incorreto. O problema é o bloqueio térmico e o dano mecânico.' },
        { id: 'c', text: 'Porque só é compatível com processadores de socket LGA1700.', isCorrect: false, explanation: 'Incorreto. Nenhum processador deve receber colas ou adesivos.' },
        { id: 'd', text: 'Porque reduz a capacidade de armazenamento do SSD M.2.', isCorrect: false, explanation: 'Incorreto. O efeito ocorre no conjunto térmico do processador.' }
      ]
    },
    {
      id: 'q-cooler-3', componentId: 'cooler', topic: 'Compatibilidade',
      question: 'O que determina se um determinado Air Cooler pode ser instalado corretamente sobre a placa-mãe escolhida?',
      options: [
        { id: 'a', text: 'A compatibilidade do suporte de fixação (bracket/furação) com o socket da placa-mãe e a capacidade de dissipação adequada ao TDP da CPU.', isCorrect: true, explanation: 'Correto! Cada socket (AM4 ou LGA1700) possui dimensões geométricas próprias para o suporte de retenção do cooler.' },
        { id: 'b', text: 'A marca do monitor conectado ao computador.', isCorrect: false, explanation: 'Incorreto. O monitor não tem relação com o encaixe do cooler.' },
        { id: 'c', text: 'A quantidade de arquivos gravados no SSD SATA.', isCorrect: false, explanation: 'Incorreto. O armazenamento não afeta a furação física do socket.' },
        { id: 'd', text: 'O tipo de cabo HDMI utilizado na placa de vídeo.', isCorrect: false, explanation: 'Incorreto. Cabos de vídeo são independentes da refrigeração da CPU.' }
      ]
    },
    {
      id: 'q-cooler-4', componentId: 'cooler', topic: 'Funcionamento',
      question: 'O que é o fenômeno conhecido como Thermal Throttling (estrangulamento térmico) em um processador?',
      options: [
        { id: 'a', text: 'Um mecanismo de autoproteção que reduz automaticamente a frequência e a tensão da CPU quando a temperatura atinge limites críticos.', isCorrect: true, explanation: 'Correto! Para evitar danos físicos por superaquecimento, a CPU reduz seu clock drasticamente.' },
        { id: 'b', text: 'Um modo especial que dobra a velocidade dos jogos quando o cooler está desligado.', isCorrect: false, explanation: 'Incorreto. O Thermal Throttling reduz o desempenho para conter o calor.' },
        { id: 'c', text: 'A conversão automática de memória DDR4 em DDR5 pelo aquecimento.', isCorrect: false, explanation: 'Incorreto. Padrões físicos de memória não mudam com a temperatura.' },
        { id: 'd', text: 'O congelamento físico da fonte de alimentação abaixo de 0°C.', isCorrect: false, explanation: 'Incorreto. Trata-se da redução de clock por excesso de temperatura.' }
      ]
    },
    {
      id: 'q-cooler-5', componentId: 'cooler', topic: 'Aplicação Prática',
      question: 'Durante uma manutenção na bancada, caso um material inadequado ou pasta térmica ressecada esteja sobre o processador, qual é o procedimento técnico correto?',
      options: [
        { id: 'a', text: 'Raspar a tampa do processador com uma faca metálica ou lixa grossa.', isCorrect: false, explanation: 'Incorreto. Objetos metálicos cortantes riscam o difusor térmico (IHS).' },
        { id: 'b', text: 'Lavar a placa-mãe inteira em água corrente com detergente comum.', isCorrect: false, explanation: 'Incorreto. Água comum contém sais minerais que causam oxidação e curto-circuito.' },
        { id: 'c', text: 'Limpar cuidadosamente a superfície utilizando álcool isopropílico e um pano sem fiapos antes de aplicar a nova pasta térmica.', isCorrect: true, explanation: 'Correto! O álcool isopropílico dissolve resíduos térmicos e evapora rapidamente sem deixar água.' },
        { id: 'd', text: 'Aplicar a pasta térmica nova diretamente por cima da cola ou resíduo antigo.', isCorrect: false, explanation: 'Incorreto. O resíduo antigo impedirá o contato térmico uniforme.' }
      ]
    },
    // MEMÓRIA RAM (5)
    {
      id: 'q-ram-1', componentId: 'ram', topic: 'Fundamentos',
      question: 'Por que a Memória RAM é classificada tecnicamente como uma memória "volátil"?',
      options: [
        { id: 'a', text: 'Porque seus dados são mantidos apenas enquanto há alimentação elétrica, sendo esvaziada ao desligar o computador.', isCorrect: true, explanation: 'Correto! Quando o computador é desligado, todo o conteúdo temporário da RAM é perdido.' },
        { id: 'b', text: 'Porque ela evapora fisicamente se o gabinete ficar aberto.', isCorrect: false, explanation: 'Incorreto. "Volátil" refere-se à dependência de energia elétrica para retenção dos dados.' },
        { id: 'c', text: 'Porque ela guarda fotos e documentos permanentemente por décadas sem energia.', isCorrect: false, explanation: 'Incorreto. Essa é a definição de memória não-volátil (como o SSD).' },
        { id: 'd', text: 'Porque pode ser encaixada em qualquer slot PCIe ou SATA.', isCorrect: false, explanation: 'Incorreto. A RAM utiliza slots específicos DIMM/SO-DIMM.' }
      ]
    },
    {
      id: 'q-ram-2', componentId: 'ram', topic: 'Compatibilidade',
      question: 'O que acontece ao tentar instalar um módulo de memória DDR5 em uma placa-mãe cujos slots são padrão DDR4?',
      options: [
        { id: 'a', text: 'O módulo encaixa normalmente e funciona na metade da velocidade.', isCorrect: false, explanation: 'Incorreto. Não há retrocompatibilidade física nem elétrica entre DDR4 e DDR5.' },
        { id: 'b', text: 'O módulo não encaixa, pois a posição do chanfro físico (key notch) e a arquitetura elétrica são diferentes entre DDR4 e DDR5.', isCorrect: true, explanation: 'Correto! O entalhe na fileira de contatos dourados é diferente em cada geração DDR.' },
        { id: 'c', text: 'O módulo transforma a placa-mãe em DDR5 automaticamente.', isCorrect: false, explanation: 'Incorreto. O hardware físico da placa-mãe não se altera.' },
        { id: 'd', text: 'O módulo deve ser instalado de cabeça para baixo para funcionar.', isCorrect: false, explanation: 'Incorreto. Módulos DIMM possuem sentido único de inserção.' }
      ]
    },
    {
      id: 'q-ram-3', componentId: 'ram', topic: 'Funcionamento',
      question: 'Qual é o benefício prático de ter uma quantidade adequada de Memória RAM (como 16 GB ou mais) ao utilizar vários programas pesados simultaneamente?',
      options: [
        { id: 'a', text: 'Permite manter os dados ativos na memória rápida, evitando que o sistema precise recorrer constantemente ao armazenamento (paginação), o que causaria lentidão.', isCorrect: true, explanation: 'Correto! Quando a RAM se esgota, o sistema usa paginação em disco, que é muito mais lenta.' },
        { id: 'b', text: 'Aumenta a potência em Watts da fonte de alimentação.', isCorrect: false, explanation: 'Incorreto. A memória RAM não aumenta a capacidade da fonte.' },
        { id: 'c', text: 'Substitui a necessidade de ter um processador instalado na placa-mãe.', isCorrect: false, explanation: 'Incorreto. A RAM apenas armazena dados temporários para a CPU.' },
        { id: 'd', text: 'Reduz a temperatura do processador em 40°C.', isCorrect: false, explanation: 'Incorreto. A refrigeração da CPU depende do cooler.' }
      ]
    },
    {
      id: 'q-ram-4', componentId: 'ram', topic: 'Instalação',
      question: 'Qual é o procedimento correto para encaixar um módulo de memória RAM no slot DIMM da placa-mãe?',
      options: [
        { id: 'a', text: 'Abrir a(s) trava(s) lateral(is) do slot, alinhar o chanfro do módulo com a guia interna e pressionar verticalmente até o clique de travamento.', isCorrect: true, explanation: 'Correto! O alinhamento prévio do chanfro evita danos e o clique confirma o encaixe completo.' },
        { id: 'b', text: 'Inserir o módulo inclinado a 45 graus e prendê-lo com um parafuso M3 no meio do chip.', isCorrect: false, explanation: 'Incorreto. Quem usa parafuso na extremidade é o SSD M.2.' },
        { id: 'c', text: 'Passar pasta térmica nos contatos dourados da memória antes de encaixar.', isCorrect: false, explanation: 'Incorreto! Os contatos dourados da RAM devem permanecer limpos e secos.' },
        { id: 'd', text: 'Encaixar a memória RAM no slot PCIe x16 da placa de vídeo.', isCorrect: false, explanation: 'Incorreto. Slots PCIe e slots DIMM são totalmente distintos.' }
      ]
    },
    {
      id: 'q-ram-5', componentId: 'ram', topic: 'Diagnóstico',
      question: 'Se um computador é montado e ligado sem nenhum módulo de memória RAM instalado nos slots DIMM, qual será o comportamento do sistema?',
      options: [
        { id: 'a', text: 'O computador não conclui o POST (não exibe vídeo nem carrega o sistema), acusando falha de memória (DRAM LED).', isCorrect: true, explanation: 'Correto! A memória RAM é indispensável logo nos primeiros instantes do POST.' },
        { id: 'b', text: 'O sistema operacional inicia normalmente usando apenas a memória interna da fonte.', isCorrect: false, explanation: 'Incorreto. Nenhum computador pessoal inicializa sem memória RAM.' },
        { id: 'c', text: 'O computador funciona normalmente, porém sem som.', isCorrect: false, explanation: 'Incorreto. Sem RAM, a máquina não completa o boot.' },
        { id: 'd', text: 'O cooler do processador gira ao contrário.', isCorrect: false, explanation: 'Incorreto. A ausência de RAM bloqueia o POST.' }
      ]
    },
    // ARMAZENAMENTO / SSD (5)
    {
      id: 'q-ssd-1', componentId: 'ssd', topic: 'Fundamentos',
      question: 'Qual característica principal diferencia o armazenamento em SSD (Solid State Drive) da Memória RAM?',
      options: [
        { id: 'a', text: 'O SSD é uma memória não-volátil baseada em Flash NAND que preserva o sistema operacional e os arquivos mesmo sem energia elétrica.', isCorrect: true, explanation: 'Correto! Enquanto a RAM é volátil e temporária, o SSD retém os dados gravados permanentemente.' },
        { id: 'b', text: 'O SSD apaga todos os arquivos sempre que o computador é reiniciado.', isCorrect: false, explanation: 'Incorreto. O SSD mantém os arquivos salvos após desligar.' },
        { id: 'c', text: 'O SSD utiliza discos magnéticos giratórios a 7200 RPM.', isCorrect: false, explanation: 'Incorreto. Quem possui discos giratórios é o HD mecânico (HDD).' },
        { id: 'd', text: 'O SSD serve apenas para resfriar o gabinete.', isCorrect: false, explanation: 'Incorreto. O SSD é uma unidade de armazenamento de dados.' }
      ]
    },
    {
      id: 'q-ssd-2', componentId: 'ssd', topic: 'Identificação',
      question: 'Qual é a diferença física e de instalação entre um SSD M.2 NVMe e um SSD SATA de 2,5 polegadas?',
      options: [
        { id: 'a', text: 'O SSD M.2 é uma placa compacta conectada direto no slot M.2 da placa-mãe; o SSD SATA 2,5" é instalado em uma baia do gabinete e conectado por cabos SATA.', isCorrect: true, explanation: 'Correto! O formato M.2 dispensa cabos e vai direto na placa-mãe, enquanto o 2,5" fica na baia do gabinete.' },
        { id: 'b', text: 'Ambos possuem o mesmo formato físico e são encaixados no mesmo conector M.2.', isCorrect: false, explanation: 'Incorreto. O SSD SATA 2,5" não entra em um conector M.2.' },
        { id: 'c', text: 'O SSD M.2 precisa ser instalado dentro da fonte de alimentação.', isCorrect: false, explanation: 'Incorreto. Nenhum armazenamento é instalado dentro da fonte.' },
        { id: 'd', text: 'O SSD SATA 2,5" é encaixado nos slots DIMM de memória RAM.', isCorrect: false, explanation: 'Incorreto. Slots DIMM são exclusivos para módulos de memória RAM.' }
      ]
    },
    {
      id: 'q-ssd-3', componentId: 'ssd', topic: 'Funcionamento',
      question: 'Por que um SSD NVMe M.2 (ex.: 3500 MB/s) alcança taxas de transferência muito superiores às de um SSD SATA III de 2,5" (ex.: 550 MB/s)?',
      options: [
        { id: 'a', text: 'Porque o protocolo NVMe comunica-se diretamente através de linhas de alta velocidade do barramento PCI Express (PCIe), superando o limite de ~600 MB/s da interface SATA III.', isCorrect: true, explanation: 'Correto! O barramento PCIe oferece largura de banda muito superior ao padrão SATA III.' },
        { id: 'b', text: 'Porque o SSD SATA usa apenas metade dos cabos da tomada.', isCorrect: false, explanation: 'Incorreto. A diferença decorre do barramento PCIe vs. SATA III.' },
        { id: 'c', text: 'Porque o SSD M.2 gira seu disco interno a 50.000 rotações por minuto.', isCorrect: false, explanation: 'Incorreto. SSDs não possuem discos giratórios.' },
        { id: 'd', text: 'Porque o SSD NVMe só armazena arquivos de texto pequenos.', isCorrect: false, explanation: 'Incorreto. Ele armazena qualquer tipo de arquivo e o sistema operacional.' }
      ]
    },
    {
      id: 'q-ssd-4', componentId: 'ssd', topic: 'Instalação',
      question: 'Para que um SSD SATA de 2,5 polegadas funcione corretamente após ser fixado na baia do gabinete, quais conexões são indispensáveis?',
      options: [
        { id: 'a', text: 'Um cabo de dados SATA ligado à placa-mãe e um conector de alimentação SATA vindo da fonte de alimentação.', isCorrect: true, explanation: 'Correto! O SSD 2,5" precisa do cabo lógico SATA e do cabo de energia SATA.' },
        { id: 'b', text: 'Apenas encostar a carcaça metálica do SSD na lateral do gabinete, sem cabos.', isCorrect: false, explanation: 'Incorreto. Sem conexões de dados e energia a unidade não funciona.' },
        { id: 'c', text: 'Ligar um cabo HDMI diretamente do SSD para o monitor.', isCorrect: false, explanation: 'Incorreto. Unidades de armazenamento não possuem saída HDMI.' },
        { id: 'd', text: 'Aplicar pasta térmica nos conectores SATA dourados.', isCorrect: false, explanation: 'Incorreto. Conectores elétricos nunca devem receber pasta térmica.' }
      ]
    },
    {
      id: 'q-ssd-5', componentId: 'ssd', topic: 'Aplicação Prática',
      question: 'É tecnicamente possível utilizar um SSD M.2 NVMe (na placa-mãe) e um SSD SATA 2,5" (na baia do gabinete) simultaneamente no mesmo computador?',
      options: [
        { id: 'a', text: 'Sim, desde que a placa-mãe possua slot M.2 e porta SATA disponíveis, permitindo somar as duas unidades para sistema e arquivos.', isCorrect: true, explanation: 'Correto! As interfaces M.2 e SATA podem operar juntas no mesmo computador.' },
        { id: 'b', text: 'Não, pois a instalação de dois SSDs causa curto-circuito imediato na memória RAM.', isCorrect: false, explanation: 'Incorreto. Placas-mãe modernas suportam múltiplas unidades de armazenamento.' },
        { id: 'c', text: 'Apenas se o computador não tiver processador instalado.', isCorrect: false, explanation: 'Incorreto. O processador é sempre obrigatório.' },
        { id: 'd', text: 'Não, pois o gabinete só aceita uma peça de armazenamento por vez.', isCorrect: false, explanation: 'Incorreto. Ambas as unidades podem ser instaladas simultaneamente.' }
      ]
    },
    // PLACA DE VÍDEO / GPU (5)
    {
      id: 'q-video-1', componentId: 'video', topic: 'Fundamentos',
      question: 'Por que a arquitetura interna de uma Placa de Vídeo (GPU) é muito mais eficiente que a CPU para renderizar gráficos 3D e jogos?',
      options: [
        { id: 'a', text: 'Porque possui milhares de núcleos menores projetados para processar cálculos matemáticos e pixels simultaneamente em paralelo.', isCorrect: true, explanation: 'Correto! A renderização gráfica exige calcular milhões de pixels independentes ao mesmo tempo.' },
        { id: 'b', text: 'Porque a placa de vídeo não utiliza energia elétrica.', isCorrect: false, explanation: 'Incorreto. A placa de vídeo costuma ser o componente de maior consumo elétrico.' },
        { id: 'c', text: 'Porque ela substitui o SSD no armazenamento permanente de documentos.', isCorrect: false, explanation: 'Incorreto. A memória da placa de vídeo (VRAM) é volátil.' },
        { id: 'd', text: 'Porque é encaixada diretamente dentro do socket do processador.', isCorrect: false, explanation: 'Incorreto. A placa de vídeo dedicada utiliza o barramento PCIe x16.' }
      ]
    },
    {
      id: 'q-video-2', componentId: 'video', topic: 'Identificação',
      question: 'O que é a VRAM (ex.: 6 GB ou 12 GB GDDR6) presente em uma placa de vídeo dedicada?',
      options: [
        { id: 'a', text: 'Uma memória de vídeo ultrarrápida soldada na própria placa de vídeo para armazenar texturas, modelos 3D e quadros de imagem.', isCorrect: true, explanation: 'Correto! A VRAM oferece altíssima largura de banda dedicada para os dados visuais da GPU.' },
        { id: 'b', text: 'Um disco rígido mecânico instalado atrás do monitor.', isCorrect: false, explanation: 'Incorreto. A VRAM é memória semicondutora volátil integrada à placa de vídeo.' },
        { id: 'c', text: 'Um cabo de força extra que liga a fonte na tomada.', isCorrect: false, explanation: 'Incorreto. VRAM significa Video Random Access Memory.' },
        { id: 'd', text: 'Uma memória que pode ser removida da placa de vídeo e encaixada nos slots DDR4 da placa-mãe.', isCorrect: false, explanation: 'Incorreto. Os chips GDDR6 são soldados diretamente na placa de vídeo.' }
      ]
    },
    {
      id: 'q-video-3', componentId: 'video', topic: 'Instalação',
      question: 'Em qual barramento da placa-mãe deve ser instalada uma placa de vídeo dedicada moderna como a RTX 3060 ou GTX 1660 Super?',
      options: [
        { id: 'a', text: 'No slot PCI Express x16 (PCIe x16) principal da placa-mãe.', isCorrect: true, explanation: 'Correto! O slot PCIe x16 oferece as 16 pistas de comunicação de alta velocidade.' },
        { id: 'b', text: 'No conector M.2 2280.', isCorrect: false, explanation: 'Incorreto. O conector M.2 é compacto e destinado a SSDs.' },
        { id: 'c', text: 'Nos slots DIMM verticais ao lado da CPU.', isCorrect: false, explanation: 'Incorreto. Os slots DIMM são exclusivos para memória RAM.' },
        { id: 'd', text: 'Diretamente na porta SATA III por meio de um cabo plano.', isCorrect: false, explanation: 'Incorreto. Portas SATA são interfaces de armazenamento.' }
      ]
    },
    {
      id: 'q-video-4', componentId: 'video', topic: 'Compatibilidade',
      question: 'Por que placas de vídeo de médio e alto desempenho (ex.: 120 W a 170 W ou mais) exigem conectores de energia PCIe diretamente da fonte, além do encaixe na placa-mãe?',
      options: [
        { id: 'a', text: 'Porque o slot PCIe x16 da placa-mãe fornece no máximo até 75 W, sendo necessário alimentar o restante da demanda pelos cabos PCIe da fonte.', isCorrect: true, explanation: 'Correto! O slot PCIe fornece até 75 W; placas de maior consumo dependem dos cabos PCIe da fonte.' },
        { id: 'b', text: 'Porque o slot PCIe transmite apenas som e nenhuma energia.', isCorrect: false, explanation: 'Incorreto. O slot transmite dados e até 75 W de energia.' },
        { id: 'c', text: 'Para transferir os arquivos do SSD para a fonte de alimentação.', isCorrect: false, explanation: 'Incorreto. Os cabos PCIe da fonte fornecem exclusivamente energia (+12V).' },
        { id: 'd', text: 'Apenas para segurar a placa mecanicamente no ar.', isCorrect: false, explanation: 'Incorreto. A sustentação mecânica vem do slot PCIe e do gabinete.' }
      ]
    },
    {
      id: 'q-video-5', componentId: 'video', topic: 'Diagnóstico',
      question: 'Ao concluir a montagem de um computador que possui uma Placa de Vídeo dedicada instalada no slot PCIe x16, onde o cabo do monitor (HDMI/DisplayPort) deve ser conectado?',
      options: [
        { id: 'a', text: 'Diretamente nas saídas de vídeo da própria Placa de Vídeo dedicada.', isCorrect: true, explanation: 'Correto! O monitor deve ser plugado nas saídas da placa de vídeo dedicada.' },
        { id: 'b', text: 'Na grade traseira da fonte de alimentação.', isCorrect: false, explanation: 'Incorreto. A fonte possui apenas entrada AC e chave liga/desliga.' },
        { id: 'c', text: 'Na porta de rede RJ-45 da placa-mãe.', isCorrect: false, explanation: 'Incorreto. A porta RJ-45 é para rede Ethernet.' },
        { id: 'd', text: 'Sempre na saída da placa-mãe, mesmo que o processador não tenha vídeo integrado.', isCorrect: false, explanation: 'Incorreto. Sem vídeo integrado na CPU, as saídas da placa-mãe não geram imagem.' }
      ]
    },
    // FONTE DE ALIMENTAÇÃO / PSU (5)
    {
      id: 'q-fonte-1', componentId: 'fonte', topic: 'Fundamentos',
      question: 'Qual é a função elétrica essencial realizada pela Fonte de Alimentação (PSU) em um computador?',
      options: [
        { id: 'a', text: 'Converter a Corrente Alternada (AC) da tomada em tensões de Corrente Contínua (DC: +12V, +5V, +3,3V) reguladas e filtradas.', isCorrect: true, explanation: 'Correto! Circuitos digitais operam em corrente contínua; a fonte realiza essa conversão com estabilidade.' },
        { id: 'b', text: 'Enviar 220V em Corrente Alternada diretamente para os núcleos do processador.', isCorrect: false, explanation: 'Incorreto. Aplicar 220V AC diretamente nos chips queimaria o hardware.' },
        { id: 'c', text: 'Armazenar temporariamente as abas abertas do navegador de internet.', isCorrect: false, explanation: 'Incorreto. Dados de programas abertos ficam na Memória RAM.' },
        { id: 'd', text: 'Renderizar os gráficos 3D quando a placa de vídeo aquece.', isCorrect: false, explanation: 'Incorreto. A fonte é um componente de alimentação elétrica.' }
      ]
    },
    {
      id: 'q-fonte-2', componentId: 'fonte', topic: 'Instalação',
      question: 'Onde a Fonte de Alimentação (PSU) é fisicamente instalada dentro da estrutura do computador?',
      options: [
        { id: 'a', text: 'Em um compartimento dedicado do gabinete (como o PSU Shroud inferior), distribuindo energia aos componentes através de cabos.', isCorrect: true, explanation: 'Correto! A fonte é fixada no chassi do gabinete e nunca encaixada diretamente em slots da placa-mãe.' },
        { id: 'b', text: 'Encaixada diretamente sobre o socket do processador no lugar do cooler.', isCorrect: false, explanation: 'Incorreto. Sobre o processador vai o cooler.' },
        { id: 'c', text: 'Dentro do conector M.2 da placa-mãe.', isCorrect: false, explanation: 'Incorreto. O conector M.2 é para unidades SSD compactas.' },
        { id: 'd', text: 'Parafusada em cima da memória RAM.', isCorrect: false, explanation: 'Incorreto. A fonte fica isolada em seu próprio compartimento no gabinete.' }
      ]
    },
    {
      id: 'q-fonte-3', componentId: 'fonte', topic: 'Funcionamento',
      question: 'O que significa tecnicamente a certificação "80 Plus" (White, Bronze, Gold, etc.) presente em uma fonte de alimentação?',
      options: [
        { id: 'a', text: 'Indica o nível de eficiência energética na conversão AC/DC (pelo menos 80% da energia puxada da tomada é entregue útil ao PC, desperdiçando menos em calor).', isCorrect: true, explanation: 'Correto! Uma fonte mais eficiente desperdiça menos energia elétrica na forma de calor.' },
        { id: 'b', text: 'Significa que a fonte dura obrigatoriamente 80 anos sem manutenção.', isCorrect: false, explanation: 'Incorreto. Refere-se ao percentual mínimo de eficiência energética (80%).' },
        { id: 'c', text: 'Garante que qualquer fonte de 400 W entregue 800 W continuamente.', isCorrect: false, explanation: 'Incorreto. A potência máxima contínua continua sendo a potência nominal rotulada.' },
        { id: 'd', text: 'Indica que a fonte possui 80 cabos SATA.', isCorrect: false, explanation: 'Incorreto. Não tem relação com a quantidade de cabos.' }
      ]
    },
    {
      id: 'q-fonte-4', componentId: 'fonte', topic: 'Compatibilidade',
      question: 'Na Bancada Virtual, uma configuração com Intel i5 (125 W) + RTX 3060 (170 W) + Placa-Mãe LGA1700 (40 W) + periféricos soma ~350 W contínuos. Por que o diagnóstico recomenda a Fonte de 650 W em vez da Fonte de 450 W?',
      options: [
        { id: 'a', text: 'Porque ao adicionar a margem operacional recomendada (~30% para picos transitórios e eficiência), a demanda segura (~460 W) ultrapassa a capacidade da fonte de 450 W.', isCorrect: true, explanation: 'Correto! Componentes de alto desempenho apresentam picos transitórios de corrente; operar sem margem compromete a estabilidade.' },
        { id: 'b', text: 'Porque processadores Intel só funcionam com fontes de exatamente 650 W.', isCorrect: false, explanation: 'Incorreto. O dimensionamento depende da carga total combinada.' },
        { id: 'c', text: 'Porque a fonte de 450 W é compatível apenas com memórias DDR4.', isCorrect: false, explanation: 'Incorreto. Fontes ATX alimentam placas DDR4 ou DDR5 indistintamente.' },
        { id: 'd', text: 'Porque a fonte de 650 W aumenta a capacidade do SSD em 500 GB.', isCorrect: false, explanation: 'Incorreto. A fonte fornece alimentação elétrica, não armazenamento.' }
      ]
    },
    {
      id: 'q-fonte-5', componentId: 'fonte', topic: 'Aplicação Prática',
      question: 'Se um computador consome cerca de 235 W em uso normal e está equipado com uma fonte de qualidade de 650 W, quanta potência a fonte entregará aos componentes nesse momento?',
      options: [
        { id: 'a', text: 'Apenas os ~235 W solicitados pelos componentes naquele instante, trabalhando com ampla folga e segurança.', isCorrect: true, explanation: 'Correto! A potência nominal (650 W) é o teto máximo disponível; a fonte fornece apenas a corrente que o sistema demanda.' },
        { id: 'b', text: 'Forçará 650 W contínuos dentro da placa-mãe, queimando os componentes.', isCorrect: false, explanation: 'Incorreto. Uma fonte regulada mantém a tensão fixa e a carga puxa apenas a corrente necessária.' },
        { id: 'c', text: 'Não ligará, pois a fonte exige no mínimo 650 W de consumo para dar partida.', isCorrect: false, explanation: 'Incorreto. Fontes operam perfeitamente em cargas parciais.' },
        { id: 'd', text: 'Desligará a ventoinha do processador para economizar energia.', isCorrect: false, explanation: 'Incorreto. O controle da ventoinha da CPU é feito pelo sinal PWM da placa-mãe.' }
      ]
    }
  ];

  function normalizeSearchText(text) {
    return String(text || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  window.HardwareDexSVG = SVG_SCHEMATICS;
  window.HardwareDexData = {
    COMPONENTS: COMPONENTS,
    QUIZ_QUESTIONS: QUIZ_QUESTIONS,
    normalizeSearchText: normalizeSearchText
  };
})();
