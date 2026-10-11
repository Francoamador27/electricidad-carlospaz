# Plan: panel de Voltis como app (PWA) + Agenda y Finanzas

> Estado: **Fase 1 terminada** (2026-10-11). Siguen las Fases 2 a 5 con las decisiones de la sección 12.
> Alcance: solo el panel (`/admin`). El sitio público no cambia ni se vuelve "instalable".

## 1. Objetivo

Convertir el panel en **la app de trabajo de Voltis en el celular**:

- **Instalable** (ícono en la pantalla de inicio, pantalla completa), con **estética de iPhone**.
- **Agenda** de trabajos: cliente, dirección y ubicación en el mapa, trabajo a realizar, cuánto se
  cobra; eventos de horas o de varios días.
- **Finanzas**: cuánto se va ganando, qué falta cobrar y **qué tipo de trabajo deja más**.
- Fotos de obra desde la cámara y **avisos en el celular** (consultas nuevas y trabajos del día).

## 2. Qué cambia para el negocio

| Hoy | Con la app |
| --- | --- |
| Los trabajos se anotan en papel, WhatsApp o el calendario del teléfono | **Agenda** con cliente, dirección, mapa, trabajo y precio en un solo lugar |
| No hay forma rápida de saber cuánto se ganó en el mes | **Finanzas**: cobrado, pendiente, ganancia y ranking por tipo de trabajo |
| Las consultas llegan por mail y se pasan a mano | Desde una consulta: **"Agendar"** y los datos del cliente se cargan solos |
| Para ir a lo del cliente se busca la dirección en Maps | Botón **"Cómo llegar"** que abre Google Maps o Waze |
| Las fotos de obra se pasan a la compu | **"Sacar foto"** desde el trabajo o el proyecto |
| Se entra al panel desde el navegador | Ícono **Voltis** en el celular, con aviso de trabajos y consultas |

## 3. Por qué es viable

- El panel ya es una app estática en `/admin` que habla con la API del Worker: es la base de una PWA.
- Las fotos ya se convierten a WebP en el navegador (una foto de 5 MB sube como unos 200 KB).
- Mapas y navegación **sin API de Google ni clave**: se usan los links públicos de Google Maps y Waze.
- Todo corre en lo que ya existe (Pages + Worker + Neon). **Costo: $0.**

## 4. Estética iPhone (sistema de diseño del panel)

El panel adopta el lenguaje visual de iOS, para que en el iPhone se sienta como una app nativa:

- **Tipografía del sistema** (`-apple-system`, SF Pro en iPhone; Roboto/Segoe en otros equipos).
- **Títulos grandes** que se achican al hacer scroll ("Agenda", "Finanzas").
- **Listas agrupadas** con esquinas redondeadas sobre fondo gris claro, como Configuración de iOS.
- **Barra de pestañas inferior** con íconos: Agenda · Consultas · Finanzas · Proyectos · Más.
- **Hojas que suben desde abajo** (bottom sheets) para ver o editar un trabajo.
- **Controles iOS:** selector segmentado (Día · Semana · Mes · Lista), interruptores, y los
  selectores de fecha y hora nativos del teléfono (las "ruedas" del iPhone).
- **Color de acento:** el cobre de Voltis. Colores del sistema para estados (verde cobrado,
  naranja pendiente, rojo cancelado), siempre acompañados de texto o ícono, nunca solo color.
- **Modo oscuro** automático, como el resto del iPhone.
- **Área segura** respetada en iPhone con notch o isla dinámica.
- Contraste accesible (mínimo 4,5:1 en textos) y botones de 44 px o más, como pide Apple.

Se aplica a todo el panel, para que Agenda, Finanzas, Consultas y Proyectos se vean igual.

## 5. Agenda

### 5.1 Qué se guarda de cada trabajo

