import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Power,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Trash2,
  Info,
  Zap,
  Wrench,
  ShieldAlert,
  Check,
  X,
  HelpCircle
} from 'lucide-react';
import {
  INVENTORY_ITEMS,
  MOTHERBOARD_PLATFORMS,
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
  { id: 'screw', label: 'Parafusos' }
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
  const [hideInstalled, setHideInstalled] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<FeedbackBanner | null>(null);
  const [mobilePanel, setMobilePanel] = useState<'inventory' | 'stage' | 'diagnostics'>('stage');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [bootDiagnosticModal, setBootDiagnosticModal] = useState<{
    open: boolean;
    issues: { title: string; detail: string; libraryId: string }[];
  }>({ open: false, issues: [] });

  const lastErrorSignatureRef = useRef<{ sig: string; time: number }>({ sig: '', time: 0 });

  useEffect(() => {
    if (initialFilterCategory) {
      setInventoryCategory(initialFilterCategory);
      if (onClearInitialFilter) onClearInitialFilter();
    }
  }, [initialFilterCategory, onClearInitialFilter]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

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

    const recommendedMinPsuWatts = Math.ceil((estimatedContinuousWatts * 1.3) / 10) * 10;
    const nominalPsuWatts = psuItem?.maxWatts || 0;

    let powerStatus: 'none' | 'optimal' | 'tight' | 'overload' = 'none';
    let powerStatusNote = 'Instale uma fonte no gabinete.';

    if (psuItem) {
      if (nominalPsuWatts < estimatedContinuousWatts) {
        powerStatus = 'overload';
        powerStatusNote = `Sobrecarga: fonte (${nominalPsuWatts}W) menor que o consumo (${estimatedContinuousWatts}W).`;
      } else if (nominalPsuWatts < recommendedMinPsuWatts) {
        powerStatus = 'tight';
        powerStatusNote = `Sem folga de +30% (${recommendedMinPsuWatts}W recomendados). Use a fonte de 650W.`;
      } else {
        powerStatus = 'optimal';
        powerStatusNote = `Dimensionamento seguro (${nominalPsuWatts}W instalados para ${recommendedMinPsuWatts}W recomendados).`;
      }
    }

    return {
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
      title: `Plataforma alterada: ${MOTHERBOARD_PLATFORMS[newPlatformId].socket} · ${MOTHERBOARD_PLATFORMS[newPlatformId].memoryType}`,
      message: MOTHERBOARD_PLATFORMS[newPlatformId].recommendedNotes
    });
  };

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
    setFeedback(null);
  };

  const handleRemoveFromSlot = (slotId: SlotId) => {
    if (state.finished) {
      setState((prev) => ({ ...prev, finished: false, bootStatus: 'idle' }));
    }

    const currentItemId = state.slots[slotId];
    if (!currentItemId) return;
    const item = getItem(currentItemId);

    if (slotId === 'slot-cpu') {
      if (state.slots['slot-cooler']) {
        setFeedback({
          type: 'warning',
          title: 'Remoção bloqueada',
          message: 'Retire o Cooler primeiro antes de remover o processador.',
          relatedLibraryId: 'cooler'
        });
        return;
      }
      if (state.slots['slot-thermal']) {
        setFeedback({
          type: 'warning',
          title: 'Limpe a pasta térmica primeiro',
          message: 'Remova a interface térmica antes de abrir o socket da CPU.',
          relatedLibraryId: 'cpu'
        });
        return;
      }
    }

    if (slotId === 'slot-thermal' && state.slots['slot-cooler']) {
      setFeedback({
        type: 'warning',
        title: 'Cooler instalado sobre a CPU',
        message: 'Retire o Cooler antes de limpar a pasta térmica.',
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
        message: 'Resíduo de Super Bonder removido. Aplique a Pasta Térmica correta.'
      });
    } else {
      setFeedback({
        type: 'info',
        title: `${item?.name || 'Peça'} removida`,
        message: 'Componente devolvido ao inventário.'
      });
    }
  };

  const attemptInstallPart = useCallback(
    (partId: string, targetSlot: SlotId) => {
      if (state.finished) {
        setFeedback({
          type: 'info',
          title: 'Montagem concluída',
          message: 'Reinicie a bancada ou remova uma peça para editar.'
        });
        return;
      }

      const part = getItem(partId);
      if (!part) return;

      if (installedIds.includes(part.id)) {
        setFeedback({
          type: 'warning',
          title: 'Peça já instalada',
          message: `${part.name} já está na bancada.`
        });
        return;
      }

      if (part.category === 'screw') {
        if (!targetSlot.startsWith('screw-hole-')) {
          registerPenalty(
            `screw-wrong-target-${targetSlot}`,
            'Local incorreto para parafuso',
            'Parafusos M3 vão exclusivamente nos 4 cantos da placa-mãe.',
            10,
            'placa'
          );
          return;
        }
        if (state.slots[targetSlot]) {
          registerPenalty(
            `screw-occupied-${targetSlot}`,
            'Espaçador já ocupado',
            'Escolha outro canto livre da placa-mãe.',
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
          title: `${part.name} fixado (${screwsInstalledCount + 1}/4)`,
          message: 'Placa-mãe ancorada no espaçador do gabinete.'
        });
        return;
      }

      if (targetSlot.startsWith('screw-hole-')) {
        registerPenalty(
          `${part.id}-in-screw-hole`,
          'Encaixe incompatível',
          `Os furos nos cantos aceitam apenas parafusos M3, não ${part.name}.`,
          10,
          'placa'
        );
        return;
      }

      if (part.category === 'cpu') {
        if (targetSlot !== 'slot-cpu') {
          registerPenalty(
            `${part.id}-wrong-slot-${targetSlot}`,
            'Slot incorreto para CPU',
            'O processador deve ser instalado no Socket da CPU.',
            15,
            'cpu'
          );
          return;
        }
        if (state.slots['slot-cpu']) {
          registerPenalty('cpu-slot-occupied', 'Socket ocupado', 'Remova a CPU atual primeiro.', 10, 'cpu');
          return;
        }
        if (part.socket !== platform.socket) {
          registerPenalty(
            `cpu-socket-mismatch-${part.id}-${platform.id}`,
            `Socket incompatível (${part.socket} vs ${platform.socket})`,
            `O ${part.name} usa socket ${part.socket}, mas a placa-mãe é ${platform.socket}.`,
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
          title: `${part.name} instalado`,
          message: 'Próximo passo: aplique a Pasta Térmica sobre o processador.'
        });
        return;
      }

      if (part.category === 'thermal') {
        if (targetSlot !== 'slot-thermal' && targetSlot !== 'slot-cpu' && targetSlot !== 'slot-cooler') {
          registerPenalty(
            `${part.id}-wrong-slot-${targetSlot}`,
            'Local incorreto para Pasta Térmica',
            'Aplique diretamente sobre o processador.',
            10,
            'cooler'
          );
          return;
        }
        if (!state.slots['slot-cpu']) {
          registerPenalty(
            `${part.id}-no-cpu`,
            'CPU ausente',
            'Instale o processador antes de aplicar a pasta térmica.',
            15,
            'cpu'
          );
          return;
        }
        if (state.slots['slot-thermal']) {
          registerPenalty('thermal-already-applied', 'Já aplicada', 'Limpe a camada atual primeiro.', 5, 'cooler');
          return;
        }

        if (part.isInvalidMaterial) {
          setState((prev) => ({
            ...prev,
            timerRunning: true,
            slots: { ...prev.slots, 'slot-thermal': part.id }
          }));
          setSelectedPartId(null);
          registerPenalty(
            'super-bonder-applied',
            'Material Inadequado (Super Bonder!)',
            'Cola cianoacrilato é isolante térmico! Clique em "Limpar c/ Álcool" no slot térmico.',
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
          title: 'Pasta Térmica aplicada',
          message: 'Agora instale o Cooler compatível sobre o processador.'
        });
        return;
      }

      if (part.category === 'cooler') {
        if (targetSlot !== 'slot-cooler' && targetSlot !== 'slot-thermal' && targetSlot !== 'slot-cpu') {
          registerPenalty(
            `${part.id}-wrong-slot-${targetSlot}`,
            'Local incorreto para o Cooler',
            'Instale o Cooler sobre o conjunto da CPU.',
            15,
            'cooler'
          );
          return;
        }
        if (!state.slots['slot-cpu']) {
          registerPenalty(`${part.id}-no-cpu`, 'CPU ausente', 'Instale a CPU e a pasta térmica primeiro.', 15, 'cpu');
          return;
        }
        if (!state.slots['slot-thermal']) {
          registerPenalty(
            `${part.id}-no-paste`,
            'Falta Pasta Térmica!',
            'Nunca monte o cooler a seco. Aplique a Pasta Térmica antes do Cooler.',
            15,
            'cooler'
          );
          return;
        }
        if (state.slots['slot-thermal'] === 'pasta-errada') {
          registerPenalty(
            `${part.id}-over-superbonder`,
            'Superfície com Super Bonder',
            'Limpe o Super Bonder e aplique Pasta Térmica antes de montar o Cooler.',
            15,
            'cooler'
          );
          return;
        }
        if (state.slots['slot-cooler']) {
          registerPenalty('cooler-already-installed', 'Cooler já instalado', 'Já há um cooler montado.', 10, 'cooler');
          return;
        }
        if (part.socket !== platform.socket) {
          registerPenalty(
            `cooler-socket-mismatch-${part.id}-${platform.id}`,
            `Suporte incompatível (${part.socket} vs ${platform.socket})`,
            `O ${part.name} possui furação ${part.socket}, incompatível com a placa ${platform.socket}.`,
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
          title: `${part.name} instalado`,
          message: 'Conjunto térmico (CPU + Pasta + Cooler) concluído.'
        });
        return;
      }

      if (part.category === 'ram') {
        if (targetSlot !== 'slot-ram') {
          registerPenalty(
            `${part.id}-wrong-slot-${targetSlot}`,
            'Slot incorreto para Memória RAM',
            'Instale a RAM no slot DIMM.',
            15,
            'ram'
          );
          return;
        }
        if (state.slots['slot-ram']) {
          registerPenalty('ram-slot-occupied', 'Slot DIMM ocupado', 'Já existe memória instalada.', 10, 'ram');
          return;
        }
        if (part.memoryType !== platform.memoryType) {
          registerPenalty(
            `ram-type-mismatch-${part.id}-${platform.id}`,
            `Padrão incompatível (${part.memoryType} vs ${platform.memoryType})`,
            `Esta placa usa slots ${platform.memoryType}. O módulo ${part.name} possui chanfro físico diferente.`,
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
          title: `${part.name} instalada`,
          message: `Módulo ${part.memoryType} travado no slot DIMM.`
        });
        return;
      }

      if (part.category === 'storage') {
        if (part.storageInterface === 'M.2_NVME') {
          if (targetSlot === 'slot-sata') {
            registerPenalty(
              'm2-in-sata-bay',
              'Interface incorreta para SSD M.2',
              'O SSD NVMe M.2 encaixa diretamente no slot M.2 da placa-mãe, não na baia 2,5".',
              20,
              'ssd'
            );
            return;
          }
          if (targetSlot !== 'slot-m2') {
            registerPenalty(
              `m2-wrong-slot-${targetSlot}`,
              'Local incorreto para SSD M.2',
              'Instale o SSD NVMe no slot M.2 da placa-mãe.',
              15,
              'ssd'
            );
            return;
          }
          if (state.slots['slot-m2']) {
            registerPenalty('m2-occupied', 'Slot M.2 ocupado', 'Já há um SSD M.2 instalado.', 10, 'ssd');
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
            title: `${part.name} instalado`,
            message: 'Conectado ao barramento M.2 PCIe da placa-mãe.'
          });
          return;
        }

        if (part.storageInterface === 'SATA_25') {
          if (targetSlot === 'slot-m2') {
            registerPenalty(
              'sata-in-m2-slot',
              'SSD SATA 2,5" não cabe no slot M.2',
              'Instale o SSD SATA de 2,5" na Baia 2,5" SATA do Gabinete.',
              25,
              'ssd'
            );
            return;
          }
          if (targetSlot !== 'slot-sata') {
            registerPenalty(
              `sata-wrong-slot-${targetSlot}`,
              'Local incorreto para SSD SATA 2,5"',
              'Monte o SSD SATA na Baia 2,5" do Gabinete.',
              15,
              'ssd'
            );
            return;
          }
          if (state.slots['slot-sata']) {
            registerPenalty('sata-occupied', 'Baia 2,5" ocupada', 'Já há um SSD SATA instalado.', 10, 'ssd');
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
            title: `${part.name} instalado`,
            message: 'Fixado na baia 2,5" do gabinete com cabo SATA III.'
          });
          return;
        }
      }

      if (part.category === 'gpu') {
        if (targetSlot !== 'slot-gpu') {
          registerPenalty(
            `${part.id}-wrong-slot-${targetSlot}`,
            'Slot incorreto para Placa de Vídeo',
            'A GPU deve ser instalada no slot PCIe x16 da placa-mãe.',
            15,
            'video'
          );
          return;
        }
        if (state.slots['slot-gpu']) {
          registerPenalty('gpu-slot-occupied', 'Slot PCIe x16 ocupado', 'Remova a GPU atual primeiro.', 10, 'video');
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
          title: `${part.name} instalada`,
          message: `Consumo de +${part.watts}W adicionado no barramento PCIe x16.`
        });
        return;
      }

      if (part.category === 'psu') {
        if (targetSlot !== 'slot-psu') {
          registerPenalty(
            `${part.id}-wrong-slot-${targetSlot}`,
            'A Fonte não encaixa na placa-mãe',
            'Instale a Fonte (PSU) no Compartimento da Fonte do Gabinete.',
            15,
            'fonte'
          );
          return;
        }
        if (state.slots['slot-psu']) {
          registerPenalty('psu-slot-occupied', 'Fonte já instalada', 'Remova a fonte atual para trocá-la.', 10, 'fonte');
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
          title: `${part.name} instalada`,
          message: 'Cabos ATX 24p, EPS 8p e PCIe conectados.'
        });
        return;
      }
    },
    [state.finished, state.slots, installedIds, platform, getItem, registerPenalty, screwsInstalledCount]
  );

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

  const handlePowerButton = () => {
    if (state.finished) {
      setReportModalOpen(true);
      return;
    }

    const issues: { title: string; detail: string; libraryId: string }[] = [];

    if (!state.slots['slot-cpu']) {
      issues.push({
        title: 'Processador (CPU) ausente',
        detail: `O socket ${platform.socket} está vazio.`,
        libraryId: 'cpu'
      });
    }

    if (!state.slots['slot-thermal']) {
      issues.push({
        title: 'Pasta térmica não aplicada',
        detail: 'Aplique pasta térmica sobre a CPU para transferir calor ao cooler.',
        libraryId: 'cooler'
      });
    } else if (state.slots['slot-thermal'] === 'pasta-errada') {
      issues.push({
        title: 'Contaminação por Super Bonder',
        detail: 'Limpe o Super Bonder com álcool isopropílico e aplique Pasta Térmica.',
        libraryId: 'cooler'
      });
    }

    if (!state.slots['slot-cooler']) {
      issues.push({
        title: 'Cooler ausente',
        detail: 'Instale o cooler compatível sobre o processador.',
        libraryId: 'cooler'
      });
    }

    if (!state.slots['slot-ram']) {
      issues.push({
        title: 'Memória RAM ausente',
        detail: `Instale um módulo ${platform.memoryType} no slot DIMM.`,
        libraryId: 'ram'
      });
    }

    if (!state.slots['slot-m2'] && !state.slots['slot-sata']) {
      issues.push({
        title: 'Sem armazenamento (SSD)',
        detail: 'Instale um SSD M.2 na placa-mãe ou um SSD SATA 2,5" no gabinete.',
        libraryId: 'ssd'
      });
    }

    if (!state.slots['slot-gpu']) {
      issues.push({
        title: 'Sem Placa de Vídeo (GPU)',
        detail: 'Instale uma placa de vídeo dedicada no slot PCIe x16.',
        libraryId: 'video'
      });
    }

    if (screwsInstalledCount < 4) {
      issues.push({
        title: `Fixação incompleta (${screwsInstalledCount}/4 parafusos M3)`,
        detail: 'Fixe todos os 4 cantos da placa-mãe aos espaçadores do gabinete.',
        libraryId: 'placa'
      });
    }

    if (!state.slots['slot-psu']) {
      issues.push({
        title: 'Fonte de Alimentação ausente',
        detail: 'Instale uma fonte no compartimento do gabinete.',
        libraryId: 'fonte'
      });
    } else if (powerMetrics.powerStatus === 'overload' || powerMetrics.powerStatus === 'tight') {
      issues.push({
        title: `Fonte subdimensionada (${powerMetrics.nominalPsuWatts}W instalado vs ${powerMetrics.recommendedMinPsuWatts}W recomendados)`,
        detail: `O conjunto consome ${powerMetrics.estimatedContinuousWatts}W e pede margem de segurança (+30%). Substitua pela Fonte de 650W.`,
        libraryId: 'fonte'
      });
    }

    if (issues.length > 0) {
      registerPenalty(
        `boot-failed-${issues.map((i) => i.title).join('|')}`,
        'Falha na Inicialização (POST)',
        `Corrija ${issues.length} pendência(s) técnica(s) para iniciar o computador.`,
        25
      );
      setBootDiagnosticModal({ open: true, issues });
      return;
    }

    setState((prev) => ({
      ...prev,
      finished: true,
      timerRunning: false,
      bootStatus: 'success',
      score: prev.score + 30
    }));
    setFeedback({
      type: 'success',
      title: 'POST Concluído — Computador Inicializado! (+30 pts)',
      message: 'Todos os componentes estão compatíveis, refrigerados e alimentados com segurança.'
    });
    setReportModalOpen(true);
  };

  const filteredInventory = useMemo(() => {
    return INVENTORY_ITEMS.filter((item) => {
      if (hideInstalled && installedIds.includes(item.id)) return false;
      if (inventoryCategory !== 'all' && item.category !== inventoryCategory) return false;
      return true;
    });
  }, [inventoryCategory, hideInstalled, installedIds]);

  const getCompatibilityHint = (item: InventoryItem): { compatible: boolean; label: string } => {
    if (item.isInvalidMaterial) {
      return { compatible: false, label: 'Inadequado' };
    }
    if (item.socket && item.socket !== platform.socket) {
      return { compatible: false, label: `Requer ${item.socket}` };
    }
    if (item.memoryType && item.memoryType !== platform.memoryType) {
      return { compatible: false, label: `Requer ${item.memoryType}` };
    }
    return { compatible: true, label: 'Compatível' };
  };

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
    }
  };

  const checklistRows = useMemo(() => {
    return [
      {
        label: `1. CPU (${platform.socket})`,
        value: getItem(state.slots['slot-cpu'])?.name || 'Pendente',
        ok: Boolean(state.slots['slot-cpu']),
        err: false
      },
      {
        label: '2. Pasta Térmica',
        value:
          state.slots['slot-thermal'] === 'pasta-errada'
            ? 'Super Bonder!'
            : state.slots['slot-thermal']
            ? 'Aplicada'
            : 'Pendente',
        ok: state.slots['slot-thermal'] === 'pasta-termica',
        err: state.slots['slot-thermal'] === 'pasta-errada'
      },
      {
        label: `3. Cooler (${platform.socket})`,
        value: getItem(state.slots['slot-cooler'])?.name || 'Pendente',
        ok: Boolean(state.slots['slot-cooler']),
        err: false
      },
      {
        label: `4. RAM (${platform.memoryType})`,
        value: getItem(state.slots['slot-ram'])?.name || 'Pendente',
        ok: Boolean(state.slots['slot-ram']),
        err: false
      },
      {
        label: '5. SSD (M.2 / SATA)',
        value:
          state.slots['slot-m2'] && state.slots['slot-sata']
            ? 'M.2 + SATA'
            : getItem(state.slots['slot-m2'])?.name ||
              getItem(state.slots['slot-sata'])?.name ||
              'Pendente',
        ok: Boolean(state.slots['slot-m2'] || state.slots['slot-sata']),
        err: false
      },
      {
        label: '6. GPU (PCIe x16)',
        value: getItem(state.slots['slot-gpu'])?.name || 'Pendente',
        ok: Boolean(state.slots['slot-gpu']),
        err: false
      },
      {
        label: '7. Fonte (PSU)',
        value: getItem(state.slots['slot-psu'])?.name || 'Pendente',
        ok: Boolean(state.slots['slot-psu']) && powerMetrics.powerStatus === 'optimal',
        err: Boolean(state.slots['slot-psu']) && powerMetrics.powerStatus !== 'optimal'
      },
      {
        label: '8. Parafusos M3',
        value: `${screwsInstalledCount}/4`,
        ok: screwsInstalledCount === 4,
        err: false
      }
    ];
  }, [state.slots, platform, getItem, powerMetrics.powerStatus, screwsInstalledCount]);

  const completedStepsCount = useMemo(
    () => checklistRows.filter((r) => r.ok).length,
    [checklistRows]
  );

  const selectedPart = getItem(selectedPartId);

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-6 py-4">
      {/* BARRA DE COMANDO COMPACTA */}
      <div className="bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-lg px-4 py-2.5 mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-mono uppercase tracking-wider text-[#475569] dark:text-[#A2AFBE]">
            Placa-Mãe:
          </span>
          <div
            className="inline-flex items-center p-0.5 bg-[#F1F5F9] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542] rounded-md"
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
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-[#3979B7] text-white'
                      : 'text-[#475569] dark:text-[#A2AFBE] hover:text-[#0F172A] dark:hover:text-[#F2F5F8]'
                  }`}
                >
                  {p.socket} · {p.memoryType}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
            <span className="text-[#475569] dark:text-[#A2AFBE]">
              Checklist: <strong className="text-[#0F172A] dark:text-[#F2F5F8]">{completedStepsCount}/8</strong>
            </span>
            <span className="text-[#E2E8F0] dark:text-[#2A3542]">|</span>
            <span className="text-[#475569] dark:text-[#A2AFBE]">
              Pontos: <strong className="text-[#0F172A] dark:text-[#F2F5F8]">{state.score}</strong>
            </span>
            <span className="text-[#E2E8F0] dark:text-[#2A3542]">|</span>
            <span className="text-[#3979B7] font-semibold">{formatTime(state.elapsedSeconds)}</span>
          </div>

          <button
            type="button"
            onClick={handleResetWorkbench}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#475569] dark:text-[#A2AFBE] hover:text-[#0F172A] dark:hover:text-[#F2F5F8] bg-[#F8FAFC] dark:bg-[#1C2734] border border-[#E2E8F0] dark:border-[#2A3542] rounded-md transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>

      {/* BARRA CONTEXTUAL DE PEÇA SELECIONADA OU FEEDBACK */}
      {selectedPart && (
        <div
          role="region"
          aria-live="polite"
          className="mb-3 px-3.5 py-2.5 rounded-lg bg-[#3979B7]/15 border border-[#3979B7] flex flex-wrap items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2 text-xs">
            <Wrench className="w-4 h-4 text-[#3979B7] shrink-0" />
            <span className="font-bold text-[#0F172A] dark:text-[#F2F5F8]">
              Selecionado: {selectedPart.name}
            </span>
            <span className="text-[#475569] dark:text-[#A2AFBE] hidden sm:inline">
              — Clique no slot destacado no gabinete para instalar.
            </span>
          </div>

          <div className="flex items-center gap-2">
            {highlightedSlots.length > 0 && (
              <button
                type="button"
                onClick={() => attemptInstallPart(selectedPart.id, highlightedSlots[0])}
                className="px-2.5 py-1 text-xs font-semibold text-white bg-[#3979B7] hover:bg-[#5397D1] rounded cursor-pointer"
              >
                Instalar no Slot Destacado
              </button>
            )}
            <button
              type="button"
              onClick={() => setSelectedPartId(null)}
              className="px-2 py-1 text-xs text-[#475569] dark:text-[#A2AFBE] hover:text-[#0F172A] dark:hover:text-[#F2F5F8] cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`mb-3 px-3.5 py-2.5 rounded-lg border flex items-center justify-between gap-3 text-xs ${
            feedback.type === 'error'
              ? 'bg-[#EF4444]/10 border-[#EF4444]/40 text-[#991B1B] dark:text-[#FECACA]'
              : feedback.type === 'warning'
              ? 'bg-[#F59E0B]/10 border-[#F59E0B]/40 text-[#92400E] dark:text-[#FDE68A]'
              : feedback.type === 'success'
              ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#065F46] dark:text-[#A7F3D0]'
              : 'bg-[#3979B7]/10 border-[#3979B7]/40 text-[#0F172A] dark:text-[#F2F5F8]'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'error' ? (
              <XCircle className="w-4 h-4 shrink-0 text-[#EF4444]" />
            ) : feedback.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#F59E0B]" />
            ) : feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#10B981]" />
            ) : (
              <Info className="w-4 h-4 shrink-0 text-[#3979B7]" />
            )}
            <div>
              <strong>{feedback.title}</strong>
              {feedback.penalty && feedback.penalty > 0 ? (
                <span className="ml-1.5 font-mono">(-{feedback.penalty} pts)</span>
              ) : null}
              <span className="ml-1.5 opacity-90">{feedback.message}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {feedback.relatedLibraryId && (
              <button
                type="button"
                onClick={() => onOpenLibraryComponent(feedback.relatedLibraryId!)}
                className="underline font-semibold cursor-pointer"
              >
                Ver na Biblioteca
              </button>
            )}
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="p-0.5 opacity-75 hover:opacity-100 cursor-pointer"
              aria-label="Fechar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* NAVEGAÇÃO MOBILE */}
      <div className="flex lg:hidden items-center gap-1 p-1 mb-3 bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-lg">
        <button
          type="button"
          onClick={() => setMobilePanel('inventory')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
            mobilePanel === 'inventory'
              ? 'bg-[#3979B7] text-white'
              : 'text-[#475569] dark:text-[#A2AFBE]'
          }`}
        >
          Peças ({INVENTORY_ITEMS.length - installedIds.length})
        </button>
        <button
          type="button"
          onClick={() => setMobilePanel('stage')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
            mobilePanel === 'stage'
              ? 'bg-[#3979B7] text-white'
              : 'text-[#475569] dark:text-[#A2AFBE]'
          }`}
        >
          Gabinete
        </button>
        <button
          type="button"
          onClick={() => setMobilePanel('diagnostics')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
            mobilePanel === 'diagnostics'
              ? 'bg-[#3979B7] text-white'
              : 'text-[#475569] dark:text-[#A2AFBE]'
          }`}
        >
          Status ({completedStepsCount}/8)
        </button>
      </div>

      {/* GRID PRINCIPAL DE 3 COLUNAS LIMPO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* COLUNA 1: INVENTÁRIO ENXUTO */}
        <aside
          aria-label="Inventário de Peças"
          className={`lg:col-span-3 bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-lg overflow-hidden flex flex-col ${
            mobilePanel === 'inventory' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <div className="p-3 border-b border-[#E2E8F0] dark:border-[#2A3542]">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F2F5F8]">
                1. Peças Disponíveis
              </h2>
              <label className="inline-flex items-center gap-1.5 text-[11px] text-[#475569] dark:text-[#A2AFBE] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hideInstalled}
                  onChange={(e) => setHideInstalled(e.target.checked)}
                  className="rounded border-[#E2E8F0] dark:border-[#2A3542]"
                />
                <span>Ocultar instaladas</span>
              </label>
            </div>

            <div className="flex flex-wrap gap-1">
              {CATEGORY_TABS.map((tab) => {
                const active = inventoryCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setInventoryCategory(tab.id)}
                    className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors cursor-pointer ${
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

          <div className="p-2.5 space-y-1.5 max-h-[540px] overflow-y-auto">
            {filteredInventory.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#475569] dark:text-[#A2AFBE]">
                Nenhuma peça pendente nesta categoria.
              </div>
            ) : (
              filteredInventory.map((item) => {
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
                      if (mobilePanel === 'inventory') setMobilePanel('stage');
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
                    className={`px-3 py-2 rounded-md border text-left transition-all select-none ${
                      isInstalled
                        ? 'bg-[#F8FAFC] dark:bg-[#0C1118]/40 border-[#E2E8F0] dark:border-[#2A3542]/50 opacity-50 cursor-default'
                        : isSelected
                        ? 'bg-[#3979B7]/15 border-[#3979B7] ring-1 ring-[#3979B7] cursor-pointer'
                        : 'bg-[#F8FAFC] dark:bg-[#1C2734]/60 border-[#E2E8F0] dark:border-[#2A3542] hover:border-[#3979B7] cursor-grab active:cursor-grabbing'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#0F172A] dark:text-[#F2F5F8] truncate">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            isInstalled
                              ? 'bg-[#10B981]/15 text-[#10B981]'
                              : compat.compatible
                              ? 'bg-[#10B981]/10 text-[#10B981]'
                              : 'bg-[#F59E0B]/15 text-[#F59E0B]'
                          }`}
                        >
                          {isInstalled ? 'Instalado' : compat.label}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenLibraryComponent(item.libraryComponentId);
                          }}
                          className="p-0.5 text-[#475569] dark:text-[#A2AFBE] hover:text-[#3979B7] cursor-pointer"
                          title="Abrir ficha na Biblioteca"
                          aria-label={`Consultar ${item.name} na Biblioteca`}
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-[#475569] dark:text-[#A2AFBE] truncate">
                      {item.specsSummary}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* COLUNA 2: GABINETE E PLACA-MÃE ESQUEMÁTICA LIMPA */}
        <section
          aria-label="Área de Montagem do Gabinete"
          className={`lg:col-span-6 bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-lg p-4 ${
            mobilePanel === 'stage' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-[#E2E8F0] dark:border-[#2A3542]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F2F5F8]">
              2. Gabinete ATX — {platform.name}
            </h2>
            <span className="font-mono text-xs text-[#475569] dark:text-[#A2AFBE]">
              Fixação M3: <strong className="text-[#0F172A] dark:text-[#F2F5F8]">{screwsInstalledCount}/4</strong>
            </span>
          </div>

          <div className="bg-[#0E151F] border border-[#2A3542] rounded-lg p-3.5 text-[#F2F5F8] space-y-3">
            {/* PLACA-MÃE (PCB) */}
            <div className="bg-[#131E2B] border border-[#3979B7]/60 rounded-lg p-3.5 space-y-3">
              {/* Barra Superior da PCB: Identificação + 4 Espaçadores M3 agrupados */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#2A3542]">
                <span className="text-[11px] font-mono text-[#A2AFBE]">
                  PLACA-MÃE ({platform.socket} · {platform.memoryType})
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-[#A2AFBE] mr-1">Parafusos M3:</span>
                  {(['screw-hole-1', 'screw-hole-2', 'screw-hole-3', 'screw-hole-4'] as const).map(
                    (holeId, idx) => {
                      const installedScrew = state.slots[holeId];
                      const isHighlighted = highlightedSlots.includes(holeId);
                      return (
                        <button
                          key={holeId}
                          type="button"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDropOnSlot(e, holeId)}
                          onClick={() =>
                            installedScrew ? handleRemoveFromSlot(holeId) : handleSlotClick(holeId)
                          }
                          className={`w-7 h-7 rounded border flex items-center justify-center font-mono text-xs transition-all cursor-pointer ${
                            installedScrew
                              ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981]'
                              : isHighlighted
                              ? 'bg-[#3979B7]/30 border-[#5397D1] text-white'
                              : 'bg-[#0C1118] border-[#47586B] text-[#A2AFBE] hover:border-[#5397D1]'
                          }`}
                          title={
                            installedScrew
                              ? `Parafuso M3 #${idx + 1} instalado (clique para remover)`
                              : `Espaçador M3 #${idx + 1}`
                          }
                          aria-label={`Espaçador de parafuso ${idx + 1}`}
                        >
                          {installedScrew ? '●' : idx + 1}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Linha 1 da PCB: Bloco CPU (Esquerda) + Slot RAM (Direita) */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                {/* Bloco Conjunto CPU + Térmica + Cooler */}
                <div className="sm:col-span-7 bg-[#0C1118]/80 border border-[#2A3542] rounded-md p-2.5 space-y-2">
                  <div className="text-[10px] font-mono uppercase text-[#A2AFBE]">
                    Conjunto do Processador ({platform.socket})
                  </div>

                  {/* 1. CPU */}
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnSlot(e, 'slot-cpu')}
                    onClick={() => handleSlotClick('slot-cpu')}
                    tabIndex={0}
                    role="button"
                    className={`px-2.5 py-2 rounded border border-dashed flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      state.slots['slot-cpu']
                        ? 'bg-[#162822] border-[#10B981] border-solid'
                        : highlightedSlots.includes('slot-cpu')
                        ? 'bg-[#3979B7]/25 border-[#5397D1]'
                        : 'bg-[#151D28] border-[#3979B7]/40 hover:border-[#5397D1]'
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-[#A2AFBE] block">1. Socket CPU</span>
                      <span className="text-xs font-bold text-white truncate block">
                        {state.slots['slot-cpu']
                          ? getItem(state.slots['slot-cpu'])?.name
                          : `Vazio (${platform.socket})`}
                      </span>
                    </div>
                    {state.slots['slot-cpu'] && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromSlot('slot-cpu');
                        }}
                        className="p-1 text-[#A2AFBE] hover:text-[#EF4444] cursor-pointer"
                        title="Remover CPU"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* 2. Pasta Térmica */}
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnSlot(e, 'slot-thermal')}
                    onClick={() => handleSlotClick('slot-thermal')}
                    tabIndex={0}
                    role="button"
                    className={`px-2.5 py-2 rounded border border-dashed flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      state.slots['slot-thermal'] === 'pasta-errada'
                        ? 'bg-[#EF4444]/20 border-[#EF4444] border-solid'
                        : state.slots['slot-thermal']
                        ? 'bg-[#162822] border-[#10B981] border-solid'
                        : highlightedSlots.includes('slot-thermal')
                        ? 'bg-[#3979B7]/25 border-[#5397D1]'
                        : 'bg-[#151D28] border-[#3979B7]/40 hover:border-[#5397D1]'
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-[#A2AFBE] block">2. Interface Térmica</span>
                      <span className="text-xs font-bold text-white truncate block">
                        {state.slots['slot-thermal'] === 'pasta-errada'
                          ? 'ERRO: Super Bonder!'
                          : state.slots['slot-thermal']
                          ? 'Pasta Térmica OK'
                          : 'Vazio (Aplicar Pasta)'}
                      </span>
                    </div>
                    {state.slots['slot-thermal'] && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromSlot('slot-thermal');
                        }}
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded cursor-pointer ${
                          state.slots['slot-thermal'] === 'pasta-errada'
                            ? 'bg-[#EF4444] text-white'
                            : 'text-[#A2AFBE] hover:text-[#EF4444]'
                        }`}
                      >
                        {state.slots['slot-thermal'] === 'pasta-errada' ? 'Limpar' : 'Remover'}
                      </button>
                    )}
                  </div>

                  {/* 3. Cooler */}
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnSlot(e, 'slot-cooler')}
                    onClick={() => handleSlotClick('slot-cooler')}
                    tabIndex={0}
                    role="button"
                    className={`px-2.5 py-2 rounded border border-dashed flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      state.slots['slot-cooler']
                        ? 'bg-[#162822] border-[#10B981] border-solid'
                        : highlightedSlots.includes('slot-cooler')
                        ? 'bg-[#3979B7]/25 border-[#5397D1]'
                        : 'bg-[#151D28] border-[#3979B7]/40 hover:border-[#5397D1]'
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-[#A2AFBE] block">3. Cooler CPU</span>
                      <span className="text-xs font-bold text-white truncate block">
                        {state.slots['slot-cooler']
                          ? getItem(state.slots['slot-cooler'])?.name
                          : `Vazio (${platform.socket})`}
                      </span>
                    </div>
                    {state.slots['slot-cooler'] && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromSlot('slot-cooler');
                        }}
                        className="p-1 text-[#A2AFBE] hover:text-[#EF4444] cursor-pointer"
                        title="Remover Cooler"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Slot Memória RAM */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnSlot(e, 'slot-ram')}
                  onClick={() => handleSlotClick('slot-ram')}
                  tabIndex={0}
                  role="button"
                  className={`sm:col-span-5 rounded-md p-3 border border-dashed flex flex-col justify-between transition-all cursor-pointer ${
                    state.slots['slot-ram']
                      ? 'bg-[#162822] border-[#10B981] border-solid'
                      : highlightedSlots.includes('slot-ram')
                      ? 'bg-[#3979B7]/25 border-[#5397D1]'
                      : 'bg-[#0C1118]/80 border-[#3979B7]/40 hover:border-[#5397D1]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#A2AFBE]">
                    <span>SLOTS DIMM</span>
                    <span className="text-[#5397D1] font-bold">{platform.memoryType}</span>
                  </div>

                  <div className="my-2 flex items-center justify-center gap-2.5 py-2">
                    <div
                      className={`w-3 h-20 rounded-xs border ${
                        state.slots['slot-ram']
                          ? 'bg-[#10B981] border-white'
                          : 'bg-[#151D28] border-[#3979B7]/50'
                      }`}
                    />
                    <div className="w-3 h-20 rounded-xs border bg-[#151D28] border-[#2A3542]" />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-[#A2AFBE] block">Memória RAM</span>
                      <span className="text-xs font-bold text-white truncate block">
                        {state.slots['slot-ram']
                          ? getItem(state.slots['slot-ram'])?.name
                          : `Vazio (${platform.memoryType})`}
                      </span>
                    </div>
                    {state.slots['slot-ram'] && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromSlot('slot-ram');
                        }}
                        className="p-1 text-[#A2AFBE] hover:text-[#EF4444] cursor-pointer"
                        title="Remover RAM"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Linha 2 da PCB: M.2 NVMe + PCIe x16 GPU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Slot M.2 */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnSlot(e, 'slot-m2')}
                  onClick={() => handleSlotClick('slot-m2')}
                  tabIndex={0}
                  role="button"
                  className={`px-3 py-2.5 rounded-md border border-dashed flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    state.slots['slot-m2']
                      ? 'bg-[#162822] border-[#10B981] border-solid'
                      : highlightedSlots.includes('slot-m2')
                      ? 'bg-[#3979B7]/25 border-[#5397D1]'
                      : 'bg-[#0C1118]/80 border-[#3979B7]/40 hover:border-[#5397D1]'
                  }`}
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-[#A2AFBE] block">
                      Slot M.2 PCIe (Placa-Mãe)
                    </span>
                    <span className="text-xs font-bold text-white truncate block">
                      {state.slots['slot-m2']
                        ? getItem(state.slots['slot-m2'])?.name
                        : 'Vazio (SSD M.2 NVMe)'}
                    </span>
                  </div>
                  {state.slots['slot-m2'] && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromSlot('slot-m2');
                      }}
                      className="p-1 text-[#A2AFBE] hover:text-[#EF4444] cursor-pointer"
                      title="Remover SSD M.2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Slot GPU */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnSlot(e, 'slot-gpu')}
                  onClick={() => handleSlotClick('slot-gpu')}
                  tabIndex={0}
                  role="button"
                  className={`px-3 py-2.5 rounded-md border border-dashed flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    state.slots['slot-gpu']
                      ? 'bg-[#162822] border-[#10B981] border-solid'
                      : highlightedSlots.includes('slot-gpu')
                      ? 'bg-[#3979B7]/25 border-[#5397D1]'
                      : 'bg-[#0C1118]/80 border-[#3979B7]/40 hover:border-[#5397D1]'
                  }`}
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-[#A2AFBE] block">
                      Slot PCIe x16 (Placa de Vídeo)
                    </span>
                    <span className="text-xs font-bold text-white truncate block">
                      {state.slots['slot-gpu']
                        ? getItem(state.slots['slot-gpu'])?.name
                        : 'Vazio (Placa de Vídeo)'}
                    </span>
                  </div>
                  {state.slots['slot-gpu'] && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromSlot('slot-gpu');
                      }}
                      className="p-1 text-[#A2AFBE] hover:text-[#EF4444] cursor-pointer"
                      title="Remover GPU"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* REGIÕES EXTERNAS DO GABINETE (BAIA 2,5" + COMPARTIMENTO PSU) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Baia SATA 2,5" */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnSlot(e, 'slot-sata')}
                onClick={() => handleSlotClick('slot-sata')}
                tabIndex={0}
                role="button"
                className={`px-3 py-2.5 rounded-md border border-dashed flex items-center justify-between gap-2 transition-all cursor-pointer ${
                  state.slots['slot-sata']
                    ? 'bg-[#162822] border-[#10B981] border-solid'
                    : highlightedSlots.includes('slot-sata')
                    ? 'bg-[#3979B7]/25 border-[#5397D1]'
                    : 'bg-[#151D28] border-[#47586B] hover:border-[#5397D1]'
                }`}
              >
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-[#A2AFBE] block">
                    Baia 2,5" do Gabinete
                  </span>
                  <span className="text-xs font-bold text-white truncate block">
                    {state.slots['slot-sata']
                      ? getItem(state.slots['slot-sata'])?.name
                      : 'Vazio (SSD SATA 2,5")'}
                  </span>
                </div>
                {state.slots['slot-sata'] && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromSlot('slot-sata');
                    }}
                    className="p-1 text-[#A2AFBE] hover:text-[#EF4444] cursor-pointer"
                    title="Remover SSD SATA"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Compartimento da Fonte (PSU) */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnSlot(e, 'slot-psu')}
                onClick={() => handleSlotClick('slot-psu')}
                tabIndex={0}
                role="button"
                className={`px-3 py-2.5 rounded-md border border-dashed flex items-center justify-between gap-2 transition-all cursor-pointer ${
                  state.slots['slot-psu']
                    ? powerMetrics.powerStatus === 'optimal'
                      ? 'bg-[#162822] border-[#10B981] border-solid'
                      : 'bg-[#F59E0B]/15 border-[#F59E0B] border-solid'
                    : highlightedSlots.includes('slot-psu')
                    ? 'bg-[#3979B7]/25 border-[#5397D1]'
                    : 'bg-[#151D28] border-[#47586B] hover:border-[#5397D1]'
                }`}
              >
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-[#A2AFBE] block">
                    Compartimento da Fonte (PSU)
                  </span>
                  <span className="text-xs font-bold text-white truncate block">
                    {state.slots['slot-psu']
                      ? `${getItem(state.slots['slot-psu'])?.name} (${powerMetrics.nominalPsuWatts}W)`
                      : 'Vazio (Fonte ATX)'}
                  </span>
                </div>
                {state.slots['slot-psu'] && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromSlot('slot-psu');
                    }}
                    className="p-1 text-[#A2AFBE] hover:text-[#EF4444] cursor-pointer"
                    title="Remover Fonte"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* COLUNA 3: DIAGNÓSTICO E BALANÇO DE ENERGIA ENXUTO */}
        <aside
          aria-label="Painel de Diagnóstico e Energia"
          className={`lg:col-span-3 bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-lg p-3.5 flex flex-col justify-between ${
            mobilePanel === 'diagnostics' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <div className="space-y-3.5">
            {/* Balanço Elétrico Compacto */}
            <div className="p-3 rounded-md bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#0F172A] dark:text-[#F2F5F8] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#3979B7]" />
                  <span>Energia do Sistema</span>
                </span>
                <span className="font-mono text-[11px] text-[#3979B7] tabular-nums">
                  Rec: {powerMetrics.recommendedMinPsuWatts}W
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono tabular-nums">
                <div className="p-2 rounded bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542]">
                  <span className="text-[10px] text-[#475569] dark:text-[#A2AFBE] block">Consumo</span>
                  <strong className="text-[#0F172A] dark:text-[#F2F5F8]">
                    {powerMetrics.estimatedContinuousWatts} W
                  </strong>
                </div>
                <div className="p-2 rounded bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542]">
                  <span className="text-[10px] text-[#475569] dark:text-[#A2AFBE] block">Fonte</span>
                  <strong
                    className={
                      powerMetrics.powerStatus === 'optimal'
                        ? 'text-[#10B981]'
                        : powerMetrics.powerStatus === 'none'
                        ? 'text-[#475569] dark:text-[#A2AFBE]'
                        : 'text-[#F59E0B]'
                    }
                  >
                    {powerMetrics.nominalPsuWatts > 0 ? `${powerMetrics.nominalPsuWatts} W` : '—'}
                  </strong>
                </div>
              </div>

              <p className="mt-2 text-[11px] text-[#475569] dark:text-[#A2AFBE] leading-snug">
                {powerMetrics.powerStatusNote}
              </p>
            </div>

            {/* Checklist POST Enxuto */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F2F5F8]">
                  3. Checklist POST
                </span>
                <span className="font-mono text-[11px] text-[#475569] dark:text-[#A2AFBE]">
                  {completedStepsCount}/8 prontos
                </span>
              </div>

              <div className="divide-y divide-[#E2E8F0] dark:divide-[#2A3542] border-t border-b border-[#E2E8F0] dark:border-[#2A3542] text-xs">
                {checklistRows.map((row, idx) => (
                  <div key={idx} className="py-1.5 flex items-center justify-between gap-2">
                    <span className="text-[#475569] dark:text-[#A2AFBE] truncate">{row.label}</span>
                    <span
                      className={`font-mono text-[11px] font-medium inline-flex items-center gap-1 shrink-0 tabular-nums ${
                        row.err
                          ? 'text-[#EF4444]'
                          : row.ok
                          ? 'text-[#10B981]'
                          : 'text-[#475569] dark:text-[#A2AFBE]'
                      }`}
                    >
                      {row.err ? (
                        <AlertTriangle className="w-3 h-3" />
                      ) : row.ok ? (
                        <Check className="w-3 h-3" />
                      ) : null}
                      <span>{row.value}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-[#2A3542]">
            <button
              type="button"
              onClick={handlePowerButton}
              className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                state.finished
                  ? 'bg-[#10B981] hover:bg-[#059669] text-white'
                  : 'bg-[#3979B7] hover:bg-[#5397D1] text-white'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>
                {state.finished ? 'Sistema Ligado — Ver Relatório' : 'Ligar Computador (POST)'}
              </span>
            </button>
          </div>
        </aside>
      </div>

      {/* MODAL DE FALHA NO POST */}
      {bootDiagnosticModal.open && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="diag-modal-title"
        >
          <div className="bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-xl max-w-lg w-full p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3 pb-3 mb-3 border-b border-[#E2E8F0] dark:border-[#2A3542]">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
                <div>
                  <h2
                    id="diag-modal-title"
                    className="text-base font-bold text-[#0F172A] dark:text-[#F2F5F8]"
                  >
                    Falha no POST — Pendências Encontradas
                  </h2>
                  <p className="text-xs text-[#475569] dark:text-[#A2AFBE]">
                    Corrija os itens abaixo para inicializar o computador:
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBootDiagnosticModal({ open: false, issues: [] })}
                className="p-1 text-[#475569] dark:text-[#A2AFBE] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[55vh] overflow-y-auto">
              {bootDiagnosticModal.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542]"
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
                      className="text-[11px] font-semibold text-[#3979B7] hover:underline cursor-pointer shrink-0"
                    >
                      Ver na Biblioteca →
                    </button>
                  </div>
                  <p className="text-xs text-[#475569] dark:text-[#A2AFBE]">{issue.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-[#2A3542] flex justify-end">
              <button
                type="button"
                onClick={() => setBootDiagnosticModal({ open: false, issues: [] })}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#3979B7] hover:bg-[#5397D1] rounded-lg cursor-pointer"
              >
                Voltar à Bancada
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE RELATÓRIO DE SUCESSO */}
      {reportModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-modal-title"
        >
          <div className="bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-xl max-w-xl w-full p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3 pb-3 mb-4 border-b border-[#E2E8F0] dark:border-[#2A3542]">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <div>
                  <h2
                    id="report-modal-title"
                    className="text-base font-bold text-[#0F172A] dark:text-[#F2F5F8]"
                  >
                    POST Aprovado — Computador Funcionando!
                  </h2>
                  <p className="text-xs text-[#475569] dark:text-[#A2AFBE]">
                    Todos os componentes foram validados com sucesso.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="p-1 text-[#475569] dark:text-[#A2AFBE] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4 p-3 rounded-lg bg-[#0C1118] border border-[#2A3542] font-mono text-xs text-[#F2F5F8] space-y-1">
              <div className="text-[#10B981] font-bold">UEFI BIOS · POST OK</div>
              <div>PLACA : {platform.name}</div>
              <div>
                CPU   : {getItem(state.slots['slot-cpu'])?.name} +{' '}
                {getItem(state.slots['slot-cooler'])?.name}
              </div>
              <div>RAM   : {getItem(state.slots['slot-ram'])?.name}</div>
              <div>
                SSD   :{' '}
                {[
                  getItem(state.slots['slot-m2'])?.name,
                  getItem(state.slots['slot-sata'])?.name
                ]
                  .filter(Boolean)
                  .join(' + ')}
              </div>
              <div>GPU   : {getItem(state.slots['slot-gpu'])?.name}</div>
              <div>
                FONTE : {getItem(state.slots['slot-psu'])?.name} ({powerMetrics.estimatedContinuousWatts}W / {powerMetrics.nominalPsuWatts}W)
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mb-4 text-center">
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542]">
                <span className="text-[11px] text-[#475569] dark:text-[#A2AFBE] block">Pontuação</span>
                <strong className="font-mono text-lg text-[#10B981]">{state.score} pts</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542]">
                <span className="text-[11px] text-[#475569] dark:text-[#A2AFBE] block">Tempo</span>
                <strong className="font-mono text-lg text-[#3979B7]">
                  {formatTime(state.elapsedSeconds)}
                </strong>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542]">
                <span className="text-[11px] text-[#475569] dark:text-[#A2AFBE] block">Erros</span>
                <strong className="font-mono text-lg text-[#0F172A] dark:text-[#F2F5F8]">
                  {state.mistakes.length}
                </strong>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#E2E8F0] dark:border-[#2A3542]">
              <button
                type="button"
                onClick={() => {
                  const nextPlatform =
                    state.platformId === 'AM4_DDR4' ? 'LGA1700_DDR5' : 'AM4_DDR4';
                  setReportModalOpen(false);
                  handleSelectPlatform(nextPlatform);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-[#0F172A] dark:text-[#F2F5F8] bg-[#F1F5F9] dark:bg-[#1C2734] border border-[#E2E8F0] dark:border-[#2A3542] rounded-lg cursor-pointer"
              >
                Testar Plataforma {state.platformId === 'AM4_DDR4' ? 'LGA1700' : 'AM4'}
              </button>
              <button
                type="button"
                onClick={handleResetWorkbench}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#3979B7] hover:bg-[#5397D1] rounded-lg cursor-pointer"
              >
                Nova Montagem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
