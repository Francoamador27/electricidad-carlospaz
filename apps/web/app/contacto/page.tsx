"use client";

import type { Metadata } from "next";
import { useState } from "react";
import type { ContactFormData } from "@/types";

// Note: Metadata export only works in Server Components.
// Move this to a separate layout.tsx or use generateMetadata if needed.
// For now the root layout metadata covers this page.

const serviceOptions = [
  "Instalaciones domiciliarias",
  "Instalaciones para empresas",
  "Mantenimiento eléctrico",
  "Reparaciones eléctricas",
  "Tableros eléctricos",
  "Iluminación y automatización",
  "Otro",
];

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    phone: "",
    email: "",
    location: "",
    serviceType: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      // TODO: replace with real API call once Laravel backend is ready
      // const { api } = await import("@/lib/api");
      // await api.contact.send(form);
      await new Promise((r) => setTimeout(r, 1000)); // simulated delay
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wide">
            Contacto
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Contactá a tu electricista en Carlos Paz
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Respondemos a la brevedad. Podés escribirnos por WhatsApp, llamar o completar el
            formulario y te contactamos nosotros.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12">

          {/* Contact info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Información de contacto</h2>

            <div className="space-y-4">
              {[
                {
                  icon: "📞",
                  title: "Teléfono",
                  content: <a href="tel:+5493513873029" className="text-amber-600 hover:underline font-medium">(351) 387-3029</a>,
                },
                {
                  icon: "💬",
                  title: "WhatsApp",
                  content: (
                    <a href="https://wa.me/5493513873029" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-medium">
                      +54 9 351 387-3029
                    </a>
                  ),
                },
                {
                  icon: "✉️",
                  title: "Email",
                  content: <a href="mailto:francohugoamador25@gmail.com" className="text-amber-600 hover:underline font-medium">francohugoamador25@gmail.com</a>,
                },
                {
                  icon: "📍",
                  title: "Zona de cobertura",
                  content: <span className="text-slate-700">Carlos Paz, Valle Hermoso, Cosquín, La Falda, La Cumbre y toda la región de Punilla, Córdoba.</span>,
                },
                {
                  icon: "🕐",
                  title: "Horarios de atención",
                  content: (
                    <div className="text-slate-700 text-sm space-y-0.5">
                      <div>Lunes a Viernes: 8:00 – 18:00</div>
                      <div>Sábados: 8:00 – 13:00</div>
                      <div className="text-amber-600 font-medium">Urgencias: 24/7</div>
                    </div>
                  ),
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <div className="font-semibold text-slate-900 mb-0.5">{item.title}</div>
                    {item.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Google Maps — Valle de Punilla */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Zona de cobertura — Valle de Punilla, Córdoba
              </h3>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108962.4227165798!2d-64.58213829262995!3d-31.412040083187616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x942d6640d6777c71%3A0x75c24ab6cb121bed!2sVilla%20Carlos%20Paz%2C%20C%C3%B3rdoba%2C%20Argentina!5e0!3m2!1ses-419!2sit!4v1782660348956!5m2!1ses-419!2sit"
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="rounded-xl w-full"
                title="Villa Carlos Paz, Córdoba, Argentina"
              />
              <p className="text-xs text-slate-500 mt-2">
                Atendemos en Carlos Paz, Valle Hermoso, Cosquín, La Falda, La Cumbre y toda la
                región de Punilla.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Envianos tu consulta</h2>

            {status === "sent" ? (
              <div className="bg-green-50 border border-green-300 rounded-xl p-8 text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="font-bold text-green-800 text-xl mb-2">¡Mensaje enviado!</h3>
                <p className="text-green-700">
                  Te respondemos a la brevedad. También podés escribirnos por WhatsApp si es urgente.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="+54 9 354..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Localidad
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="Carlos Paz, Valle Hermoso..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tipo de servicio
                  </label>
                  <select
                    name="serviceType"
                    value={form.serviceType}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                  >
                    <option value="">Seleccioná un servicio...</option>
                    {serviceOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Detalle del trabajo <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                    placeholder="Describí brevemente el trabajo eléctrico que necesitás..."
                  />
                </div>

                {status === "error" && (
                  <p className="text-red-600 text-sm">
                    Hubo un error al enviar. Intentá por WhatsApp.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-lg transition-colors disabled:opacity-60"
                >
                  {status === "sending" ? "Enviando..." : "Enviar consulta"}
                </button>

                <p className="text-xs text-slate-500 text-center">
                  También podés escribirnos directamente por{" "}
                  <a href="https://wa.me/5493513873029" className="text-amber-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
