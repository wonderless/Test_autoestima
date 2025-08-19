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
        description: `¡Felicidades! los resultados de la prueba demostraron un nivel alto de la autoestima física, esto quiere decir que mantienes una muy saludable valoración de tus características físicas, estimas muy bien tu contextura, piel, talla, peso, piel, etc., felicitaciones.
`
      }
    ],
    MEDIO: [
      {
        id: "fisicoMedio1",
        title: "Autoestima física nivel medio",
        description: `Con respecto a los resultados obtenidos, se pudo observar un nivel medio de autoestima física, esto quiere decir que mantienes una saludable valoración de tus características físicas, estimas bien tu contextura, piel, talla, peso, piel, etc., felicitaciones.`
      }
    ],
    BAJO: [
      // Pregunta 7
      {
        id: 'recFisicoQ7',
        questionAsked: "¿Considero que tengo bonito rostro?",
        questionAnsweredIncorrectly: false,
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
  questionAsked: "¿Me siento bien con mi peso?",
  questionAnsweredIncorrectly: false,
  title: "BIENESTAR CORPORAL",
  description: `Si tuvieras sobrepeso o un peso inferior a lo normal, es necesario mejorar la alimentación con el consejo de un nutricionista.

Vamos a realizar algunas actividades que nos ayudarán a mejorar nuestra relación con el cuerpo y la autoestima física.
`,
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Agradecimiento corporal",
          description:
            "Antes de dormir, dedica 5 minutos a pensar tres motivos por los cuales agradecer a tu cuerpo (ejemplo: 'El día de hoy, mis piernas me llevaron a donde quiero ir', 'Hoy día, mis brazos me permitieron abrazar a mis seres queridos').",
        },
        {
          title: "Actividad física",
          description:
            "Escoge una rutina de ejercicio que disfrutes (baile, natación, yoga, caminatas al aire libre), y realízala. Durante su realización, enfoca la atención en cómo se mueve y cómo se siente tu cuerpo, en lugar de centrarte en la apariencia o el rendimiento.",
        },
        {
          title: "Vístete para sentirte bien",
          description:
            "Usa ropa que te haga sentir cómodo/a y seguro/a, independientemente de la talla.",
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          title: "Agradecimiento corporal",
          description:
            "Antes de dormir, dedica 5 minutos a pensar tres motivos por los cuales agradecer a tu cuerpo (ejemplo: 'El día de hoy, mis piernas me llevaron a donde quiero ir', 'Hoy día, mis brazos me permitieron abrazar a mis seres queridos').",
        },
        {
          title: "Actividad física",
          description:
            "Escoge una rutina de ejercicio que disfrutes (baile, natación, yoga, caminatas al aire libre), y realízala. Durante su realización, enfoca la atención en cómo se mueve y cómo se siente tu cuerpo, en lugar de centrarte en la apariencia o el rendimiento.",
        },
        {
          title: "Vístete para sentirte bien",
          description:
            "Ponte ropas que te hagan sentir bien independientemente de la talla.",
        },
      ],
    },
    {
      day: 3,
      activities: [
        {
          title: "Agradecimiento corporal",
          description:
            "Antes de dormir, dedica 5 minutos a pensar tres motivos por los cuales agradecer a tu cuerpo (ejemplo: 'El día de hoy, mis piernas me llevaron a donde quiero ir', 'Hoy día, mis brazos me permitieron abrazar a mis seres queridos').",
        },
        {
          title: "Actividad física",
          description:
            "Escoge una rutina de ejercicio que disfrutes (baile, natación, yoga, caminatas al aire libre), y realízala. Durante su realización, enfoca la atención en cómo se mueve y cómo se siente tu cuerpo, en lugar de centrarte en la apariencia o el rendimiento.",
        },
        {
          title: "Vístete para sentirte bien",
          description:
            "Ponte ropas que te hagan sentir bien independientemente de la talla.",
        },
      ],
    },
  ],
  feedbackQuestions: [
    {
      question:
        "Describe dos aspectos positivos de tu cuerpo que antes no valorabas",
      key: "aspectosPositivos",
    },
    {
      question:
        "¿Has notado algún cambio positivo en la manera en que piensas sobre tu peso o figura? (SI / NO)",
      key: "cambioPensamiento",
    },
    {
      question:
        "¿Te sentiste bien al realizar actividades físicas sin la presión de bajar de peso, sino para disfrutar el movimiento? (SI / NO)",
      key: "bienestarMovimiento",
    },
    {
      question:
        "¿Te has sentido más cómodo/a usando la ropa que elegiste? (SI / NO)",
      key: "comodidadRopa",
    },
  ],
  relatedQuestion: 9,
},

      // Pregunta 12
{
  id: 'recFisicoQ12',
  questionAsked: "¿Tengo un buen estado de salud?",
  questionAnsweredIncorrectly: false,
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
  questionAnsweredIncorrectly: true,
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
  questionAnsweredIncorrectly: false,
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
  questionAnsweredIncorrectly: false,
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
        description: `¡Felicidades! Los resultados demostraron que posees un nivel alto de la dimensión de autoestima descrita. Las personas en esta categoría ya tienen una valoración positiva de su carácter, valores y su persona. Sin embargo, se puede propiciar que se mantengan en el tiempo. Las siguientes acciones fortalecer este nivel de autoestima. Primero Reflexionar sobre sus decisiones éticas y cómo afectan positivamente su entorno. Esto implica detenerse a analizar si las elecciones que toman día a día están alineadas con sus principios y cómo estas decisiones contribuyen a crear un impacto positivo en las personas que los rodean, ya sea en el ámbito laboral, familiar o social. Esta práctica refuerza la conexión con sus valores fundamentales y fomenta un sentido de propósito. Asi mismo, el Evaluar periódicamente si sus acciones actuales reflejan los valores que más aprecian. Es decir, Tomarse el tiempo para autoevaluarse permite identificar áreas donde podrían haber desvíos entre sus valores y sus comportamientos actuales. Este ejercicio no solo fortalece la autoestima, sino que también fomenta la coherencia personal y la autenticidad, elementos esenciales para mantener una autoestima alta.
`
      }
    ],
    MEDIO: [
      {
        id: "personalMedio1",
        title: "Autoestima personal nivel medio",
        description: `En referencia a los resultados, se obtuvo un nivel de autoestima personal medio lo cual evidencia una visión positiva y adecuada sobre  sí mismo, lo cual quiere decir que existe aprecio por las cualidades y actitudes propias de la personalidad. Felicitaciones`
      }
    ],
    BAJO: [
// Pregunta 3
{
  id: 'recPersonalQ3',
  questionAsked: "¿Tengo mal carácter?",
  questionAnsweredIncorrectly: true,
  title: "MANEJO DEL CARÁCTER",
  description: `El mal carácter suele relacionarse con una ausencia o falta de control de emociones ante situaciones donde la persona se puede llegar a frustrar. También es acompañado de una tendencia a mostrar comportamientos y/o conductas poco amigables hacia los demás.`,
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Reconocer la emoción (Autoconciencia)",
          description:
            "El primer día tiene como objetivo reconocer el mal carácter antes de reaccionar impulsivamente. Cada vez que sientas enojo, haz una pausa y pregúntate: '¿Qué estoy sintiendo en este momento?'. Nombra la emoción con claridad (frustración, molestia o irritación) y observa en qué parte de tu cuerpo la sientes (pecho tenso, puños apretados, calor en el rostro).",
        },
        {
          title: "Ejercicio de los cinco sentidos",
          description:
            "Para finalizar el día, realiza un ejercicio de conciencia plena: identifica cinco cosas que puedes ver, cuatro que puedes tocar, tres que puedes escuchar, dos que puedas oler y una que puedas saborear. Esto te permitirá calmar la mente y evitar reaccionar impulsivamente.",
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          title: "Identificación de detonantes",
          description:
            "Haz una lista de situaciones, palabras o conductas que te generen malestar. Escribe cómo reaccionas habitualmente (gritar, discutir, guardar silencio) y reflexiona si esas reacciones te ayudan a resolver el problema.",
        },
        {
          title: "Diseño de alternativas",
          description:
            "Escribe al menos tres formas más constructivas y respetuosas de reaccionar ante esos detonantes. Evalúa sus consecuencias en ti y en los demás, y elige la que consideres más adecuada para manejar mejor tu enojo.",
        },
        {
          title: "Respiración profunda 4-4-8",
          description:
            "Practica la técnica de respiración: inhala en 4 segundos, mantén el aire 4 segundos y exhala en 8 segundos. Repite varias veces hasta sentir calma.",
        },
      ],
    },
    {
      day: 3,
      activities: [
        {
          title: "Práctica consciente",
          description:
            "Durante el día, cada vez que sientas enojo, haz una pausa: respira profundo tres veces y cuenta hasta cinco antes de responder. Aplica la alternativa de respuesta elegida el día anterior, manteniendo un tono calmado y firme.",
        },
        {
          title: "Evaluación personal",
          description:
            "Al final del día, reflexiona si lograste controlar tu impulso, si evitaste un conflicto mayor y qué podrías mejorar. Ajusta tu plan si es necesario, recordando que el autocontrol se fortalece con la constancia.",
        },
      ],
    },
  ],
  feedbackQuestions: [
    {
      question: "¿Pudiste identificar tus emociones antes de actuar? (SI / NO)",
      key: "identificacionEmociones",
    },
    {
      question: "¿Notaste algún cambio físico luego de la sesión de respiración? (SI / NO)",
      key: "cambioFisicoRespiracion",
    },
    {
      question: "¿Te resultó fácil o difícil concentrarte en la respiración? (SI / NO)",
      key: "concentracionRespiracion",
    },
    {
      question: "¿Realizaste el ejercicio de los 5 sentidos? (SI / NO)",
      key: "ejercicioCincoSentidos",
    },
    {
      question: "¿Sentiste que tu mente se despejó o tu enojo disminuyó? (SI / NO)",
      key: "disminucionEnojo",
    },
  ],
  relatedQuestion: 3,
},


