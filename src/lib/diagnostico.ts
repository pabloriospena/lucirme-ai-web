// Destino del diagnóstico gratis según la página en la que está la persona.
// Páginas de profesionales y contenido -> diagnóstico de profesionales.
// Todo lo demás -> diagnóstico operativo de empresas.

const PROFESIONALES = [
  '/profesionales',
  '/servicios',
  '/educacion',
  '/recursos',
  '/rutas',
  '/ruta-product',
  '/atajos-ia',
  '/atajos-visuales',
  '/presentaciones-con-ia',
  '/curso-presentaciones',
];

export const DIAGNOSTICO_PROFESIONALES = '/servicios/producto#diagnostico-interactivo';
export const DIAGNOSTICO_EMPRESAS = '/empresas#diagnostico';

export function diagnosticoUrl(pathname: string): string {
  const ruta = pathname.replace(/\/+$/, '') || '/';
  const esProfesional = PROFESIONALES.some((p) => ruta === p || ruta.startsWith(p + '/'));
  return esProfesional ? DIAGNOSTICO_PROFESIONALES : DIAGNOSTICO_EMPRESAS;
}
