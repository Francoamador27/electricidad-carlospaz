import Script from "next/script";

// Una sola carga de gtag.js con todos los destinos (Google Ads y GA4).
export default function Gtag({ ids }: { ids: string[] }) {
  if (!ids.length) return null;
  const configs = ids.map((id) => `gtag('config',${JSON.stringify(id)});`).join("");
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ids[0]}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${configs}`}
      </Script>
    </>
  );
}
