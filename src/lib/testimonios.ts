export interface TestimonioItem {
  nombre: string;
  rol: string;
  quote: string;
  solucion: string;
  metrica?: string;
  categoria: "empresas" | "mentorias";
}

export const testimonios: TestimonioItem[] = [
  // --- CASOS EMPRESAS ---
  {
    nombre: "Almamotor",
    rol: "Sector Automotriz · Equipo Administrativo",
    quote: "Nos encantó la metodología y la manera de enseñar. Nos diste claridad práctica para aplicar lo aprendido de inmediato en el equipo.",
    solucion: "Taller de inmersión + Ciclo de autonomía",
    metrica: "+15% tiempo disponible",
    categoria: "empresas",
  },
  {
    nombre: "InterobrasER",
    rol: "Construcción & Infraestructura · Operaciones",
    quote: "Un taller productivo y muy necesario. El equipo entendió la situación operativa y vio los beneficios reales de aplicar estos cambios.",
    solucion: "Taller de inmersión + Ciclo de autonomía",
    metrica: "+30% eficiencia operativa",
    categoria: "empresas",
  },
  {
    nombre: "Startup B2B",
    rol: "Equipo de Producto & Tech (5 personas)",
    quote: "Redujimos de 12 a 4 días el ciclo de decisión de features. Sin contratar más PMs ni sumar complejidad innecesaria.",
    solucion: "Taller de inmersión + Ciclo de autonomía",
    metrica: "12 → 4 días optimizados",
    categoria: "empresas",
  },
  {
    nombre: "Empresa de Servicios B2B",
    rol: "Operaciones & RRHH (50+ colaboradores)",
    quote: "Eliminamos 3 aprobaciones manuales en onboarding. El margen de error humano se redujo en un 80%.",
    solucion: "Taller de inmersión + Ciclo de autonomía",
    metrica: "-80% error humano",
    categoria: "empresas",
  },
  {
    nombre: "Fundación Universitaria La Chinca",
    rol: "Equipo Directivo & Administrativo",
    quote: "Excelente taller práctico con el equipo. Nos dio claridad inmediata para ordenar procesos internos y aplicar cambios que se sostienen.",
    solucion: "Taller de inmersión",
    categoria: "empresas",
  },
  {
    nombre: "Agencia de Diseño & Producto",
    rol: "Operaciones & Gestión de Proyectos",
    quote: "Automatizamos la entrega y el empaquetado de assets. 4 horas ahorradas por cada proyecto entregado al cliente.",
    solucion: "Ciclo de autonomía",
    metrica: "4h ahorradas/proyecto",
    categoria: "empresas",
  },

  // --- CASOS MENTORÍAS 1-1 / PROFESIONALES ---
  {
    nombre: "Administrador Anónimo",
    rol: "Operaciones & Finanzas B2B",
    quote: "Recuperé 7h/semana automatizando reportes. Ahora enfoco ese tiempo en clientes que sí pagan.",
    solucion: "Sesión de enfoque + Guía personalizada",
    metrica: "7h/semana recuperadas",
    categoria: "mentorias",
  },
  {
    nombre: "María Camila B.",
    rol: "Product Manager",
    quote: "Mi objetivo no es usar IA por moda, es dejar de apagar incendios y tener una visión más tranquila y estratégica de mi pipeline.",
    solucion: "Sesión de enfoque + Estructura de Automatización",
    categoria: "mentorias",
  },
  {
    nombre: "José Madriz",
    rol: "Data Analytics & BI",
    quote: "LucirMe me dio el 'chip' para dejar de quebrarme la cabeza por algo que no es mío y empezar a sistematizar soluciones.",
    solucion: "Sesión de enfoque + Guía personalizada",
    categoria: "mentorias",
  },
  {
    nombre: "David M. Muñoz",
    rol: "Líder de Desarrollo & Tech Lead",
    quote: "Pude validar el camino para mi cliente y las iniciativas de IA que estamos implementando. Fue justo lo que necesitaba para aterrizar la estrategia.",
    solucion: "Sesión de enfoque + Plan de ejecución estratégico",
    categoria: "mentorias",
  },
  {
    nombre: "Cecilia Morete",
    rol: "Profesional Independiente",
    quote: "Qué felicidad ser parte de este proceso. Ahora tengo las herramientas organizadas y la claridad para hacer las preguntas correctas y avanzar.",
    solucion: "Acompañamiento individual",
    categoria: "mentorias",
  },
  {
    nombre: "Melody Abele",
    rol: "Customer Experience · Melfa CX",
    quote: "Gracias a tus herramientas y devoluciones, mi proyecto hoy tiene mucho más sentido, un norte claro y gran potencial. Aprendizaje real.",
    solucion: "Sesión de enfoque + Estructura de Automatización",
    categoria: "mentorias",
  },
  {
    nombre: "Consultor Tech",
    rol: "Consultoría y Soluciones B2B",
    quote: "Sistematicé mi propuesta de valor. El tiempo de onboarding de nuevos clientes bajó a la mitad.",
    solucion: "Sesión de enfoque",
    metrica: "-50% tiempo onboarding",
    categoria: "mentorias",
  },
];
