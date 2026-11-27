// Índice de contenido de lucirme.com (Web LuciRMe v2).
//
// Una entrada por recurso. El índice /recursos se arma desde este archivo y no desde la carpeta.
// Las bandas vacías no se muestran.
//
// Reglas de redacción (Reglas LuciRMe en Notion): voz de la web en español neutro, tuteando.
// Solo puntos, comas, signos de admiración e interrogación. Sin comillas, dos puntos, paréntesis ni guiones.
// Sin precios ni fechas. Los precios viven solo en Hotmart y en Reglas sección 3.
//
// Los temas son marcadores de posición hasta que se haga la Sesión 3 (mapa de temas y guías).

export type BandaId = "paso-a-paso" | "guias-herramientas" | "clases" | "prompts" | "biblioteca";
export type Formato = "Ruta" | "Guía" | "Herramienta" | "Clase" | "Prompts";

export interface Recurso {
  slug: string;
  url: string;
  titulo: string;
  descripcion: string;
  banda: BandaId;
  formato: Formato;
  tema: string;
  // Enlace discreto, sin tarjeta. Se usa para la Ruta Product, que sigue congelada.
  secundaria?: boolean;
  // Etiquetas de herramienta, dificultad y área. Marcadores de posición hasta la Sesión 3.
  herramienta?: string;
  dificultad?: Dificultad;
  area?: string;
  // Estado de acceso que ve la persona. Si falta, se asume gratis.
  acceso?: Acceso;
  // Clave en src/data/precios.ts, solo para recursos de pago.
  precio?: string;
  // Invitaciones que desbloquean un recurso de pago.
  invitaciones?: number;
}

export type Dificultad = "Para empezar" | "Para avanzar";
export type Acceso = "gratis" | "gratis-correo" | "de-pago" | "o-con-invitaciones";

// Recursos que piden correo antes de abrirse. Salen de leer cada página (formulario con unlock-recurso o unlock-guia).
const PIDEN_CORREO = new Set([
  "guia-20prompts-notebooklm", "guia-estudio-notebooklm", "guia-deepresearch", "checklistpm-vol1", "prompteador",
  "shapeup-builder", "crear-imagenes-ia", "backlog-detox", "reunion-claridad", "cv-con-ia", "job-prompt-ai",
]);
const HERRAMIENTA: Record<string, string> = {
  NotebookLM: "NotebookLM", Claude: "Claude", Investigación: "Gemini y ChatGPT",
};
const AREA: Record<string, string> = {
  Producto: "Product Management", Imágenes: "Multimedia", Presentaciones: "Multimedia",
  Empleo: "Carrera", Reuniones: "Carrera", Prompts: "Todas", NotebookLM: "Todas", Claude: "Todas", Investigación: "Todas",
};
const AVANZADO = new Set(["guia-deepresearch", "shapeup-builder", "ai-solver", "ideador-producto", "ruta-evidencia"]);

export const BANDAS: { id: BandaId; nombre: string; descripcion: string }[] = [
  {
    id: "paso-a-paso",
    nombre: "Paso a paso",
    descripcion: "Rutas para avanzar con IA de a un paso, con ejemplos.",
  },
  {
    id: "guias-herramientas",
    nombre: "Guías y herramientas",
    descripcion: "Guías para leer y aplicar, y herramientas para usar ya.",
  },
  {
    id: "clases",
    nombre: "Clases en vivo",
    descripcion: "Clases con Pablo que quedan grabadas.",
  },
  {
    id: "biblioteca",
    nombre: "Biblioteca",
    descripcion: "Artículos que responden una pregunta concreta sobre IA aplicada.",
  },
  {
    id: "prompts",
    nombre: "Prompts",
    descripcion: "Prompts listos para copiar, filtrados por tema.",
  },
];

