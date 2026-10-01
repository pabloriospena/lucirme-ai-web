export interface BottleneckDiagnosisInput {
  proceso: string;
  frecuencia: string;
  tiempo: string;
  personas: string;
  impacto: string;
  esfuerzo: string; // viabilidad
  name?: string;
  email?: string;
  empresa?: string;
  tamano?: string;
  industria?: string;
  pais?: string;
  ciudad?: string;
}

export interface BottleneckDiagnosisResult {
  proceso: string;
  frecuencia: string;
  tiempo: string;
  personas: string;
  impacto: string;
  esfuerzo: string;
  weeklyHours: number;
  prioridad: 'Alta' | 'Media';
  prioridadBadge: string;
  justificacion: string;
  recomendacion: string;
  empresaTag: string;
  empresa: string;
  name: string;
  email: string;
  tamano: string;
  industria: string;
  pais: string;
  ciudad: string;
}

export function calculateBottleneckDiagnosis(input: BottleneckDiagnosisInput): BottleneckDiagnosisResult {
  const proceso = input.proceso || 'Reportes y consolidación de información';
  const frecuencia = input.frecuencia || 'Todos los días';
  const tiempo = input.tiempo || '1–2 horas';
  const personas = input.personas || '2 a 4 personas';
  const impacto = input.impacto || 'Afecta al cliente';
  const esfuerzo = input.esfuerzo || 'Moderado';

  const name = input.name || '';
  const email = input.email || '';
  const empresa = input.empresa || 'Mi Empresa';
  const tamano = input.tamano || '11-50 personas';
  const industria = input.industria || 'Tecnología/SaaS';
  const pais = input.pais || 'Colombia';
  const ciudad = input.ciudad || 'Bogotá';

  // Multipliers
  let freqMultiplier = 5;
  if (frecuencia.includes('Varias veces al día')) freqMultiplier = 15;
  else if (frecuencia.includes('Todos los días')) freqMultiplier = 5;
  else if (frecuencia.includes('Varias veces por semana')) freqMultiplier = 3;
  else if (frecuencia.includes('Una vez por semana')) freqMultiplier = 1;
  else if (frecuencia.includes('Algunas veces al mes')) freqMultiplier = 0.5;

  let timeValue = 1.5;
  if (tiempo.includes('Menos de 15 minutos')) timeValue = 0.2;
  else if (tiempo.includes('15–30 minutos')) timeValue = 0.4;
  else if (tiempo.includes('30–60 minutos')) timeValue = 0.75;
  else if (tiempo.includes('1–2 horas')) timeValue = 1.5;
  else if (tiempo.includes('Más de 2 horas')) timeValue = 2.5;

  let personsCount = 2;
  if (personas.includes('1 persona')) personsCount = 1;
  else if (personas.includes('2 a 4 personas')) personsCount = 2.5;
  else if (personas.includes('4 a 5 personas')) personsCount = 4.5;
  else if (personas.includes('Más de 5 personas')) personsCount = 6;

  const weeklyHours = Math.round(freqMultiplier * timeValue * personsCount * 10) / 10;

  let prioridad: 'Alta' | 'Media' = 'Media';
  let prioridadBadge = 'P2 Recomendado · ROI Moderado';
  let justificacion = `Este proceso genera una fuga estimada de ~${weeklyHours} horas/semana. Recomendamos simplificar el flujo y evaluar automatización.`;
  let recomendacion = 'Realizar un taller de inmersión para identificar cuellos de botella secundarios y simplificar el flujo.';

  if (weeklyHours >= 12 || impacto.includes('ingresos') || impacto.includes('varios') || impacto.includes('cliente')) {
    prioridad = 'Alta';
    prioridadBadge = 'P1 Urgente · Alto ROI Inmediato';
    justificacion = `Este proceso merece ser intervenido pronto porque genera una fuga aproximada de ~${weeklyHours} horas/semana combinando alta recurrencia e impacto directo en la operación.`;
    recomendacion = 'Agendar conversación estratégica de 30 minutos con Pablo Ríos para definir una intervención prioritaria.';
  }

  const empresaTag = `${empresa} · ${industria} (${ciudad}, ${pais})`;

  return {
    proceso,
    frecuencia,
    tiempo,
    personas,
    impacto,
    esfuerzo,
    weeklyHours,
    prioridad,
    prioridadBadge,
    justificacion,
    recomendacion,
    empresaTag,
    empresa,
    name,
    email,
    tamano,
    industria,
    pais,
    ciudad,
  };
}
