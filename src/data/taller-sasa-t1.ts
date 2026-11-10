// Respuestas originales de la actividad en vivo del taller de Sasa Consultoría (lunes 9 de nov 2026).
// Exportadas tal cual de Upstash (taller:sasa-t1:dolores y :uso). No se editan.
// La agrupación es la que se proyectó en el taller (taller:sasa-t1:agrupacion).

export interface DolorCrudo {
  id: string;
  tarea: string;
  rol: string;
  nombre?: string;
  horas_semana: number | null;
  frecuencia: string | null;
  procedimiento: string | null;
  estructurado: string | null;
  origen: string;
  creado: string;
}

export interface UsoCrudo {
  id: string;
  herramientas: string[];
  para_que: string;
  frecuencia: string;
  rol: string;
  creado: string;
}

export interface GrupoSasa {
  nombre: string;
  dolor_de_fondo: string;
  ids: string[];
}

export const dolores: DolorCrudo[] = [
  {"id":"0acad228","tarea":"Informes, auditoría de bolsa","rol":"Servicios administrados","nombre":"Sergio","horas_semana":5,"frecuencia":"mensual","procedimiento":"no","estructurado":"si","origen":"taller","creado":"2026-11-09T20:12:52.221Z"},
  {"id":"1906f0e3","tarea":"Definir un plan de sostenibilidad para la empresa","rol":"Gerencia","nombre":"Sandra","horas_semana":10,"frecuencia":"semanal","procedimiento":"parcial","estructurado":"no","origen":"taller","creado":"2026-11-09T20:13:45.524Z"},
  {"id":"6685529d","tarea":"La solución de bugs","rol":"Tecnología y desarrollo","nombre":"Juan Diego","horas_semana":8,"frecuencia":"semanal","procedimiento":"no","estructurado":"no","origen":"taller","creado":"2026-11-09T20:13:46.118Z"},
  {"id":"bbe9aada","tarea":"El empalme con proyectos o instancias que vienen en curso","rol":"Tecnología y desarrollo","nombre":"Juan Diego","horas_semana":16,"frecuencia":"mensual","procedimiento":"no","estructurado":"si","origen":"taller","creado":"2026-11-09T20:13:46.123Z"},
  {"id":"fafb49e2","tarea":"cambiar o editar archivos, arreglar y agregar archivos del drive.","rol":"Administración","nombre":"CLARA MONSALVE","horas_semana":3,"frecuencia":"semanal","procedimiento":"no","estructurado":"no","origen":"taller","creado":"2026-11-09T20:13:52.781Z"},
  {"id":"3ad7d7e8","tarea":"Gestión de varios proyectos en simultaneo, organización y optimización de agenda /tiempos. Actualización de pendientes de la semana en cada uno de ellos.","rol":"Proyectos y consultoría","nombre":"Susana","horas_semana":2,"frecuencia":"semanal","procedimiento":"si","estructurado":"si","origen":"taller","creado":"2026-11-09T20:16:03.588Z"},
  {"id":"030ffe8d","tarea":"Revisión de datos en excel","rol":"Gerencia","nombre":"Diego","horas_semana":10,"frecuencia":"diaria","procedimiento":"no","estructurado":"no","origen":"taller","creado":"2026-11-09T20:16:11.447Z"},
  {"id":"72b53833","tarea":"Solucionar problemas que no hay mucho contexto","rol":"Tecnología y desarrollo","nombre":"Jhon Edinson Mantilla","horas_semana":4,"frecuencia":"semanal","procedimiento":"parcial","estructurado":"no","origen":"taller","creado":"2026-11-09T20:19:24.127Z"},
  {"id":"1457d7ab","tarea":"Solucionar problemas de interfaz grafica","rol":"Tecnología y desarrollo","nombre":"Jhon Edinson Mantilla","horas_semana":3,"frecuencia":"mensual","procedimiento":"no","estructurado":"no","origen":"taller","creado":"2026-11-09T20:19:24.134Z"},
  {"id":"eb29b082","tarea":"Solucionar problemas de las instancias enbackend","rol":"Tecnología y desarrollo","nombre":"Jhon Edinson Mantilla","horas_semana":3,"frecuencia":"diaria","procedimiento":"parcial","estructurado":"no","origen":"taller","creado":"2026-11-09T20:19:24.141Z"},
  {"id":"2cf576b3","tarea":"Cronogramas","rol":"Proyectos y consultoría","horas_semana":8,"frecuencia":"mensual","procedimiento":"parcial","estructurado":"si","origen":"taller","creado":"2026-11-09T20:19:46.957Z"},
  {"id":"6a1cf04f","tarea":"Estimaciones","rol":"Proyectos y consultoría","horas_semana":8,"frecuencia":"mensual","procedimiento":null,"estructurado":null,"origen":"taller","creado":"2026-11-09T20:19:46.962Z"},
  {"id":"9d7e3ba9","tarea":"Análisis de procesos existentes","rol":"Soporte","nombre":"Fabian","horas_semana":15,"frecuencia":"semanal","procedimiento":"parcial","estructurado":"si","origen":"taller","creado":"2026-11-09T20:33:50.481Z"},
];