| Campo | Detalle |
| --- | --- |
| **Título** | Ej.: "Cambio de tablero". Se sugiere a partir del tipo de trabajo |
| **Tipo de trabajo** | Uno de los servicios de Voltis (tableros, instalación, reparación, cámaras, certificado…). Es la base de las estadísticas por tipo |
| **Cliente** | Nombre y teléfono (con botones **Llamar** y **WhatsApp**) |
| **Dirección** | Calle, número y localidad (lista de las 15 zonas + "otra") |
| **Ubicación en el mapa** | Opcional: link de Google Maps pegado, o "Usar mi ubicación actual" estando en el lugar |
| **Trabajo a realizar** | Texto libre: qué hay que hacer, materiales, observaciones |
| **Cuándo** | Inicio y fin. Interruptor **"Todo el día"**: si está activo se eligen solo fechas (puede abarcar varios días); si no, fecha y hora |
| **Precio acordado** | Lo que se le va a cobrar, en pesos |
| **Pagos** | Uno o varios: seña, saldo, etc., cada uno con fecha, monto y medio (efectivo, transferencia, Mercado Pago) |
| **Gastos** | Opcional: materiales u otros gastos del trabajo, para calcular la ganancia real |
| **Estado** | Agendado · En curso · Terminado · Cancelado |
| **Notas** | Privadas, no se publican nunca |
| **Origen** | Si vino de una consulta del sitio, queda vinculada (sirve para medir conversiones) |

El **estado de cobro** se calcula solo: *Sin cobrar*, *Señado* (pagó una parte) o *Cobrado*
(pagos ≥ precio).

### 5.2 Vistas

- **Mes**: calendario con puntos de color en los días con trabajos; al tocar un día se ve la lista
  debajo (como el Calendario del iPhone). Los trabajos de varios días se muestran como una barra.
- **Semana** y **Día**: línea de tiempo por horas; los de "todo el día" van arriba.
- **Lista**: próximos trabajos agrupados por día ("Hoy", "Mañana", "Jueves 16"…), con buscador.
- **Detalle** (hoja desde abajo): datos, mapa, botones **Cómo llegar · Llamar · WhatsApp**,
  **Registrar pago**, **Marcar terminado**.

### 5.3 Mapas sin API de Google

| Función | Cómo se hace (sin clave ni costo) |
| --- | --- |
| **Cómo llegar** | `https://www.google.com/maps/dir/?api=1&destination=<dirección o coordenadas>`: abre la app de Google Maps con la ruta |
| **Abrir en Waze** | `https://waze.com/ul?q=<dirección>&navigate=yes` (o `ll=<lat,lng>`) |
| **Vista previa del mapa** en el detalle | Mapa embebido de **OpenStreetMap** (gratuito y oficial para embeber). Alternativa: el embed de Google Maps sin clave (`maps.google.com/maps?q=...&output=embed`), que funciona pero no es una API oficial |
| **Pegar un link de Google Maps** | Si el link trae coordenadas (`@-31.42,-64.49`), se leen al instante. Si es un link corto (`maps.app.goo.gl/...`), el Worker sigue la redirección y extrae las coordenadas |
| **Usar mi ubicación** | GPS del celular (con permiso), estando en lo del cliente |

### 5.4 Atajos que conectan todo

- **Consulta → Trabajo:** en cada consulta, botón **"Agendar"** que crea el trabajo con nombre,
  teléfono, localidad, tipo de trabajo y mensaje ya cargados.
- **Trabajo terminado → Proyecto del sitio:** botón **"Publicar como proyecto"** que arma un
  proyecto del portfolio con el tipo de trabajo, la localidad y las fotos (sin datos del cliente).
  Así se reemplazan de a poco los proyectos de referencia por trabajos reales.
- **Fotos del trabajo:** "Sacar foto" desde el detalle (antes / después).

### 5.5 Agenda en el Calendario del iPhone (opcional)

El Worker publica la agenda como **calendario suscribible** (`.ics`) en una dirección secreta.
Se agrega una vez en el iPhone (Ajustes → Calendario → Cuentas → Agregar calendario suscrito) y los
trabajos aparecen en la app Calendario, con alarmas, Siri y widgets. Es de solo lectura: se carga
en el panel y se ve en el Calendario.

## 6. Finanzas y estadísticas

Pantalla **Finanzas**, con filtro de período (este mes · mes anterior · trimestre · año · elegir
fechas):

**Números principales (tarjetas):**

- **Cobrado** en el período (suma de pagos recibidos).
- **Por cobrar** (precio acordado menos pagos, de trabajos no cancelados).
- **Ganancia** (cobrado menos gastos), si se cargan gastos.
- **Trabajos terminados** y **ticket promedio** (cobrado ÷ trabajos).
- Comparación con el período anterior ("+18 % vs. septiembre").

**Gráficos:**

- **Ingresos por mes** de los últimos 12 meses (barras: cobrado; marca: ganancia).
- **¿Qué trabajo me genera más?** Ranking por tipo de trabajo con dos lecturas: **plata total** y
  **cantidad de trabajos**, más el **promedio por trabajo** de cada tipo. Así se distingue "lo que
  más hago" de "lo que más deja".
