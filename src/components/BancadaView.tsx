import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Power,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Trash2,
  Info,
  Zap,
  Cpu,
  Sparkles,
  Wrench,
  ShieldAlert,
  Check,
  X,
  HelpCircle,
  ClipboardCheck
} from 'lucide-react';
import {
  INVENTORY_ITEMS,
  MOTHERBOARD_PLATFORMS,
  AUDIT_FIXES_REPORT,
  InventoryItem,
  WorkbenchPartCategory
} from '../data/hardwareData';

export type SlotId =
  | 'slot-cpu'
  | 'slot-thermal'
  | 'slot-cooler'
  | 'slot-ram'
  | 'slot-m2'
  | 'slot-sata'
  | 'slot-gpu'
  | 'slot-psu'
  | 'screw-hole-1'
  | 'screw-hole-2'
  | 'screw-hole-3'
  | 'screw-hole-4';

export interface WorkbenchSlotsState {
  'slot-cpu': string | null;
  'slot-thermal': string | null;
  'slot-cooler': string | null;
  'slot-ram': string | null;
  'slot-m2': string | null;
  'slot-sata': string | null;
  'slot-gpu': string | null;
  'slot-psu': string | null;
  'screw-hole-1': string | null;
  'screw-hole-2': string | null;
  'screw-hole-3': string | null;
  'screw-hole-4': string | null;
}

export interface MistakeRecord {
  id: string;
  timestamp: number;
  title: string;
  explanation: string;
  penalty: number;
}

export interface FeedbackBanner {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  penalty?: number;
  relatedLibraryId?: string;
}

export interface PersistedWorkbenchState {
  platformId: 'AM4_DDR4' | 'LGA1700_DDR5';
  slots: WorkbenchSlotsState;
  score: number;
  elapsedSeconds: number;
  timerRunning: boolean;
  finished: boolean;
  bootStatus: 'idle' | 'booting' | 'success' | 'failed';
  mistakes: MistakeRecord[];
}

const INITIAL_SLOTS: WorkbenchSlotsState = {
  'slot-cpu': null,
  'slot-thermal': null,
  'slot-cooler': null,
  'slot-ram': null,
  'slot-m2': null,
  'slot-sata': null,
  'slot-gpu': null,
  'slot-psu': null,
  'screw-hole-1': null,
  'screw-hole-2': null,
  'screw-hole-3': null,
  'screw-hole-4': null
};

const STORAGE_KEY = 'hardwaredex_workbench_v2';

interface BancadaViewProps {
  onOpenLibraryComponent: (componentId: string) => void;
  initialFilterCategory?: WorkbenchPartCategory | null;
  onClearInitialFilter?: () => void;
}

const CATEGORY_TABS: { id: 'all' | WorkbenchPartCategory; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'cpu', label: 'CPU' },
  { id: 'thermal', label: 'Térmica' },
  { id: 'cooler', label: 'Cooler' },
  { id: 'ram', label: 'RAM' },
  { id: 'storage', label: 'SSD' },
  { id: 'gpu', label: 'GPU' },
  { id: 'psu', label: 'Fonte' },
  { id: 'screw', label: 'Fixação' }
];