export const RECURSOS: Recurso[] = [
  // Paso a paso
  {
    slug: "ruta-claude",
    url: "/ruta-claude",
    titulo: "Ruta Claude",
    descripcion: "Cinco pasos para usar Claude en tu trabajo real, con ejemplos para emprendedores y empleados.",
    banda: "paso-a-paso",
    formato: "Ruta",
    tema: "Claude",
  },
  {
    slug: "ruta-evidencia",
    url: "/ruta-evidencia",
    titulo: "Ruta Evidencia",
    descripcion: "Cinco pasos para convertir entrevistas en una decisión de producto, con cada afirmación atada a una cita.",
    banda: "paso-a-paso",
    formato: "Ruta",
    tema: "Producto",
  },
  {
    slug: "ruta-product",
    url: "/ruta-product",
    titulo: "Ruta Product Management con IA",
    descripcion: "Ruta para Product Managers.",
    banda: "paso-a-paso",
    formato: "Ruta",
    tema: "Producto",
    secundaria: true,
  },

  // Guías
  {
    slug: "guia-notebooklm",
    url: "/recursos/guia-notebooklm",
    titulo: "De notas a reportes con NotebookLM",
    descripcion: "Cómo ordenar tus notas, PDFs y audios para generar reportes en minutos.",
    banda: "guias-herramientas",
    formato: "Guía",
    tema: "NotebookLM",
  },
  {
    slug: "guia-20prompts-notebooklm",
    url: "/recursos/guia-20prompts-notebooklm",
    titulo: "20 prompts para NotebookLM",
    descripcion: "Prompts listos para copiar y pegar, organizados por análisis, estudio, investigación y acción.",
    banda: "guias-herramientas",
    formato: "Guía",
    tema: "NotebookLM",
  },
  {
    slug: "guia-estudio-notebooklm",
    url: "/recursos/guia-estudio-notebooklm",
    titulo: "Guía de estudio con NotebookLM",
    descripcion: "Un método para aprender rápido y aplicar lo aprendido en proyectos reales.",
    banda: "guias-herramientas",
    formato: "Guía",
    tema: "NotebookLM",
  },
  {
    slug: "guia-deepresearch",
    url: "/recursos/guia-deepresearch",
    titulo: "Guía de Deep Research",
    descripcion: "Cómo investigar un tema a fondo con Gemini y ChatGPT.",
    banda: "guias-herramientas",
    formato: "Guía",
    tema: "Investigación",
  },
  {
    slug: "checklistpm-vol1",
    url: "/recursos/checklistpm-vol1",
    titulo: "Guía de prompting para PMs",
    descripcion: "Una fórmula para pedir mejor y cuatro prompts para historias de usuario, roadmap y priorización.",
    banda: "guias-herramientas",
    formato: "Guía",
    tema: "Producto",
  },
  {
    slug: "ebook-pm",
    url: "/recursos/ebook-pm",
    titulo: "Ebook de Product Management",
    descripcion: "Un manual de Product Management directo, para aplicar IA con criterio.",
    banda: "guias-herramientas",
    formato: "Guía",
    tema: "Producto",
  },
  {
    slug: "atajos-ia",
    url: "/recursos/atajos-ia",
    titulo: "Atajos de IA",
    descripcion: "Dieciocho prompts prácticos para copiar, pegar y adaptar.",
    banda: "guias-herramientas",
    formato: "Guía",
    tema: "Prompts",
  },
  {
    slug: "atajos-visuales",
    url: "/recursos/atajos-visuales",
    titulo: "Atajos visuales",
    descripcion: "Comandos para crear imágenes y video con IA, organizados por casos reales.",
    banda: "guias-herramientas",
    formato: "Guía",
    tema: "Imágenes",
  },
  {
    slug: "presentaciones-con-ia",
    url: "/recursos/presentaciones-con-ia",
    titulo: "Presentaciones con IA en 30 minutos",
    descripcion: "Un método corto y prompts de copia rápida para armar tu presentación.",
    banda: "guias-herramientas",
    formato: "Guía",
    tema: "Presentaciones",
  },

  // Herramientas
  {
    slug: "prompteador",
    url: "/recursos/prompteador",
    titulo: "Prompteador",
    descripcion: "Mejora tus prompts con una fórmula simple para obtener mejores respuestas.",
    banda: "guias-herramientas",
    formato: "Herramienta",
    tema: "Prompts",
  },
  {
    slug: "bot-presentaciones",
    url: "/recursos/bot-presentaciones",
    titulo: "Bot de presentaciones",
    descripcion: "Ordena tus ideas dispersas en un discurso claro y estructurado, sin perder tu voz.",
    banda: "guias-herramientas",
    formato: "Herramienta",
    tema: "Presentaciones",
  },
  {
    slug: "crear-imagenes-ia",
    url: "/recursos/crear-imagenes-ia",
    titulo: "Crea tu primera imagen con IA",
    descripcion: "Abre una herramienta, adjunta una foto y prueba comandos sin saber de prompts. Termina en Atajos visuales.",
    banda: "guias-herramientas",
    formato: "Herramienta",
    tema: "Imágenes",
  },
  {
    slug: "reunion-claridad",
    url: "/recursos/reunion-claridad",
    titulo: "De la reunión a decisiones claras",
    descripcion: "Convierte una conversación larga en decisiones, responsables y próximos pasos con NotebookLM.",
    banda: "guias-herramientas",
    formato: "Herramienta",
    tema: "Reuniones",
  },
  {
    slug: "cv-con-ia",
    url: "/recursos/cv-con-ia",
    titulo: "Tu CV con IA",
    descripcion: "Pega tu texto actual y obtén un CV pensado para los filtros de selección.",
    banda: "guias-herramientas",
    formato: "Herramienta",
    tema: "Empleo",
  },
  {
    slug: "job-prompt-ai",
    url: "/recursos/job-prompt-ai",
    titulo: "Prompt para buscar vacantes",
    descripcion: "Genera prompts de búsqueda avanzada para encontrar vacantes y pégalos en Perplexity.",
    banda: "guias-herramientas",
    formato: "Herramienta",
    tema: "Empleo",
  },
  {
    slug: "ideador-producto",
    url: "/recursos/ideador-producto",
    titulo: "Ideador de productos",
    descripcion: "Mapea, valida y pule tu idea de producto en cuatro fases.",
    banda: "guias-herramientas",
    formato: "Herramienta",
    tema: "Producto",
  },
  {
    slug: "backlog-detox",
    url: "/recursos/backlog-detox",
    titulo: "Backlog Detox",
    descripcion: "Pega tu backlog y clasifica qué hacer ya, qué validar primero y qué archivar.",
    banda: "guias-herramientas",
    formato: "Herramienta",
    tema: "Producto",
  },
  {
    slug: "shapeup-builder",
    url: "/recursos/shapeup-builder",
    titulo: "Constructor de pitches ShapeUp",
    descripcion: "Crea un pitch de producto con ShapeUp y reduce riesgos antes de desarrollar.",
    banda: "guias-herramientas",
    formato: "Herramienta",
    tema: "Producto",
  },
  {
    slug: "ai-solver",
    url: "/recursos/ai-solver",
    titulo: "IA Solver",
    descripcion: "Resuelve problemas de producto con una lógica de priorización clara.",
    banda: "guias-herramientas",
    formato: "Herramienta",
    tema: "Producto",
  },
];

