export interface TablaEjemplo {
  cabeceras: string[];
  filas: string[][];
}

export interface PromptEjemplo {
  id: string;
  titulo: string;
  texto: string;
}

export interface EjemploClaude {
  slug: string;
  segmento: string;
  titulo: string;
  descripcion: string;
  intro: string;
  caso: string;
  materialTitulo: string;
  materialTexto?: string;
  materialTabla?: TablaEjemplo;
  prompts: PromptEjemplo[];
  deberiasVer: string[];
  comprobaciones: string[];
  errorComun: string;
  cierre: string;
}

/** Todos los casos son inventados y están marcados así en cada página. Sin nombres, empresas ni cifras reales. */
export const EJEMPLOS_CLAUDE: EjemploClaude[] = [
  {
    slug: "emprendedor",
    segmento: "Para emprendedores",
    titulo: "Decidir qué promocionar con tus propias ventas",
    descripcion:
      "Un caso inventado de una emprendedora que le pide a Claude ordenar sus ventas del mes, sin que invente ni una cifra. Con el prompt para copiar.",
    intro:
      "Tenés las ventas del mes en una hoja y no sabés qué producto empujar esta semana. Claude puede ordenarlas en un minuto, pero solo sirve si le dejás claro que no invente ni una cifra.",
    caso: "Una emprendedora que vende velas artesanales por Instagram. El caso y los números son inventados.",
    materialTitulo: "El material, una hoja de ventas de noviembre",
    materialTabla: {
      cabeceras: ["Producto", "Unidades vendidas", "Precio en pesos"],
      filas: [
        ["Vela de lavanda", "42", "38.000"],
        ["Vela de cedro", "18", "38.000"],
        ["Vela de café", "31", "42.000"],
        ["Set de tres velas", "9", "105.000"],
      ],
    },
    prompts: [
      {
        id: "ventas",
        titulo: "El prompt",
        texto: `Situación. Soy emprendedora y vendo velas artesanales por Instagram. Esta es la hoja de ventas de noviembre, sin datos de clientes.

Tarea. Decime qué producto me conviene promocionar la próxima semana y por qué.

Material.
[pegá acá la tabla de ventas]

Formato. Una tabla con cada producto, las unidades, los ingresos que calculaste y la fila de mi tabla de la que sale cada dato. Después, tres frases con tu recomendación.

Límites. Usá solo las cifras de mi tabla. Si necesitás un dato que no está, como costos o márgenes, preguntamelo y no lo supongas. No prometas resultados de la promoción.`,
      },
    ],
    deberiasVer: [
      "Los ingresos por producto, que con esta tabla son 1.596.000 la lavanda, 684.000 el cedro, 1.302.000 el café y 945.000 el set de tres, para un total de 4.527.000.",
      "Que antes de recomendar te pregunte por los costos o márgenes, porque la tabla no los trae. Sin eso solo puede ordenar por ventas.",
      "Una recomendación corta que nombre la fila de la tabla de la que sale.",
    ],
    comprobaciones: [
      "Multiplicá las unidades por el precio de una fila y compará con lo que dice Claude.",
      "Sumá los ingresos de las cuatro filas y confirmá que dan el total.",
      "Buscá cualquier cifra que no esté en tu tabla, como porcentajes de crecimiento o comparaciones con otros meses. Si aparece, esa cifra no se usa.",
    ],
    errorComun:
      "Pedir la recomendación sin dar los costos. Sin márgenes, Claude solo puede ordenar por unidades o por ingresos, y lo que más vendés no siempre es lo que más te deja.",
    cierre:
      "Cuando tengas este patrón claro, el Paso 2 del kit te enseña a dejar tu hoja de ventas y tus instrucciones dentro de un proyecto, para no volver a pegar todo cada mes.",
  },
  {
    slug: "empleado",
    segmento: "Para empleados",
    titulo: "Sacar los compromisos de una reunión sin que Claude invente fechas",
    descripcion:
      "Un caso inventado de un analista que le pide a Claude los compromisos de un acta, con la regla de no completar lo que no está. Con el prompt para copiar.",
    intro:
      "Después de la reunión semanal alguien tiene que mandar la minuta. Claude la arma en un minuto, y el riesgo es que le ponga fecha o responsable a lo que nadie dijo.",
    caso: "Un analista de operaciones que escribe la minuta del comité semanal de despachos. El caso y el acta son inventados. Los nombres ya están cambiados por roles, como se explica en el Paso 0.",
    materialTitulo: "El material, un acta corta",
    materialTexto: `La coordinadora de bodega dice que el lunes llegó el sesenta por ciento de la mercancía y que el resto llega esta semana, sin día confirmado.
El jefe de transporte se compromete a reprogramar las rutas del jueves antes del miércoles al mediodía.
La analista de compras va a revisar el contrato con el proveedor de empaques y avisa.
Se acuerda que el reporte semanal se envía los viernes.`,
    prompts: [
      {
        id: "acta",
        titulo: "El prompt",
        texto: `Situación. Soy analista de operaciones y escribo la minuta del comité semanal de despachos. Los nombres ya están cambiados por roles.

Tarea. Sacá del acta los compromisos que quedaron.

Material.
[pegá acá el acta]

Formato. Una tabla con cuatro columnas. Compromiso, responsable, fecha límite y la frase del acta en la que te apoyás.

Límites. Si el acta no dice el responsable o la fecha, escribí exactamente, no está en el acta. No deduzcas fechas ni responsables. Si algo del acta es ambiguo, listalo aparte, debajo de la tabla.`,
      },
    ],
    deberiasVer: [
      "Tres compromisos. Reprogramar las rutas del jueves, con el jefe de transporte y antes del miércoles al mediodía. Revisar el contrato de empaques, con la analista de compras y sin fecha. Enviar el reporte semanal los viernes, sin responsable.",
      "En las celdas donde falta un dato, la frase no está en el acta, y no una fecha o un nombre inventado.",
      "La llegada del resto de la mercancía listada aparte como ambigua, porque dice esta semana y no un día.",
    ],
    comprobaciones: [
      "Buscá en el acta cada frase que Claude cita y confirmá que está escrita igual.",
      "Revisá que no haya convertido esta semana o pronto en una fecha concreta.",
      "Confirmá que cada responsable de la tabla dice lo mismo que el acta, y que ninguno salió de la imaginación de Claude.",
    ],
    errorComun:
      "Pegar el acta con nombres reales, cifras de contratos o datos de proveedores. Antes de pegar, cambiá los nombres por roles y revisá si tu empresa tiene política de IA, porque esa manda.",
    cierre:
      "Si este pedido lo hacés todas las semanas, el Paso 4 del kit lo convierte en una rutina escrita una vez, para que solo cambie el acta.",
  },
  {
    slug: "portafolio",
    segmento: "Para mejorar tu portafolio",
    titulo: "Mejorar un caso de tu portafolio sin inflar resultados",
    descripcion:
      "Un caso inventado de una profesional que reescribe un caso de portafolio con Claude sin que invente cifras. Con dos prompts para copiar.",
    intro:
      "Los casos de portafolio suelen quedar como una lista de tareas. Claude ayuda a contarlos como una decisión, pero no sabe qué lograste, y si no se lo decís lo inventa.",
    caso: "Una profesional de producto que quiere mejorar un caso sobre el flujo de registro de una aplicación. Las notas son inventadas y la empresa no existe.",
    materialTitulo: "El material, las notas del caso",
    materialTexto: `Rediseñé el flujo de registro de la app. Mucha gente lo abandonaba en el segundo paso. Hice cinco entrevistas con usuarios nuevos. Quité dos campos del formulario. Lo lanzamos en marzo con el equipo de ingeniería. No tengo la cifra final de abandono.`,
    prompts: [
      {
        id: "caso",
        titulo: "Primer prompt, reescribir el caso",
        texto: `Situación. Soy profesional de producto y quiero mejorar un caso de mi portafolio. Va a leerlo alguien que decide si me entrevista.

Tarea. Reescribí mis notas como un caso con cinco partes. Contexto, problema, qué hice yo, decisión y resultado.

Material.
[pegá acá tus notas del caso, sin datos confidenciales de la empresa]

Formato. Máximo trescientas palabras, en párrafos cortos y cada parte con su título.

Límites. Usá solo lo que está en mis notas. No agregues cifras, porcentajes ni adjetivos como exitoso. Si en las notas falta el resultado, escribí, dato por completar, y hacéme tres preguntas para completarlo. Separá lo que hice yo de lo que hizo el equipo.`,
      },
      {
        id: "lectura",
        titulo: "Segundo prompt, leerlo como quien decide",
        texto: `Leé el caso que acabás de escribir como alguien que decide si me entrevista. Listá las preguntas que haría y que el caso no responde. No inventes las respuestas, solo las preguntas.`,
      },
    ],
    deberiasVer: [
      "Un caso con cinco partes, donde Qué hice yo habla de las entrevistas y de quitar los campos, y lo del lanzamiento queda atribuido al equipo.",
      "En Resultado, la marca dato por completar, porque las notas dicen que no hay cifra final.",
      "Tres preguntas útiles, como cuánto abandono había antes, cuánto después y durante cuánto tiempo se midió.",
    ],
    comprobaciones: [
      "Buscá cada cifra y cada porcentaje del caso en tus notas. Si no está, se borra.",
      "Revisá que Qué hice yo no te atribuya lo que hizo el equipo.",
      "Mirá que no aparezcan adjetivos de éxito sin un dato que los respalde.",
      "Confirmá que tu empresa permite mostrar ese caso, antes de publicarlo.",
    ],
    errorComun:
      "Dejar que Claude complete el resultado para que el caso quede más fuerte. Una cifra inventada se cae con la primera pregunta de la entrevista.",
    cierre:
      "Si querés ver cómo quedaría el caso como página, pedile que lo arme como artefacto y revisalo antes de publicarlo. En la página de conectores y artefactos explico qué son y cómo los uso.",
  },
];