export const BancadaView: React.FC<BancadaViewProps> = ({
  onOpenLibraryComponent,
  initialFilterCategory,
  onClearInitialFilter
}) => {
  const [state, setState] = useState<PersistedWorkbenchState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.slots && parsed.platformId) {
          return {
            ...parsed,
            bootStatus: parsed.bootStatus === 'booting' ? 'idle' : parsed.bootStatus || 'idle'
          };
        }
      }
    } catch {
      // Fallback to default state
    }
    return {
      platformId: 'AM4_DDR4',
      slots: { ...INITIAL_SLOTS },
      score: 250,
      elapsedSeconds: 0,
      timerRunning: false,
      finished: false,
      bootStatus: 'idle',
      mistakes: []
    };
  });

  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [inventoryCategory, setInventoryCategory] = useState<'all' | WorkbenchPartCategory>(
    initialFilterCategory || 'all'
  );
  const [feedback, setFeedback] = useState<FeedbackBanner | null>(null);
  const [mobilePanel, setMobilePanel] = useState<'inventory' | 'stage' | 'diagnostics'>('stage');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [bootDiagnosticModal, setBootDiagnosticModal] = useState<{
    open: boolean;
    issues: { title: string; detail: string; libraryId: string }[];
  }>({ open: false, issues: [] });
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  // Prevenir punição duplicada por clique acidental repetido na mesma ação em < 2.5s
  const lastErrorSignatureRef = useRef<{ sig: string; time: number }>({ sig: '', time: 0 });

  useEffect(() => {
    if (initialFilterCategory) {
      setInventoryCategory(initialFilterCategory);
      if (onClearInitialFilter) onClearInitialFilter();
    }
  }, [initialFilterCategory, onClearInitialFilter]);

  // Salvar estado no LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  // Cronômetro único e determinístico
  useEffect(() => {
    if (!state.timerRunning || state.finished) return;
    const interval = window.setInterval(() => {
      setState((prev) => {
        if (!prev.timerRunning || prev.finished) return prev;
        return { ...prev, elapsedSeconds: prev.elapsedSeconds + 1 };
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [state.timerRunning, state.finished]);

  const platform = MOTHERBOARD_PLATFORMS[state.platformId];

  const getItem = useCallback((id: string | null): InventoryItem | null => {
    if (!id) return null;
    return INVENTORY_ITEMS.find((item) => item.id === id) || null;
  }, []);

  const installedIds = useMemo(() => {
    return Object.values(state.slots).filter((v): v is string => Boolean(v));
  }, [state.slots]);

  const screwsInstalledCount = useMemo(() => {
    return (
      (state.slots['screw-hole-1'] ? 1 : 0) +
      (state.slots['screw-hole-2'] ? 1 : 0) +
      (state.slots['screw-hole-3'] ? 1 : 0) +
      (state.slots['screw-hole-4'] ? 1 : 0)
    );
  }, [state.slots]);

  // Cálculo detalhado de energia
  const powerMetrics = useMemo(() => {
    const cpuItem = getItem(state.slots['slot-cpu']);
    const coolerItem = getItem(state.slots['slot-cooler']);
    const ramItem = getItem(state.slots['slot-ram']);
    const m2Item = getItem(state.slots['slot-m2']);
    const sataItem = getItem(state.slots['slot-sata']);
    const gpuItem = getItem(state.slots['slot-gpu']);
    const psuItem = getItem(state.slots['slot-psu']);

    const hasAnyComponent = Boolean(
      cpuItem || coolerItem || ramItem || m2Item || sataItem || gpuItem || psuItem
    );

    const mbLoad = hasAnyComponent ? platform.baseWatts : 0;
    const cpuWatts = cpuItem?.watts || 0;
    const coolerWatts = coolerItem?.watts || 0;
    const ramWatts = ramItem?.watts || 0;
    const storageWatts = (m2Item?.watts || 0) + (sataItem?.watts || 0);
    const gpuWatts = gpuItem?.watts || 0;

    const estimatedContinuousWatts =
      mbLoad + cpuWatts + coolerWatts + ramWatts + storageWatts + gpuWatts;

    // Margem operacional recomendada de 30% para picos transitórios e eficiência
    const recommendedMinPsuWatts = Math.ceil((estimatedContinuousWatts * 1.3) / 10) * 10;
    const nominalPsuWatts = psuItem?.maxWatts || 0;

    let powerStatus: 'none' | 'optimal' | 'tight' | 'overload' = 'none';
    let powerStatusNote = 'Instale uma fonte de alimentação para avaliar a capacidade.';

    if (psuItem) {
      if (nominalPsuWatts < estimatedContinuousWatts) {
        powerStatus = 'overload';
        powerStatusNote = `Capacidade nominal (${nominalPsuWatts} W) inferior ao consumo contínuo estimado (${estimatedContinuousWatts} W).`;
      } else if (nominalPsuWatts < recommendedMinPsuWatts) {
        powerStatus = 'tight';
        powerStatusNote = `Fonte de ${nominalPsuWatts} W opera sem a margem recomendada (${recommendedMinPsuWatts} W) para absorver picos transitórios desta combinação CPU + GPU.`;
      } else {
        powerStatus = 'optimal';
        powerStatusNote = `Dimensionamento seguro: ${nominalPsuWatts} W cobre o consumo (${estimatedContinuousWatts} W) e a margem recomendada (${recommendedMinPsuWatts} W).`;
      }
    }

    return {
      mbLoad,
      cpuWatts,
      coolerWatts,
      ramWatts,
      storageWatts,
      gpuWatts,
      estimatedContinuousWatts,
      recommendedMinPsuWatts,
      nominalPsuWatts,
      psuItem,
      powerStatus,
      powerStatusNote
    };
  }, [state.slots, platform.baseWatts, getItem]);

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const registerPenalty = useCallback(
    (
      signature: string,
      title: string,
      explanation: string,
      penalty: number,
      relatedLibraryId?: string
    ) => {
      const now = Date.now();
      const isDuplicateAccident =
        lastErrorSignatureRef.current.sig === signature &&
        now - lastErrorSignatureRef.current.time < 2500;

      lastErrorSignatureRef.current = { sig: signature, time: now };

      const appliedPenalty = isDuplicateAccident ? 0 : penalty;

      setFeedback({
        type: 'error',
        title,
        message: explanation,
        penalty: appliedPenalty,
        relatedLibraryId
      });

      if (!isDuplicateAccident && penalty > 0) {
        setState((prev) => {
          const nextScore = Math.max(0, prev.score - penalty);
          const newMistake: MistakeRecord = {
            id: `${now}-${Math.random().toString(36).slice(2, 6)}`,
            timestamp: prev.elapsedSeconds,
            title,
            explanation,
            penalty
          };
          return {
            ...prev,
            timerRunning: true,
            score: nextScore,
            mistakes: [newMistake, ...prev.mistakes]
          };
        });
      }
    },
    []
  );

  // Trocar plataforma da placa-mãe
  const handleSelectPlatform = (newPlatformId: 'AM4_DDR4' | 'LGA1700_DDR5') => {
    if (newPlatformId === state.platformId) return;
    setSelectedPartId(null);
    setState({
      platformId: newPlatformId,
      slots: { ...INITIAL_SLOTS },
      score: 250,
      elapsedSeconds: 0,
      timerRunning: false,
      finished: false,
      bootStatus: 'idle',
      mistakes: []
    });
    setFeedback({
      type: 'info',
      title: `Plataforma alterada para ${MOTHERBOARD_PLATFORMS[newPlatformId].name}`,
      message: MOTHERBOARD_PLATFORMS[newPlatformId].recommendedNotes,
      relatedLibraryId: 'placa'
    });
  };

  // Reiniciar bancada
  const handleResetWorkbench = () => {
    setSelectedPartId(null);
    setReportModalOpen(false);
    setBootDiagnosticModal({ open: false, issues: [] });
    setState((prev) => ({
      platformId: prev.platformId,
      slots: { ...INITIAL_SLOTS },
      score: 250,
      elapsedSeconds: 0,
      timerRunning: false,
      finished: false,
      bootStatus: 'idle',
      mistakes: []
    }));
    setFeedback({
      type: 'info',
      title: 'Bancada reiniciada',
      message: 'Todos os componentes retornaram ao inventário e o diagnóstico foi zerado.'
    });
  };

  // Remover ou corrigir componente instalado
  const handleRemoveFromSlot = (slotId: SlotId) => {
    if (state.finished) {
      setState((prev) => ({ ...prev, finished: false, bootStatus: 'idle' }));
    }

    const currentItemId = state.slots[slotId];
    if (!currentItemId) return;
    const item = getItem(currentItemId);

    // Dependências físicas reais
    if (slotId === 'slot-cpu') {
      if (state.slots['slot-cooler']) {
        setFeedback({
          type: 'warning',
          title: 'Remoção bloqueada por dependência física',
          message:
            'Para remover o processador (CPU), você precisa primeiro retirar o Cooler que está travado sobre ele.',
          relatedLibraryId: 'cooler'
        });
        return;
      }
      if (state.slots['slot-thermal']) {
        setFeedback({
          type: 'warning',
          title: 'Limpe a interface térmica antes de remover a CPU',
          message:
            'Remova primeiro a camada aplicada sobre o processador antes de abrir a alavanca do socket.',
          relatedLibraryId: 'cpu'
        });
        return;
      }
    }

    if (slotId === 'slot-thermal' && state.slots['slot-cooler']) {
      setFeedback({
        type: 'warning',
        title: 'Cooler instalado sobre a interface térmica',
        message: 'Retire primeiro o Cooler antes de limpar ou substituir a pasta térmica.',
        relatedLibraryId: 'cooler'
      });
      return;
    }

    setState((prev) => ({
      ...prev,
      slots: {
        ...prev.slots,
        [slotId]: null
      }
    }));

    if (currentItemId === 'pasta-errada') {
      setFeedback({
        type: 'success',
        title: 'Superfície limpa com Álcool Isopropílico',
        message:
          'O resíduo de Super Bonder foi removido com segurança do difusor térmico da CPU. Agora você pode aplicar a Pasta Térmica correta.',
        relatedLibraryId: 'cooler'
      });
    } else {
      setFeedback({
        type: 'info',
        title: `${item?.name || 'Componente'} removido`,
        message: 'A peça retornou para o inventário e o slot está livre.'
      });
    }
  };

  // Validação e instalação centralizada (Máquina de Estados)
  const attemptInstallPart = useCallback(
    (partId: string, targetSlot: SlotId) => {
      if (state.finished) {
        setFeedback({
          type: 'info',
          title: 'Montagem já finalizada',
          message: 'Clique em "Nova Montagem" ou remova uma peça para continuar editando.'
        });
        return;
      }

      const part = getItem(partId);
      if (!part) return;

      // Impedir duplicação da mesma peça física
      if (installedIds.includes(part.id)) {
        setFeedback({
          type: 'warning',
          title: 'Componente já instalado',
          message: `${part.name} já está instalado na bancada.`
        });
        return;
      }

      // 1. Parafusos de fixação
      if (part.category === 'screw') {
        if (!targetSlot.startsWith('screw-hole-')) {
          registerPenalty(
            `screw-wrong-target-${targetSlot}`,
            'Local incorreto para parafuso',
            'Parafusos M3 servem exclusivamente para fixar os 4 cantos da placa-mãe aos espaçadores do gabinete.',
            10,
            'placa'
          );
          return;
        }
        if (state.slots[targetSlot]) {
          registerPenalty(
            `screw-occupied-${targetSlot}`,
            'Ponto de fixação já ocupado',
            'Este espaçador já possui um parafuso instalado. Escolha um dos outros cantos livres da placa-mãe.',
            5,
            'placa'
          );
          return;
        }

        setState((prev) => ({
          ...prev,
          timerRunning: true,
          slots: { ...prev.slots, [targetSlot]: part.id }
        }));
        setSelectedPartId(null);
        setFeedback({
          type: 'success',
          title: `${part.name} fixado`,
          message: `Placa-mãe ancorada no espaçador (${screwsInstalledCount + 1}/4 parafusos instalados).`
        });
        return;
      }

      // Impedir que qualquer peça não-parafuso vá para um furo de parafuso
      if (targetSlot.startsWith('screw-hole-')) {
        registerPenalty(
          `${part.id}-in-screw-hole`,
          'Encaixe fisicamente impossível',
          `Os furos nos cantos da placa-mãe aceitam apenas os parafusos M3 de fixação, não ${part.name}.`,
          10,
          'placa'
        );
        return;
      }

      // 2. Processador (CPU)
      if (part.category === 'cpu') {
        if (targetSlot !== 'slot-cpu') {
          registerPenalty(
            `${part.id}-wrong-slot-${targetSlot}`,
            'Slot incorreto para o Processador',
            'O processador (CPU) deve ser instalado exclusivamente no Socket central da placa-mãe.',
            15,
            'cpu'
          );
          return;
        }
        if (state.slots['slot-cpu']) {
          registerPenalty(
            'cpu-slot-occupied',
            'Socket da CPU já ocupado',
            'Já existe um processador instalado no socket. Remova-o primeiro se desejar substituí-lo.',
            10,
            'cpu'
          );
          return;
        }
        if (part.socket !== platform.socket) {
          registerPenalty(
            `cpu-socket-mismatch-${part.id}-${platform.id}`,
            `Incompatibilidade de Socket (${part.socket} vs ${platform.socket})`,
            `O ${part.name} utiliza o socket ${part.socket}, mas a placa-mãe selecionada possui socket ${platform.socket}. A pinagem física e elétrica é incompatível.`,
            20,
            'cpu'
          );
          return;
        }

        setState((prev) => ({
          ...prev,
          timerRunning: true,
          slots: { ...prev.slots, 'slot-cpu': part.id }
        }));
        setSelectedPartId(null);
        setFeedback({
          type: 'success',
          title: `${part.name} instalado no Socket ${platform.socket}`,
          message:
            'Próxima etapa recomendada: aplique a Pasta Térmica sobre o difusor metálico da CPU antes de instalar o Cooler.'
        });
        return;
      }

      // 3. Interface Térmica (Pasta Térmica / Super Bonder)
      if (part.category === 'thermal') {
        if (
          targetSlot !== 'slot-thermal' &&
          targetSlot !== 'slot-cpu' &&
          targetSlot !== 'slot-cooler'
        ) {
          registerPenalty(
            `${part.id}-wrong-slot-${targetSlot}`,
            'Local incorreto para Interface Térmica',
            'A pasta térmica deve ser aplicada diretamente sobre o processador instalado no socket.',
            10,
            'cooler'
          );
          return;
        }
        if (!state.slots['slot-cpu']) {
          registerPenalty(
            `${part.id}-no-cpu`,
            'CPU ainda não instalada',
            'Nunca aplique pasta térmica no socket vazio! Instale o processador primeiro e aplique sobre a tampa metálica dele.',
            15,
            'cpu'
          );
          return;
        }
        if (state.slots['slot-thermal']) {
          registerPenalty(
            'thermal-already-applied',
            'Interface térmica já aplicada',
            'Já existe um material aplicado sobre a CPU. Limpe-o primeiro caso precise corrigir.',
            5,
            'cooler'
          );
          return;
        }

        if (part.isInvalidMaterial) {
          // Super Bonder aplicado: registra no estado para permitir limpeza educativa!
          setState((prev) => ({
            ...prev,
            timerRunning: true,
            slots: { ...prev.slots, 'slot-thermal': part.id }
          }));
          setSelectedPartId(null);
          registerPenalty(
            'super-bonder-applied',
            'Material Inadequado Aplicado (Super Bonder!)',
            'Adesivo cianoacrilato age como isolante térmico e cola o cooler na CPU! Use o botão "Limpar com Álcool Isopropílico" no slot da CPU para corrigir o erro.',
            30,
            'cooler'
          );
          return;
        }

        setState((prev) => ({
          ...prev,
          timerRunning: true,
          slots: { ...prev.slots, 'slot-thermal': part.id }
        }));
        setSelectedPartId(null);
        setFeedback({
          type: 'success',
          title: 'Pasta Térmica aplicada corretamente',
          message:
            'Uma fina camada condutiva agora preenche as micro-imperfeições. Agora você pode instalar o Cooler compatível.'
        });
        return;
      }

      // 4. Cooler
      if (part.category === 'cooler') {
        if (
          targetSlot !== 'slot-cooler' &&
          targetSlot !== 'slot-thermal' &&
          targetSlot !== 'slot-cpu'
        ) {
          registerPenalty(
            `${part.id}-wrong-slot-${targetSlot}`,
            'Local incorreto para o Cooler',
            'O Cooler do processador deve ser instalado na região de fixação sobre o socket da CPU.',
            15,
            'cooler'
          );
          return;
        }
        if (!state.slots['slot-cpu']) {
          registerPenalty(
            `${part.id}-no-cpu`,
            'Processador ausente',
            'Instale o processador e aplique a pasta térmica antes de montar o Cooler.',
            15,
            'cpu'
          );
          return;
        }
        if (!state.slots['slot-thermal']) {
          registerPenalty(
            `${part.id}-no-paste`,
            'Pasta térmica não aplicada!',
            'Instalar o cooler diretamente no metal seco deixa microbolhas de ar que causam superaquecimento. Aplique a Pasta Térmica antes do Cooler.',
            15,
            'cooler'
          );
          return;
        }
        if (state.slots['slot-thermal'] === 'pasta-errada') {
          registerPenalty(
            `${part.id}-over-superbonder`,
            'Superfície contaminada com Super Bonder',
            'Não instale o cooler sobre cola! Limpe o Super Bonder e aplique Pasta Térmica primeiro.',
            15,
            'cooler'
          );
          return;
        }
        if (state.slots['slot-cooler']) {
          registerPenalty(
            'cooler-already-installed',
            'Cooler já instalado',
            'Já existe um cooler montado sobre o processador.',
            10,
            'cooler'
          );
          return;
        }
        if (part.socket !== platform.socket) {
          registerPenalty(
            `cooler-socket-mismatch-${part.id}-${platform.id}`,
            `Suporte do Cooler incompatível (${part.socket} vs ${platform.socket})`,
            `O ${part.name} possui furação para o socket ${part.socket}, não alinhando com os pontos de ancoragem da placa-mãe ${platform.socket}.`,
            20,
            'cooler'
          );
          return;
        }

        setState((prev) => ({
          ...prev,
          timerRunning: true,
          slots: { ...prev.slots, 'slot-cooler': part.id }
        }));
        setSelectedPartId(null);
        setFeedback({
          type: 'success',
          title: `${part.name} instalado e conectado ao CPU_FAN`,
          message: 'O conjunto térmico (CPU + Pasta Térmica + Dissipador Ativo) está completo.'
        });
        return;
      }

      // 5. Memória RAM
      if (part.category === 'ram') {
        if (targetSlot !== 'slot-ram') {
          registerPenalty(
            `${part.id}-wrong-slot-${targetSlot}`,
            'Slot incorreto para Memória RAM',
            'Módulos de memória RAM devem ser instalados nos slots verticais DIMM da placa-mãe.',
            15,
            'ram'
          );
          return;
        }
        if (state.slots['slot-ram']) {
          registerPenalty(
            'ram-slot-occupied',
            'Slot DIMM já ocupado',
            'Já existe um módulo de memória instalado neste canal.',
            10,
            'ram'
          );
          return;
        }
        if (part.memoryType !== platform.memoryType) {
          registerPenalty(
            `ram-type-mismatch-${part.id}-${platform.id}`,
            `Memória ${part.memoryType} incompatível com slot ${platform.memoryType}`,
            `Esta placa-mãe utiliza slots físicos padrão ${platform.memoryType}. O módulo ${part.name} (${part.memoryType}) possui chanfro em posição diferente e tensão incompatível.`,
            20,
            'ram'
          );
          return;
        }

        setState((prev) => ({
          ...prev,
          timerRunning: true,
          slots: { ...prev.slots, 'slot-ram': part.id }
        }));
        setSelectedPartId(null);
        setFeedback({
          type: 'success',
          title: `${part.name} instalada no slot DIMM`,
          message: `Travas laterais fechadas com sucesso. Memória ${part.memoryType} pronta para operação.`
        });
        return;
      }

      // 6. Armazenamento (SSD M.2 NVMe vs SSD SATA 2,5")
      if (part.category === 'storage') {
        if (part.storageInterface === 'M.2_NVME') {
          if (targetSlot === 'slot-sata') {
            registerPenalty(
              'm2-in-sata-bay',
              'Interface incompatível para SSD M.2',
              'Um SSD NVMe M.2 não utiliza cabos SATA na baia de 2,5" — ele deve ser encaixado diretamente no conector M.2 da placa-mãe.',
              20,
              'ssd'
            );
            return;
          }
          if (targetSlot !== 'slot-m2') {
            registerPenalty(
              `m2-wrong-slot-${targetSlot}`,
              'Slot incorreto para SSD M.2',
              'Instale o SSD NVMe M.2 no conector horizontal M.2 localizado na placa-mãe.',
              15,
              'ssd'
            );
            return;
          }
          if (state.slots['slot-m2']) {
            registerPenalty(
              'm2-occupied',
              'Slot M.2 já ocupado',
              'Já existe um SSD M.2 instalado neste conector.',
              10,
              'ssd'
            );
            return;
          }

          setState((prev) => ({
            ...prev,
            timerRunning: true,
            slots: { ...prev.slots, 'slot-m2': part.id }
          }));
          setSelectedPartId(null);
          setFeedback({
            type: 'success',
            title: `${part.name} instalado no slot M.2 PCIe`,
            message:
              'Unidade NVMe conectada diretamente ao barramento PCIe da placa-mãe sem necessidade de cabos.'
          });
          return;
        }

        if (part.storageInterface === 'SATA_25') {
          if (targetSlot === 'slot-m2') {
            registerPenalty(
              'sata-in-m2-slot',
              'SSD SATA 2,5" não encaixa no conector M.2!',
              'O SSD SATA de 2,5 polegadas possui formato de gabinete maior e conectores SATA. Instale-o na Baia 2,5" SATA do gabinete (à direita da placa-mãe).',
              25,
              'ssd'
            );
            return;
          }
          if (targetSlot !== 'slot-sata') {
            registerPenalty(
              `sata-wrong-slot-${targetSlot}`,
              'Local incorreto para SSD SATA 2,5"',
              'O SSD SATA de 2,5" deve ser montado na Baia 2,5" do Gabinete e ligado por cabo SATA.',
              15,
              'ssd'
            );
            return;
          }
          if (state.slots['slot-sata']) {
            registerPenalty(
              'sata-occupied',
              'Baia SATA 2,5" já ocupada',
              'Já existe uma unidade de 2,5" instalada nesta baia.',
              10,
              'ssd'
            );
            return;
          }

          setState((prev) => ({
            ...prev,
            timerRunning: true,
            slots: { ...prev.slots, 'slot-sata': part.id }
          }));
          setSelectedPartId(null);
          setFeedback({
            type: 'success',
            title: `${part.name} instalado na Baia 2,5" do Gabinete`,
            message:
              'Cabo de dados SATA III conectado à placa-mãe e conector de alimentação SATA preparado.'
          });
          return;
        }
      }

      // 7. Placa de Vídeo (GPU)
      if (part.category === 'gpu') {
        if (targetSlot !== 'slot-gpu') {
          registerPenalty(
            `${part.id}-wrong-slot-${targetSlot}`,
            'Slot incorreto para a Placa de Vídeo',
            'A Placa de Vídeo dedicada (GPU) deve ser instalada no barramento longo PCIe x16 da placa-mãe.',
            15,
            'video'
          );
          return;
        }
        if (state.slots['slot-gpu']) {
          registerPenalty(
            'gpu-slot-occupied',
            'Slot PCIe x16 já ocupado',
            'Já existe uma placa de vídeo instalada no slot PCIe x16. Remova-a caso queira testar outro modelo.',
            10,
            'video'
          );
          return;
        }

        setState((prev) => ({
          ...prev,
          timerRunning: true,
          slots: { ...prev.slots, 'slot-gpu': part.id }
        }));
        setSelectedPartId(null);
        setFeedback({
          type: 'success',
          title: `${part.name} instalada no slot PCIe 4.0 x16`,
          message: `Demanda estimada de +${part.watts} W adicionada ao sistema. Certifique-se de que a Fonte de Alimentação comporte a carga total com folga.`
        });
        return;
      }

      // 8. Fonte de Alimentação (PSU)
      if (part.category === 'psu') {
        if (targetSlot !== 'slot-psu') {
          registerPenalty(
            `${part.id}-wrong-slot-${targetSlot}`,
            'A Fonte não é instalada na placa-mãe!',
            'A Fonte de Alimentação (PSU) deve ser instalada exclusivamente no Compartimento Inferior do Gabinete (PSU Shroud), conectando-se à placa apenas por cabos.',
            15,
            'fonte'
          );
          return;
        }
        if (state.slots['slot-psu']) {
          registerPenalty(
            'psu-slot-occupied',
            'Compartimento da Fonte já ocupado',
            'Já existe uma fonte instalada no gabinete. Remova-a se desejar trocar a potência.',
            10,
            'fonte'
          );
          return;
        }

        setState((prev) => ({
          ...prev,
          timerRunning: true,
          slots: { ...prev.slots, 'slot-psu': part.id }
        }));
        setSelectedPartId(null);
        setFeedback({
          type: 'success',
          title: `${part.name} (${part.efficiencyRating}) instalada no Gabinete`,
          message:
            'Cabos principais ATX 24-pin, EPS 8-pin (CPU) e PCIe encaminhados. Verifique no painel à direita a relação entre Consumo Estimado e Margem Recomendada.'
        });
        return;
      }
    },
    [state.finished, state.slots, installedIds, platform, getItem, registerPenalty, screwsInstalledCount]
  );

  // Determinar qual slot de destino é recomendado para a peça atualmente selecionada
  const highlightedSlots = useMemo((): SlotId[] => {
    const part = getItem(selectedPartId);
    if (!part) return [];
    switch (part.category) {
      case 'cpu':
        return ['slot-cpu'];
      case 'thermal':
        return ['slot-thermal', 'slot-cpu'];
      case 'cooler':
        return ['slot-cooler', 'slot-cpu'];
      case 'ram':
        return ['slot-ram'];
      case 'storage':
        return part.storageInterface === 'M.2_NVME' ? ['slot-m2'] : ['slot-sata'];
      case 'gpu':
        return ['slot-gpu'];
      case 'psu':
        return ['slot-psu'];
      case 'screw':
        return (
          ['screw-hole-1', 'screw-hole-2', 'screw-hole-3', 'screw-hole-4'] as SlotId[]
        ).filter((s) => !state.slots[s]);
      default:
        return [];
    }
  }, [selectedPartId, getItem, state.slots]);

  // Diagnóstico completo ao clicar em "Ligar Computador"
  const handlePowerButton = () => {
    if (state.finished) {
      setReportModalOpen(true);
      return;
    }

    const issues: { title: string; detail: string; libraryId: string }[] = [];

    // 1. CPU
    if (!state.slots['slot-cpu']) {
      issues.push({
        title: 'Processador (CPU) ausente',
        detail: `O socket ${platform.socket} está vazio. Sem a Unidade Central de Processamento, a placa-mãe não consegue iniciar o POST.`,
        libraryId: 'cpu'
      });
    }

    // 2. Pasta Térmica
    if (!state.slots['slot-thermal']) {
      issues.push({
        title: 'Interface térmica ausente',
        detail:
          'A pasta térmica não foi aplicada sobre o processador. Sem ela, o ar retido nas microcavidades impede a transferência de calor para o cooler.',
        libraryId: 'cooler'
      });
    } else if (state.slots['slot-thermal'] === 'pasta-errada') {
      issues.push({
        title: 'Contaminação térmica por Super Bonder',
        detail:
          'Foi aplicado adesivo cianoacrilato sobre a CPU em vez de pasta térmica. Limpe a superfície com álcool isopropílico e aplique Pasta Térmica.',
        libraryId: 'cooler'
      });
    }

    // 3. Cooler
    if (!state.slots['slot-cooler']) {
      issues.push({
        title: 'Sistema de refrigeração (Cooler) ausente',
        detail:
          'Nenhum cooler foi instalado sobre o processador. A proteção térmica da placa-mãe (CPU_FAN error / Overtemperature) bloqueia a operação para evitar danos.',
        libraryId: 'cooler'
      });
    }

    // 4. Memória RAM
    if (!state.slots['slot-ram']) {
      issues.push({
        title: 'Memória RAM não instalada',
        detail: `Os slots DIMM ${platform.memoryType} estão vazios. O computador exige memória volátil para carregar instruções durante o boot (DRAM LED ativo).`,
        libraryId: 'ram'
      });
    }

    // 5. Armazenamento (M.2 ou SATA)
    if (!state.slots['slot-m2'] && !state.slots['slot-sata']) {
      issues.push({
        title: 'Nenhuma unidade de armazenamento detectada',
        detail:
          'Instale pelo menos um SSD NVMe no slot M.2 da placa-mãe ou um SSD SATA 2,5" na baia do gabinete para disponibilizar o sistema operacional.',
        libraryId: 'ssd'
      });
    }

    // 6. Placa de Vídeo (GPU)
    if (!state.slots['slot-gpu']) {
      issues.push({
        title: 'Sem saída de vídeo ativa (VGA LED)',
        detail:
          'Os processadores deste laboratório não possuem gráfico integrado ativo. Instale uma placa de vídeo dedicada (RTX 3060 ou GTX 1660 Super) no slot PCIe x16.',
        libraryId: 'video'
      });
    }

    // 7. Fixação da Placa-Mãe
    if (screwsInstalledCount < 4) {
      issues.push({
        title: `Fixação mecânica incompleta (${screwsInstalledCount}/4 parafusos)`,
        detail:
          'Todos os 4 parafusos M3 nos cantos da placa-mãe devem ser instalados sobre os espaçadores para garantir estabilidade mecânica e aterramento elétrico.',
        libraryId: 'placa'
      });
    }

    // 8. Fonte de Alimentação e Dimensionamento Energético
    if (!state.slots['slot-psu']) {
      issues.push({
        title: 'Fonte de Alimentação (PSU) não instalada',
        detail:
          'O compartimento inferior do gabinete está sem fonte. Nenhum componente recebe corrente contínua (+12V, +5V, +3.3V).',
        libraryId: 'fonte'
      });
    } else if (powerMetrics.powerStatus === 'overload') {
      issues.push({
        title: `Sobrecarga imediata da Fonte (${powerMetrics.estimatedContinuousWatts} W > ${powerMetrics.nominalPsuWatts} W)`,
        detail:
          'O consumo estimado contínuo supera a capacidade nominal da fonte instalada, acionando o desligamento de proteção (OPP).',
        libraryId: 'fonte'
      });
    } else if (powerMetrics.powerStatus === 'tight') {
      issues.push({
        title: `Fonte subdimensionada para a margem operacional (${powerMetrics.nominalPsuWatts} W instalado vs ${powerMetrics.recommendedMinPsuWatts} W recomendados)`,
        detail: `A configuração atual (${getItem(state.slots['slot-cpu'])?.name} + ${getItem(state.slots['slot-gpu'])?.name}) consome ${powerMetrics.estimatedContinuousWatts} W contínuos e exige margem de segurança para picos transitórios. Substitua a Fonte de 450 W pela Fonte de 650 W 80 Plus Bronze.`,
        libraryId: 'fonte'
      });
    }

    if (issues.length > 0) {
      registerPenalty(
        `boot-failed-${issues.map((i) => i.title).join('|')}`,
        'Falha no Diagnóstico de Inicialização (POST)',
        `O computador não pôde inicializar devido a ${issues.length} pendência(s) técnica(s). Revise o diagnóstico detalhado.`,
        25
      );
      setBootDiagnosticModal({ open: true, issues });
      return;
    }

    // Sucesso! Inicia sequência de POST e adiciona bônus de +30 pontos
    setState((prev) => ({
      ...prev,
      finished: true,
      timerRunning: false,
      bootStatus: 'success',
      score: prev.score + 30
    }));
    setFeedback({
      type: 'success',
      title: 'POST concluído — Sistema Inicializado com Sucesso! (+30 pts de bônus)',
      message:
        'Todas as verificações elétricas, térmicas, mecânicas e de protocolo foram aprovadas.'
    });
    setReportModalOpen(true);
  };

  // Filtragem do inventário
  const filteredInventory = useMemo(() => {
    if (inventoryCategory === 'all') return INVENTORY_ITEMS;
    return INVENTORY_ITEMS.filter((item) => item.category === inventoryCategory);
  }, [inventoryCategory]);

  // Verifica se uma peça é compatível com a placa-mãe atual para informação didática
  const getCompatibilityHint = (item: InventoryItem): { compatible: boolean; label: string } => {
    if (item.isInvalidMaterial) {
      return { compatible: false, label: 'Material Inadequado' };
    }
    if (item.socket && item.socket !== platform.socket) {
      return { compatible: false, label: `Requer Socket ${item.socket}` };
    }
    if (item.memoryType && item.memoryType !== platform.memoryType) {
      return { compatible: false, label: `Requer Slot ${item.memoryType}` };
    }
    return { compatible: true, label: 'Compatível com o Chassi/Placa' };
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, partId: string) => {
    e.dataTransfer.setData('text/plain', partId);
    setSelectedPartId(partId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnSlot = (e: React.DragEvent, slotId: SlotId) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain') || selectedPartId;
    if (draggedId) {
      attemptInstallPart(draggedId, slotId);
    }
  };

  const handleSlotClick = (slotId: SlotId) => {
    if (selectedPartId) {
      attemptInstallPart(selectedPartId, slotId);
      return;
    }
  };

  const selectedPart = getItem(selectedPartId);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-5">
      {/* Barra Superior de Configuração da Bancada (Seletor de Plataforma + Auditoria + Reiniciar) */}
      <div className="bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-xl p-4 mb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3979B7] block">
              Arquitetura da Placa-Mãe na Bancada
            </span>
            <p className="text-xs text-[#475569] dark:text-[#A2AFBE]">
              Escolha a plataforma base para praticar diferentes combinações de CPU, Cooler e Memória RAM:
            </p>
          </div>

          <div
            className="flex items-center gap-1 p-1 bg-[#F1F5F9] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542] rounded-lg"
            role="radiogroup"
            aria-label="Selecionar plataforma da placa-mãe"
          >
            {(['AM4_DDR4', 'LGA1700_DDR5'] as const).map((pid) => {
              const p = MOTHERBOARD_PLATFORMS[pid];
              const isCurrent = state.platformId === pid;
              return (
                <button
                  key={pid}
                  type="button"
                  role="radio"
                  aria-checked={isCurrent}
                  onClick={() => handleSelectPlatform(pid)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isCurrent
                      ? 'bg-[#3979B7] text-white shadow-xs'
                      : 'text-[#475569] dark:text-[#A2AFBE] hover:text-[#0F172A] dark:hover:text-[#F2F5F8]'
                  }`}
                >
                  {p.socket} · {p.memoryType}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onOpenLibraryComponent('placa')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F172A] dark:text-[#F2F5F8] bg-[#F8FAFC] dark:bg-[#1C2734] hover:border-[#3979B7] border border-[#E2E8F0] dark:border-[#2A3542] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#3979B7]" />
            <span>Consultar Biblioteca</span>
          </button>

          <button
            type="button"
            onClick={() => setAuditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#475569] dark:text-[#A2AFBE] hover:text-[#0F172A] dark:hover:text-[#F2F5F8] bg-[#F8FAFC] dark:bg-[#1C2734] border border-[#E2E8F0] dark:border-[#2A3542] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <ClipboardCheck className="w-3.5 h-3.5 text-[#3979B7]" />
            <span>Regras Técnicas</span>
          </button>

          <button
            type="button"
            onClick={handleResetWorkbench}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F172A] dark:text-[#F2F5F8] bg-[#F8FAFC] dark:bg-[#1C2734] hover:bg-[#E2E8F0] dark:hover:bg-[#2A3542] border border-[#E2E8F0] dark:border-[#2A3542] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Montagem</span>
          </button>
        </div>
      </div>

      {/* Barra de Feedback Educacional Contextual e Controle de Peça Selecionada */}
      {selectedPart && (
        <div
          role="region"
          aria-live="polite"
          className="mb-4 p-3.5 rounded-xl bg-[#3979B7]/15 border border-[#3979B7] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-start sm:items-center gap-3">
            <Wrench className="w-4 h-4 text-[#3979B7] shrink-0 mt-0.5 sm:mt-0" />
            <div className="text-xs">
              <span className="font-bold text-[#0F172A] dark:text-[#F2F5F8]">
                Peça em mãos: {selectedPart.name} ({selectedPart.specsSummary})
              </span>
              <span className="block sm:inline sm:ml-2 text-[#475569] dark:text-[#A2AFBE]">
                — Clique ou pressione Enter sobre o slot destacado no gabinete/placa-mãe para instalar.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {highlightedSlots.length > 0 && (
              <button
                type="button"
                onClick={() => attemptInstallPart(selectedPart.id, highlightedSlots[0])}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-[#3979B7] hover:bg-[#5397D1] rounded-lg cursor-pointer whitespace-nowrap shrink-0"
              >
                Instalar no Slot Destacado
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenLibraryComponent(selectedPart.libraryComponentId)}
              className="px-2.5 py-1.5 text-xs font-medium text-[#0F172A] dark:text-[#F2F5F8] bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-lg cursor-pointer whitespace-nowrap shrink-0"
            >
              Dúvida sobre esta peça?
            </button>
            <button
              type="button"
              onClick={() => setSelectedPartId(null)}
              className="px-2.5 py-1.5 text-xs font-medium text-[#475569] dark:text-[#A2AFBE] hover:text-[#0F172A] dark:hover:text-[#F2F5F8] cursor-pointer whitespace-nowrap shrink-0"
            >
              Cancelar seleção
            </button>
          </div>
        </div>
      )}

      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`mb-4 p-3.5 rounded-xl border flex items-start justify-between gap-4 ${
            feedback.type === 'error'
              ? 'bg-[#EF4444]/10 border-[#EF4444]/40 text-[#991B1B] dark:text-[#FECACA]'
              : feedback.type === 'warning'
              ? 'bg-[#F59E0B]/10 border-[#F59E0B]/40 text-[#92400E] dark:text-[#FDE68A]'
              : feedback.type === 'success'
              ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#065F46] dark:text-[#A7F3D0]'
              : 'bg-[#3979B7]/10 border-[#3979B7]/40 text-[#0F172A] dark:text-[#F2F5F8]'
          }`}
        >
          <div className="flex items-start gap-2.5 text-xs leading-relaxed">
            {feedback.type === 'error' ? (
              <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#EF4444]" />
            ) : feedback.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#F59E0B]" />
            ) : feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#10B981]" />
            ) : (
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#3979B7]" />
            )}
            <div>
              <div className="font-bold">
                {feedback.title}
                {feedback.penalty && feedback.penalty > 0 ? (
                  <span className="ml-2 font-mono">(-{feedback.penalty} pts)</span>
                ) : null}
              </div>
              <p className="mt-0.5 opacity-95">{feedback.message}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {feedback.relatedLibraryId && (
              <button
                type="button"
                onClick={() => onOpenLibraryComponent(feedback.relatedLibraryId!)}
                className="px-2.5 py-1 text-xs font-semibold underline cursor-pointer whitespace-nowrap shrink-0"
              >
                Rever Conceito na Biblioteca
              </button>
            )}
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="p-1 opacity-75 hover:opacity-100 cursor-pointer"
              aria-label="Fechar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navegação por Abas para Smartphone/Tablet (< lg) */}
      <div className="flex lg:hidden items-center gap-1 p-1 mb-4 bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-xl">
        <button
          type="button"
          onClick={() => setMobilePanel('inventory')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            mobilePanel === 'inventory'
              ? 'bg-[#3979B7] text-white'
              : 'text-[#475569] dark:text-[#A2AFBE]'
          }`}
        >
          1. Inventário ({INVENTORY_ITEMS.length - installedIds.length})
        </button>
        <button
          type="button"
          onClick={() => setMobilePanel('stage')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            mobilePanel === 'stage'
              ? 'bg-[#3979B7] text-white'
              : 'text-[#475569] dark:text-[#A2AFBE]'
          }`}
        >
          2. Área de Montagem
        </button>
        <button
          type="button"
          onClick={() => setMobilePanel('diagnostics')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            mobilePanel === 'diagnostics'
              ? 'bg-[#3979B7] text-white'
              : 'text-[#475569] dark:text-[#A2AFBE]'
          }`}
        >
          3. Diagnóstico ({state.score} pts)
        </button>
      </div>

      {/* Layout Principal de 3 Regiões no Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* REGIÃO 9.1: INVENTÁRIO TÉCNICO */}
        <aside
          aria-label="Inventário de Componentes"
          className={`lg:col-span-3 bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-xl overflow-hidden flex flex-col ${
            mobilePanel === 'inventory' ? 'block' : 'hidden lg:flex'
          }`}
        >
          <div className="p-4 border-b border-[#E2E8F0] dark:border-[#2A3542]">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h2 className="text-sm font-bold text-[#0F172A] dark:text-[#F2F5F8]">
                Inventário de Peças
              </h2>
              <span className="font-mono text-xs text-[#475569] dark:text-[#A2AFBE] tabular-nums">
                {INVENTORY_ITEMS.length - installedIds.length} disponíveis
              </span>
            </div>
            <p className="text-xs text-[#475569] dark:text-[#A2AFBE]">
              Arraste com o mouse ou clique para selecionar a peça e clique no local de instalação.
            </p>

            {/* Filtro de categorias do inventário */}
            <div className="mt-3 flex flex-wrap gap-1">
              {CATEGORY_TABS.map((tab) => {
                const active = inventoryCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setInventoryCategory(tab.id)}
                    className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-[#3979B7] text-white'
                        : 'bg-[#F1F5F9] dark:bg-[#1C2734] text-[#475569] dark:text-[#A2AFBE] hover:text-[#0F172A] dark:hover:text-[#F2F5F8]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 space-y-2.5 max-h-[640px] overflow-y-auto">
            {filteredInventory.map((item) => {
              const isInstalled = installedIds.includes(item.id);
              const isSelected = selectedPartId === item.id;
              const compat = getCompatibilityHint(item);

              return (
                <div
                  key={item.id}
                  draggable={!isInstalled && !state.finished}
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onClick={() => {
                    if (isInstalled || state.finished) return;
                    setSelectedPartId((prev) => (prev === item.id ? null : item.id));
                    if (mobilePanel === 'inventory') {
                      setMobilePanel('stage');
                    }
                  }}
                  onKeyDown={(e) => {
                    if (isInstalled || state.finished) return;
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedPartId((prev) => (prev === item.id ? null : item.id));
                    }
                  }}
                  tabIndex={isInstalled ? -1 : 0}
                  role="button"
                  aria-pressed={isSelected}
                  aria-disabled={isInstalled}
                  className={`p-3 rounded-lg border text-left transition-all select-none ${
                    isInstalled
                      ? 'bg-[#F8FAFC] dark:bg-[#0C1118]/50 border-[#E2E8F0] dark:border-[#2A3542]/60 opacity-55 cursor-default'
                      : isSelected
                      ? 'bg-[#3979B7]/15 border-[#3979B7] ring-1 ring-[#3979B7] cursor-pointer'
                      : 'bg-[#F8FAFC] dark:bg-[#1C2734]/70 border-[#E2E8F0] dark:border-[#2A3542] hover:border-[#3979B7] cursor-grab active:cursor-grabbing'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[11px] text-[#475569] dark:text-[#A2AFBE]">
                        {item.categoryLabel} ·{' '}
                        <span
                          className={
                            compat.compatible
                              ? 'text-[#10B981]'
                              : 'text-[#F59E0B]'
                          }
                        >
                          {isInstalled ? 'Instalado' : compat.label}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-[#0F172A] dark:text-[#F2F5F8] mt-0.5">
                        {item.name}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenLibraryComponent(item.libraryComponentId);
                      }}
                      className="p-1 text-[#475569] dark:text-[#A2AFBE] hover:text-[#3979B7] rounded cursor-pointer"
                      title="Consultar este componente na Biblioteca"
                      aria-label={`Consultar ${item.name} na Biblioteca`}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-1.5 font-mono text-xs text-[#3979B7] dark:text-[#5397D1] tabular-nums">
                    {item.specsSummary}
                  </div>

                  <p className="mt-1 text-[11px] text-[#475569] dark:text-[#A2AFBE] leading-snug">
                    {item.technicalDetails}
                  </p>
                </div>
              );
            })}
          </div>
        </aside>

        {/* REGIÃO 9.2: ÁREA DE MONTAGEM CENTRAL (CHASSI DO GABINETE + PLACA-MÃE) */}
        <section
          aria-label="Área de Montagem do Computador"
          className={`lg:col-span-6 bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-xl p-4 sm:p-5 ${
            mobilePanel === 'stage' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Cabeçalho técnico do Chassi */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#E2E8F0] dark:border-[#2A3542]">
            <div>
              <div className="text-xs text-[#475569] dark:text-[#A2AFBE]">
                Chassi Técnico ATX · Visualização de Bancada 2D
              </div>
              <h2 className="text-sm sm:text-base font-bold text-[#0F172A] dark:text-[#F2F5F8]">
                {platform.name} ({platform.codeName})
              </h2>
            </div>

            <div className="font-mono text-xs text-[#475569] dark:text-[#A2AFBE] tabular-nums">
              Socket: <strong className="text-[#0F172A] dark:text-[#F2F5F8]">{platform.socket}</strong> · RAM:{' '}
              <strong className="text-[#0F172A] dark:text-[#F2F5F8]">{platform.memoryType}</strong>
            </div>
          </div>

          {/* INTERIOR DO GABINETE (Separando claramente Placa-Mãe, Baia 2.5" SATA e Compartimento da Fonte PSU) */}
          <div className="bg-[#0E151F] border-2 border-[#2A3542] rounded-xl p-4 relative text-[#F2F5F8]">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#A2AFBE] mb-3 px-1">
              <span>ESTRUTURA DO GABINETE (CHASSI ATX)</span>
              <span>FIXAÇÃO PLACA-MÃE: {screwsInstalledCount}/4 PARAFUSOS M3</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
              {/* PLACA-MÃE (PCB PRINCIPAL — 8 COLUNAS) */}
              <div className="md:col-span-8 bg-[#131E2B] border-2 border-[#3979B7]/60 rounded-lg p-4 relative flex flex-col justify-between min-h-[420px]">
                {/* Trilha decorativa técnica em SVG no fundo da PCB */}
                <svg
                  viewBox="0 0 400 400"
                  className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
                  aria-hidden="true"
                >
                  <path
                    d="M40 60 H180 V140 M280 40 V190 M60 250 H340 M120 310 H320"
                    stroke="#5397D1"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <rect x="24" y="52" width="22" height="95" rx="2" fill="#2A3B4E" />
                </svg>

                {/* Linha Superior de Espaçadores (Parafusos 1 e 2) */}
                <div className="relative z-10 flex items-center justify-between mb-3">
                  {(['screw-hole-1', 'screw-hole-2'] as const).map((holeId, idx) => {
                    const installedScrew = state.slots[holeId];
                    const isHighlighted = highlightedSlots.includes(holeId);
                    return (
                      <div key={holeId} className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDropOnSlot(e, holeId)}
                          onClick={() =>
                            installedScrew ? handleRemoveFromSlot(holeId) : handleSlotClick(holeId)
                          }
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-xs transition-all cursor-pointer ${
                            installedScrew
                              ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981]'
                              : isHighlighted
                              ? 'bg-[#3979B7]/30 border-[#5397D1] text-white scale-105'
                              : 'bg-[#0C1118] border-[#47586B] text-[#A2AFBE] hover:border-[#5397D1]'
                          }`}
                          title={
                            installedScrew
                              ? 'Parafuso instalado (clique para desparafusar)'
                              : `Espaçador M3 #${idx + 1} (instale um parafuso aqui)`
                          }
                          aria-label={`Espaçador de parafuso ${idx + 1}`}
                        >
                          {installedScrew ? '●' : '+'}
                        </button>
                        <span className="text-[10px] font-mono text-[#A2AFBE]">
                          M3 #{idx + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Zona Superior da Placa-Mãe: Socket CPU + Térmica + Cooler (Esquerda) e Slots DIMM RAM (Direita) */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-3 my-1">
                  {/* SOCKET DA CPU + CAMADA TÉRMICA + COOLER (7 Colunas) */}
                  <div className="sm:col-span-7 bg-[#0C1118]/90 border border-[#2A3542] rounded-lg p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#A2AFBE] mb-2">
                      <span>SOCKET {platform.socket}</span>
                      <span>VRM / CPU_FAN</span>
                    </div>

                    {/* Slot 1: CPU */}
                    <div
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnSlot(e, 'slot-cpu')}
                      onClick={() => handleSlotClick('slot-cpu')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSlotClick('slot-cpu');
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Socket do Processador ${platform.socket}`}
                      className={`p-2.5 rounded-lg border-2 border-dashed transition-all mb-2 ${
                        state.slots['slot-cpu']
                          ? 'bg-[#162822] border-[#10B981] border-solid'
                          : highlightedSlots.includes('slot-cpu')
                          ? 'bg-[#3979B7]/25 border-[#5397D1] cursor-pointer'
                          : 'bg-[#151D28]/80 border-[#3979B7]/40 hover:border-[#5397D1] cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-[10px] font-mono uppercase text-[#A2AFBE]">
                            1. Processador (Socket {platform.socket})
                          </div>
                          <div className="text-xs font-bold text-white">
                            {state.slots['slot-cpu']
                              ? getItem(state.slots['slot-cpu'])?.name
                              : `Aguardando CPU ${platform.socket}`}
                          </div>
                        </div>
                        {state.slots['slot-cpu'] && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromSlot('slot-cpu');
                            }}
                            className="p-1 text-xs text-[#A2AFBE] hover:text-[#EF4444] rounded cursor-pointer"
                            title="Remover CPU"
                            aria-label="Remover CPU"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Slot 2: Interface Térmica (Pasta Térmica) */}
                    <div
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnSlot(e, 'slot-thermal')}
                      onClick={() => handleSlotClick('slot-thermal')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSlotClick('slot-thermal');
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label="Interface Térmica sobre o Processador"
                      className={`p-2.5 rounded-lg border-2 border-dashed transition-all mb-2 ${
                        state.slots['slot-thermal'] === 'pasta-errada'
                          ? 'bg-[#EF4444]/20 border-[#EF4444] border-solid'
                          : state.slots['slot-thermal']
                          ? 'bg-[#162822] border-[#10B981] border-solid'
                          : highlightedSlots.includes('slot-thermal')
                          ? 'bg-[#3979B7]/25 border-[#5397D1] cursor-pointer'
                          : 'bg-[#151D28]/80 border-[#3979B7]/40 hover:border-[#5397D1] cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-[10px] font-mono uppercase text-[#A2AFBE]">
                            2. Interface Térmica (IHS)
                          </div>
                          <div className="text-xs font-bold text-white">
                            {state.slots['slot-thermal'] === 'pasta-errada'
                              ? 'ALERTA: Super Bonder Aplicado!'
                              : state.slots['slot-thermal']
                              ? 'Pasta Térmica Aplicada'
                              : state.slots['slot-cpu']
                              ? 'Aplique a Pasta Térmica aqui'
                              : 'Requer CPU instalada primeiro'}
                          </div>
                        </div>
                        {state.slots['slot-thermal'] && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromSlot('slot-thermal');
                            }}
                            className={`px-2 py-1 text-[11px] font-semibold rounded cursor-pointer whitespace-nowrap shrink-0 ${
                              state.slots['slot-thermal'] === 'pasta-errada'
                                ? 'bg-[#EF4444] text-white hover:bg-[#DC2626]'
                                : 'text-[#A2AFBE] hover:text-[#EF4444]'
                            }`}
                            title="Limpar interface térmica"
                          >
                            {state.slots['slot-thermal'] === 'pasta-errada'
                              ? 'Limpar c/ Álcool'
                              : 'Limpar'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Slot 3: Cooler da CPU */}
                    <div
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnSlot(e, 'slot-cooler')}
                      onClick={() => handleSlotClick('slot-cooler')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSlotClick('slot-cooler');
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Suporte do Cooler ${platform.socket}`}
                      className={`p-2.5 rounded-lg border-2 border-dashed transition-all ${
                        state.slots['slot-cooler']
                          ? 'bg-[#162822] border-[#10B981] border-solid'
                          : highlightedSlots.includes('slot-cooler')
                          ? 'bg-[#3979B7]/25 border-[#5397D1] cursor-pointer'
                          : 'bg-[#151D28]/80 border-[#3979B7]/40 hover:border-[#5397D1] cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-[10px] font-mono uppercase text-[#A2AFBE]">
                            3. Refrigeração ({platform.socket})
                          </div>
                          <div className="text-xs font-bold text-white">
                            {state.slots['slot-cooler']
                              ? getItem(state.slots['slot-cooler'])?.name
                              : state.slots['slot-thermal'] === 'pasta-termica'
                              ? `Aguardando Cooler ${platform.socket}`
                              : 'Requer CPU + Pasta Térmica'}
                          </div>
                        </div>
                        {state.slots['slot-cooler'] && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromSlot('slot-cooler');
                            }}
                            className="p-1 text-xs text-[#A2AFBE] hover:text-[#EF4444] rounded cursor-pointer"
                            title="Remover Cooler"
                            aria-label="Remover Cooler"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SLOTS DIMM DE MEMÓRIA RAM (5 Colunas) */}
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnSlot(e, 'slot-ram')}
                    onClick={() => handleSlotClick('slot-ram')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSlotClick('slot-ram');
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Slots de Memória RAM ${platform.memoryType}`}
                    className={`sm:col-span-5 rounded-lg p-3 border-2 border-dashed flex flex-col justify-between transition-all ${
                      state.slots['slot-ram']
                        ? 'bg-[#162822] border-[#10B981] border-solid'
                        : highlightedSlots.includes('slot-ram')
                        ? 'bg-[#3979B7]/25 border-[#5397D1] cursor-pointer'
                        : 'bg-[#0C1118]/90 border-[#3979B7]/40 hover:border-[#5397D1] cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#A2AFBE]">
                      <span>SLOTS DIMM</span>
                      <span className="text-[#5397D1] font-bold">{platform.memoryType}</span>
                    </div>

                    {/* Ilustração dos 2 bancos DIMM verticais */}
                    <div className="my-3 flex items-center justify-center gap-3 py-2">
                      <div
                        className={`w-4 h-28 rounded border ${
                          state.slots['slot-ram']
                            ? 'bg-[#10B981] border-white'
                            : 'bg-[#151D28] border-[#3979B7]/60'
                        }`}
                      />
                      <div className="w-4 h-28 rounded border bg-[#151D28] border-[#2A3542]" />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] font-mono uppercase text-[#A2AFBE]">
                          Canal A1 ({platform.memoryType})
                        </div>
                        <div className="text-xs font-bold text-white">
                          {state.slots['slot-ram']
                            ? getItem(state.slots['slot-ram'])?.name
                            : `Instalar RAM ${platform.memoryType}`}
                        </div>
                      </div>
                      {state.slots['slot-ram'] && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromSlot('slot-ram');
                          }}
                          className="p-1 text-xs text-[#A2AFBE] hover:text-[#EF4444] rounded cursor-pointer"
                          title="Remover Memória RAM"
                          aria-label="Remover Memória RAM"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Zona Intermediária da Placa-Mãe: Slot M.2 NVMe */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnSlot(e, 'slot-m2')}
                  onClick={() => handleSlotClick('slot-m2')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSlotClick('slot-m2');
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Conector M.2 PCIe NVMe na Placa-Mãe"
                  className={`relative z-10 my-2 p-3 rounded-lg border-2 border-dashed transition-all ${
                    state.slots['slot-m2']
                      ? 'bg-[#162822] border-[#10B981] border-solid'
                      : highlightedSlots.includes('slot-m2')
                      ? 'bg-[#3979B7]/25 border-[#5397D1] cursor-pointer'
                      : 'bg-[#0C1118]/90 border-[#3979B7]/40 hover:border-[#5397D1] cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-[#A2AFBE]">
                        Conector M.2 2280 (PCIe NVMe — Direto na Placa-Mãe)
                      </div>
                      <div className="text-xs font-bold text-white">
                        {state.slots['slot-m2']
                          ? getItem(state.slots['slot-m2'])?.name
                          : 'Slot M.2 NVMe (Aceita apenas SSD formato M.2)'}
                      </div>
                    </div>
                    {state.slots['slot-m2'] && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromSlot('slot-m2');
                        }}
                        className="p-1 text-xs text-[#A2AFBE] hover:text-[#EF4444] rounded cursor-pointer"
                        title="Remover SSD M.2"
                        aria-label="Remover SSD M.2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Zona Inferior da Placa-Mãe: Barramento PCIe 4.0 x16 (Placa de Vídeo GPU) */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnSlot(e, 'slot-gpu')}
                  onClick={() => handleSlotClick('slot-gpu')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSlotClick('slot-gpu');
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Slot PCI Express x16 para Placa de Vídeo"
                  className={`relative z-10 my-1 p-3.5 rounded-lg border-2 border-dashed transition-all ${
                    state.slots['slot-gpu']
                      ? 'bg-[#162822] border-[#10B981] border-solid'
                      : highlightedSlots.includes('slot-gpu')
                      ? 'bg-[#3979B7]/25 border-[#5397D1] cursor-pointer'
                      : 'bg-[#0C1118]/90 border-[#3979B7]/40 hover:border-[#5397D1] cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-[#A2AFBE]">
                        Barramento {platform.pcieGen} (Placa de Vídeo Dedicada)
                      </div>
                      <div className="text-xs font-bold text-white">
                        {state.slots['slot-gpu']
                          ? `${getItem(state.slots['slot-gpu'])?.name} (${
                              getItem(state.slots['slot-gpu'])?.watts
                            } W)`
                          : 'Slot PCIe x16 — Instale a Placa de Vídeo (GPU)'}
                      </div>
                    </div>
                    {state.slots['slot-gpu'] && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromSlot('slot-gpu');
                        }}
                        className="p-1 text-xs text-[#A2AFBE] hover:text-[#EF4444] rounded cursor-pointer"
                        title="Remover Placa de Vídeo"
                        aria-label="Remover Placa de Vídeo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Linha Inferior de Espaçadores (Parafusos 3 e 4) */}
                <div className="relative z-10 flex items-center justify-between mt-3">
                  {(['screw-hole-3', 'screw-hole-4'] as const).map((holeId, idx) => {
                    const installedScrew = state.slots[holeId];
                    const isHighlighted = highlightedSlots.includes(holeId);
                    return (
                      <div key={holeId} className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDropOnSlot(e, holeId)}
                          onClick={() =>
                            installedScrew ? handleRemoveFromSlot(holeId) : handleSlotClick(holeId)
                          }
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-xs transition-all cursor-pointer ${
                            installedScrew
                              ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981]'
                              : isHighlighted
                              ? 'bg-[#3979B7]/30 border-[#5397D1] text-white scale-105'
                              : 'bg-[#0C1118] border-[#47586B] text-[#A2AFBE] hover:border-[#5397D1]'
                          }`}
                          title={
                            installedScrew
                              ? 'Parafuso instalado (clique para desparafusar)'
                              : `Espaçador M3 #${idx + 3} (instale um parafuso aqui)`
                          }
                          aria-label={`Espaçador de parafuso ${idx + 3}`}
                        >
                          {installedScrew ? '●' : '+'}
                        </button>
                        <span className="text-[10px] font-mono text-[#A2AFBE]">
                          M3 #{idx + 3}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COLUNA LATERAL DO GABINETE: BAIA DE ARMAZENAMENTO 2,5" SATA E BARRAMENTO DE CABOS (4 COLUNAS) */}
              <div className="md:col-span-4 flex flex-col justify-between gap-4">
                {/* Baia de 2,5" do Gabinete para SSD SATA */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnSlot(e, 'slot-sata')}
                  onClick={() => handleSlotClick('slot-sata')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSlotClick('slot-sata');
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Baia de 2,5 polegadas do Gabinete para SSD SATA"
                  className={`p-3.5 rounded-lg border-2 border-dashed flex-1 flex flex-col justify-between transition-all ${
                    state.slots['slot-sata']
                      ? 'bg-[#162822] border-[#10B981] border-solid'
                      : highlightedSlots.includes('slot-sata')
                      ? 'bg-[#3979B7]/25 border-[#5397D1] cursor-pointer'
                      : 'bg-[#151D28]/90 border-[#47586B] hover:border-[#5397D1] cursor-pointer'
                  }`}
                >
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#A2AFBE] mb-1">
                      BAIA DO GABINETE (2,5" SATA)
                    </div>
                    <div className="text-xs font-bold text-white">
                      {state.slots['slot-sata']
                        ? getItem(state.slots['slot-sata'])?.name
                        : 'Suporte Lateral p/ SSD SATA 2,5"'}
                    </div>
                    <p className="text-[11px] text-[#A2AFBE] mt-1.5 leading-snug">
                      Unidades SATA de 2,5" são fixadas no chassi do gabinete e conectadas via cabo SATA III à placa-mãe.
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#2A3542] flex items-center justify-between text-[11px] font-mono">
                    <span
                      className={
                        state.slots['slot-sata'] ? 'text-[#10B981]' : 'text-[#A2AFBE]'
                      }
                    >
                      {state.slots['slot-sata']
                        ? 'Cabo SATA Dados + Energia: OK'
                        : 'Portas SATA III Livres'}
                    </span>
                    {state.slots['slot-sata'] && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromSlot('slot-sata');
                        }}
                        className="p-1 text-[#A2AFBE] hover:text-[#EF4444] rounded cursor-pointer"
                        title="Remover SSD SATA"
                        aria-label="Remover SSD SATA"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Painel de Conexões Elétricas do Gabinete */}
                <div className="p-3.5 rounded-lg bg-[#151D28]/80 border border-[#2A3542] text-xs space-y-2">
                  <div className="text-[10px] font-mono uppercase text-[#A2AFBE]">
                    MALHA DE ALIMENTAÇÃO INTERNA
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#A2AFBE]">ATX 24-Pinos (Placa)</span>
                    <span
                      className={`font-mono ${
                        state.slots['slot-psu'] ? 'text-[#10B981]' : 'text-[#A2AFBE]'
                      }`}
                    >
                      {state.slots['slot-psu'] ? 'Conectado' : 'Sem Fonte'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#A2AFBE]">EPS 12V 8-Pinos (CPU)</span>
                    <span
                      className={`font-mono ${
                        state.slots['slot-psu'] && state.slots['slot-cpu']
                          ? 'text-[#10B981]'
                          : 'text-[#A2AFBE]'
                      }`}
                    >
                      {state.slots['slot-psu'] && state.slots['slot-cpu']
                        ? 'Conectado'
                        : 'Aguardando'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#A2AFBE]">PCIe 6+2 Pinos (GPU)</span>
                    <span
                      className={`font-mono ${
                        state.slots['slot-psu'] && state.slots['slot-gpu']
                          ? 'text-[#10B981]'
                          : 'text-[#A2AFBE]'
                      }`}
                    >
                      {state.slots['slot-psu'] && state.slots['slot-gpu']
                        ? 'Conectado'
                        : 'Aguardando'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* COMPARTIMENTO INFERIOR DO GABINETE (PSU SHROUD — SEPARADO DA PLACA-MÃE) */}
            <div className="mt-4 pt-3 border-t-2 border-[#2A3542]">
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnSlot(e, 'slot-psu')}
                onClick={() => handleSlotClick('slot-psu')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSlotClick('slot-psu');
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label="Compartimento Inferior do Gabinete para Fonte de Alimentação PSU"
                className={`p-3.5 rounded-lg border-2 border-dashed transition-all ${
                  state.slots['slot-psu']
                    ? powerMetrics.powerStatus === 'optimal'
                      ? 'bg-[#162822] border-[#10B981] border-solid'
                      : 'bg-[#F59E0B]/15 border-[#F59E0B] border-solid'
                    : highlightedSlots.includes('slot-psu')
                    ? 'bg-[#3979B7]/25 border-[#5397D1] cursor-pointer'
                    : 'bg-[#151D28]/90 border-[#47586B] hover:border-[#5397D1] cursor-pointer'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#A2AFBE]">
                      COMPARTIMENTO INFERIOR DO GABINETE (PSU SHROUD — FORA DA PLACA-MÃE)
                    </div>
                    <div className="text-xs font-bold text-white mt-0.5">
                      {state.slots['slot-psu']
                        ? `${getItem(state.slots['slot-psu'])?.name} — ${
                            getItem(state.slots['slot-psu'])?.specsSummary
                          }`
                        : 'Instale a Fonte de Alimentação (PSU 450 W ou 650 W) neste compartimento do gabinete'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {state.slots['slot-psu'] && (
                      <span className="font-mono text-xs text-[#5397D1] tabular-nums">
                        Máx: {powerMetrics.nominalPsuWatts} W
                      </span>
                    )}
                    {state.slots['slot-psu'] && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromSlot('slot-psu');
                        }}
                        className="p-1 text-xs text-[#A2AFBE] hover:text-[#EF4444] rounded cursor-pointer"
                        title="Remover Fonte de Alimentação"
                        aria-label="Remover Fonte de Alimentação"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* REGIÃO 9.3: PAINEL DE DIAGNÓSTICO, ENERGIA E INICIALIZAÇÃO */}
        <aside
          aria-label="Painel de Diagnóstico e Energia"
          className={`lg:col-span-3 bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-xl p-4 flex flex-col justify-between ${
            mobilePanel === 'diagnostics' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <div className="space-y-4">
            {/* Pontuação e Tempo */}
            <div className="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542] grid grid-cols-2 gap-3">
              <div>
                <div className="text-[11px] font-medium text-[#475569] dark:text-[#A2AFBE]">
                  Pontuação Técnica
                </div>
                <div className="font-mono text-2xl font-bold text-[#0F172A] dark:text-[#F2F5F8] tabular-nums">
                  {state.score}{' '}
                  <span className="text-xs font-normal text-[#475569] dark:text-[#A2AFBE]">
                    pts
                  </span>
                </div>
              </div>

              <div className="border-l border-[#E2E8F0] dark:border-[#2A3542] pl-3">
                <div className="text-[11px] font-medium text-[#475569] dark:text-[#A2AFBE]">
                  Tempo de Bancada
                </div>
                <div className="font-mono text-2xl font-bold text-[#3979B7] tabular-nums">
                  {formatTime(state.elapsedSeconds)}
                </div>
              </div>
            </div>

            {/* Balanço Energético Didático */}
            <div className="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#0F172A] dark:text-[#F2F5F8] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#3979B7]" />
                  <span>Dimensionamento Elétrico</span>
                </span>
                <button
                  type="button"
                  onClick={() => onOpenLibraryComponent('fonte')}
                  className="text-[11px] text-[#3979B7] hover:underline cursor-pointer"
                >
                  Como calcular?
                </button>
              </div>

              <div className="space-y-1.5 text-xs font-mono tabular-nums">
                <div className="flex justify-between text-[#475569] dark:text-[#A2AFBE]">
                  <span>Consumo Estimado:</span>
                  <strong className="text-[#0F172A] dark:text-[#F2F5F8]">
                    {powerMetrics.estimatedContinuousWatts} W
                  </strong>
                </div>
                <div className="flex justify-between text-[#475569] dark:text-[#A2AFBE]">
                  <span>Margem Recomendada (+30%):</span>
                  <strong className="text-[#3979B7]">
                    {powerMetrics.recommendedMinPsuWatts} W
                  </strong>
                </div>
                <div className="flex justify-between text-[#475569] dark:text-[#A2AFBE]">
                  <span>Capacidade da Fonte:</span>
                  <strong
                    className={
                      powerMetrics.powerStatus === 'optimal'
                        ? 'text-[#10B981]'
                        : powerMetrics.powerStatus === 'none'
                        ? 'text-[#475569] dark:text-[#A2AFBE]'
                        : 'text-[#F59E0B]'
                    }
                  >
                    {powerMetrics.nominalPsuWatts > 0
                      ? `${powerMetrics.nominalPsuWatts} W`
                      : 'Não instalada'}
                  </strong>
                </div>
              </div>

              <p className="mt-2.5 pt-2 border-t border-[#E2E8F0] dark:border-[#2A3542] text-[11px] text-[#475569] dark:text-[#A2AFBE] leading-snug">
                {powerMetrics.powerStatusNote}
              </p>
            </div>

            {/* Checklist de Etapas da Montagem */}
            <div>
              <div className="text-xs font-bold text-[#0F172A] dark:text-[#F2F5F8] mb-2">
                Diagnóstico de Componentes
              </div>

              <div className="divide-y divide-[#E2E8F0] dark:divide-[#2A3542] border-t border-b border-[#E2E8F0] dark:border-[#2A3542] text-xs">
                {[
                  {
                    label: `CPU (${platform.socket})`,
                    value: getItem(state.slots['slot-cpu'])?.name || 'Pendente',
                    ok: Boolean(state.slots['slot-cpu']),
                    err: false
                  },
                  {
                    label: 'Interface Térmica',
                    value:
                      state.slots['slot-thermal'] === 'pasta-errada'
                        ? 'Super Bonder (Erro!)'
                        : state.slots['slot-thermal']
                        ? 'Pasta Térmica OK'
                        : 'Pendente',
                    ok: state.slots['slot-thermal'] === 'pasta-termica',
                    err: state.slots['slot-thermal'] === 'pasta-errada'
                  },
                  {
                    label: `Cooler (${platform.socket})`,
                    value: getItem(state.slots['slot-cooler'])?.name || 'Pendente',
                    ok: Boolean(state.slots['slot-cooler']),
                    err: false
                  },
                  {
                    label: `RAM (${platform.memoryType})`,
                    value: getItem(state.slots['slot-ram'])?.name || 'Pendente',
                    ok: Boolean(state.slots['slot-ram']),
                    err: false
                  },
                  {
                    label: 'Armazenamento (SSD)',
                    value:
                      state.slots['slot-m2'] && state.slots['slot-sata']
                        ? 'M.2 + SATA (Dual)'
                        : getItem(state.slots['slot-m2'])?.name ||
                          getItem(state.slots['slot-sata'])?.name ||
                          'Pendente',
                    ok: Boolean(state.slots['slot-m2'] || state.slots['slot-sata']),
                    err: false
                  },
                  {
                    label: 'Placa de Vídeo (PCIe)',
                    value: getItem(state.slots['slot-gpu'])?.name || 'Pendente',
                    ok: Boolean(state.slots['slot-gpu']),
                    err: false
                  },
                  {
                    label: 'Fonte (PSU Gabinete)',
                    value: getItem(state.slots['slot-psu'])?.name || 'Pendente',
                    ok:
                      Boolean(state.slots['slot-psu']) &&
                      powerMetrics.powerStatus === 'optimal',
                    err:
                      Boolean(state.slots['slot-psu']) &&
                      powerMetrics.powerStatus !== 'optimal'
                  },
                  {
                    label: 'Fixação Placa-Mãe',
                    value: `${screwsInstalledCount}/4 parafusos`,
                    ok: screwsInstalledCount === 4,
                    err: false
                  }
                ].map((row, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between gap-2">
                    <span className="text-[#475569] dark:text-[#A2AFBE]">{row.label}</span>
                    <span
                      className={`font-mono font-medium inline-flex items-center gap-1 tabular-nums ${
                        row.err
                          ? 'text-[#EF4444]'
                          : row.ok
                          ? 'text-[#10B981]'
                          : 'text-[#475569] dark:text-[#A2AFBE]'
                      }`}
                    >
                      {row.err ? (
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      ) : row.ok ? (
                        <Check className="w-3.5 h-3.5 shrink-0" />
                      ) : null}
                      <span>{row.value}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Botão Principal: Ligar Computador */}
          <div className="mt-5 pt-4 border-t border-[#E2E8F0] dark:border-[#2A3542]">
            <button
              type="button"
              onClick={handlePowerButton}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                state.finished
                  ? 'bg-[#10B981] hover:bg-[#059669] text-white'
                  : 'bg-[#3979B7] hover:bg-[#5397D1] text-white'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>
                {state.finished ? 'Sistema Ligado — Ver Relatório' : 'Ligar Computador (Testar POST)'}
              </span>
            </button>
          </div>
        </aside>
      </div>

      {/* MODAL DE DIAGNÓSTICO DE FALHA DE INICIALIZAÇÃO (Educativo) */}
      {bootDiagnosticModal.open && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="diag-modal-title"
        >
          <div className="bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-xl max-w-xl w-full p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 pb-4 mb-4 border-b border-[#E2E8F0] dark:border-[#2A3542]">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-6 h-6 text-[#EF4444] shrink-0 mt-0.5" />
                <div>
                  <h2
                    id="diag-modal-title"
                    className="text-lg font-bold text-[#0F172A] dark:text-[#F2F5F8]"
                  >
                    Diagnóstico de Inicialização (POST Não Concluído)
                  </h2>
                  <p className="text-xs text-[#475569] dark:text-[#A2AFBE] mt-0.5">
                    Analise as causas técnicas identificadas na bancada e corrija a montagem:
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBootDiagnosticModal({ open: false, issues: [] })}
                className="p-1 text-[#475569] dark:text-[#A2AFBE] hover:text-[#0F172A] dark:hover:text-[#F2F5F8] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
              {bootDiagnosticModal.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542]"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-[#EF4444]">
                      {idx + 1}. {issue.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setBootDiagnosticModal({ open: false, issues: [] });
                        onOpenLibraryComponent(issue.libraryId);
                      }}
                      className="text-[11px] font-semibold text-[#3979B7] hover:underline cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Estudar na Biblioteca →
                    </button>
                  </div>
                  <p className="text-xs text-[#475569] dark:text-[#A2AFBE] leading-relaxed">
                    {issue.detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#E2E8F0] dark:border-[#2A3542] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setBootDiagnosticModal({ open: false, issues: [] })}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#3979B7] hover:bg-[#5397D1] rounded-lg cursor-pointer"
              >
                Voltar à Bancada e Corrigir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONCLUSÃO E SEQUÊNCIA DE POST BEM-SUCEDIDA */}
      {reportModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-modal-title"
        >
          <div className="bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 mb-4 border-b border-[#E2E8F0] dark:border-[#2A3542]">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#10B981] shrink-0 mt-0.5" />
                <div>
                  <h2
                    id="report-modal-title"
                    className="text-xl font-bold text-[#0F172A] dark:text-[#F2F5F8]"
                  >
                    Inicialização Concluída — Relatório Técnico da Montagem
                  </h2>
                  <p className="text-xs text-[#475569] dark:text-[#A2AFBE]">
                    Sequência POST (Power-On Self-Test) aprovada sem erros de hardware.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="p-1 text-[#475569] dark:text-[#A2AFBE] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulação discreta da tela UEFI/POST */}
            <div className="mb-5 p-4 rounded-lg bg-[#0C1118] border border-[#2A3542] font-mono text-xs text-[#F2F5F8] space-y-1">
              <div className="text-[#10B981] font-bold">
                HARDWAREDEX UEFI BIOS · POST DIAGNOSTIC OK
              </div>
              <div>
                BOARD : {platform.name} ({platform.codeName})
              </div>
              <div>
                CPU   : {getItem(state.slots['slot-cpu'])?.name} · COOLER:{' '}
                {getItem(state.slots['slot-cooler'])?.name} (TEMP: 36°C NOMINAL)
              </div>
              <div>
                MEMORY: {getItem(state.slots['slot-ram'])?.name} ({platform.memoryType} DUAL-RANK OK)
              </div>
              <div>
                STORAGE:{' '}
                {[
                  getItem(state.slots['slot-m2'])?.name,
                  getItem(state.slots['slot-sata'])?.name
                ]
                  .filter(Boolean)
                  .join(' + ')}
              </div>
              <div>
                VIDEO : {getItem(state.slots['slot-gpu'])?.name} (PCIe x16 LINK ACTIVE)
              </div>
              <div>
                POWER : {getItem(state.slots['slot-psu'])?.name} · CARGA ESTIMADA:{' '}
                {powerMetrics.estimatedContinuousWatts}W / {powerMetrics.nominalPsuWatts}W
              </div>
            </div>

            {/* Métricas Finais */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <div className="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542]">
                <div className="text-xs text-[#475569] dark:text-[#A2AFBE]">Pontuação Final</div>
                <div className="font-mono text-2xl font-bold text-[#10B981] tabular-nums">
                  {state.score} pts
                </div>
                <div className="text-[11px] text-[#475569] dark:text-[#A2AFBE]">
                  Inclui bônus de conclusão (+30)
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542]">
                <div className="text-xs text-[#475569] dark:text-[#A2AFBE]">Tempo Total</div>
                <div className="font-mono text-2xl font-bold text-[#3979B7] tabular-nums">
                  {formatTime(state.elapsedSeconds)}
                </div>
                <div className="text-[11px] text-[#475569] dark:text-[#A2AFBE]">
                  Ritmo de montagem
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542]">
                <div className="text-xs text-[#475569] dark:text-[#A2AFBE]">Erros Registrados</div>
                <div className="font-mono text-2xl font-bold text-[#0F172A] dark:text-[#F2F5F8] tabular-nums">
                  {state.mistakes.length}
                </div>
                <div className="text-[11px] text-[#475569] dark:text-[#A2AFBE]">
                  {state.mistakes.length === 0
                    ? 'Montagem impecável de primeira!'
                    : 'Corrigidos durante a sessão'}
                </div>
              </div>
            </div>

            {/* Histórico de erros e orientações de melhoria */}
            {state.mistakes.length > 0 ? (
              <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F59E0B] mb-2">
                  Pontos de Atenção e Erros Cometidos na Sessão
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {state.mistakes.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542] text-xs"
                    >
                      <div className="font-semibold text-[#0F172A] dark:text-[#F2F5F8]">
                        {m.title} <span className="font-mono text-[#EF4444]">(-{m.penalty} pts)</span>
                      </div>
                      <p className="text-[#475569] dark:text-[#A2AFBE] mt-0.5">{m.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-5 p-3.5 rounded-lg bg-[#10B981]/10 border border-[#10B981]/30 text-xs text-[#0F172A] dark:text-[#F2F5F8]">
                <strong>Excelente domínio técnico!</strong> Você selecionou componentes 100% compatíveis com a plataforma {platform.socket}/{platform.memoryType}, respeitou a ordem de aplicação térmica e dimensionou a fonte com segurança sem cometer nenhum erro.
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E2E8F0] dark:border-[#2A3542]">
              <button
                type="button"
                onClick={() => {
                  const nextPlatform =
                    state.platformId === 'AM4_DDR4' ? 'LGA1700_DDR5' : 'AM4_DDR4';
                  setReportModalOpen(false);
                  handleSelectPlatform(nextPlatform);
                }}
                className="px-4 py-2 text-xs font-semibold text-[#0F172A] dark:text-[#F2F5F8] bg-[#F1F5F9] dark:bg-[#1C2734] border border-[#E2E8F0] dark:border-[#2A3542] rounded-lg cursor-pointer"
              >
                Montar na Outra Plataforma (
                {state.platformId === 'AM4_DDR4' ? 'Intel LGA1700 · DDR5' : 'AMD AM4 · DDR4'})
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#475569] dark:text-[#A2AFBE] cursor-pointer"
                >
                  Inspecionar Bancada
                </button>
                <button
                  type="button"
                  onClick={handleResetWorkbench}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#3979B7] hover:bg-[#5397D1] rounded-lg cursor-pointer"
                >
                  Nova Montagem
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE REGRAS TÉCNICAS E AUDITORIA */}
      {auditModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="audit-modal-title"
        >
          <div className="bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-xl max-w-3xl w-full p-6 shadow-2xl max-h-[88vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 mb-4 border-b border-[#E2E8F0] dark:border-[#2A3542]">
              <div>
                <h2
                  id="audit-modal-title"
                  className="text-lg font-bold text-[#0F172A] dark:text-[#F2F5F8]"
                >
                  Especificações de Engenharia e Auditoria da Simulação
                </h2>
                <p className="text-xs text-[#475569] dark:text-[#A2AFBE]">
                  Resumo das regras de validação da Bancada Virtual e das 10 correções estruturais implementadas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAuditModalOpen(false)}
                className="p-1 text-[#475569] dark:text-[#A2AFBE] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {AUDIT_FIXES_REPORT.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542] text-xs"
                >
                  <div className="font-bold text-[#0F172A] dark:text-[#F2F5F8] mb-1">
                    0{item.id}. {item.issue}
                  </div>
                  <p className="text-[#475569] dark:text-[#A2AFBE] leading-relaxed">{item.fix}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#E2E8F0] dark:border-[#2A3542] flex justify-end">
              <button
                type="button"
                onClick={() => setAuditModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#3979B7] hover:bg-[#5397D1] rounded-lg cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
