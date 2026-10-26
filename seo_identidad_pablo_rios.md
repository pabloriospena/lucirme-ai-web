# Artefactos Técnicos de Posicionamiento y SEO para Pablo Ríos Peña

Este documento contiene los 4 bloques técnicos requeridos para indexar correctamente la identidad de **Pablo Ríos Peña** como **Product Manager, Ingeniero de Sistemas de la UPB y Consultor/Mentor en IA Aplicada**, optimizado para motores de búsqueda y el Grafo de Conocimiento de Google.

---

## 1. Código Schema Markup (JSON-LD)

Bloque de datos estructurados basado en `Schema.org/Person` para insertar en el `<head>` o pie de la página de inicio.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Pablo Ríos Peña",
  "givenName": "Pablo",
  "familyName": "Ríos Peña",
  "jobTitle": "Product Manager & Consultor en IA Aplicada",
  "description": "Ingeniero de Sistemas de la Universidad Pontificia Bolivariana (UPB), Product Manager y Consultor/Mentor en Inteligencia Artificial Aplicada y automatización de procesos para empresas y profesionales en Medellín y Colombia.",
  "url": "https://lucirme.com",
  "image": "https://lucirme.com/assets/pablo-rios-perla.jpg",
  "sameAs": [
    "https://www.linkedin.com/in/pabloriospena",
    "https://lucirme.com"
  ],
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "Universidad Pontificia Bolivariana",
    "sameAs": "https://www.upb.edu.co"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Medellín",
    "addressCountry": "Colombia"
  },
  "knowsAbout": [
    "Product Management",
    "Inteligencia Artificial Aplicada",
    "Automatización de Procesos",
    "Metodologías Ágiles",
    "Ingeniería de Sistemas",
    "Estrategia de Producto Digital",
    "Prompt Engineering Avanzado"
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "LuciRMe AI",
    "url": "https://lucirme.com"
  }
}
</script>
```

---

## 2. Metadatos Héroe (HTML Meta Tags)

Etiquetas esenciales de SEO y Open Graph optimizadas para la página de inicio (Home).

```html
<!-- SEO Principal -->
<title>Pablo Ríos Peña – Product Manager & Consultor en IA Aplicada</title>
<meta name="description" content="Consultor y Mentor en Inteligencia Artificial Aplicada y Product Management. Ingeniero de Sistemas UPB en Medellín, Colombia. Optimiza procesos con IA sin teoría vacía." />
<link rel="canonical" href="https://lucirme.com" />

<!-- Open Graph (Redes Sociales y LinkedIn) -->
<meta property="og:type" content="profile" />
<meta property="og:title" content="Pablo Ríos Peña – Product Manager & Consultor en IA Aplicada" />
<meta property="og:description" content="Ingeniero de Sistemas UPB y Product Manager. Ayudo a equipos y profesionales a integrar inteligencia artificial aplicada y automatizar procesos con resultados reales." />
<meta property="og:url" content="https://lucirme.com" />
<meta property="og:site_name" content="LuciRMe AI" />
<meta property="og:image" content="https://lucirme.com/assets/og-pablo-rios.jpg" />
<meta property="profile:first_name" content="Pablo" />
<meta property="profile:last_name" content="Ríos Peña" />

<!-- Twitter / X Cards -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Pablo Ríos Peña – Product Manager & Consultor en IA Aplicada" />
<meta name="twitter:description" content="Ingeniero de Sistemas UPB y Product Manager especializado en IA aplicada y automatización de procesos en Medellín, Colombia." />
<meta name="twitter:image" content="https://lucirme.com/assets/og-pablo-rios.jpg" />
```

---

## 3. Estructura y Texto de Biografía Corta de la Home (SEO-Copywriting)

Propuesta de texto modular para la sección Hero / Sobre mí de la página principal, diseñada para maximizar la densidad semántica natural sin comprometer la conversión ni la legibilidad.

### Estructura sugerida para el componente `SobreMi.astro` / `Hero.astro`:

```html
<section id="sobre-mi" class="py-16 px-4 sm:px-6 bg-white">
  <div class="max-w-4xl mx-auto">
    <span class="font-mono text-xs font-semibold text-teal-800 uppercase tracking-wider block mb-2">
      Ingeniería, Producto y Negocio
    </span>
    <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-6">
      Hola, soy Pablo Ríos Peña. Ayudo a equipos a transformar operaciones con Inteligencia Artificial aplicada.
    </h2>
    <div class="prose prose-slate text-base sm:text-lg text-slate-700 leading-relaxed space-y-4">
      <p>
        Como <strong>Ingeniero de Sistemas</strong> egresado de la <strong>Universidad Pontificia Bolivariana (UPB)</strong> y <strong>Product Manager</strong> con amplia trayectoria en <strong>Medellín, Colombia</strong>, mi enfoque une la rigurosidad técnica con la claridad estratégica de negocio.
      </p>
      <p>
        No creo en la tecnología por moda ni en la teoría vacía. A través de consultorías especializadas y mentorías 1-1, acompaño a empresas y profesionales a implementar <strong>inteligencia artificial aplicada</strong> y automatizar procesos críticos para reducir tiempos de ciclo, eliminar fricciones operativas y escalar con método.
      </p>
    </div>
  </div>
</section>
```

---

## 4. Checklist de Estrategia de Palabras Clave y Contenido de Nicho

Estrategia de Topic Clusters (clústeres de contenido) y combinaciones exactas de palabras clave orientadas a posicionar la autoridad de Pablo en el Grafo de Conocimiento de Google.

### A. Palabras Clave Principales (Head Terms & Long-tail)
1. *Pablo Ríos Peña IA*
2. *Product Manager Medellín*
3. *Consultor en Inteligencia Artificial Colombia*
4. *Ingeniero de Sistemas UPB Pablo Ríos*
5. *Automatización de procesos con IA en empresas*
6. *Mentoría de inteligencia artificial aplicada B2B*

### B. Topic Clusters Sugeridos para Contenido Mensual (Blog / Casos de Estudio)

| Clúster Temático | Título de Artículo Sugerido | Keyword Objetivo |
| :--- | :--- | :--- |
| **Product Management & IA** | Cómo integrar IA en el ciclo de vida del producto sin quemar al equipo | *Product Manager IA* |
| **Ingeniería & Automatización** | De 12 a 4 días: Casos reales de automatización de procesos en empresas B2B | *Automatización de procesos con IA* |
| **Consultoría Estratégica** | Inteligencia artificial aplicada vs. moda: qué priorizar en tu operación | *Consultor en inteligencia artificial Colombia* |
| **Casos de Éxito / Trayectoria** | Formación técnica y visión de producto: mi paso por la UPB y la gestión moderna | *Ingeniero de Sistemas UPB Pablo Ríos* |