// Pregunta 8
{
  id: 'recPersonalQ8',
  questionAsked: "¿Siento que soy muy dependiente de los demás?",
  questionAnsweredIncorrectly: true,
  title: "DEPENDENCIA EMOCIONAL",
  description: `La dependencia emocional puede definirse como una condición psicológica en donde la persona tiene una necesidad excesiva de carácter afectivo, así como de atención, aprobación o apoyo de su entorno para sentirse validada, segura o inclusive ser feliz. Dicha dependencia puede llegar a ser insana al punto de afectar las decisiones de la persona y sus relaciones personales.`,
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Autoconocimiento y Detección de Patrones",
          description:
            "Reconoce en qué momentos y por qué buscas aprobación o compañía. Durante el día, registra una situación en la que buscaste atención o validación. Al llegar la noche, escribe: ¿Qué ocurrió?, ¿qué dijiste o hiciste?, ¿qué esperabas recibir? Identifica los pensamientos asociados (ej: 'No puedo solo/a') y la emoción principal (miedo, inseguridad, ansiedad), localizando dónde la sentiste en el cuerpo. Finalmente, aplica el ejercicio 'Yo decido': antes de actuar, pregúntate '¿Estoy diciendo esto porque lo creo o porque busco aprobación?'.",
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          title: "Autoobservación Consciente y Regulación",
          description:
            "Cuando aparezca el impulso de buscar atención, haz una pausa de 2 minutos. Pregúntate: '¿Qué estoy sintiendo?, ¿realmente necesito apoyo o solo validación para calmar mi inseguridad?'. Practica la respiración 3-3-6: inhala 3 segundos, mantén 3, exhala 6, tres ciclos. Al terminar el día, registra en tu cuaderno: ¿qué cambió después de la pausa?, ¿tomaste una decisión diferente?, ¿cómo te sentiste al actuar con más conciencia?",
        },
      ],
    },
    {
      day: 3,
      activities: [
        {
          title: "Reconexión y Reforzamiento Positivo",
          description:
            "Revisa tus registros anteriores e identifica un patrón de dependencia (ej: revisar el celular, buscar mensajes, evitar estar solo/a). Escribe al menos un logro del día que hayas hecho sin aprobación externa. Realiza un mindfulness de gratitud 5 minutos: respira lentamente y reconoce tres cosas positivas de tu día que no dependieron de nadie. Finaliza escribiendo una autoafirmación de independencia (ej: 'Puedo estar bien conmigo mismo/a sin depender de los demás') y léela en voz alta.",
        },
      ],
    },
  ],
  feedbackQuestions: [
    {
      question: "¿Identificaste en qué momentos buscaste aprobación de los demás? (SI / NO)",
      key: "identificacionAprobacion",
    },
    {
      question: "¿Sentiste más calma o claridad al actuar con conciencia en lugar de impulso? (SI / NO)",
      key: "calmaConciencia",
    },
  ],
  relatedQuestion: 8,
},


// Pregunta 10
{
  id: 'recPersonalQ10',
  questionAsked: "¿Me falta confiar más en mí mismo?",
  questionAnsweredIncorrectly: true,
  title: "CONFIANZA PERSONAL",
  description: `Poca confianza en sí mismo: Se refiere a la percepción negativa o limitada respecto a la propia persona, sus capacidades, la toma de decisiones o el poder enfrentar ciertas situaciones.`,
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Autoconocimiento y Autocompasión Inicial",
          description:
            "Recuerda un momento reciente en el que te hayas sentido incapaz o inseguro. Escríbelo en pocas líneas, describiendo cómo te sentiste. Luego, imagina que tu mejor amigo vive esa misma situación y redacta palabras de ánimo y comprensión que le dirías. Léelas en voz alta como si fueran para ti mismo/a.",
        },
        {
          title: "Inventario de fortalezas",
          description:
            "Escribe cinco cosas que sabes hacer bien (académicas, sociales, laborales o personales) e identifica dos situaciones en las que esas capacidades te ayudaron a resolver un problema. Reflexiona: '¿Cómo me sentiría si reconociera estos logros sin necesidad de la aprobación de otros?'.",
        },
        {
          title: "Observación de pensamientos autocríticos",
          description:
            "Anota tres momentos del día en los que pensaste algo negativo sobre ti mismo/a, como 'No puedo hacerlo' o 'Siempre fallo'. Escribe en qué situación surgieron y reflexiona: '¿Estos pensamientos me ayudan o me limitan?'.",
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          title: "Autoabrazo consciente",
          description:
            "Cierra los ojos, coloca tus manos sobre el pecho o rodéate con tus brazos y respira profundo. Mientras inhalas y exhalas, repite mentalmente: 'Está bien no ser perfecto, sigo aprendiendo' y 'Soy digno/a de confianza y respeto'. Registra cómo cambió tu estado emocional tras el ejercicio.",
        },
        {
          title: "Reestructuración de pensamientos",
          description:
            "Transforma los pensamientos negativos identificados en el día anterior. Ejemplo: 'No puedo hacerlo' → 'Puedo intentarlo y aprender en el proceso'. Cada vez que aparezca un pensamiento autocrítico, repite tu versión positiva y observa cómo se siente tu mente y tu cuerpo.",
        },
        {
          title: "Registro de logros diarios",
          description:
            "Antes de dormir, escribe tres logros del día, aunque sean pequeños (terminar una tarea, hablar con alguien, resolver un problema). Anota la cualidad personal que lo hizo posible (perseverancia, creatividad, responsabilidad). Repite mentalmente: 'Soy capaz y mis acciones lo demuestran'.",
        },
      ],
    },
    {
      day: 3,
      activities: [
        {
          title: "Carta de autocompasión",
          description:
            "Escríbete una carta desde la perspectiva de alguien que te quiere y confía en ti. Incluye palabras de aliento, reconocimiento y esperanza. Léela en voz alta y guárdala para cuando te sientas inseguro/a.",
        },
        {
          title: "Revisión de logros y fortalezas",
          description:
            "Revisa tus registros de los días anteriores y elige un logro que te haya hecho sentir orgulloso/a. Escríbelo en detalle: cómo lo conseguiste, qué aprendiste y cómo te sentiste al lograrlo.",
        },
        {
          title: "Autoafirmaciones frente al espejo",
          description:
            "Redacta tres frases de autoconfianza basadas en tus capacidades (ej: 'Confío en mi capacidad para resolver retos', 'Cada día soy más capaz y seguro/a de mí mismo/a'). Léelas en voz alta por la mañana y antes de dormir. Reflexiona cómo cambia tu seguridad personal al escucharte con convicción.",
        },
      ],
    },
  ],
  feedbackQuestions: [
    {
      question: "¿Lograste identificar virtudes y/o fortalezas propias? (SI / NO)",
      key: "identificacionFortalezas",
    },
    {
      question: "¿Experimentaste pensamientos positivos al realizar la actividad? (SI / NO)",
      key: "pensamientosPositivos",
    },
    {
      question: "¿Notaste algún cambio o mejora en tu forma de pensar sobre ti mismo/a? (SI / NO)",
      key: "cambioPensamiento",
    },
  ],
  relatedQuestion: 10,
},


