export type EstadoPasoEvidencia = "disponible" | "en-construccion" | "proximamente";
export type AccesoPasoEvidencia = "gratis" | "pago";

export interface PasoEvidencia {
  numero: string;
  titulo: string;
  subtituloCategoria: string;
  descripcion: string;
  acceso: AccesoPasoEvidencia;
  estado: EstadoPasoEvidencia;
  /** Se llena cuando exista la página del paso. Sin href, la tarjeta no enlaza. */
  href?: string;
}

/** Fuentes y herramientas. "probado" solo se marca cuando se probó la cadena completa. */
export const FUENTES_EVIDENCIA = {
  probado: ["Fathom", "Notion", "Google Drive", "Jira"],
  mismaLogicaSinProbar: ["Granola", "OneDrive", "Linear"],
};

/** Cuando exista la landing de venta del kit, se pone aquí su URL y los pasos de pago muestran el botón. */
export const LANDING_KIT_URL = "";

export const RUTA_EVIDENCIA_DATA: PasoEvidencia[] = [
  {
    numero: "00",
    titulo: "Paso 0 · Conecta tus fuentes",
    subtituloCategoria: "Fuentes y almacén",
    descripcion:
      "Conecta Claude con tus transcripciones y con el lugar donde las vas a guardar, Notion, Drive u OneDrive.",
    acceso: "gratis",
    estado: "disponible",
    href: "/ruta-evidencia/paso-0",
  },
  {
    numero: "01",
    titulo: "Paso 1 · La regla de la cita",
    subtituloCategoria: "Una fuente, una decisión",
    descripcion:
      "Procesa una sola fuente y separa lo que dijo la persona de lo que tú supones. Sin cita, es hipótesis.",
    acceso: "gratis",
    estado: "disponible",
    href: "/ruta-evidencia/paso-1",
  },
  {
    numero: "02",
    titulo: "Paso 2 · Organiza todas tus fuentes",
    subtituloCategoria: "Evidencia por feature",
    descripcion:
      "Junta lo que dicen todas tus fuentes sobre una feature y mira dónde se contradicen.",
    acceso: "pago",
    estado: "proximamente",
    href: "/ruta-evidencia/paso-2",
  },
  {
    numero: "03",
    titulo: "Paso 3 · Decide con criterio",
    subtituloCategoria: "Decisión",
    descripcion:
      "Pon tu criterio por escrito y comprueba cada cita contra su fuente antes de decidir.",
    acceso: "pago",
    estado: "proximamente",
    href: "/ruta-evidencia/paso-3",
  },
  {
    numero: "04",
    titulo: "Paso 4 · Llévalo a tu equipo",
    subtituloCategoria: "Salida a tu gestor de tareas",
    descripcion:
      "Una hoja para tus stakeholders y borradores en Jira o Linear, con la cita y la fuente pegadas.",
    acceso: "pago",
    estado: "proximamente",
    href: "/ruta-evidencia/paso-4",
  },
];
