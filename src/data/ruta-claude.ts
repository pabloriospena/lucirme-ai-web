export type EstadoPasoClaude = "disponible" | "en-construccion" | "proximamente";
export type AccesoPasoClaude = "gratis" | "pago";

export interface PasoClaude {
  numero: string;
  titulo: string;
  subtituloCategoria: string;
  descripcion: string;
  acceso: AccesoPasoClaude;
  estado: EstadoPasoClaude;
  href?: string;
}

/** Herramientas. "probado" solo se marca cuando se probó de punta a punta. */
export const HERRAMIENTAS_CLAUDE = {
  probado: ["Claude", "Google Drive", "Notion"],
  mismaLogicaSinProbar: ["OneDrive", "Microsoft 365"],
};

/** Landing de venta del kit. Los pasos de pago muestran el botón hacia ella. */
export const LANDING_KIT_URL = "/ruta-claude/kit";

/** Enlace de checkout del kit en Hotmart. Mientras esté vacío, la landing pide el correo en vez de vender. */
export const HOTMART_KIT_URL = "";

export const RUTA_CLAUDE_DATA: PasoClaude[] = [
  {
    numero: "00",
    titulo: "Paso 0. Tu primera conversación con Claude",
    subtituloCategoria: "Empezar bien",
    descripcion:
      "Dejás Claude listo, hacés una primera tarea con un texto tuyo y sabés qué datos no pegar.",
    acceso: "gratis",
    estado: "disponible",
    href: "/ruta-claude/paso-0",
  },
  {
    numero: "01",
    titulo: "Paso 1. El prompt es el contexto",
    subtituloCategoria: "Pedir bien",
    descripcion:
      "Aprendés a pedirle a Claude con situación, material, formato y límites, y a darle una sola fuente para que no invente.",
    acceso: "gratis",
    estado: "disponible",
    href: "/ruta-claude/paso-1",
  },
  {
    numero: "02",
    titulo: "Paso 2. Dale tus documentos a Claude",
    subtituloCategoria: "Contexto estable",
    descripcion:
      "Armás un proyecto con tus documentos y sus instrucciones, para no empezar de cero en cada conversación.",
    acceso: "pago",
    estado: "proximamente",
    href: "/ruta-claude/paso-2",
  },
  {
    numero: "03",
    titulo: "Paso 3. Comprobá lo que dice Claude",
    subtituloCategoria: "Verificación",
    descripcion:
      "Pedís la cita de cada respuesta, la comparás con tu fuente y sabés cuándo no confiar.",
    acceso: "pago",
    estado: "proximamente",
    href: "/ruta-claude/paso-3",
  },
  {
    numero: "04",
    titulo: "Paso 4. Convertilo en rutina",
    subtituloCategoria: "Tareas que se repiten",
    descripcion:
      "Elegís tres tareas que repetís cada semana y las dejás escritas para que Claude las haga igual cada vez.",
    acceso: "pago",
    estado: "proximamente",
    href: "/ruta-claude/paso-4",
  },
];
