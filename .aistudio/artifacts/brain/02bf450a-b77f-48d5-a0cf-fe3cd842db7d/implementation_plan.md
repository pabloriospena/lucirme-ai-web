# Plan de Actualización de "index.astro"

El objetivo es reemplazar la sección actual de "Prueba Social" (líneas 667-783 de `index.astro`) por el nuevo componente `SocialProof.astro` que utiliza nuestra base de datos centralizada de testimonios.

## Pasos

1. **Identificar la sección**: Localizar el bloque de código entre las líneas 667 y 783 en `src/pages/index.astro` que contiene la sección "PRUEBA SOCIAL / EVIDENCIA REAL".
2. **Reemplazar**:
    - Importar el componente `SocialProof` en la parte superior de `index.astro`.
    - Eliminar el bloque de código HTML actual de la sección 5.
    - Insertar el componente `<SocialProof />` en su lugar.
3. **Verificar**: Compilar el proyecto para asegurar que no hay errores de sintaxis y que la sección se muestra correctamente en el índice.