// Pregunta 13
{
  id: 'recPersonalQ13',
  questionAsked: "¿Me parece que soy veloz para hacer mis quehaceres?",
  questionAnsweredIncorrectly: false,
  title: "DESEMPEÑO EN QUEHACERES",
  description: `Cada persona tiene su propio ritmo para realizar sus actividades, y eso está bien. Algunas personas pueden ser más rápidas, y otras optar por seguir una estrategia más reflexiva o metódica. Lo importante no es compararse con los demás, sino identificar si uno se siente satisfecho con la forma en que lleva a cabo sus tareas. Si sientes que podrías ser más ágil o eficiente, eso no significa que estés limitado, sino que tienes una excelente oportunidad para mejorar tus hábitos y descubrir nuevas formas de organizarte.`,
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Elaboración de lista de tareas",
          description:
            "Desarrolla una lista sobre actividades que tendrás que realizar en el día, ordenándolas según el nivel de prioridad y urgencia, y estableciendo un plazo de tiempo para completarlas usando alarmas o cronómetros. Establecer un cronograma ayudará a mejorar la organización y la planificación.",
        },
        {
          title: "Revisión y ajuste diario",
          description:
            "Evalúa qué tareas lograste completar y ajusta la planificación para el día siguiente, priorizando lo pendiente sin generar acumulación.",
        },
        {
          title: "Reducción de distractores",
          description:
            "Durante tu horario de actividades, silencia notificaciones de dispositivos y organiza tu espacio en un lugar libre de distracciones para minimizar interrupciones.",
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          title: "Elaboración de lista de tareas",
          description:
            "Desarrolla una lista sobre actividades que tendrás que realizar en el día, ordenándolas según el nivel de prioridad y urgencia, y estableciendo un plazo de tiempo para completarlas usando alarmas o cronómetros.",
        },
        {
          title: "Revisión y ajuste diario",
          description:
            "Evalúa qué tareas lograste completar y ajusta la planificación para el día siguiente, priorizando lo pendiente sin generar acumulación.",
        },
        {
          title: "Reducción de distractores",
          description:
            "Durante tu horario de actividades, silencia notificaciones de dispositivos y organiza tu espacio en un lugar libre de distracciones para minimizar interrupciones.",
        },
      ],
    },
    {
      day: 3,
      activities: [
        {
          title: "Elaboración de lista de tareas",
          description:
            "Desarrolla una lista sobre actividades que tendrás que realizar en el día, ordenándolas según el nivel de prioridad y urgencia, y estableciendo un plazo de tiempo para completarlas usando alarmas o cronómetros.",
        },
        {
          title: "Revisión y ajuste diario",
          description:
            "Evalúa qué tareas lograste completar y ajusta la planificación para el día siguiente, priorizando lo pendiente sin generar acumulación.",
        },
        {
          title: "Reducción de distractores",
          description:
            "Durante tu horario de actividades, silencia notificaciones de dispositivos y organiza tu espacio en un lugar libre de distracciones para minimizar interrupciones.",
        },
        {
          title: "Reflexión final",
          description:
            "Recuerda que comenzar con actividades pequeñas y realizarlas a tiempo puede ayudarte a sentirte más eficiente y capaz, fortaleciendo tu confianza personal y percepción de logro. Avanzar paso a paso también es una forma de ser veloz y efectivo.",
        },
      ],
    },
  ],
  feedbackQuestions: [
    {
      question: "¿Has notado mejoras en la rapidez o eficiencia con la que realizas tus actividades?",
      key: "mejorasRapidez",
    },
    {
      question: "¿Te organizas mejor para no dejar tus tareas para último momento?",
      key: "organizacionTareas",
    },
    {
      question: "¿Sientes que avanzas con más claridad y sin distracciones en tus quehaceres diarios?",
      key: "claridadDistracciones",
    },
  ],
  relatedQuestion: 13,
},


// Pregunta 20
{
  id: 'recPersonalQ20',
  questionAsked: "¿Siento que no soy muy respetuoso?",
  questionAnsweredIncorrectly: true,
  title: "RESPETO",
  description: `El respeto es la capacidad de reconocer y valorar a los demás, sus ideas, sentimientos, derechos y diferencias, tratando a cada persona con consideración y amabilidad. También implica actuar con integridad hacia uno mismo, cuidando lo que se dice y hace, incluso en situaciones difíciles. Practicar el respeto no significa estar de acuerdo con todo, sino expresarse de forma constructiva, sin dañar ni descalificar a otros. Tener la sensación de que uno no es suficientemente respetuoso puede generar incomodidad, pero también es una oportunidad para revisar nuestras actitudes y crecer como persona.`,
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Identificación de actitudes",
          description:
            "Después de una interacción social, reflexiona: ¿Cómo me comporté? Analiza si realizaste alguna actitud que pudo haber afectado a la otra persona. Observa también cómo reaccionó la otra persona (lenguaje verbal y no verbal) para identificar si expresó incomodidad.",
        },
        {
          title: "Práctica de empatía",
          description:
            "Antes de reaccionar ante una situación, pregúntate: '¿Cómo se sentiría esta persona si le hablo de esta manera?'. Reflexionar sobre si una conducta realizada podría generar malestar ayudará a fomentar una actitud respetuosa.",
        },
        {
          title: "Autorreflexión diaria",
          description:
            "Al finalizar el día, piensa en situaciones donde se pudo actuar de forma más respetuosa o en respuestas que pudieron resultar más satisfactorias, identificando oportunidades de mejora en tus interacciones.",
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          title: "Identificación de actitudes",
          description:
            "Después de una interacción social, reflexiona: ¿Cómo pude haber manejado la situación mejor? Identifica al menos una alternativa más adecuada. Pregúntate también: ¿Escuché con atención lo que la otra persona quería decirme?",
        },
        {
          title: "Práctica de empatía",
          description:
            "Antes de reaccionar ante una situación, pregúntate: '¿Cómo se sentiría esta persona si le hablo de esta manera?'. Esta reflexión fomenta la consideración hacia los demás.",
        },
        {
          title: "Autorreflexión diaria",
          description:
            "Al finalizar el día, piensa en situaciones donde se pudo actuar de una manera respetuosa, o en respuestas que pudieron resultar más satisfactorias, para identificar oportunidades de mejora.",
        },
      ],
    },
    {
      day: 3,
      activities: [
        {
          title: "Identificación de actitudes",
          description:
            "Después de una interacción social, reflexiona: ¿Cómo hablaste con la otra persona? Identifica expresiones que hayan sido positivas y algunas que podrían mejorar. Pregúntate también: ¿Respetaste una opinión incluso si fue distinta a la tuya?",
        },
        {
          title: "Práctica de empatía",
          description:
            "Antes de reaccionar ante una situación, pregúntate: '¿Cómo se sentiría esta persona si le hablo de esta manera?'. Esta reflexión refuerza la capacidad de actuar con respeto.",
        },
        {
          title: "Autorreflexión diaria",
          description:
            "Antes de dormir, piensa en situaciones donde pudiste actuar con más respeto, o en alternativas de respuesta que hubieran sido más constructivas.",
        },
        {
          title: "Gestos de respeto",
          description:
            "Proponte al menos un gesto de respeto al día: saludar, agradecer, escuchar sin interrumpir o pedir disculpas cuando sea necesario. Estos pequeños actos fortalecen tu identidad y mejoran tus relaciones.",
        },
      ],
    },
  ],
  feedbackQuestions: [
    {
      question: "¿Has estado más atento a cómo hablas y actúas con los demás?",
      key: "atencionConducta",
    },
    {
      question: "¿Crees que ahora escuchas con mayor respeto, incluso si no estás de acuerdo con alguien?",
      key: "escuchaRespetuosa",
    },
    {
      question: "¿Has intentado mostrar gestos de cortesía o empatía en tu día a día?",
      key: "gestosRespeto",
    },
  ],
  relatedQuestion: 20,
},


