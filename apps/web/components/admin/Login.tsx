"use client";

import { useState } from "react";
import TurnstileWidget from "@/components/forms/TurnstileWidget";
import { adminApi, ErrorApi } from "@/lib/admin-api";

const HAY_TURNSTILE = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

const MENSAJES: Record<string, string> = {
  credenciales: "Usuario o contraseña incorrectos.",
  bloqueado: "Demasiados intentos fallidos. Esperá 15 minutos y volvé a probar.",
  turnstile: "No pudimos verificar que seas una persona. Probá de nuevo.",
  auth_no_configurado: "El login no está configurado en el servidor (faltan los secretos del Worker).",
  password_debil: "La contraseña configurada en el servidor es muy corta (mínimo 12 caracteres).",
};

export default function Login({ alEntrar }: { alEntrar: (usuario: string) => void }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  async function entrar(ev: React.FormEvent) {
    ev.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      const r = await adminApi<{ usuario: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ usuario, password, turnstileToken: token || undefined }),
      });
      alEntrar(r.usuario);
    } catch (e) {
      setError(e instanceof ErrorApi ? (MENSAJES[e.codigo] ?? `Error (${e.estado}).`) : "No se pudo conectar con el servidor.");
      setPassword("");
      setIntento((n) => n + 1); // pide un token nuevo de Turnstile
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 grid place-items-center p-4">
      <form onSubmit={entrar} className="w-full max-w-sm bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-sm">
        <h1 className="text-xl font-bold">
          Voltis <span className="text-amber-500">panel</span>
        </h1>
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-1">Usuario</span>
          <input
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoComplete="username"
            autoCapitalize="none"
            required
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-1">Contraseña</span>
          <input
            type="password"
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <TurnstileWidget onToken={setToken} reiniciar={intento} />
        {error && (
          <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={enviando || (HAY_TURNSTILE && !token)}
          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded py-2 disabled:opacity-60"
        >
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
