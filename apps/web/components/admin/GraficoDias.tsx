"use client";

import { useState } from "react";

// Conversiones por día, barras apiladas. Paleta categórica validada: slots 1–3 en orden fijo.
export const SERIES = [
  { clave: "formulario", label: "Formularios", color: "#2a78d6" },
  { clave: "click_whatsapp", label: "WhatsApp", color: "#eb6834" },
  { clave: "click_telefono", label: "Teléfono", color: "#1baf7a" },
] as const;

export type Dia = { fecha: string } & Record<(typeof SERIES)[number]["clave"], number>;

const ALTO = 220;
const MARGEN = { arriba: 12, abajo: 28, izq: 32, der: 8 };

function etiquetaDia(fecha: string) {
  const [, m, d] = fecha.split("-");
  return `${Number(d)}/${Number(m)}`;
}

function escala(max: number) {
  const paso = max <= 4 ? 1 : max <= 10 ? 2 : max <= 25 ? 5 : Math.ceil(max / 5 / 5) * 5;
  const tope = Math.max(paso, Math.ceil(max / paso) * paso);
  const marcas = [];
  for (let v = 0; v <= tope; v += paso) marcas.push(v);
  return { tope, marcas };
}

export default function GraficoDias({ dias }: { dias: Dia[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const [verTabla, setVerTabla] = useState(false);

  const totales = dias.map((d) => SERIES.reduce((s, x) => s + d[x.clave], 0));
  const { tope, marcas } = escala(Math.max(1, ...totales));
  const ancho = Math.max(320, dias.length * 22);
  const areaAncho = ancho - MARGEN.izq - MARGEN.der;
  const areaAlto = ALTO - MARGEN.arriba - MARGEN.abajo;
  const col = areaAncho / dias.length;
  const barra = Math.max(4, Math.min(28, col * 0.62));
  const y = (v: number) => MARGEN.arriba + areaAlto - (v / tope) * areaAlto;
  const cadaEtiqueta = Math.ceil(dias.length / 10);

  const d = hover !== null ? dias[hover] : null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-slate-700">
        {SERIES.map((s) => (
          <span key={s.clave} className="inline-flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-sm" style={{ background: s.color }} aria-hidden />
            {s.label}
          </span>
        ))}
        <button className="ml-auto text-xs underline text-slate-600" onClick={() => setVerTabla(!verTabla)}>
          {verTabla ? "Ver gráfico" : "Ver tabla"}
        </button>
      </div>

      {verTabla ? (
        <div className="overflow-x-auto max-h-80">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-1 pr-4 font-medium">Día</th>
                {SERIES.map((s) => (
                  <th key={s.clave} className="py-1 pr-4 font-medium text-right">{s.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...dias].reverse().map((dia) => (
                <tr key={dia.fecha} className="border-t border-slate-100">
                  <td className="py-1 pr-4">{dia.fecha}</td>
                  {SERIES.map((s) => (
                    <td key={s.clave} className="py-1 pr-4 text-right tabular-nums">{dia[s.clave]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative overflow-x-auto">
          <svg
            viewBox={`0 0 ${ancho} ${ALTO}`}
            className="w-full min-w-[320px]"
            style={{ height: ALTO }}
            role="img"
            aria-label="Conversiones por día"
            onMouseLeave={() => setHover(null)}
          >
            {marcas.map((m) => (
              <g key={m}>
                <line x1={MARGEN.izq} x2={ancho - MARGEN.der} y1={y(m)} y2={y(m)} stroke="#e5e7eb" strokeWidth={1} />
                <text x={MARGEN.izq - 6} y={y(m) + 4} textAnchor="end" fontSize={11} fill="#6b7280">
                  {m}
                </text>
              </g>
            ))}
            {dias.map((dia, i) => {
              const x = MARGEN.izq + i * col + (col - barra) / 2;
              let base = 0;
              const segmentos = SERIES.filter((s) => dia[s.clave] > 0);
              return (
                <g key={dia.fecha}>
                  {hover === i && (
                    <rect x={MARGEN.izq + i * col} y={MARGEN.arriba} width={col} height={areaAlto} fill="#f1f5f9" />
                  )}
                  {segmentos.map((s, j) => {
                    const v = dia[s.clave];
                    const y0 = y(base);
                    base += v;
                    const y1 = y(base);
                    const esTope = j === segmentos.length - 1;
                    // 2px de separación entre segmentos; esquinas de 4px solo arriba.
                    const alto = Math.max(1, y0 - y1 - (j > 0 ? 2 : 0));
                    const r = esTope ? Math.min(4, barra / 2, alto) : 0;
                    const top = y1;
                    return (
                      <path
                        key={s.clave}
                        fill={s.color}
                        d={`M${x},${top + alto} V${top + r} Q${x},${top} ${x + r},${top} H${x + barra - r} Q${x + barra},${top} ${x + barra},${top + r} V${top + alto} Z`}
                      />
                    );
                  })}
                  {i % cadaEtiqueta === 0 && (
                    <text x={x + barra / 2} y={ALTO - 8} textAnchor="middle" fontSize={11} fill="#6b7280">
                      {etiquetaDia(dia.fecha)}
                    </text>
                  )}
                  {/* Área de hover más grande que la barra */}
                  <rect
                    x={MARGEN.izq + i * col}
                    y={MARGEN.arriba}
                    width={col}
                    height={areaAlto}
                    fill="transparent"
                    onMouseEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    tabIndex={0}
                  />
                </g>
              );
            })}
            <line
              x1={MARGEN.izq}
              x2={ancho - MARGEN.der}
              y1={y(0)}
              y2={y(0)}
              stroke="#9ca3af"
              strokeWidth={1}
            />
          </svg>
          {d && hover !== null && (
            <div
              className="pointer-events-none absolute top-2 bg-white border border-slate-200 shadow rounded px-3 py-2 text-xs"
              style={{
                left: `${((MARGEN.izq + hover * col + col / 2) / ancho) * 100}%`,
                transform: hover > dias.length / 2 ? "translateX(calc(-100% - 8px))" : "translateX(8px)",
              }}
            >
              <p className="font-semibold text-slate-900 mb-1">{d.fecha}</p>
              {SERIES.map((s) => (
                <p key={s.clave} className="flex items-center gap-2 text-slate-700">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                  {s.label}: <span className="tabular-nums font-medium">{d[s.clave]}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
