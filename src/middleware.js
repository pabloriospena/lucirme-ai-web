import { clerkMiddleware } from "@clerk/astro/server";

const REDIRECTS = {
  "/soluciones/empresas": "/empresas",
  "/soluciones/profesionales": "/profesionales",
  "/soluciones/startups": "/empresas",
  "/soluciones/tecnologia+tunegocio": "/empresas",
  "/profesionales/product-managers": "/profesionales#product-managers",
  "/servicios": "/",
  "/rutas": "/recursos",
  "/educacion": "/recursos",
  "/atajos-ia": "/recursos/atajos-ia",
  "/content/sobremi": "/sobre-pablo",
  "/forms/pre-taller": "/",
  "/recursos/preventa-vol2": "/recursos",
};

// Rutas con contenido de clientes, talleres o respuestas de formularios: no deben indexarse.
const PRIVATE_PREFIXES = [
  "/soluciones-personalizadas/",
  "/propuestas/",
  "/presentaciones/",
  "/estudia-ia-basico/",
  "/estudia-ia-intermedio/",
  "/forms/",
  "/api/",
  // Planes y páginas comerciales anteriores. Se conservan, pero sin indexar (decisión de Pablo, 27 nov 2026).
  "/empresas/",
  "/soluciones/",
  "/servicios/",
  "/content/",
];

const PRIVATE_EXACT = [
  "/propuesta",
  "/educacion",
  "/pagina-comercial",
  "/curso-presentaciones",
  "/presentaciones-con-ia",
  "/bot-presentaciones",
];

const isPrivate = (pathname) =>
  PRIVATE_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
  PRIVATE_EXACT.includes(pathname);

const withRobotsHeader = async (pathname, run) => {
  const response = await run();
  if (response && isPrivate(pathname)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  return response;
};

export const onRequest = (context, next) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  if (REDIRECTS[pathname]) {
    // Conserva los UTM de los enlaces de redes al redirigir.
    const destino = REDIRECTS[pathname];
    const [ruta, ancla] = destino.split("#");
    return context.redirect(ruta + url.search + (ancla ? "#" + ancla : ""), 301);
  }

  const publishableKey = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = import.meta.env.CLERK_SECRET_KEY || process.env.CLERK_SECRET_KEY;

  if (!publishableKey && !secretKey) {
    return withRobotsHeader(pathname, () => next());
  }

  return withRobotsHeader(pathname, () => clerkMiddleware()(context, next));
};