- **Por zona**: dónde se factura más (ayuda a decidir dónde invertir en publicidad o SEO local).
- **Medios de pago**: efectivo / transferencia / Mercado Pago.
- **Embudo** (si se usa "Agendar" desde consultas): consultas → trabajos agendados → terminados.

**Lista de pendientes de cobro**, con botón para mandar recordatorio por WhatsApp.

Todos los gráficos con leyenda, tooltip, vista de tabla y colores accesibles (paleta validada,
como el gráfico de Conversiones actual). **Exportar a Excel/CSV** para el contador.

## 7. Fases

### Fase 1: app instalable con estética iPhone (≈ 1,5 días)

1. **Manifest propio del panel** (`/admin/manifest.webmanifest`): nombre, ícono, colores de
   Voltis, `start_url: /admin`, `scope: /admin/`, pantalla completa. Se enlaza solo desde el panel.
2. **Íconos**: 192 y 512 px, versión maskable para Android y `apple-touch-icon` para iPhone.
3. **Service worker en `/admin/sw.js`** (no puede afectar al sitio público):
   - guarda la "cáscara" del panel para que abra rápido y también sin señal;
   - **no guarda datos de la API** (ver decisión sobre la agenda sin conexión en la sección 12);
   - pantalla "Sin conexión" y aviso de "Hay una versión nueva, tocá para actualizar".
4. **Sistema de diseño iOS** aplicado al panel: barra de pestañas inferior, títulos grandes, listas
   agrupadas, hojas desde abajo, modo oscuro.
5. **Cámara**: "Sacar foto" (cámara trasera) además de "Elegir de la galería".
6. **Instalación**: botón "Instalar app" en Android; instrucciones para iPhone.

### Fase 2: Agenda (≈ 2,5 días)

1. Tablas nuevas: `trabajos`, `trabajo_pagos`, `trabajo_gastos` (ver sección 8).
2. API: crear, editar, borrar y listar trabajos por rango de fechas; pagos y gastos.
3. Vistas Mes / Semana / Día / Lista y hoja de detalle.
4. Formulario con "Todo el día", fechas de varios días, tipo de trabajo, precio, ubicación.
5. Mapas sin API: Cómo llegar, Waze, vista previa con OpenStreetMap, lectura de links de Google Maps.
6. Atajos: "Agendar" desde consulta, "Publicar como proyecto" desde trabajo terminado.
7. Calendario `.ics` suscribible (si se aprueba).

### Fase 3: Finanzas (≈ 1,5 días)

1. Endpoint de estadísticas por período (cobrado, por cobrar, ganancia, por tipo, por zona, por
   mes, medios de pago, embudo).
2. Pantalla Finanzas con tarjetas, gráficos, lista de pendientes de cobro.
3. Exportar CSV.

### Fase 4: notificaciones (≈ 1 día)