export const usos: UsoCrudo[] = [
  {"id":"2931690a","herramientas":["ChatGPT","Gemini","NotebookLM","Otra"],"para_que":"Laboral y personalmente","frecuencia":"diaria","rol":"Proyectos y consultoría","creado":"2026-11-09T19:18:32.507Z"},
  {"id":"1655f8c8","herramientas":["ChatGPT","Gemini","Claude"],"para_que":"Para hacer consultas, para resumir documentos, para mejorar correos, para ordenar archivos.","frecuencia":"diaria","rol":"Administración","creado":"2026-11-09T19:18:50.226Z"},
  {"id":"ebd84194","herramientas":["ChatGPT","Gemini","Claude"],"para_que":"Temas laborales y personales","frecuencia":"diaria","rol":"Gerencia","creado":"2026-11-09T19:18:59.524Z"},
  {"id":"266f44bc","herramientas":["Gemini","Claude","NotebookLM","DeepSeek","Copilot"],"para_que":"Consultas, creacion de app, informes.","frecuencia":"diaria","rol":"Servicios administrados","creado":"2026-11-09T19:19:04.863Z"},
  {"id":"6526c082","herramientas":["Gemini","Cursor"],"para_que":"Gemini la uso para consultas básicas o sentencias básicas que me pueda dar Gemini de una forma rápida.\nCursor lo uso para la labor de desarrollo, desde el planteamiento y  refinamiento de una necesidad y la implementación de código.","frecuencia":"diaria","rol":"Tecnología y desarrollo","creado":"2026-11-09T19:19:34.138Z"},
  {"id":"9f94d3a7","herramientas":["ChatGPT"],"para_que":"Investigar compañías, analizar ideas de inversión, hacer propuestas comerciales","frecuencia":"diaria","rol":"Gerencia","creado":"2026-11-09T19:19:58.624Z"},
  {"id":"4f9a2791","herramientas":["ChatGPT","Gemini","Cursor","NotebookLM","DeepSeek"],"para_que":"Desarrollo, generacion de imagenes,","frecuencia":"diaria","rol":"Tecnología y desarrollo","creado":"2026-11-09T19:20:11.949Z"},
  {"id":"d1037b17","herramientas":["ChatGPT","Claude"],"para_que":"Claude: laboralmente hago factibilidades, presentaciones, cuadros comparativos, resumen contratos etc \nChatGPT: uso mas personal","frecuencia":"semanal","rol":"Proyectos y consultoría","creado":"2026-11-09T19:20:14.262Z"},
  {"id":"c0de721a","herramientas":["ChatGPT","Gemini","Claude"],"para_que":"¨Personal y Trabajo","frecuencia":"diaria","rol":"Gerencia","creado":"2026-11-09T19:21:39.850Z"},
  {"id":"37a9c074","herramientas":["ChatGPT","Gemini","DeepSeek"],"para_que":"Documentar, responder correos","frecuencia":"diaria","rol":"Soporte","creado":"2026-11-09T20:11:25.097Z"},
];

// Pendiente: pegar aquí la agrupación exportada de Upstash (taller:sasa-t1:agrupacion → campo "grupos").
export const grupos: GrupoSasa[] = [];
