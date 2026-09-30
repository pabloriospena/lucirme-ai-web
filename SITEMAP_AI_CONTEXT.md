# 🗺️ MAPA DEL SITIO Y ARQUITECTURA DE CONTEXTO PARA IA — LuciRMe AI

> **Nota para la IA**: Este documento sirve como contexto técnico, comercial y de navegación completo sobre la aplicación web **LuciRMe AI**. Describe la nueva arquitectura reorganizada en 3 mundos comerciales independientes (Empresas, Profesionales, Educación), el catálogo de rutas públicas, componentes, endpoints de API, integraciones, redirecciones 301 y la estructura de eventos de analítica en PostHog.

---

## 1. 📌 INFORMACIÓN GENERAL Y PROPUESTA DE VALOR

- **Nombre de la Aplicación**: LuciRMe AI
- **Autor & Consultor**: Pablo Ríos (Product Manager, especialista en estrategia digital, diseño de producto e Inteligencia Artificial aplicada).
- **Eslogan / Manifiesto**: *"No enseño IA. Enseño a recuperar tu vida usando IA."*
- **Estructura Comercial Nuclear**:
  ```text
  LUCIRME AI
  ├── 🏢 EMPRESAS (/empresas) -> Soluciones B2B, automatización, adopción y Página Comercial + WhatsApp
  ├── 👤 PROFESIONALES (/profesionales) -> IA para trabajo real, Product Managers & PM Sin Bullshit
  ├── 🎓 EDUCACIÓN (/educacion) -> Rutas, Cursos, Productos Digitales y Herramientas Gratuitas
  └── 📖 SOBRE PABLO (/sobre-pablo) -> Autoridad, trayectoria y experiencia
  ```
- **Stack Tecnológico**:
  - **Framework Frontend**: Astro 5 (Node.js runtime / SSR & SSG)
  - **Estilos**: Tailwind CSS 4
  - **Autenticación**: Clerk (`@clerk/astro`)
  - **Analítica de Producto**: PostHog (Captura de eventos custom y funnel tracking)
  - **Integraciones de Captura de Leads**: MailerLite API & Webhooks
  - **Procesadores Backend**: Node.js API Routes (`src/pages/api/*`)

---

## 2. 🧩 ARQUITECTURA DE LAYOUTS Y COMPONENTES (`src/layouts/` y `src/components/`)

### Layout Principal (`src/layouts/Layout.astro`)
Envolver todas las páginas con la navegación global y componentes transversales:
- **Miniheader Top Bar**: Promoción destacada (ej. *Curso Presentaciones US$35*). Evento PostHog: `miniheader_promo_click`.
- **Header Principal**:
  - Logo e identidad (`LuciRMe AI`). Evento PostHog: `header_brand_click`.
  - **Navegación Nuclear (Desktop)**:
    - `/empresas` (Empresas)
    - `/profesionales` (Profesionales)
    - `/educacion` (Educación)
    - `/sobre-pablo` (Sobre Pablo)
  - Acciones rápidas: Login (`/sign-in`), Botón Termómetro (`header_termometro_click`), CTA WhatsApp (`header_whatsapp_click`).
  - Menú Hamburguesa Off-Canvas Drawer para móviles (`src/components/Sidebar.astro`).
- **Modal Termómetro IA (`<Selector />`)**: Diagnóstico interactivo de 9 preguntas.
- **Footer (`<Footer />`)**: Pie de página institucional.

---

## 3. 🌐 MAPA DETALLADO DE RUTAS Y PÁGINAS PÚBLICAS

### 🏠 3.1. Páginas Nucleares de Navegación

| Ruta URL | Archivo de Origen | Propósito / Descripción | CTAs Principales | Eventos PostHog |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `src/pages/index.astro` | Home / Selector de Intención de 3 Caminos (Empresas, Profesionales, Educación). | Botones del Selector, Termómetro IA | `home_page_view`, `home_selector_click`, `home_termometro_click` |
| `/empresas` | `src/pages/empresas.astro` | Landing B2B independiente. Implementación de IA, automatización, capacitación, adopción y Página Comercial + WhatsApp. | Consultar WhatsApp (+57 305 3046180), Agendar Diagnóstico | `empresas_page_view`, `empresas_whatsapp_click`, `empresas_calendly_click` |
| `/profesionales` | `src/pages/profesionales.astro` | Landing independiente de IA aplicada a la forma real de trabajar. Especialidad en Product Management Sin Bullshit. | Hablar por WhatsApp, Agendar Sesión, Ver Libro PM | `profesionales_page_view`, `profesionales_whatsapp_click`, `profesionales_ebook_click` |
| `/educacion` | `src/pages/educacion.astro` | Hub del mundo educativo agrupado en 3 pilares: Rutas de Aprendizaje, Cursos/Productos y Herramientas Gratuitas. | Explorar Rutas, Ver Cursos, Acceder Gratis | `educacion_page_view`, `educacion_ruta_click`, `educacion_producto_click`, `educacion_recurso_click` |
| `/sobre-pablo` | `src/pages/sobre-pablo.astro` | Trayectoria de Pablo Ríos (+13 años en tecnología, producto e IA). | Agendar Café, Contacto | `sobre_pablo_page_view` |

---

### 📚 3.2. Cursos, Productos Digitales y Micro-SaaS Educativos

