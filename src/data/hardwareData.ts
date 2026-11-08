export type ComponentCategory =
  | 'Estrutura & Conexão'
  | 'Processamento'
  | 'Refrigeração'
  | 'Memória'
  | 'Armazenamento'
  | 'Gráficos'
  | 'Energia';

export interface QuizQuestion {
  id: string;
  componentId: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
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
      'Equipada com socket PGA AM4 para processadores AMD Ryzen e slots DIMM compatíveis com memória DDR4.',
    recommendedNotes:
      'Exige processador AM4, cooler com furação AM4 e módulo de memória DDR4. Aceita SSD M.2 NVMe na placa ou SSD SATA 2,5" na baia do gabinete.'
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
      'Projetada com socket LGA1700 para processadores Intel Core e revisada especificamente com slots DIMM para memória DDR5.',
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
      'Processador de 6 núcleos para socket AMD AM4. Consumo térmico base de 65 W. Requer placa de vídeo dedicada para geração de sinal de vídeo neste conjunto.'
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
      'Processador de alto desempenho para socket Intel LGA1700. Consumo base estimado em 125 W, exigindo atenção redobrada ao dimensionamento da fonte e refrigeração.'
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
      'Composto de alta condutividade térmica aplicado sobre o difusor metálico (IHS) do processador para eliminar microcavidades de ar entre a CPU e a base do cooler.'
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
      'Adesivo químico de colagem rápida. Nunca deve ser usado em computadores: atua como isolante térmico severo e cola permanentemente o cooler ao processador, danificando o socket.'
  },
  {
    id: 'cooler-amd',
    name: 'Cooler AMD AM4',
    category: 'cooler',
    categoryLabel: 'Refrigeração',
    libraryComponentId: 'cooler',
    specsSummary: 'Suporte AM4 · 10 W',
    socket: 'AM4',
    watts: 10,
    technicalDetails:
      'Conjunto de dissipador aletado em alumínio e ventoinha PWM com espaçamento de fixação específico para o backplate do socket AMD AM4.'
  },
  {
    id: 'cooler-intel',
    name: 'Cooler Intel LGA1700',
    category: 'cooler',
    categoryLabel: 'Refrigeração',
    libraryComponentId: 'cooler',
    specsSummary: 'Suporte LGA1700 · 10 W',
    socket: 'LGA1700',
    watts: 10,
    technicalDetails:
      'Sistema de refrigeração a ar com matriz de montagem 78x78 mm e altura de pressão dimensionada para o socket Intel LGA1700.'
  },
  {
    id: 'ram-ddr4',
    name: 'DDR4 16 GB',
    category: 'ram',
    categoryLabel: 'Memória RAM',
    libraryComponentId: 'ram',
    specsSummary: 'DDR4 · 3200 MHz · 5 W',
    memoryType: 'DDR4',
    watts: 5,
    technicalDetails:
      'Módulo DIMM de 288 pinos padrão DDR4 operando a 3200 MT/s (1,2 V). Possui chanfro físico (key notch) exclusivo para slots DDR4.'
  },
  {
    id: 'ram-ddr5',
    name: 'DDR5 16 GB',
    category: 'ram',
    categoryLabel: 'Memória RAM',
    libraryComponentId: 'ram',
    specsSummary: 'DDR5 · 5200 MHz · 5 W',
    memoryType: 'DDR5',
    watts: 5,
    technicalDetails:
      'Módulo DIMM de 288 pinos padrão DDR5 operando a 5200 MT/s (1,1 V com PMIC integrado no módulo). O chanfro físico é diferente do DDR4, impedindo o encaixe cruzado.'
  },
  {
    id: 'ssd-nvme',
    name: 'SSD NVMe M.2 1 TB',
    category: 'storage',
    categoryLabel: 'Armazenamento',
    libraryComponentId: 'ssd',
    specsSummary: 'Formato M.2 2280 · PCIe NVMe · 5 W',
    storageInterface: 'M.2_NVME',
    watts: 5,
    technicalDetails:
      'Unidade de estado sólido compacta que se conecta diretamente ao barramento PCIe da placa-mãe através do conector M.2, dispensando cabos de dados e energia.'
  },
  {
    id: 'ssd-sata',
    name: 'SSD SATA 2,5" 480 GB',
    category: 'storage',
    categoryLabel: 'Armazenamento',
    libraryComponentId: 'ssd',
    specsSummary: 'Formato 2,5" · Interface SATA III · 3 W',
    storageInterface: 'SATA_25',
    watts: 3,
    technicalDetails:
      'Unidade de armazenamento em gabinete metálico de 2,5 polegadas. Deve ser fixada na baia dedicada do gabinete e conectada à placa-mãe via cabo SATA de dados e à fonte via cabo SATA de alimentação.'
  },
  {
    id: 'gpu-3060',
    name: 'RTX 3060',
    category: 'gpu',
    categoryLabel: 'Placa de Vídeo',
    libraryComponentId: 'video',
    specsSummary: 'PCIe x16 · 12 GB GDDR6 · 170 W',
    watts: 170,
    requiresPciePower: true,
    technicalDetails:
      'Placa de vídeo dedicada de alto consumo estimado (170 W). Além do encaixe no slot PCIe x16 (que fornece até 75 W), exige conector PCIe 8 pinos dedicado da fonte e folga energética para picos.'
  },
  {
    id: 'gpu-1660',
    name: 'GTX 1660 Super',
    category: 'gpu',
    categoryLabel: 'Placa de Vídeo',
    libraryComponentId: 'video',
    specsSummary: 'PCIe x16 · 6 GB GDDR6 · 120 W',
    watts: 120,
    requiresPciePower: true,
    technicalDetails:
      'Placa de vídeo intermediária com consumo estimado em 120 W. Instala-se no slot PCIe x16 principal e utiliza alimentação suplementar PCIe.'
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
      'Fonte ATX de 650 W com certificação 80 Plus Bronze e múltiplos conectores PCIe 6+2 pinos. Oferece ampla margem de segurança para qualquer combinação de CPU e GPU da bancada.'
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
      'Fonte de entrada com capacidade nominal de 450 W. Adequada para configurações de baixo consumo (ex.: Ryzen 5 65 W + GTX 1660 Super 120 W), mas opera com margem estreita para combinações de alto TDP (ex.: Intel i5 125 W + RTX 3060 170 W + picos transitórios).'
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
    mainFunction: 'Interligar CPU, memória, armazenamento, placa de vídeo e distribuir energia e dados.',
    whatIs:
      'A placa-mãe (motherboard) é a principal placa de circuito impresso (PCB) de um computador. Nela estão soldados o socket do processador, os slots de memória RAM, conectores de expansão PCIe, interfaces de armazenamento (M.2 e SATA) e o circuito regulador de tensão (VRM).',
    howItWorks:
      'Sozinha, a placa-mãe não executa programas do usuário, mas atua como uma malha de comunicação de alta velocidade. Através de trilhas de cobre (barramentos) e do chipset, ela coordena o fluxo de sinais digitais entre o processador, a memória RAM, o SSD e a placa de vídeo, além de gerenciar a inicialização básica pelo firmware UEFI/BIOS.',
    analogyText:
      'Se o computador fosse uma cidade planejada, a placa-mãe seria o território com todo o sistema de rodovias, pontes e redes elétricas interligando os edifícios. Sem vias compatíveis, as informações não conseguem circular entre os órgãos da cidade.',
    characteristics: [
      'Socket da CPU: define a família física e elétrica do processador aceito (ex.: AMD AM4 ou Intel LGA1700).',
      'Slots DIMM de Memória: determinam a geração de RAM suportada pela placa (DDR4 ou DDR5, nunca ambas no mesmo slot).',
      'Slots de Expansão PCI Express (PCIe): utilizados principalmente para placas de vídeo dedicadas (x16).',
      'Interfaces de Armazenamento: conectores M.2 (direto na placa) e portas SATA para cabos de dados.',
      'Pontos de Fixação: furos metalizados que alinham a placa aos espaçadores (standoffs) do gabinete.'
    ],
    compatibility: [
      'O socket da placa-mãe deve ser idêntico ao do processador e compatível com a furação do cooler.',
      'Importante: um mesmo socket (como o LGA1700) pode existir em modelos de placa-mãe DDR4 ou modelos DDR5; quem define a memória aceita é o slot construído na placa-mãe.',
      'Exige os conectores principais da fonte de alimentação (ATX 24 pinos e EPS 8 pinos para a CPU).'
    ],
    care: [
      'Sempre fixe a placa-mãe sobre espaçadores no gabinete utilizando os parafusos nos furos corretos para evitar curto-circuito com a chapa metálica.',
      'Segure a placa pelas bordas e evite tocar nos pinos do socket ou componentes eletrônicos sensíveis à descarga eletrostática (ESD).'
    ],
    commonMistakes: [
      'Comprar um processador Intel para uma placa-mãe AMD (ou vice-versa).',
      'Adquirir memória DDR5 para uma placa-mãe cujos slots são DDR4.',
      'Esquecer de parafusar a placa-mãe ao gabinete, deixando-a sujeita a torções ao encaixar a placa de vídeo.'
    ],
    inWorkbench:
      'Na Bancada Virtual, você começa selecionando a plataforma da Placa-Mãe (AMD AM4 com DDR4 ou Intel LGA1700 com DDR5) e deve fixá-la ao gabinete instalando os 4 parafusos nos cantos demarcados.',
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
    mainFunction: 'Processar instruções lógicas, aritméticas e controlar a execução do sistema operacional e aplicativos.',
    whatIs:
      'O processador, ou CPU (Central Processing Unit), é um chip semicondutor contendo bilhões de transistores organizados em núcleos (cores). Ele interpreta e executa as instruções enviadas pelos softwares a cada bilionésimo de segundo.',
    howItWorks:
      'A CPU busca instruções armazenadas na memória RAM, decodifica o comando, executa operações matemáticas ou lógicas na Unidade Lógica e Aritmética (ULA) e grava o resultado. Durante esse trabalho intenso, a passagem de corrente elétrica pelos transistores converte energia em calor rapidamente.',
    analogyText:
      'O processador funciona como o maestro e cérebro de uma equipe: ele lê a partitura (código), realiza os cálculos decisivos e coordena o momento exato em que cada setor deve agir.',
    characteristics: [
      'Padrão de Encaixe (Socket): pode possuir pinos no próprio processador (PGA, como no AMD AM4) ou contatos planos que tocam pinos na placa-mãe (LGA, como no Intel LGA1700).',
      'TDP (Thermal Design Power): estimativa de dissipação térmica e consumo sob carga base (ex.: 65 W ou 125 W).',
      'Vídeo Integrado (iGPU): alguns processadores possuem chip gráfico embutido, enquanto outros exigem placa de vídeo dedicada para exibir imagem.'
    ],
    compatibility: [
      'Encaixa exclusivamente no socket correspondente da placa-mãe (Ryzen 5 AM4 em placa AM4; Intel i5 LGA1700 em placa LGA1700).',
      'Depende obrigatoriamente de aplicação de pasta térmica e instalação de um cooler compatível antes de ligar o computador.'
    ],
    care: [
      'Alinhe a marcação triangular do processador com o canto indicado no socket antes de abaixar a trava — nunca force o encaixe.',
      'Jamais ligue o computador sem um sistema de refrigeração devidamente instalado sobre a CPU.'
    ],
    commonMistakes: [
      'Tentar instalar um processador em uma placa-mãe de fabricante ou geração incompatível.',
      'Instalar o cooler diretamente sobre a CPU seca, sem aplicar pasta térmica.',
      'Tentar remover a CPU da placa-mãe sem antes retirar o cooler que está preso sobre ela.'
    ],
    inWorkbench:
      'Na Bancada Virtual, escolha o processador compatível com o socket da placa-mãe ativa (AM4 ou LGA1700) e instale-o no socket central antes de aplicar a pasta térmica e o cooler.',
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
    mainFunction: 'Transferir o calor gerado pelo processador para o dissipador metálico e expulsá-lo com fluxo de ar.',
    whatIs:
      'O sistema de refrigeração a ar (Air Cooler) combina uma base metálica condutora, tubos de calor (heatpipes), aletas de alumínio e uma ventoinha (fan), trabalhando em conjunto com uma fina camada de pasta térmica.',
    howItWorks:
      'Mesmo polidas, a tampa metálica do processador e a base do cooler possuem microimperfeições invisíveis a olho nu que retêm ar (que é um péssimo condutor térmico). A pasta térmica preenche essas microcavidades, permitindo que o calor passe rapidamente da CPU para o dissipador, onde a ventoinha o sopra para fora.',
    analogyText:
      'Pense no cooler como o radiador e o sistema de arrefecimento de um motor. Sem ele, o calor se acumula em poucos segundos, fazendo o processador reduzir drasticamente sua velocidade (thermal throttling) ou desligar por proteção.',
    characteristics: [
      'Suporte de Fixação (Bracket): cada socket possui distâncias diferentes entre os furos; o cooler precisa ser compatível com AM4 ou LGA1700.',
      'Pasta Térmica: composto técnico formulado com óxidos metálicos ou cerâmicos para conduzir calor sem conduzir cola.',
      'Consumo Elétrico Baixo: a ventoinha consome cerca de 5 W a 10 W conectados ao header CPU_FAN da placa-mãe.'
    ],
    compatibility: [
      'Exige que o processador já esteja instalado no socket.',
      'Exige que a pasta térmica correta tenha sido aplicada sobre a CPU (exceto em coolers que já venham com pasta pré-aplicada de fábrica — na nossa bancada didática, a aplicação manual é obrigatória).',
      'O mecanismo de fixação do cooler deve corresponder ao socket da placa-mãe (Cooler AM4 para placa AM4; Cooler LGA1700 para placa LGA1700).'
    ],
    care: [
      'Aplique apenas uma pequena gota central de pasta térmica; nunca utilize colas, adesivos (como Super Bonder) ou materiais caseiros.',
      'Caso aplique um produto incorreto, limpe completamente a superfície com álcool isopropílico antes de prosseguir.'
    ],
    commonMistakes: [
      'Esquecer a pasta térmica antes de travar o cooler.',
      'Confundir pasta térmica com cola (Super Bonder), bloqueando a troca de calor e danificando a peça.',
      'Tentar usar um cooler com suporte AMD em uma placa-mãe Intel sem o adaptador correspondente.'
    ],
    inWorkbench:
      'Na Bancada Virtual, após instalar a CPU, aplique a Pasta Térmica sobre ela e, em seguida, instale o Cooler correspondente ao socket da placa-mãe.',
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
      'Memória volátil de altíssima velocidade onde ficam carregados o sistema operacional e os programas abertos no momento.',
    mainFunction: 'Armazenar temporariamente dados em uso ativo para acesso quase instantâneo pelo processador.',
    whatIs:
      'A Memória de Acesso Aleatório (Random Access Memory) é composta por chips semicondutores ultrarrápidos montados em um módulo DIMM. Ela serve como ponte imediata entre o armazenamento permanente (SSD) e o processador.',
    howItWorks:
      'Quando você abre um aplicativo ou jogo, o computador copia os arquivos necessários do SSD para a memória RAM, pois a RAM possui latência na casa de nanossegundos. Como é uma memória volátil, todo o seu conteúdo é esvaziado assim que o computador é desligado.',
    analogyText:
      'Se o SSD é um arquivo de gavetas onde você guarda seus livros permanentemente, a memória RAM é a mesa de estudos à sua frente. Quanto maior e mais rápida a mesa, mais livros você consegue manter abertos simultaneamente sem precisar guardar um para pegar outro.',
    characteristics: [
      'Geração (DDR4 vs. DDR5): possuem tensões elétricas, arquiteturas e posições do chanfro físico (entalhe nos contatos) diferentes.',
      'Capacidade (ex.: 16 GB): define quantos programas e dados simultâneos cabem na memória sem recorrer ao disco.',
      'Frequência / Taxa de Transferência (ex.: 3200 MHz em DDR4 ou 5200 MHz em DDR5): determina a largura de banda de leitura e escrita.'
    ],
    compatibility: [
      'Um módulo DDR4 só encaixa em slots DDR4; um módulo DDR5 só encaixa em slots DDR5.',
      'Mesmo que duas placas-mãe usem o mesmo processador, você deve verificar na especificação da placa-mãe qual padrão de RAM ela utiliza.'
    ],
    care: [
      'Alinhe o chanfro da base dourada do módulo com a divisão interna do slot DIMM antes de pressionar verticalmente até ouvir o clique das travas.',
      'Evite tocar nos contatos dourados para não depositar oleosidade das mãos.'
    ],
    commonMistakes: [
      'Tentar encaixar memória DDR5 em uma placa-mãe DDR4 (ou DDR4 em placa DDR5).',
      'Confundir memória RAM (ex.: 16 GB temporários) com espaço de armazenamento do SSD (ex.: 1 TB permanentes).'
    ],
    inWorkbench:
      'Na Bancada Virtual, verifique se a placa-mãe escolhida utiliza DDR4 ou DDR5 e instale o módulo compatível no slot DIMM.',
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
      'Unidade de estado sólido não-volátil onde o sistema operacional, programas e arquivos pessoais ficam gravados permanentemente.',
    mainFunction: 'Guardar dados de forma permanente, mantendo as informações mesmo com o computador desligado.',
    whatIs:
      'O SSD (Solid State Drive) é um dispositivo de armazenamento baseado em memórias Flash NAND. Diferente dos antigos discos rígidos magnéticos (HDDs), não possui discos giratórios nem cabeçotes mecânicos móveis.',
    howItWorks:
      'Os dados são gravados eletronicamente em células de memória flash gerenciadas por um controlador dedicado. Existem dois formatos principais em computadores atuais: o SSD M.2 NVMe (formato compacto semelhante a um pente estreito que se conecta direto na placa-mãe via PCIe) e o SSD SATA de 2,5" (formato de caixa retangular instalado no gabinete e ligado por cabos).',
    analogyText:
      'O SSD é a biblioteca permanente da empresa: mesmo quando todas as luzes são apagadas no fim do expediente (PC desligado), todos os documentos permanecem guardados exatamente onde foram deixados para o dia seguinte.',
    characteristics: [
      'SSD M.2 NVMe: instala-se diretamente no conector M.2 da placa-mãe e atinge velocidades de 3500 MB/s ou mais.',
      'SSD SATA 2,5": instala-se em uma baia de 2,5 polegadas do gabinete, atingindo cerca de 550 MB/s pelo limite do barramento SATA III.',
      'Não-volátil: preserva os arquivos sem necessidade de energia contínua.'
    ],
    compatibility: [
      'Um SSD M.2 deve ser instalado exclusivamente no slot M.2 da placa-mãe.',
      'Um SSD SATA 2,5" não entra em um conector M.2 — ele deve ser instalado na baia 2,5" do gabinete com conexão SATA.'
    ],
    care: [
      'Ao instalar um SSD M.2, insira os contatos em leve ângulo (cerca de 30°) e abaixe-o suavemente até o parafuso de fixação.',
      'No SSD SATA 2,5", garanta que tanto o cabo de dados SATA (ligado à placa-mãe) quanto o cabo de energia SATA (vindo da fonte) estejam conectados.'
    ],
    commonMistakes: [
      'Tentar encaixar um SSD SATA de 2,5 polegadas no slot M.2 da placa-mãe.',
      'Achar que o computador precisa apenas de memória RAM e esquecer de instalar uma unidade de armazenamento para o sistema operacional.'
    ],
    inWorkbench:
      'Na Bancada Virtual, você pode instalar o SSD NVMe M.2 diretamente no slot M.2 da placa-mãe ou instalar o SSD SATA 2,5" na baia lateral dedicada do gabinete (ou ambos!).',
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
      'Processador gráfico dedicado com memória própria (VRAM) projetado para processamento paralelo de imagens, vídeo e 3D.',
    mainFunction: 'Calcular geometria, iluminação e pixels em paralelo para exibir gráficos na tela com alta taxa de quadros.',
    whatIs:
      'A Placa de Vídeo dedicada é uma placa de expansão equipada com uma GPU (Graphics Processing Unit), memória de vídeo ultrarrápida (VRAM), circuito de energia próprio e sistema de refrigeração dedicado.',
    howItWorks:
      'Enquanto a CPU possui poucos núcleos otimizados para tarefas sequenciais complexas, a GPU possui milhares de núcleos menores que trabalham simultaneamente para calcular milhões de polígonos, texturas e pixels a cada segundo, enviando o quadro pronto para o monitor.',
    analogyText:
      'Se o processador (CPU) é o engenheiro que calcula a física e as regras de uma cena, a placa de vídeo (GPU) é uma equipe com milhares de ilustradores pintando cada fração da tela ao mesmo tempo.',
    characteristics: [
      'Interface PCI Express x16: conecta-se ao slot longo principal da placa-mãe.',
      'VRAM Dedicada (ex.: 6 GB ou 12 GB GDDR6): memória exclusiva para texturas e quadros gráficos.',
      'Alto Consumo Energético: modelos como GTX 1660 Super (~120 W) e RTX 3060 (~170 W) costumam ser o componente de maior demanda elétrica do PC.'
    ],
    compatibility: [
      'Instala-se no slot PCIe x16 da placa-mãe.',
      'Observação técnica importante: computadores cujos processadores possuem vídeo integrado (iGPU) podem inicializar sem placa de vídeo dedicada; porém, em configurações sem vídeo integrado ou voltadas a aplicações gráficas/jogos, a GPU dedicada é indispensável.',
      'Exige que a fonte de alimentação possua potência suficiente e conectores PCIe de 6+2 pinos adequados.'
    ],
    care: [
      'Certifique-se de que a trava do slot PCIe x16 esteja aberta antes de encaixar a placa e conecte o cabo de energia PCIe da fonte.',
      'Verifique sempre o consumo somado da GPU + CPU antes de escolher a fonte de alimentação.'
    ],
    commonMistakes: [
      'Combinar uma placa de vídeo de alto consumo (como RTX 3060) e um processador de 125 W em uma fonte de entrada sem margem energética segura.',
      'Esquecer de conectar os cabos de alimentação PCIe vindos da fonte.'
    ],
    inWorkbench:
      'Na Bancada Virtual, encaixe a Placa de Vídeo (RTX 3060 ou GTX 1660 Super) no slot PCIe x16 e observe no painel de diagnóstico o impacto imediato no consumo estimado em Watts.',
    relatedIds: ['placa', 'fonte', 'cpu'],
    workbenchFilterCategory: 'gpu'
  },
  {
    id: 'fonte',
    name: 'Fonte de Alimentação (PSU)',
    shortName: 'Fonte (PSU)',
    category: 'Energia',
    imageFile: 'fonte.jpg',
    analogyTitle: 'O Coração e Estabilizador Energético',
    summary:
      'Unidade responsável por converter a corrente alternada da tomada em tensões contínuas reguladas e seguras para todo o computador.',
    mainFunction: 'Converter AC em DC (12V, 5V, 3.3V), fornecer potência estável e proteger os componentes contra sobrecargas.',
    whatIs:
      'A Fonte de Alimentação, ou PSU (Power Supply Unit), é um conversor eletroeletrônico instalado em um compartimento próprio do gabinete (nunca encaixado dentro da placa-mãe, mas conectado a ela por cabos).',
    howItWorks:
      'Ela recebe a energia em Corrente Alternada (110V/220V AC) da rede elétrica, retifica, filtra e transforma em linhas de Corrente Contínua (principalmente +12V para CPU e GPU, +5V e +3,3V para memórias, SSDs e controladores) com baixíssima oscilação (ripple).',
    analogyText:
      'A fonte atua como o coração e a subestação de tratamento do computador: recebe uma pressão bruta externa e distribui o fluxo exato e limpo que cada órgão delicado precisa para funcionar sem sofrer danos.',
    characteristics: [
      'Potência Nominal (ex.: 450 W ou 650 W): quantidade máxima contínua de energia que a fonte consegue entregar.',
      'Certificação 80 Plus (White, Bronze, Gold): indica a eficiência energética na conversão (menos energia desperdiçada na forma de calor).',
      'Margem de Segurança Recomendada: uma fonte não deve trabalhar em 100% do seu limite; recomenda-se manter pelo menos 20% a 30% de folga para absorver picos transitórios e operar na faixa de melhor eficiência.'
    ],
    compatibility: [
      'Instala-se na baia inferior (PSU Shroud) do gabinete e distribui cabos para a placa-mãe, CPU, GPU e armazenamento SATA.',
      'A capacidade nominal da fonte deve superar com folga a soma de consumo de todos os componentes (CPU + GPU + Placa-Mãe + RAM + Armazenamento + Cooler).'
    ],
    care: [
      'Nunca escolha uma fonte olhando apenas se o número nominal é levemente maior que a soma básica; considere a margem operacional e a qualidade da linha de 12V.',
      'Posicione a ventoinha da fonte voltada para a abertura de ventilação do gabinete.'
    ],
    commonMistakes: [
      'Acreditar que a fonte vai instalada "em cima" da placa-mãe em vez do compartimento do gabinete.',
      'Subdimensionar a fonte ao usar processadores de 125 W junto com placas de vídeo de 170 W.'
    ],
    inWorkbench:
      'Na Bancada Virtual, instale a fonte no compartimento inferior do gabinete e compare o Consumo Estimado do Sistema, a Margem Recomendada (+25%) e a Capacidade Nominal da fonte escolhida.',
    relatedIds: ['placa', 'video', 'cpu'],
    workbenchFilterCategory: 'psu'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-mb-1',
    componentId: 'placa',
    question:
      'Uma placa-mãe possui o socket Intel LGA1700. O que determina se você deve comprar memória RAM DDR4 ou DDR5 para ela?',
    options: [
      {
        id: 'a',
        text: 'Apenas o processador Intel escolhido, pois qualquer placa LGA1700 aceita os dois tipos no mesmo slot.',
        isCorrect: false,
        explanation:
          'Incorreto. Embora o processador Intel de 12ª a 14ª geração tenha controlador híbrido, os slots físicos da placa-mãe são construídos exclusivamente para DDR4 ou exclusivamente para DDR5.'
      },
      {
        id: 'b',
        text: 'O modelo específico da placa-mãe, pois os slots físicos DDR4 e DDR5 possuem chanfros e pinagens incompatíveis entre si.',
        isCorrect: true,
        explanation:
          'Correto! O socket LGA1700 define o encaixe da CPU, mas é o projeto físico da placa-mãe que define se os slots DIMM instalados nela são padrão DDR4 ou DDR5.'
      },
      {
        id: 'c',
        text: 'A potência da fonte de alimentação conectada à placa-mãe.',
        isCorrect: false,
        explanation:
          'Incorreto. A fonte fornece energia para o sistema, mas não altera o formato físico nem o protocolo dos slots de memória da placa-mãe.'
      }
    ]
  },
  {
    id: 'q-cpu-1',
    componentId: 'cpu',
    question:
      'Qual é a consequência técnica imediata de tentar ligar um computador com o processador instalado, mas sem pasta térmica e sem cooler?',
    options: [
      {
        id: 'a',
        text: 'O processador aquece rapidamente acima do limite seguro, acionando proteção térmica ou desligamento de emergência.',
        isCorrect: true,
        explanation:
          'Correto! Sem dissipador e interface térmica, o calor concentrado no chip sobe em poucos segundos, impedindo a operação estável do computador.'
      },
      {
        id: 'b',
        text: 'O computador funciona normalmente em tarefas leves, precisando do cooler apenas em jogos pesados.',
        isCorrect: false,
        explanation:
          'Incorreto. Mesmo durante a tela inicial (BIOS/POST), um processador moderno sem dissipador atinge temperaturas críticas rapidamente.'
      },
      {
        id: 'c',
        text: 'A memória RAM assume a refrigeração do processador através das trilhas da placa-mãe.',
        isCorrect: false,
        explanation:
          'Incorreto. A memória RAM não tem função de dissipação térmica para o processador.'
      }
    ]
  },
  {
    id: 'q-cooler-1',
    componentId: 'cooler',
    question:
      'Por que jamais devemos utilizar cola rápida (como Super Bonder) no lugar da pasta térmica entre o processador e o cooler?',
    options: [
      {
        id: 'a',
        text: 'Porque a cola rápida conduz eletricidade demais e aumenta a frequência do processador.',
        isCorrect: false,
        explanation:
          'Incorreto. O cianoacrilato não aumenta frequência; pelo contrário, prejudica gravemente a transferência térmica.'
      },
      {
        id: 'b',
        text: 'Porque o adesivo age como isolante térmico, impede a dissipação de calor e cola fisicamente o cooler à CPU.',
        isCorrect: true,
        explanation:
          'Correto! A pasta térmica existe para preencher microcavidades conduzindo calor e permitindo manutenção futura. Adesivos bloqueiam a passagem de calor e inutilizam a montagem.'
      },
      {
        id: 'c',
        text: 'Porque só pode ser usado em processadores de baixo consumo.',
        isCorrect: false,
        explanation:
          'Incorreto. Adesivos químicos nunca devem ser aplicados em nenhum tipo de processador.'
      }
    ]
  },
  {
    id: 'q-ram-1',
    componentId: 'ram',
    question:
      'Qual é a principal diferença funcional entre a Memória RAM (16 GB) e o SSD (1 TB) durante o uso do computador?',
    options: [
      {
        id: 'a',
        text: 'A RAM é uma memória temporária ultrarrápida para programas abertos agora; o SSD guarda arquivos permanentemente mesmo desligado.',
        isCorrect: true,
        explanation:
          'Correto! A RAM é volátil e trabalha diretamente com a CPU em altíssima velocidade, enquanto o SSD é não-volátil e preserva seus arquivos e o sistema operacional.'
      },
      {
        id: 'b',
        text: 'A RAM guarda as fotos e jogos quando o PC é desligado da tomada, enquanto o SSD é apagado ao reiniciar.',
        isCorrect: false,
        explanation:
          'Incorreto. É exatamente o oposto: a RAM perde os dados sem energia (volátil) e o SSD os mantém (não-volátil).'
      },
      {
        id: 'c',
        text: 'Ambos fazem a mesma função e podem ser encaixados no mesmo slot DIMM.',
        isCorrect: false,
        explanation:
          'Incorreto. Possuem funções, velocidades e conectores físicos totalmente distintos.'
      }
    ]
  },
  {
    id: 'q-ssd-1',
    componentId: 'ssd',
    question:
      'Onde e como devem ser instalados um SSD NVMe M.2 e um SSD SATA de 2,5 polegadas, respectivamente?',
    options: [
      {
        id: 'a',
        text: 'O SSD M.2 é conectado direto no slot M.2 da placa-mãe; o SSD SATA 2,5" vai na baia do gabinete conectado por cabos SATA.',
        isCorrect: true,
        explanation:
          'Correto! O formato M.2 dispensa cabos e encaixa paralelo à placa-mãe, enquanto o formato 2,5" fica fixado no chassi do gabinete usando cabo de dados SATA e energia da fonte.'
      },
      {
        id: 'b',
        text: 'Ambos são encaixados diretamente dentro do slot M.2 da placa-mãe.',
        isCorrect: false,
        explanation:
          'Incorreto. Um SSD SATA 2,5" é uma unidade muito maior e possui conectores SATA, sendo fisicamente impossível encaixá-lo em um slot M.2.'
      },
      {
        id: 'c',
        text: 'No slot PCIe x16 no lugar da placa de vídeo.',
        isCorrect: false,
        explanation:
          'Incorreto. O slot PCIe x16 principal é destinado à placa de vídeo.'
      }
    ]
  },
  {
    id: 'q-psu-1',
    componentId: 'fonte',
    question:
      'Um computador possui consumo estimado total de 340 W em carga contínua, utilizando um processador de 125 W e uma GPU de 170 W sujeitos a picos transitórios. Como avaliar a escolha da fonte?',
    options: [
      {
        id: 'a',
        text: 'Qualquer fonte de 350 W é ideal, pois 350 é maior que 340.',
        isCorrect: false,
        explanation:
          'Incorreto. Operar a fonte no limite máximo (97% de carga) não deixa margem para picos transitórios de CPU/GPU, reduz a eficiência e pode causar desligamentos.'
      },
      {
        id: 'b',
        text: 'Deve-se considerar o consumo total somado à margem operacional recomendada (~25% a 30%) e conectores PCIe necessários, tornando uma fonte de 650 W 80 Plus Bronze muito mais segura.',
        isCorrect: true,
        explanation:
          'Correto! O dimensionamento técnico considera todas as cargas do sistema mais uma folga segura de operação e disponibilidade de cabos PCIe dedicados.'
      },
      {
        id: 'c',
        text: 'A fonte deve ser encaixada diretamente sobre o socket da placa-mãe para perder menos energia.',
        isCorrect: false,
        explanation:
          'Incorreto. A fonte fica alojada no compartimento próprio do gabinete e alimenta a placa-mãe através de cabos.'
      }
    ]
  }
];

