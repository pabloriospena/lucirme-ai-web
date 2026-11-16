export interface BloqueGuia {
  titulo: string;
  texto: string;
  puntos?: string[];
}

export interface PromptGuia {
  id: string;
  titulo: string;
  cuandoUsarlo: string;
  texto: string;
}

export interface GuiaRuta {
  slug: string;
  paso: string;
  pasoLabel: string;
  etiqueta: string;
  titulo: string;
  intro: string;
  regla: string;
  bloques: BloqueGuia[];
  prompts: PromptGuia[];
  checklistTitulo: string;
  checklist: string[];
  avisoSinEjemplo: string;
  siguiente: { texto: string; href: string };
}

export const GUIA_LANZAMIENTO: GuiaRuta = {
  slug: "guia-lanzamiento",
  paso: "3",
  pasoLabel: "Paso 3 · Lanzamiento",
  etiqueta: "Lanzamiento y rollout",
  titulo: "Decide si lanzas antes del día de lanzar",
  intro:
    "Un lanzamiento se decide antes de que exista la fecha. Esta guía te da un criterio de salida que se puede comprobar, un plan de lanzamiento por etapas y tres mensajes para tres audiencias distintas. Todo sale de la página del feature que ya tienes en Notion.",
  regla:
    "Un criterio de salida solo cuenta si tiene una forma de comprobarse. Si no se puede medir ni mirar, es un deseo y va a la lista de pendientes, no a la lista de condiciones.",
  bloques: [
    {
      titulo: "Criterios de salida en cuatro bloques",
      texto:
        "Antes de lanzar, el equipo debe poder responder sí, no o espera con evidencia. Estos cuatro bloques cubren lo que casi siempre se olvida.",
      puntos: [
        "El producto funciona. Los casos críticos están probados y sabes cuáles quedaron fuera.",
        "Las personas están listas. Soporte, ventas y quien atiende al usuario saben qué cambió y qué responder.",
        "La medición está lista. Los eventos que van a decir si funcionó ya existen y se vieron llegar a PostHog.",
        "Hay plan de reversa. Sabes quién decide volver atrás, con qué señal y cómo se hace.",
      ],
    },
    {
      titulo: "Lanzar por etapas",
      texto:
        "Lanzar a todos de una vez deja sin margen. Una secuencia corta baja el riesgo sin frenar al equipo.",
      puntos: [
        "Interno. Lo usa el equipo y se corrigen lo evidente. Se mira que los eventos lleguen.",
        "Grupo pequeño. Unas pocas cuentas o usuarios que aceptaron probarlo. Se mira que hagan la acción principal sin ayuda.",
        "Todos. Solo si las dos etapas anteriores cumplieron lo que se definió antes de empezar.",
      ],
    },
    {
      titulo: "Comunicar a tres audiencias",
      texto:
        "El mismo cambio se cuenta distinto según quién lo lee. Pide tres versiones y revisa que ninguna prometa algo que el producto todavía no hace.",
      puntos: [
        "Usuarios. Qué puedes hacer ahora y qué cambia en tu día a día.",
        "Equipo interno. Qué cambió, qué responder y a quién escalar.",
        "Stakeholders. Qué se lanzó, cómo sabremos si funcionó y cuándo lo revisamos.",
      ],
    },
  ],
  prompts: [
    {
      id: "prompt-3-1",
      titulo: "Criterios de salida desde la página del feature",
      cuandoUsarlo: "Antes de fijar fecha. Conecta Notion como en el Paso 0.",
      texto: `Lee la página de Notion [título o enlace del feature]. Vamos a decidir si lanzarlo.
Devuelve, sin inventar nada:
1. Criterios de salida agrupados en cuatro bloques: el producto funciona, las personas están listas, la medición está lista y hay plan de reversa.
2. Para cada criterio: cómo se comprueba, quién lo comprueba y el umbral que lo da por cumplido.
3. Si un criterio no tiene forma de comprobarse con lo que dice la página, no lo pongas en la lista. Ponlo en una sección aparte llamada Pendientes por definir y di qué falta saber.
4. Una línea final con lo que, según la página, todavía impide decir sí.
No des fechas ni porcentajes que no estén en la página. Si falta un número, pregúntamelo.`,
    },
    {
      id: "prompt-3-2",
      titulo: "Plan de lanzamiento por etapas",
      cuandoUsarlo: "Cuando ya tengas los criterios de salida.",
      texto: `Con los criterios de salida que acabamos de definir, arma un plan de lanzamiento en tres etapas: interno, grupo pequeño y todos.
Para cada etapa devuelve:
- Quién entra y cómo se elige.
- Qué mirar y dónde mirarlo, con el nombre de los eventos de PostHog solo si los conozco. Si no, escribe evento por definir.
- La señal que permite pasar a la siguiente etapa.
- La señal que obliga a parar o volver atrás.
Marca como supuesto cualquier cosa que no venga de la página del feature ni de lo que te dije.`,
    },
    {
      id: "prompt-3-3",
      titulo: "Tres mensajes de lanzamiento",
      cuandoUsarlo: "Cuando la etapa de grupo pequeño cumplió lo definido.",
      texto: `Escribe tres mensajes sobre este lanzamiento, a partir de la página de Notion [título o enlace].
1. Para usuarios. Qué pueden hacer ahora y qué cambia para ellos. Sin frases de marketing.
2. Para el equipo interno. Qué cambió, qué preguntas van a llegar y a quién escalar.
3. Para stakeholders. Qué se lanzó, cómo sabremos si funcionó y cuándo lo revisamos.
Reglas. No prometas nada que la página no confirme. Si un dato falta, déjalo entre corchetes para que yo lo complete. Cada mensaje debe poder leerse en menos de un minuto.`,
    },
  ],
  checklistTitulo: "Lista de decisión antes de lanzar",
  checklist: [
    "Cada criterio de salida tiene una forma de comprobarse y alguien responsable.",
    "Los eventos que medirán el resultado llegan a PostHog desde la etapa interna.",
    "Soporte y quien atiende al usuario leyeron el mensaje interno antes del lanzamiento.",
    "Está escrito quién decide volver atrás y con qué señal.",
    "Los mensajes no prometen nada que el producto todavía no hace.",
    "Está fijada la fecha de revisión de la adopción, que es el Paso 4.",
  ],
  avisoSinEjemplo:
    "Esta guía es un método. Todavía no tiene un ejemplo con datos reales y no voy a inventar uno. Lo agrego cuando tenga un lanzamiento que pueda mostrar con permiso.",
  siguiente: { texto: "Siguiente, Paso 4 · Adopción", href: "/ruta-product/paso-4" },
};