// Pregunta 26
{
  id: 'recPersonalQ26',
  questionAsked: "¿Realizo mis actividades sin el mayor temor?",
  questionAnsweredIncorrectly: false,
  title: "MANEJO DEL TEMOR",
  description: `Sentir miedo o inseguridad ante ciertas actividades es una experiencia humana común, sobre todo cuando sentimos que no tenemos todo bajo control o cuando tememos equivocarnos. Este tipo de temor no te hace débil; al contrario, te está mostrando que te importa hacerlo bien. Lo más importante es que no dejes que ese miedo te detenga por completo.`,
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Lista de temores",
          description:
            "Escribe qué actividades generan miedo o inseguridad a la hora de afrontarlas, y piensa en posibles alternativas que faciliten cómo se pueden enfrentar progresivamente.",
        },
        {
          title: "Enfrentamiento gradual",
          description:
            "Si un miedo es fuerte, enfréntalo poco a poco. Ejemplo: si da miedo hablar en público, empieza practicando frente al espejo.",
        },
        {
          title: "Visualización positiva",
          description:
            "Imagina enfrentando la situación con éxito antes de hacerlo en la realidad.",
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          title: "Lista de temores",
          description:
            "Escribe qué actividades generan miedo o inseguridad a la hora de afrontarlas, y piensa en posibles alternativas que faciliten cómo se pueden enfrentar progresivamente.",
        },
        {
          title: "Enfrentamiento gradual",
          description:
            "Si un miedo es fuerte, enfréntalo poco a poco. Ejemplo: si da miedo hablar en público, empieza practicando frente al espejo.",
        },
        {
          title: "Visualización positiva",
          description:
            "Imagina enfrentando la situación con éxito antes de hacerlo en la realidad.",
        },
      ],
    },
    {
      day: 3,
      activities: [
        {
          title: "Lista de temores",
          description:
            "Escribe qué actividades generan miedo o inseguridad a la hora de afrontarlas, y piensa en posibles alternativas que faciliten cómo se pueden enfrentar progresivamente.",
        },
        {
          title: "Enfrentamiento gradual",
          description:
            "Si un miedo es fuerte, enfréntalo poco a poco. Ejemplo: si da miedo hablar en público, empieza practicando frente al espejo.",
        },
        {
          title: "Visualización positiva",
          description:
            "Imagina enfrentando la situación con éxito antes de hacerlo en la realidad.",
        },
      ],
    },
  ],
  feedbackQuestions: [
    {
      question:
        "¿Sientes que ahora enfrentas con más confianza las actividades que antes te daban miedo?",
      key: "confianzaEnTemores",
    },
    {
      question:
        "¿Has intentado hacer algo que antes evitabas por temor o inseguridad? ¿Cómo te sentiste?",
      key: "accionesAntesEvitadas",
    },
    {
      question:
        "¿Notas algún cambio en la forma en que manejas tus nervios o dudas antes de actuar?",
      key: "manejoDeNervios",
    },
  ],
  relatedQuestion: 26,
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
// Pregunta 2 (Social)
{
  id: 'recSocialQ2',
  questionAsked: "Casi siempre cumplo con mis obligaciones",
  questionAnsweredIncorrectly: false,
  title: "CONCEPTO DE RESPONSABILIDAD SOCIAL",
  description: `La responsabilidad social no solo se relaciona con acciones grandes, 
sino también con el cumplimiento de pequeñas obligaciones cotidianas que permiten establecer confianza 
y credibilidad con las personas del entorno. 

Ser una persona responsable incrementa la autoestima social porque genera reconocimiento, respeto 
y aceptación por parte de los demás. 

Para ello, se recomienda realizar las siguientes actividades para mejorar la autoestima social:`,
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Lista de compromisos diarios",
          description:
            "Anota 3 tareas u obligaciones pequeñas del día (ej. enviar un mensaje pendiente, ayudar en casa, entregar un trabajo) y márcalas como 'cumplidas' al final del día.",
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          title: "Cumplir una promesa pequeña",
          description:
            "Haz una promesa pequeña a alguien (ej. 'Te enviaré el apunte hoy en la noche') y cúmplela. Al final del día, reflexiona cómo se sintió cumplir lo prometido.",
        },
      ],
    },
    {
      day: 3,
      activities: [
        {
          title: "Carta de reconocimiento",
          description:
            "Redacta una carta (puede ser ficticia) dirigida a alguien que te valore como persona responsable. Describe en ella al menos 3 situaciones donde sí cumpliste con tus obligaciones.",
        },
      ],
    },
  ],
  feedbackQuestions: [
    {
      question: "¿Sentiste satisfacción al cumplir con lo que te propusiste?",
      key: "satisfaccionCumplir",
    },
    {
      question: "¿Alguien notó o agradeció tus acciones responsables?",
      key: "agradecimientoAcciones",
    },
    {
      question: "¿Te sentiste más confiado al cumplir tus compromisos?",
      key: "confianzaCompromisos",
    },
  ],
  relatedQuestion: 2,
},


// Pregunta 4 (Social)
{
  id: 'recSocialQ4',
  questionAsked: "Muchas veces no cumplo con las tareas",
  questionAnsweredIncorrectly: true,
  title: "RESPONSABILIDAD Y CREACIÓN DE VÍNCULOS",
  description: `El hábito de postergar tareas afecta la autopercepción de competencia. 
Cumplir tareas pendientes refuerza la autoestima social porque mejora el rendimiento, genera confianza 
y permite responder con mayor seguridad en grupo. 

Ante ello, se proponen las siguientes actividades:`,
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Tarea breve completada",
          description:
            "Escoge una tarea pendiente breve y termínala en menos de 30 minutos. Luego, felicítate en voz alta o escribe una nota positiva sobre ti mismo por haberla completada.",
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          title: "Bloque de tarea social",
          description:
            "Programa un 'bloque de tarea social': completa algo que beneficie a un grupo (por ejemplo, avanzar un trabajo en equipo). Luego evalúa cómo contribuiste al objetivo grupal.",
        },
      ],
    },
    {
      day: 3,
      activities: [
        {
          title: "Evaluación semanal de tareas",
          description:
            "Evalúa tu semana: ¿cuántas tareas sí lograste terminar? Anota 3 factores que te ayudaron y piensa cómo mantenerlos.",
        },
      ],
    },
  ],
  feedbackQuestions: [
    {
      question: "¿Te sentiste bien al terminar una tarea que evitabas?",
      key: "satisfaccionTareas",
    },
    {
      question: "¿Notaste alguna mejora en la percepción que otros tienen sobre ti?",
      key: "percepcionOtros",
    },
    {
      question: "¿Tu estado de ánimo mejoró después de cumplir con una tarea?",
      key: "estadoAnimo",
    },
  ],
  relatedQuestion: 4,
},



