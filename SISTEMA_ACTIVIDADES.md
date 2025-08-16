# Sistema de Actividades con Temporizadores

## Descripción General

Se ha implementado un sistema completo de actividades dividido en 4 aspectos: Físico, Personal, Académico y Social. Cada aspecto tiene un nivel (bajo, medio o alto) según el resultado del test inicial del usuario.

## Estructura del Sistema

### 1. Organización por Aspectos
- **Físico**: Preguntas 7, 9, 12, 18, 21, 28
- **Personal**: Preguntas 3, 8, 10, 13, 20, 26
- **Académico**: Preguntas 1, 4, 14, 15, 16, 25
- **Social**: Preguntas 2, 4, 17, 23, 27, 29

### 2. Lógica de Recomendaciones
- **Niveles ALTO y MEDIO**: Solo muestran mensajes generales de felicitación
- **Nivel BAJO**: Muestra sistema completo de actividades con temporizadores

### 3. Estructura de Actividades
Cada recomendación tiene:
- **3 días** de actividades (day 1, day 2, day 3)
- **Cada día** contiene una o varias actividades con title y description
- **Preguntas de feedback** al finalizar los 3 días

## Flujo de Desbloqueo y Temporizador

### 1. Progreso Normal
- Usuario ve actividades del día 1 de la pregunta actual
- Al completar todas las actividades del día:
  - Aparece mensaje de felicitaciones
  - Comienza temporizador de 5 minutos para desbloquear día 2
  - Aparecen botones "Anterior" y "Siguiente"

### 2. Comportamiento del Temporizador
- **Duración**: 5 minutos (300 segundos)
- **Persistencia**: Los temporizadores siguen corriendo en segundo plano
- **Independencia**: Cada temporizador es independiente por pregunta y día
- **Navegación**: El usuario puede esperar o pasar a otra pregunta mientras el temporizador corre

### 3. Botones de Navegación
- **Solo aparecen** durante el estado de cooldown (temporizador activo)
- **No aparecen** cuando el usuario está realizando actividades
- **Botón "Anterior"**: Opaco y deshabilitado si es la primera pregunta
- **Botón "Siguiente"**: Activo si hay siguiente pregunta disponible

## Visualización del Temporizador

### Formato de Tiempo
- **"Falta 1 hora"** (para más de 1 hora)
- **"Faltan 10 minutos"** (para 10+ minutos)
- **"Falta menos de 10 minutos"** (para menos de 10 minutos)
- **No se muestran segundos** en ningún caso

### Ejemplo de Flujo
1. Usuario en día 1, pregunta 1 → Termina actividades
2. Aparece mensaje + temporizador 5 min + botones Anterior (opaco) y Siguiente (activo)
3. Usuario presiona "Siguiente" → Va a día 1 de pregunta 2
4. Termina día 1 de pregunta 2 → Aparece mensaje + temporizador para día 2
5. Si vuelve a "Anterior" → Ve mensaje + temporizador restante de pregunta 1, día 2

## Implementación Técnica

### 1. Interfaces Principales
```typescript
interface ActivityProgress {
  currentDay: number;
  currentActivityIndex: number;
  completedActivities: number[];
  isCompleted: boolean;
  countdown?: number | null;
  countdownStartTime?: number | null;
}

interface RecommendationStatus {
  [category: string]: {
    isOpen: boolean;
    userAnswers: Record<number, boolean>;
    categoryLevel: "ALTO" | "MEDIO" | "BAJO";
    recommendationProgress: {
      [recommendationId: string]: ActivityProgress;
    };
    currentQuestionIndex: number;
  };
}
```

### 2. Funciones Principales
- **`startTimer()`**: Inicia temporizador para una recomendación específica
- **`completeActivity()`**: Marca actividad como completada y maneja progreso
- **`formatTimeRemaining()`**: Formatea el tiempo restante para mostrar
- **`DayActivitiesRenderer`**: Componente que renderiza actividades de un día

### 3. Persistencia de Datos
- **Firebase**: Guarda progreso de actividades, temporizadores y estado
- **Recuperación**: Al cargar la página, restaura temporizadores activos
- **Sincronización**: Estado local sincronizado con Firebase

## Características Especiales

### 1. Manejo de Temporizadores
- **Múltiples temporizadores**: Pueden correr simultáneamente
- **Persistencia**: Los temporizadores se mantienen al recargar la página
- **Limpieza**: Se limpian automáticamente al desmontar el componente

### 2. Navegación Inteligente
- **Estado de cooldown**: Solo permite navegación durante temporizadores
- **Progreso preservado**: Mantiene el progreso al navegar entre preguntas
- **Feedback**: Muestra preguntas de feedback al completar recomendaciones

### 3. Experiencia de Usuario
- **Mensajes claros**: Felicitaciones y explicaciones del progreso
- **Indicadores visuales**: Barras de progreso y estados de completado
- **Responsive**: Interfaz adaptada para diferentes dispositivos

## Configuración de Recomendaciones

Las recomendaciones se configuran en `src/constants/recommendations.ts` con la estructura:

```typescript
{
  id: 'recFisicoQ7',
  questionAsked: "¿Considero que tengo bonito rostro?",
  questionAnsweredIncorrectly: true,
  title: "CONCEPTO DE BELLEZA",
  description: "...",
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Ejercicio del espejo",
          description: "..."
        }
      ]
    }
  ],
  feedbackQuestions: [
    {
      question: "¿Crees que la belleza se valora subjetivamente?",
      key: "bellezaSubjetiva"
    }
  ],
  relatedQuestion: 7
}
```

## Consideraciones de Rendimiento

1. **Temporizadores eficientes**: Uso de `useRef` para evitar recreaciones
2. **Actualizaciones optimizadas**: Solo actualiza componentes necesarios
3. **Limpieza automática**: Limpia temporizadores al desmontar
4. **Persistencia inteligente**: Solo guarda datos necesarios en Firebase 