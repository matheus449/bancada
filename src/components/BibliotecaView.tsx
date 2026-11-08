import React, { useState, useMemo } from 'react';
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
  Layers
} from 'lucide-react';
import {
  LIBRARY_COMPONENTS,
  QUIZ_QUESTIONS,
  ComponentCategory,
  LibraryComponent,
  WorkbenchPartCategory
} from '../data/hardwareData';
import { ComponentIllustration } from './HardwareSvg';

interface BibliotecaViewProps {
  studiedIds: string[];
  onToggleStudied: (id: string) => void;
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

export const BibliotecaView: React.FC<BibliotecaViewProps> = ({
  studiedIds,
  onToggleStudied,
  onNavigateToWorkbench,
  initialSelectedComponentId,
  onClearInitialComponent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Todas' | ComponentCategory>('Todas');
  const [activeComponentId, setActiveComponentId] = useState<string | null>(
    initialSelectedComponentId || null
  );
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (initialSelectedComponentId) {
      setActiveComponentId(initialSelectedComponentId);
      if (onClearInitialComponent) onClearInitialComponent();
    }
  }, [initialSelectedComponentId, onClearInitialComponent]);

  const filteredComponents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return LIBRARY_COMPONENTS.filter((comp) => {
      const matchesCat = selectedCategory === 'Todas' || comp.category === selectedCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        comp.name.toLowerCase().includes(q) ||
        comp.category.toLowerCase().includes(q) ||
        comp.analogyTitle.toLowerCase().includes(q) ||
        comp.summary.toLowerCase().includes(q) ||
        comp.mainFunction.toLowerCase().includes(q) ||
        comp.whatIs.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory]);

  const activeComponent: LibraryComponent | null = useMemo(() => {
    if (!activeComponentId) return null;
    return LIBRARY_COMPONENTS.find((c) => c.id === activeComponentId) || null;
  }, [activeComponentId]);

  const studiedCount = studiedIds.length;
  const totalCount = LIBRARY_COMPONENTS.length;
  const progressPercent = Math.round((studiedCount / totalCount) * 100);