// Fuera del índice por ahora, pendientes de decisión de Pablo:
// - curso-presentaciones: curso de pago grabado, ¿primera grabación de Clases en vivo o página suelta?
// - career-path-notebooklm: hoy pide login, ¿queda abierta con correo?
// Archivadas, sin enlace: procesador-siigo y roadmap-builder.

export const recursosDeBanda = (banda: BandaId) => RECURSOS.filter((r) => r.banda === banda);

export const temasEnUso = () => {
  const temas = new Set<string>();
  for (const r of RECURSOS) {
    if (!r.secundaria) temas.add(r.tema);
  }
  return [...temas].sort((a, b) => a.localeCompare(b, "es"));
};

// Completa etiquetas y acceso sin repetirlos en cada entrada. Son marcadores de posición hasta la Sesión 3.
for (const r of RECURSOS) {
  r.herramienta ??= HERRAMIENTA[r.tema];
  r.area ??= AREA[r.tema] ?? "Todas";
  r.dificultad ??= AVANZADO.has(r.slug) ? "Para avanzar" : "Para empezar";
  r.acceso ??= PIDEN_CORREO.has(r.slug) ? "gratis-correo" : "gratis";
}

export const valoresFiltro = (campo: "tema" | "herramienta" | "dificultad" | "area") => {
  const set = new Set<string>();
  for (const r of RECURSOS) {
    if (r.secundaria) continue;
    const v = r[campo];
    if (v) set.add(v);
  }
  return [...set].sort((a, b) => a.localeCompare(b, "es"));
};

export const conteoBanda = (banda: BandaId) => recursosDeBanda(banda).filter((r) => !r.secundaria).length;