// Pregunta 17
{
  id: 'recSocialQ17',
  questionAsked: "Se me hace difícil hacer amistad con otros(as) de mi edad",
  questionAnsweredIncorrectly: true,
  title: "CONFORT EN GRUPOS",
  description: `La dificultad para entablar amistades puede estar relacionada con el miedo al rechazo 
o la baja percepción de habilidades sociales. 

Mejorar la autoestima social implica reforzar la apertura, la iniciativa y el lenguaje corporal positivo.`,
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Iniciar conversación con pregunta abierta",
          description:
            "En una conversación cotidiana (presencial o por mensaje), haz al menos una pregunta abierta (por ejemplo: '¿Tú qué opinas sobre…?') para invitar al diálogo. Registra cómo fue la respuesta.",
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          title: "Práctica frente al espejo",
          description:
            "Practica frente al espejo saludos, sonrisas y frases para iniciar conversación. Luego, intenta aplicar una en una interacción real (saludo a compañero, comentario sobre una clase, etc.).",
        },
      ],
    },
    {
      day: 3,
      activities: [
        {
          title: "Lista de vínculos sociales",
          description:
            "Escribe una lista de personas con quienes te gustaría acercarte más. Elige una y mándale un mensaje breve y amable.",
        },
      ],
    },
  ],
  feedbackQuestions: [
    {
      question: "¿Lograste iniciar una conversación con alguien?",
      key: "iniciarConversacion",
    },
    {
      question: "¿Cómo te sentiste al practicar interacciones sociales?",
      key: "sensacionPracticaSocial",
    },
    {
      question: "¿Te sentiste más abierto(a) o menos nervioso(a) al hablar con otras personas?",
      key: "nerviosismoSocial",
    },
  ],
  relatedQuestion: 17,
},


// Pregunta 23
{
  id: 'recSocialQ23',
  questionAsked: "Casi siempre me divierto cuando cuentan chistes",
  questionAnsweredIncorrectly: false,
  title: "EXPRESIÓN DE OPINIONES",
  description: `Tener dificultad para disfrutar momentos sociales puede relacionarse con tensión, vergüenza 
o desconexión emocional. 

El disfrute compartido refuerza la autoestima social al fomentar vínculos y sentido de pertenencia.`,
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Compartir humor",
          description:
            "Mira un video humorístico breve o lee memes que te generen risa. Luego, comparte al menos uno con alguien de confianza.",
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          title: "Recordar un momento divertido",
          description:
            "Recuerda un momento divertido de tu infancia o adolescencia y cuéntaselo a alguien, resaltando cómo te sentiste en ese momento.",
        },
      ],
    },
    {
      day: 3,
      activities: [
        {
          title: "Observar el humor en grupo",
          description:
            "En un grupo, intenta prestar atención a las reacciones de otros cuando se cuenta un chiste. Trata de identificar cómo el humor une al grupo, incluso si no te causa risa inmediata.",
        },
      ],
    },
  ],
  feedbackQuestions: [
    {
      question: "¿Te sentiste más relajado/a al ver o compartir algo gracioso?",
      key: "relajacionHumor",
    },
    {
      question: "¿Notaste si los demás respondieron de forma positiva a tus comentarios?",
      key: "respuestaPositiva",
    },
    {
      question: "¿Te sentiste parte del grupo durante ese momento de humor?",
      key: "pertenenciaHumor",
    },
  ],
  relatedQuestion: 23,
},


// Pregunta 27
{
  id: 'recSocialQ27',
  questionAsked: "Colaboro frecuentemente con los demás",
  questionAnsweredIncorrectly: false,
  title: "ASERTIVIDAD",
  description: `La colaboración en actividades grupales fortalece la autoestima social al brindar un sentido 
de utilidad y pertenencia. 

Participar activa y voluntariamente genera respeto y facilita la construcción de relaciones.`,
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Ayuda espontánea",
          description:
            "Ayuda a un compañero o familiar con una tarea sencilla sin que te lo pidan. Luego, reflexiona cómo se sintió brindar apoyo.",
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          title: "Participación en actividad grupal",
          description:
            "Participa en una actividad grupal (académica, doméstica o recreativa). Identifica al final cuál fue tu rol y cómo influyó en el resultado.",
        },
      ],
    },
    {
      day: 3,
      activities: [
        {
          title: "Lista de formas de colaborar",
          description:
            "Redacta una lista de al menos 5 formas en que puedes colaborar con personas cercanas durante la semana.",
        },
      ],
    },
  ],
  feedbackQuestions: [
    {
      question: "¿Cómo te sentiste al ayudar o colaborar con alguien?",
      key: "sentirAyuda",
    },
    {
      question: "¿Percibiste alguna reacción positiva de la otra persona?",
      key: "reaccionPositiva",
    },
    {
      question: "¿Te sentiste útil o valorado/a por tu participación?",
      key: "valorUtilidad",
    },
  ],
  relatedQuestion: 27,
},

