import { clerkMiddleware } from "@clerk/astro/server";

const REDIRECTS = {
  "/soluciones/empresas": "/empresas",
  "/soluciones/profesionales": "/profesionales",
  "/soluciones/startups": "/empresas",
  "/soluciones/tecnologia+tunegocio": "/empresas",
  "/soluciones/web-veterinarios": "/empresas#pagina-comercial",
  "/servicios/producto": "/profesionales",
  "/servicios": "/",
  "/recursos": "/educacion",
  "/rutas": "/educacion",
  "/content/sobremi": "/sobre-pablo",
};

export const onRequest = (context, next) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  if (REDIRECTS[pathname]) {
    return context.redirect(REDIRECTS[pathname], 301);
  }

  const publishableKey = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = import.meta.env.CLERK_SECRET_KEY || process.env.CLERK_SECRET_KEY;
  
  if (!publishableKey && !secretKey) {
    return next();
  }
  
  return clerkMiddleware()(context, next);
};