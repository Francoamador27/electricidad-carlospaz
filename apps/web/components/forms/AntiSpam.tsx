"use client";

import TurnstileWidget from "@/components/forms/TurnstileWidget";

// Honeypot (campo invisible que solo completan los bots) + widget de Cloudflare Turnstile.
export default function AntiSpam() {
  return (
    <>
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label>
          Empresa
          <input type="text" name="empresa" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <TurnstileWidget />
    </>
  );
}