// Pregunta 29
{
  id: 'recSocialQ29',
  questionAsked: "Siento que soy un(a) buen(a) amigo(a)",
  questionAnsweredIncorrectly: false,
  title: "VALORACIÓN COMO PARTE DE UN VÍNCULO",
  description: `Una percepción negativa de uno mismo como amigo puede reflejar inseguridad o experiencias pasadas de rechazo. 
Sin embargo, la amistad también se aprende, se construye y se fortalece con pequeñas acciones que muestran interés, respeto y constancia.`,
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Carta de agradecimiento",
          description:
            "Escribe una carta o mensaje a un(a) amigo(a) agradeciéndole por algo específico que haya hecho por ti.",
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          title: "Mostrar interés",
          description:
            "Haz una llamada o videollamada breve para saber cómo está alguien. No necesitas un motivo especial, solo mostrar interés.",
        },
      ],
    },
    {
      day: 3,
      activities: [
        {
          title: "Reflexión sobre la amistad",
          description:
            "Reflexiona sobre lo que tú valoras en una amistad. ¿Tienes alguna de esas cualidades? Anótalas y piensa cómo puedes expresarlas más.",
        },
      ],
    },
  ],
  feedbackQuestions: [
    {
      question: "¿Sentiste que tus acciones fortalecieron algún lazo de amistad?",
      key: "fortalecerLazo",
    },
    {
      question: "¿Alguien agradeció tu interés o presencia?",
      key: "agradecimientoRecibido",
    },
    {
      question: "¿Notaste alguna cualidad en ti que te hace ser un buen amigo?",
      key: "cualidadAmistad",
    },
  ],
  relatedQuestion: 29,
}

    ]
  },
  academico: {
    ALTO: [
      {
        id: "academicoAlto1",
        title: "¡Felicidades! Autoestima académica alta",
        description: `¡Felicidades! Los resultados del test demostraron un nivel alto del autoestima descrita. Mantener una valoración positiva sobre las competencias intelectuales implica reconocer los logros obtenidos y enfrentar los retos novedosos con seguridad y confianza plena en las propias capacidades. Felicitaciones por tus resultados académica, resulta recomendable fomentar el aprendizaje continuo, ya sea participando en actividades académicas o explorando nuevas áreas de interés para incorporar nuevos conocimientos. Adicionalmente, el acto de compartir los aprendizajes y enseñar a otras personas ayuda a fortalecer y consolidar el conocimiento obtenido. Finalmente, y como punto más importante, es vital tomar en consideración el esfuerzo por encima de los resultados, teniendo en cuenta que el proceso para incorporar nuevos aprendizajes es tan importante como los logros obtenidos a través de estos.
`
      }
    ],
    MEDIO: [
      {
        id: "academicoMedio1",
        title: "Autoestima académica nivel medio",
        description: `En referencia a los resultados obtenidos, se evidenció un nivel medio de autoestima académica. Esto destaca la existencia de una valoración adecuada con respecto a las aptitudes académicas como la responsabilidad, aprendizaje, entre otros. Felicidades.`
      }
    ],
    BAJO: [
// Pregunta 1
{
  id: 'recAcademicoQ1',
  questionAsked: "¿Generalmente siento que me es fácil aprender?",
  questionAnsweredIncorrectly: false,
  title: "AUTOEFICACIA EN EL APRENDIZAJE",
  description: `La facilidad para aprender no es una cualidad innata, sino un conjunto de hábitos, estrategias y actitudes que se desarrollan con el tiempo. Sentir que aprender es difícil puede estar vinculado a experiencias negativas previas, métodos poco adecuados o creencias limitantes sobre la propia capacidad. Sin embargo, todo ser humano puede construir una relación más eficiente y positiva con el aprendizaje si organiza su estudio, identifica sus recursos personales y adopta una actitud proactiva ante el error y la mejora.

La siguiente rutina busca fortalecer la percepción de autoeficacia en el proceso de aprendizaje mediante actividades estructuradas y accesibles.`,
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Reflexión sobre experiencias previas",
          description:
            "Escribe tres situaciones en las que lograste aprender algo nuevo, aunque haya tomado más tiempo de lo esperado. Incluye aprendizajes académicos o personales. Describe cómo lo lograste y qué te motivó a continuar.",
        },
        {
          title: "Lectura guiada",
          description:
            "Investiga brevemente el concepto de 'neuroplasticidad'. Comprender que el cerebro cambia constantemente y puede crear nuevas conexiones facilita una visión más optimista del aprendizaje.",
        },
        {
          title: "Frases de reafirmación",
          description:
            "Frente al espejo, repite las siguientes afirmaciones: \n- 'El aprendizaje no es cuestión de rapidez, sino de constancia.'\n- 'Cada paso que doy me acerca al conocimiento.'\n- 'Mi mente tiene la capacidad de crecer cada día.'",
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          title: "Elaboración de una ruta de aprendizaje",
          description:
            "Selecciona un tema que consideres difícil. Divídelo en partes pequeñas y específicas (subtemas) y organiza la secuencia en la que los abordarás.",
        },
        {
          title: "Identificación de recursos personales",
          description:
            "Determina qué tipo de recursos te resultan más útiles: videos, esquemas, clases orales, resúmenes escritos, mapas mentales, etc. Escoge el formato que mejor se adapte a tu estilo de aprendizaje.",
        },
        {
          title: "Aplicación práctica breve",
          description:
            "Estudia un subtema durante 25 minutos. Luego, sin ver el material, intenta explicártelo a ti mismo en voz alta o escribir lo comprendido. Esto consolida el aprendizaje mediante la autoevaluación.",
        },
      ],
    },
    {
      day: 3,
      activities: [
        {
          title: "Comparación con días previos",
          description:
            "Revisa lo que sabías del tema al inicio de la semana y compáralo con lo que eres capaz de explicar ahora. Identifica tres avances concretos.",
        },
        {
          title: "Registro de logros",
          description:
            "Anota diariamente un aprendizaje nuevo, por más simple que parezca. Puede ser académico, técnico, emocional o social. Este registro refuerza la percepción de progreso.",
        },
        {
          title: "Afirmaciones conscientes",
          description:
            "Frente al espejo, repite: \n- 'Mi forma de aprender es válida.'\n- 'Estoy desarrollando estrategias que funcionan para mí.'\n- 'Aprender requiere paciencia, y yo estoy en ese camino.'",
        },
      ],
    },
  ],
  feedbackQuestions: [
    {
      question:
        "¿Reconociste que has sido capaz de aprender cosas valiosas, aunque al inicio no lo creyeras posible?",
      key: "reconocimientoAprendizajes",
    },
    {
      question:
        "¿Identificaste un estilo de estudio que se ajuste mejor a tus características personales?",
      key: "estiloDeEstudio",
    },
    {
      question:
        "¿Qué cambió en tu actitud frente al aprendizaje después de aplicar esta rutina?",
      key: "cambioDeActitud",
    },
    {
      question:
        "¿Sientes que tu percepción sobre tu capacidad para aprender ha mejorado?",
      key: "percepcionAprender",
    },
  ],
  relatedQuestion: 1,
},

 // Pregunta 5
{
  id: 'recAcademicoQ5',
  questionAsked: "¿No soy bueno(a) para dar exámenes?",
  questionAnsweredIncorrectly: true,
  title: "MANEJO DE ANSIEDAD ANTE EXÁMENES",
  description: `La evaluación académica es una situación que puede generar elevados niveles de tensión emocional. En muchas ocasiones, no se trata de una falta de conocimientos, sino de la percepción negativa sobre las propias capacidades o del miedo a fallar. Esta ansiedad puede intensificarse por experiencias pasadas, autocríticas constantes o comparaciones con los demás. 

La presente rutina busca favorecer un afrontamiento más funcional de las situaciones evaluativas a través de la preparación emocional, cognitiva y práctica.`,
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Técnica de respiración 4-4-8",
          description:
            "Al despertar, ubícate en un lugar silencioso. Inhala por la nariz contando hasta 4, mantén el aire en los pulmones durante 4 segundos y exhala lentamente por la boca contando hasta 8. Repite el ciclo cinco veces para reducir la ansiedad anticipatoria.",
        },
        {
          title: "Diálogo interno constructivo",
          description:
            "Frente al espejo, repite las siguientes frases en voz alta:\n- 'Estoy preparado para esta evaluación.'\n- 'Confío en el esfuerzo que realicé.'\n- 'Un resultado no define mi valor como persona.'\nReflexiona unos minutos sobre cuál de estas frases te resulta más significativa.",
        },
        {
          title: "Registro de experiencias pasadas",
          description:
            "En una hoja, redacta una experiencia anterior en la que rendiste un examen y obtuviste un resultado aceptable o mejor de lo esperado. Describe qué estrategias aplicaste en ese momento que podrían replicarse ahora.",
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          title: "Prueba de simulación",
          description:
            "Elige un tema que domines parcialmente. Establece cinco preguntas relacionadas y respóndelas bajo un límite de tiempo (20 minutos aprox.). Luego revisa tus respuestas enfocándote en lo aprendido, no en los errores.",
        },
        {
          title: "Restructuración de creencias",
          description:
            "Identifica tres pensamientos negativos frecuentes antes de un examen (ej. 'voy a olvidar todo'). Reemplázalos por alternativas más realistas (ej. 'puedo recordar lo importante').",
        },
        {
          title: "Exposición progresiva",
          description:
            "Haz una pequeña exposición oral del tema elegido frente a un familiar, amigo o grabación personal. Esto te ayuda a habituarte a la presión moderada y ganar confianza académica.",
        },
      ],
    },
    {
      day: 3,
      activities: [
        {
          title: "Ensayo con autorreflexión",
          description:
            "Resuelve nuevamente una breve prueba, escribiendo una frase de aliento antes y después de cada respuesta. Esto refuerza el autodiálogo positivo en medio de la exigencia.",
        },
        {
          title: "Evaluación del progreso",
          description:
            "Revisa las pruebas simuladas de los días previos e identifica al menos tres mejoras en tu desempeño o manejo emocional.",
        },
        {
          title: "Visualización guiada",
          description:
            "Cierra los ojos durante cinco minutos e imagina cómo llegas al aula o espacio del examen, cómo te sientas con tranquilidad, lees las preguntas y respondes con serenidad. Esta anticipación ayuda a reducir la ansiedad y reforzar la autoeficacia.",
        },
      ],
    },
  ],
  feedbackQuestions: [
    {
      question:
        "¿Sentiste algún cambio emocional luego de realizar ejercicios de respiración y visualización?",
      key: "cambioEmocional",
    },
    {
      question:
        "¿Lograste transformar pensamientos negativos en afirmaciones realistas?",
      key: "transformacionPensamientos",
    },
    {
      question:
        "¿Notaste una mejora en tu desempeño durante las simulaciones?",
      key: "mejoraDesempeno",
    },
    {
      question:
        "¿Consideras que podrías aplicar estas estrategias el día de un examen real?",
      key: "aplicacionEstrategias",
    },
  ],
  relatedQuestion: 5,
},



