// Poses del personaje que van de fondo en el hero de Inicio (saludando) y de /clases (presentando).
// Decisión de Pablo del 27 nov 2026: solo van ahí, decorativas, sin imágenes en el resto de páginas.
//
// Diseño entrega los PNG recortados (tarea en Notion). Cuando estén en public/personaje/, se escribe aquí su ruta.
// Mientras una pose no tenga ruta, el hero se ve completo sin imagen.
export const POSES: { saludando?: string; presentando?: string } = {
  saludando: "/personaje/saludando.png",
  presentando: "/personaje/presentando.png",
};
