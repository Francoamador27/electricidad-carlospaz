import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { SLUG_VACIO } from "@/lib/contenido";

export const dynamic = "force-static";

const BLOQUEADO = ["/admin", `/*/${SLUG_VACIO}`];

// Buscadores e IA permitidos explícitamente: queremos que nos citen.
const BOTS_IA = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: BLOQUEADO },
      { userAgent: BOTS_IA, allow: "/", disallow: BLOQUEADO },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
