// recommendations.ts

export interface FeedbackQuestion {
  question: string;
  key: string; // A unique key to store the answer in Firebase (e.g., 'ejercicioEspejoQ1')
}
export interface Activity {
  title: string;
  description: string;
}

export interface DayActivities {
  day: number; // Día 1, Día 2, Día 3, etc.
  activities: Activity[];
}

// recommendations.ts
export interface RecommendationItem {
  days?: DayActivities[]; // Nuevo: actividades agrupadas por día
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
        description: `La belleza es un concepto que indica la cualidad de un ser u objeto que resulta agradable para una persona. Además, está referida a la capacidad de algo para agradar a los sentidos, no obstante, la belleza está relacionada a valores subjetivos, debido a que lo que se considera bello para una persona puede no serlo para otra; además, las preferencias estéticas están influenciadas por factores culturales, sociales y personales, en los que destacan los medios de comunicación que arbitrariamente presenta modelos de belleza para imponer su propia ideología, que aliena a la persona, por lo que deberíamos evitar su influencia negativa sobre la belleza.
Si tuvieras acné muy pronunciado y esto te afecta mucho, sería bueno asistir al dermatólogo para un adecuado tratamiento.
Vamos a realizar algunas actividades que nos ayudaran a mejorar nuestra autoestima física.
`,
days: [
  {
    day: 1,
    activities: [
      {
        title: "Ejercicio del espejo",
        description: "Al despertar, observa tu rostro en un espejo o cámara e identifica al menos tres características que te gusten (pueden ser los labios, la forma de los ojos, la nariz, etc.). Posterior a este paso, reflexiona sobre el motivo por el cual te gustan."
      },
      {
        title: "Sesión fotográfica personal",
        description: "Antes de acostarse, lávate bien la cara, péinate bien, perfúmate y tómate 6 fotos desde diferentes ángulos y con distintas expresiones. Mira tus fotos, escoge las mejores y piensa lo bien que se ven."
      }
    ]
  },
  {
    day: 2,
    activities: [
      {
        title: "Ejercicio del espejo",
        description: "Al despertar, observa tu rostro en un espejo o cámara e identifica al menos tres características que te gusten (pueden ser los labios, la forma de los ojos, la nariz, etc.). Posterior a este paso, reflexiona sobre el motivo por el cual te gustan."
      },
      {
        title: "Sesión fotográfica personal",
        description: "Antes de acostarse, lávate bien la cara, péinate, perfúmate y tómate 6 fotos desde diferentes ángulos y con distintas expresiones. Mira tus fotos, escoge las mejores y piensa lo bien que se ven."
      }
    ]
  },
  {
    day: 3,
    activities: [
      {
        title: "Ejercicio del espejo",
        description: "Al despertar, observa tu rostro en un espejo o cámara e identifica al menos tres características que te gusten (pueden ser los labios, la forma de los ojos, la nariz, etc.). Reflexiona sobre el motivo por el cual te gustan."
      },
      {
        title: "Sesión fotográfica personal",
        description: "Antes de acostarse, lávate bien la cara, péinate, perfúmate y tómate 6 fotos desde diferentes ángulos y con distintas expresiones. Mira tus fotos, escoge las mejores y piensa lo bien que se ven."
      }
    ]
  }
],
feedbackQuestions: [
  { question: "¿Crees que la belleza se valora subjetivamente? (SI / NO)", key: "bellezaSubjetiva" },
  { question: "¿Notaste algún cambio en la forma en que valoras tu apariencia facial? (SI / NO)", key: "cambioValoracion" },
  { question: "¿Te sentiste bien al observar tu rostro con más detalle durante varios días? (SI / NO)", key: "bienestarObservacion" }
],
        relatedQuestion: 7
      },
      
      // Pregunta 9
      {
        id: 'recFisicoQ9',
        questionAsked: "¿Considero que tengo bonito rostro?9",
        questionAnsweredIncorrectly: true,
        title: "CONCEPTO DE BELLEZA",
        description: `La belleza es un concepto que indica la cualidad de un ser u objeto que resulta agradable para una persona. Además, está referida a la capacidad de algo para agradar a los sentidos, no obstante, la belleza está relacionada a valores subjetivos, debido a que lo que se considera bello para una persona puede no serlo para otra; además, las preferencias estéticas están influenciadas por factores culturales, sociales y personales, en los que destacan los medios de comunicación que arbitrariamente presenta modelos de belleza para imponer su propia ideología, que aliena a la persona, por lo que deberíamos evitar su influencia negativa sobre la belleza.
Si tuvieras acné muy pronunciado y esto te afecta mucho, sería bueno asistir al dermatólogo para un adecuado tratamiento.
Vamos a realizar algunas actividades que nos ayudaran a mejorar nuestra autoestima física.
`,
days: [
  {
    day: 1,
    activities: [
      {
        title: "Ejercicio del espejo",
        description: "Al despertar, observa tu rostro en un espejo o cámara e identifica al menos tres características que te gusten (pueden ser los labios, la forma de los ojos, la nariz, etc.). Posterior a este paso, reflexiona sobre el motivo por el cual te gustan."
      },
      {
        title: "Sesión fotográfica personal",
        description: "Antes de acostarse, lávate bien la cara, péinate bien, perfúmate y tómate 6 fotos desde diferentes ángulos y con distintas expresiones. Mira tus fotos, escoge las mejores y piensa lo bien que se ven."
      }
    ]
  },
  {
    day: 2,
    activities: [
      {
        title: "Ejercicio del espejo",
        description: "Al despertar, observa tu rostro en un espejo o cámara e identifica al menos tres características que te gusten (pueden ser los labios, la forma de los ojos, la nariz, etc.). Posterior a este paso, reflexiona sobre el motivo por el cual te gustan."
      },
      {
        title: "Sesión fotográfica personal",
        description: "Antes de acostarse, lávate bien la cara, péinate, perfúmate y tómate 6 fotos desde diferentes ángulos y con distintas expresiones. Mira tus fotos, escoge las mejores y piensa lo bien que se ven."
      }
    ]
  },
  {
    day: 3,
    activities: [
      {
        title: "Ejercicio del espejo",
        description: "Al despertar, observa tu rostro en un espejo o cámara e identifica al menos tres características que te gusten (pueden ser los labios, la forma de los ojos, la nariz, etc.). Reflexiona sobre el motivo por el cual te gustan."
      },
      {
        title: "Sesión fotográfica personal",
        description: "Antes de acostarse, lávate bien la cara, péinate, perfúmate y tómate 6 fotos desde diferentes ángulos y con distintas expresiones. Mira tus fotos, escoge las mejores y piensa lo bien que se ven."
      }
    ]
  }
],
feedbackQuestions: [
  { question: "¿Crees que la belleza se valora subjetivamente? (SI / NO)", key: "bellezaSubjetiva" },
  { question: "¿Notaste algún cambio en la forma en que valoras tu apariencia facial? (SI / NO)", key: "cambioValoracion" },
  { question: "¿Te sentiste bien al observar tu rostro con más detalle durante varios días? (SI / NO)", key: "bienestarObservacion" }
],
        relatedQuestion: 9
      },

      // Pregunta 12
{
  id: 'recFisicoQ12',
  questionAsked: "¿Tengo un buen estado de salud?",
  questionAnsweredIncorrectly: true,
  title: "CUIDADO DE SALUD",
  description: `El estado de salud es un concepto referido al bienestar integral que tenemos física, psicológica y socialmente. Aunque muchas personas lo asocian solo con lo físico, enfermarse ocasionalmente no significa tener un mal estado de salud. Si el cuerpo reacciona ante agentes patógenos y luego se recupera, significa que tu sistema inmunológico funciona bien y tu estado de salud es estadísticamente “normal”.`,
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Visualización de salud",
          description: `Ubícate en un lugar tranquilo, cierra los ojos y respira lentamente. Imagina que tienes fiebre, pero tu cuerpo se regula y baja la fiebre. Visualiza cómo tus glóbulos blancos atacan a los agentes patógenos y ganan la batalla. Piensa en lo fuerte que es tu salud.`
        },
        {
          title: "Rutina de sueño saludable",
          description: `Acuéstate temprano (entre las 9 y 11 p.m.) y duerme entre 7 y 8 horas. Esto aumentará tu energía, bienestar y motivación, mejorando tu rendimiento académico y laboral.`
        },
        {
          title: "Siesta reparadora",
          description: `Después del almuerzo, toma una siesta de 20 minutos. Despiértate inmediatamente cuando suene la alarma para evitar sentirte más cansado/a.`
        },
        {
          title: "Plan de autocuidado",
          description: `Bebe 2 litros de agua al día, reduce alimentos ultraprocesados, disminuye el azúcar y la sal, y realiza al menos 20 minutos de actividad física que disfrutes.`
        }
      ]
    },
    {
      day: 2,
      activities: [
        {
          title: "Visualización de salud",
          description: `Ubícate en un lugar tranquilo, cierra los ojos y respira lentamente. Imagina que tienes fiebre, pero tu cuerpo se regula y baja la fiebre. Visualiza cómo tus glóbulos blancos atacan a los agentes patógenos y ganan la batalla. Piensa en lo fuerte que es tu salud.`
        },
        {
          title: "Rutina de sueño saludable",
          description: `Acuéstate temprano (entre las 9 y 11 p.m.) y duerme entre 7 y 8 horas. Esto aumentará tu energía, bienestar y motivación, mejorando tu rendimiento académico y laboral.`
        },
        {
          title: "Siesta reparadora",
          description: `Después del almuerzo, toma una siesta de 20 minutos. Despiértate inmediatamente cuando suene la alarma para evitar sentirte más cansado/a.`
        },
        {
          title: "Plan de autocuidado",
          description: `Bebe 2 litros de agua al día, reduce alimentos ultraprocesados, disminuye el azúcar y la sal, y realiza al menos 20 minutos de actividad física que disfrutes.`
        }
      ]
    },
    {
      day: 3,
      activities: [
        {
          title: "Visualización de salud",
          description: `Ubícate en un lugar tranquilo, cierra los ojos y respira lentamente. Imagina que tienes fiebre, pero tu cuerpo se regula y baja la fiebre. Visualiza cómo tus glóbulos blancos atacan a los agentes patógenos y ganan la batalla. Piensa en lo fuerte que es tu salud.`
        },
        {
          title: "Rutina de sueño saludable",
          description: `Acuéstate temprano (entre las 9 y 11 p.m.) y duerme entre 7 y 8 horas. Esto aumentará tu energía, bienestar y motivación, mejorando tu rendimiento académico y laboral.`
        },
        {
          title: "Siesta reparadora",
          description: `Después del almuerzo, toma una siesta de 20 minutos. Despiértate inmediatamente cuando suene la alarma para evitar sentirte más cansado/a.`
        },
        {
          title: "Plan de autocuidado",
          description: `Bebe 2 litros de agua al día, reduce alimentos ultraprocesados, disminuye el azúcar y la sal, y realiza al menos 20 minutos de actividad física que disfrutes.`
        },
        {
          title: "Revisión médica",
          description: `Si tienes preocupaciones específicas, acude a un profesional de la salud para evaluar tu estado general.`
        }
      ]
    }
  ],
  feedbackQuestions: [
    { question: "¿Notaste mejoras en tu bienestar físico después de hacer pequeños cambios en tu rutina?", key: "estadoSaludQ1" },
    { question: "¿Has implementado hábitos que te hacen sentir más saludable?", key: "estadoSaludQ2" },
    { question: "¿Sientes que tienes mayor control sobre tu salud después de informarte y tomar acción?", key: "estadoSaludQ3" },
    { question: "¿Se ha incrementado tu nivel de energía y bienestar en comparación con antes?", key: "estadoSaludQ4" }
  ],
  relatedQuestion: 12
},


      // Pregunta 18
{
  id: 'recFisicoQ18',
  questionAsked: "¿No estoy conforme con mi altura?",
  questionAnsweredIncorrectly: false,
  title: "ACEPTACIÓN DE ESTATURA",
  description: `Tu estatura es parte de quien eres. Aprende a proyectar confianza.`,
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Postura corporal",
          description: `Mejora tu postura para proyectar mayor seguridad: coloca los hombros hacia atrás, la cabeza en alto y camina con confianza.`
        },
        {
          title: "Uso de ropa estratégica",
          description: `Elige prendas que favorezcan tu silueta y perspectiva. Para personas bajas: pantalones de tiro alto y colores monocromáticos. Para personas altas: dividir el cuerpo con prendas de diferentes tonos.`
        },
        {
          title: "Escaneo corporal y meditación",
          description: `En un lugar libre de distracciones, acuéstate o siéntate cómodamente y cierra los ojos. Concéntrate en cada parte del cuerpo desde los pies hasta la cabeza, sin juicios negativos, durante 5 minutos. Luego, dedica 5 minutos a frases de autovaloración como “Acepto mi cuerpo tal y como es” o “Mi altura no define mi inteligencia”.`
        }
      ]
    },
    {
      day: 2,
      activities: [
        {
          title: "Postura corporal",
          description: `Mejora tu postura para proyectar mayor seguridad: coloca los hombros hacia atrás, la cabeza en alto y camina con confianza.`
        },
        {
          title: "Uso de ropa estratégica",
          description: `Elige prendas que favorezcan tu silueta y perspectiva. Para personas bajas: pantalones de tiro alto y colores monocromáticos. Para personas altas: dividir el cuerpo con prendas de diferentes tonos.`
        },
        {
          title: "Escaneo corporal y meditación",
          description: `En un lugar libre de distracciones, acuéstate o siéntate cómodamente y cierra los ojos. Concéntrate en cada parte del cuerpo desde los pies hasta la cabeza, sin juicios negativos, durante 5 minutos. Luego, dedica 5 minutos a frases de autovaloración como “Acepto mi cuerpo tal y como es” o “Mi altura no define mi inteligencia”.`
        }
      ]
    },
    {
      day: 3,
      activities: [
        {
          title: "Postura corporal",
          description: `Mejora tu postura para proyectar mayor seguridad: coloca los hombros hacia atrás, la cabeza en alto y camina con confianza.`
        },
        {
          title: "Uso de ropa estratégica",
          description: `Elige prendas que favorezcan tu silueta y perspectiva. Para personas bajas: pantalones de tiro alto y colores monocromáticos. Para personas altas: dividir el cuerpo con prendas de diferentes tonos.`
        },
        {
          title: "Escaneo corporal y meditación",
          description: `En un lugar libre de distracciones, acuéstate o siéntate cómodamente y cierra los ojos. Concéntrate en cada parte del cuerpo desde los pies hasta la cabeza, sin juicios negativos, durante 5 minutos. Luego, dedica 5 minutos a frases de autovaloración como “Acepto mi cuerpo tal y como es” o “Mi altura no define mi inteligencia”.`
        }
      ]
    }
  ],
  feedbackQuestions: [
    { question: "¿Mi postura me hace sentir más segura(o)?", key: "aceptacionEstaturaQ1" },
    { question: "¿La vestimenta que estoy eligiendo me hace verme mejor?", key: "aceptacionEstaturaQ2" },
    { question: "¿Sientes que te preocupa menos tu estatura en comparación con antes?", key: "aceptacionEstaturaQ3" }
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
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Discurso interno",
          description: `Reflexiona sobre el color de piel. Existen diferentes colores de piel debido a la evolución genética y el medio natural. Todos son bellos, y no hay un color "ideal". No permitas que las influencias negativas de los medios te hagan sentir mal. Con los ojos cerrados, repite 20 veces frases como: "Mi piel es hermosa y única", "amo el color de mi piel".`
        },
        {
          title: "Cuidado de la piel",
          description: `Sigue una rutina de hidratación (toma al menos 2 litros de agua), lávate la cara 4 veces al día y utiliza protección solar para mantenerla saludable.`
        }
      ]
    },
    {
      day: 2,
      activities: [
        {
          title: "Discurso interno",
          description: `Reconoce que muchos artistas y modelos comparten tu color de piel. Todos los tonos son bellos y diversos. No dejes que los medios definan tu valor. Con los ojos cerrados, repite 10 veces: "Mi piel es hermosa y única", "amo el color de mi piel", "debo cuidar más mi piel".`
        },
        {
          title: "Cuidado de la piel",
          description: `Hidrata tu piel (toma al menos 2 litros de agua), lávate la cara 4 veces al día y usa protector solar.`
        }
      ]
    },
    {
      day: 3,
      activities: [
        {
          title: "Discurso interno",
          description: `Recuerda que todos los tonos de piel son bellos. No dejes que las influencias negativas de los medios te afecten. Con los ojos cerrados, repite 10 veces: "Mi piel es hermosa y única", "amo el color de mi piel", "debo cuidar más mi piel, pues ella lo merece".`
        },
        {
          title: "Cuidado de la piel",
          description: `Hidrata tu piel (toma al menos 2 litros de agua), lávate la cara 4 veces al día y usa protector solar.`
        }
      ]
    }
  ],
  feedbackQuestions: [
    { question: "¿Has descubierto algo positivo sobre tu tono de piel que antes no habías considerado?", key: "valoracionPielQ1" },
    { question: "¿Cómo te has sentido después de mejorar el cuidado de tu piel?", key: "valoracionPielQ2" },
    { question: "¿Has cambiado la forma en que hablas o piensas sobre tu color de piel?", key: "valoracionPielQ3" },
    { question: "¿Te sientes más seguro/a al exponer tu piel sin cubrirla o maquillarla en exceso?", key: "valoracionPielQ4" }
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
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Psicoeducación",
          description: `Aprende a apreciar y aceptar tus ojos, un órgano fundamental que te permite leer, aprender y disfrutar de los paisajes y tu entorno. Desafía los estándares de belleza impuestos por los medios que buscan lucro.`
        },
        {
          title: "Auto reforzamiento",
          description: `Frente a un espejo, observa tus ojos y aprecia su forma, color, tamaño y brillo. Cierra los ojos y repite 10 veces frases como: "gracias a mis ojos puedo apreciar todo lo que me rodea", "amo el brillo de mis ojos", "amo la forma de mis ojos".`
        },
        {
          title: "Ejercicios de expresión",
          description: `Practica frente al espejo diferentes formas de mirar, buscando proyectar seguridad y simpatía.`
        },
        {
          title: "Fotografías y videos",
          description: `Dedica 15 minutos antes de dormir a tomarte fotos y grabarte para observar cómo tu mirada transmite emociones y estados de ánimo.`
        }
      ]
    },
    {
      day: 2,
      activities: [
        {
          title: "Psicoeducación",
          description: `Recuerda que tus ojos son esenciales para apreciar el mundo. Desafía los estándares de belleza irreales y valora lo que tus ojos te permiten hacer.`
        },
        {
          title: "Auto reforzamiento",
          description: `Frente a un espejo, observa tus ojos y aprecia su forma, color, tamaño y brillo. Cierra los ojos y repite 10 veces frases como: "gracias a mis ojos puedo apreciar todo lo que me rodea", "amo el brillo de mis ojos", "amo la forma de mis ojos".`
        },
        {
          title: "Ejercicios de expresión",
          description: `Practica frente al espejo diferentes formas de mirar, buscando proyectar seguridad y simpatía.`
        },
        {
          title: "Fotografías y videos",
          description: `Dedica 15 minutos antes de dormir a tomarte fotos y grabarte para observar cómo tu mirada transmite emociones y estados de ánimo.`
        }
      ]
    },
    {
      day: 3,
      activities: [
        {
          title: "Psicoeducación",
          description: `Recuerda que tus ojos son esenciales para apreciar el mundo. Desafía los estándares de belleza irreales y valora lo que tus ojos te permiten hacer.`
        },
        {
          title: "Auto reforzamiento",
          description: `Frente a un espejo, observa tus ojos y aprecia su forma, color, tamaño y brillo. Cierra los ojos y repite 10 veces frases como: "gracias a mis ojos puedo apreciar todo lo que me rodea", "me gusta el brillo de mis ojos", "amo la forma de mis ojos", "estoy feliz con mis ojos".`
        },
        {
          title: "Ejercicios de expresión",
          description: `Practica frente al espejo diferentes formas de mirar, buscando proyectar seguridad y simpatía.`
        },
        {
          title: "Fotografías y videos",
          description: `Dedica 15 minutos antes de dormir a tomarte fotos y grabarte para observar cómo tu mirada transmite emociones y estados de ánimo.`
        }
      ]
    }
  ],
  feedbackQuestions: [
    { question: "¿Has encontrado alguna característica de tus ojos que ahora te guste más?", key: "valoracionOjosQ1" },
    { question: "¿Notaste un cambio en tu expresión facial o en la forma en que te miras en el espejo?", key: "valoracionOjosQ2" },
    { question: "¿Probaste algún método para resaltar tu mirada? ¿Cómo te hizo sentir?", key: "valoracionOjosQ3" },
    { question: "¿Sientes que la percepción de tus ojos ha mejorado después de dedicar tiempo a apreciarlos más?", key: "valoracionOjosQ4" }
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
  days: [
    {
      day: 1,
      activities: [
        { title: "Ejercicio del espejo", description: "Al despertar, observa tu rostro..." },
        { title: "Sesión fotográfica personal", description: "Tómate fotos desde diferentes ángulos..." }
      ]
    },
    {
      day: 2,
      activities: [
        { title: "Actividad de gratitud", description: "Escribe tres cosas que te gusten de ti hoy." }
      ]
    },
    {
      day: 3,
      activities: [
        { title: "Reflexión final", description: "Reflexiona sobre los cambios que has notado en estos días." }
      ]
    }
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
  days: [
    {
      day: 1,
      activities: [
        { title: "Ejercicio del espejo", description: "Al despertar, observa tu rostro..." },
        { title: "Sesión fotográfica personal", description: "Tómate fotos desde diferentes ángulos..." }
      ]
    },
    {
      day: 2,
      activities: [
        { title: "Actividad de gratitud", description: "Escribe tres cosas que te gusten de ti hoy." }
      ]
    },
    {
      day: 3,
      activities: [
        { title: "Reflexión final", description: "Reflexiona sobre los cambios que has notado en estos días." }
      ]
    }
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
  days: [
    {
      day: 1,
      activities: [
        { title: "Ejercicio del espejo", description: "Al despertar, observa tu rostro..." },
        { title: "Sesión fotográfica personal", description: "Tómate fotos desde diferentes ángulos..." }
      ]
    },
    {
      day: 2,
      activities: [
        { title: "Actividad de gratitud", description: "Escribe tres cosas que te gusten de ti hoy." }
      ]
    },
    {
      day: 3,
      activities: [
        { title: "Reflexión final", description: "Reflexiona sobre los cambios que has notado en estos días." }
      ]
    }
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
  days: [
    {
      day: 1,
      activities: [
        { title: "Ejercicio del espejo", description: "Al despertar, observa tu rostro..." },
        { title: "Sesión fotográfica personal", description: "Tómate fotos desde diferentes ángulos..." }
      ]
    },
    {
      day: 2,
      activities: [
        { title: "Actividad de gratitud", description: "Escribe tres cosas que te gusten de ti hoy." }
      ]
    },
    {
      day: 3,
      activities: [
        { title: "Reflexión final", description: "Reflexiona sobre los cambios que has notado en estos días." }
      ]
    }
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
  days: [
    {
      day: 1,
      activities: [
        { title: "Ejercicio del espejo", description: "Al despertar, observa tu rostro..." },
        { title: "Sesión fotográfica personal", description: "Tómate fotos desde diferentes ángulos..." }
      ]
    },
    {
      day: 2,
      activities: [
        { title: "Actividad de gratitud", description: "Escribe tres cosas que te gusten de ti hoy." }
      ]
    },
    {
      day: 3,
      activities: [
        { title: "Reflexión final", description: "Reflexiona sobre los cambios que has notado en estos días." }
      ]
    }
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
  days: [
    {
      day: 1,
      activities: [
        { title: "Ejercicio del espejo", description: "Al despertar, observa tu rostro..." },
        { title: "Sesión fotográfica personal", description: "Tómate fotos desde diferentes ángulos..." }
      ]
    },
    {
      day: 2,
      activities: [
        { title: "Actividad de gratitud", description: "Escribe tres cosas que te gusten de ti hoy." }
      ]
    },
    {
      day: 3,
      activities: [
        { title: "Reflexión final", description: "Reflexiona sobre los cambios que has notado en estos días." }
      ]
    }
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
  days: [
    {
      day: 1,
      activities: [
        { title: "Ejercicio del espejo", description: "Al despertar, observa tu rostro..." },
        { title: "Sesión fotográfica personal", description: "Tómate fotos desde diferentes ángulos..." }
      ]
    },
    {
      day: 2,
      activities: [
        { title: "Actividad de gratitud", description: "Escribe tres cosas que te gusten de ti hoy." }
      ]
    },
    {
      day: 3,
      activities: [
        { title: "Reflexión final", description: "Reflexiona sobre los cambios que has notado en estos días." }
      ]
    }
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
  days: [
    {
      day: 1,
      activities: [
        { title: "Ejercicio del espejo", description: "Al despertar, observa tu rostro..." },
        { title: "Sesión fotográfica personal", description: "Tómate fotos desde diferentes ángulos..." }
      ]
    },
    {
      day: 2,
      activities: [
        { title: "Actividad de gratitud", description: "Escribe tres cosas que te gusten de ti hoy." }
      ]
    },
    {
      day: 3,
      activities: [
        { title: "Reflexión final", description: "Reflexiona sobre los cambios que has notado en estos días." }
      ]
    }
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
  days: [
    {
      day: 1,
      activities: [
        { title: "Ejercicio del espejo", description: "Al despertar, observa tu rostro..." },
        { title: "Sesión fotográfica personal", description: "Tómate fotos desde diferentes ángulos..." }
      ]
    },
    {
      day: 2,
      activities: [
        { title: "Actividad de gratitud", description: "Escribe tres cosas que te gusten de ti hoy." }
      ]
    },
    {
      day: 3,
      activities: [
        { title: "Reflexión final", description: "Reflexiona sobre los cambios que has notado en estos días." }
      ]
    }
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
  days: [
    {
      day: 1,
      activities: [
        { title: "Ejercicio del espejo", description: "Al despertar, observa tu rostro..." },
        { title: "Sesión fotográfica personal", description: "Tómate fotos desde diferentes ángulos..." }
      ]
    },
    {
      day: 2,
      activities: [
        { title: "Actividad de gratitud", description: "Escribe tres cosas que te gusten de ti hoy." }
      ]
    },
    {
      day: 3,
      activities: [
        { title: "Reflexión final", description: "Reflexiona sobre los cambios que has notado en estos días." }
      ]
    }
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
  days: [
    {
      day: 1,
      activities: [
        { title: "Ejercicio del espejo", description: "Al despertar, observa tu rostro..." },
        { title: "Sesión fotográfica personal", description: "Tómate fotos desde diferentes ángulos..." }
      ]
    },
    {
      day: 2,
      activities: [
        { title: "Actividad de gratitud", description: "Escribe tres cosas que te gusten de ti hoy." }
      ]
    },
    {
      day: 3,
      activities: [
        { title: "Reflexión final", description: "Reflexiona sobre los cambios que has notado en estos días." }
      ]
    }
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
  days: [
    {
      day: 1,
      activities: [
        { title: "Ejercicio del espejo", description: "Al despertar, observa tu rostro..." },
        { title: "Sesión fotográfica personal", description: "Tómate fotos desde diferentes ángulos..." }
      ]
    },
    {
      day: 2,
      activities: [
        { title: "Actividad de gratitud", description: "Escribe tres cosas que te gusten de ti hoy." }
      ]
    },
    {
      day: 3,
      activities: [
        { title: "Reflexión final", description: "Reflexiona sobre los cambios que has notado en estos días." }
      ]
    }
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
  days: [
    {
      day: 1,
      activities: [
        { title: "Ejercicio del espejo1", description: "Al despertar, observa tu rostro..." },
        { title: "Sesión fotográfica personal1", description: "Tómate fotos desde diferentes ángulos..." }
      ]
    },
    {
      day: 2,
      activities: [
        { title: "Actividad de gratitud", description: "Escribe tres cosas que te gusten de ti hoy." }
      ]
    },
    {
      day: 3,
      activities: [
        { title: "Reflexión final", description: "Reflexiona sobre los cambios que has notado en estos días." }
      ]
    }
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
  days: [
    {
      day: 1,
      activities: [
        { title: "Ejercicio del espejo2", description: "Al despertar, observa tu rostro..." },
        { title: "Sesión fotográfica personal2", description: "Tómate fotos desde diferentes ángulos..." }
      ]
    },
    {
      day: 2,
      activities: [
        { title: "Actividad de gratitud", description: "Escribe tres cosas que te gusten de ti hoy." }
      ]
    },
    {
      day: 3,
      activities: [
        { title: "Reflexión final", description: "Reflexiona sobre los cambios que has notado en estos días." }
      ]
    }
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
  days: [
    {
      day: 1,
      activities: [
        { title: "Ejercicio del espejo3", description: "Al despertar, observa tu rostro..." },
        { title: "Sesión fotográfica personal3", description: "Tómate fotos desde diferentes ángulos..." }
      ]
    },
    {
      day: 2,
      activities: [
        { title: "Actividad de gratitud", description: "Escribe tres cosas que te gusten de ti hoy." }
      ]
    },
    {
      day: 3,
      activities: [
        { title: "Reflexión final", description: "Reflexiona sobre los cambios que has notado en estos días." }
      ]
    }
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
  days: [
    {
      day: 1,
      activities: [
        { title: "Ejercicio del espejo4", description: "Al despertar, observa tu rostro..." },
        { title: "Sesión fotográfica personal4", description: "Tómate fotos desde diferentes ángulos..." }
      ]
    },
    {
      day: 2,
      activities: [
        { title: "Actividad de gratitud", description: "Escribe tres cosas que te gusten de ti hoy." }
      ]
    },
    {
      day: 3,
      activities: [
        { title: "Reflexión final", description: "Reflexiona sobre los cambios que has notado en estos días." }
      ]
    }
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
  days: [
    {
      day: 1,
      activities: [
        { title: "Ejercicio del espejo5", description: "Al despertar, observa tu rostro..." },
        { title: "Sesión fotográfica personal5", description: "Tómate fotos desde diferentes ángulos..." }
      ]
    },
    {
      day: 2,
      activities: [
        { title: "Actividad de gratitud", description: "Escribe tres cosas que te gusten de ti hoy." }
      ]
    },
    {
      day: 3,
      activities: [
        { title: "Reflexión final", description: "Reflexiona sobre los cambios que has notado en estos días." }
      ]
    }
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
  days: [
    {
      day: 1,
      activities: [
        { title: "Ejercicio del espejo6", description: "Al despertar, observa tu rostro..." },
        { title: "Sesión fotográfica personal6", description: "Tómate fotos desde diferentes ángulos..." }
      ]
    },
    {
      day: 2,
      activities: [
        { title: "Actividad de gratitud", description: "Escribe tres cosas que te gusten de ti hoy." }
      ]
    },
    {
      day: 3,
      activities: [
        { title: "Reflexión final", description: "Reflexiona sobre los cambios que has notado en estos días." }
      ]
    }
  ],
        relatedQuestion: 25
      }
    ]
  }
};


// Define correct answers for all relevant questions.
// This should match your correctAnswers.ts file.
export const mockCorrectAnswers: Record<number, boolean> = {
  /*
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

  */
1: true,
2: true,
3: true,
4: true,
5: true,
6: true,
7: true,
8: true,
9: true,
10: true,
11: true,
12: true,
13: true,
14: true,
15: true,
16: true,
17: true,
18: true,
19: true,
20: true,
21: true,
22: true,
23: true,
24: true,
25: true,
26: true,
27: true,
28: true,
29: true,
30: true,

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