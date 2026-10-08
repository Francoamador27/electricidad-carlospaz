export default function EmergencyCTA() {
  return (
    <section className="bg-red-950 text-white py-14">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Ante una emergencia eléctrica, llamá a un experto
        </h2>
        <p className="text-red-200 text-base md:text-lg mb-2 max-w-2xl mx-auto leading-relaxed">
          Los trabajos eléctricos son peligrosos y deben ser realizados únicamente por
          electricistas matriculados. No intentes resolver problemas eléctricos por tu cuenta:
          un error puede causar incendios, descargas eléctricas o daños irreversibles en tu
          instalación.
        </p>
        <p className="text-red-300 text-sm mb-8">
          Disponibles las <span className="font-bold text-white">24 horas</span> para urgencias
          eléctricas en Carlos Paz y toda la región de Punilla.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="tel:+5493513873029"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg shadow-lg"
          >
            ☎ Llamar ahora — (351) 387-3029
          </a>
          <a
            href="https://wa.me/5493513873029?text=Hola%2C+tengo+una+urgencia+el%C3%A9ctrica+y+necesito+ayuda"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg shadow-lg"
          >
            💬 WhatsApp urgente
          </a>
        </div>
        <p className="text-red-400 text-xs mt-6">
          ⚡ Recordá: en Argentina solo los electricistas matriculados pueden realizar
          instalaciones y reparaciones eléctricas (Resolución SE 1/2020 y AEA 90364).
        </p>
      </div>
    </section>
  );
}
