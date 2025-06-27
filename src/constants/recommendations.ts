// recommendations.ts

export interface FeedbackQuestion {
  question: string;
  key: string; // A unique key to store the answer in Firebase (e.g., 'ejercicioEspejoQ1')
}

// recommendations.ts
export interface RecommendationItem {
  questionAsked?: string; // New: The actual question text that triggered this recommendation (e.g., "¿Considero que tengo bonito rostro?")
  questionAnsweredIncorrectly?: boolean; // New: To indicate if the user answered 'NO' (or 'YES' for inverse questions like Q18)
  title: string; // This will be the main title for the recommendation (e.g., "CONCEPTO DE BELLEZA")
  description: string; // Overall description for the recommendation topic
  activities?: string[]; // * CHANGED: Array of activity strings *
  type?: string;
  feedbackQuestions?: FeedbackQuestion[];
  id: string; // Unique ID for each recommendation
  isCompleted?: boolean; // <--- Add this property
  relatedQuestion?: number;
}
// Map individual question IDs to an array of RecommendationItems.
// These recommendations are triggered when the user answers 'NO' to the corresponding question.
export interface QuestionBasedRecommendations {
  [questionNumber: string]: RecommendationItem[];
}

interface CategoryLevelRecommendations {
  [level: string]: RecommendationItem[];
}

// This type allows a category to either have general level recommendations
// OR specific question-based recommendations (keyed by question number).
interface AllRecommendations {
  personal: CategoryLevelRecommendations | QuestionBasedRecommendations;
  social: CategoryLevelRecommendations | QuestionBasedRecommendations;
  academico: CategoryLevelRecommendations | QuestionBasedRecommendations;
  fisico: CategoryLevelRecommendations | QuestionBasedRecommendations;
}

