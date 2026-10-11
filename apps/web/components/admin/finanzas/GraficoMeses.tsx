"use client";

import { useState } from "react";
import { formatoPesos } from "@voltis/shared/agenda";

// Ingresos cobrados por mes (una sola serie: no necesita leyenda; el título la nombra).
// Ganancia y gastos van en el tooltip y en la tabla. Colores por variables CSS: modo oscuro incluido.
export type Mes = { mes: string; cobrado: number; gastos: number };

const ALTO = 200;
const M = { arriba: 12, abajo: 26, izq: 8, der: 8 };
const nombreMes = new Intl.DateTimeFormat("es-AR", { timeZone: "UTC", month: "short" });
const etiqueta = (mes: string) => nombreMes.format(new Date(`${mes}-15T12:00:00Z`)).replace(".", "");
const nombreLargo = new Intl.DateTimeFormat("es-AR", { timeZone: "UTC", month: "long", year: "numeric" });

function compacto(centavos: number): string {
  const pesos = centavos / 100;
  if (pesos >= 1_000_000) return `$${(pesos / 1_000_000).toLocaleString("es-AR", { maximumFractionDigits: 1 })} M`;
  if (pesos >= 1_000) return `$${Math.round(pesos / 1_000).toLocaleString("es-AR")} mil`;
  return `$${Math.round(pesos)}`;
}

export default function GraficoMeses({ meses }: { meses: Mes[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const [tabla, setTabla] = useState(false);
  const max = Math.max(1, ...meses.map((m) => m.cobrado));
  const ancho = 640;
  const areaAncho = ancho - M.izq - M.der;
  const areaAlto = ALTO - M.arriba - M.abajo;
  const col = areaAncho / meses.length;
  const barra = Math.min(34, col * 0.62);
  const y = (v: number) => M.arriba + areaAlto - (v / max) * areaAlto;
  const d = hover != null ? meses[hover] : null;

  return (
    <div>
      <div className="flex justify-end mb-1">
        <button type="button" onClick={() => setTabla(!tabla)} className="ios-boton-texto text-[13px] -mr-3">
          {tabla ? "Ver gráfico" : "Ver tabla"}
        </button>
      </div>
      {tabla ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="ios-secundario text-left">
              <tr>
                <th className="py-1 pr-3 font-medium">Mes</th>
                <th className="py-1 pr-3 font-medium text-right">Cobrado</th>
                <th className="py-1 pr-3 font-medium text-right">Gastos</th>
                <th className="py-1 font-medium text-right">Ganancia</th>
              </tr>
            </thead>
            <tbody>
              {[...meses].reverse().map((m) => (
                <tr key={m.mes} className="border-t border-[var(--ios-separador)]">
                  <td className="py-1.5 pr-3 capitalize">{nombreLargo.format(new Date(`${m.mes}-15T12:00:00Z`))}</td>
                  <td className="py-1.5 pr-3 text-right tabular-nums">{formatoPesos(m.cobrado)}</td>
                  <td className="py-1.5 pr-3 text-right tabular-nums">{formatoPesos(m.gastos)}</td>
                  <td className="py-1.5 text-right tabular-nums">{formatoPesos(m.cobrado - m.gastos)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative">
          <svg viewBox={`0 0 ${ancho} ${ALTO}`} className="w-full h-auto" role="img" aria-label="Ingresos cobrados por mes, últimos 12 meses" onMouseLeave={() => setHover(null)}>
            <line x1={M.izq} x2={ancho - M.der} y1={y(0)} y2={y(0)} stroke="var(--ios-separador)" strokeWidth={1} />
            {meses.map((m, i) => {
              const x = M.izq + i * col + (col - barra) / 2;
              const alto = Math.max(y(0) - y(m.cobrado), m.cobrado > 0 ? 2 : 0);
              const r = Math.min(4, barra / 2, alto);
              const top = y(0) - alto;
              return (
                <g key={m.mes}>
                  {hover === i && <rect x={M.izq + i * col} y={M.arriba} width={col} height={areaAlto} fill="var(--ios-relleno)" />}
                  {alto > 0 && (
                    <path
                      fill="var(--ios-acento)"
                      d={`M${x},${y(0)} V${top + r} Q${x},${top} ${x + r},${top} H${x + barra - r} Q${x + barra},${top} ${x + barra},${top + r} V${y(0)} Z`}
                    />
                  )}
                  <text x={x + barra / 2} y={ALTO - 8} textAnchor="middle" fontSize={11} fill="var(--ios-texto-2)">
                    {etiqueta(m.mes)}
                  </text>
                  <rect
                    x={M.izq + i * col}
                    y={M.arriba}
                    width={col}
                    height={areaAlto}
                    fill="transparent"
                    tabIndex={0}
                    aria-label={`${nombreLargo.format(new Date(`${m.mes}-15T12:00:00Z`))}: ${formatoPesos(m.cobrado)}`}
                    onMouseEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    onClick={() => setHover(i)}
                  />
                </g>
              );
            })}
            {/* Etiqueta directa solo en el máximo (no en cada barra). */}
            {(() => {
              const i = meses.findIndex((m) => m.cobrado === max && max > 1);
              if (i < 0) return null;
              return (
                <text x={M.izq + i * col + col / 2} y={y(max) - 4} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--ios-texto)">
                  {compacto(max)}
                </text>
              );
            })()}
          </svg>
          {d && hover != null && (
            <div
              className="pointer-events-none absolute top-0 ios-card px-3 py-2 text-xs shadow-lg"
              style={{
                left: `${((M.izq + hover * col + col / 2) / ancho) * 100}%`,
                transform: hover > meses.length / 2 ? "translateX(calc(-100% - 8px))" : "translateX(8px)",
              }}
            >
              <p className="font-semibold capitalize mb-1">{nombreLargo.format(new Date(`${d.mes}-15T12:00:00Z`))}</p>
              <p className="tabular-nums">Cobrado: {formatoPesos(d.cobrado)}</p>
              <p className="tabular-nums ios-secundario">Gastos: {formatoPesos(d.gastos)}</p>
              <p className="tabular-nums font-medium">Ganancia: {formatoPesos(d.cobrado - d.gastos)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
