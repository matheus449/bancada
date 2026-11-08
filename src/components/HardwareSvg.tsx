import React, { useState } from 'react';

interface ComponentIllustrationProps {
  componentId: string;
  imageFile: string;
  alt: string;
  className?: string;
}

export const ComponentIllustration: React.FC<ComponentIllustrationProps> = ({
  componentId,
  imageFile,
  alt,
  className = 'w-full h-48'
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-[#111822] dark:bg-[#0F1620] flex items-center justify-center select-none ${className}`}
    >
      {!imgError && (
        <img
          src={imageFile}
          alt={alt}
          referrerPolicy="no-referrer"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
            imgLoaded ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
          }`}
        />
      )}
      <div className="w-full h-full flex items-center justify-center p-4">
        <TechnicalComponentSvg componentId={componentId} />
      </div>
    </div>
  );
};

export const TechnicalComponentSvg: React.FC<{ componentId: string; className?: string }> = ({
  componentId,
  className = 'w-full h-full max-h-40'
}) => {
  switch (componentId) {
    case 'placa':
      return (
        <svg viewBox="0 0 280 180" className={className} role="img" aria-label="Esquemático técnico de Placa-Mãe">
          <rect x="35" y="12" width="210" height="156" rx="6" fill="#15202E" stroke="#3979B7" strokeWidth="1.5" />
          {/* Circuito impresso e trilhas */}
          <path d="M55 40 H110 V80 M175 35 V95 M65 135 H215" stroke="#233549" strokeWidth="1.5" fill="none" />
          {/* VRM Heatsinks */}
          <rect x="48" y="24" width="18" height="58" rx="2" fill="#2A3A4D" stroke="#5397D1" strokeWidth="1" />
          <rect x="74" y="20" width="52" height="14" rx="2" fill="#2A3A4D" stroke="#5397D1" strokeWidth="1" />
          {/* CPU Socket */}
          <rect x="82" y="42" width="46" height="46" rx="3" fill="#0C1118" stroke="#64A8E0" strokeWidth="1.5" />
          <rect x="90" y="50" width="30" height="30" rx="1" fill="#1C2734" stroke="#3979B7" strokeDasharray="2 2" />
          <text x="105" y="68" textAnchor="middle" fill="#A2AFBE" fontSize="7" fontFamily="monospace">SOCKET</text>
          {/* Slots DIMM RAM */}
          <rect x="146" y="26" width="7" height="66" rx="1" fill="#0C1118" stroke="#3979B7" strokeWidth="1" />
          <rect x="158" y="26" width="7" height="66" rx="1" fill="#0C1118" stroke="#64A8E0" strokeWidth="1" />
          <rect x="170" y="26" width="7" height="66" rx="1" fill="#0C1118" stroke="#3979B7" strokeWidth="1" />
          <rect x="182" y="26" width="7" height="66" rx="1" fill="#0C1118" stroke="#64A8E0" strokeWidth="1" />
          {/* M.2 Slot */}
          <rect x="82" y="100" width="64" height="12" rx="2" fill="#0C1118" stroke="#5397D1" strokeWidth="1" />
          <text x="114" y="108" textAnchor="middle" fill="#64A8E0" fontSize="6.5" fontFamily="monospace">M.2 NVMe</text>
          {/* PCIe x16 Slot */}
          <rect x="56" y="122" width="125" height="11" rx="2" fill="#0C1118" stroke="#64A8E0" strokeWidth="1.2" />
          <text x="118" y="130" textAnchor="middle" fill="#A2AFBE" fontSize="6.5" fontFamily="monospace">PCIe 4.0 x16</text>
          {/* Chipset Heatsink */}
          <rect x="166" y="98" width="42" height="32" rx="3" fill="#1E2D3D" stroke="#3979B7" strokeWidth="1.2" />
          <text x="187" y="117" textAnchor="middle" fill="#A2AFBE" fontSize="6.5" fontFamily="monospace">CHIPSET</text>
          {/* 4 Standoffs */}
          <circle cx="43" cy="20" r="3.5" fill="#0C1118" stroke="#64A8E0" strokeWidth="1.2" />
          <circle cx="237" cy="20" r="3.5" fill="#0C1118" stroke="#64A8E0" strokeWidth="1.2" />
          <circle cx="43" cy="160" r="3.5" fill="#0C1118" stroke="#64A8E0" strokeWidth="1.2" />
          <circle cx="237" cy="160" r="3.5" fill="#0C1118" stroke="#64A8E0" strokeWidth="1.2" />
        </svg>
      );

    case 'cpu':
      return (
        <svg viewBox="0 0 280 180" className={className} role="img" aria-label="Esquemático técnico de Processador CPU">
          {/* Subtrato PCB */}
          <rect x="80" y="30" width="120" height="120" rx="8" fill="#16302B" stroke="#2D6A5E" strokeWidth="2" />
          {/* Contatos dourados de borda */}
          <g fill="#D4AF37" opacity="0.75">
            <rect x="88" y="36" width="6" height="6" rx="1" />
            <rect x="98" y="36" width="6" height="6" rx="1" />
            <rect x="176" y="36" width="6" height="6" rx="1" />
            <rect x="186" y="36" width="6" height="6" rx="1" />
            <rect x="88" y="138" width="6" height="6" rx="1" />
            <rect x="186" y="138" width="6" height="6" rx="1" />
          </g>
          {/* Difusor Térmico Integrado (IHS) */}
          <rect x="96" y="46" width="88" height="88" rx="6" fill="#2A3644" stroke="#7A8B9E" strokeWidth="2" />
          <rect x="106" y="56" width="68" height="68" rx="3" fill="#1F2935" stroke="#3979B7" strokeWidth="1" />
          {/* Marcação de Pino 1 */}
          <polygon points="84,146 94,146 84,136" fill="#F59E0B" />
          <text x="140" y="86" textAnchor="middle" fill="#F2F5F8" fontSize="11" fontWeight="700" fontFamily="monospace">
            MULTI-CORE
          </text>
          <text x="140" y="101" textAnchor="middle" fill="#64A8E0" fontSize="8.5" fontFamily="monospace">
            CPU ARCHITECTURE
          </text>
        </svg>
      );

    case 'cooler':
      return (
        <svg viewBox="0 0 280 180" className={className} role="img" aria-label="Esquemático técnico de Cooler e Dissipador">
          {/* Aletas do Dissipador */}
          <rect x="76" y="24" width="128" height="132" rx="10" fill="#1A2430" stroke="#47586B" strokeWidth="2" />
          <line x1="76" y1="44" x2="204" y2="44" stroke="#2A3746" strokeWidth="1.5" />
          <line x1="76" y1="136" x2="204" y2="136" stroke="#2A3746" strokeWidth="1.5" />
          {/* Heatpipes de cobre */}
          <circle cx="92" cy="34" r="4" fill="#C87D4B" />
          <circle cx="188" cy="34" r="4" fill="#C87D4B" />
          <circle cx="92" cy="146" r="4" fill="#C87D4B" />
          <circle cx="188" cy="146" r="4" fill="#C87D4B" />
          {/* Ventoinha PWM */}
          <circle cx="140" cy="90" r="50" fill="#0E151D" stroke="#3979B7" strokeWidth="2" />
          <path d="M140 90 C152 60, 174 62, 180 78 C164 82, 152 88, 140 90 Z" fill="#2A3B4E" stroke="#5397D1" strokeWidth="1" />
          <path d="M140 90 C170 102, 168 124, 152 130 C148 114, 142 102, 140 90 Z" fill="#2A3B4E" stroke="#5397D1" strokeWidth="1" />
          <path d="M140 90 C128 120, 106 118, 100 102 C116 98, 128 92, 140 90 Z" fill="#2A3B4E" stroke="#5397D1" strokeWidth="1" />
          <path d="M140 90 C110 78, 112 56, 128 50 C132 66, 138 78, 140 90 Z" fill="#2A3B4E" stroke="#5397D1" strokeWidth="1" />
          <circle cx="140" cy="90" r="15" fill="#1C2734" stroke="#64A8E0" strokeWidth="1.5" />
          <text x="140" y="93" textAnchor="middle" fill="#F2F5F8" fontSize="7" fontFamily="monospace">PWM</text>
        </svg>
      );

    case 'ram':
      return (
        <svg viewBox="0 0 280 180" className={className} role="img" aria-label="Esquemático técnico de Memória RAM DIMM">
          {/* Módulo DIMM */}
          <rect x="26" y="54" width="228" height="62" rx="4" fill="#142824" stroke="#3979B7" strokeWidth="1.8" />
          {/* Dissipador superior */}
          <path d="M30 54 H250 V72 H30 Z" fill="#1F2D3D" />
          {/* Chips DRAM */}
          {[42, 68, 94, 120, 150, 176, 202, 224].map((x, idx) => (
            <rect key={idx} x={x} y="76" width="18" height="24" rx="1.5" fill="#0B1016" stroke="#47586B" strokeWidth="1" />
          ))}
          {/* Contatos dourados com chanfro (Notch) */}
          <rect x="34" y="116" width="96" height="8" rx="1" fill="#D4AF37" />
          <rect x="138" y="116" width="108" height="8" rx="1" fill="#D4AF37" />
          <text x="140" y="66" textAnchor="middle" fill="#A2AFBE" fontSize="8" fontWeight="600" fontFamily="monospace">
            DIMM DDR4 / DDR5 MEMORY MODULE
          </text>
        </svg>
      );

    case 'ssd':
      return (
        <svg viewBox="0 0 280 180" className={className} role="img" aria-label="Esquemático técnico de Armazenamento SSD M.2 e SATA">
          {/* SSD M.2 2280 */}
          <rect x="30" y="34" width="215" height="44" rx="4" fill="#111C29" stroke="#5397D1" strokeWidth="1.5" />
          <rect x="30" y="42" width="10" height="28" fill="#D4AF37" />
          <rect x="52" y="41" width="30" height="30" rx="2" fill="#1E2B3A" stroke="#64A8E0" strokeWidth="1" />
          <rect x="94" y="41" width="44" height="30" rx="2" fill="#0B1016" stroke="#3979B7" strokeWidth="1" />
          <rect x="148" y="41" width="44" height="30" rx="2" fill="#0B1016" stroke="#3979B7" strokeWidth="1" />
          <circle cx="238" cy="56" r="5" fill="#0C1118" stroke="#A2AFBE" strokeWidth="1.5" />
          <text x="116" y="59" textAnchor="middle" fill="#F2F5F8" fontSize="7.5" fontFamily="monospace">NVMe M.2</text>

          {/* SSD 2.5" SATA */}
          <rect x="52" y="94" width="176" height="62" rx="6" fill="#1B2531" stroke="#47586B" strokeWidth="1.5" />
          <rect x="52" y="112" width="12" height="26" fill="#D4AF37" />
          <text x="144" y="124" textAnchor="middle" fill="#F2F5F8" fontSize="9.5" fontWeight="600" fontFamily="monospace">
            SSD 2.5" SATA III
          </text>
          <text x="144" y="138" textAnchor="middle" fill="#A2AFBE" fontSize="7.5" fontFamily="monospace">
            NAND FLASH SOLID STATE
          </text>
        </svg>
      );

    case 'video':
      return (
        <svg viewBox="0 0 280 180" className={className} role="img" aria-label="Esquemático técnico de Placa de Vídeo GPU">
          {/* Espelho PCI traseiro */}
          <rect x="28" y="28" width="8" height="122" rx="1" fill="#7A8B9E" />
          {/* Carena da GPU */}
          <rect x="36" y="38" width="212" height="94" rx="8" fill="#18222F" stroke="#5397D1" strokeWidth="1.8" />
          {/* Duas ventoinhas */}
          <circle cx="98" cy="85" r="34" fill="#0D131A" stroke="#3979B7" strokeWidth="1.5" />
          <circle cx="98" cy="85" r="10" fill="#1C2734" stroke="#64A8E0" strokeWidth="1" />
          <circle cx="184" cy="85" r="34" fill="#0D131A" stroke="#3979B7" strokeWidth="1.5" />
          <circle cx="184" cy="85" r="10" fill="#1C2734" stroke="#64A8E0" strokeWidth="1" />
          {/* Conector PCIe 8-pin superior */}
          <rect x="210" y="32" width="26" height="8" rx="1" fill="#0C1118" stroke="#F59E0B" strokeWidth="1.2" />
          {/* Contatos PCIe x16 inferior */}
          <rect x="64" y="132" width="118" height="9" rx="1" fill="#D4AF37" />
          <text x="142" y="28" textAnchor="middle" fill="#A2AFBE" fontSize="7.5" fontFamily="monospace">
            PCIe x16 GRAPHICS PROCESSOR
          </text>
        </svg>
      );

    case 'fonte':
    default:
      return (
        <svg viewBox="0 0 280 180" className={className} role="img" aria-label="Esquemático técnico de Fonte de Alimentação PSU">
          <rect x="44" y="26" width="192" height="128" rx="8" fill="#151E29" stroke="#47586B" strokeWidth="2" />
          {/* Grelha da ventoinha */}
          <circle cx="105" cy="90" r="44" fill="#0D131A" stroke="#3979B7" strokeWidth="1.5" />
          <circle cx="105" cy="90" r="30" fill="none" stroke="#2A3746" strokeWidth="1.2" />
          <circle cx="105" cy="90" r="16" fill="#1C2734" stroke="#5397D1" strokeWidth="1.2" />
          {/* Etiqueta de especificações elétricas */}
          <rect x="162" y="44" width="60" height="92" rx="4" fill="#0D131A" stroke="#3979B7" strokeWidth="1" />
          <text x="192" y="66" textAnchor="middle" fill="#F2F5F8" fontSize="10" fontWeight="700" fontFamily="monospace">
            ATX PSU
          </text>
          <text x="192" y="84" textAnchor="middle" fill="#64A8E0" fontSize="8" fontFamily="monospace">
            +12V RAIL
          </text>
          <text x="192" y="100" textAnchor="middle" fill="#10B981" fontSize="8" fontFamily="monospace">
            80 PLUS
          </text>
          <text x="192" y="118" textAnchor="middle" fill="#A2AFBE" fontSize="7" fontFamily="monospace">
            AC → DC
          </text>
        </svg>
      );
  }
};