export const allRecommendations: AllRecommendations = {
  fisico: {
    ALTO: [
      {
        id: "fisicoAlto1",
        title: "¡Felicidades! Autoestima física alta",
        description: `Los resultados del test demostraron un nivel alto de la autoestima física.`
      }
    ],
    MEDIO: [
      {
        id: "fisicoMedio1",
        title: "Autoestima física nivel medio",
        description: `Tienes un nivel medio de autoestima física. Revisa las áreas específicas que necesitan atención.`
      }
    ],
    BAJO: [
      // Pregunta 7
      {
        id: 'recFisicoQ7',
        questionAsked: "¿Considero que tengo bonito rostro?",
        questionAnsweredIncorrectly: true,
        title: "CONCEPTO DE BELLEZA",
        description: `La belleza es un concepto subjetivo influenciado por factores culturales, sociales y personales.`,
        activities: [
          `ACTIVIDAD 1 - Ejercicio del espejo: Durante 3 días, observa tu rostro e identifica 3 características que te gusten.`,
          `ACTIVIDAD 2 - Sesión fotográfica personal: Tómate fotos desde diferentes ángulos para identificar las imágenes que más te gusten.`
        ],
        feedbackQuestions: [
          { question: "¿Pudiste identificar alguna característica de tu rostro que consideres bonita?", key: "ejercicioEspejoQ1" }
        ],
        relatedQuestion: 7
      },
      
      // Pregunta 9
      {
        id: 'recFisicoQ9',
        questionAsked: "¿Me siento bien con mi peso?",
        questionAnsweredIncorrectly: true,
        title: "BIENESTAR CORPORAL",
        description: `Construye una relación más positiva con tu cuerpo mediante estas actividades.`,
        activities: [
          `ACTIVIDAD 1 - Agradecimiento corporal: Piensa 3 motivos para agradecer a tu cuerpo cada noche.`,
          `ACTIVIDAD 2 - Rutina de ejercicio: Encuentra una actividad física que disfrutes y practícala regularmente.`,
          `ACTIVIDAD 3 - Vístete para sentirte bien: Usa ropa que te haga sentir cómodo/a independientemente de la talla.`
        ],
        feedbackQuestions: [
          { question: "¿Identificaste aspectos positivos de tu cuerpo que antes no valorabas?", key: "agradecimientoCorporalQ1" }
        ],
        relatedQuestion: 9
      },

      // Pregunta 12
      {
        id: 'recFisicoQ12',
        questionAsked: "¿Tengo un buen estado de salud?",
        questionAnsweredIncorrectly: true,
        title: "CUIDADO DE SALUD",
        description: `Un buen estado de salud es fundamental para tu bienestar general.`,
        activities: [
          `ACTIVIDAD 1 - Revisión médica: Acude a un profesional para evaluar tu estado de salud.`,
          `ACTIVIDAD 2 - Rutina de sueño: Prioriza dormir 7-8 horas diarias.`,
          `ACTIVIDAD 3 - Hábitos saludables: Bebe 2 litros de agua diarios y reduce alimentos ultraprocesados.`
        ],
        feedbackQuestions: [
          { question: "¿Notaste mejoras en tu bienestar físico o mental?", key: "habitosSaludablesQ1" }
        ],
        relatedQuestion: 12
      },

      // Pregunta 18
      {
        id: 'recFisicoQ18',
        questionAsked: "¿No estoy conforme con mi altura?",
        questionAnsweredIncorrectly: true,
        title: "ACEPTACIÓN DE ESTATURA",
        description: `Tu estatura es parte de quien eres. Aprende a proyectar confianza.`,
        activities: [
          `ACTIVIDAD 1 - Postura corporal: Mantén hombros atrás y cabeza en alto.`,
          `ACTIVIDAD 2 - Ropa estratégica: Usa prendas que favorezcan tu silueta.`,
          `ACTIVIDAD 3 - Meditación: Practica la aceptación corporal durante 15 minutos diarios.`
        ],
        feedbackQuestions: [
          { question: "¿Notaste diferencia en cómo te percibes con mejor postura?", key: "posturaCorporalQ1" }
        ],
        relatedQuestion: 18
      },

      // Pregunta 21
      {
        id: 'recFisicoQ21',
        questionAsked: "¿Me gusta el color de mi piel?",
        questionAnsweredIncorrectly: true,
        title: "VALORACIÓN DEL TONO DE PIEL",
        description: `Tu tono de piel es único y hermoso.`,
        activities: [
          `ACTIVIDAD 1 - Discurso interno: Practica afirmaciones positivas sobre tu piel.`,
          `ACTIVIDAD 2 - Cultura: Investiga sobre la belleza de tu tono en diferentes culturas.`,
          `ACTIVIDAD 3 - Cuidado: Hidrata y protege tu piel diariamente.`
        ],
        feedbackQuestions: [
          { question: "¿Descubriste algo positivo sobre tu tono de piel?", key: "valoracionPielQ1" }
        ],
        relatedQuestion: 21
      },

      // Pregunta 28
      {
        id: 'recFisicoQ28',
        questionAsked: "¿Siento que mis ojos van bien con mi físico?",
        questionAnsweredIncorrectly: true,
        title: "VALORACIÓN DE LA MIRADA",
        description: `Tus ojos reflejan tu personalidad.`,
        activities: [
          `ACTIVIDAD 1 - Resaltar mirada: Experimenta con maquillaje o accesorios.`,
          `ACTIVIDAD 2 - Expresión: Practica miradas seguras frente al espejo.`,
          `ACTIVIDAD 3 - Fotografías: Toma fotos para apreciar tu mirada.`
        ],
        feedbackQuestions: [
          { question: "¿Encontraste características de tus ojos que te gusten?", key: "valoracionOjosQ1" }
        ],
        relatedQuestion: 28
      }
    ]
  },
  personal: {
    ALTO: [
      {
        id: "personalAlto1",
        title: "¡Felicidades! Autoestima personal alta",
        description: `Tienes un nivel alto de autoestima personal.`
      }
    ],
    MEDIO: [
      {
        id: "personalMedio1",
        title: "Autoestima personal nivel medio",
        description: `Tienes un nivel medio de autoestima personal.`
      }
    ],
    BAJO: [
      // Pregunta 3
      {
        id: 'recPersonalQ3',
        questionAsked: "¿Soy una persona valiosa?",
        questionAnsweredIncorrectly: true,
        title: "VALOR PERSONAL",
        description: `Reconoce tu valor intrínseco como persona.`,
        activities: [
          `ACTIVIDAD 1 - Lista de logros: Escribe 5 logros personales de los que estés orgulloso.`,
          `ACTIVIDAD 2 - Cualidades: Identifica 3 cualidades positivas de tu personalidad.`
        ],
        relatedQuestion: 3
      },

      // Pregunta 8
      {
        id: 'recPersonalQ8',
        questionAsked: "¿Me siento satisfecho conmigo mismo?",
        questionAnsweredIncorrectly: true,
        title: "SATISFACCIÓN PERSONAL",
        description: `Aprende a valorar tus cualidades y logros.`,
        activities: [
          `ACTIVIDAD 1 - Diario de gratitud: Escribe 3 cosas que aprecies de ti cada día.`,
          `ACTIVIDAD 2 - Autoreconocimiento: Dedica tiempo a reflexionar sobre tus progresos.`
        ],
        relatedQuestion: 8
      },

      // Pregunta 10
      {
        id: 'recPersonalQ10',
        questionAsked: "¿Me siento seguro de mis capacidades?",
        questionAnsweredIncorrectly: true,
        title: "CONFIANZA EN CAPACIDADES",
        description: `Fortalece la confianza en tus habilidades.`,
        activities: [
          `ACTIVIDAD 1 - Retos pequeños: Establece y cumple pequeños objetivos diarios.`,
          `ACTIVIDAD 2 - Lista de habilidades: Enumera 5 cosas que haces bien.`
        ],
        relatedQuestion: 10
      },

      // Pregunta 13
      {
        id: 'recPersonalQ13',
        questionAsked: "¿Siento que tengo cualidades positivas?",
        questionAnsweredIncorrectly: true,
        title: "RECONOCIMIENTO DE CUALIDADES",
        description: `Identifica y valora tus aspectos positivos.`,
        activities: [
          `ACTIVIDAD 1 - Cualidades: Pide a 3 personas cercanas que mencionen una cualidad tuya.`,
          `ACTIVIDAD 2 - Autorreflexión: Escribe cómo tus cualidades te han ayudado en la vida.`
        ],
        relatedQuestion: 13
      },

      // Pregunta 20
      {
        id: 'recPersonalQ20',
        questionAsked: "¿Me siento orgulloso de mis logros?",
        questionAnsweredIncorrectly: true,
        title: "RECONOCIMIENTO DE LOGROS",
        description: `Aprende a valorar tus éxitos y progresos.`,
        activities: [
          `ACTIVIDAD 1 - Lista de logros: Haz una lista cronológica de tus logros.`,
          `ACTIVIDAD 2 - Celebración: Establece una pequeña recompensa por tus logros.`
        ],
        relatedQuestion: 20
      },

      // Pregunta 26
      {
        id: 'recPersonalQ26',
        questionAsked: "¿Me siento bien con mi personalidad?",
        questionAnsweredIncorrectly: true,
        title: "ACEPTACIÓN PERSONAL",
        description: `Aprecia las características que te hacen único.`,
        activities: [
          `ACTIVIDAD 1 - Autodescripción: Escribe una descripción positiva de tu personalidad.`,
          `ACTIVIDAD 2 - Fortalezas: Identifica cómo tus rasgos personales te benefician.`
        ],
        relatedQuestion: 26
      }
    ]
  },
  social: {
    ALTO: [
      {
        id: "socialAlto1",
        title: "¡Felicidades! Autoestima social alta",
        description: `Tienes un nivel alto de autoestima en relaciones sociales.`
      }
    ],
    MEDIO: [
      {
        id: "socialMedio1",
        title: "Autoestima social nivel medio",
        description: `Tienes un nivel medio de autoestima en relaciones sociales.`
      }
    ],
    BAJO: [
      // Pregunta 2
      {
        id: 'recSocialQ2',
        questionAsked: "¿Soy tímido?",
        questionAnsweredIncorrectly: true,
        title: "HABILIDADES SOCIALES",
        description: `Desarrolla confianza en interacciones sociales.`,
        activities: [
          `ACTIVIDAD 1 - Pequeños pasos: Saluda a una persona nueva cada día.`,
          `ACTIVIDAD 2 - Preparación: Anticipa temas de conversación para situaciones sociales.`
        ],
        relatedQuestion: 2
      },

      // Pregunta 4
      {
        id: 'recSocialQ4',
        questionAsked: "¿Me cuesta hacer amigos?",
        questionAnsweredIncorrectly: true,
        title: "CREACIÓN DE VÍNCULOS",
        description: `Mejora tus habilidades para establecer amistades.`,
        activities: [
          `ACTIVIDAD 1 - Intereses comunes: Únete a un grupo de algo que te guste.`,
          `ACTIVIDAD 2 - Iniciativa: Invita a un conocido a hacer una actividad juntos.`
        ],
        relatedQuestion: 4
      },

      // Pregunta 17
      {
        id: 'recSocialQ17',
        questionAsked: "¿Me siento incómodo en grupos?",
        questionAnsweredIncorrectly: true,
        title: "CONFORT EN GRUPOS",
        description: `Aprende a sentirte más cómodo en entornos sociales.`,
        activities: [
          `ACTIVIDAD 1 - Observación: Analiza cómo interactúan otros en grupos.`,
          `ACTIVIDAD 2 - Participación gradual: Empieza con intervenciones breves en conversaciones grupales.`
        ],
        relatedQuestion: 17
      },

      // Pregunta 23
      {
        id: 'recSocialQ23',
        questionAsked: "¿Me cuesta expresar mis opiniones?",
        questionAnsweredIncorrectly: true,
        title: "EXPRESIÓN DE OPINIONES",
        description: `Desarrolla confianza para compartir tus puntos de vista.`,
        activities: [
          `ACTIVIDAD 1 - Práctica: Expresa una opinión diferente cada día.`,
          `ACTIVIDAD 2 - Escenarios: Ensaya expresar opiniones en situaciones simuladas.`
        ],
        relatedQuestion: 23
      },

      // Pregunta 27
      {
        id: 'recSocialQ27',
        questionAsked: "¿Me cuesta decir que no?",
        questionAnsweredIncorrectly: true,
        title: "ASERTIVIDAD",
        description: `Aprende a establecer límites saludables.`,
        activities: [
          `ACTIVIDAD 1 - Frases asertivas: Practica decir "Prefiero no hacerlo" o "Necesito pensarlo".`,
          `ACTIVIDAD 2 - Escenarios: Ensaya situaciones donde necesites decir no.`
        ],
        relatedQuestion: 27
      },

      // Pregunta 29
      {
        id: 'recSocialQ29',
        questionAsked: "¿Me preocupa lo que piensen de mí?",
        questionAnsweredIncorrectly: true,
        title: "INDEPENDENCIA SOCIAL",
        description: `Desarrolla mayor independencia del juicio ajeno.`,
        activities: [
          `ACTIVIDAD 1 - Autoevaluación: Prioriza tu propia opinión sobre ti mismo.`,
          `ACTIVIDAD 2 - Exposición gradual: Haz algo diferente sin preocuparte por opiniones ajenas.`
        ],
        relatedQuestion: 29
      }
    ]
  },
  academico: {
    ALTO: [
      {
        id: "academicoAlto1",
        title: "¡Felicidades! Autoestima académica alta",
        description: `Tienes un nivel alto de autoestima en el ámbito académico.`
      }
    ],
    MEDIO: [
      {
        id: "academicoMedio1",
        title: "Autoestima académica nivel medio",
        description: `Tienes un nivel medio de autoestima en el ámbito académico.`
      }
    ],
    BAJO: [
      // Pregunta 1
      {
        id: 'recAcademicoQ1',
        questionAsked: "¿Soy bueno en mis estudios?",
        questionAnsweredIncorrectly: true,
        title: "RENDIMIENTO ACADÉMICO",
        description: `Mejora tu percepción sobre tus capacidades académicas.`,
        activities: [
          `ACTIVIDAD 1 - Lista de logros: Enumera 5 éxitos académicos pasados.`,
          `ACTIVIDAD 2 - Metas realistas: Establece pequeños objetivos académicos alcanzables.`
        ],
        relatedQuestion: 1
      },

      // Pregunta 4 (Académico)
      {
        id: 'recAcademicoQ4',
        questionAsked: "¿Tengo dificultades para concentrarme?",
        questionAnsweredIncorrectly: true,
        title: "CONCENTRACIÓN",
        description: `Desarrolla técnicas para mejorar tu enfoque en estudios.`,
        activities: [
          `ACTIVIDAD 1 - Técnica Pomodoro: Estudia en intervalos de 25 minutos con descansos de 5.`,
          `ACTIVIDAD 2 - Ambiente: Crea un espacio de estudio libre de distracciones.`
        ],
        relatedQuestion: 4
      },

      // Pregunta 14
      {
        id: 'recAcademicoQ14',
        questionAsked: "¿Me siento capaz intelectualmente?",
        questionAnsweredIncorrectly: true,
        title: "CONFIANZA INTELECTUAL",
        description: `Fortalece la confianza en tus capacidades cognitivas.`,
        activities: [
          `ACTIVIDAD 1 - Retos mentales: Resuelve crucigramas o puzzles diariamente.`,
          `ACTIVIDAD 2 - Aprendizaje: Domina un tema nuevo cada semana.`
        ],
        relatedQuestion: 14
      },

      // Pregunta 15
      {
        id: 'recAcademicoQ15',
        questionAsked: "¿Me cuesta entender lo que estudio?",
        questionAnsweredIncorrectly: true,
        title: "COMPRENSIÓN ACADÉMICA",
        description: `Mejora tus estrategias de aprendizaje y comprensión.`,
        activities: [
          `ACTIVIDAD 1 - Técnicas de estudio: Prueba métodos como mapas conceptuales o resúmenes.`,
          `ACTIVIDAD 2 - Enseñar: Explica los temas a alguien más para reforzar tu comprensión.`
        ],
        relatedQuestion: 15
      },

      // Pregunta 16
      {
        id: 'recAcademicoQ16',
        questionAsked: "¿Me siento menos capaz que mis compañeros?",
        questionAnsweredIncorrectly: true,
        title: "COMPARACIÓN ACADÉMICA",
        description: `Enfócate en tu propio progreso sin comparaciones.`,
        activities: [
          `ACTIVIDAD 1 - Autoevaluación: Lleva un registro de tu propio progreso.`,
          `ACTIVIDAD 2 - Fortalezas: Identifica áreas donde sobresales académicamente.`
        ],
        relatedQuestion: 16
      },

      // Pregunta 25
      {
        id: 'recAcademicoQ25',
        questionAsked: "¿Dudo de mi capacidad para aprender?",
        questionAnsweredIncorrectly: true,
        title: "AUTOEFICACIA",
        description: `Desarrolla confianza en tu capacidad de aprendizaje.`,
        activities: [
          `ACTIVIDAD 1 - Pequeños logros: Enfócate en dominar conceptos básicos primero.`,
          `ACTIVIDAD 2 - Mentalidad de crecimiento: Recuerda que las habilidades se desarrollan con práctica.`
        ],
        relatedQuestion: 25
      }
    ]
  }
};

