import React, { useState, useEffect, useCallback } from 'react';
import { BibliotecaView } from './components/BibliotecaView';
import { BancadaView } from './components/BancadaView';
import { LIBRARY_COMPONENTS, WorkbenchPartCategory } from './data/hardwareData';
import { ComponentIllustration } from './components/HardwareSvg';
import { X, CheckCircle2, Download } from 'lucide-react';

type ActiveEnvironment = 'biblioteca' | 'bancada';

export default function App() {
  const [environment, setEnvironment] = useState<ActiveEnvironment>(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    if (view === 'bancada' || window.location.hash === '#ferramenta') {
      return 'bancada';
    }
    return 'biblioteca';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('hardwaredex_theme');
      return saved ? saved === 'dark' : true;
    } catch {
      return true;
    }
  });

  const [studiedIds, setStudiedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hardwaredex_studied');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [workbenchFilterCategory, setWorkbenchFilterCategory] =
    useState<WorkbenchPartCategory | null>(null);
  const [quickLibraryComponentId, setQuickLibraryComponentId] = useState<string | null>(null);
  const [filesModalOpen, setFilesModalOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('hardwaredex_theme', darkMode ? 'dark' : 'light');
    } catch {
      // Ignore storage error
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem('hardwaredex_studied', JSON.stringify(studiedIds));
    } catch {
      // Ignore storage error
    }
  }, [studiedIds]);

  const handleToggleStudied = useCallback((id: string) => {
    setStudiedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const handleNavigateToWorkbench = useCallback((filterCat?: WorkbenchPartCategory) => {
    if (filterCat) {
      setWorkbenchFilterCategory(filterCat);
    }
    setEnvironment('bancada');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const quickReferenceComponent = quickLibraryComponentId
    ? LIBRARY_COMPONENTS.find((c) => c.id === quickLibraryComponentId) || null
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0C1118] text-[#0F172A] dark:text-[#F2F5F8] transition-colors duration-150">
      {/* Cabeçalho Global HardwareDex — 3 Zonas */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#151D28]/95 backdrop-blur-xs border-b border-[#E2E8F0] dark:border-[#2A3542]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-8">
          {/* Zona 1: Identidade HardwareDex (1 linha, sem subtítulos ou badges) */}
          <a
            href="#biblioteca"
            onClick={(e) => {
              e.preventDefault();
              setEnvironment('biblioteca');
            }}
            className="text-lg font-bold tracking-tight text-[#0F172A] dark:text-[#F2F5F8] whitespace-nowrap shrink-0"
          >
            HardwareDex
          </a>

          {/* Zona 2: Links de navegação concisos em linha única */}
          <nav
            aria-label="Navegação Principal"
            className="flex items-center gap-5 sm:gap-7 text-sm font-medium overflow-x-auto"
          >
            <a
              href="#biblioteca"
              onClick={(e) => {
                e.preventDefault();
                setEnvironment('biblioteca');
              }}
              aria-current={environment === 'biblioteca' ? 'page' : undefined}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                environment === 'biblioteca'
                  ? 'border-[#3979B7] text-[#3979B7] dark:text-[#5397D1] font-semibold'
                  : 'border-transparent text-[#475569] dark:text-[#A2AFBE] hover:text-[#0F172A] dark:hover:text-[#F2F5F8]'
              }`}
            >
              Biblioteca
            </a>

            <a
              href="#ferramenta"
              onClick={(e) => {
                e.preventDefault();
                setEnvironment('bancada');
              }}
              aria-current={environment === 'bancada' ? 'page' : undefined}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                environment === 'bancada'
                  ? 'border-[#3979B7] text-[#3979B7] dark:text-[#5397D1] font-semibold'
                  : 'border-transparent text-[#475569] dark:text-[#A2AFBE] hover:text-[#0F172A] dark:hover:text-[#F2F5F8]'
              }`}
            >
              Bancada Virtual
            </a>

            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              className="py-1 text-[#475569] dark:text-[#A2AFBE] hover:text-[#0F172A] dark:hover:text-[#F2F5F8] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {darkMode ? 'Tema Claro' : 'Tema Escuro'}
            </button>

            <button
              type="button"
              onClick={() => setFilesModalOpen(true)}
              className="hidden sm:inline-block py-1 text-[#475569] dark:text-[#A2AFBE] hover:text-[#0F172A] dark:hover:text-[#F2F5F8] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Arquivos HTML
            </button>
          </nav>

          {/* Zona 3: 1 Ação Principal */}
          <div className="flex items-center shrink-0">
            {environment === 'biblioteca' ? (
              <button
                type="button"
                onClick={() => setEnvironment('bancada')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#3979B7] hover:bg-[#5397D1] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Abrir Bancada Virtual
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setEnvironment('biblioteca')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#3979B7] hover:bg-[#5397D1] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Explorar Biblioteca
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1">
        {environment === 'biblioteca' ? (
          <BibliotecaView
            studiedIds={studiedIds}
            onToggleStudied={handleToggleStudied}
            onNavigateToWorkbench={handleNavigateToWorkbench}
          />
        ) : (
          <BancadaView
            onOpenLibraryComponent={(compId) => setQuickLibraryComponentId(compId)}
            initialFilterCategory={workbenchFilterCategory}
            onClearInitialFilter={() => setWorkbenchFilterCategory(null)}
          />
        )}
      </main>

      {/* Consulta Contextual Rápida da Biblioteca a partir da Bancada (Preserva o progresso da Bancada) */}
      {quickReferenceComponent && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-lib-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setQuickLibraryComponentId(null);
          }}
        >
          <div className="bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-xl max-w-2xl w-full p-6 shadow-2xl max-h-[88vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 mb-4 border-b border-[#E2E8F0] dark:border-[#2A3542]">
              <div>
                <div className="text-xs text-[#475569] dark:text-[#A2AFBE]">
                  Consulta Rápida da Biblioteca · {quickReferenceComponent.category}
                </div>
                <h2
                  id="quick-lib-title"
                  className="text-lg font-bold text-[#0F172A] dark:text-[#F2F5F8]"
                >
                  {quickReferenceComponent.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setQuickLibraryComponentId(null)}
                className="p-1.5 text-[#475569] dark:text-[#A2AFBE] hover:text-[#0F172A] dark:hover:text-[#F2F5F8] cursor-pointer"
                aria-label="Fechar consulta rápida"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-lg overflow-hidden border border-[#E2E8F0] dark:border-[#2A3542] mb-4">
              <ComponentIllustration
                componentId={quickReferenceComponent.id}
                imageFile={quickReferenceComponent.imageFile}
                alt={quickReferenceComponent.name}
                className="w-full h-40"
              />
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542]">
                <strong className="text-[#3979B7] block mb-0.5">O que é & Como funciona:</strong>
                <p className="text-[#0F172A] dark:text-[#F2F5F8]">
                  {quickReferenceComponent.whatIs} {quickReferenceComponent.howItWorks}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542]">
                <strong className="text-[#3979B7] block mb-0.5">
                  Regras de Compatibilidade:
                </strong>
                <ul className="space-y-1 text-[#475569] dark:text-[#A2AFBE]">
                  {quickReferenceComponent.compatibility.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-[#3979B7]/10 border border-[#3979B7]/30">
                <strong className="text-[#3979B7] block mb-0.5">Orientação na Bancada:</strong>
                <p className="text-[#0F172A] dark:text-[#F2F5F8]">
                  {quickReferenceComponent.inWorkbench}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#E2E8F0] dark:border-[#2A3542] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleToggleStudied(quickReferenceComponent.id)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#10B981] cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {studiedIds.includes(quickReferenceComponent.id)
                    ? 'Componente já marcado como estudado'
                    : 'Marcar como estudado'}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setQuickLibraryComponentId(null);
                    setEnvironment('biblioteca');
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-[#475569] dark:text-[#A2AFBE] hover:text-[#0F172A] dark:hover:text-[#F2F5F8] cursor-pointer"
                >
                  Abrir Biblioteca Completa
                </button>
                <button
                  type="button"
                  onClick={() => setQuickLibraryComponentId(null)}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#3979B7] hover:bg-[#5397D1] rounded-lg cursor-pointer"
                >
                  Continuar Montagem
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Acesso Direto aos Arquivos Estáticos biblioteca.html e ferramenta.html */}
      {filesModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="files-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setFilesModalOpen(false);
          }}
        >
          <div className="bg-white dark:bg-[#151D28] border border-[#E2E8F0] dark:border-[#2A3542] rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E2E8F0] dark:border-[#2A3542]">
              <h2
                id="files-modal-title"
                className="text-base font-bold text-[#0F172A] dark:text-[#F2F5F8]"
              >
                Arquivos HTML Estáticos e Instruções de Execução
              </h2>
              <button
                type="button"
                onClick={() => setFilesModalOpen(false)}
                className="p-1 text-[#475569] dark:text-[#A2AFBE] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#475569] dark:text-[#A2AFBE] leading-relaxed mb-4">
              Além da aplicação integrada, os dois arquivos independentes (<code className="font-mono">biblioteca.html</code> e <code className="font-mono">ferramenta.html</code>) estão disponíveis para download ou abertura direta sem servidor de compilação (compatível com GitHub Pages e execução local em sala de aula).
            </p>

            <div className="space-y-2.5 mb-5">
              <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold font-mono text-[#0F172A] dark:text-[#F2F5F8]">
                    biblioteca.html
                  </div>
                  <div className="text-[11px] text-[#475569] dark:text-[#A2AFBE]">
                    Catálogo interativo de hardware (HTML5 + CSS3 + ES6)
                  </div>
                </div>
                <a
                  href="/biblioteca.html"
                  download="biblioteca.html"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#3979B7] hover:bg-[#5397D1] rounded-lg"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar</span>
                </a>
              </div>

              <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#0C1118] border border-[#E2E8F0] dark:border-[#2A3542] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold font-mono text-[#0F172A] dark:text-[#F2F5F8]">
                    ferramenta.html
                  </div>
                  <div className="text-[11px] text-[#475569] dark:text-[#A2AFBE]">
                    Bancada Virtual de montagem e diagnóstico (HTML5 + CSS3 + ES6)
                  </div>
                </div>
                <a
                  href="/ferramenta.html"
                  download="ferramenta.html"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#3979B7] hover:bg-[#5397D1] rounded-lg"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar</span>
                </a>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setFilesModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#0F172A] dark:text-[#F2F5F8] bg-[#F1F5F9] dark:bg-[#1C2734] rounded-lg cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rodapé Discreto */}
      <footer className="border-t border-[#E2E8F0] dark:border-[#2A3542] py-4 px-6 text-center text-xs text-[#475569] dark:text-[#A2AFBE]">
        HardwareDex — Plataforma Educacional de Hardware · Biblioteca &amp; Bancada Virtual · © 2026 Matheus de Oliveira
      </footer>
    </div>
  );
}
