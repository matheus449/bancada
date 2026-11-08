import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  CheckCircle2,
  Circle,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Wrench,
  X,
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  Layers,
  Eye,
  Award,
  ChevronRight,
  Check
} from 'lucide-react';
import {
  LIBRARY_COMPONENTS,
  QUIZ_QUESTIONS,
  ComponentCategory,
  LibraryComponent,
  WorkbenchPartCategory,
  QuizQuestion,
  QuizAttemptSummary,
  normalizeSearchText
} from '../data/hardwareData';
import { ComponentIllustration } from './HardwareSvg';

interface BibliotecaViewProps {
  studiedIds: string[];
  viewedIds: string[];
  onToggleStudied: (id: string) => void;
  onMarkViewed: (id: string) => void;
  onNavigateToWorkbench: (filterCategory?: WorkbenchPartCategory) => void;
  initialSelectedComponentId?: string | null;
  onClearInitialComponent?: () => void;
}

const ALL_CATEGORIES: ('Todas' | ComponentCategory)[] = [
  'Todas',
  'Estrutura & Conexão',
  'Processamento',
  'Refrigeração',
  'Memória',
  'Armazenamento',
  'Gráficos',
  'Energia'
];

const QUICK_SEARCH_TERMS = [
  'AM4',
  'LGA1700',
  'DDR4',
  'DDR5',
  'M.2',
  'NVMe',
  'Pasta Térmica',
  'Alimentação'
];

const QUIZ_HISTORY_KEY = 'hardwaredex_quiz_history';