| Ruta URL | Archivo | Formato / Precio | Propósito Técnico | Eventos PostHog |
| :--- | :--- | :--- | :--- | :--- |
| `/curso-presentaciones` | `curso-presentaciones.astro` | Curso Asíncrono · **$35 USD** | Landing de conversión con pasarela de pago Hotmart. | `curso_presentaciones_page_view`, `curso_presentaciones_buy_click` |
| `/bot-presentaciones` | `bot-presentaciones.astro` | Agente Guiado · **$8 USD** | Venta de bot asistente para estructurar discursos ejecutivos. | `bot_presentaciones_hero_buy_click`, `bot_presentaciones_price_buy_click` |
| `/atajos-ia` | `atajos-ia.astro` | Prompts Testeados · **$17 USD** | Biblioteca de prompts maestros optimizados. | `atajos_ia_buy_click` |
| `/atajos-visuales` | `atajos-visuales.astro` | Colección Visual · **$5 USD** | Prompts de generación de imágenes con Midjourney / Imagen 3. | `atajos_visuales_buy_click` |
| `/recursos/backlog-detox` | `recursos/backlog-detox.astro` | Herramienta Gratis (Micro-SaaS) | Herramienta interactiva para limpiar y priorizar backlog con IA. | `backlog_detox_ejecutado` |
| `/recursos/shapeup-builder` | `recursos/shapeup-builder.astro` | Herramienta Gratis (Micro-SaaS) | Constructor interactivo de pitches bajo metodología Shape Up. | `shapeup_builder_ejecutado` |
| `/recursos/prompteador` | `recursos/prompteador.astro` | Herramienta Gratis | Optimizador de prompts bajo fórmula R+C+T+E. | `prompteador_usado` |
| `/recursos/job-prompt-ai` | `recursos/job-prompt-ai.astro` | Herramienta Gratis | Generador de prompts para ofertas laborales y rol de PM. | `job_prompt_generado` |
| `/recursos/cv-con-ia` | `recursos/cv-con-ia.astro` | Herramienta Gratis | Optimizador de currículum profesional adaptado a ATS. | `cv_prompt_generado` |

---

## 4. 🔀 MAPA DE REDIRECCIONES 301 PERMANENTES (`src/middleware.js`)

Para mantener retrocompatibilidad total con SEO, campañas externas y enlaces compartidos previamente:

| URL Antigua (Legacy) | URL Destino (301 Permanent) |
| :--- | :--- |
| `/soluciones/empresas` | ➔ `/empresas` |
| `/soluciones/profesionales` | ➔ `/profesionales` |
| `/soluciones/startups` | ➔ `/empresas` |
| `/soluciones/tecnologia+tunegocio` | ➔ `/empresas` |
| `/soluciones/web-veterinarios` | ➔ `/empresas#pagina-comercial` |
| `/servicios/producto` | ➔ `/profesionales` |
| `/servicios` | ➔ `/` |
| `/recursos` | ➔ `/educacion` |
| `/rutas` | ➔ `/educacion` |
| `/content/sobremi` | ➔ `/sobre-pablo` |

---

## 5. ⚡ RUTAS DE API Y ENDPOINTS BACKEND (`src/pages/api/`)

Todos los procesamientos sensibles se realizan del lado del servidor para proteger claves y mantener comunicación segura con APIs externas:

1. **`POST /api/termometro`** (`src/pages/api/termometro.ts`): Recibe las respuestas del diagnóstico de 9 preguntas y sincroniza con MailerLite.
2. **`POST /api/unlock-guia`** (`src/pages/api/unlock-guia.ts`): Desbloquea acceso a guías privadas.
3. **`POST /api/guardar-preventa`** (`src/pages/api/guardar-preventa.js`): Registra la preventa del Libro Vol. 2 de PM Sin Bullshit.
4. **`POST /api/optimizar-prompt`** (`src/pages/api/optimizar-prompt.js`): Backend del Prompteador R+C+T+E.
5. **`POST /api/generar-job-prompt`** & **`POST /api/generar-cv-promtp`**: Herramientas de empleabilidad y carrera.
6. **`POST /api/procesar-siigo`** (`src/pages/api/procesar-siigo.ts`): Procesador de extractos y facturación contable para Siigo.

---

## 6. 📊 DICCIONARIO DE EVENTOS POSTHOG

- **Globales**: `header_brand_click`, `header_nav_click`, `header_termometro_click`, `header_whatsapp_click`, `miniheader_promo_click`.
- **Nuevos de la Arquitectura**: `home_selector_click`, `empresas_page_view`, `profesionales_page_view`, `educacion_page_view`, `educacion_ruta_click`, `educacion_producto_click`, `educacion_recurso_click`, `sobre_pablo_page_view`.
- **Termómetro IA**: `termometro_lead_submitted`, `termometro_question_answered`, `termometro_completed`, `termometro_pdf_downloaded`.
- **E-Commerce & Conversión**: `curso_presentaciones_buy_click`, `bot_presentaciones_hero_buy_click`, `atajos_ia_buy_click`, `atajos_visuales_buy_click`, `empresas_whatsapp_click`, `profesionales_whatsapp_click`.

---

## 7. 🔗 DESTINOS Y RECURSOS EXTERNOS OFICIALES

- **WhatsApp Oficial**: `https://wa.me/573053046180`
- **Agendamiento Calendly**: `https://calendly.com/pablorios` / `LINKS.calendly_empresa`
- **Pasarela Hotmart (Curso Presentaciones)**: `https://pay.hotmart.com/R107150726I?checkoutMode=10`
- **LinkedIn Pablo Ríos**: `https://linkedin.com/in/pabloriospena`
- **LinkedIn Empresa**: `https://linkedin.com/company/lucirme-ai`
- **Instagram**: `https://www.instagram.com/lucirmeai/`
- **TikTok**: `https://www.tiktok.com/@pabloriosp`