// Pregunta 14 (Académico)
{
  id: 'recAcademicoQ14',
  questionAsked: "¿Casi siempre soluciono los problemas académicos que enfrento?",
  questionAnsweredIncorrectly: false,
  title: "AFRONTAMIENTO ACADÉMICO",
  description: `El afrontamiento académico implica la capacidad de identificar un problema, comprender sus causas y buscar soluciones de manera efectiva. 

Cuando una persona percibe que no puede resolver sus dificultades académicas, es frecuente que surjan emociones como frustración, desánimo o evasión. Sin embargo, los problemas académicos no deben ser interpretados como fracasos, sino como oportunidades para desarrollar estrategias más funcionales, mejorar la organización personal y fortalecer la autoestima.

Esta rutina busca potenciar el afrontamiento académico mediante el reconocimiento, planificación y ejecución de soluciones concretas.`,
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Ejercicio de zonas de influencia",
          description:
            "Dibuja tres círculos concéntricos. En el primero (zona de control), escribe lo que depende de ti (ej. estudiar, pedir ayuda). En el segundo (zona de influencia), aspectos que puedes influir parcialmente (ej. comunicación con docentes). En el tercero (zona de no control), lo que no depende de ti (ej. cambios en el horario).",
        },
        {
          title: "Identificación del problema académico actual",
          description:
            "Elige una dificultad académica presente (ej. bajo rendimiento en un curso) y descríbela en máximo cinco líneas.",
        },
        {
          title: "Regulación emocional",
          description:
            "Practica respiración consciente durante cinco minutos para disminuir la tensión y mejorar la claridad mental.",
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          title: "Análisis del problema",
          description:
            "Responde por escrito: ¿Qué origina este problema? ¿Qué recursos necesito para resolverlo? ¿Qué he intentado hasta ahora? ¿Qué no he probado aún?",
        },
        {
          title: "Diseño de un plan de acción",
          description:
            "Escribe pasos concretos con verbos de acción y metas específicas. Ejemplo:\n1. Revisar el contenido de la semana pasada.\n2. Solicitar una tutoría.\n3. Resolver tres ejercicios prácticos.",
        },
        {
          title: "Gestión del tiempo",
          description:
            "Asigna fechas específicas a cada paso usando una agenda, hoja de planificación semanal o app (ej. Google Calendar o Trello).",
        },
      ],
    },
    {
      day: 3,
      activities: [
        {
          title: "Revisión de cumplimiento",
          description:
            "Verifica si cumpliste los pasos planeados. Si no fue posible, reflexiona sin juzgarte: ¿qué lo impidió?, ¿cómo puedo ajustarlo?",
        },
        {
          title: "Frases de reafirmación personal",
          description:
            "Frente al espejo, repite frases como:\n- 'Estoy aprendiendo a resolver mis dificultades con calma y organización.'\n- 'Cada paso que doy me acerca a mi meta académica.'\n- 'Tengo derecho a equivocarme y seguir intentando.'",
        },
        {
          title: "Gratificación programada",
          description:
            "Si cumpliste al menos dos de los pasos, date un premio breve (leer, caminar, escuchar música). Esto refuerza tu motivación.",
        },
      ],
    },
  ],
  feedbackQuestions: [
    {
      question:
        "¿Pudiste identificar claramente un problema académico que te afecte actualmente?",
      key: "identificacionProblema",
    },
    {
      question:
        "¿Notaste alguna diferencia al dividir el problema en pasos concretos y ejecutables?",
      key: "divisionPasos",
    },
    {
      question:
        "¿Te resultó útil distinguir entre lo que puedes controlar y lo que no?",
      key: "distinguirControl",
    },
    {
      question:
        "¿Has sentido mayor confianza al tomar decisiones frente a los desafíos académicos?",
      key: "confianzaDecisiones",
    },
  ],
  relatedQuestion: 14,
},


// Pregunta 15 (Académico)
{
  id: 'recAcademicoQ15',
  questionAsked: "¿Soy bueno para llegar a tiempo a la escuela?",
  questionAnsweredIncorrectly: true,
  title: "HÁBITO DE PUNTUALIDAD",
  description: `La puntualidad es un hábito que influye directamente en el desempeño académico, la organización personal y la percepción que se tiene sobre uno mismo. 

Llegar tarde de forma recurrente no siempre refleja desinterés, sino que puede estar asociado a una mala gestión del tiempo, falta de planificación o rutinas poco funcionales. 

Establecer hábitos consistentes y estructurados permite mejorar la autoestima académica al generar una sensación de control, responsabilidad y compromiso.

Esta rutina de tres días busca fortalecer la puntualidad escolar.`,
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Autoevaluación del tiempo",
          description:
            "Al finalizar el día, escribe cómo organizas tu mañana. Detalla la hora en que despiertas, cuánto dura cada actividad y qué distracciones surgen.",
        },
        {
          title: "Diseño de rutina matutina",
          description:
            "Elabora una lista secuencial con tiempos estimados. Ejemplo:\n- Despertar: 6:30 a.m.\n- Aseo personal: 6:30 – 6:50 a.m.\n- Desayuno: 6:50 – 7:10 a.m.\n- Vestirse y alistarse: 7:10 – 7:30 a.m.",
        },
        {
          title: "Preparación previa",
          description:
            "Antes de acostarte, deja lista la ropa, los útiles académicos y la lonchera/alimentos necesarios. Esto reducirá la toma de decisiones en la mañana y evitará retrasos.",
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          title: "Rutina de sueño saludable",
          description:
            "Fija una hora de dormir entre 9:00 p.m. y 10:30 p.m. Apaga pantallas 30 min antes. Prepara un ambiente de descanso: luz tenue, silencio y ropa cómoda.",
        },
        {
          title: "Control del tiempo real",
          description:
            "Cronometra cuánto tardas en realizar tu rutina matutina. Compáralo con tu estimación del día anterior y ajusta si es necesario.",
        },
        {
          title: "Estrategia de anticipación",
          description:
            "Pon una alarma 15 min antes de la hora real de salida. Úsala como margen de seguridad para imprevistos.",
        },
      ],
    },
    {
      day: 3,
      activities: [
        {
          title: "Simulación completa",
          description:
            "Realiza toda tu rutina matutina como si fueras a clases, incluso si no debes asistir. Evalúa si logras salir a tiempo sin apuros.",
        },
        {
          title: "Autoobservación y reflexión",
          description:
            "Escribe tres beneficios de levantarte y prepararte con tiempo (ejemplo: más calma, desayuno completo, puntualidad).",
        },
        {
          title: "Frases de afirmación",
          description:
            "Frente al espejo, repite:\n- 'Mi tiempo es valioso y lo administro con responsabilidad.'\n- 'Soy capaz de llegar a tiempo y cumplir con mis deberes.'\n- 'Cada día construyo hábitos que fortalecen mi bienestar académico.'",
        },
      ],
    },
  ],
  feedbackQuestions: [
    {
      question:
        "¿Identificaste con claridad en qué parte de tu rutina diaria pierdes más tiempo?",
      key: "tiempoPerdido",
    },
    {
      question:
        "¿Lograste organizar tu mañana con mayor eficacia después de estructurarla?",
      key: "organizacionManana",
    },
    {
      question:
        "¿Notaste alguna diferencia emocional al llegar a tiempo o estar listo antes de la hora habitual?",
      key: "diferenciaEmocional",
    },
    {
      question:
        "¿Te sentiste más seguro y satisfecho contigo mismo al cumplir con el horario establecido?",
      key: "seguridadSatisfaccion",
    },
  ],
  relatedQuestion: 15,
},


