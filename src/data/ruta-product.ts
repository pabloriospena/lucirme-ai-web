export interface Recurso {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: "gratis" | "gratis-con-correo" | "pago-proximamente";
  url: string;
}

export interface PasoRuta {
  numero: string;
  titulo: string;
  subtituloCategoria: string;
  descripcion: string;
  estado: "disponible" | "proximamente";
  recursos?: Recurso[];
  loQueHacesHoy?: string[];
  loQueTienesAlTerminar?: string[];
}

export const RUTA_PRODUCTO_DATA: PasoRuta[] = [
  {
    numero: "01",
    titulo: "Paso 1 · Discovery",
    subtituloCategoria: "Validación del problema",
    descripcion: "Decide qué problema vale la pena resolver antes de construir.",
    estado: "disponible",
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
        id: "rec-1",
        titulo: "Recurso de Discovery en desarrollo",
        descripcion: "Placeholder pendiente de definición para herramientas de validación de problemas.",
        tipo: "gratis",
        url: "TODO_RECURSO_URL"
      }
    ]
  },
  {
    numero: "02",
    titulo: "Paso 2 · Ejecución",
    subtituloCategoria: "PRD y specs",
    descripcion: "Prioriza el backlog y convierte pitches en historias ejecutables.",
    estado: "proximamente"
  },
  {
    numero: "03",
    titulo: "Paso 3 · Lanzamiento",
    subtituloCategoria: "Lanzamiento y rollout",
    descripcion: "Define criterios de salida y comunica el lanzamiento.",
    estado: "proximamente"
  },
  {
    numero: "04",
    titulo: "Paso 4 · Adopción",
    subtituloCategoria: "Analítica y retención",
    descripcion: "Mide si los usuarios usan lo que lanzaste y qué cambiar.",
    estado: "proximamente"
  }
];