1. **Consulta nueva**: aviso al instante en el celular (*"Nueva consulta: Juan (Cosquín) —
   Tableros"*); al tocarlo abre la consulta.
2. **Resumen del día** a las 7:00 (Cron Trigger del Worker, gratis): *"Hoy: 2 trabajos — 9:00
   Juan, Cosquín · 15:00 María, Tanti"*.
3. **Recordatorio** antes de cada trabajo (por defecto 1 hora antes, configurable).
4. Web Push estándar con claves VAPID: gratis, sin servicios externos.
   - En **iPhone** funciona con la app **instalada** y iOS 16.4 o más nuevo.
   - El mail de Hostinger sigue como respaldo para consultas nuevas.

### Fase 5 (opcional): compartir fotos al panel (≈ medio día, solo Android)

Desde la galería: **Compartir → Voltis** abre un trabajo o proyecto con esas fotos. iPhone no lo
soporta.

### Fuera de alcance (no recomendado por ahora)

- **Editar sin conexión y sincronizar después**: cola de envíos, conflictos y sincronización en
  segundo plano (iPhone no la tiene). Sin señal, el panel avisa y se guarda al volver la conexión.
- **Facturación electrónica (AFIP/ARCA)**: es otro proyecto; Finanzas exporta CSV para el contador.

## 8. Modelo de datos (Neon)

```sql
create type estado_trabajo as enum ('agendado', 'en_curso', 'terminado', 'cancelado');
create type medio_pago as enum ('efectivo', 'transferencia', 'mercadopago', 'otro');

create table trabajos (
  id serial primary key,
  titulo text not null,
  servicio_id int references servicios(id),      -- tipo de trabajo (estadísticas)
  cliente_nombre text not null,
  cliente_telefono text,
  direccion text,
  zona_id int references zonas(id),              -- localidad (estadísticas por zona)
  localidad_otra text,                           -- si no está en la lista
  maps_url text,                                 -- link pegado de Google Maps
  lat double precision,
  lng double precision,
  descripcion text,                              -- trabajo a realizar
  notas text,                                    -- privadas
  inicio timestamptz not null,
  fin timestamptz not null,                      -- check (fin >= inicio)
  todo_el_dia boolean not null default false,
  precio_centavos bigint,                        -- precio acordado, en centavos (sin errores de redondeo)
  estado estado_trabajo not null default 'agendado',
  consulta_id int references consultas(id) on delete set null,
  proyecto_id int references proyectos(id) on delete set null,
  fotos jsonb not null default '[]',
  recordatorio_min int default 60,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on trabajos (inicio, fin);

create table trabajo_pagos (
  id serial primary key,
  trabajo_id int not null references trabajos(id) on delete cascade,
  fecha date not null,
  monto_centavos bigint not null check (monto_centavos > 0),
  medio medio_pago not null,
  nota text
);

create table trabajo_gastos (
  id serial primary key,
  trabajo_id int not null references trabajos(id) on delete cascade,
  fecha date not null,
  descripcion text not null,
  monto_centavos bigint not null check (monto_centavos > 0)
);
```

- **Fechas:** se guardan con zona horaria y se muestran en hora de Córdoba. Un evento "todo el día"
  del 16 al 18 se guarda de 16 00:00 a 19 00:00 (fin exclusivo, como los calendarios estándar).
- **Plata:** en centavos (enteros), en pesos argentinos. Si en el futuro hace falta, se agrega moneda.
- **Ingresos por período:** se cuentan por **fecha de pago** (lo que realmente entró), no por
  fecha del trabajo.

## 9. Seguridad y privacidad

- Agenda y Finanzas tienen **datos personales de clientes** (nombre, teléfono, dirección): viven
  solo en el panel, detrás del login (usuario, contraseña y Turnstile). Nunca se publican en el
  sitio, ni en `llms.txt`, ni en el sitemap.
- "Publicar como proyecto" **no copia** nombre, teléfono ni dirección del cliente.
- El calendario `.ics` usa una dirección con **token secreto** que se puede regenerar desde
  Configuración si se filtra. Muestra solo título, zona y hora (sin teléfono, opcional).
- La cookie de sesión sigue siendo `HttpOnly`, `Secure`, `SameSite=Strict`, limitada a `/admin/api`.
- En iPhone, la app instalada no comparte sesión con Safari: hay que loguearse una vez en la app.
- Si se pierde el celular: cambiar `ADMIN_PASSWORD` cierra todas las sesiones; desde
  Configuración se quita ese dispositivo de las notificaciones.

## 10. Archivos que se tocan

Todo dentro del panel y la API, para no interferir con el trabajo de SEO/diseño del sitio:

| Dónde | Cambio |
| --- | --- |
| `apps/web/public/admin/` | Manifest, service worker e íconos (nuevos) |
| `apps/web/app/admin/` | Layout (manifest, SW, pestañas), páginas nuevas `agenda/` y `finanzas/` |
| `apps/web/components/admin/` | Sistema de diseño iOS, calendario, formularios, gráficos |
| `apps/api/src/routes/` | `trabajos.ts`, `finanzas.ts`, `push.ts`, `calendario.ts` (nuevos) |
| `apps/api/wrangler.toml` | Cron Trigger del resumen diario (Fase 4) |
| `packages/db/src/schema.ts` + migraciones | Tablas de la sección 8 y `suscripciones_push` |
| `packages/shared/src/` | Schemas de validación de trabajos y pagos |

Si hiciera falta tocar `globals.css` u otro archivo compartido con el sitio, se coordina antes.

## 11. Pruebas

**Automáticas (Playwright):**

- PWA: manifest válido con `scope: /admin/`; service worker solo en `/admin`; el sitio público sin
  service worker; sin conexión se ve "Sin conexión".
- Agenda: crear un trabajo de horas y uno de varios días "todo el día"; aparecen en Mes/Semana/
  Día/Lista; editar, cancelar y borrar; "Agendar" desde una consulta precarga los datos.
- Mapas: "Cómo llegar" y Waze arman bien la URL; links de Google Maps con coordenadas se leen bien.
- Pagos: seña + saldo → estado "Cobrado"; el saldo pendiente se calcula bien.
- Finanzas: con datos de prueba conocidos, los totales, el ranking por tipo y los meses dan los
  números esperados; el CSV coincide.
- Fechas: un trabajo a las 23:30 de Córdoba cae en el día correcto; eventos que cruzan de mes.
- Seguridad: sin sesión, la API de trabajos y finanzas responde 401; el `.ics` sin token, 404.

**Manuales, en el celular:** instalar; agendar un trabajo para mañana con link de Maps; "Cómo
llegar"; registrar seña y saldo; ver Finanzas; recibir el resumen del día; suscribir el `.ics`.

## 12. Decisiones (2026-10-11)

- [x] **Fases:** todas, en orden 1 → 2 → 3 → 4; la 5 (solo Android) al final.
- [x] **Celular principal:** iPhone. Todo tiene que funcionar también en Android.
- [x] **Nombre bajo el ícono:** "Voltis".
- [x] **Gastos/materiales:** sí (Finanzas muestra ganancia real).
- [x] **Pagos parciales (seña + saldo):** sí.
- [x] **Calendario `.ics` para el iPhone:** sí, con teléfono del cliente.
- [x] **Vista previa de mapa:** OpenStreetMap.
- [x] **Agenda de hoy sin conexión:** sí.
- [x] **Usuarios:** dos admins con **el mismo usuario y contraseña**. No hace falta multiusuario;
      cada trabajo tiene un campo opcional **"¿Quién va?"** (texto).
- [x] **Notificaciones:** a todos los dispositivos que las activen.

## 13. Avance

### Fase 1: hecha

- Manifest (`/admin/manifest.webmanifest`, alcance `/admin`) e íconos generados desde el isotipo
  (`scripts/generar-iconos-admin.mjs`).
- Service worker en `/admin-sw.js` con alcance `/admin` (en la raíz porque uno ubicado en
  `/admin/` no puede controlar la portada `/admin`). Solo se registra en producción.
- Sin conexión: el panel abre desde la caché; la API y las fotos nunca se guardan.
- Estética iOS en todo el panel (`app/admin/admin.css`): pestañas inferiores, barra translúcida,
  títulos grandes, listas agrupadas, modo oscuro, áreas seguras; contraste validado.
- Aviso para instalar (botón en Android, pasos en iPhone) y pantalla "Más".
- Cámara: "Sacar foto" (cámara trasera) y "Elegir de la galería".
- Tests: `e2e/pwa.spec.ts` (manifest, íconos, service worker, sin conexión, cámara, pestañas).

### Fase 2 (Agenda): hecha

- Tablas `trabajos`, `trabajo_pagos`, `trabajo_gastos` (migración `0004`).
- Vistas Mes, Semana, Día y Lista; trabajos de horas o de varios días ("todo el día").
- Ficha con Llamar, WhatsApp, Cómo llegar (Google Maps) y Waze, mapa de OpenStreetMap, fotos,
  seña + saldo, gastos/materiales, estado y "¿Quién va?".
- Ubicación sin API: se pega el link de Maps (los cortos los resuelve la API) o "Usar mi ubicación".
- Desde una consulta: "📅 Agendar" precarga cliente, zona y servicio.
- Trabajo terminado → "Publicar como proyecto" (borrador, sin datos del cliente).
- La agenda queda guardada en el dispositivo para verla sin conexión.

### Fase 3 (Finanzas): hecha

- Cobrado, por cobrar, ganancia (cobrado − gastos) y ticket promedio, con comparación contra el
  período anterior.
- Gráfico de 12 meses, ranking "¿Qué trabajo me genera más?", por localidad, medios de pago,
  embudo consultas → trabajos, pendientes de cobro con recordatorio por WhatsApp y exportar CSV.

### Fase 4 (Avisos): hecha

- Notificaciones push (iPhone con la app instalada, iOS 16.4+, y Android): nueva consulta,
  recordatorio antes de cada trabajo y resumen del día a las 7:00 (Cron Trigger cada 15 min).
- Calendario del iPhone: suscripción `webcal://` a un `.ics` con link secreto (se puede regenerar).
- Configuración → Notificaciones y Calendario del iPhone.
- Tests: `e2e/agenda.spec.ts`, `e2e/agenda-logica.spec.ts` y rutas nuevas en `e2e/api.spec.ts`.