// Pregunta 16 (Académico)
{
  id: 'recAcademicoQ16',
  questionAsked: "¿Soy un buen alumno en clase?",
  questionAnsweredIncorrectly: false,
  title: "AUTOEFICACIA ACADÉMICA",
  description: `La percepción que una persona tiene sobre su rendimiento en el aula puede verse afectada por factores como la falta de reconocimiento personal, dificultades de atención, baja motivación o ausencia de hábitos de estudio.

Considerarse un “mal alumno” no necesariamente refleja la realidad objetiva, sino una autoevaluación subjetiva influida por experiencias y expectativas. 

Reestructurar esta percepción implica identificar logros reales, construir hábitos académicos saludables y reafirmar el compromiso con el aprendizaje.`,
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Análisis FODA personal",
          description:
            "Divide una hoja en 4 cuadrantes y completa:\n- Fortalezas: ¿Qué haces bien académicamente?\n- Oportunidades: ¿Qué factores externos pueden ayudarte?\n- Debilidades: ¿Qué necesitas mejorar?\n- Amenazas: ¿Qué puede dificultar tu desempeño?",
        },
        {
          title: "Reflexión personal",
          description:
            "Copia tu lista de fortalezas en una cartulina o nota visible. Léela cada mañana antes de empezar tu día.",
        },
        {
          title: "Visualización guiada",
          description:
            "Cierra los ojos por 3 minutos e imagina que participas activamente en clase, comprendes los temas y recibes comentarios positivos. Incluye el mayor detalle posible.",
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          title: "Planificación semanal",
          description:
            "Elabora una agenda con 3 actividades clave por día (ejemplo: repasar una lección, resolver una práctica, asistir a clase). Define metas realistas y medibles.",
        },
        {
          title: "Reforzamiento conductual",
          description:
            "Si cumples al menos 2 actividades programadas, date una recompensa (caminar, escuchar música, preparar una bebida favorita).",
        },
        {
          title: "Reflexión escrita",
          description:
            "Responde: ¿Qué cosas hago hoy que no hacía hace un mes? ¿Qué significa para mí ser un buen estudiante?",
        },
      ],
    },
    {
      day: 3,
      activities: [
        {
          title: "Autoevaluación semanal",
          description:
            "Revisa tu agenda y marca las tareas cumplidas. Escribe un breve comentario sobre cómo te sentiste al realizarlas.",
        },
        {
          title: "Reconocimiento del esfuerzo",
          description:
            "Frente al espejo, repite:\n- 'Estoy avanzando en mi camino académico.'\n- 'Mis esfuerzos tienen valor, aunque los resultados aún no sean visibles.'\n- 'Estoy construyendo una versión más comprometida de mí mismo.'",
        },
        {
          title: "Comparación objetiva",
          description:
            "Revisa tu FODA del día 1. ¿Hay algún cambio? Agrega al menos una nueva fortaleza y una oportunidad identificada durante estos días.",
        },
      ],
    },
  ],
  feedbackQuestions: [
    {
      question:
        "¿Lograste reconocer aspectos positivos en tu desempeño académico que antes no valorabas?",
      key: "reconocimientoAspectos",
    },
    {
      question:
        "¿Sentiste que tener un plan semanal te ayudó a organizarte mejor?",
      key: "organizacionSemanal",
    },
    {
      question:
        "¿Te permitió esta rutina sentirte más comprometido con tu rol de estudiante?",
      key: "compromisoRol",
    },
    {
      question:
        "¿Cambió tu forma de definir lo que significa ser un 'buen alumno'?",
      key: "definicionBuenAlumno",
    },
  ],
  relatedQuestion: 16,
},


// Pregunta 25 (Académico)
{
  id: 'recAcademicoQ25',
  questionAsked: "¿Siento que tengo una buena inteligencia?",
  questionAnsweredIncorrectly: false,
  title: "PERCEPCIÓN DE INTELIGENCIA",
  description: `La inteligencia no es un rasgo fijo ni uniforme; se manifiesta de múltiples maneras: lógica, lingüística, emocional, creativa, interpersonal, entre otras.

Muchas personas limitan su autopercepción intelectual al rendimiento académico o a los resultados numéricos, lo cual puede afectar la autoestima. 

Reforzar una visión más amplia y realista de las capacidades cognitivas permite desarrollar mayor confianza y disposición para afrontar nuevos retos.`,
  days: [
    {
      day: 1,
      activities: [
        {
          title: "Reconocimiento de habilidades",
          description:
            "Haz una lista de 5 situaciones recientes en las que resolviste un problema, aprendiste algo nuevo o ayudaste a alguien a comprender una idea. Anota qué habilidades usaste (ejemplo: análisis, creatividad, escucha activa, memoria).",
        },
        {
          title: "Afirmaciones frente al espejo",
          description:
            "Repite en voz clara:\n- 'Tengo habilidades que valen y me representan.'\n- 'Mi inteligencia no depende de comparaciones ni calificaciones.'\n- 'Estoy dispuesto a seguir aprendiendo cada día.'",
        },
        {
          title: "Rutina de activación cognitiva",
          description:
            "Dedica 15 minutos a una actividad que estimule tu pensamiento (lectura crítica, rompecabezas, escritura libre o juegos de lógica). Hazlo en un ambiente relajado, sin presión.",
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          title: "Definir un objetivo SMART",
          description:
            "Elige un objetivo académico y defínelo con el método SMART:\n- Específico: ¿Qué quiero lograr?\n- Medible: ¿Cómo sabré que lo logré?\n- Alcanzable: ¿Es posible con mis recursos?\n- Relevante: ¿Por qué es importante para mí?\n- Temporal: ¿En cuánto tiempo lo alcanzaré?\nEscríbelo en un cuaderno o cartel visible.",
        },
        {
          title: "Planificación estructurada",
          description:
            "Diseña un cronograma para cumplir con tu objetivo SMART. Distribuye actividades en días y horarios, dejando espacio para revisiones y ajustes.",
        },
        {
          title: "Reflexión escrita",
          description:
            "Responde: ¿Qué me dice este objetivo sobre la confianza que tengo en mi inteligencia? ¿Qué barreras me estoy animando a superar?",
        },
      ],
    },
    {
      day: 3,
      activities: [
        {
          title: "Registro de avances",
          description:
            "Revisa lo realizado en los días anteriores. Anota 3 logros concretos, aunque parezcan pequeños, que alcanzaste al aplicar esta rutina.",
        },
        {
          title: "Visualización constructiva",
          description:
            "Siéntate en un lugar tranquilo, cierra los ojos e imagina que explicas un tema con claridad a otras personas. Observa tu lenguaje corporal, tu seguridad y el impacto positivo en los demás.",
        },
        {
          title: "Frases de reafirmación intelectual",
          description:
            "Frente al espejo, repite:\n- 'Mi forma de pensar es valiosa y única.'\n- 'Soy capaz de resolver desafíos y seguir creciendo.'\n- 'La inteligencia también se cultiva, y yo ya estoy en ese camino.'",
        },
      ],
    },
  ],
  feedbackQuestions: [
    {
      question:
        "¿Identificaste formas de inteligencia que antes no valorabas en ti mismo?",
      key: "formasInteligencia",
    },
    {
      question:
        "¿Cómo te sentiste al establecer un objetivo SMART y comenzar a cumplirlo?",
      key: "objetivoSMART",
    },
    {
      question:
        "¿Qué actividades te ayudaron a reconocer tu capacidad intelectual con mayor claridad?",
      key: "actividadesReconocimiento",
    },
    {
      question:
        "¿Percibes algún cambio en la forma en que te defines académicamente?",
      key: "cambioDefinicion",
    },
  ],
  relatedQuestion: 25,
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
5: false,
6: false,//
7: true,
8: false,
9: true,
10: false,
11: false,//
12: true,
13: true,
14: true,
15: false,
16: true,
17: false,
18: false,
19: false,//
20: false,
21: true,
22: false,//
23: true,
24: false,//
25: true,
26: true,
27: true,
28: true,
29: true,
30: false,//

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
    academico: [1, 5, 14, 15, 16, 25],
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