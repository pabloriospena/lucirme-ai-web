# 🗺️ MAPA DEL SITIO Y ARQUITECTURA DE CONTEXTO PARA IA — LuciRMe AI

> **Nota para la IA**: Este documento sirve como contexto técnico y comercial completo sobre la aplicación web **LuciRMe AI**. Describe la arquitectura del proyecto en Astro 5, el catálogo de rutas públicas, micro-servicios, componentes interactivos, destinos de conversión y la estructura de eventos de analítica en PostHog.

---

## 1. 📌 INFORMACIÓN GENERAL Y PROPUESTA DE VALOR

- **Nombre de la Aplicación**: LuciRMe AI
- **Autor & Consultor**: Pablo Ríos (Product Manager, especialista en estrategia digital, diseño de producto e Inteligencia Artificial aplicada).
- **Eslogan / Manifiesto**: *"No enseño IA. Enseño a recuperar tu vida usando IA."*
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
  - Navegación escritorio (`Rutas`, `Soluciones`, `Recursos`, `Sobre Pablo`). Evento PostHog: `header_nav_click`.
  - Acciones rápidas: Login (`/sign-in`), Botón Termómetro (`header_termometro_click`), CTA WhatsApp (`header_whatsapp_click`).
  - Menú Hamburguesa Off-Canvas Drawer para móviles.
- **Modal Termómetro IA (`<Selector />`)**: Diagnóstico interactivo de 9 preguntas.
- **Footer (`<Footer />`)**: Pie de página institucional.

### Componentes Clave (`src/components/`)
1. **`Selector.astro`**: Diagnóstico de 2 minutos *"Termómetro de Recuperación de Tiempo"*. Formulario de captación, 9 preguntas secuenciales, cálculo de puntuación, renderizado de nivel, descarga en PDF e integración directa con MailerLite y PostHog (`termometro_start`, `termometro_step_answered`, `termometro_completed`, `termometro_pdf_downloaded`).
2. **`Hero.astro`**: Sección Hero para la página de inicio con llamada directa a WhatsApp (`click_whatsapp_hero`).
3. **`SobreMi.astro`**: Tarjeta de autoridad sobre Pablo Ríos y trayectoria en producto.
4. **`RedesSociales.astro`**: Pie de enlaces comunitarios a LinkedIn, Instagram y TikTok.
5. **`FAQ.astro`**: Acordeón interactivo de preguntas frecuentes.

---

## 3. 🌐 MAPA DETALLADO DE RUTAS Y PÁGINAS PÚBLICAS

### 🏠 3.1. Páginas Principales y Núcleo de Navegación

| Ruta URL | Archivo de Origen | Propósito / Descripción | CTAs Principales | Eventos PostHog |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `src/pages/index.astro` | Landing principal de LuciRMe AI. Presentación de propuestas, rutas de aprendizaje y selector rápido. | WhatsApp (`click_whatsapp_hero`), Abrir Termómetro | `click_whatsapp_hero`, `header_nav_click` |
| `/rutas` | `src/pages/rutas.astro` | Catálogo interactivo de 5 rutas de desarrollo (Comunicación, NotebookLM, PM, Empleabilidad, Visual). | Selección de ruta, Filtros, Compra de productos, WhatsApp 1:1 | `rutas_select_route`, `rutas_filter_routes`, `rutas_card_click`, `rutas_whatsapp_click`, `rutas_course_buy_click` |
| `/servicios` | `src/pages/servicios/index.astro` | Hub central de soluciones categorizadas por audiencia (Profesionales, Producto, Empresas). | Enlaces a `/soluciones/*`, Selector Termómetro | `servicios_index_page_view`, `servicios_card_click`, `servicios_selector_click` |
| `/recursos` | `src/pages/recursos.astro` | Biblioteca abierta de recursos, guías gratuitas y productos digitales. | Enlaces a recursos gratuitos y de pago (Hotmart) | `recursos_page_view`, `recursos_card_click` |
| `/content/sobremi` | `src/pages/content/sobremi.astro` | Historia, filosofía y experiencia de Pablo Ríos (+13 años en tecnología). | WhatsApp, Agendamiento Calendly | `sobremi_whatsapp_click` |
| `/content/precios` | `src/pages/content/precios.astro` | Transparencia radical de precios y formatos de trabajo (Sesión 1:1, Taller, Ciclo). | Agendar Café de Estrategia, Cotizar | `precios_page_view`, `precios_cta_click` |

