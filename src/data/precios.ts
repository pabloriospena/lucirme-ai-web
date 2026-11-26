// Fuente única de precios de productos digitales que muestra la web (decisión de Pablo, 26 nov 2026).
// Cada valor se lee de Reglas LuciRMe sección 3 o de Hotmart. No se escribe a mano en ningún texto.
// Los precios de mentorías, consultorías y B2B no van en la web.
// Si un recurso de pago no tiene precio aquí, la web muestra De pago sin cifra. No se inventa ninguno.

export interface Precio {
  valor: number;
  moneda: "USD";
  fuente: "Reglas sección 3" | "Hotmart";
}

export const PRECIOS: Record<string, Precio> = {
  // Paso 0, plantilla de conexión completa de la Ruta Product (Reglas sección 3).
  "ruta-product-paso-0": { valor: 17, moneda: "USD", fuente: "Reglas sección 3" },
};

export const textoPrecio = (clave?: string) => {
  const p = clave ? PRECIOS[clave] : undefined;
  return p ? `${p.valor} ${p.moneda}` : undefined;
};
