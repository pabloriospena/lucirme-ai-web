# Plan de Reestructuración Comercial y Navegación — LuciRMe AI

## 🗺️ Mapa de Análisis Actual vs. Nueva Arquitectura

El ecosistema actual de LuciRMe AI cuenta con múltiples páginas de soluciones y recursos repartidos en `/soluciones/*`, `/servicios/*`, `/recursos/*`, `/content/*` y componentes sueltos. La nueva arquitectura agrupa todo en 3 grandes mundos independientes más una sección institucional de confianza.

---

### 1. Mundo EMPRESAS (`/empresas`)
* **Propósito**: B2B. Implementación de IA, automatizaciones, capacitación, adopción y solución de Página Comercial (+WhatsApp).
* **Archivos Actuales que Corresponden**:
  - `src/pages/soluciones/empresas.astro` (Base principal B2B)
  - `src/pages/soluciones/startups.astro` (Soluciones para equipos de producto y startups)
  - `src/pages/soluciones/tecnologia+tunegocio.astro` (Consultoría técnica)
  - `src/pages/soluciones/web-veterinarios.astro` (Caso de uso/ejemplo de Página Comercial + WhatsApp)
  - `src/components/IrysTaller.astro` & `src/components/SocialProof.astro` (Casos B2B)
  - `src/pages/propuestas/*` (Landing pages B2B específicas)
* **Qué Crear/Mover**:
  - Crear/convertir `src/pages/empresas.astro` como la puerta de entrada B2B independiente.
  - Integrar las secciones: Hero, Soluciones (Implementación, Automatización, Adopción, Página Comercial), Casos B2B (Irys, La Chinca, Almamotor), Proceso (Diagnóstico → Adopción), Sobre Pablo B2B y CTA de Agenda/WhatsApp.
* **URLs a Redireccionar (301)**:
  - `/soluciones/empresas` ➔ `/empresas`
  - `/soluciones/startups` ➔ `/empresas`
  - `/soluciones/tecnologia+tunegocio` ➔ `/empresas`
  - `/soluciones/web-veterinarios` ➔ `/empresas#pagina-comercial` (o subruta `/empresas/pagina-comercial`)

---

### 2. Mundo PROFESIONALES (`/profesionales`)
* **Propósito**: B2C / B2B2C. Acompañamiento e incorporación de IA en la forma real de trabajar.
* **Archivos Actuales que Corresponden**:
  - `src/pages/soluciones/profesionales.astro` (Base de acompañamiento individual)
  - `src/pages/servicios/producto.astro` (IA para Product Managers y equipos)
  - `src/pages/recursos/ebook-pm.astro` & `preventa-vol2.astro` (*PM Sin Bullshit*)
  - `src/pages/recursos/checklistpm-vol1.astro`
* **Qué Crear/Mover**:
  - Crear/convertir `src/pages/profesionales.astro` como la landing independiente de profesionales.
  - Incluir audiencias: Product Managers (research, PRDs, backlog, reuniones) y profesionales en general (consultores, abogados, contadores, freelancers).
  - Incluir bloque dedicado a **Product Management Sin Bullshit** (libro/producto oficial).
  - Mapear casos de éxito de profesionales (separados de los casos corporativos).
* **URLs a Redireccionar (301)**:
  - `/soluciones/profesionales` ➔ `/profesionales`
  - `/servicios/producto` ➔ `/profesionales`

---

### 3. Mundo EDUCACIÓN (`/educacion`)
* **Propósito**: Aprendizaje. Rutas de aprendizaje, cursos, productos digitales y herramientas gratuitas.
* **Archivos Actuales que Corresponden**:
  - `src/pages/recursos.astro` (Librería de recursos)
  - `src/pages/rutas.astro` (Rutas de aprendizaje)
  - `src/pages/curso-presentaciones.astro` ($35 USD)
  - `src/pages/bot-presentaciones.astro` ($8 USD)
  - `src/pages/atajos-ia.astro` ($17 USD)
  - `src/pages/atajos-visuales.astro` ($5 USD)
  - `src/pages/recursos/*` (Micro-SaaS: Prompteador, Backlog Detox, Shape Up Builder, Job Prompt, CV con IA, etc.)
* **Qué Crear/Mover**:
  - Crear `src/pages/educacion.astro` como el Hub de Educación.
  - Organizar en 3 bloques claros:
    1. **Rutas de Aprendizaje** (integrando la experiencia de `/rutas`).
    2. **Productos Digitales** (Curso Presentaciones, Bot, Atajos IA, Atajos Visuales).
    3. **Herramientas y Recursos Gratuitos** (Prompteador, CV con IA, Backlog Detox, etc.).