export const BibliotecaView: React.FC<BibliotecaViewProps> = ({
  studiedIds,
  viewedIds,
  onToggleStudied,
  onMarkViewed,
  onNavigateToWorkbench,
  initialSelectedComponentId,
  onClearInitialComponent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Todas' | ComponentCategory>('Todas');
  const [activeComponentId, setActiveComponentId] = useState<string | null>(
    initialSelectedComponentId || null
  );

  // Estado do Módulo de Quiz (35 questões, 1 por vez)
  const [quizSectionOpen, setQuizSectionOpen] = useState(false);
  const [quizStage, setQuizStage] = useState<'setup' | 'active' | 'summary'>('setup');
  const [quizFilterScope, setQuizFilterScope] = useState<'all-10' | 'all-20' | 'all-35' | string>(
    'all-10'
  );
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<'a' | 'b' | 'c' | 'd' | null>(null);
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState(false);
  const [recordedAnswers, setRecordedAnswers] = useState<Record<string, 'a' | 'b' | 'c' | 'd'>>({});
  const [quizHistory, setQuizHistory] = useState<QuizAttemptSummary[]>(() => {
    try {
      const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.slice(0, 8);
      }
    } catch {
      // Ignore storage error
    }
    return [];
  });

  // Gerenciamento de foco e acessibilidade do modal
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);
  const modalContainerRef = useRef<HTMLDivElement | null>(null);
  const modalCloseBtnRef = useRef<HTMLButtonElement | null>(null);
  const quizSectionRef = useRef<HTMLElement | null>(null);

  const openComponentModal = useCallback(
    (id: string, triggerEl?: HTMLElement | null) => {
      if (triggerEl) {
        lastFocusedElementRef.current = triggerEl;
      } else if (document.activeElement instanceof HTMLElement) {
        lastFocusedElementRef.current = document.activeElement;
      }
      setActiveComponentId(id);
      onMarkViewed(id);
    },
    [onMarkViewed]
  );

  const closeComponentModal = useCallback(() => {
    setActiveComponentId(null);
    window.setTimeout(() => {
      if (lastFocusedElementRef.current && document.body.contains(lastFocusedElementRef.current)) {
        lastFocusedElementRef.current.focus();
      }
    }, 20);
  }, []);

  useEffect(() => {
    if (initialSelectedComponentId) {
      openComponentModal(initialSelectedComponentId);
      if (onClearInitialComponent) onClearInitialComponent();
    }
  }, [initialSelectedComponentId, onClearInitialComponent, openComponentModal]);

  // Bloqueio de scroll de fundo, tecla Esc e Focus Trap no modal de Ficha Técnica
  useEffect(() => {
    if (!activeComponentId) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    if (modalContainerRef.current) {
      modalContainerRef.current.scrollTop = 0;
    }
    window.setTimeout(() => {
      modalCloseBtnRef.current?.focus();
    }, 30);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeComponentModal();
        return;
      }
      if (e.key === 'Tab' && modalContainerRef.current) {
        const focusable = modalContainerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeComponentId, closeComponentModal]);

  // Pesquisa inteligente multi-campo com normalização de acentos e maiúsculas/minúsculas
  const filteredComponents = useMemo(() => {
    const normalizedQuery = normalizeSearchText(searchQuery);
    const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

    return LIBRARY_COMPONENTS.filter((comp) => {
      const matchesCategory =
        selectedCategory === 'Todas' || comp.category === selectedCategory;
      if (!matchesCategory) return false;
      if (queryTokens.length === 0) return true;

      const searchableCorpus = normalizeSearchText(
        [
          comp.name,
          comp.shortName,
          comp.category,
          comp.analogyTitle,
          comp.summary,
          comp.mainFunction,
          comp.whatIs,
          comp.howItWorks,
          comp.analogyText,
          ...comp.characteristics,
          ...comp.compatibility,
          ...comp.care,
          ...comp.commonMistakes,
          comp.inWorkbench,
          ...comp.searchKeywords
        ].join(' ')
      );

      return queryTokens.every((token) => searchableCorpus.includes(token));
    });
  }, [searchQuery, selectedCategory]);

  const activeComponent: LibraryComponent | null = useMemo(() => {
    if (!activeComponentId) return null;
    return LIBRARY_COMPONENTS.find((c) => c.id === activeComponentId) || null;
  }, [activeComponentId]);

  const studiedCount = studiedIds.length;
  const viewedCount = viewedIds.length;
  const totalCount = LIBRARY_COMPONENTS.length;
  const progressPercent = Math.round((studiedCount / totalCount) * 100);

  const unstudiedComponents = useMemo(() => {
    return LIBRARY_COMPONENTS.filter((c) => !studiedIds.includes(c.id));
  }, [studiedIds]);

  // Inicializar uma sessão do Quiz
  const startQuizSession = (scope = quizFilterScope) => {
    let pool: QuizQuestion[] = [];
    if (scope.startsWith('all-')) {
      const count = parseInt(scope.replace('all-', ''), 10) || 10;
      // Embaralhar de forma determinística/limpa mantendo distribuição
      const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
      pool = shuffled.slice(0, Math.min(count, QUIZ_QUESTIONS.length));
    } else {
      pool = QUIZ_QUESTIONS.filter((q) => q.componentId === scope);
    }

    if (pool.length === 0) {
      pool = QUIZ_QUESTIONS.slice(0, 10);
    }

    setActiveQuizQuestions(pool);
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsAnswerConfirmed(false);
    setRecordedAnswers({});
    setQuizStage('active');
  };

  const handleConfirmCurrentAnswer = () => {
    if (!selectedOptionId) return;
    const currentQ = activeQuizQuestions[currentQuestionIndex];
    if (!currentQ) return;
    setRecordedAnswers((prev) => ({ ...prev, [currentQ.id]: selectedOptionId }));
    setIsAnswerConfirmed(true);
  };

  const handleNextQuizQuestion = () => {
    if (currentQuestionIndex + 1 < activeQuizQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerConfirmed(false);
    } else {
      // Concluir avaliação e salvar no histórico local
      const totalQ = activeQuizQuestions.length;
      const correct = activeQuizQuestions.reduce((acc, q) => {
        const chosen = recordedAnswers[q.id];
        const opt = q.options.find((o) => o.id === chosen);
        return acc + (opt?.isCorrect ? 1 : 0);
      }, 0);
      const pct = totalQ > 0 ? Math.round((correct / totalQ) * 100) : 0;

      const modeLabel =
        quizFilterScope === 'all-35'
          ? 'Avaliação Completa (35 questões)'
          : quizFilterScope === 'all-20'
          ? 'Revisão Ampla (20 questões)'
          : quizFilterScope === 'all-10'
          ? 'Revisão Geral (10 questões)'
          : `Tema: ${
              LIBRARY_COMPONENTS.find((c) => c.id === quizFilterScope)?.shortName || 'Componente'
            }`;

      const attempt: QuizAttemptSummary = {
        id: `${Date.now()}`,
        dateIso: new Date().toLocaleDateString('pt-BR'),
        modeLabel,
        totalQuestions: totalQ,
        correctCount: correct,
        percentage: pct
      };

      setQuizHistory((prev) => {
        const updated = [attempt, ...prev].slice(0, 8);
        try {
          localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(updated));
        } catch {
          // Ignore storage error
        }
        return updated;
      });

      setQuizStage('summary');
    }
  };

  const currentQuestion = activeQuizQuestions[currentQuestionIndex] || null;

  const quizSummaryStats = useMemo(() => {
    const total = activeQuizQuestions.length;
    const correct = activeQuizQuestions.reduce((acc, q) => {
      const chosen = recordedAnswers[q.id];
      const opt = q.options.find((o) => o.id === chosen);
      return acc + (opt?.isCorrect ? 1 : 0);
    }, 0);
    const wrong = total - correct;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { total, correct, wrong, percentage };
  }, [activeQuizQuestions, recordedAnswers]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Área Introdutória e Painel de Progresso Pessoal */}
      <section className="mb-8 pb-8 border-b border-[#E2E8F0] dark:border-[#2A3542]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="text-xs font-medium text-[#475569] dark:text-[#A2AFBE] mb-2">
                Ambiente de Estudo e Consulta Técnica · 7 Componentes · 35 Questões de Revisão
              </div>
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A] dark:text-[#F2F5F8] mb-3"
                style={{ textWrap: 'balance' }}
              >
                Biblioteca de Arquitetura e Componentes de Hardware
              </h1>
              <p className="text-sm sm:text-base text-[#475569] dark:text-[#A2AFBE] leading-relaxed max-w-2xl">
                Estude a função física, os padrões de compatibilidade (sockets, memórias, barramentos) e os procedimentos seguros de montagem antes de aplicar o conhecimento na Bancada Virtual.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setQuizSectionOpen(true);
                  window.setTimeout(() => {
                    quizSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 50);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#3979B7] hover:bg-[#5397D1] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Iniciar Avaliação de Conhecimentos (35 Questões)</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToWorkbench()}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#0F172A] dark:text-[#F2F5F8] bg-white dark:bg-[#151D28] hover:bg-[#F1F5F9] dark:hover:bg-[#1C2734] border border-[#E2E8F0] dark:border-[#2A3542] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Wrench className="w-4 h-4 text-[#3979B7]" />
                <span>Praticar na Bancada Virtual</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. Painel de Acompanhamento de Estudos (Visualizado vs. Declarado como Estudado) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-1.5">
                <span className="text-sm font-semibold text-[#0F172A] dark:text-[#F2F5F8]">
                  Acompanhamento de Estudo Pessoal
                </span>
                <span className="font-mono text-sm font-bold text-[#3979B7] dark:text-[#5397D1] tabular-nums">
                  {studiedCount} / {totalCount} ({progressPercent}%)
                </span>
              </div>

              <div
                className="w-full h-2 bg-[#E2E8F0] dark:bg-[#0C1118] rounded-full overflow-hidden mb-3"
                role="progressbar"
                aria-label="Progresso de componentes declarados como estudados"
                aria-valuenow={studiedCount}
                aria-valuemin={0}
                aria-valuemax={totalCount}
              >
                <div
                  className="h-full bg-[#3979B7] transition-transform duration-200 origin-left"
                  style={{ transform: `scaleX(${studiedCount / totalCount})` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 my-3 p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542] text-xs">
                <div>
                  <span className="text-[#475569] dark:text-[#A2AFBE] block">
                    Fichas Visualizadas
                  </span>
                  <strong className="font-mono text-sm text-[#0F172A] dark:text-[#F2F5F8] tabular-nums">
                    {viewedCount} de {totalCount}
                  </strong>
                </div>
                <div className="border-l border-[#E2E8F0] dark:border-[#2A3542] pl-3">
                  <span className="text-[#475569] dark:text-[#A2AFBE] block">
                    Declarados Estudados
                  </span>
                  <strong className="font-mono text-sm text-[#10B981] tabular-nums">
                    {studiedCount} de {totalCount}
                  </strong>
                </div>
              </div>

              <p className="text-xs text-[#475569] dark:text-[#A2AFBE] leading-relaxed">
                {unstudiedComponents.length === 0 ? (
                  'Você declarou todos os 7 componentes como estudados! Recomendamos realizar a Avaliação Completa de 35 questões.'
                ) : (
                  <>
                    Pendentes de estudo:{' '}
                    <span className="text-[#0F172A] dark:text-[#F2F5F8] font-medium">
                      {unstudiedComponents.map((c) => c.shortName).join(', ')}
                    </span>
                    .
                  </>
                )}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-[#2A3542] flex items-center justify-between text-xs text-[#475569] dark:text-[#A2AFBE]">
              <span>Declaração manual salvo neste navegador</span>
              {quizHistory.length > 0 && (
                <span className="font-mono tabular-nums text-[#3979B7] dark:text-[#5397D1]">
                  Último Quiz: {quizHistory[0].percentage}% ({quizHistory[0].correctCount}/
                  {quizHistory[0].totalQuestions})
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Módulo Completo de Revisão e Avaliação (Quiz de 35 Questões, 1 por vez) */}
      {quizSectionOpen && (
        <section
          ref={quizSectionRef}
          aria-label="Módulo de Avaliação de Conhecimentos"
          className="mb-10 bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-xl p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-[#E2E8F0] dark:border-[#2A3542]">
            <div>
              <div className="text-xs text-[#475569] dark:text-[#A2AFBE]">
                Avaliação Formativa · Banco Técnico de {QUIZ_QUESTIONS.length} Questões
              </div>
              <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F2F5F8]">
                Revisão Estruturada de Conceitos de Hardware
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {quizStage !== 'setup' && (
                <button
                  type="button"
                  onClick={() => setQuizStage('setup')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F172A] dark:text-[#F2F5F8] bg-[#F1F5F9] dark:bg-[#1C2734] hover:border-[#3979B7] border border-[#E2E8F0] dark:border-[#2A3542] rounded-lg cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Trocar Modalidade</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setQuizSectionOpen(false)}
                className="p-1.5 text-[#475569] dark:text-[#A2AFBE] hover:text-[#0F172A] dark:hover:text-[#F2F5F8] rounded-lg cursor-pointer"
                aria-label="Fechar painel de avaliação"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* TELA 1 DO QUIZ: CONFIGURAÇÃO E ORIENTAÇÃO INICIAL */}
          {quizStage === 'setup' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-4">
                <p className="text-sm text-[#475569] dark:text-[#A2AFBE] leading-relaxed">
                  Selecione o formato da sua avaliação. As questões são apresentadas <strong>uma por vez</strong>. Ao confirmar cada resposta, você receberá a justificativa técnica imediata antes de avançar para a questão seguinte.
                </p>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3979B7] mb-2">
                    1. Avaliações Gerais (Todos os Componentes)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      {
                        id: 'all-10',
                        title: 'Revisão Rápida',
                        desc: '10 questões sorteadas'
                      },
                      {
                        id: 'all-20',
                        title: 'Revisão Intermediária',
                        desc: '20 questões sorteadas'
                      },
                      {
                        id: 'all-35',
                        title: 'Avaliação Completa',
                        desc: 'Todas as 35 questões'
                      }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setQuizFilterScope(opt.id)}
                        aria-pressed={quizFilterScope === opt.id}
                        className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                          quizFilterScope === opt.id
                            ? 'bg-[#3979B7]/15 border-[#3979B7] text-[#0F172A] dark:text-[#F2F5F8]'
                            : 'bg-[#F8FAFC] dark:bg-[#0C1118] border-[#E2E8F0] dark:border-[#2A3542] text-[#475569] dark:text-[#A2AFBE] hover:border-[#3979B7]'
                        }`}
                      >
                        <div className="text-xs font-bold text-[#0F172A] dark:text-[#F2F5F8]">
                          {opt.title}
                        </div>
                        <div className="text-[11px] mt-0.5">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3979B7] mb-2">
                    2. Ou Avaliar um Componente Específico (5 Questões por Tema)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {LIBRARY_COMPONENTS.map((comp) => (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={() => setQuizFilterScope(comp.id)}
                        aria-pressed={quizFilterScope === comp.id}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                          quizFilterScope === comp.id
                            ? 'bg-[#3979B7] text-white border-[#3979B7]'
                            : 'bg-[#F8FAFC] dark:bg-[#0C1118] border-[#E2E8F0] dark:border-[#2A3542] text-[#0F172A] dark:text-[#F2F5F8] hover:border-[#3979B7]'
                        }`}
                      >
                        {comp.shortName} (5)
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => startQuizSession(quizFilterScope)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#3979B7] hover:bg-[#5397D1] rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Começar Questionário Agora</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Histórico de Tentativas Salvas Localmente */}
              <div className="lg:col-span-5 p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542] flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F2F5F8] mb-3 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#3979B7]" />
                    <span>Histórico Recente neste Navegador</span>
                  </h3>
                  {quizHistory.length === 0 ? (
                    <p className="text-xs text-[#475569] dark:text-[#A2AFBE] leading-relaxed">
                      Nenhuma avaliação concluída ainda. Seus resultados aparecerão aqui assim que você finalizar um questionário.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {quizHistory.map((h) => (
                        <div
                          key={h.id}
                          className="p-2.5 rounded-lg bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-semibold text-[#0F172A] dark:text-[#F2F5F8]">
                              {h.modeLabel}
                            </div>
                            <div className="text-[11px] text-[#475569] dark:text-[#A2AFBE]">
                              Data: {h.dateIso}
                            </div>
                          </div>
                          <div className="font-mono font-bold text-right tabular-nums">
                            <span
                              className={
                                h.percentage >= 70 ? 'text-[#10B981]' : 'text-[#F59E0B]'
                              }
                            >
                              {h.percentage}%
                            </span>
                            <span className="block text-[11px] font-normal text-[#475569] dark:text-[#A2AFBE]">
                              {h.correctCount}/{h.totalQuestions} acertos
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-[#2A3542] text-[11px] text-[#475569] dark:text-[#A2AFBE]">
                  Total disponível no banco: 35 questões técnicas com 4 alternativas comentadas.
                </div>
              </div>
            </div>
          )}

          {/* TELA 2 DO QUIZ: UMA QUESTÃO POR VEZ COM CONFIRMAÇÃO E FEEDBACK IMEDIATO */}
          {quizStage === 'active' && currentQuestion && (
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs text-[#475569] dark:text-[#A2AFBE]">
                <span className="font-mono font-semibold text-[#3979B7] dark:text-[#5397D1] tabular-nums">
                  Questão {currentQuestionIndex + 1} de {activeQuizQuestions.length}
                </span>
                <span>
                  Componente:{' '}
                  <strong className="text-[#0F172A] dark:text-[#F2F5F8]">
                    {LIBRARY_COMPONENTS.find((c) => c.id === currentQuestion.componentId)?.shortName}
                  </strong>{' '}
                  · Nível/Eixo: {currentQuestion.topic}
                </span>
              </div>

              <div className="w-full h-1.5 bg-[#E2E8F0] dark:bg-[#0C1118] rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-[#3979B7] transition-all duration-200"
                  style={{
                    width: `${((currentQuestionIndex + 1) / activeQuizQuestions.length) * 100}%`
                  }}
                />
              </div>

              <div className="p-5 rounded-xl bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542]">
                <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F2F5F8] mb-5 leading-snug">
                  {currentQuestion.question}
                </h3>

                <div className="space-y-2.5" role="radiogroup" aria-label="Alternativas da questão">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    let optionStyle =
                      'bg-white dark:bg-[#151D28] border-[#E2E8F0] dark:border-[#2A3542] text-[#0F172A] dark:text-[#F2F5F8] hover:border-[#3979B7]';

                    if (isAnswerConfirmed) {
                      if (opt.isCorrect) {
                        optionStyle =
                          'bg-[#10B981]/15 border-[#10B981] text-[#0F172A] dark:text-[#F2F5F8]';
                      } else if (isSelected && !opt.isCorrect) {
                        optionStyle =
                          'bg-[#EF4444]/15 border-[#EF4444] text-[#0F172A] dark:text-[#F2F5F8]';
                      }
                    } else if (isSelected) {
                      optionStyle =
                        'bg-[#3979B7]/15 border-[#3979B7] ring-1 ring-[#3979B7] text-[#0F172A] dark:text-[#F2F5F8]';
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        disabled={isAnswerConfirmed}
                        onClick={() => setSelectedOptionId(opt.id)}
                        className={`w-full text-left p-3.5 rounded-lg border text-sm leading-relaxed transition-colors flex items-start gap-3 ${optionStyle} ${
                          isAnswerConfirmed ? 'cursor-default' : 'cursor-pointer'
                        }`}
                      >
                        <span className="font-mono font-bold uppercase shrink-0 mt-0.5">
                          {opt.id})
                        </span>
                        <span className="flex-1">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback imediato após confirmar */}
                {isAnswerConfirmed && selectedOptionId && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`mt-5 p-4 rounded-lg border text-xs leading-relaxed ${
                      currentQuestion.options.find((o) => o.id === selectedOptionId)?.isCorrect
                        ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#065F46] dark:text-[#A7F3D0]'
                        : 'bg-[#EF4444]/10 border-[#EF4444]/40 text-[#991B1B] dark:text-[#FECACA]'
                    }`}
                  >
                    <div className="font-bold mb-1 flex items-center gap-1.5 text-sm">
                      {currentQuestion.options.find((o) => o.id === selectedOptionId)?.isCorrect ? (
                        <>
                          <ShieldCheck className="w-4 h-4 shrink-0" />
                          <span>Resposta Correta!</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>
                            Resposta Incorreta (Alternativa correta:{' '}
                            {currentQuestion.options
                              .find((o) => o.isCorrect)
                              ?.id.toUpperCase()}
                            )
                          </span>
                        </>
                      )}
                    </div>
                    <p className="mb-2">
                      {
                        currentQuestion.options.find((o) => o.id === selectedOptionId)
                          ?.explanation
                      }
                    </p>
                    {!currentQuestion.options.find((o) => o.id === selectedOptionId)?.isCorrect && (
                      <p className="pt-2 border-t border-current/20">
                        <strong>Justificativa da correta: </strong>
                        {currentQuestion.options.find((o) => o.isCorrect)?.explanation}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-[#E2E8F0] dark:border-[#2A3542] flex items-center justify-between gap-3">
                  <span className="text-xs text-[#475569] dark:text-[#A2AFBE]">
                    {!isAnswerConfirmed
                      ? 'Selecione uma alternativa e confirme para ver a explicação técnica.'
                      : 'Explicação registrada. Avance quando estiver pronto.'}
                  </span>

                  {!isAnswerConfirmed ? (
                    <button
                      type="button"
                      disabled={!selectedOptionId}
                      onClick={handleConfirmCurrentAnswer}
                      className={`px-5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                        selectedOptionId
                          ? 'bg-[#3979B7] hover:bg-[#5397D1] text-white cursor-pointer'
                          : 'bg-[#E2E8F0] dark:bg-[#1C2734] text-[#475569] dark:text-[#A2AFBE] cursor-not-allowed'
                      }`}
                    >
                      Confirmar Resposta
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNextQuizQuestion}
                      className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#10B981] hover:bg-[#059669] rounded-lg cursor-pointer"
                    >
                      <span>
                        {currentQuestionIndex + 1 < activeQuizQuestions.length
                          ? 'Próxima Questão'
                          : 'Ver Resultado Final'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TELA 3 DO QUIZ: RELATÓRIO DE DESEMPENHO E GABARITO COMENTADO */}
          {quizStage === 'summary' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542]">
                  <div className="text-xs text-[#475569] dark:text-[#A2AFBE]">
                    Aproveitamento Final
                  </div>
                  <div className="font-mono text-3xl font-bold text-[#3979B7] dark:text-[#5397D1] tabular-nums mt-1">
                    {quizSummaryStats.percentage}%
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542]">
                  <div className="text-xs text-[#475569] dark:text-[#A2AFBE]">Questões Corretas</div>
                  <div className="font-mono text-3xl font-bold text-[#10B981] tabular-nums mt-1">
                    {quizSummaryStats.correct} / {quizSummaryStats.total}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542]">
                  <div className="text-xs text-[#475569] dark:text-[#A2AFBE]">
                    Respostas a Revisar
                  </div>
                  <div className="font-mono text-3xl font-bold text-[#EF4444] tabular-nums mt-1">
                    {quizSummaryStats.wrong}
                  </div>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {activeQuizQuestions.map((q, idx) => {
                  const chosenId = recordedAnswers[q.id];
                  const chosenOpt = q.options.find((o) => o.id === chosenId);
                  const correctOpt = q.options.find((o) => o.isCorrect);
                  const isCorrect = Boolean(chosenOpt?.isCorrect);

                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542] text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[#0F172A] dark:text-[#F2F5F8]">
                          Questão {idx + 1}: {q.question}
                        </span>
                        <span
                          className={`font-mono font-bold shrink-0 ${
                            isCorrect ? 'text-[#10B981]' : 'text-[#EF4444]'
                          }`}
                        >
                          {isCorrect ? '✓ Correta' : '✕ Incorreta'}
                        </span>
                      </div>
                      <p className="text-[#475569] dark:text-[#A2AFBE]">
                        Sua resposta:{' '}
                        <strong className="text-[#0F172A] dark:text-[#F2F5F8]">
                          {chosenOpt ? `${chosenOpt.id.toUpperCase()}) ${chosenOpt.text}` : '—'}
                        </strong>
                      </p>
                      {!isCorrect && correctOpt && (
                        <p className="text-[#10B981]">
                          Correta: <strong>{correctOpt.id.toUpperCase()}) {correctOpt.text}</strong>
                        </p>
                      )}
                      <p className="text-[#475569] dark:text-[#A2AFBE] pt-1">
                        {correctOpt?.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E2E8F0] dark:border-[#2A3542]">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => startQuizSession(quizFilterScope)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#3979B7] hover:bg-[#5397D1] rounded-lg cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Refazer Esta Avaliação</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizStage('setup')}
                    className="px-4 py-2 text-xs font-semibold text-[#0F172A] dark:text-[#F2F5F8] bg-[#F1F5F9] dark:bg-[#1C2734] border border-[#E2E8F0] dark:border-[#2A3542] rounded-lg cursor-pointer"
                  >
                    Escolher Outro Conjunto de Questões
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateToWorkbench()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#3979B7] dark:text-[#5397D1] hover:underline cursor-pointer"
                >
                  <span>Aplicar Conhecimento na Bancada Virtual</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 4. Pesquisa Inteligente Multi-Campo e Filtros Combinados */}
      <section className="mb-6 space-y-3" aria-label="Pesquisa e Filtros do Catálogo">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#475569] dark:text-[#A2AFBE] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, DDR4, LGA1700, AM4, M.2, NVMe, pasta térmica..."
              aria-label="Pesquisar componentes por nome, especificação ou compatibilidade"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-lg text-[#0F172A] dark:text-[#F2F5F8] placeholder-[#475569] dark:placeholder-[#A2AFBE] focus:outline-none focus:border-[#3979B7]"
            />
          </div>

          {/* Filtros interativos segmentados por categoria */}
          <div
            className="flex items-center gap-1 p-1 bg-[#E2E8F0]/70 dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-lg overflow-x-auto"
            role="tablist"
            aria-label="Filtrar por categoria de hardware"
          >
            {ALL_CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-white dark:bg-[#1C2734] text-[#0F172A] dark:text-[#F2F5F8] shadow-xs'
                      : 'text-[#475569] dark:text-[#A2AFBE] hover:text-[#0F172A] dark:hover:text-[#F2F5F8]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sugestões rápidas de termos técnicos + Contagem de resultados acessível */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[#475569] dark:text-[#A2AFBE]">Termos técnicos:</span>
            {QUICK_SEARCH_TERMS.map((term) => {
              const isCurrent = normalizeSearchText(searchQuery) === normalizeSearchText(term);
              return (
                <button
                  key={term}
                  type="button"
                  onClick={() => setSearchQuery(isCurrent ? '' : term)}
                  className={`px-2 py-0.5 rounded border font-mono text-[11px] transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-[#3979B7] text-white border-[#3979B7]'
                      : 'bg-white dark:bg-[#151D28] border-[#E2E8F0] dark:border-[#2A3542] text-[#475569] dark:text-[#A2AFBE] hover:border-[#3979B7]'
                  }`}
                >
                  {term}
                </button>
              );
            })}
          </div>

          <div
            className="flex items-center gap-3 text-[#475569] dark:text-[#A2AFBE]"
            role="status"
            aria-live="polite"
          >
            <span className="font-mono tabular-nums">
              Exibindo {filteredComponents.length} de {LIBRARY_COMPONENTS.length} componentes
            </span>
            {(searchQuery.trim() !== '' || selectedCategory !== 'Todas') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Todas');
                }}
                className="font-semibold text-[#3979B7] dark:text-[#5397D1] hover:underline cursor-pointer"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 5. Catálogo de Cartões de Componentes */}
      {filteredComponents.length === 0 ? (
        <div className="bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-xl p-12 text-center">
          <Layers className="w-8 h-8 text-[#3979B7] mx-auto mb-3" />
          <h2 className="text-base font-semibold text-[#0F172A] dark:text-[#F2F5F8] mb-1">
            Nenhum componente encontrado para "{searchQuery}" em "{selectedCategory}"
          </h2>
          <p className="text-sm text-[#475569] dark:text-[#A2AFBE] mb-5 max-w-lg mx-auto">
            Experimente buscar por termos como "CPU", "DDR4", "LGA1700", "AM4", "M.2", "NVMe", "alimentação" ou limpe os filtros ativos.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Todas');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#3979B7] hover:bg-[#5397D1] rounded-lg transition-colors cursor-pointer"
          >
            Restaurar Catálogo Completo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map((comp) => {
            const isStudied = studiedIds.includes(comp.id);
            const isViewed = viewedIds.includes(comp.id);
            const isSelected = activeComponentId === comp.id;

            return (
              <article
                key={comp.id}
                className={`bg-white dark:bg-[#151D28] border rounded-xl overflow-hidden flex flex-col justify-between transition-colors ${
                  isSelected
                    ? 'border-[#3979B7]'
                    : 'border-[#E2E8F0] dark:border-[#2A3542] hover:border-[#3979B7]/70'
                }`}
              >
                <div>
                  <div className="relative border-b border-[#E2E8F0] dark:border-[#2A3542]">
                    <ComponentIllustration
                      componentId={comp.id}
                      imageFile={comp.imageFile}
                      alt={`Representação técnica de ${comp.name}`}
                      className="w-full h-48"
                    />
                  </div>

                  <div className="p-6">
                    {/* Metadados limpos com indicação de Visualizado / Estudado */}
                    <div className="flex items-center justify-between gap-2 text-xs text-[#475569] dark:text-[#A2AFBE] mb-2">
                      <span>
                        {comp.category} <span aria-hidden="true">·</span>{' '}
                        {isViewed ? 'Visualizado' : 'Não lido'}
                      </span>
                      <button
                        type="button"
                        onClick={() => onToggleStudied(comp.id)}
                        aria-pressed={isStudied}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#3979B7] hover:text-[#5397D1] cursor-pointer whitespace-nowrap shrink-0"
                        title={
                          isStudied
                            ? 'Desfazer marcação de estudado'
                            : 'Declarar este componente como estudado'
                        }
                      >
                        {isStudied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                            <span className="text-[#10B981]">Estudado</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-3.5 h-3.5" />
                            <span>Marcar estudado</span>
                          </>
                        )}
                      </button>
                    </div>

                    <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F2F5F8] mb-1">
                      {comp.name}
                    </h2>
                    <div className="text-xs text-[#3979B7] dark:text-[#5397D1] font-medium mb-2.5">
                      Analogia: {comp.analogyTitle}
                    </div>

                    <p className="text-sm text-[#475569] dark:text-[#A2AFBE] leading-relaxed mb-4">
                      {comp.summary}
                    </p>

                    <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#2A3542] text-xs text-[#475569] dark:text-[#A2AFBE]">
                      <strong className="font-semibold text-[#0F172A] dark:text-[#F2F5F8]">
                        Função principal:{' '}
                      </strong>
                      {comp.mainFunction}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-[#F8FAFC] dark:bg-[#0C1118]/60 border-t border-[#E2E8F0] dark:border-[#2A3542] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={(e) => openComponentModal(comp.id, e.currentTarget)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3979B7] dark:text-[#5397D1] hover:underline cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Abrir Ficha Técnica</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateToWorkbench(comp.workbenchFilterCategory)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#475569] dark:text-[#A2AFBE] hover:text-[#0F172A] dark:hover:text-[#F2F5F8] cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Praticar na Bancada</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* 6. Modal Acessível de Ficha Técnica Completa */}
      {activeComponent && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-component-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeComponentModal();
          }}
        >
          <div
            ref={modalContainerRef}
            className="bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Cabeçalho Fixo do Modal */}
            <div className="sticky top-0 z-20 bg-white dark:bg-[#151D28] border-b border-[#E2E8F0] dark:border-[#2A3542] px-5 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs text-[#475569] dark:text-[#A2AFBE] flex items-center gap-2">
                  <span>{activeComponent.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 text-[#3979B7] dark:text-[#5397D1]">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ficha Visualizada</span>
                  </span>
                </div>
                <h2
                  id="modal-component-title"
                  className="text-lg sm:text-xl font-bold text-[#0F172A] dark:text-[#F2F5F8]"
                >
                  {activeComponent.name}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleStudied(activeComponent.id)}
                  aria-pressed={studiedIds.includes(activeComponent.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    studiedIds.includes(activeComponent.id)
                      ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]'
                      : 'bg-[#F1F5F9] dark:bg-[#1C2734] border-[#E2E8F0] dark:border-[#2A3542] text-[#0F172A] dark:text-[#F2F5F8]'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    {studiedIds.includes(activeComponent.id)
                      ? 'Estudado (Clique p/ Desfazer)'
                      : 'Declarar como Estudado'}
                  </span>
                </button>

                <button
                  ref={modalCloseBtnRef}
                  type="button"
                  onClick={closeComponentModal}
                  className="p-2 rounded-lg text-[#475569] dark:text-[#A2AFBE] hover:text-[#0F172A] dark:hover:text-[#F2F5F8] hover:bg-[#F1F5F9] dark:hover:bg-[#1C2734] cursor-pointer"
                  aria-label="Fechar ficha técnica (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Corpo da Ficha Técnica */}
            <div className="p-5 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                <div className="md:col-span-5 rounded-lg overflow-hidden border border-[#E2E8F0] dark:border-[#2A3542] flex flex-col justify-between bg-[#0F1620]">
                  <ComponentIllustration
                    componentId={activeComponent.id}
                    imageFile={activeComponent.imageFile}
                    alt={`Ilustração técnica de ${activeComponent.name}`}
                    className="w-full h-52 flex-grow"
                  />
                  <div className="p-3 bg-[#F8FAFC] dark:bg-[#0C1118] border-t border-[#E2E8F0] dark:border-[#2A3542] text-xs text-[#475569] dark:text-[#A2AFBE]">
                    <strong className="text-[#0F172A] dark:text-[#F2F5F8]">Função:</strong>{' '}
                    {activeComponent.mainFunction}
                  </div>
                </div>

                <div className="md:col-span-7 space-y-4">
                  <div className="p-4 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#3979B7] mb-1">
                      01. O que é
                    </h3>
                    <p className="text-sm text-[#0F172A] dark:text-[#F2F5F8] leading-relaxed">
                      {activeComponent.whatIs}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#3979B7] mb-1">
                      02. Como funciona
                    </h3>
                    <p className="text-sm text-[#0F172A] dark:text-[#F2F5F8] leading-relaxed">
                      {activeComponent.howItWorks}
                    </p>
                  </div>
                </div>
              </div>

              {/* Analogia Didática */}
              <div className="p-4 rounded-lg bg-[#3979B7]/10 border border-[#3979B7]/30">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#3979B7] dark:text-[#5397D1] mb-1">
                  03. Analogia Didática — {activeComponent.analogyTitle}
                </h3>
                <p className="text-sm text-[#0F172A] dark:text-[#F2F5F8] leading-relaxed">
                  {activeComponent.analogyText}
                </p>
              </div>

              {/* Características & Compatibilidade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#3979B7] mb-2.5">
                    04. Características e Especificações
                  </h3>
                  <ul className="space-y-2 text-sm text-[#475569] dark:text-[#A2AFBE]">
                    {activeComponent.characteristics.map((item, i) => (
                      <li key={i} className="leading-relaxed">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-[#F59E0B]/5 border border-[#F59E0B]/30">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#D97706] dark:text-[#FBBF24] mb-2.5">
                    05. Regras Críticas de Compatibilidade
                  </h3>
                  <ul className="space-y-2 text-sm text-[#0F172A] dark:text-[#F2F5F8]">
                    {activeComponent.compatibility.map((item, i) => (
                      <li key={i} className="leading-relaxed">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Cuidados na Montagem & Erros Frequentes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-[#10B981]/5 border border-[#10B981]/30">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#10B981] mb-2.5">
                    06. Cuidados Seguros na Montagem
                  </h3>
                  <ul className="space-y-2 text-sm text-[#0F172A] dark:text-[#F2F5F8]">
                    {activeComponent.care.map((item, i) => (
                      <li key={i} className="leading-relaxed">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-[#EF4444]/5 border border-[#EF4444]/30">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#EF4444] mb-2.5">
                    07. Erros Frequentes a Evitar
                  </h3>
                  <ul className="space-y-2 text-sm text-[#0F172A] dark:text-[#F2F5F8]">
                    {activeComponent.commonMistakes.map((item, i) => (
                      <li key={i} className="leading-relaxed">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Aplicação Prática na Bancada + Avaliação Específica */}
              <div className="p-4 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#3979B7] mb-1">
                    08. Aplicação Prática na Bancada Virtual
                  </h3>
                  <p className="text-sm text-[#475569] dark:text-[#A2AFBE] leading-relaxed">
                    {activeComponent.inWorkbench}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const compId = activeComponent.id;
                      setActiveComponentId(null);
                      setQuizFilterScope(compId);
                      setQuizSectionOpen(true);
                      startQuizSession(compId);
                      window.setTimeout(() => {
                        quizSectionRef.current?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start'
                        });
                      }, 60);
                    }}
                    className="px-3 py-2 text-xs font-semibold text-[#0F172A] dark:text-[#F2F5F8] bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] hover:border-[#3979B7] rounded-lg cursor-pointer whitespace-nowrap"
                  >
                    Testar 5 Questões Deste Tema
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const cat = activeComponent.workbenchFilterCategory;
                      setActiveComponentId(null);
                      onNavigateToWorkbench(cat);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#3979B7] hover:bg-[#5397D1] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Ir para Bancada Virtual</span>
                  </button>
                </div>
              </div>

              {/* Navegação entre Componentes Relacionados */}
              <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#2A3542] flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-[#475569] dark:text-[#A2AFBE]">
                    Componentes relacionados:
                  </span>
                  {activeComponent.relatedIds.map((relId) => {
                    const rel = LIBRARY_COMPONENTS.find((c) => c.id === relId);
                    if (!rel) return null;
                    return (
                      <button
                        key={rel.id}
                        type="button"
                        onClick={() => {
                          setActiveComponentId(rel.id);
                          onMarkViewed(rel.id);
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-[#0F172A] dark:text-[#F2F5F8] bg-[#F1F5F9] dark:bg-[#1C2734] hover:border-[#3979B7] border border-[#E2E8F0] dark:border-[#2A3542] rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        {rel.shortName}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={closeComponentModal}
                  className="px-4 py-1.5 text-xs font-medium text-[#475569] dark:text-[#A2AFBE] hover:text-[#0F172A] dark:hover:text-[#F2F5F8] cursor-pointer"
                >
                  Fechar Ficha (Esc)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
