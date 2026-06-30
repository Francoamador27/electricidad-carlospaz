"use client";

import { useState } from "react";
import type { QuoteFormData } from "@/types";

const serviceOptions = [
  "Instalaciones domiciliarias",
  "Instalaciones para empresas",
  "Mantenimiento eléctrico",
  "Reparaciones eléctricas",
  "Tableros eléctricos",
  "Iluminación y automatización",
  "Otro",
];

export default function PresupuestoPage() {
  const [form, setForm] = useState<QuoteFormData>({
    name: "",
    phone: "",
    email: "",
    location: "",
    serviceType: "",
    message: "",
    urgency: "normal",
    propertyType: "residential",
  });
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const urgencyLabel: Record<string, string> = {
      normal: "Normal",
      urgent: "Urgente",
      emergency: "Emergencia 🚨",
    };
    const propertyLabel: Record<string, string> = {
      residential: "Vivienda / Casa",
      commercial: "Local / Comercio",
      industrial: "Industria / Empresa",
    };

    const lines = [
      "Hola! Quiero solicitar un presupuesto eléctrico 👇",
      "",
      `*Nombre:* ${form.name}`,
      `*Teléfono:* ${form.phone}`,
      form.email ? `*Email:* ${form.email}` : "",
      `*Localidad:* ${form.location}`,
      `*Servicio:* ${form.serviceType}`,
      `*Propiedad:* ${propertyLabel[form.propertyType]}`,
      `*Urgencia:* ${urgencyLabel[form.urgency]}`,
      "",
      `*Descripción:*`,
      form.message,
    ].filter(Boolean);

    const url = `https://wa.me/5493513873029?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setStatus("sent");
  }

  return (
    <>
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wide">
            Solicitar presupuesto
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Solicitá tu presupuesto eléctrico en Carlos Paz
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Contanos qué necesitás y te respondemos a la brevedad con el presupuesto para tu
            trabajo eléctrico en Carlos Paz y la región de Punilla.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          {status === "sent" ? (
            <div className="bg-green-50 border border-green-300 rounded-xl p-12 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="font-bold text-green-800 text-2xl mb-3">
                ¡Presupuesto solicitado con éxito!
              </h2>
              <p className="text-green-700 leading-relaxed">
                Recibimos tu solicitud y te contactamos a la brevedad con el presupuesto para tu
                trabajo eléctrico en Carlos Paz. También podés escribirnos por WhatsApp si necesitás
                una respuesta más rápida.
              </p>
              <a
                href="https://wa.me/5493513873029"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 bg-amber-500 text-slate-900 font-bold px-6 py-3 rounded-lg hover:bg-amber-400 transition-colors"
              >
                💬 Escribir por WhatsApp
              </a>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Completá el formulario de presupuesto
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Personal info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nombre y apellido <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Teléfono / WhatsApp <span className="text-red-500">*</span>
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
                    Localidad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={form.location}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="Carlos Paz, Valle Hermoso, Cosquín..."
                  />
                </div>

                {/* Service type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tipo de servicio <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="serviceType"
                      required
                      value={form.serviceType}
                      onChange={handleChange}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                    >
                      <option value="">Seleccioná...</option>
                      {serviceOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tipo de propiedad
                    </label>
                    <select
                      name="propertyType"
                      value={form.propertyType}
                      onChange={handleChange}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                    >
                      <option value="residential">Vivienda / Casa</option>
                      <option value="commercial">Local / Comercio</option>
                      <option value="industrial">Industria / Empresa</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Urgencia
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: "normal", label: "Normal" },
                      { value: "urgent", label: "Urgente" },
                      { value: "emergency", label: "Emergencia" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex-1 text-center py-2 rounded-lg border text-sm font-medium cursor-pointer transition-colors ${
                          form.urgency === opt.value
                            ? "bg-amber-500 border-amber-500 text-slate-900"
                            : "border-slate-300 text-slate-600 hover:border-amber-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="urgency"
                          value={opt.value}
                          checked={form.urgency === opt.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Descripción del trabajo <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                    placeholder="Describí el trabajo eléctrico que necesitás. Cuanto más detalle, mejor presupuesto podemos darte..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-4 rounded-lg transition-colors text-base"
                >
                  Solicitar presupuesto por WhatsApp 💬
                </button>

                <p className="text-xs text-slate-500 text-center">
                  Respondemos en menos de 24 horas. Para urgencias:{" "}
                  <a href="tel:+5493513873029" className="text-amber-600 hover:underline font-medium">
                    (351) 387-3029
                  </a>
                </p>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
