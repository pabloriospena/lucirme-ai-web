// Prompts de la guía única de NotebookLM. El texto de cada prompt es el de las guías anteriores, sin cambios.
// Estudio: salen de guia-estudio-notebooklm (archivada). Veinte: de guia-20prompts-notebooklm.
export interface PromptItem { titulo: string; texto: string }
export interface GrupoVeinte { seccion: string; items: { n: string; titulo: string; texto: string }[] }

export const RESUMIR: PromptItem[] = [
  {
    "titulo": "Mapa de conceptos (estructura jerárquica)",
    "texto": "Analiza todas las fuentes y devuelve un resumen en formato Markdown estricto:\n\n- Usa `#` para el título principal (el tema central)\n- Usa `##` para cada concepto clave (máximo 7)\n- Bajo cada `##`, usa bullets `-` con los puntos esenciales\n- Usa sub-bullets `  -` para detalles, ejemplos o datos de soporte\n- Usa **negritas** para términos técnicos o ideas fuerza\n- No uses párrafos largos. Solo bullets.\n\nObjetivo: que pueda entender la estructura completa del tema en 3 minutos de lectura."
  },
  {
    "titulo": "Top 5 ideas contraintuitivas",
    "texto": "Identifica las 5 ideas más contraintuitivas, sorprendentes o menos obvias de estas fuentes.\n\nDevuélvelo en Markdown así:\n\n# Ideas contraintuitivas clave\n\n## 1. [Título corto de la idea]\n- **Qué dice la fuente:** [1-2 líneas]\n- **Por qué es contraintuitivo:** [explicación breve]\n- **Por qué importa:** [impacto práctico]\n- **Ejemplo real:** [analogía o caso concreto]\n\nRepite la misma estructura para las 5 ideas. No rellenes. Si solo hay 3 ideas fuertes, devuelve 3."
  },
  {
    "titulo": "Tabla comparativa de conceptos",
    "texto": "Extrae los conceptos clave de las fuentes y organízalos en una tabla Markdown con estas columnas:\n\n| Concepto | Definición (basada en el texto) | Ejemplo práctico (fuera del texto) | Dónde se menciona |\n|----------|--------------------------------|-------------------------------------|-------------------|\n\nReglas:\n- Máximo 10 filas (los conceptos más importantes)\n- La columna \"Ejemplo práctico\" debe ser un caso real que NO esté en las fuentes\n- La columna \"Dónde se menciona\" debe citar la fuente específica"
  },
  {
    "titulo": "Resumen ejecutivo para tomar decisiones",
    "texto": "Actúa como un consultor senior. Devuélveme un resumen ejecutivo en Markdown para tomar decisiones rápidas:\n\n# Resumen Ejecutivo\n\n## Contexto (3 bullets máximo)\n- [Qué problema resuelven estas fuentes]\n- [Para quién aplica]\n- [Qué NO cubren]\n\n## Hallazgos clave (5 bullets máximo)\n- [Dato o idea #1 con su fuente]\n- [Dato o idea #2 con su fuente]\n...\n\n## Riesgos o limitaciones (3 bullets)\n- [Qué falta o qué puede fallar]\n\n## Recomendación accionable (1 párrafo corto, máximo 3 líneas)\n\nUsa **negritas** para lo crítico. Cita la fuente entre paréntesis al final de cada bullet."
  }
];
export const PLANES: PromptItem[] = [
  {
    "titulo": "Plan de 14 días (2 semanas intensivas)",
    "texto": "Con base en las fuentes de este cuaderno, créame un plan de estudio de 14 días para dominar el tema.\n\nRestricciones:\n- 1 hora máxima por día (60 minutos)\n- 5 días de estudio + 1 día de práctica + 1 día de descanso por semana\n- Debo salir con nivel experto-práctico, no teórico\n\nDevuélvelo en Markdown con esta estructura exacta:\n\n# Plan de Estudio: [Nombre del tema]\n\n## Semana 1: Fundamentos y estructura\n\n### Día 1 - [Título de la sesión] (60 min)\n- **Objetivo:** [qué debo saber al terminar]\n- **Fuentes a revisar:** [cuáles y qué secciones]\n- **Actividad (40 min):** [qué hacer con NotebookLM]\n- **Cierre (10 min):** [qué anotar o guardar]\n- **Check:** [pregunta de autoevaluación]\n\n[Repite para días 2-5]\n\n### Día 6 - Práctica integrada\n- **Reto:** [caso práctico que combine lo aprendido]\n- **Entregable:** [qué debo producir]\n\n### Día 7 - Descanso activo\n- **Actividad ligera:** [audio overview o repaso de notas]\n\n## Semana 2: Aplicación y dominio\n\n[Repite la estructura con temas más avanzados]\n\n## Checkpoint final\n- [3 criterios para saber si ya domino el tema]\n\nReglas:\n- Sé específico con los tiempos (no digas \"revisa el PDF\", di \"revisa páginas 12-18 enfocándote en X\")\n- Cada día debe tener UN objetivo claro, no tres\n- Incluye al menos 2 días de práctica real (no solo lectura)"
  },
  {
    "titulo": "Plan express de 7 días (1 semana)",
    "texto": "Necesito un plan express de 7 días, 1 hora diaria, para tener una base sólida y operativa sobre el tema de estas fuentes.\n\nDevuélvelo en Markdown:\n\n# Plan Express: [Tema] en 7 días\n\nPara cada día (1-7):\n- **Minuto 0-15:** [lectura o audio específico]\n- **Minuto 15-45:** [actividad práctica con las fuentes]\n- **Minuto 45-60:** [síntesis y notas]\n- **Check del día:** [1 pregunta que debo poder responder]\n\nDía 7 debe ser un mini-proyecto que combine todo.\n\nPrioriza lo que me dé resultado práctico rápido. Deja la teoría profunda para después."
  }
];
export const EXAMENES: PromptItem[] = [
  {
    "titulo": "Examen de opción múltiple (20 preguntas)",
    "texto": "Genera un examen de 20 preguntas de opción múltiple basado ÚNICAMENTE en las fuentes de este cuaderno.\n\nFormato Markdown:\n\n# Examen: [Tema]\n\n## Instrucciones\n- 20 preguntas\n- 4 opciones por pregunta (A, B, C, D)\n- Solo 1 correcta\n- Dificultad mixta: 8 fáciles, 8 medias, 4 difíciles\n\n## Preguntas\n\n### 1. [Enunciado claro]\n- A) [Opción]\n- B) [Opción]\n- C) [Opción]\n- D) [Opción]\n\n[Repite para las 20]\n\n---\n\n## Hoja de respuestas y explicaciones\n\n### 1. Respuesta correcta: [letra]\n- **Explicación:** [por qué es correcta, citando la fuente]\n- **Por qué las otras fallan:** [1 línea por cada opción incorrecta]\n\nREGLA CRÍTICA: No me muestres las respuestas hasta que yo te diga \"muéstrame las respuestas\". Primero solo las preguntas."
  },
  {
    "titulo": "Examen de preguntas abiertas (casos prácticos)",
    "texto": "Genera un examen de 5 preguntas abiertas tipo caso práctico, basado en las fuentes.\n\nFormato Markdown:\n\n# Examen de Casos Prácticos\n\n## Caso 1: [Escenario realista de 3-4 líneas]\n**Pregunta:** [qué debe resolver o analizar]\n**Criterios de evaluación:**\n- [Criterio 1]\n- [Criterio 2]\n- [Criterio 3]\n\n[Repite para 5 casos]\n\n---\n\n## Rúbrica y respuestas modelo\n\n### Caso 1 - Respuesta modelo\n- **Puntos clave que debe incluir:** [lista]\n- **Errores comunes:** [qué evitar]\n- **Nivel esperado:** [qué distingue una respuesta buena de una excelente]\n\nREGLA: No muestres las respuestas hasta que yo diga \"muéstrame las respuestas\"."
  },
  {
    "titulo": "Examen de verdadero/falso con justificación",
    "texto": "Genera 15 afirmaciones basadas en las fuentes. Algunas son verdaderas, otras son falsas (con errores sutiles, no obvios).\n\nFormato Markdown:\n\n# Examen V/F\n\n| # | Afirmación | V/F | Justificación de la respuesta |\n|---|-----------|-----|-------------------------------|\n| 1 | [Afirmación] | [dejar en blanco] | [dejar en blanco] |\n\nLas afirmaciones falsas deben tener errores realistas (datos cambiados, conceptos mezclados, generalizaciones incorrectas).\n\n---\n\n## Respuestas\n\n| # | Afirmación | V/F | Justificación | Fuente |\n|---|-----------|-----|---------------|--------|\n| 1 | [Afirmación] | [V o F] | [por qué, en 1-2 líneas] | [cita] |\n\nREGLA: Entrega primero solo la tabla de preguntas (sin respuestas). Cuando yo diga \"corrige\", entrega la tabla completa con respuestas y justificaciones."
  },
  {
    "titulo": "Califica mi respuesta (autoevaluación)",
    "texto": "Voy a pegarte mi respuesta a una pregunta sobre las fuentes. Quiero que la califiques como un profesor riguroso.\n\nFormato de tu respuesta (Markdown):\n\n# Evaluación\n\n## Puntuación: [X/10]\n\n## Lo que hiciste bien\n- [Punto 1]\n- [Punto 2]\n\n## Lo que falta o está incorrecto\n- [Error 1]: [qué dice la fuente realmente]\n- [Error 2]: [qué dice la fuente realmente]\n\n## Conceptos que debes reforzar\n- [Concepto 1] → revisa [fuente específica]\n- [Concepto 2] → revisa [fuente específica]\n\n## Versión mejorada de tu respuesta\n[Reescribe mi respuesta incorporando lo que falta, en 1 párrafo]\n\nSé honesto. No me subas la nota por simpatía. Si está mal, dímelo."
  }
];
export const VEINTE: GrupoVeinte[] = [
  {
    "seccion": "Comprende y analiza",
    "items": [
      {
        "n": "01",
        "titulo": "Un resumen rápido de tus fuentes",
        "texto": "Crea un resumen conciso de los puntos clave de estas fuentes. Analiza los temas principales, los argumentos y las conclusiones presentadas."
      },
      {
        "n": "02",
        "titulo": "Una explicación para quien empieza",
        "texto": "Explícame los conceptos de estas fuentes como si fuera nuevo en el tema. Usa analogías simples, evita la jerga técnica y define cualquier término que yo necesite."
      },
      {
        "n": "03",
        "titulo": "Un análisis a fondo",
        "texto": "Haz un análisis profundo de los argumentos de estas fuentes. Identifica tesis, evidencia, suposiciones y conclusiones, y dime qué tan sólido es cada uno."
      },
      {
        "n": "04",
        "titulo": "Compara tus fuentes",
        "texto": "Compara y contrasta las diferentes perspectivas en estas fuentes. ¿En qué coinciden, en qué difieren y cuál está mejor sustentada?"
      }
    ]
  },
  {
    "seccion": "Estudio activo",
    "items": [
      {
        "n": "05",
        "titulo": "Apuntes de estudio",
        "texto": "Convierte este contenido en notas de estudio estructuradas con encabezados, bullet points, definiciones y ejemplos memorables."
      },
      {
        "n": "06",
        "titulo": "Tarjetas de estudio",
        "texto": "Genera 25 flashcards de alta calidad sobre este material, con una pregunta al frente y una respuesta concisa atrás."
      },
      {
        "n": "07",
        "titulo": "Cuestionario interactivo",
        "texto": "Crea un quiz progresivo de fácil a difícil basado únicamente en esta fuente. Hazme una pregunta a la vez, espera mi respuesta y califícame."
      },
      {
        "n": "08",
        "titulo": "Trucos para recordar",
        "texto": "Crea mnemotecnias, analogías y ganchos de memoria que me ayuden a retener las partes más importantes de este contenido."
      }
    ]
  },
  {
    "seccion": "Investigación y pensamiento crítico",
    "items": [
      {
        "n": "09",
        "titulo": "Extrae una cronología",
        "texto": "Organiza cronológicamente los eventos de estas fuentes. Identifica fechas y momentos clave y preséntalos como línea de tiempo con una línea de explicación por hito."
      },
      {
        "n": "10",
        "titulo": "Encuentra las citas clave",
        "texto": "Encuentra las citas más influyentes de estas fuentes. Incluye la cita exacta, quién la dice y su contexto."
      },
      {
        "n": "11",
        "titulo": "Detecta lagunas en la investigación",
        "texto": "Señala lo que falta en estas fuentes. Identifica áreas sin información, contradicciones y preguntas que quedaron abiertas."
      },
      {
        "n": "12",
        "titulo": "Debate los dos lados",
        "texto": "Presenta los mejores argumentos a favor y en contra de la tesis principal de estas fuentes. Mantén una postura neutral y analítica."
      }
    ]
  },
  {
    "seccion": "Aplicación práctica",
    "items": [
      {
        "n": "13",
        "titulo": "Conviértelo en un marco de trabajo",
        "texto": "Convierte este contenido en un framework accionable: pasos, plantillas y checklists que pueda aplicar esta misma semana."
      },
      {
        "n": "14",
        "titulo": "Reutiliza el contenido",
        "texto": "Transforma estas fuentes en otros formatos: 3 posts para redes, 1 correo corto y el esquema de una presentación de 5 slides."
      },
      {
        "n": "15",
        "titulo": "Entrevista con un experto",
        "texto": "Actúa como especialista en este tema. Te voy a entrevistar: responde mis preguntas basándote en las fuentes y cita de dónde sale cada respuesta."
      },
      {
        "n": "16",
        "titulo": "Resumen ejecutivo",
        "texto": "Escribe un resumen ejecutivo para un líder ocupado: contexto, hallazgos clave, riesgos y decisiones recomendadas. Máximo una página."
      }
    ]
  },
  {
    "seccion": "Creación y acción",
    "items": [
      {
        "n": "17",
        "titulo": "Crea un plan de lecciones",
        "texto": "Convierte estas notas en un plan de lecciones: sesiones con objetivo, tiempo estimado y orden de temas."
      },
      {
        "n": "18",
        "titulo": "Genera ideas",
        "texto": "Usa estas fuentes para proponer 10 enfoques o ideas nuevas que no haya considerado. Una línea de descripción y su impacto potencial por cada una."
      },
      {
        "n": "19",
        "titulo": "Simplifica para enseñar",
        "texto": "Prepárame para explicar este contenido a otras personas: las 3 ideas centrales, un ejemplo por idea y el error más común al contarlo."
      },
      {
        "n": "20",
        "titulo": "Arma un plan de acción",
        "texto": "Lleva este conocimiento a ejecución: un plan de acción con prioridades, próximos pasos y cómo sabré que funcionó."
      }
    ]
  }
];