---

### 💼 3.2. Soluciones B2B y por Perfil (`src/pages/soluciones/`)

| Ruta URL | Archivo de Origen | Perfil Objetivo | Oferta / Entregable | Eventos PostHog |
| :--- | :--- | :--- | :--- | :--- |
| `/soluciones/profesionales` | `profesionales.astro` | Profesionales, Consultores, Freelancers | Recuperar 10h/semana con automatización personal y prompts. | `profesionales_page_view`, `profesionales_cta_click` |
| `/soluciones/empresas` | `empresas.astro` | Pymes y Equipos Corporativos | Taller de Inmersión y Ciclo de Autonomía de 8 semanas. | `empresas_page_view`, `empresas_calendly_click`, `empresas_whatsapp_click` |
| `/soluciones/startups` | `startups.astro` | Startups Early-Stage y Pre-Scale | Sprint de Adopción con IA sin reescribir stack actual. | `startups_page_view`, `startups_calendly_click`, `startups_whatsapp_click` |
| `/soluciones/tecnologia+tunegocio` | `tecnologia+tunegocio.astro` | Dueños de Negocio | Consultoría y construcción práctica con Pablo Ríos. | `tec_negocio_whatsapp_click` |
| `/soluciones/web-veterinarios` | `web-veterinarios.astro` | Clínicas Veterinarias | Sitios web optimizados y captura de pacientes con IA. | `veterinarios_cta_click` |
| `/servicios/producto` | `servicios/producto.astro` | Equipos de Producto / PMs | IA integrada en research, backlog, reuniones y métricas. | `servicios_producto_click` |

---

### 📚 3.3. Cursos, Productos Digitales y Micro-SaaS (`src/pages/` & `src/pages/recursos/`)

| Ruta URL | Archivo | Formato / Precio | Propósito Técnico | Eventos PostHog |
| :--- | :--- | :--- | :--- | :--- |
| `/curso-presentaciones` | `curso-presentaciones.astro` | Curso Asíncrono · **$35 USD** | Landing de conversión con pasarela de pago Hotmart. | `curso_presentaciones_page_view`, `curso_presentaciones_buy_click`, `curso_presentaciones_whatsapp_click` |
| `/bot-presentaciones` | `bot-presentaciones.astro` | Agente Guiado · **$8 USD** | Venta de bot asistente para estructurar discursos ejecutivos. | `bot_presentaciones_hero_buy_click`, `bot_presentaciones_price_buy_click` |
| `/atajos-ia` | `atajos-ia.astro` | Prompts Testeados · **$17 USD** | Biblioteca de prompts maestros optimizados. | `atajos_ia_buy_click` |
| `/atajos-visuales` | `atajos-visuales.astro` | Colección Visual · **$5 USD** | Prompts de generación de imágenes con Midjourney / Imagen 3. | `atajos_visuales_buy_click` |
| `/recursos/backlog-detox` | `recursos/backlog-detox.astro` | Herramienta Gratis (Micro-SaaS) | Herramienta interactiva para limpiar y priorizar backlog con IA. | `backlog_detox_ejecutado` |
| `/recursos/shapeup-builder` | `recursos/shapeup-builder.astro` | Herramienta Gratis (Micro-SaaS) | Constructor interactivo de pitches bajo metodología Shape Up. | `shapeup_builder_ejecutado` |
| `/recursos/prompteador` | `recursos/prompteador.astro` | Herramienta Gratis | Optimizador de prompts bajo fórmula R+C+T+E. | `prompteador_usado` |
| `/recursos/job-prompt-ai` | `recursos/job-prompt-ai.astro` | Herramienta Gratis | Generador de prompts para ofertas laborales y rol de PM. | `job_prompt_generado` |
| `/recursos/cv-con-ia` | `recursos/cv-con-ia.astro` | Herramienta Gratis | Optimizador de currículum profesional adaptado a ATS. | `cv_prompt_generado` |

---

## 4. ⚡ RUTAS DE API Y ENDPOINTS BACKEND (`src/pages/api/`)

