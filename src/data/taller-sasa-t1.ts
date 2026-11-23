// Respuestas originales de la actividad en vivo del taller de Sasa Consultoría (9 y 18 de nov 2026, sesión sasa-t1).
// Exportadas tal cual de Upstash (taller:sasa-t1:dolores y :uso). No se editan.
// La agrupación es la guardada en Upstash en taller:sasa-t1:agrupacion.

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
  {"id":"d813fd54","tarea":"Cronograma","rol":"Proyectos y consultoría","nombre":"Zhoe Acevedo","horas_semana":3,"frecuencia":"mensual","procedimiento":"si","estructurado":"si","origen":"taller","creado":"2026-11-18T20:03:47.779Z"},
  {"id":"c5920266","tarea":"estructurar todo el alcance de las propuestas","rol":"Proyectos y consultoría","nombre":"Zhoe Acevedo","horas_semana":3,"frecuencia":"semanal","procedimiento":"si","estructurado":"si","origen":"taller","creado":"2026-11-18T20:03:47.788Z"},
  {"id":"e3e10a7d","tarea":"Documentar proceso","rol":"Proyectos y consultoría","nombre":"Zhoe Acevedo","horas_semana":4,"frecuencia":"mensual","procedimiento":"si","estructurado":"si","origen":"taller","creado":"2026-11-18T20:03:47.793Z"},
  {"id":"876eb3e1","tarea":"Convertir la documentación tecnica en comercial","rol":"Comercial","nombre":"Adriana Bedoya","horas_semana":1.5,"frecuencia":"semanal","procedimiento":"si","estructurado":"si","origen":"taller","creado":"2026-11-18T20:03:47.807Z"},
  {"id":"eaf3ca3e","tarea":"Generar información para licitaciones cuando llegan","rol":"Comercial","nombre":"Adriana Bedoya","horas_semana":null,"frecuencia":"mensual","procedimiento":"si","estructurado":"si","origen":"taller","creado":"2026-11-18T20:03:47.813Z"},
  {"id":"376f6352","tarea":"Responder cadenas de correos sin fin","rol":"Servicios administrados","nombre":"Análisis de casos","horas_semana":4,"frecuencia":"diaria","procedimiento":"no","estructurado":"no","origen":"taller","creado":"2026-11-18T20:03:54.801Z"},
  {"id":"25c93795","tarea":"Entender procesos no documentados","rol":"Servicios administrados","nombre":"Análisis de casos","horas_semana":3,"frecuencia":"mensual","procedimiento":"no","estructurado":"no","origen":"taller","creado":"2026-11-18T20:03:54.807Z"},
  {"id":"14d5cf30","tarea":"Documentar seguimientos","rol":"Servicios administrados","nombre":"Análisis de casos","horas_semana":5,"frecuencia":"diaria","procedimiento":"no","estructurado":"no","origen":"taller","creado":"2026-11-18T20:03:54.812Z"},
  {"id":"03dbd5de","tarea":"identificar los esfuerzos reales del equipo en la ejecución de actividades, generar informes y métricas para identificar la operacion","rol":"Gerencia","nombre":"sandra liliana","horas_semana":4,"frecuencia":"semanal","procedimiento":"parcial","estructurado":"si","origen":"taller","creado":"2026-11-18T20:04:01.051Z"},
  {"id":"007e6d6c","tarea":"revisar documentación para corregir","rol":"Gerencia","nombre":"sandra liliana","horas_semana":4,"frecuencia":"semanal","procedimiento":"no","estructurado":"si","origen":"taller","creado":"2026-11-18T20:04:01.055Z"},
  {"id":"e2456c0f","tarea":"definir procesos que generen estandarizacion para trabajo de equipo","rol":"Gerencia","nombre":"sandra liliana","horas_semana":2,"frecuencia":"mensual","procedimiento":"parcial","estructurado":"si","origen":"taller","creado":"2026-11-18T20:04:01.061Z"},
  {"id":"ceb25a0c","tarea":"Analizar casos complejos, redactar respuestas y explicaciones técnicas detalladas para los clientes en los tickets de soporte","rol":"Soporte","nombre":"Wilmar","horas_semana":3,"frecuencia":"diaria","procedimiento":"no","estructurado":"no","origen":"taller","creado":"2026-11-18T20:04:05.034Z"},
  {"id":"8ed0318a","tarea":"Monitoreo de instancias","rol":"Soporte","nombre":"Wilmar","horas_semana":4,"frecuencia":"semanal","procedimiento":"parcial","estructurado":"no","origen":"taller","creado":"2026-11-18T20:04:05.039Z"},
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
  {"id":"184f8b3f","herramientas":["ChatGPT","Gemini","NotebookLM"],"para_que":"Actividades laborales, educativo y personal","frecuencia":"diaria","rol":"Proyectos y consultoría","creado":"2026-11-18T20:04:06.943Z"},
  {"id":"fc8c7ae6","herramientas":["ChatGPT","Gemini","Claude"],"para_que":"Para que me ayude agilizar en las propuestas ypresentaciones comerciales","frecuencia":"diaria","rol":"Comercial","creado":"2026-11-18T20:04:24.869Z"},
];

// Agrupación hecha con Groq desde el panel del facilitador (taller:sasa-t1:agrupacion, 23 nov 2026).
export const grupos: GrupoSasa[] = [
  {"nombre":"Coordinación y planificación de proyectos","dolor_de_fondo":"Dificultad para gestionar varios proyectos simultáneos, organizar agenda, crear cronogramas, estimar y estructurar alcances, y empalmar con proyectos en curso.","ids":["3ad7d7e8","2cf576b3","6a1cf04f","d813fd54","c5920266","e3e10a7d","bbe9aada"]},
  {"nombre":"Documentación, informes y estandarización","dolor_de_fondo":"Necesidad de generar informes, revisar datos en Excel, analizar procesos existentes, entender procesos no documentados, documentar seguimientos y estandarizar procesos de equipo.","ids":["0acad228","030ffe8d","9d7e3ba9","25c93795","14d5cf30","03dbd5de","007e6d6c","e2456c0f"]},
  {"nombre":"Resolución y monitoreo técnico","dolor_de_fondo":"Resolver bugs, problemas sin contexto, de interfaz gráfica y backend, analizar casos complejos, redactar respuestas técnicas y monitorear instancias.","ids":["6685529d","72b53833","1457d7ab","eb29b082","ceb25a0c","8ed0318a"]},
  {"nombre":"Manejo y transformación de información","dolor_de_fondo":"Editar y agregar archivos en Drive, convertir documentación técnica a comercial, generar información para licitaciones y responder cadenas de correos interminables.","ids":["fafb49e2","876eb3e1","eaf3ca3e","376f6352"]},
  {"nombre":"Estrategia de sostenibilidad","dolor_de_fondo":"Definir un plan de sostenibilidad para la empresa.","ids":["1906f0e3"]},
];
