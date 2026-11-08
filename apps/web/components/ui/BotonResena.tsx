import { GBP_REVIEW_URL } from "@/lib/site";

// Solo se muestra si está cargada NEXT_PUBLIC_GBP_REVIEW_URL.
export default function BotonResena({ className = "" }: { className?: string }) {
  if (!GBP_REVIEW_URL) return null;
  return (
    <a
      href={GBP_REVIEW_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 border border-copper text-copper hover:bg-copper hover:text-white font-semibold text-sm px-4 py-2 rounded-sm transition-colors ${className}`}
    >
      ★ Dejame tu reseña en Google
    </a>
  );
}