Todos los procesamientos sensibles se realizan del lado del servidor para proteger claves y mantener comunicación segura con APIs externas:

1. **`POST /api/termometro`**
   - **Archivo**: `src/pages/api/termometro.ts`
   - **Función**: Recibe el payload completo del diagnóstico de 9 preguntas (nombre, email, whatsapp, score, nivel, respuestas), guarda el registro y sincroniza el suscriptor con MailerLite.
2. **`POST /api/unlock-guia`**
   - **Archivo**: `src/pages/api/unlock-guia.ts`
   - **Función**: Desbloquea acceso a guías privadas mediante verificación de correo.
3. **`POST /api/guardar-preventa`**
   - **Archivo**: `src/pages/api/guardar-preventa.js`
   - **Función**: Registra interesados en el Libro Vol. 2 de PM Sin Bullshit.
4. **`POST /api/optimizar-prompt`**
   - **Archivo**: `src/pages/api/optimizar-prompt.js`
   - **Función**: Endpoint de procesamiento para la herramienta Prompteador R+C+T+E.
5. **`POST /api/generar-job-prompt`** & **`POST /api/generar-cv-promtp`**
   - **Archivo**: `src/pages/api/generar-job-prompt.js` / `generar-cv-promtp.js`
   - **Función**: Endpoints de soporte para herramientas de carrera y empleabilidad.
6. **`POST /api/procesar-siigo`**
   - **Archivo**: `src/pages/api/procesar-siigo.ts`
   - **Función**: Procesador de extractos y facturación contable para Siigo.

---

## 5. 📊 DICCIONARIO DE EVENTOS POSTHOG (POSTHOG EVENT DICTIONARY)

El proyecto cuenta con una instrumentación completa de eventos para análisis de embudos y comportamiento de usuario:

### Eventos Globales de Navegación
- `header_brand_click`: Clics en el logo principal.
- `header_nav_click` (`destino`, `label`): Enlaces del menú principal.
- `header_termometro_click` (`origen`): Apertura del diagnóstico rápido.
- `header_whatsapp_click` (`origen`): Clics en el botón verde de WhatsApp.
- `miniheader_promo_click` (`curso`, `posicion`): Clics en el top-bar promocional.

### Eventos del Termómetro IA
- `termometro_lead_submitted` (`name`, `has_email`, `has_whatsapp`): Registro inicial.
- `termometro_question_answered` (`question_id`, `step`, `selected_option`): Avance en cada pregunta.
- `termometro_completed` (`score`, `nivel`, `perfil`): Diagnóstico finalizado.
- `termometro_pdf_downloaded` (`score`, `level`): Descarga del reporte en PDF.
- `termometro_cta_click` (`tipo`, `destino`): Clics en los botones de acción del resultado.
- `termometro_social_click` (`red`): Enlaces a redes sociales desde el modal.

### Eventos de Transacción y Venta (E-Commerce & Hotmart)
- `curso_presentaciones_buy_click` (`precio`, `posicion`): Intención de compra del curso de $35 USD.
- `bot_presentaciones_hero_buy_click` / `bot_presentaciones_price_buy_click` (`precio`): Intención de compra del Bot de $8 USD.
- `atajos_ia_buy_click` / `atajos_visuales_buy_click` (`producto`, `precio`): Intención de compra de librerías de prompts.
- `rutas_whatsapp_click` / `empresas_whatsapp_click` / `startups_whatsapp_click`: Consultas comerciales a WhatsApp (+57 305 3046180).

---

## 6. 🔗 DESTINOS Y RECURSOS EXTERNOS OFICIALES

- **WhatsApp Oficial**: `https://wa.me/573053046180`
- **Agendamiento Calendly**: `https://calendly.com/pablorios` / `LINKS.calendly_empresa`
- **Pasarela Hotmart (Curso Presentaciones)**: `https://pay.hotmart.com/R107150726I?checkoutMode=10`
- **LinkedIn Pablo Ríos**: `https://linkedin.com/in/pabloriospena`
- **LinkedIn Empresa**: `https://linkedin.com/company/lucirme-ai`
- **Instagram**: `https://www.instagram.com/lucirmeai/`
- **TikTok**: `https://www.tiktok.com/@pabloriosp`
