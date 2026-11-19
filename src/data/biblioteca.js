// Biblioteca de IA aplicada de LuciRMe AI.
//
// Cómo se publica un artículo:
// 1. Pablo lo revisa y lo aprueba.
// 2. Se pone borrador en false y se escriben publicado y actualizado con la fecha real (AAAA-MM-DD).
// 3. Se ejecuta npm run sitemap y se despliega.
// Los borradores solo se ven en desarrollo. En producción responden 404 y no entran al sitemap.
//
// Reglas de redacción (Reglas LuciRMe en Notion): voz de Pablo en primera persona, tuteando.
// Solo puntos, comas, signos de admiración e interrogación. Sin comillas, dos puntos, paréntesis ni guiones largos.
// Nada de casos, cifras ni resultados inventados. Si es un ejemplo, se dice que es ilustrativo.

export const TEMAS = {
  producto: "IA aplicada para Product Managers",
  automatizacion: "Automatizar tareas repetitivas",
  flujos: "Diseñar flujos de trabajo con IA",
  empresas: "Implementar IA en una empresa",
  herramientas: "Comparativas de herramientas",
  guias: "Guías prácticas y plantillas",
};

export const ARTICULOS = [
  {
    slug: "como-analizar-entrevistas-de-usuario-con-ia",
    titulo: "Cómo analizar entrevistas de usuario con IA sin que invente citas",
    descripcion:
      "Una regla para separar un resumen de un análisis cuando usas IA con tus entrevistas de usuario, y cómo comprobar que cada cita exista de verdad.",
    pregunta: "¿Cómo analizo entrevistas de usuario con IA sin que invente citas?",
    tema: "producto",
    borrador: true,
    publicado: null,
    actualizado: null,
    secciones: [
      {
        titulo: "Qué pasa cuando le pides a la IA que resuma tus entrevistas",
        parrafos: [
          "Le pasas la transcripción a Claude y te devuelve un resumen ordenado, con temas y conclusiones. Se lee bien.",
          "Un resumen te cuenta de qué se habló. Para decidir qué construir necesitas saber qué dijo la persona exactamente, y ahí el resumen se queda corto.",
        ],
      },
      {
        titulo: "La regla que uso para separar hallazgos de hipótesis",
        parrafos: [
          "Un hallazgo solo es hallazgo si tiene una cita textual de la persona entrevistada. Si no hay cita, lo llamo hipótesis.",
          "Con esa regla, cada afirmación de tu análisis cae en uno de dos grupos. Sabes cuáles puedes defender frente a tu equipo y cuáles todavía tienes que comprobar.",
        ],
      },
      {
        titulo: "Cómo pedírselo a Claude",
        parrafos: [
          "Dale la nota de la entrevista y pídele que, para cada tema, te devuelva la cita literal que lo respalda. Pídele también que marque como hipótesis todo lo que no tenga cita.",
          "Si tienes Notion conectado a Claude, puede leer la página de la entrevista directamente, sin que copies y pegues.",
        ],
      },
      {
        titulo: "Comprueba que cada cita exista de verdad",
        parrafos: [
          "Este paso no se salta. Busca cada cita en tu nota original. Si Claude inventó una, la regla no se cumplió y ese hallazgo vuelve a ser una hipótesis.",
          "Una cita que suena bien y no está en la transcripción te da una seguridad que no tienes.",
        ],
      },
      {
        titulo: "Cuántas entrevistas necesitas antes de decidir",
        parrafos: [
          "Ese número lo pones tú. Define antes de analizar cuántas personas, y de qué perfiles, tienen que respaldar una hipótesis con cita para que la des por confirmada.",
          "Una sola persona, por convincente que sea, no alcanza para decidir qué construir. Si hoy tienes una entrevista, entrevistar a más personas antes de construir es una decisión razonable. La decisión final también es tuya.",
        ],
      },
    ],
    recurso: {
      texto:
        "Mira el ejemplo resuelto con tres entrevistas y el prompt para usarlo con tu propia nota.",
      etiqueta: "Ver el ejemplo resuelto",
      href: "/ruta-product/paso-1/ejemplo-discovery",
    },
    relacionados: [
      { texto: "Ruta Product Management con IA", href: "/ruta-product" },
      { texto: "Acompañamiento 1-1 para Product Managers", href: "/servicios/producto" },
    ],
  },
];

export const publicados = () => ARTICULOS.filter((a) => !a.borrador && a.publicado);
