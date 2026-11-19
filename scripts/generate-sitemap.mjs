// Genera public/sitemap.xml con las páginas públicas e indexables.
// lastmod sale de la fecha del último commit que tocó el archivo de la página.
// Uso: npm run sitemap  (necesita el historial completo de git)
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const SITE = "https://lucirme.com";

// [ruta pública, archivo fuente]. No incluir páginas que redirijan, tengan noindex o sean privadas.
const PAGES = [
  ["/", "src/pages/index.astro"],
  ["/empresas", "src/pages/empresas.astro"],
  ["/profesionales", "src/pages/profesionales.astro"],
  ["/educacion", "src/pages/educacion.astro"],
  ["/sobre-pablo", "src/pages/sobre-pablo.astro"],
  ["/servicios/producto", "src/pages/servicios/producto.astro"],
  ["/empresas/claude-m", "src/pages/empresas/claude-m.astro"],
  ["/empresas/claude-l", "src/pages/empresas/claude-l.astro"],
  ["/pagina-comercial", "src/pages/pagina-comercial.astro"],
  ["/empresas/pagina-comercial", "src/pages/empresas/pagina-comercial.astro"],
  ["/soluciones/web-restaurantes", "src/pages/soluciones/web-restaurantes.astro"],
  ["/soluciones/web-veterinarios", "src/pages/soluciones/web-veterinarios.astro"],
  ["/curso-presentaciones", "src/pages/curso-presentaciones.astro"],
  ["/presentaciones-con-ia", "src/pages/presentaciones-con-ia.astro"],
  ["/bot-presentaciones", "src/pages/bot-presentaciones.astro"],
  ["/atajos-ia", "src/pages/atajos-ia.astro"],
  ["/atajos-visuales", "src/pages/recursos/atajos-visuales.astro"],
  ["/ruta-product", "src/pages/ruta-product/index.astro"],
  ["/ruta-product/paso-0", "src/pages/ruta-product/paso-0.astro"],
  ["/ruta-product/paso-0/intro", "src/pages/ruta-product/paso-0/intro.astro"],
  ["/ruta-product/paso-0/notion-jira", "src/pages/ruta-product/paso-0/notion-jira.astro"],
  ["/ruta-product/paso-0/posthog-claude", "src/pages/ruta-product/paso-0/posthog-claude.astro"],
  ["/ruta-product/paso-0/plantilla-conexion", "src/pages/ruta-product/paso-0/plantilla-conexion.astro"],
  ["/ruta-product/paso-1", "src/pages/ruta-product/paso-1.astro"],
  ["/ruta-product/paso-1/ejemplo-discovery", "src/pages/ruta-product/paso-1/ejemplo-discovery.astro"],
  ["/ruta-product/paso-2", "src/pages/ruta-product/paso-2.astro"],
  ["/recursos/prompteador", "src/pages/recursos/prompteador.astro"],
  ["/recursos/backlog-detox", "src/pages/recursos/backlog-detox.astro"],
  ["/recursos/shapeup-builder", "src/pages/recursos/shapeup-builder.astro"],
  ["/recursos/guia-notebooklm", "src/pages/recursos/guia-notebooklm.astro"],
  ["/recursos/guia-estudio-notebooklm", "src/pages/recursos/guia-estudio-notebooklm.astro"],
  ["/recursos/guia-20prompts-notebooklm", "src/pages/recursos/guia-20prompts-notebooklm.astro"],
  ["/recursos/guia-deepresearch", "src/pages/recursos/guia-deepresearch.astro"],
  ["/recursos/career-path-notebooklm", "src/pages/recursos/career-path-notebooklm.astro"],
  ["/recursos/reunion-claridad", "src/pages/recursos/reunion-claridad.astro"],
  ["/recursos/checklistpm-vol1", "src/pages/recursos/checklistpm-vol1.astro"],
  ["/recursos/ebook-pm", "src/pages/recursos/ebook-pm.astro"],
  ["/recursos/cv-con-ia", "src/pages/recursos/cv-con-ia.astro"],
  ["/recursos/crear-imagenes-ia", "src/pages/recursos/crear-imagenes-ia.astro"],
  ["/recursos/roadmap-builder", "src/pages/recursos/roadmap-builder.astro"],
  ["/recursos/ideador-producto", "src/pages/recursos/ideador-producto.astro"],
];

const lastmod = (file) => {
  const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", file], { encoding: "utf8" }).trim();
  if (!out) throw new Error(`Sin historial de git para ${file}`);
  return out;
};

const urls = PAGES.map(([path, file]) => `  <url>
    <loc>${SITE}${path}</loc>
    <lastmod>${lastmod(file)}</lastmod>
  </url>`).join("\n");

writeFileSync(
  "public/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
);
console.log(`sitemap.xml generado con ${PAGES.length} URLs`);
