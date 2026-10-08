"use client";

import Script from "next/script";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// Honeypot (campo invisible que solo completan los bots) + widget de Cloudflare Turnstile.
// El widget agrega al form un input "cf-turnstile-response" con el token.
export default function AntiSpam() {
  return (
    <>
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label>
          Empresa
          <input type="text" name="empresa" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      {SITE_KEY && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
          <div className="cf-turnstile" data-sitekey={SITE_KEY} data-language="es" data-size="flexible" />
        </>
      )}
    </>
  );
}
