// Diagnóstico de entrada de Estud-IA, nivel intermedio, clase 1 (diapositiva "¿Qué tanto manejas hoy?").
// Cada persona responde 1, 2 o 3 por concepto. Anónimo.
export const CONCEPTOS = [
  'Python: funciones, listas y diccionarios',
  'Leer, explorar y limpiar datos',
  'Entrenar y evaluar un modelo',
  'Redes neuronales: capas y pesos',
  'Usar un modelo ya entrenado, de texto o imagen',
  'Colab y GitHub',
] as const;

export const NIVELES = [
  { valor: 1, texto: 'Nunca lo he hecho' },
  { valor: 2, texto: 'Tengo algo de experiencia' },
  { valor: 3, texto: 'Lo manejo con soltura' },
] as const;

export const claveDiagnostico = (sesion: string) => `estudia:${sesion}:diagnostico`;