export const GUIA_ADOPCION: GuiaRuta = {
  slug: "guia-adopcion",
  paso: "4",
  pasoLabel: "Paso 4 · Adopción",
  etiqueta: "Analítica y retención",
  titulo: "Mide si lo usan y decide qué cambiar",
  intro:
    "Lanzar no es el final. Esta guía te ayuda a definir qué significa que la gente adopte un feature, a leer los datos de PostHog con Claude sin confundir dato con hipótesis y a salir con una decisión sobre qué mantener, cambiar o retirar.",
  regla:
    "Adopción no es que entren a la página. Es que la persona haga la acción que justifica el feature y la repita. Una visita sin esa acción no cuenta.",
  bloques: [
    {
      titulo: "Define la acción clave",
      texto:
        "Antes de mirar números, escribe qué tiene que hacer alguien para decir que el feature le sirvió. Una sola acción, con nombre de evento.",
      puntos: [
        "La acción que justifica el feature, no la que es más fácil de medir.",
        "La ventana de tiempo en la que esperas verla, por ejemplo la primera semana.",
        "Quién cuenta. Excluye tus pruebas, a tu equipo y los envíos automáticos.",
      ],
    },
    {
      titulo: "Cuatro números que alcanzan para empezar",
      texto:
        "No necesitas un tablero grande. Con estos cuatro puedes ver si hay adopción o solo curiosidad.",
      puntos: [
        "Quiénes llegaron al feature.",
        "Quiénes hicieron la acción clave por primera vez.",
        "Quiénes la repitieron en la ventana que definiste.",
        "Quiénes volvieron después de esa ventana.",
      ],
    },
    {
      titulo: "Separa el dato de la hipótesis",
      texto:
        "Un número dice qué pasó, no por qué. Lo que explica el porqué es una hipótesis y se prueba con quien usa o dejó de usar el feature.",
      puntos: [
        "Dato. Lo que PostHog devolvió, con el filtro usado.",
        "Hipótesis. Una explicación posible, marcada como tal y con la pregunta que la confirmaría.",
        "Decisión. Mantener, cambiar o retirar, con la evidencia que la respalda.",
      ],
    },
  ],
  prompts: [
    {
      id: "prompt-4-1",
      titulo: "Definir la acción clave y los eventos",
      cuandoUsarlo: "Antes o durante el lanzamiento, para que la medición exista desde el primer día.",
      texto: `Lee la página de Notion [título o enlace del feature]. Quiero definir cómo medir su adopción.
Devuelve:
1. La acción clave que, según la página, justifica el feature. Una sola.
2. El nombre sugerido del evento para esa acción y los eventos de apoyo que harían falta, como llegar al feature y repetir la acción.
3. La ventana de tiempo en la que debería verse y por qué, solo si la página lo permite. Si no, pregúntamela.
4. Qué eventos ya existen en PostHog. No supongas que existen. Si no puedes comprobarlo, escribe por verificar.
No inventes metas ni porcentajes.`,
    },
    {
      id: "prompt-4-2",
      titulo: "Leer los datos de adopción en PostHog",
      cuandoUsarlo: "Pasada la ventana de tiempo definida. Conecta PostHog como en el Paso 0.",
      texto: `Con PostHog conectado, consulta la adopción del feature [nombre] en los últimos [número] días.
Usa siempre este filtro y dime cuál aplicaste: [tu filtro, por ejemplo host, sin bots, sin correos del equipo].
Devuelve cuatro números. Quiénes llegaron, quiénes hicieron [evento de la acción clave] por primera vez, quiénes la repitieron en [ventana] y quiénes volvieron después.
Después separa tu respuesta en dos partes. Datos, solo lo que devolvió PostHog. Hipótesis, explicaciones posibles marcadas como hipótesis, cada una con la pregunta que haría falta para confirmarla.
Si el número de personas es muy bajo para sacar una conclusión, dilo y no concluyas.`,
    },
    {
      id: "prompt-4-3",
      titulo: "Decidir qué mantener, cambiar o retirar",
      cuandoUsarlo: "Cuando tengas los datos y al menos algunas conversaciones con quien lo usó.",
      texto: `Con los datos de adopción de arriba y las notas de conversación de Notion [título o enlace], propón una decisión sobre el feature: mantener, cambiar o retirar.
Para la decisión devuelve:
1. La evidencia que la respalda. Cada punto con su fuente, ya sea dato de PostHog o cita textual de una nota.
2. Lo que sigue siendo hipótesis y no se debe presentar como hecho.
3. Cinco preguntas para hacer a personas que lo usaron y a personas que dejaron de usarlo.
4. Si la evidencia no alcanza para decidir, dilo y propón qué falta recoger antes.`,
    },
  ],
  checklistTitulo: "Lista para revisar la adopción",
  checklist: [
    "Hay una sola acción clave escrita, con su evento y su ventana de tiempo.",
    "El filtro de personas que cuentan está escrito y se usa igual cada vez.",
    "Los cuatro números salieron de PostHog y no de una estimación.",
    "Cada explicación está marcada como hipótesis y tiene su pregunta de confirmación.",
    "La decisión de mantener, cambiar o retirar cita su evidencia.",
    "Lo aprendido vuelve al Paso 1 como nuevo problema para investigar.",
  ],
  avisoSinEjemplo:
    "Esta guía es un método. Todavía no tiene un ejemplo con datos reales y no voy a inventar uno. Lo agrego cuando tenga una adopción medida que pueda mostrar con permiso.",
  siguiente: { texto: "Volver al Paso 1 · Discovery", href: "/ruta-product/paso-1" },
};
