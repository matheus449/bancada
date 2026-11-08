/**
 * HardwareDex — Engine Educacional Standalone (HTML5 + CSS3 + ES6+)
 * Compatível com GitHub Pages (raiz ou subdiretório), execução local (file://) e servidores estáticos.
 */
(function () {
  if (window.__HARDWAREDEX_VITE_LOADED__) return;

  const SVG_SCHEMATICS = {
    placa: `<svg viewBox="0 0 280 180" style="width:100%;height:100%;max-height:160px;" role="img" aria-label="Esquemático Placa-Mãe">
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
    cpu: `<svg viewBox="0 0 280 180" style="width:100%;height:100%;max-height:160px;" role="img" aria-label="Esquemático CPU">
      <rect x="80" y="30" width="120" height="120" rx="8" fill="#16302B" stroke="#2D6A5E" stroke-width="2" />
      <rect x="96" y="46" width="88" height="88" rx="6" fill="#2A3644" stroke="#7A8B9E" stroke-width="2" />
      <rect x="106" y="56" width="68" height="68" rx="3" fill="#1F2935" stroke="#3979B7" stroke-width="1" />
      <polygon points="84,146 94,146 84,136" fill="#F59E0B" />
      <text x="140" y="86" text-anchor="middle" fill="#F2F5F8" font-size="11" font-weight="700" font-family="monospace">MULTI-CORE</text>
      <text x="140" y="101" text-anchor="middle" fill="#64A8E0" font-size="8.5" font-family="monospace">CPU ARCHITECTURE</text>
    </svg>`,
    cooler: `<svg viewBox="0 0 280 180" style="width:100%;height:100%;max-height:160px;" role="img" aria-label="Esquemático Cooler">
      <rect x="76" y="24" width="128" height="132" rx="10" fill="#1A2430" stroke="#47586B" stroke-width="2" />
      <circle cx="92" cy="34" r="4" fill="#C87D4B" /><circle cx="188" cy="34" r="4" fill="#C87D4B" />
      <circle cx="92" cy="146" r="4" fill="#C87D4B" /><circle cx="188" cy="146" r="4" fill="#C87D4B" />
      <circle cx="140" cy="90" r="50" fill="#0E151D" stroke="#3979B7" stroke-width="2" />
      <circle cx="140" cy="90" r="15" fill="#1C2734" stroke="#64A8E0" stroke-width="1.5" />
      <text x="140" y="93" text-anchor="middle" fill="#F2F5F8" font-size="7" font-family="monospace">PWM</text>
    </svg>`,
    ram: `<svg viewBox="0 0 280 180" style="width:100%;height:100%;max-height:160px;" role="img" aria-label="Esquemático Memória RAM">
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
    ssd: `<svg viewBox="0 0 280 180" style="width:100%;height:100%;max-height:160px;" role="img" aria-label="Esquemático SSD">
      <rect x="30" y="34" width="215" height="44" rx="4" fill="#111C29" stroke="#5397D1" stroke-width="1.5" />
      <rect x="30" y="42" width="10" height="28" fill="#D4AF37" />
      <text x="135" y="59" text-anchor="middle" fill="#F2F5F8" font-size="8.5" font-family="monospace">NVMe M.2 PCIe 2280</text>
      <rect x="52" y="94" width="176" height="62" rx="6" fill="#1B2531" stroke="#47586B" stroke-width="1.5" />
      <rect x="52" y="112" width="12" height="26" fill="#D4AF37" />
      <text x="144" y="124" text-anchor="middle" fill="#F2F5F8" font-size="9.5" font-weight="600" font-family="monospace">SSD 2.5" SATA III</text>
      <text x="144" y="138" text-anchor="middle" fill="#A2AFBE" font-size="7.5" font-family="monospace">NAND FLASH SOLID STATE</text>
    </svg>`,
    video: `<svg viewBox="0 0 280 180" style="width:100%;height:100%;max-height:160px;" role="img" aria-label="Esquemático Placa de Vídeo">
      <rect x="28" y="28" width="8" height="122" rx="1" fill="#7A8B9E" />
      <rect x="36" y="38" width="212" height="94" rx="8" fill="#18222F" stroke="#5397D1" stroke-width="1.8" />
      <circle cx="98" cy="85" r="34" fill="#0D131A" stroke="#3979B7" stroke-width="1.5" />
      <circle cx="98" cy="85" r="10" fill="#1C2734" stroke="#64A8E0" />
      <circle cx="184" cy="85" r="34" fill="#0D131A" stroke="#3979B7" stroke-width="1.5" />
      <circle cx="184" cy="85" r="10" fill="#1C2734" stroke="#64A8E0" />
      <rect x="64" y="132" width="118" height="9" rx="1" fill="#D4AF37" />
      <text x="142" y="28" text-anchor="middle" fill="#A2AFBE" font-size="7.5" font-family="monospace">PCIe x16 GRAPHICS PROCESSOR</text>
    </svg>`,
    fonte: `<svg viewBox="0 0 280 180" style="width:100%;height:100%;max-height:160px;" role="img" aria-label="Esquemático Fonte PSU">
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

  window.HardwareDexSVG = SVG_SCHEMATICS;
})();
