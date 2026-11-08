export type ComponentCategory =
  | 'Estrutura & Conexão'
  | 'Processamento'
  | 'Refrigeração'
  | 'Memória'
  | 'Armazenamento'
  | 'Gráficos'
  | 'Energia';

export type QuizTopic =
  | 'Fundamentos'
  | 'Identificação'
  | 'Funcionamento'
  | 'Compatibilidade'
  | 'Instalação'
  | 'Diagnóstico'
  | 'Aplicação Prática';

export interface QuizQuestion {
  id: string;
  componentId: string;
  topic: QuizTopic;
  question: string;
  options: {
    id: 'a' | 'b' | 'c' | 'd';
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface QuizAttemptSummary {
  id: string;
  dateIso: string;
  modeLabel: string;
  totalQuestions: number;
  correctCount: number;
  percentage: number;
}

export interface LibraryComponent {
  id: string;
  name: string;
  shortName: string;
  category: ComponentCategory;
  imageFile: string;
  analogyTitle: string;
  summary: string;
  mainFunction: string;
  whatIs: string;
  howItWorks: string;
  analogyText: string;
  characteristics: string[];
  compatibility: string[];
  care: string[];
  commonMistakes: string[];
  inWorkbench: string;
  searchKeywords: string[];
  relatedIds: string[];
  workbenchFilterCategory: WorkbenchPartCategory;
}

export type WorkbenchPartCategory =
  | 'cpu'
  | 'thermal'
  | 'cooler'
  | 'ram'
  | 'storage'
  | 'gpu'
  | 'psu'
  | 'screw';

export interface MotherboardPlatform {
  id: 'AM4_DDR4' | 'LGA1700_DDR5';
  name: string;
  codeName: string;
  socket: 'AM4' | 'LGA1700';
  memoryType: 'DDR4' | 'DDR5';
  baseWatts: number;
  m2Support: boolean;
  sataSupport: boolean;
  pcieGen: string;
  description: string;
  recommendedNotes: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: WorkbenchPartCategory;
  categoryLabel: string;
  libraryComponentId: string;
  specsSummary: string;
  socket?: 'AM4' | 'LGA1700';
  memoryType?: 'DDR4' | 'DDR5';
  storageInterface?: 'M.2_NVME' | 'SATA_25';
  watts: number;
  maxWatts?: number;
  efficiencyRating?: string;
  pcieConnectors?: number;
  requiresPciePower?: boolean;
  hasIntegratedGraphics?: boolean;
  isInvalidMaterial?: boolean;
  technicalDetails: string;
}

export function normalizeSearchText(text: string): string {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export const MOTHERBOARD_PLATFORMS: Record<'AM4_DDR4' | 'LGA1700_DDR5', MotherboardPlatform> = {
  AM4_DDR4: {
    id: 'AM4_DDR4',
    name: 'Placa-Mãe Plataforma AMD (AM4 · DDR4)',
    codeName: 'ATX-AM4-B550',
    socket: 'AM4',
    memoryType: 'DDR4',
    baseWatts: 35,
    m2Support: true,
    sataSupport: true,
    pcieGen: 'PCIe 4.0 x16',
    description:
      'Equipada com socket PGA AM4 para processadores AMD Ryzen compatíveis e slots DIMM configurados para memória DDR4.',
    recommendedNotes:
      'Exige processador AM4, cooler com suporte de fixação AM4 e módulo de memória DDR4. Aceita SSD M.2 NVMe no conector da placa ou SSD SATA 2,5" na baia do gabinete.'
  },
  LGA1700_DDR5: {
    id: 'LGA1700_DDR5',
    name: 'Placa-Mãe Plataforma Intel (LGA1700 · DDR5)',
    codeName: 'ATX-LGA1700-B760',
    socket: 'LGA1700',
    memoryType: 'DDR5',
    baseWatts: 40,
    m2Support: true,
    sataSupport: true,
    pcieGen: 'PCIe 4.0 x16',
    description:
      'Projetada com socket LGA1700 para processadores Intel Core de 12ª a 14ª geração e construída especificamente com slots DIMM para memória DDR5.',
    recommendedNotes:
      'Observação técnica: o socket LGA1700 isoladamente suporta controladores DDR4 ou DDR5, mas este modelo físico de placa-mãe possui slots exclusivos para DDR5.'
  }
};

export const INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'cpu-amd',
    name: 'Ryzen 5',
    category: 'cpu',
    categoryLabel: 'Processador',
    libraryComponentId: 'cpu',
    specsSummary: 'Socket AM4 · 65 W TDP',
    socket: 'AM4',
    watts: 65,
    hasIntegratedGraphics: false,
    technicalDetails:
      'Processador de 6 núcleos para socket AMD AM4. Dissipação térmica de referência (TDP) de 65 W. Nesta bancada sem vídeo integrado ativo, requer placa de vídeo dedicada.'
  },
  {
    id: 'cpu-intel',
    name: 'Intel i5',
    category: 'cpu',
    categoryLabel: 'Processador',
    libraryComponentId: 'cpu',
    specsSummary: 'Socket LGA1700 · 125 W TDP',
    socket: 'LGA1700',
    watts: 125,
    hasIntegratedGraphics: false,
    technicalDetails:
      'Processador para socket Intel LGA1700 com potência base estimada em 125 W, exigindo atenção ao dimensionamento da fonte e à refrigeração.'
  },
  {
    id: 'pasta-termica',
    name: 'Pasta Térmica',
    category: 'thermal',
    categoryLabel: 'Interface Térmica',
    libraryComponentId: 'cooler',
    specsSummary: 'Composto térmico condutivo · 0 W',
    watts: 0,
    isInvalidMaterial: false,
    technicalDetails:
      'Composto de condução térmica aplicado entre o difusor metálico (IHS) do processador e a base do cooler para eliminar microcavidades de ar.'
  },
  {
    id: 'pasta-errada',
    name: 'Super Bonder',
    category: 'thermal',
    categoryLabel: 'Material Inadequado',
    libraryComponentId: 'cooler',
    specsSummary: 'Adesivo cianoacrilato · Isolante térmico',
    watts: 0,
    isInvalidMaterial: true,
    technicalDetails:
      'Adesivo químico de colagem rápida. Jamais deve ser usado em hardware: degrada a transferência térmica e cola permanentemente o cooler ao processador.'
  },
  {
    id: 'cooler-amd',
    name: 'Cooler AMD AM4',
    category: 'cooler',
    categoryLabel: 'Refrigeração',
    libraryComponentId: 'cooler',
    specsSummary: 'Suporte AM4 · ~10 W',
    socket: 'AM4',
    watts: 10,
    technicalDetails:
      'Conjunto de dissipador metálico aletado e ventoinha PWM com espaçamento de montagem específico para o socket AMD AM4.'
  },
  {
    id: 'cooler-intel',
    name: 'Cooler Intel LGA1700',
    category: 'cooler',
    categoryLabel: 'Refrigeração',
    libraryComponentId: 'cooler',
    specsSummary: 'Suporte LGA1700 · ~10 W',
    socket: 'LGA1700',
    watts: 10,
    technicalDetails:
      'Sistema de refrigeração a ar com matriz de furação 78x78 mm e altura de contato dimensionada para o socket Intel LGA1700.'
  },
  {
    id: 'ram-ddr4',
    name: 'DDR4 16 GB',
    category: 'ram',
    categoryLabel: 'Memória RAM',
    libraryComponentId: 'ram',
    specsSummary: 'DDR4 · 3200 MT/s · ~5 W',
    memoryType: 'DDR4',
    watts: 5,
    technicalDetails:
      'Módulo DIMM de 288 pinos padrão DDR4 (1,2 V nominal). Possui chanfro físico posicionado exclusivamente para slots DDR4.'
  },
  {
    id: 'ram-ddr5',
    name: 'DDR5 16 GB',
    category: 'ram',
    categoryLabel: 'Memória RAM',
    libraryComponentId: 'ram',
    specsSummary: 'DDR5 · 5200 MT/s · ~5 W',
    memoryType: 'DDR5',
    watts: 5,
    technicalDetails:
      'Módulo DIMM de 288 pinos padrão DDR5 (1,1 V nominal com regulação PMIC no módulo). Possui chanfro físico incompatível com slots DDR4.'
  },
  {
    id: 'ssd-nvme',
    name: 'SSD NVMe M.2 1 TB',
    category: 'storage',
    categoryLabel: 'Armazenamento',
    libraryComponentId: 'ssd',
    specsSummary: 'Formato M.2 2280 · PCIe NVMe · ~5 W',
    storageInterface: 'M.2_NVME',
    watts: 5,
    technicalDetails:
      'Unidade de estado sólido compacta conectada diretamente ao slot M.2 PCIe da placa-mãe, dispensando cabos de dados e energia.'
  },
  {
    id: 'ssd-sata',
    name: 'SSD SATA 2,5" 480 GB',
    category: 'storage',
    categoryLabel: 'Armazenamento',
    libraryComponentId: 'ssd',
    specsSummary: 'Formato 2,5" · Interface SATA III · ~3 W',
    storageInterface: 'SATA_25',
    watts: 3,
    technicalDetails:
      'Unidade de estado sólido em chassi de 2,5 polegadas. Instala-se na baia dedicada do gabinete utilizando cabo SATA de dados e alimentação SATA da fonte.'
  },
  {
    id: 'gpu-3060',
    name: 'RTX 3060',
    category: 'gpu',
    categoryLabel: 'Placa de Vídeo',
    libraryComponentId: 'video',
    specsSummary: 'PCIe x16 · 12 GB GDDR6 · ~170 W',
    watts: 170,
    requiresPciePower: true,
    technicalDetails:
      'Placa de vídeo dedicada com demanda energética estimada em 170 W. Utiliza o slot PCIe x16 e requer conector de alimentação suplementar PCIe da fonte.'
  },
  {
    id: 'gpu-1660',
    name: 'GTX 1660 Super',
    category: 'gpu',
    categoryLabel: 'Placa de Vídeo',
    libraryComponentId: 'video',
    specsSummary: 'PCIe x16 · 6 GB GDDR6 · ~120 W',
    watts: 120,
    requiresPciePower: true,
    technicalDetails:
      'Placa de vídeo dedicada com consumo estimado em 120 W. Instala-se no slot PCIe x16 principal com cabo de alimentação PCIe.'
  },
  {
    id: 'psu-650',
    name: 'Fonte 650 W',
    category: 'psu',
    categoryLabel: 'Fonte de Alimentação',
    libraryComponentId: 'fonte',
    specsSummary: '650 W Nominais · 80 Plus Bronze',
    watts: 0,
    maxWatts: 650,
    efficiencyRating: '80 Plus Bronze',
    pcieConnectors: 2,
    technicalDetails:
      'Fonte ATX de 650 W nominais com certificação 80 Plus Bronze. Proporciona folga operacional segura para qualquer combinação de componentes da bancada.'
  },
  {
    id: 'psu-450',
    name: 'Fonte 450 W',
    category: 'psu',
    categoryLabel: 'Fonte de Alimentação',
    libraryComponentId: 'fonte',
    specsSummary: '450 W Nominais · 80 Plus White',
    watts: 0,
    maxWatts: 450,
    efficiencyRating: '80 Plus White',
    pcieConnectors: 1,
    technicalDetails:
      'Fonte de entrada de 450 W nominais. Atende configurações moderadas (como CPU 65 W + GPU 120 W), mas fica com margem estreita para combinações de alto consumo com picos transitórios.'
  },
  {
    id: 'screw-1',
    name: 'Parafuso M3 #1',
    category: 'screw',
    categoryLabel: 'Fixação',
    libraryComponentId: 'placa',
    specsSummary: 'Rosca M3 · Espaçador do Gabinete',
    watts: 0,
    technicalDetails: 'Parafuso metálico para fixar e aterrar a placa-mãe sobre o espaçador superior esquerdo do gabinete.'
  },
  {
    id: 'screw-2',
    name: 'Parafuso M3 #2',
    category: 'screw',
    categoryLabel: 'Fixação',
    libraryComponentId: 'placa',
    specsSummary: 'Rosca M3 · Espaçador do Gabinete',
    watts: 0,
    technicalDetails: 'Parafuso metálico para fixar e aterrar a placa-mãe sobre o espaçador superior direito do gabinete.'
  },
  {
    id: 'screw-3',
    name: 'Parafuso M3 #3',
    category: 'screw',
    categoryLabel: 'Fixação',
    libraryComponentId: 'placa',
    specsSummary: 'Rosca M3 · Espaçador do Gabinete',
    watts: 0,
    technicalDetails: 'Parafuso metálico para fixar e aterrar a placa-mãe sobre o espaçador inferior esquerdo do gabinete.'
  },
  {
    id: 'screw-4',
    name: 'Parafuso M3 #4',
    category: 'screw',
    categoryLabel: 'Fixação',
    libraryComponentId: 'placa',
    specsSummary: 'Rosca M3 · Espaçador do Gabinete',
    watts: 0,
    technicalDetails: 'Parafuso metálico para fixar e aterrar a placa-mãe sobre o espaçador inferior direito do gabinete.'
  }
];

export const LIBRARY_COMPONENTS: LibraryComponent[] = [
  {
    id: 'placa',
    name: 'Placa-Mãe (Motherboard)',
    shortName: 'Placa-Mãe',
    category: 'Estrutura & Conexão',
    imageFile: 'placa.jpg',
    analogyTitle: 'O Esqueleto e Sistema Nervoso',
    summary:
      'Circuito impresso central que interconecta fisicamente e eletricamente todos os componentes do computador.',
    mainFunction: 'Interligar CPU, memória, armazenamento, placa de vídeo e distribuir energia e dados entre os barramentos.',
    whatIs:
      'A placa-mãe (motherboard) é a principal placa de circuito impresso (PCB) de um computador. Nela estão integrados o socket do processador, os slots de memória RAM, conectores de expansão PCI Express (PCIe), interfaces de armazenamento (M.2 e SATA), o chipset e o circuito regulador de tensão (VRM).',
    howItWorks:
      'Sozinha, a placa-mãe não processa softwares do usuário, mas opera como uma malha de comunicação sincronizada. Através de trilhas condutoras de cobre (barramentos) e do chipset, ela coordena o tráfego de dados entre o processador, a memória RAM, unidades de armazenamento e placa de vídeo, além de realizar o diagnóstico inicial do hardware por meio do firmware UEFI/BIOS.',
    analogyText:
      'Se o computador fosse uma cidade planejada, a placa-mãe seria o território com todo o sistema de rodovias, pontes e subestações elétricas interligando os edifícios. Sem vias compatíveis, as informações não conseguem circular entre os setores.',
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
    inWorkbench:
      'Na Bancada Virtual, selecione no topo a plataforma desejada (AMD AM4 com DDR4 ou Intel LGA1700 com DDR5) e fixe a placa ao gabinete instalando os 4 parafusos M3 nos cantos.',
    searchKeywords: [
      'placa-mae',
      'placa mae',
      'motherboard',
      'mainboard',
      'pcb',
      'socket',
      'soquete',
      'am4',
      'lga1700',
      'ddr4',
      'ddr5',
      'm.2',
      'm2',
      'sata',
      'pcie',
      'chipset',
      'vrm',
      'bios',
      'uefi',
      'parafusos',
      'espacadores',
      'standoffs',
      'esqueleto'
    ],
    relatedIds: ['cpu', 'ram', 'ssd', 'fonte'],
    workbenchFilterCategory: 'screw'
  },
  {
    id: 'cpu',
    name: 'Processador (CPU)',
    shortName: 'Processador',
    category: 'Processamento',
    imageFile: 'cpu.jpg',
    analogyTitle: 'O Cérebro Lógico',
    summary:
      'Unidade Central de Processamento responsável por executar instruções de programas, cálculos lógicos e coordenação do sistema.',
    mainFunction: 'Executar instruções lógicas e aritméticas e coordenar o funcionamento do sistema operacional e dos aplicativos.',
    whatIs:
      'O processador, ou CPU (Central Processing Unit), é um circuito integrado contendo bilhões de transistores organizados em múltiplos núcleos de execução (cores), memória cache ultrarrápida e controladores integrados (como controlador de memória e linhas PCIe).',
    howItWorks:
      'Seguindo o ciclo de busca, decodificação e execução, a CPU lê instruções carregadas na memória RAM, processa operações matemáticas e lógicas em suas unidades internas e grava os resultados. A rápida chaveação elétrica dos transistores converte parte da energia em calor concentrado.',
    analogyText:
      'O processador atua como o maestro e cérebro lógico de uma operação: interpreta o plano de ação (código-fonte), toma decisões lógicas imediatas e coordena quando cada componente deve intervir.',
    characteristics: [
      'Padrão de Encaixe (Socket): pode utilizar pinos no próprio processador (PGA, como no AMD AM4) ou contatos planos que repousam sobre pinos na placa-mãe (LGA, como no Intel LGA1700).',
      'TDP (Thermal Design Power): indicador de referência da dissipação térmica sob carga base (ex.: 65 W ou 125 W), útil para dimensionar o cooler e a fonte.',
      'Gráficos Integrados (iGPU): alguns modelos possuem processador gráfico embutido no chip, enquanto outros exigem placa de vídeo dedicada para gerar sinal de monitor.'
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
    inWorkbench:
      'Na Bancada Virtual, selecione o processador compatível com o socket da placa-mãe ativa (AM4 ou LGA1700) e instale-o no socket central antes da pasta térmica e do cooler.',
    searchKeywords: [
      'processador',
      'cpu',
      'central processing unit',
      'ryzen',
      'intel',
      'core i5',
      'am4',
      'lga1700',
      'socket',
      'soquete',
      'pga',
      'lga',
      'nucleos',
      'cores',
      'tdp',
      'igpu',
      'ihs',
      'cerebro'
    ],
    relatedIds: ['placa', 'cooler', 'ram'],
    workbenchFilterCategory: 'cpu'
  },
  {
    id: 'cooler',
    name: 'Refrigeração (Cooler & Pasta Térmica)',
    shortName: 'Cooler',
    category: 'Refrigeração',
    imageFile: 'cooler.jpg',
    analogyTitle: 'O Sistema de Climatização',
    summary:
      'Conjunto formado pela interface térmica (pasta térmica) e pelo dissipador com ventoinha responsável por manter a CPU em temperatura segura.',
    mainFunction: 'Transferir o calor gerado pelo processador para o dissipador metálico e dissipá-lo no ar.',
    whatIs:
      'O sistema de refrigeração da CPU combina dois elementos complementares: a pasta térmica (composto condutor térmico) e o cooler (dissipador metálico aletado acoplado a uma ventoinha controlada por PWM ou liquid cooler).',
    howItWorks:
      'Tanto a tampa metálica do processador (IHS) quanto a base do cooler possuem microimperfeições microscópicas que acumulariam ar — e o ar parado é um mau condutor térmico. A pasta térmica preenche essas microcavidades, conduzindo o calor até os heatpipes e aletas do dissipador, onde a ventoinha o remove com fluxo de ar contínuo.',
    analogyText:
      'Funciona como o sistema de arrefecimento e radiador de um motor: sem transferência térmica eficiente, a temperatura do processador sobe rapidamente, provocando redução de desempenho (thermal throttling) ou desligamento de proteção.',
    characteristics: [
      'Suporte de Fixação (Bracket): a distância entre os pontos de ancoragem varia conforme o socket (ex.: furação AM4 difere da furação LGA1700).',
      'Pasta Térmica: composto formulado para alta condutividade térmica e fácil remoção futura em manutenções.',
      'Nota prática: alguns coolers novos já trazem pasta térmica pré-aplicada na base de fábrica; porém, na nossa bancada didática, realizamos a etapa de aplicação manual para fixar o conceito.'
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
      'Montar o cooler esquecendo a pasta térmica (ou esquecendo de remover o adesivo plástico protetor da base do cooler).',
      'Aplicar cola rápida (Super Bonder), que atua como isolante térmico e cola fisicamente o cooler ao processador.',
      'Tentar fixar um cooler com suporte exclusivo AMD em uma placa-mãe Intel.'
    ],
    inWorkbench:
      'Na Bancada Virtual, após instalar a CPU, aplique a Pasta Térmica sobre ela e, em seguida, instale o Cooler compatível com o socket da placa-mãe.',
    searchKeywords: [
      'cooler',
      'refrigeracao',
      'dissipador',
      'ventoinha',
      'fan',
      'pwm',
      'pasta termica',
      'interface termica',
      'super bonder',
      'temperatura',
      'calor',
      'aquecimento',
      'thermal throttling',
      'am4',
      'lga1700',
      'ar condicionado'
    ],
    relatedIds: ['cpu', 'placa'],
    workbenchFilterCategory: 'cooler'
  },
  {
    id: 'ram',
    name: 'Memória RAM',
    shortName: 'Memória RAM',
    category: 'Memória',
    imageFile: 'ram.jpg',
    analogyTitle: 'A Bancada de Trabalho Rápida',
    summary:
      'Memória volátil de baixa latência onde ficam carregados o sistema operacional e os programas em execução imediata.',
    mainFunction: 'Armazenar temporariamente dados e instruções ativos para leitura e escrita rápidas pelo processador.',
    whatIs:
      'A Memória RAM (Random Access Memory) é uma memória semicondutora volátil montada em módulos DIMM (em desktops) ou SO-DIMM (em notebooks), servindo como área de trabalho imediata da CPU.',
    howItWorks:
      'Como o armazenamento permanente (SSD ou HD) é ordens de grandeza mais lento que os registradores da CPU, o sistema operacional carrega os programas e arquivos abertos para a RAM. Por ser uma memória volátil, ela depende de alimentação elétrica contínua: ao desligar o computador, seus dados temporários são esvaziados.',
    analogyText:
      'Se o SSD é o armário onde todos os seus livros ficam guardados permanentemente, a Memória RAM é a mesa de estudos à sua frente. Uma mesa ampla permite manter vários livros abertos ao mesmo tempo para consulta instantânea.',
    characteristics: [
      'Padrão de Geração (DDR4 vs. DDR5): diferem na arquitetura de canais, tensão de operação, gerenciamento de energia e posição do chanfro físico nos contatos.',
      'Capacidade (ex.: 16 GB): determina o volume de aplicações e dados simultâneos mantidos em memória rápida.',
      'Taxa de Transferência (ex.: 3200 MT/s ou MHz efetivos em DDR4; 5200 MT/s em DDR5): indica a largura de banda de comunicação.'
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
    inWorkbench:
      'Na Bancada Virtual, confira se a placa-mãe ativa utiliza DDR4 ou DDR5 e instale o módulo correspondente no slot DIMM.',
    searchKeywords: [
      'memoria',
      'ram',
      'ddr4',
      'ddr5',
      'dimm',
      'volatil',
      '3200mhz',
      '5200mhz',
      '16gb',
      'chanfro',
      'slot de memoria',
      'mesa de trabalho'
    ],
    relatedIds: ['placa', 'cpu', 'ssd'],
    workbenchFilterCategory: 'ram'
  },
  {
    id: 'ssd',
    name: 'Armazenamento (SSD M.2 & SATA)',
    shortName: 'SSD',
    category: 'Armazenamento',
    imageFile: 'ssd.jpg',
    analogyTitle: 'O Arquivo Permanente de Alta Velocidade',
    summary:
      'Unidade de estado sólido não-volátil onde o sistema operacional, aplicativos e arquivos do usuário permanecem gravados.',
    mainFunction: 'Armazenar dados de forma persistente (não-volátil), preservando os arquivos mesmo com o computador desligado.',
    whatIs:
      'O SSD (Solid State Drive) é uma unidade de armazenamento persistente construída com chips de memória Flash NAND e um controlador eletrônico, sem discos magnéticos giratórios nem cabeçotes mecânicos.',
    howItWorks:
      'Grava e lê dados eletronicamente em células de memória flash. Na plataforma moderna destacam-se dois padrões: o SSD M.2 NVMe (formato compacto conectado diretamente à placa-mãe através de linhas PCI Express, alcançando vários gigabytes por segundo) e o SSD SATA de 2,5" (formato de gabinete retangular conectado por cabos usando o protocolo SATA III, limitado a cerca de 550–600 MB/s).',
    analogyText:
      'O SSD funciona como o arquivo permanente da instituição: mesmo quando todo o prédio é desligado no fim do dia, todos os documentos continuam salvos e organizados para a próxima inicialização.',
    characteristics: [
      'Formato M.2 (ex.: 2280): encaixa diretamente no conector M.2 da placa-mãe sem usar cabos; atenção: existem M.2 NVMe (PCIe) e M.2 SATA, devendo-se respeitar o suporte do slot.',
      'Formato 2,5" SATA: fixado em uma baia do gabinete e ligado por dois cabos (cabo de dados SATA na placa-mãe e cabo de energia SATA vindo da fonte).',
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
      'Esquecer de instalar qualquer unidade de armazenamento, deixando o computador sem sistema operacional para inicializar.'
    ],
    inWorkbench:
      'Na Bancada Virtual, instale o SSD NVMe M.2 diretamente no slot M.2 da placa-mãe ou instale o SSD SATA 2,5" na baia lateral dedicada do gabinete.',
    searchKeywords: [
      'ssd',
      'armazenamento',
      'disco',
      'hd',
      'm.2',
      'm2',
      'nvme',
      'sata',
      '2.5',
      '2,5',
      'nao volatil',
      'flash nand',
      '1tb',
      '480gb',
      'arquivo permanente'
    ],
    relatedIds: ['placa', 'ram', 'fonte'],
    workbenchFilterCategory: 'storage'
  },
  {
    id: 'video',
    name: 'Placa de Vídeo (GPU)',
    shortName: 'Placa de Vídeo',
    category: 'Gráficos',
    imageFile: 'video.jpg',
    analogyTitle: 'O Estúdio de Renderização Visual',
    summary:
      'Unidade de processamento gráfico dedicada com memória própria (VRAM) voltada à renderização de imagens, vídeo e ambientes 3D.',
    mainFunction: 'Processar cálculos gráficos, geometria 3D e sombreamento em paralelo para gerar os quadros exibidos no monitor.',
    whatIs:
      'A Placa de Vídeo dedicada é uma placa de expansão equipada com uma GPU (Graphics Processing Unit), memória de vídeo dedicada de alta largura de banda (VRAM GDDR), circuito regulador de tensão próprio e sistema de refrigeração.',
    howItWorks:
      'Enquanto o processador central (CPU) possui núcleos projetados para baixa latência em tarefas sequenciais complexas, a GPU conta com milhares de núcleos menores otimizados para processamento massivamente paralelo — ideal para calcular milhões de vértices, texturas e pixels simultaneamente.',
    analogyText:
      'Se a CPU é o engenheiro que calcula as regras e a física de uma cena, a Placa de Vídeo é um estúdio com milhares de artistas pintando cada fração do quadro ao mesmo tempo.',
    characteristics: [
      'Interface PCI Express x16: instala-se no slot de expansão longo principal da placa-mãe.',
      'VRAM Dedicada (ex.: 6 GB ou 12 GB GDDR6): armazena texturas, buffers de quadro e modelos 3D sem consumir a RAM principal.',
      'Demanda Energética Significativa: placas dedicadas intermediárias e avançadas (ex.: ~120 W a ~170 W ou mais) costumam exigir conectores de alimentação PCIe dedicados da fonte.'
    ],
    compatibility: [
      'Encaixa no barramento PCIe x16 da placa-mãe e requer espaço físico adequado no gabinete.',
      'Sistemas cujo processador não possui vídeo integrado (ou onde ele está desativado) necessitam obrigatoriamente de uma placa de vídeo dedicada para exibir imagem.',
      'Exige uma fonte de alimentação capaz de suprir a carga combinada do sistema e equipada com os cabos PCIe (6+2 pinos ou 12VHPWR) exigidos pelo modelo.'
    ],
    care: [
      'Alinhe o conector PCIe x16 com o slot da placa-mãe até o travamento completo e conecte firmemente os cabos de energia PCIe da fonte.',
      'Conecte o cabo do monitor diretamente nas saídas da placa de vídeo dedicada (HDMI/DisplayPort) quando ela estiver instalada.'
    ],
    commonMistakes: [
      'Instalar uma placa de vídeo de alto consumo em uma fonte sem potência ou margem operacional suficiente.',
      'Encaixar a placa no slot PCIe x16 mas esquecer de plugar o cabo de alimentação suplementar vindo da fonte.'
    ],
    inWorkbench:
      'Na Bancada Virtual, instale a RTX 3060 (170 W estimados) ou a GTX 1660 Super (120 W estimados) no slot PCIe x16 e verifique o impacto no consumo elétrico total.',
    searchKeywords: [
      'placa de video',
      'gpu',
      'graphics processing unit',
      'vram',
      'gddr6',
      'pcie',
      'pci express',
      'x16',
      'rtx 3060',
      'gtx 1660',
      'graficos',
      'renderizacao',
      'artista',
      'pintor'
    ],
    relatedIds: ['placa', 'fonte', 'cpu'],
    workbenchFilterCategory: 'gpu'
  },
  {
    id: 'fonte',
    name: 'Fonte de Alimentação (PSU)',
    shortName: 'Fonte (PSU)',
    category: 'Energia',
    imageFile: 'fonte.jpg',
    analogyTitle: 'O Coração e Subestação Energética',
    summary:
      'Unidade que converte a energia alternada da rede elétrica em tensões contínuas estabilizadas e seguras para todo o hardware.',
    mainFunction: 'Converter corrente alternada (AC) em corrente contínua regulada (+12V, +5V, +3,3V) e proteger o sistema contra anomalias elétricas.',
    whatIs:
      'A Fonte de Alimentação, ou PSU (Power Supply Unit), é um conversor chaveado de potência instalado em um compartimento próprio do gabinete (PSU Shroud), conectando-se aos demais componentes por meio de cabos padronizados.',
    howItWorks:
      'Recebe a tensão em Corrente Alternada (110V/220V AC) da tomada, corrige o fator de potência (PFC ativo), retifica e transforma em linhas de Corrente Contínua de baixa oscilação (ripple), fornecendo +12V principalmente para CPU e GPU, além de +5V e +3,3V para memórias, SSDs e lógica da placa-mãe.',
    analogyText:
      'A fonte atua como o coração e a estação de tratamento elétrico do computador: recebe uma energia bruta externa e distribui o fluxo contínuo e estável que cada componente sensível exige para operar com segurança.',
    characteristics: [
      'Potência Nominal Contínua (ex.: 450 W ou 650 W): capacidade máxima que a fonte consegue entregar de forma sustentada.',
      'Certificação 80 Plus (White, Bronze, Silver, Gold, etc.): atesta a eficiência energética na conversão (menor desperdício de energia em forma de calor), embora não substitua a análise de qualidade elétrica e proteções.',
      'Margem Operacional Recomendada: dimensionar a fonte com folga (tipicamente 20% a 30% acima do consumo contínuo estimado) permite absorver picos transitórios de corrente e operar na faixa de melhor eficiência.'
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
    inWorkbench:
      'Na Bancada Virtual, instale a Fonte de 650 W ou 450 W no compartimento inferior do gabinete e avalie se ela cobre tanto o Consumo Estimado quanto a Margem Recomendada.',
    searchKeywords: [
      'fonte',
      'fonte de alimentacao',
      'alimentacao',
      'energia',
      'psu',
      'power supply',
      'watts',
      'potencia',
      '450w',
      '650w',
      '80 plus',
      'bronze',
      'white',
      'corrente continua',
      'corrente alternada',
      '12v',
      'coracao'
    ],
    relatedIds: ['placa', 'video', 'cpu'],
    workbenchFilterCategory: 'psu'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ==================== 1. PLACA-MÃE (5 QUESTÕES) ====================
  {
    id: 'q-placa-1',
    componentId: 'placa',
    topic: 'Fundamentos',
    question:
      'Qual é o papel estrutural e lógico desempenhado pela placa-mãe (motherboard) na arquitetura de um computador?',
    options: [
      {
        id: 'a',
        text: 'Executar diretamente os cálculos de renderização 3D no lugar da placa de vídeo.',
        isCorrect: false,
        explanation:
          'Incorreto. A renderização gráfica pesada cabe à GPU; a placa-mãe fornece o barramento PCIe e a comunicação entre as peças.'
      },
      {
        id: 'b',
        text: 'Interconectar fisicamente e eletricamente todos os componentes, coordenando a comunicação por barramentos e pelo chipset.',
        isCorrect: true,
        explanation:
          'Correto! A placa-mãe atua como a espinha dorsal e malha de comunicação onde CPU, RAM, armazenamento, GPU e alimentação se integram.'
      },
      {
        id: 'c',
        text: 'Converter a tensão alternada (110V/220V) da tomada elétrica em corrente contínua de 12V.',
        isCorrect: false,
        explanation:
          'Incorreto. Quem realiza a conversão AC para DC da tomada é a Fonte de Alimentação (PSU); o VRM da placa-mãe apenas regula tensões contínuas já recebidas da fonte.'
      },
      {
        id: 'd',
        text: 'Armazenar permanentemente os arquivos pessoais do usuário quando o computador é desligado.',
        isCorrect: false,
        explanation:
          'Incorreto. O armazenamento permanente de arquivos do usuário é função do SSD ou HD.'
      }
    ]
  },
  {
    id: 'q-placa-2',
    componentId: 'placa',
    topic: 'Compatibilidade',
    question:
      'Um estudante observa que uma placa-mãe possui o socket Intel LGA1700. Como ele deve determinar se deve adquirir memória RAM DDR4 ou DDR5?',
    options: [
      {
        id: 'a',
        text: 'Pelo modelo específico da placa-mãe, pois os slots físicos soldados nela aceitam exclusivamente DDR4 ou exclusivamente DDR5.',
        isCorrect: true,
        explanation:
          'Correto! Embora processadores LGA1700 possuam controlador compatível com DDR4 e DDR5, cada modelo de placa-mãe é fabricado com slots físicos de apenas um desses padrões.'
      },
      {
        id: 'b',
        text: 'Qualquer módulo DDR4 ou DDR5 encaixa no mesmo slot DIMM, bastando alterar uma opção na BIOS.',
        isCorrect: false,
        explanation:
          'Incorreto. Os chanfros físicos (notches) e a arquitetura elétrica de DDR4 e DDR5 são diferentes, impedindo o encaixe cruzado.'
      },
      {
        id: 'c',
        text: 'Pela potência nominal da fonte de alimentação escolhida para o gabinete.',
        isCorrect: false,
        explanation:
          'Incorreto. A fonte de alimentação não define o tipo de slot DIMM presente na placa-mãe.'
      },
      {
        id: 'd',
        text: 'Pelo formato do SSD instalado no conector M.2 da placa.',
        isCorrect: false,
        explanation:
          'Incorreto. O armazenamento M.2 é independente do padrão físico dos slots de memória RAM.'
      }
    ]
  },
  {
    id: 'q-placa-3',
    componentId: 'placa',
    topic: 'Instalação',
    question:
      'Qual é a função técnica dos espaçadores (standoffs) e dos parafusos M3 utilizados ao instalar a placa-mãe no gabinete?',
    options: [
      {
        id: 'a',
        text: 'Aumentar a frequência de operação do processador por condução magnética.',
        isCorrect: false,
        explanation:
          'Incorreto. Parafusos de fixação têm função mecânica e de aterramento, não de overclock.'
      },
      {
        id: 'b',
        text: 'Apenas estética, sendo opcional instalar parafusos caso o gabinete fique na posição vertical.',
        isCorrect: false,
        explanation:
          'Incorreto. Jamais se deve deixar a placa-mãe solta no gabinete, sob risco de curto-circuito e danos físicos às trilhas.'
      },
      {
        id: 'c',
        text: 'Manter a placa-mãe mecanicamente firme, aterrada e afastada da chapa metálica do gabinete para evitar curto-circuitos.',
        isCorrect: true,
        explanation:
          'Correto! Os espaçadores impedem que as soldas traseiras da placa encostem no metal do gabinete e os parafusos garantem firmeza estrutural e aterramento.'
      },
      {
        id: 'd',
        text: 'Substituir a aplicação de pasta térmica no processador.',
        isCorrect: false,
        explanation:
          'Incorreto. A fixação da placa-mãe no chassi não tem relação com a interface térmica da CPU.'
      }
    ]
  },
  {
    id: 'q-placa-4',
    componentId: 'placa',
    topic: 'Funcionamento',
    question:
      'Na placa-mãe, qual é a função do circuito VRM (Voltage Regulator Module) localizado próximo ao socket do processador?',
    options: [
      {
        id: 'a',
        text: 'Regular e converter a linha de +12V da fonte para a tensão baixa e precisa exigida pelos núcleos da CPU.',
        isCorrect: true,
        explanation:
          'Correto! O VRM reduz e estabiliza a tensão de +12V para valores próximos de 1,0V a 1,4V com alta corrente para alimentar o processador com precisão.'
      },
      {
        id: 'b',
        text: 'Armazenar os arquivos do sistema operacional quando o SSD está cheio.',
        isCorrect: false,
        explanation:
          'Incorreto. O VRM é um circuito eletrônico de potência, não um dispositivo de armazenamento de dados.'
      },
      {
        id: 'c',
        text: 'Gerar o sinal de áudio para as caixas de som externas.',
        isCorrect: false,
        explanation:
          'Incorreto. O áudio integrado é processado pelo chip codec de som, não pelo VRM da CPU.'
      },
      {
        id: 'd',
        text: 'Servir de encaixe físico para unidades de armazenamento SATA de 2,5 polegadas.',
        isCorrect: false,
        explanation:
          'Incorreto. Unidades SATA 2,5" são instaladas nas baias do gabinete.'
      }
    ]
  },
  {
    id: 'q-placa-5',
    componentId: 'placa',
    topic: 'Diagnóstico',
    question:
      'Durante o processo de inicialização, qual é o papel do firmware UEFI/BIOS presente na placa-mãe?',
    options: [
      {
        id: 'a',
        text: 'Realizar o autoteste inicial do hardware (POST), inicializar os barramentos e entregar o controle ao sistema operacional.',
        isCorrect: true,
        explanation:
          'Correto! O firmware UEFI/BIOS executa o POST (Power-On Self-Test), verifica CPU, RAM, vídeo e armazenamento, e carrega o bootloader do sistema operacional.'
      },
      {
        id: 'b',
        text: 'Resfriar fisicamente a placa de vídeo desligando seus ventiladores.',
        isCorrect: false,
        explanation:
          'Incorreto. O UEFI/BIOS é o firmware de inicialização e configuração da placa-mãe.'
      },
      {
        id: 'c',
        text: 'Aumentar fisicamente a quantidade de gigabytes do SSD instalado.',
        isCorrect: false,
        explanation:
          'Incorreto. Nenhum firmware pode ampliar a capacidade física de chips NAND de um SSD.'
      },
      {
        id: 'd',
        text: 'Dispensa a necessidade de instalar memória RAM no computador.',
        isCorrect: false,
        explanation:
          'Incorreto. O POST exige obrigatoriamente memória RAM funcional para prosseguir com a inicialização.'
      }
    ]
  },

  // ==================== 2. PROCESSADOR / CPU (5 QUESTÕES) ====================
  {
    id: 'q-cpu-1',
    componentId: 'cpu',
    topic: 'Fundamentos',
    question:
      'Qual é a função primordial do Processador (CPU) durante a utilização do computador?',
    options: [
      {
        id: 'a',
        text: 'Manter arquivos salvos permanentemente quando o cabo de força é desconectado.',
        isCorrect: false,
        explanation:
          'Incorreto. O armazenamento permanente não-volátil é realizado pelo SSD ou HD.'
      },
      {
        id: 'b',
        text: 'Buscar, decodificar e executar instruções de programas, realizando cálculos lógicos, aritméticos e controle do sistema.',
        isCorrect: true,
        explanation:
          'Correto! A CPU é a unidade central que processa as instruções de máquina do sistema operacional e dos aplicativos.'
      },
      {
        id: 'c',
        text: 'Transformar a energia da tomada em tensões contínuas para alimentar o gabinete.',
        isCorrect: false,
        explanation:
          'Incorreto. Essa é a função da Fonte de Alimentação (PSU).'
      },
      {
        id: 'd',
        text: 'Substituir a placa-mãe na conexão física dos cabos SATA.',
        isCorrect: false,
        explanation:
          'Incorreto. Os conectores físicos SATA ficam na placa-mãe.'
      }
    ]
  },
  {
    id: 'q-cpu-2',
    componentId: 'cpu',
    topic: 'Identificação',
    question:
      'Qual é a diferença física fundamental entre os padrões de encaixe PGA (como no socket AMD AM4) e LGA (como no socket Intel LGA1700)?',
    options: [
      {
        id: 'a',
        text: 'No PGA os pinos ficam na base do processador; no LGA os pinos delicados ficam no socket da placa-mãe e o processador possui contatos planos.',
        isCorrect: true,
        explanation:
          'Correto! PGA (Pin Grid Array) traz os pinos no próprio chip da CPU, enquanto LGA (Land Grid Array) posiciona os pinos no socket da placa-mãe.'
      },
      {
        id: 'b',
        text: 'O padrão PGA é soldado de fábrica e não permite troca, enquanto o LGA usa cabos USB.',
        isCorrect: false,
        explanation:
          'Incorreto. Ambos são sockets que permitem instalação e substituição do processador.'
      },
      {
        id: 'c',
        text: 'Processadores PGA não aquecem e dispensam o uso de cooler.',
        isCorrect: false,
        explanation:
          'Incorreto. Tanto processadores PGA quanto LGA dissipam calor considerável e exigem refrigeração.'
      },
      {
        id: 'd',
        text: 'O padrão LGA é exclusivo para memórias RAM e o PGA é exclusivo para placas de vídeo.',
        isCorrect: false,
        explanation:
          'Incorreto. Ambos são padrões de encapsulamento e socket para processadores (CPUs).'
      }
    ]
  },
  {
    id: 'q-cpu-3',
    componentId: 'cpu',
    topic: 'Funcionamento',
    question:
      'O que representa a especificação de TDP (Thermal Design Power, ex.: 65 W ou 125 W) informada nas características de um processador?',
    options: [
      {
        id: 'a',
        text: 'A velocidade máxima de leitura de arquivos do SSD em megabytes por segundo.',
        isCorrect: false,
        explanation:
          'Incorreto. O TDP é medido em Watts (W) e refere-se à potência térmica, não à taxa de transferência de dados.'
      },
      {
        id: 'b',
        text: 'Uma referência da potência térmica dissipada sob carga base, usada para dimensionar o sistema de refrigeração e estimar o consumo elétrico.',
        isCorrect: true,
        explanation:
          'Correto! O TDP orienta a capacidade mínima de dissipação de calor que o cooler deve suportar e auxilia na estimativa de carga elétrica da CPU.'
      },
      {
        id: 'c',
        text: 'A quantidade máxima de memória RAM em gigabytes que o processador reconhece.',
        isCorrect: false,
        explanation:
          'Incorreto. Capacidade de memória é medida em GB, não em Watts.'
      },
      {
        id: 'd',
        text: 'A potência máxima que a fonte pode ter antes de queimar o processador.',
        isCorrect: false,
        explanation:
          'Incorreto. Uma fonte de maior capacidade (ex.: 650 W) fornece apenas a corrente que o processador solicita, sem "empurrar" potência excessiva.'
      }
    ]
  },
  {
    id: 'q-cpu-4',
    componentId: 'cpu',
    topic: 'Compatibilidade',
    question:
      'Quando um processador NÃO possui gráficos integrados (iGPU), qual condição é necessária para que o computador exiba imagem no monitor?',
    options: [
      {
        id: 'a',
        text: 'Instalar dois módulos de memória RAM em vez de apenas um.',
        isCorrect: false,
        explanation:
          'Incorreto. A memória RAM não gera sinal de vídeo para o monitor.'
      },
      {
        id: 'b',
        text: 'Instalar uma placa de vídeo dedicada (GPU) em um slot PCIe compatível e conectar o monitor a ela.',
        isCorrect: true,
        explanation:
          'Correto! Sem unidade gráfica integrada na CPU, é indispensável uma placa de vídeo dedicada para processar e enviar o sinal de vídeo ao monitor.'
      },
      {
        id: 'c',
        text: 'Substituir o SSD M.2 por um SSD SATA de 2,5 polegadas.',
        isCorrect: false,
        explanation:
          'Incorreto. O tipo de armazenamento não substitui o processador gráfico.'
      },
      {
        id: 'd',
        text: 'Aplicar uma camada dupla de pasta térmica sobre o processador.',
        isCorrect: false,
        explanation:
          'Incorreto. A pasta térmica atua apenas na condução de calor.'
      }
    ]
  },
  {
    id: 'q-cpu-5',
    componentId: 'cpu',
    topic: 'Instalação',
    question:
      'Qual procedimento técnico deve ser respeitado ao instalar ou remover um processador na Bancada Virtual ou em um computador real?',
    options: [
      {
        id: 'a',
        text: 'Na instalação, alinhar a marcação do pino 1 sem forçar; na remoção, retirar primeiro o cooler e limpar a pasta térmica antes de abrir o socket.',
        isCorrect: true,
        explanation:
          'Correto! O processador deve encaixar por gravidade (Zero Insertion Force) alinhado ao pino 1, e nunca pode ser removido enquanto o cooler estiver fixado sobre ele.'
      },
      {
        id: 'b',
        text: 'Pressionar o processador com uma chave de fenda para dobrar os pinos e garantir contato firme.',
        isCorrect: false,
        explanation:
          'Incorreto. Entortar pinos inutiliza o processador ou a placa-mãe.'
      },
      {
        id: 'c',
        text: 'Aplicar pasta térmica dentro dos furos do socket antes de encaixar o processador.',
        isCorrect: false,
        explanation:
          'Incorreto! Nunca coloque pasta térmica nos pinos ou dentro do socket; ela vai exclusivamente sobre a tampa metálica superior (IHS) após a CPU estar instalada.'
      },
      {
        id: 'd',
        text: 'Ligar o computador por 5 minutos sem cooler para "aquecer" o processador antes da montagem.',
        isCorrect: false,
        explanation:
          'Incorreto. Ligar a CPU sem dissipador causa superaquecimento imediato.'
      }
    ]
  },

  // ==================== 3. REFRIGERAÇÃO / COOLER & PASTA TÉRMICA (5 QUESTÕES) ====================
  {
    id: 'q-cooler-1',
    componentId: 'cooler',
    topic: 'Fundamentos',
    question:
      'Qual é a função física específica da pasta térmica aplicada entre a tampa metálica do processador (IHS) e a base do cooler?',
    options: [
      {
        id: 'a',
        text: 'Colar permanentemente o cooler ao processador para dispensar o uso de suportes mecânicos.',
        isCorrect: false,
        explanation:
          'Incorreto. A pasta térmica não é cola; a fixação mecânica é feita pelo suporte (bracket) do cooler.'
      },
      {
        id: 'b',
        text: 'Preencher microimperfeições superficiais eliminando o ar retido, facilitando a condução do calor da CPU para o dissipador.',
        isCorrect: true,
        explanation:
          'Correto! Como o ar é um péssimo condutor térmico, a pasta térmica preenche as micro-ranhuras microscópicas entre as duas superfícies metálicas.'
      },
      {
        id: 'c',
        text: 'Gerar ar frio quimicamente sem necessidade de dissipador metálico.',
        isCorrect: false,
        explanation:
          'Incorreto. A pasta térmica apenas conduz o calor até o dissipador; ela não gera frio sozinha.'
      },
      {
        id: 'd',
        text: 'Aumentar a tensão elétrica fornecida aos pinos do socket.',
        isCorrect: false,
        explanation:
          'Incorreto. A pasta térmica atua na transferência de calor no topo da CPU, fora do socket.'
      }
    ]
  },
  {
    id: 'q-cooler-2',
    componentId: 'cooler',
    topic: 'Diagnóstico',
    question:
      'Por que o uso de adesivo cianoacrilato (Super Bonder) no lugar da pasta térmica representa um erro grave de montagem?',
    options: [
      {
        id: 'a',
        text: 'Porque atua como isolante térmico impedindo a dissipação de calor, além de fundir mecanicamente o cooler ao processador.',
        isCorrect: true,
        explanation:
          'Correto! Colas rápidas têm baixíssima condutividade térmica e travam as peças, podendo arrancar o processador do socket ao tentar remover o cooler.'
      },
      {
        id: 'b',
        text: 'Porque faz a ventoinha do cooler girar rápido demais.',
        isCorrect: false,
        explanation:
          'Incorreto. O problema é o bloqueio térmico e o dano mecânico à superfície da CPU.'
      },
      {
        id: 'c',
        text: 'Porque só é compatível com processadores de socket LGA1700.',
        isCorrect: false,
        explanation:
          'Incorreto. Nenhum processador deve receber colas ou adesivos no lugar da interface térmica.'
      },
      {
        id: 'd',
        text: 'Porque reduz a capacidade de armazenamento do SSD M.2.',
        isCorrect: false,
        explanation:
          'Incorreto. O efeito danoso ocorre diretamente no conjunto térmico do processador.'
      }
    ]
  },
  {
    id: 'q-cooler-3',
    componentId: 'cooler',
    topic: 'Compatibilidade',
    question:
      'O que determina se um determinado Air Cooler pode ser instalado corretamente sobre a placa-mãe escolhida?',
    options: [
      {
        id: 'a',
        text: 'A compatibilidade do suporte de fixação (bracket/furação) com o socket da placa-mãe e a capacidade de dissipação adequada ao TDP da CPU.',
        isCorrect: true,
        explanation:
          'Correto! Cada socket (como AM4 ou LGA1700) possui dimensões geométricas e alturas diferentes para o sistema de retenção do cooler.'
      },
      {
        id: 'b',
        text: 'A marca do monitor conectado ao computador.',
        isCorrect: false,
        explanation:
          'Incorreto. O monitor não tem qualquer relação com o encaixe mecânico do cooler.'
      },
      {
        id: 'c',
        text: 'A quantidade de arquivos gravados no SSD SATA.',
        isCorrect: false,
        explanation:
          'Incorreto. O armazenamento de dados não afeta a furação física do socket.'
      },
      {
        id: 'd',
        text: 'O tipo de cabo HDMI utilizado na placa de vídeo.',
        isCorrect: false,
        explanation:
          'Incorreto. Cabos de vídeo são independentes da refrigeração da CPU.'
      }
    ]
  },
  {
    id: 'q-cooler-4',
    componentId: 'cooler',
    topic: 'Funcionamento',
    question:
      'O que é o fenômeno conhecido como Thermal Throttling (estrangulamento térmico) em um processador?',
    options: [
      {
        id: 'a',
        text: 'Um mecanismo de autoproteção que reduz automaticamente a frequência e a tensão da CPU quando a temperatura atinge limites críticos.',
        isCorrect: true,
        explanation:
          'Correto! Para evitar danos físicos permanentes por superaquecimento (como quando o cooler falha ou está mal instalado), a CPU reduz seu clock drasticamente.'
      },
      {
        id: 'b',
        text: 'Um modo especial que dobra a velocidade dos jogos quando o cooler está desligado.',
        isCorrect: false,
        explanation:
          'Incorreto. O Thermal Throttling reduz o desempenho justamente para conter o calor excessivo.'
      },
      {
        id: 'c',
        text: 'A conversão automática de memória DDR4 em DDR5 pelo aquecimento das trilhas.',
        isCorrect: false,
        explanation:
          'Incorreto. Padrões físicos de memória não mudam com a temperatura.'
      },
      {
        id: 'd',
        text: 'O congelamento físico da fonte de alimentação abaixo de 0°C.',
        isCorrect: false,
        explanation:
          'Incorreto. Trata-se da redução de clock por excesso de temperatura.'
      }
    ]
  },
  {
    id: 'q-cooler-5',
    componentId: 'cooler',
    topic: 'Aplicação Prática',
    question:
      'Durante uma manutenção ou montagem na bancada, caso um material inadequado ou pasta térmica ressecada esteja sobre o processador, qual é o procedimento técnico correto?',
    options: [
      {
        id: 'a',
        text: 'Raspar a tampa do processador com uma faca metálica ou lixa grossa.',
        isCorrect: false,
        explanation:
          'Incorreto. Objetos metálicos cortantes riscam o difusor térmico (IHS) e criam sulcos que prejudicam o contato.'
      },
      {
        id: 'b',
        text: 'Lavar a placa-mãe inteira em água corrente com detergente comum com o PC ligado.',
        isCorrect: false,
        explanation:
          'Incorreto. Água comum contém sais minerais condutores e oxidantes que causam curto-circuito.'
      },
      {
        id: 'c',
        text: 'Limpar cuidadosamente a superfície utilizando álcool isopropílico e um pano sem fiapos antes de aplicar a nova pasta térmica.',
        isCorrect: true,
        explanation:
          'Correto! O álcool isopropílico (alta pureza, >99%) dissolve resíduos térmicos e evapora rapidamente sem deixar água ou oxidar contatos.'
      },
      {
        id: 'd',
        text: 'Aplicar a pasta térmica nova diretamente por cima da cola ou resíduo antigo.',
        isCorrect: false,
        explanation:
          'Incorreto. O resíduo antigo impedirá o contato térmico uniforme.'
      }
    ]
  },

  // ==================== 4. MEMÓRIA RAM (5 QUESTÕES) ====================
  {
    id: 'q-ram-1',
    componentId: 'ram',
    topic: 'Fundamentos',
    question:
      'Por que a Memória RAM é classificada tecnicamente como uma memória "volátil"?',
    options: [
      {
        id: 'a',
        text: 'Porque seus dados são mantidos apenas enquanto há alimentação elétrica, sendo esvaziada ao desligar o computador.',
        isCorrect: true,
        explanation:
          'Correto! As células DRAM precisam de recarga elétrica constante (refresh); quando o computador é desligado, todo o conteúdo temporário da RAM é perdido.'
      },
      {
        id: 'b',
        text: 'Porque ela evapora fisicamente se o gabinete ficar aberto.',
        isCorrect: false,
        explanation:
          'Incorreto. "Volátil" em computação refere-se à dependência de energia elétrica para retenção dos dados.'
      },
      {
        id: 'c',
        text: 'Porque ela guarda fotos e documentos permanentemente por décadas sem energia.',
        isCorrect: false,
        explanation:
          'Incorreto. Essa é a definição de memória não-volátil (como o SSD).'
      },
      {
        id: 'd',
        text: 'Porque pode ser encaixada em qualquer slot PCIe ou SATA da placa-mãe.',
        isCorrect: false,
        explanation:
          'Incorreto. A RAM utiliza slots específicos (DIMM/SO-DIMM).'
      }
    ]
  },
  {
    id: 'q-ram-2',
    componentId: 'ram',
    topic: 'Compatibilidade',
    question:
      'O que acontece ao tentar instalar um módulo de memória DDR5 em uma placa-mãe cujos slots são padrão DDR4?',
    options: [
      {
        id: 'a',
        text: 'O módulo encaixa normalmente e funciona na metade da velocidade.',
        isCorrect: false,
        explanation:
          'Incorreto. Não há retrocompatibilidade física nem elétrica entre slots DDR4 e módulos DDR5.'
      },
      {
        id: 'b',
        text: 'O módulo não encaixa, pois a posição do chanfro físico (key notch) e a arquitetura elétrica são diferentes entre DDR4 e DDR5.',
        isCorrect: true,
        explanation:
          'Correto! O entalhe na fileira de contatos dourados é deslocado propositalmente em cada geração DDR para impedir a inserção incorreta.'
      },
      {
        id: 'c',
        text: 'O módulo transforma a placa-mãe em DDR5 automaticamente.',
        isCorrect: false,
        explanation:
          'Incorreto. O hardware físico da placa-mãe não se altera.'
      },
      {
        id: 'd',
        text: 'O módulo deve ser instalado de cabeça para baixo para funcionar.',
        isCorrect: false,
        explanation:
          'Incorreto. Módulos DIMM possuem sentido único de inserção.'
      }
    ]
  },
  {
    id: 'q-ram-3',
    componentId: 'ram',
    topic: 'Funcionamento',
    question:
      'Qual é o benefício prático de ter uma quantidade adequada de Memória RAM (como 16 GB ou mais) ao utilizar vários programas pesados simultaneamente?',
    options: [
      {
        id: 'a',
        text: 'Permite manter os dados ativos na memória rápida, evitando que o sistema precise recorrer constantemente ao armazenamento (swap/paginação), o que causaria lentidão.',
        isCorrect: true,
        explanation:
          'Correto! Quando a RAM se esgota, o sistema operacional usa parte do SSD como memória virtual (paginação), que é muito mais lenta que a RAM.'
      },
      {
        id: 'b',
        text: 'Aumenta a potência em Watts da fonte de alimentação.',
        isCorrect: false,
        explanation:
          'Incorreto. A memória RAM não aumenta a capacidade da fonte.'
      },
      {
        id: 'c',
        text: 'Substitui a necessidade de ter um processador instalado na placa-mãe.',
        isCorrect: false,
        explanation:
          'Incorreto. A RAM apenas armazena dados temporários para serem processados pela CPU.'
      },
      {
        id: 'd',
        text: 'Reduz a temperatura do processador em 40°C.',
        isCorrect: false,
        explanation:
          'Incorreto. A refrigeração da CPU depende do cooler e da pasta térmica.'
      }
    ]
  },
  {
    id: 'q-ram-4',
    componentId: 'ram',
    topic: 'Instalação',
    question:
      'Qual é o procedimento correto para encaixar um módulo de memória RAM no slot DIMM da placa-mãe?',
    options: [
      {
        id: 'a',
        text: 'Abrir a(s) trava(s) lateral(is) do slot, alinhar o chanfro do módulo com a guia interna e pressionar verticalmente até o clique de travamento.',
        isCorrect: true,
        explanation:
          'Correto! O alinhamento prévio do chanfro evita danos aos contatos e o clique confirma que o módulo está totalmente assentado.'
      },
      {
        id: 'b',
        text: 'Inserir o módulo inclinado a 45 graus e prendê-lo com um parafuso M3 no meio do chip.',
        isCorrect: false,
        explanation:
          'Incorreto. Quem utiliza fixação por parafuso na extremidade é o SSD M.2, não o módulo DIMM de memória RAM.'
      },
      {
        id: 'c',
        text: 'Passar pasta térmica nos contatos dourados da memória antes de encaixar.',
        isCorrect: false,
        explanation:
          'Incorreto! Os contatos dourados da RAM devem permanecer perfeitamente limpos e secos.'
      },
      {
        id: 'd',
        text: 'Encaixar a memória RAM no slot PCIe x16 da placa de vídeo.',
        isCorrect: false,
        explanation:
          'Incorreto. Slots PCIe e slots DIMM possuem formatos e funções completamente distintos.'
      }
    ]
  },
  {
    id: 'q-ram-5',
    componentId: 'ram',
    topic: 'Diagnóstico',
    question:
      'Se um computador é montado e ligado sem nenhum módulo de memória RAM instalado nos slots DIMM, qual será o comportamento do sistema?',
    options: [
      {
        id: 'a',
        text: 'O computador não conclui o POST (não exibe vídeo nem carrega o sistema), acusando falha de memória (DRAM LED ou bipes de diagnóstico).',
        isCorrect: true,
        explanation:
          'Correto! A memória RAM é indispensável logo nos primeiros milissegundos do POST para que a CPU e o firmware UEFI possam operar.'
      },
      {
        id: 'b',
        text: 'O sistema operacional inicia normalmente usando apenas a memória interna da fonte de alimentação.',
        isCorrect: false,
        explanation:
          'Incorreto. Nenhum computador pessoal inicializa sem memória RAM.'
      },
      {
        id: 'c',
        text: 'O computador funciona normalmente, porém sem som.',
        isCorrect: false,
        explanation:
          'Incorreto. Sem RAM, a máquina sequer completa a fase inicial de boot.'
      },
      {
        id: 'd',
        text: 'O cooler do processador gira ao contrário.',
        isCorrect: false,
        explanation:
          'Incorreto. A ausência de RAM bloqueia o POST, não o sentido de rotação do motor DC da ventoinha.'
      }
    ]
  },

  // ==================== 5. ARMAZENAMENTO / SSD (5 QUESTÕES) ====================
  {
    id: 'q-ssd-1',
    componentId: 'ssd',
    topic: 'Fundamentos',
    question:
      'Qual característica principal diferencia o armazenamento em SSD (Solid State Drive) da Memória RAM?',
    options: [
      {
        id: 'a',
        text: 'O SSD é uma memória não-volátil baseada em Flash NAND que preserva o sistema operacional e os arquivos mesmo sem energia elétrica.',
        isCorrect: true,
        explanation:
          'Correto! Enquanto a RAM é volátil e temporária, o SSD retém os dados gravados permanentemente.'
      },
      {
        id: 'b',
        text: 'O SSD apaga todos os arquivos sempre que o computador é reiniciado.',
        isCorrect: false,
        explanation:
          'Incorreto. O SSD mantém os arquivos salvos após desligar ou reiniciar.'
      },
      {
        id: 'c',
        text: 'O SSD utiliza discos magnéticos giratórios a 7200 RPM.',
        isCorrect: false,
        explanation:
          'Incorreto. Quem possui discos magnéticos giratórios é o HD mecânico (HDD); o SSD usa chips eletrônicos sem partes móveis.'
      },
      {
        id: 'd',
        text: 'O SSD serve apenas para resfriar o gabinete.',
        isCorrect: false,
        explanation:
          'Incorreto. O SSD é uma unidade de armazenamento de dados.'
      }
    ]
  },
  {
    id: 'q-ssd-2',
    componentId: 'ssd',
    topic: 'Identificação',
    question:
      'Qual é a diferença física e de instalação entre um SSD M.2 NVMe e um SSD SATA de 2,5 polegadas?',
    options: [
      {
        id: 'a',
        text: 'O SSD M.2 é uma placa compacta conectada direto no slot M.2 da placa-mãe; o SSD SATA 2,5" é instalado em uma baia do gabinete e conectado por cabos SATA.',
        isCorrect: true,
        explanation:
          'Correto! O formato M.2 dispensa cabos e vai direto na placa-mãe, enquanto o formato 2,5" fica fixado no chassi do gabinete usando cabo de dados SATA e alimentação SATA.'
      },
      {
        id: 'b',
        text: 'Ambos possuem o mesmo formato físico e são encaixados no mesmo conector M.2.',
        isCorrect: false,
        explanation:
          'Incorreto. O SSD SATA 2,5" tem carcaça retangular de 2,5 polegadas e não entra em um conector M.2.'
      },
      {
        id: 'c',
        text: 'O SSD M.2 precisa ser instalado dentro da fonte de alimentação.',
        isCorrect: false,
        explanation:
          'Incorreto. Nenhum armazenamento é instalado dentro da fonte.'
      },
      {
        id: 'd',
        text: 'O SSD SATA 2,5" é encaixado nos slots DIMM de memória RAM.',
        isCorrect: false,
        explanation:
          'Incorreto. Slots DIMM são exclusivos para módulos de memória RAM.'
      }
    ]
  },
  {
    id: 'q-ssd-3',
    componentId: 'ssd',
    topic: 'Funcionamento',
    question:
      'Por que um SSD NVMe M.2 (ex.: 3500 MB/s) alcança taxas de transferência muito superiores às de um SSD SATA III de 2,5" (ex.: 550 MB/s)?',
    options: [
      {
        id: 'a',
        text: 'Porque o protocolo NVMe comunica-se diretamente através de linhas de alta velocidade do barramento PCI Express (PCIe), superando o limite de ~600 MB/s da interface SATA III.',
        isCorrect: true,
        explanation:
          'Correto! O barramento SATA III foi projetado na era dos HDs e limita-se a 6 Gbps (~600 MB/s úteis), enquanto o PCIe oferece múltiplos canais de altíssima largura de banda.'
      },
      {
        id: 'b',
        text: 'Porque o SSD SATA usa apenas metade dos cabos da tomada.',
        isCorrect: false,
        explanation:
          'Incorreto. A diferença de velocidade decorre do barramento (PCIe vs. SATA III) e do protocolo (NVMe vs. AHCI/SATA).'
      },
      {
        id: 'c',
        text: 'Porque o SSD M.2 gira seu disco interno a 50.000 rotações por minuto.',
        isCorrect: false,
        explanation:
          'Incorreto. SSDs não possuem discos giratórios.'
      },
      {
        id: 'd',
        text: 'Porque o SSD NVMe só armazena arquivos de texto pequenos.',
        isCorrect: false,
        explanation:
          'Incorreto. Ele armazena qualquer tipo de arquivo e o sistema operacional completo.'
      }
    ]
  },
  {
    id: 'q-ssd-4',
    componentId: 'ssd',
    topic: 'Instalação',
    question:
      'Para que um SSD SATA de 2,5 polegadas funcione corretamente após ser fixado na baia do gabinete, quais conexões são indispensáveis?',
    options: [
      {
        id: 'a',
        text: 'Um cabo de dados SATA ligado à placa-mãe e um conector de alimentação SATA vindo da fonte de alimentação.',
        isCorrect: true,
        explanation:
          'Correto! Diferente do M.2 (que recebe dados e energia pelo próprio slot na placa), o SSD 2,5" precisa do cabo lógico SATA e do cabo de energia SATA.'
      },
      {
        id: 'b',
        text: 'Apenas encostar a carcaça metálica do SSD na lateral do gabinete, sem cabos.',
        isCorrect: false,
        explanation:
          'Incorreto. Sem conexões de dados e energia a unidade não é alimentada nem reconhecida.'
      },
      {
        id: 'c',
        text: 'Ligar um cabo HDMI diretamente do SSD para o monitor.',
        isCorrect: false,
        explanation:
          'Incorreto. Unidades de armazenamento não possuem saída de vídeo HDMI.'
      },
      {
        id: 'd',
        text: 'Aplicar pasta térmica nos conectores SATA dourados.',
        isCorrect: false,
        explanation:
          'Incorreto. Conectores elétricos nunca devem receber pasta térmica.'
      }
    ]
  },
  {
    id: 'q-ssd-5',
    componentId: 'ssd',
    topic: 'Aplicação Prática',
    question:
      'É tecnicamente possível utilizar um SSD M.2 NVMe (na placa-mãe) e um SSD SATA 2,5" (na baia do gabinete) simultaneamente no mesmo computador?',
    options: [
      {
        id: 'a',
        text: 'Sim, desde que a placa-mãe possua slot M.2 e porta SATA disponíveis, permitindo somar as duas unidades para sistema e arquivos.',
        isCorrect: true,
        explanation:
          'Correto! Muitos computadores utilizam um SSD NVMe M.2 principal para o sistema operacional e programas, junto a um SSD SATA 2,5" adicional para arquivos e jogos.'
      },
      {
        id: 'b',
        text: 'Não, pois a instalação de dois SSDs causa curto-circuito imediato na memória RAM.',
        isCorrect: false,
        explanation:
          'Incorreto. Placas-mãe modernas suportam múltiplas unidades de armazenamento simultâneas.'
      },
      {
        id: 'c',
        text: 'Apenas se o computador não tiver processador instalado.',
        isCorrect: false,
        explanation:
          'Incorreto. O processador é sempre obrigatório.'
      },
      {
        id: 'd',
        text: 'Não, pois o gabinete só aceita uma peça de armazenamento por vez por lei física.',
        isCorrect: false,
        explanation:
          'Incorreto. Tanto na bancada quanto em PCs reais, as interfaces M.2 e SATA podem operar juntas.'
      }
    ]
  },

  // ==================== 6. PLACA DE VÍDEO / GPU (5 QUESTÕES) ====================
  {
    id: 'q-video-1',
    componentId: 'video',
    topic: 'Fundamentos',
    question:
      'Por que a arquitetura interna de uma Placa de Vídeo (GPU) é muito mais eficiente que a CPU para renderizar gráficos 3D e jogos?',
    options: [
      {
        id: 'a',
        text: 'Porque possui milhares de núcleos menores projetados para processar cálculos matemáticos e pixels simultaneamente em paralelo.',
        isCorrect: true,
        explanation:
          'Correto! A renderização gráfica envolve calcular milhões de vértices e pixels independentes ao mesmo tempo — tarefa ideal para o paralelismo massivo da GPU.'
      },
      {
        id: 'b',
        text: 'Porque a placa de vídeo não utiliza energia elétrica.',
        isCorrect: false,
        explanation:
          'Incorreto. Pelo contrário, a placa de vídeo costuma ser o componente de maior consumo elétrico do sistema.'
      },
      {
        id: 'c',
        text: 'Porque ela substitui o SSD no armazenamento permanente de documentos.',
        isCorrect: false,
        explanation:
          'Incorreto. A memória da placa de vídeo (VRAM) é volátil e dedicada ao processamento gráfico.'
      },
      {
        id: 'd',
        text: 'Porque é encaixada diretamente dentro do socket do processador.',
        isCorrect: false,
        explanation:
          'Incorreto. A placa de vídeo dedicada utiliza o barramento PCIe x16.'
      }
    ]
  },
  {
    id: 'q-video-2',
    componentId: 'video',
    topic: 'Identificação',
    question:
      'O que é a VRAM (ex.: 6 GB ou 12 GB GDDR6) presente em uma placa de vídeo dedicada?',
    options: [
      {
        id: 'a',
        text: 'Uma memória de vídeo ultrarrápida soldada na própria placa de vídeo para armazenar texturas, modelos 3D e quadros de imagem.',
        isCorrect: true,
        explanation:
          'Correto! A VRAM (Video RAM) fica ao lado do chip gráfico (GPU), oferecendo altíssima largura de banda dedicada para os dados visuais.'
      },
      {
        id: 'b',
        text: 'Um disco rígido mecânico instalado atrás do monitor.',
        isCorrect: false,
        explanation:
          'Incorreto. A VRAM é memória semicondutora volátil integrada à placa de vídeo.'
      },
      {
        id: 'c',
        text: 'Um cabo de força extra que liga a fonte na tomada.',
        isCorrect: false,
        explanation:
          'Incorreto. VRAM significa Video Random Access Memory.'
      },
      {
        id: 'd',
        text: 'Uma memória que pode ser removida da placa de vídeo e encaixada nos slots DDR4 da placa-mãe.',
        isCorrect: false,
        explanation:
          'Incorreto. Os chips GDDR6 são soldados diretamente no PCB da placa de vídeo.'
      }
    ]
  },
  {
    id: 'q-video-3',
    componentId: 'video',
    topic: 'Instalação',
    question:
      'Em qual barramento da placa-mãe deve ser instalada uma placa de vídeo dedicada moderna como a RTX 3060 ou GTX 1660 Super?',
    options: [
      {
        id: 'a',
        text: 'No slot PCI Express x16 (PCIe x16) principal da placa-mãe.',
        isCorrect: true,
        explanation:
          'Correto! O slot PCIe x16 oferece as 16 pistas de comunicação de alta velocidade conectadas diretamente ao processador.'
      },
      {
        id: 'b',
        text: 'No conector M.2 2280.',
        isCorrect: false,
        explanation:
          'Incorreto. O conector M.2 é compacto e destinado a unidades SSD NVMe.'
      },
      {
        id: 'c',
        text: 'Nos slots DIMM verticais ao lado da CPU.',
        isCorrect: false,
        explanation:
          'Incorreto. Os slots DIMM são exclusivos para memória RAM.'
      },
      {
        id: 'd',
        text: 'Diretamente na porta SATA III por meio de um cabo plano.',
        isCorrect: false,
        explanation:
          'Incorreto. Portas SATA são interfaces de armazenamento.'
      }
    ]
  },
  {
    id: 'q-video-4',
    componentId: 'video',
    topic: 'Compatibilidade',
    question:
      'Por que placas de vídeo de médio e alto desempenho (ex.: 120 W a 170 W ou mais) exigem conectores de energia PCIe diretamente da fonte, além do encaixe na placa-mãe?',
    options: [
      {
        id: 'a',
        text: 'Porque o slot PCIe x16 da placa-mãe fornece no máximo até 75 W, sendo necessário alimentar o restante da demanda pelos cabos PCIe da fonte.',
        isCorrect: true,
        explanation:
          'Correto! Pela especificação PCI Express, o slot fornece até 75 W; placas que consomem 120 W, 170 W ou mais dependem dos cabos PCIe (6+2 pinos / 8 pinos) da fonte.'
      },
      {
        id: 'b',
        text: 'Porque o slot PCIe transmite apenas som e nenhuma energia.',
        isCorrect: false,
        explanation:
          'Incorreto. O slot transmite dados e até 75 W de energia.'
      },
      {
        id: 'c',
        text: 'Para transferir os arquivos do SSD para a fonte de alimentação.',
        isCorrect: false,
        explanation:
          'Incorreto. Os cabos PCIe da fonte fornecem exclusivamente alimentação elétrica (+12V).'
      },
      {
        id: 'd',
        text: 'Apenas para segurar a placa mecanicamente no ar.',
        isCorrect: false,
        explanation:
          'Incorreto. A sustentação mecânica vem do slot PCIe e do espelho parafusado ao gabinete.'
      }
    ]
  },
  {
    id: 'q-video-5',
    componentId: 'video',
    topic: 'Diagnóstico',
    question:
      'Ao concluir a montagem de um computador que possui uma Placa de Vídeo dedicada instalada no slot PCIe x16, onde o cabo do monitor (HDMI/DisplayPort) deve ser conectado?',
    options: [
      {
        id: 'a',
        text: 'Diretamente nas saídas de vídeo da própria Placa de Vídeo dedicada.',
        isCorrect: true,
        explanation:
          'Correto! Para utilizar o processamento da GPU dedicada (especialmente quando a CPU não tem gráfico integrado), o monitor deve ser plugado nas saídas da placa de vídeo.'
      },
      {
        id: 'b',
        text: 'Na grade traseira da fonte de alimentação.',
        isCorrect: false,
        explanation:
          'Incorreto. A fonte de alimentação possui apenas entrada de energia AC e chave liga/desliga.'
      },
      {
        id: 'c',
        text: 'Na porta de rede RJ-45 da placa-mãe.',
        isCorrect: false,
        explanation:
          'Incorreto. A porta RJ-45 é para cabo de rede Ethernet.'
      },
      {
        id: 'd',
        text: 'Sempre na saída da placa-mãe, mesmo que o processador não tenha vídeo integrado.',
        isCorrect: false,
        explanation:
          'Incorreto. Se o processador não possui vídeo integrado (iGPU), as saídas de vídeo da placa-mãe permanecem inativas (sem sinal).'
      }
    ]
  },

  // ==================== 7. FONTE DE ALIMENTAÇÃO / PSU (5 QUESTÕES) ====================
  {
    id: 'q-fonte-1',
    componentId: 'fonte',
    topic: 'Fundamentos',
    question:
      'Qual é a função elétrica essencial realizada pela Fonte de Alimentação (PSU) em um computador?',
    options: [
      {
        id: 'a',
        text: 'Converter a Corrente Alternada (AC) da tomada em tensões de Corrente Contínua (DC: +12V, +5V, +3,3V) reguladas e filtradas.',
        isCorrect: true,
        explanation:
          'Correto! Circuitos digitais operam em corrente contínua de baixa tensão; a fonte realiza essa conversão com regulação e proteções contra sobrecarga.'
      },
      {
        id: 'b',
        text: 'Enviar 220V em Corrente Alternada diretamente para os núcleos do processador.',
        isCorrect: false,
        explanation:
          'Incorreto. Aplicar tensão alternada da rede diretamente nos chips queimaria instantaneamente o hardware.'
      },
      {
        id: 'c',
        text: 'Armazenar temporariamente as abas abertas do navegador de internet.',
        isCorrect: false,
        explanation:
          'Incorreto. Dados de programas abertos ficam na Memória RAM.'
      },
      {
        id: 'd',
        text: 'Renderizar os gráficos 3D quando a placa de vídeo aquece.',
        isCorrect: false,
        explanation:
          'Incorreto. A fonte é um componente puramente eletroeletrônico de alimentação.'
      }
    ]
  },
  {
    id: 'q-fonte-2',
    componentId: 'fonte',
    topic: 'Instalação',
    question:
      'Onde a Fonte de Alimentação (PSU) é fisicamente instalada dentro da estrutura do computador?',
    options: [
      {
        id: 'a',
        text: 'Em um compartimento dedicado do gabinete (como o PSU Shroud inferior), distribuindo energia aos componentes através de cabos.',
        isCorrect: true,
        explanation:
          'Correto! A fonte é fixada no chassi do gabinete e nunca encaixada diretamente em slots da placa-mãe.'
      },
      {
        id: 'b',
        text: 'Encaixada diretamente sobre o socket do processador no lugar do cooler.',
        isCorrect: false,
        explanation:
          'Incorreto. Sobre o processador vai o cooler.'
      },
      {
        id: 'c',
        text: 'Dentro do conector M.2 da placa-mãe.',
        isCorrect: false,
        explanation:
          'Incorreto. O conector M.2 é para unidades SSD compactas.'
      },
      {
        id: 'd',
        text: 'Parafusada em cima da memória RAM.',
        isCorrect: false,
        explanation:
          'Incorreto. A fonte fica isolada em seu próprio compartimento no gabinete.'
      }
    ]
  },
  {
    id: 'q-fonte-3',
    componentId: 'fonte',
    topic: 'Funcionamento',
    question:
      'O que significa tecnicamente a certificação "80 Plus" (White, Bronze, Gold, etc.) presente em uma fonte de alimentação?',
    options: [
      {
        id: 'a',
        text: 'Indica o nível de eficiência energética na conversão AC/DC (pelo menos 80% da energia puxada da tomada é entregue útil ao PC, desperdiçando menos em calor).',
        isCorrect: true,
        explanation:
          'Correto! Uma fonte mais eficiente desperdiça menos energia elétrica na forma de calor durante a conversão.'
      },
      {
        id: 'b',
        text: 'Significa que a fonte dura obrigatoriamente 80 anos sem manutenção.',
        isCorrect: false,
        explanation:
          'Incorreto. O número 80 refere-se ao percentual mínimo de eficiência energética (80%).'
      },
      {
        id: 'c',
        text: 'Garante que qualquer fonte de 400 W entregue 800 W continuamente.',
        isCorrect: false,
        explanation:
          'Incorreto. A potência máxima contínua continua sendo a potência nominal rotulada.'
      },
      {
        id: 'd',
        text: 'Indica que a fonte possui 80 cabos SATA.',
        isCorrect: false,
        explanation:
          'Incorreto. Não tem relação com a quantidade de cabos.'
      }
    ]
  },
  {
    id: 'q-fonte-4',
    componentId: 'fonte',
    topic: 'Compatibilidade',
    question:
      'Na Bancada Virtual, uma configuração com Intel i5 (125 W) + RTX 3060 (170 W) + Placa-Mãe LGA1700 (40 W) + Cooler/RAM/SSD soma ~350 W contínuos. Por que o diagnóstico recomenda a Fonte de 650 W em vez da Fonte de 450 W?',
    options: [
      {
        id: 'a',
        text: 'Porque ao adicionar a margem operacional recomendada (~30% para picos transitórios e eficiência), a demanda segura (~460 W) ultrapassa a capacidade da fonte de 450 W.',
        isCorrect: true,
        explanation:
          'Correto! Componentes de alto desempenho apresentam picos transitórios de corrente em milissegundos; operar uma fonte de entrada de 450 W tão próxima do limite compromete a estabilidade.'
      },
      {
        id: 'b',
        text: 'Porque processadores Intel só funcionam com fontes de exatamente 650 W.',
        isCorrect: false,
        explanation:
          'Incorreto. Se a GPU fosse de baixo consumo, uma fonte menor poderia atender; o dimensionamento depende da carga total combinada.'
      },
      {
        id: 'c',
        text: 'Porque a fonte de 450 W é compatível apenas com memórias DDR4.',
        isCorrect: false,
        explanation:
          'Incorreto. Fontes ATX alimentam placas DDR4 ou DDR5 indistintamente.'
      },
      {
        id: 'd',
        text: 'Porque a fonte de 650 W aumenta a capacidade do SSD em 500 GB.',
        isCorrect: false,
        explanation:
          'Incorreto. A fonte fornece alimentação elétrica, não armazenamento.'
      }
    ]
  },
  {
    id: 'q-fonte-5',
    componentId: 'fonte',
    topic: 'Aplicação Prática',
    question:
      'Se um computador consome cerca de 235 W em uso normal e está equipado com uma fonte de qualidade de 650 W, quanta potência a fonte entregará aos componentes nesse momento?',
    options: [
      {
        id: 'a',
        text: 'Apenas os ~235 W solicitados pelos componentes naquele instante, trabalhando com ampla folga e segurança.',
        isCorrect: true,
        explanation:
          'Correto! A potência nominal (650 W) é o teto máximo disponível; a fonte fornece apenas a corrente que o sistema demanda a cada momento.'
      },
      {
        id: 'b',
        text: 'Forçará 650 W contínuos dentro da placa-mãe, queimando os componentes.',
        isCorrect: false,
        explanation:
          'Incorreto. Uma fonte regulada mantém a tensão fixa (+12V, +5V, +3,3V) e a carga puxa apenas a corrente necessária.'
      },
      {
        id: 'c',
        text: 'Não ligará, pois a fonte exige no mínimo 650 W de consumo para dar partida.',
        isCorrect: false,
        explanation:
          'Incorreto. Fontes operam perfeitamente em cargas parciais.'
      },
      {
        id: 'd',
        text: 'Desligará a ventoinha do processador para economizar energia.',
        isCorrect: false,
        explanation:
          'Incorreto. O controle da ventoinha da CPU é feito pelo sinal PWM da placa-mãe conforme a temperatura.'
      }
    ]
  }
];

export const AUDIT_FIXES_REPORT = [
  {
    id: 1,
    issue: 'Pesquisa inteligente multi-campo com normalização de acentos',
    fix: 'A busca consulta nome, categoria, resumo, função, funcionamento, características, compatibilidade, cuidados, erros comuns e sinônimos técnicos (DDR4, LGA1700, AM4, M.2, NVMe, pasta térmica, alimentação).'
  },
  {
    id: 2,
    issue: 'Módulo de avaliação reconstruído com 35 questões técnicas',
    fix: 'Banco completo de 35 questões (5 por componente, 4 alternativas cada) com apresentação de 1 questão por vez, confirmação com explicação imediata, filtro por componente e histórico local.'
  },
  {
    id: 3,
    issue: 'Sistema de progresso educacional em duas camadas',
    fix: 'Diferenciação clara entre componentes Visualizados (ao abrir a ficha técnica) e Declarados como Estudados pelo aluno (com opção de desfazer), preservando os dados existentes em localStorage.'
  },
  {
    id: 4,
    issue: 'Fichas técnicas em modal acessível WCAG 2.2 AA',
    fix: 'Suporte a fechamento por Esc, contenção de foco (focus trap), restauração de foco ao botão de origem, bloqueio de rolagem de fundo e navegação fluida entre componentes relacionados.'
  },
  {
    id: 5,
    issue: 'Validação determinística na Bancada Virtual',
    fix: 'Máquina de estados centralizada com suporte a plataformas AM4/DDR4 e LGA1700/DDR5, remoção com dependências físicas, limpeza educativa de Super Bonder e cálculo realista de energia.'
  }
];
