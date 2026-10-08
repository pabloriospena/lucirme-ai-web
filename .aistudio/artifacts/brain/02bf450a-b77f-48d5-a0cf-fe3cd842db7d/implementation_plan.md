# Plan de Mejora del Diagnóstico Operativo B2B

## Objetivos
1. Evolucionar el formulario `/empresas` en una herramienta de diagnóstico.
2. Generar diagnósticos personalizados con IA (usando Groq/Gemini).
3. Mostrar resultados en una nueva página sin depender de una BBDD.
4. Habilitar descarga de PDF y acciones de seguimiento (WhatsApp, envío por correo).
5. Integrar correctamente con MailerLite y PostHog.

## Pasos

### 1. API y Lógica de Negocio
- Modificar `src/pages/api/bottleneck-diagnosis.ts` para integrar la llamada a IA para generar la narrativa del diagnóstico.
- Definir la estructura de la respuesta JSON que incluirá el diagnóstico completo.

### 2. Página de Resultados (`/diagnostico-resultado`)
- Crear una nueva página que recupere el diagnóstico desde `sessionStorage`.
- Implementar la UI del informe: resumen, hallazgos, carga estimada, recomendaciones, plan de acción.
- Incluir botón para descarga de PDF (usando `jspdf`).
- Incluir botón de WhatsApp con mensaje contextual.

### 3. Integración y Seguimiento
- Asegurar que MailerLite registre el lead y los campos de contexto.
- Implementar eventos de PostHog para cada paso del embudo (`diagnostico_started`, `diagnostico_report_viewed`, etc.).
- Preparar la acción de "Recibir por correo" (priorizando descarga directa si no hay servicio de envío listo).

### 4. Validación y Criterios
- Validar flujo: formulario -> procesamiento -> resultados.
- Comprobar que no hay pérdida de datos en fallos recuperables.
- Verificar integridad de eventos PostHog.
