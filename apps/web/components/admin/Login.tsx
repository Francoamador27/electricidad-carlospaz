"use client";

import { useState } from "react";
import TurnstileWidget from "@/components/forms/TurnstileWidget";
import { adminApi, ErrorApi } from "@/lib/admin-api";

const HAY_TURNSTILE = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

const MENSAJES: Record<string, string> = {
  credenciales: "Usuario o contraseña incorrectos.",
  bloqueado: "Demasiados intentos fallidos. Esperá 15 minutos y volvé a probar.",
  turnstile: "No pudimos verificar que seas una persona. Probá de nuevo.",
  auth_no_configurado: "Faltan secretos del Worker: ADMIN_USUARIO, ADMIN_PASSWORD o ADMIN_SESSION_SECRET.",
  password_debil: "ADMIN_PASSWORD es muy corta: tiene que tener 12 caracteres o más.",
  secreto_debil: "ADMIN_SESSION_SECRET es muy corto: tiene que tener 32 caracteres o más.",
};

function Ojo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function OjoTachado() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-6.5 0-10-7-10-7a18.4 18.4 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <path d="M2 2l20 20" />
    </svg>
  );
}

export default function Login({ alEntrar }: { alEntrar: (usuario: string) => void }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);
  const [verPassword, setVerPassword] = useState(false);

  async function entrar(ev: React.FormEvent) {
    ev.preventDefault();
    setVerPassword(false);
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
        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 mb-1">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={verPassword ? "text" : "password"}
              className="w-full border border-slate-300 rounded pl-3 pr-11 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              autoCapitalize="none"
              spellCheck={false}
              required
            />
            <button
              type="button"
              onClick={() => setVerPassword((v) => !v)}
              aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              aria-pressed={verPassword}
              aria-controls="login-password"
              title={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute inset-y-0 right-0 w-11 grid place-items-center text-slate-500 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-r"
            >
              {verPassword ? <OjoTachado /> : <Ojo />}
            </button>
          </div>
        </div>
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
