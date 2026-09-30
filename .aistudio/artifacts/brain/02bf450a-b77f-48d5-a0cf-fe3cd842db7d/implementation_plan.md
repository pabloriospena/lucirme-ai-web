# Plan Final de Reconstrucción de la Experiencia Comercial de LuciRMe AI

## 🎯 Objetivo
Ejecutar una reorganización comercial profunda pasando de un catálogo disperso a una **experiencia guiada por intención comercial** en 3 mundos (+ Sobre Pablo).

---

## 🛠️ Acciones de Implementación

1. **`src/pages/index.astro` (Home)**:
   - Hero: *"IA aplicada a problemas reales. Implemento soluciones, acompaño profesionales y creo recursos para que la IA haga parte de tu forma de trabajar."*
   - Selector de Intención con 3 caminos: Empresas (`/empresas`), Profesionales (`/profesionales`), Educación (`/educacion`).
   - Bloque secundario: *"¿No sabes por dónde empezar?"* ➔ Termómetro IA (`<Selector />`).
   - Prueba social & Sobre Pablo breve.
   - Cero catálogo de productos.

2. **`src/pages/empresas.astro` (Empresas B2B)**:
   - Hero B2B: *"Implementación de IA para procesos y equipos reales."*
   - Problemas B2B: procesos manuales, información dispersa, tareas repetitivas, herramientas desconectadas, uso aislado de IA.
   - 4 líneas de solución: Implementación de IA, Automatización de procesos, Capacitación & Adopción, Página Comercial.
   - Casos reales: Irys, Fundación La Chinca, Almamotor.
   - Método de 5 pasos: Diagnóstico → Diseño → Implementación → Capacitación → Autonomía.
   - CTAs: WhatsApp y Calendly.

3. **`src/pages/empresas/pagina-comercial.astro` (Página Comercial + WhatsApp)**:
   - Landing B2B dedicada para la oferta de Página Comercial + WhatsApp.
   - Posicionamiento: *"Una página que explica tu negocio, genera confianza y lleva al cliente a WhatsApp."*
   - Reutilización y estructuración del contenido de `src/pages/soluciones/web-veterinarios.astro`.
   - Muestra: Estrategia, Copy, Diseño, Mobile-first, Configuración técnica, Medición, Captura de leads, Integración WhatsApp.

4. **`src/pages/profesionales.astro` (Profesionales & PMs)**:
   - Hero: *"IA aplicada a tu forma real de trabajar."*
   - Problemas reales: documentación, investigación, reuniones, análisis, entregables, procesos repetitivos, información dispersa.
   - Bloque destacado de **Product Managers** (`#product-managers`):
     - Discovery, Research, PRDs, Backlog, Historias, Reuniones, Métricas, Documentación, Prototipado.
     - Módulo para **Product Management Sin Bullshit** (Libro Vol. 1 & Vol. 2).
     - Eventos PostHog: `product_managers_view`, `product_managers_cta_click`.
   - Otros profesionales: Consultores, Abogados, Contadores, Freelancers, Independientes.
   - Acompañamiento: Sesión de Claridad 1:1 & Ciclo Individual de 4 semanas.

5. **`src/pages/educacion.astro` (Educación & Aprendizaje)**:
   - Responde exclusivamente a *"Quiero aprender"*.
   - 3 pilares: Rutas de Aprendizaje, Productos Digitales, Herramientas Gratuitas.

6. **`src/pages/sobre-pablo.astro` (Autoridad)**:
   - Quién es Pablo Ríos, trayectoria (+13 años), experiencia B2B/B2C y contacto.

7. **`src/middleware.js` (Redirecciones 301)**:
   - `/soluciones/empresas` ➔ `/empresas`
   - `/soluciones/profesionales` ➔ `/profesionales`
   - `/soluciones/startups` ➔ `/empresas`
   - `/soluciones/web-veterinarios` ➔ `/empresas/pagina-comercial`
   - `/servicios/producto` ➔ `/profesionales#product-managers`
   - `/profesionales/product-managers` ➔ `/profesionales#product-managers`
   - `/recursos` ➔ `/educacion`
   - `/rutas` ➔ `/educacion`
   - `/content/sobremi` ➔ `/sobre-pablo`

8. **Verificación**:
   - `compile_applet` sin errores.
   - Verificación de eventos PostHog e integraciones (Clerk, MailerLite, Termómetro, Hotmart, Calendly, WhatsApp).
