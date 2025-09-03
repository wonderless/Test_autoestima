# Sistema de Preservación de Datos para Múltiples Intentos del Test

## Descripción General

Este sistema permite que los usuarios puedan realizar el test de autoestima **exactamente 2 veces** sin perder los resultados anteriores. En lugar de sobrescribir los datos, se crean nuevas propiedades con sufijos numéricos en la colección de Firebase.

## Funcionamiento

### 1. Primer Intento del Test
- Los datos se guardan en las propiedades estándar:
  - `answers`
  - `testResults`
  - `recommendationProgress`
  - `activityFeedback`
  - `testDuration`
  - `veracityScore`
  - `lastTestDate`

### 2. Retoma del Test (Botón "Realizar Test Otra Vez")
Cuando el usuario hace clic en "Realizar Test Otra Vez":

1. **Preservación de Datos Anteriores**: Los datos del primer intento se mantienen en las propiedades estándar:
   - `answers` = Primer intento (se preserva)
   - `testResults` = Primer intento (se preserva)
   - `recommendationProgress` = Primer intento (se preserva)
   - `activityFeedback` = Primer intento (se preserva)
   - `testDuration` = Primer intento (se preserva)
   - `veracityScore` = Primer intento (se preserva)
   - `lastTestDate` = Primer intento (se preserva)

2. **Preparación para Segundo Test**: Se marcan las propiedades para el segundo intento:
   - No se limpian las propiedades del primer intento
   - Se preparan para guardar el segundo intento en propiedades con sufijo "2"

3. **Marcado de Retoma**: Se establece `hasRetakenTest: true`

### 3. Completar el Nuevo Test
Cuando el usuario completa el nuevo test:

1. **Guardado de Nuevos Resultados**: 
   - Si es primer intento: Se guardan en `answers`, `testResults`, etc.
   - Si es segundo intento: Se guardan en `answers2`, `testResults2`, etc.

2. **Preservación de Datos**: 
   - Los datos del primer intento permanecen intactos en `answers`, `testResults`, etc.
   - Los datos del segundo intento se guardan en `answers2`, `testResults2`, etc.

### 4. Límite de Intentos
- **Solo se permiten 2 intentos del test**
- El sistema bloquea automáticamente intentos adicionales
- Los datos se preservan de manera segura sin duplicación

## Estructura de Datos en Firebase

```json
{
  "uid": "5KkFM6HIiRVGDZYxIoRrOGaYPJI3",
  "email": "1@1.com",
  "hasRetakenTest": true,
  
  // Datos del intento actual
  "answers": { /* respuestas del test actual */ },
  "testResults": { /* resultados del test actual */ },
  "recommendationProgress": { /* progreso actual */ },
  "activityFeedback": { /* feedback actual */ },
  "testDuration": 0,
  "veracityScore": 0,
  "lastTestDate": null,
  
     // Datos del primer intento (preservados)
   "answers": { /* respuestas del primer intento */ },
   "testResults": { /* resultados del primer intento */ },
   "recommendationProgress": { /* progreso del primer intento */ },
   "activityFeedback": { /* feedback del primer intento */ },
   "testDuration": 180,
   "veracityScore": 0,
   "lastTestDate": "2024-01-15T10:30:00Z",
   
   // Datos del segundo intento (preservados)
   "answers2": { /* respuestas del segundo intento */ },
   "testResults2": { /* resultados del segundo intento */ },
   "recommendationProgress2": { /* progreso del segundo intento */ },
   "activityFeedback2": { /* feedback del segundo intento */ },
   "testDuration2": 165,
   "veracityScore2": 1,
   "lastTestDate2": "2024-01-20T14:45:00Z"
}
```

## Componentes Modificados

### 1. ResultsDisplay.tsx
- **handleResetTest**: Preserva datos anteriores antes de limpiar
- **saveResultsToFirebase**: Preserva datos anteriores al guardar nuevos resultados
- **Historial de Intentos**: Muestra cuántos intentos ha realizado el usuario
- **Indicador de Preservación**: Informa al usuario que los datos se preservarán

### 2. TestForm.tsx
- **handleSubmit**: Detecta si es una retoma y preserva datos anteriores
- **Preservación Automática**: Guarda datos anteriores en propiedades con sufijos

## Beneficios

1. **Historial Completo**: Los usuarios pueden ver su progreso entre 2 intentos
2. **Comparación**: Permite comparar resultados entre el primer y segundo intento
3. **Análisis**: Facilita el análisis de tendencias en la autoestima
4. **Sin Pérdida de Datos**: Garantiza que no se pierda información valiosa
5. **Control de Calidad**: Limita a 2 intentos para mantener la integridad de los datos

## Consideraciones Técnicas

- **Nomenclatura**: Los sufijos se generan automáticamente (solo "2" para el segundo intento)
- **Detección**: El sistema detecta automáticamente si es una retoma del test
- **Sincronización**: Los datos se sincronizan correctamente entre componentes
- **Rendimiento**: La preservación de datos no afecta el rendimiento del test
- **Límite**: Solo se permiten 2 intentos del test

## Uso del Usuario

1. **Completar Test**: El usuario completa el test normalmente
2. **Ver Resultados**: Revisa sus resultados y recomendaciones
3. **Completar Actividades**: Realiza las actividades recomendadas
4. **Retomar Test**: Hace clic en "Realizar Test Otra Vez" (solo disponible una vez)
5. **Confirmación**: El sistema informa que los datos se preservarán
6. **Segundo Test**: Completa el test por segunda y última vez
7. **Historial**: Puede ver ambos intentos (primer intento en propiedades estándar, segundo intento en propiedades con sufijo "2")

Este sistema garantiza que los usuarios puedan realizar el test exactamente 2 veces manteniendo un historial completo de su progreso en la mejora de su autoestima, sin duplicación de datos y con control de calidad.