* **URLs a Redireccionar/Mantener**:
  - Redireccionar `/recursos` ➔ `/educacion` (o mantener `/educacion` como hub y `/recursos` redirigido).
  - Redireccionar `/rutas` ➔ `/educacion#rutas` (o mantener `/educacion/rutas`).
  - **IMPORTANTE**: Mantener funcionando todas las URLs directas de productos (`/curso-presentaciones`, `/bot-presentaciones`, etc.) y herramientas (`/recursos/shapeup-builder`, etc.) para no romper enlaces de Hotmart o campañas.

---

### 4. SOBRE PABLO (`/sobre-pablo`)
* **Propósito**: Autoridad, trayectoria y confianza transversal.
* **Archivos Actuales**: `src/pages/content/sobremi.astro`, `src/components/SobreMi.astro`.
* **Acción**: Crear `src/pages/sobre-pablo.astro` (o redirigir `/sobre-pablo` ➔ `/content/sobremi`).

---

### 5. HOME (`/`) — Selector de Intención
* **Propósito**: Presentar de forma limpia y directa los 3 grandes caminos sin saturación.
* **Estructura**:
  - **Hero**: Propuesta de valor de LuciRMe AI + Selector de Intención (3 Tarjetas Gigantes: Empresas, Profesionales, Educación).
  - **Termómetro IA (`<Selector />`)**: Herramienta de diagnóstico rápido.
  - **Prueba Social / Manifiesto de Pablo**.
* **URLs a Redireccionar**: `/servicios` ➔ `/`

---

## 🧭 6. Nueva Estructura del Menú de Navegación (`Layout.astro` y `Sidebar.astro`)

```text
[Logo LuciRMe AI]   Empresas | Profesionales | Educación | Sobre Pablo   [WhatsApp CTA]
```

En dispositivos móviles (Drawer Off-Canvas), la misma jerarquía de 4 opciones más el botón directo de WhatsApp.

---

## 🛡️ 7. Análisis de Riesgos e Integraciones a Preservar

1. **Analítica de Eventos (PostHog)**:
   - Al actualizar rutas y menús, adaptar las propiedades `destination`, `origin` y `pagina` en las llamadas a `window.posthog.capture(...)` sin eliminar los eventos existentes (`termometro_*`, `empresas_*`, `profesionales_*`, `curso_*`, `header_*`).
2. **Captura de Leads y Formularios (MailerLite & APIs)**:
   - Mantenimiento estricto de `/api/termometro`, `/api/unlock-guia`, `/api/guardar-preventa`, `/api/optimizar-prompt`, etc.
3. **Conversión y Pasarelas Externa**:
   - Mantenimiento intacto de URLs externas en `src/lib/constants.js`: Hotmart, Calendly y WhatsApp (`https://wa.me/573053046180`).
4. **Autenticación (Clerk)**:
   - Mantener componentes de autenticación en Header/Drawer para usuarios registrados.
5. **SEO y Retrocompatibilidad**:
   - Implementar redirecciones 301 mediante middleware de Astro o scripts de respuesta SSR para que ningún enlace antiguo devuelva error 404.

---

## 📝 8. Plan de Ejecución Paso a Paso

1. **Creación de Landing Pages Principales**:
   - Crear `/empresas.astro` unificando soluciones B2B, casos empresariales y la solución de Página Comercial (+WhatsApp).
   - Crear `/profesionales.astro` agrupando acompañamiento individual, IA para PMs y espacio destacado para *Product Management Sin Bullshit*.
   - Crear `/educacion.astro` agrupando Rutas, Productos Digitales y Herramientas Gratuitas.
   - Crear `/sobre-pablo.astro` (o vincular con `/content/sobremi`).
2. **Reestructuración de la Home (`/index.astro`)**:
   - Rediseñar como Selector de Intención de 3 caminos limpios.
3. **Actualización de Navegación (`Layout.astro` y `Sidebar.astro`)**:
   - Implementar el menú simplificado de 4 enlaces + WhatsApp tanto en desktop como en mobile drawer.
4. **Configuración de Redirecciones (Redirects 301)**:
   - Configurar redirecciones permanentes para `/soluciones/empresas`, `/soluciones/profesionales`, `/soluciones/startups`, `/servicios`, `/recursos`, etc.
5. **Instrumentación de Analítica PostHog**:
   - Verificar y actualizar las capturas de eventos PostHog en las nuevas rutas y menús.
6. **Verificación de Compilación y QA**:
   - Ejecutar `compile_applet` y validar cero errores de sintaxis o compilación.
