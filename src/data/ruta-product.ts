export interface Recurso {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: "gratis" | "gratis-con-correo" | "pago-proximamente" | "pago";
  url: string;
}

export interface PasoRuta {
  numero: string;
  titulo: string;
  subtituloCategoria: string;
  descripcion: string;
  estado: "disponible" | "en-construccion" | "proximamente";
  mailerliteGroup?: string;
  recursos?: Recurso[];
  loQueHacesHoy?: string[];
  loQueTienesAlTerminar?: string[];
}

export const MAILERLITE_GROUPS = {
  RECURSOS_GRATIS: "201424892057355422",
  AVISO_PASO_2: "201424892603663640",
  AVISO_PASO_3: "201424893076571466",
  AVISO_PASO_4: "201424893655385439",
};

export const RUTA_PRODUCTO_DATA: PasoRuta[] = [
  {
    numero: "00",
    titulo: "Paso 0 · Conexiones",
    subtituloCategoria: "Conexiones entre herramientas",
    descripcion: "Conecta las herramientas que ya usas antes de empezar el ciclo de producto.",
    estado: "disponible",
    recursos: [
      {
        id: "rec-p0-intro",
        titulo: "Introducción al mapa de conexiones",
        descripcion: "El mapa integral de integración entre tus herramientas de producto.",
        tipo: "gratis-con-correo",
        url: "/ruta-product/paso-0/intro"
      },
      {
        id: "rec-p0-notion",
        titulo: "Notion + Jira",
        descripcion: "Sincroniza notas de entrevista y crea historias en Jira con Claude.",
        tipo: "gratis-con-correo",
        url: "/ruta-product/paso-0/notion-jira"
      },
      {
        id: "rec-p0-posthog",
        titulo: "PostHog + Claude",
        descripcion: "Convierte datos analíticos y eventos de usuarios en hipótesis de discovery.",
        tipo: "gratis-con-correo",
        url: "/ruta-product/paso-0/posthog-claude"
      },
      {
        id: "rec-p0-plantilla",
        titulo: "Plantilla de conexión completa",
        descripcion: "El flujo completo listo para montar en tu cuenta.",
        tipo: "pago",
        url: "/ruta-product/paso-0/plantilla-conexion"
      }
    ]
  },
  {
    numero: "01",
    titulo: "Paso 1 · Discovery",
    subtituloCategoria: "Validación del problema",
    descripcion: "Decide qué problema vale la pena resolver antes de construir.",
    estado: "proximamente",
    loQueHacesHoy: [
      "Recibes solicitudes de múltiples stakeholders sin un criterio claro de priorización.",
      "Inicias desarrollos basándote en opiniones o intuiciones sin métricas de validación.",
      "Inviertes semanas diseñando soluciones para problemas que los usuarios no consideran críticos."
    ],
    loQueTienesAlTerminar: [
      "Un criterio estructurado para filtrar y descartar ideas de baja viabilidad.",
      "Evidencias claras sobre el dolor principal del usuario antes de escribir código.",
      "Un entregable validado para presentar ante stakeholders y alinear expectativas."
    ],
    recursos: [
      {
        id: "rec-ideador",
        titulo: "Ideador de Productos",
        descripcion: "Estructura, valida y prototipa tu proyecto o hipótesis con prompts guiados.",
        tipo: "gratis",
        url: "/recursos/ideador-producto"
      },
      {
        id: "rec-3",
        titulo: "Guía de Prompting para PMs",
        descripcion: "Los prompts para research y síntesis.",
        tipo: "gratis",
        url: "/recursos/checklistpm-vol1"
      }
    ]
  },
  {
    numero: "02",
    titulo: "Paso 2 · Ejecución",
    subtituloCategoria: "PRD y specs",
    descripcion: "Prioriza el backlog y convierte pitches en historias ejecutables.",
    estado: "en-construccion",
    mailerliteGroup: MAILERLITE_GROUPS.AVISO_PASO_2,
    recursos: [
      {
        id: "rec-1",
        titulo: "Backlog Detox",
        descripcion: "Prioriza tu backlog con IA en minutos.",
        tipo: "gratis",
        url: "/recursos/backlog-detox"
      },
      {
        id: "rec-2",
        titulo: "Shape Up Builder",
        descripcion: "Define apuestas claras de producto sin ciclos infinitos de planificación.",
        tipo: "gratis",
        url: "/recursos/shapeup-builder"
      }
    ]
  },
  {
    numero: "03",
    titulo: "Paso 3 · Lanzamiento",
    subtituloCategoria: "Lanzamiento y rollout",
    descripcion: "Define criterios de salida y comunica el lanzamiento.",
    estado: "proximamente",
    mailerliteGroup: MAILERLITE_GROUPS.AVISO_PASO_3
  },
  {
    numero: "04",
    titulo: "Paso 4 · Adopción",
    subtituloCategoria: "Analítica y retención",
    descripcion: "Mide si los usuarios usan lo que lanzaste y qué cambiar.",
    estado: "proximamente",
    mailerliteGroup: MAILERLITE_GROUPS.AVISO_PASO_4
  }
];
