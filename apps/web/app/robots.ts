import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { SLUG_VACIO } from "@/lib/contenido";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", `/*/${SLUG_VACIO}`],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