export const AUDIT_FIXES_REPORT = [
  {
    id: 1,
    issue: 'Validação incorreta de ocupação dos slots (target.children.length > 1)',
    fix: 'Substituída pela máquina de estados centralizada: cada slot valida explicitamente se já possui um componente alocado no objeto de estado antes de aceitar nova instalação.'
  },
  {
    id: 2,
    issue: 'Contabilização de parafusos em destinos indevidos',
    fix: 'Parafusos agora exigem estritamente um alvo do tipo screw-hole (screw-hole-1 a screw-hole-4) ainda não preenchido, rejeitando qualquer tentativa em slots de componentes.'
  },
  {
    id: 3,
    issue: 'Tratamento especial do cooler que contornava verificações de destino',
    fix: 'O cooler só pode ser instalado no slot de refrigeração da CPU após verificar que (1) a CPU está instalada, (2) a pasta térmica correta foi aplicada e (3) o suporte do cooler é compatível com o socket da placa-mãe.'
  },
  {
    id: 4,
    issue: 'Compatibilidade fixa com AM4 e DDR4 que inutilizava metade do inventário',
    fix: 'Implementado seletor de plataforma de Placa-Mãe (AMD AM4 + DDR4 e Intel LGA1700 + DDR5), permitindo utilizar e testar todas as CPUs, coolers e memórias do inventário.'
  },
  {
    id: 5,
    issue: 'Ausência de remoção e correção de peças instaladas (inclusive após aplicar Super Bonder)',
    fix: 'Adicionada desinstalação de peças com respeito às dependências físicas (ex.: remover cooler antes da CPU) e procedimento educativo de limpeza com álcool isopropílico caso Super Bonder seja aplicado.'
  },
  {
    id: 6,
    issue: 'Comportamento bloqueado ou inconsistente após o término da partida',
    fix: 'Controle explícito do ciclo de vida da sessão (em andamento, inicializando, concluída com sucesso ou pausada para revisão), permitindo inspecionar a montagem ou iniciar nova bancada limpa sem recarregar a página.'
  },
  {
    id: 7,
    issue: 'Cálculo simplificado de consumo elétrico',
    fix: 'Cálculo inclui carga base da placa-mãe/VRM (35–40 W) + CPU + Cooler + RAM + Armazenamento + GPU, diferenciando Consumo Estimado, Margem Recomendada (+25%) e Capacidade Nominal da fonte.'
  },
  {
    id: 8,
    issue: 'Limitação exclusiva a HTML5 Drag and Drop (inacessível em mobile e teclado)',
    fix: 'Sistema multimodal completo: suporta Arrastar e Soltar (Mouse), Clicar na peça e Clicar no slot (Mouse/Toque) e Navegação e Instalação por Teclado (Tab + Enter/Espaço).'
  },
  {
    id: 9,
    issue: 'Relação frágil entre pontuação, estado da montagem e botão de inicialização',
    fix: 'O botão Ligar Computador está sempre acessível para diagnóstico técnico realista, diferenciando sistema incompleto, falha crítica de compatibilidade/refrigeração, subdimensionamento de energia e inicialização (POST) bem-sucedida.'
  },
  {
    id: 10,
    issue: 'Inconsistência visual e de navegação entre biblioteca.html e ferramenta.html',
    fix: 'Arquitetura unificada sob o Design System HardwareDex com cabeçalho consistente, links relativos funcionais, persistência no LocalStorage e consulta rápida da Biblioteca direto da Bancada.'
  }
];
