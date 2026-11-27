// Banda Prompts de lucirme.com (Web LuciRMe v2). Cada prompt tiene título, para qué sirve y el texto que se copia.
// Escritos por Web v2 para esta banda. Pablo los revisa antes de salir a producción.
// Reglas de redacción de la web: español neutro, tuteando, solo puntos, comas y signos de admiración e interrogación.
// Cada prompt termina pidiendo el material, que la persona pega justo después de copiarlo.
// Los temas son provisionales hasta la Sesión 3, los mismos de la lista de espera de /clases.

export const TEMAS_PROMPTS = [
  "Presentar y comunicar",
  "Estudiar e investigar",
  "Imágenes y contenido visual",
  "Carrera y empleo",
  "Producto y decisiones",
] as const;

export type TemaPrompt = (typeof TEMAS_PROMPTS)[number];

export interface PromptItem {
  slug: string;
  titulo: string;
  descripcion: string;
  tema: TemaPrompt;
  texto: string;
}

export const PROMPTS: PromptItem[] = [
  {
    slug: "ordena-mis-ideas-en-un-discurso",
    titulo: "Ordena mis ideas en un discurso",
    descripcion: "Convierte ideas sueltas en un discurso con inicio, desarrollo y cierre.",
    tema: "Presentar y comunicar",
    texto:
      "Actúa como un coach de comunicación. Te voy a pasar mis ideas sueltas sobre un tema que voy a presentar. Quiero que las ordenes en un discurso con inicio, desarrollo y cierre, en un tono claro y cercano. Mantén mis palabras y mi voz, y no inventes datos. Al final, dime qué idea quedó más débil y cómo reforzarla. Mis ideas son las siguientes.",
  },
  {
    slug: "esquema-de-presentacion-de-cinco-diapositivas",
    titulo: "Esquema de una presentación de cinco diapositivas",
    descripcion: "Arma el esquema de una presentación para una audiencia concreta.",
    tema: "Presentar y comunicar",
    texto:
      "Quiero presentar un tema a una audiencia específica. Antes de empezar, hazme las preguntas que necesites sobre la audiencia y el objetivo, una a la vez. Después propón el esquema de una presentación de cinco diapositivas. Para cada diapositiva dame un título que diga la idea principal, tres puntos de apoyo y una sugerencia visual.",
  },
  {
    slug: "reescribe-un-correo-dificil",
    titulo: "Reescribe un correo difícil",
    descripcion: "Haz más claro y amable un correo que te cuesta escribir.",
    tema: "Presentar y comunicar",
    texto:
      "Voy a pegarte un correo que me cuesta escribir. Reescríbelo para que sea claro, respetuoso y directo. Dame dos versiones, una breve y una más cálida. Señala qué cambiaste y por qué. No agregues compromisos que yo no haya mencionado. El correo es el siguiente.",
  },
  {
    slug: "explicame-un-tema-desde-cero",
    titulo: "Explícame un tema desde cero",
    descripcion: "Aprende un tema nuevo con una analogía, una explicación y preguntas de práctica.",
    tema: "Estudiar e investigar",
    texto:
      "Quiero entender un tema desde cero. Explícamelo en tres niveles, primero con una analogía de la vida diaria, luego con una explicación sencilla y al final con el detalle técnico. Después hazme cinco preguntas para comprobar si lo entendí y corrige mis respuestas. El tema es el siguiente.",
  },
  {
    slug: "sintetiza-un-documento-largo",
    titulo: "Sintetiza un documento largo",
    descripcion: "Saca lo esencial de un documento denso, con cada idea ubicada en el texto.",
    tema: "Estudiar e investigar",
    texto:
      "Te voy a compartir un documento largo. Haz una síntesis con las cinco ideas principales, los datos clave y las preguntas que el documento deja sin responder. Indica en qué parte del documento está cada idea para que pueda verificarla. Si algo no está en el texto, dilo y no lo supongas. El documento es el siguiente.",
  },
  {
    slug: "plan-de-estudio-de-dos-semanas",
    titulo: "Plan de estudio de dos semanas",
    descripcion: "Organiza lo que quieres aprender en bloques cortos de cada día.",
    tema: "Estudiar e investigar",
    texto:
      "Quiero aprender un tema en dos semanas, con 30 minutos al día. Empieza preguntándome mi nivel actual y para qué quiero aprenderlo. Con mis respuestas, diseña un plan por días con un objetivo pequeño, una actividad práctica y una forma de comprobar que avancé. El tema es el siguiente.",
  },
  {
    slug: "describe-la-imagen-que-necesitas",
    titulo: "Describe la imagen que necesitas",
    descripcion: "Pasa de una idea vaga a una instrucción precisa para generar una imagen.",
    tema: "Imágenes y contenido visual",
    texto:
      "Quiero generar una imagen con IA, pero solo tengo una idea vaga. Ayúdame a convertirla en una instrucción precisa. Hazme preguntas sobre el uso, el estilo, los colores, el encuadre y lo que no debe aparecer. Cuando tengas suficiente información, escribe la instrucción final en un solo párrafo, lista para pegar en la herramienta. Mi idea es la siguiente.",
  },
  {
    slug: "mejora-una-foto-de-producto",
    titulo: "Mejora una foto de producto",
    descripcion: "Pide cambios concretos sobre una foto que ya tienes.",
    tema: "Imágenes y contenido visual",
    texto:
      "Adjunto una foto de mi producto. Quiero una versión con fondo limpio, luz suave y un encuadre que se vea bien en redes sociales. No cambies la forma, el color ni el logo del producto. Si algo de lo que pido no es posible, dime qué alternativa tengo.",
  },
  {
    slug: "adapta-tu-cv-a-una-vacante",
    titulo: "Adapta tu hoja de vida a una vacante",
    descripcion: "Ajusta tu hoja de vida a lo que pide una oferta concreta.",
    tema: "Carrera y empleo",
    texto:
      "Voy a pegarte mi hoja de vida y una oferta de trabajo. Dime qué palabras clave de la oferta faltan en mi hoja de vida. Reescribe mi resumen profesional y mis tres logros principales para que respondan a lo que se pide. No inventes experiencia que no tengo y marca lo que cambiaste. Mi hoja de vida y la oferta son las siguientes.",
  },
  {
    slug: "practica-una-entrevista",
    titulo: "Practica una entrevista",
    descripcion: "Simula una entrevista de trabajo y recibe comentarios de cada respuesta.",
    tema: "Carrera y empleo",
    texto:
      "Actúa como entrevistador para un cargo concreto. Hazme una pregunta a la vez y espera mi respuesta. Después de cada respuesta, dime qué estuvo bien, qué faltó y cómo la haría más sólida, con un ejemplo. Haz diez preguntas en total y al final dame un resumen con mis tres mejores y mis tres peores respuestas. El cargo es el siguiente.",
  },
  {
    slug: "prioriza-un-backlog",
    titulo: "Prioriza un backlog",
    descripcion: "Ordena una lista larga de tareas con criterios claros.",
    tema: "Producto y decisiones",
    texto:
      "Te voy a pasar una lista de ideas y tareas de producto. Clasifícalas en lo que conviene hacer ya, lo que hay que validar primero y lo que se puede archivar. Explica tu criterio en una frase por cada elemento y dime qué información te faltó para decidir mejor. La lista es la siguiente.",
  },
  {
    slug: "convierte-entrevistas-en-una-decision",
    titulo: "Convierte entrevistas en una decisión",
    descripcion: "Encuentra los problemas que más se repiten, cada uno con su cita.",
    tema: "Producto y decisiones",
    texto:
      "Te voy a compartir las transcripciones de varias entrevistas con usuarios. Identifica los tres problemas que más se repiten. Para cada problema, cita textualmente al menos dos frases de entrevistados distintos y dime en cuántas entrevistas aparece. Si una afirmación no tiene una cita que la respalde, no la incluyas. Cierra con la decisión de producto que esto sugiere y el riesgo que tiene. Las transcripciones son las siguientes.",
  },
];