// Define correct answers for all relevant questions.
// This should match your correctAnswers.ts file.
export const mockCorrectAnswers: Record<number, boolean> = {
  1: true,
  2: true,
  3: false,
  4: false,
  5: true,
  6: true,
  7: true, // "Considero que tengo bonito rostro." -> TRUE is correct
  8: false,
  9: true, // "Me siento bien con mi peso." -> TRUE is correct
  10: false,
  11: true,
  12: true, // "Tengo un buen estado de salud." -> TRUE is correct
  13: true,
  14: true,
  15: false,
  16: true,
  17: true,
  18: false, // "No estoy conforme con mi altura." -> FALSE is correct (meaning you ARE conforme)
  19: false,
  20: false,
  21: true, // "Me gusta el color de mi piel." -> TRUE is correct
  22: true,
  23: false,
  24: false,
  25: true,
  26: true,
  27: false,
  28: true, // "Siento que mis ojos van bien con mi físico." -> TRUE is correct
  29: true,
  30: false,
};

// This function now needs to be smarter. It will prioritize question-based recommendations.
export const getDetailedRecommendations = (
  category: string,
  level: string, // This level is still useful for general category feedback
  answers: Record<number, boolean>, // Pass all user answers
  correctAnswers: Record<number, boolean> // Pass correct answers
): RecommendationItem[] => {
  const categoryRecs = allRecommendations[category as keyof AllRecommendations];
  let specificRecommendations: RecommendationItem[] = [];

  const categoryQuestionsMap = { // This map needs to be consistent with ResultsDisplay
    personal: [3, 8, 10, 13, 20, 26],
    social: [2, 4, 17, 23, 27, 29],
    academico: [1, 4, 14, 15, 16, 25],
    fisico: [7, 9, 12, 18, 21, 28]
  };

  const questionsForCategory = categoryQuestionsMap[category as keyof typeof categoryQuestionsMap];

  // 1. Collect specific question-based recommendations if user's answer is "NOT correct"
  // The order here will determine the order of personalized recommendations if multiple are triggered.
  for (const qNum of questionsForCategory) {
    // If the user's answer for this question is NOT the correct answer
    // and there are specific recommendations defined for this question number in the categoryRecs
    if (answers[qNum] !== correctAnswers[qNum] && (categoryRecs as QuestionBasedRecommendations)[qNum]) {
      specificRecommendations = specificRecommendations.concat((categoryRecs as QuestionBasedRecommendations)[qNum]);
    }
  }

  // 2. If no specific question-based recommendations are triggered, fall back to general level recommendations.
  // This ensures that even if all questions are answered "correctly" (or "positively"),
  // the user still gets a general message for their category level.
  if (specificRecommendations.length > 0) {
    return specificRecommendations;
  } else {
    // Return general recommendations for the determined level
    return (categoryRecs as CategoryLevelRecommendations)[level] || [];
  }
};