  const handleSelectQuizOption = (questionId: string, optionId: string) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
  };

  const correctQuizCount = useMemo(() => {
    return QUIZ_QUESTIONS.reduce((acc, q) => {
      const chosen = quizAnswers[q.id];
      const opt = q.options.find((o) => o.id === chosen);
      return acc + (opt?.isCorrect ? 1 : 0);
    }, 0);
  }, [quizAnswers]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Cabeçalho da Biblioteca + Barra de Progresso e Ações */}
      <section className="mb-8 pb-8 border-b border-[#E2E8F0] dark:border-[#2A3542]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="text-xs font-medium text-[#475569] dark:text-[#A2AFBE] mb-2">
                Ambiente A · Catálogo Técnico Interativo · 7 Componentes Essenciais
              </div>
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A] dark:text-[#F2F5F8] mb-3"
                style={{ textWrap: 'balance' }}
              >
                Biblioteca de Arquitetura e Componentes de Hardware
              </h1>
              <p className="text-sm sm:text-base text-[#475569] dark:text-[#A2AFBE] leading-relaxed max-w-2xl">
                Compreenda a função física, os critérios de compatibilidade e os cuidados de instalação de cada peça antes de iniciar a montagem prática na Bancada Virtual.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigateToWorkbench()}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#3979B7] hover:bg-[#5397D1] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Wrench className="w-4 h-4" />
                <span>Abrir Bancada Virtual</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setQuizOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#0F172A] dark:text-[#F2F5F8] bg-white dark:bg-[#151D28] hover:bg-[#F1F5F9] dark:hover:bg-[#1C2734] border border-[#E2E8F0] dark:border-[#2A3542] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <HelpCircle className="w-4 h-4 text-[#3979B7]" />
                <span>{quizOpen ? 'Ocultar Revisão de Conceitos' : 'Revisar Conceitos (Quiz)'}</span>
              </button>
            </div>
          </div>

          {/* Card de Progresso de Estudo */}
          <div className="lg:col-span-5 bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-sm font-semibold text-[#0F172A] dark:text-[#F2F5F8]">
                  Progresso de Estudo Local
                </span>
                <span className="font-mono text-sm font-semibold text-[#3979B7] tabular-nums">
                  {studiedCount} / {totalCount} estudados ({progressPercent}%)
                </span>
              </div>
              <div
                className="w-full h-2 bg-[#E2E8F0] dark:bg-[#0C1118] rounded-full overflow-hidden mb-4"
                role="progressbar"
                aria-valuenow={studiedCount}
                aria-valuemin={0}
                aria-valuemax={totalCount}
              >
                <div
                  className="h-full bg-[#3979B7] transition-transform duration-200 origin-left"
                  style={{ transform: `scaleX(${studiedCount / totalCount})` }}
                />
              </div>
              <p className="text-xs text-[#475569] dark:text-[#A2AFBE] leading-relaxed">
                Explore a ficha técnica completa de cada componente e marque-o como concluído. Seu progresso permanece salvo automaticamente neste navegador.
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-[#E2E8F0] dark:border-[#2A3542] flex items-center justify-between text-xs text-[#475569] dark:text-[#A2AFBE]">
              <span>
                {studiedCount === totalCount
                  ? 'Todos os componentes estudados! Pronto para a Bancada.'
                  : `Faltam ${totalCount - studiedCount} componente(s) para concluir o catálogo.`}
              </span>
              <span className="font-mono tabular-nums">
                Quiz: {correctQuizCount}/{QUIZ_QUESTIONS.length}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Painel de Revisão de Conceitos (Perguntas Objetivas) */}
      {quizOpen && (
        <section
          aria-label="Revisão de Conceitos"
          className="mb-10 bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-xl p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-[#E2E8F0] dark:border-[#2A3542]">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F2F5F8]">
                Verificação de Conceitos Técnicos
              </h2>
              <p className="text-xs text-[#475569] dark:text-[#A2AFBE] mt-0.5">
                Responda às questões objetivas abaixo para validar seu domínio sobre compatibilidade, energia e montagem.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[#475569] dark:text-[#A2AFBE] tabular-nums">
                Acertos: {correctQuizCount} de {QUIZ_QUESTIONS.length}
              </span>
              <button
                type="button"
                onClick={handleResetQuiz}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F172A] dark:text-[#F2F5F8] bg-[#F1F5F9] dark:bg-[#1C2734] hover:bg-[#E2E8F0] dark:hover:bg-[#2A3542] rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar Respostas</span>
              </button>
              <button
                type="button"
                onClick={() => setQuizOpen(false)}
                className="p-1.5 text-[#475569] dark:text-[#A2AFBE] hover:text-[#0F172A] dark:hover:text-[#F2F5F8] rounded-md cursor-pointer"
                aria-label="Fechar revisão"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const selectedOptionId = quizAnswers[q.id];
              const selectedOption = q.options.find((o) => o.id === selectedOptionId);

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542] flex flex-col justify-between"
                >
                  <div>
                    <div className="text-xs text-[#475569] dark:text-[#A2AFBE] mb-2">
                      Questão 0{idx + 1} ·{' '}
                      {LIBRARY_COMPONENTS.find((c) => c.id === q.componentId)?.shortName}
                    </div>
                    <h3 className="text-sm font-semibold text-[#0F172A] dark:text-[#F2F5F8] mb-4 leading-snug">
                      {q.question}
                    </h3>

                    <div className="space-y-2">
                      {q.options.map((opt) => {
                        const isSelected = selectedOptionId === opt.id;
                        let btnStyle =
                          'border-[#E2E8F0] dark:border-[#2A3542] bg-white dark:bg-[#151D28] text-[#0F172A] dark:text-[#F2F5F8] hover:border-[#3979B7]';
                        if (isSelected) {
                          btnStyle = opt.isCorrect
                            ? 'border-[#10B981] bg-[#10B981]/10 text-[#0F172A] dark:text-[#F2F5F8]'
                            : 'border-[#EF4444] bg-[#EF4444]/10 text-[#0F172A] dark:text-[#F2F5F8]';
                        }

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectQuizOption(q.id, opt.id)}
                            className={`w-full text-left p-3 rounded-lg border text-xs leading-relaxed transition-colors cursor-pointer flex items-start gap-2.5 ${btnStyle}`}
                          >
                            <span className="font-mono font-bold uppercase shrink-0 mt-0.5">
                              {opt.id})
                            </span>
                            <span>{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedOption && (
                    <div
                      className={`mt-4 p-3 rounded-lg border text-xs leading-relaxed ${
                        selectedOption.isCorrect
                          ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#065F46] dark:text-[#A7F3D0]'
                          : 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#991B1B] dark:text-[#FECACA]'
                      }`}
                    >
                      <div className="font-semibold mb-1 flex items-center gap-1.5">
                        {selectedOption.isCorrect ? (
                          <>
                            <ShieldCheck className="w-4 h-4 shrink-0" />
                            <span>Resposta Correta</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span>Revisão Necessária</span>
                          </>
                        )}
                      </div>
                      <p>{selectedOption.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Barra de Pesquisa e Filtros por Categoria */}
      <section className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#475569] dark:text-[#A2AFBE] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar componente, função, socket ou analogia..."
            aria-label="Pesquisar componentes na biblioteca"
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-lg text-[#0F172A] dark:text-[#F2F5F8] placeholder-[#475569] dark:placeholder-[#A2AFBE] focus:outline-none focus:border-[#3979B7]"
          />
        </div>

        {/* Filtros interativos segmentados */}
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
      </section>

      {/* Catálogo de Cartões de Componentes */}
      {filteredComponents.length === 0 ? (
        <div className="bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-xl p-12 text-center">
          <Layers className="w-8 h-8 text-[#3979B7] mx-auto mb-3" />
          <h2 className="text-base font-semibold text-[#0F172A] dark:text-[#F2F5F8] mb-1">
            Nenhum componente encontrado para os filtros atuais
          </h2>
          <p className="text-sm text-[#475569] dark:text-[#A2AFBE] mb-5">
            Tente pesquisar por termos como "AM4", "DDR4", "M.2", "Pasta Térmica" ou limpe os filtros.
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
                      alt={`Representação de ${comp.name}`}
                      className="w-full h-48"
                    />
                  </div>

                  <div className="p-6">
                    {/* Metadados limpos sem cápsulas estáticas */}
                    <div className="flex items-center justify-between gap-2 text-xs text-[#475569] dark:text-[#A2AFBE] mb-2">
                      <span>
                        {comp.category} <span aria-hidden="true">·</span> {comp.analogyTitle}
                      </span>
                      <button
                        type="button"
                        onClick={() => onToggleStudied(comp.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#3979B7] hover:text-[#5397D1] cursor-pointer whitespace-nowrap shrink-0"
                        title={isStudied ? 'Desmarcar como estudado' : 'Marcar como estudado'}
                      >
                        {isStudied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                            <span className="text-[#10B981]">Estudado</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-3.5 h-3.5" />
                            <span>Marcar estudo</span>
                          </>
                        )}
                      </button>
                    </div>

                    <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F2F5F8] mb-2">
                      {comp.name}
                    </h2>

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
                    onClick={() => setActiveComponentId(comp.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3979B7] hover:text-[#5397D1] cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Estudar Componente</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateToWorkbench(comp.workbenchFilterCategory)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#475569] dark:text-[#A2AFBE] hover:text-[#0F172A] dark:hover:text-[#F2F5F8] cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Ver na Bancada</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal / Painel de Aprendizagem Estruturada do Componente */}
      {activeComponent && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-component-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveComponentId(null);
          }}
        >
          <div className="bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Topo do Modal */}
            <div className="sticky top-0 z-20 bg-white dark:bg-[#151D28] border-b border-[#E2E8F0] dark:border-[#2A3542] px-6 py-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-[#475569] dark:text-[#A2AFBE]">
                  {activeComponent.category} · Analogia: {activeComponent.analogyTitle}
                </div>
                <h2
                  id="modal-component-title"
                  className="text-xl font-bold text-[#0F172A] dark:text-[#F2F5F8]"
                >
                  {activeComponent.name}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleStudied(activeComponent.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    studiedIds.includes(activeComponent.id)
                      ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]'
                      : 'bg-[#F1F5F9] dark:bg-[#1C2734] border-[#E2E8F0] dark:border-[#2A3542] text-[#0F172A] dark:text-[#F2F5F8]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {studiedIds.includes(activeComponent.id)
                      ? 'Marcado como Estudado'
                      : 'Marcar como Estudado'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveComponentId(null)}
                  className="p-2 rounded-lg text-[#475569] dark:text-[#A2AFBE] hover:text-[#0F172A] dark:hover:text-[#F2F5F8] hover:bg-[#F1F5F9] dark:hover:bg-[#1C2734] cursor-pointer"
                  aria-label="Fechar detalhes do componente"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Corpo Estruturado nas 8 Seções Pedagógicas */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                <div className="md:col-span-5 rounded-lg overflow-hidden border border-[#E2E8F0] dark:border-[#2A3542] flex flex-col">
                  <ComponentIllustration
                    componentId={activeComponent.id}
                    imageFile={activeComponent.imageFile}
                    alt={activeComponent.name}
                    className="w-full h-52 flex-grow"
                  />
                  <div className="p-3 bg-[#F8FAFC] dark:bg-[#0C1118] border-t border-[#E2E8F0] dark:border-[#2A3542] text-xs text-[#475569] dark:text-[#A2AFBE]">
                    Arquivo de referência: <code className="font-mono">{activeComponent.imageFile}</code>
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

              {/* Analogia */}
              <div className="p-4 rounded-lg bg-[#3979B7]/10 border border-[#3979B7]/30">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#3979B7] mb-1">
                  03. Analogia do Cotidiano — {activeComponent.analogyTitle}
                </h3>
                <p className="text-sm text-[#0F172A] dark:text-[#F2F5F8] leading-relaxed">
                  {activeComponent.analogyText}
                </p>
              </div>

              {/* Características & Compatibilidade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#3979B7] mb-2.5">
                    04. Características Essenciais
                  </h3>
                  <ul className="space-y-2 text-sm text-[#475569] dark:text-[#A2AFBE]">
                    {activeComponent.characteristics.map((item, i) => (
                      <li key={i} className="leading-relaxed">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#3979B7] mb-2.5">
                    05. Compatibilidade
                  </h3>
                  <ul className="space-y-2 text-sm text-[#475569] dark:text-[#A2AFBE]">
                    {activeComponent.compatibility.map((item, i) => (
                      <li key={i} className="leading-relaxed">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Cuidados & Erros Frequentes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-[#10B981]/5 border border-[#10B981]/30">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#10B981] mb-2.5">
                    06. Cuidados na Montagem
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

              {/* Na Bancada */}
              <div className="p-4 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#3979B7] mb-1">
                    08. Na Bancada Virtual
                  </h3>
                  <p className="text-sm text-[#475569] dark:text-[#A2AFBE] leading-relaxed">
                    {activeComponent.inWorkbench}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const cat = activeComponent.workbenchFilterCategory;
                    setActiveComponentId(null);
                    onNavigateToWorkbench(cat);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#3979B7] hover:bg-[#5397D1] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Praticar na Bancada</span>
                </button>
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
                        onClick={() => setActiveComponentId(rel.id)}
                        className="px-3 py-1 text-xs font-medium text-[#0F172A] dark:text-[#F2F5F8] bg-[#F1F5F9] dark:bg-[#1C2734] hover:border-[#3979B7] border border-[#E2E8F0] dark:border-[#2A3542] rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        {rel.shortName}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveComponentId(null)}
                  className="px-4 py-1.5 text-xs font-medium text-[#475569] dark:text-[#A2AFBE] hover:text-[#0F172A] dark:hover:text-[#F2F5F8] cursor-pointer"
                >
                  Fechar Ficha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
