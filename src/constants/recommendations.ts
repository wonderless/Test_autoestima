
interface RecommendationItem {
    title: string;
    description: string;
    activity: string;
  }
interface CategoryRecommendations {
    personal: {
      ALTO: RecommendationItem[];
      MEDIO: RecommendationItem[];
      BAJO: RecommendationItem[];
    };
    social: {
      ALTO: RecommendationItem[];
      MEDIO: RecommendationItem[];
      BAJO: RecommendationItem[];
    };
    academico: {
      ALTO: RecommendationItem[];
      MEDIO: RecommendationItem[];
      BAJO: RecommendationItem[];
    };
    fisico: {
      ALTO: RecommendationItem[];
      MEDIO: RecommendationItem[];
      BAJO: RecommendationItem[];
    };
  } 
  export const getDetailedRecommendations = (category: string, level: string, dayOfWeek: number): RecommendationItem[] => {
    const recommendations: CategoryRecommendations = {
        personal: {
            ALTO: [
                {
                    title: "FELICIDADES",
                    description: `¡Felicidades! Los resultados demostraron que posees un nivel alto de la dimensión de autoestima descrita. Las personas en esta categoría ya tienen una valoración positiva de su carácter, valores y su persona. Sin embargo, se puede propiciar que se mantengan en el tiempo. Las siguientes acciones fortalecer este nivel de autoestima:\n
                    1. Reflexionar sobre sus decisiones éticas y cómo afectan positivamente su entorno. Esto implica detenerse a analizar si las elecciones que toman día a día están alineadas con sus principios y cómo estas decisiones contribuyen a crear un impacto positivo en las personas que los rodean, ya sea en el ámbito laboral, familiar o social.\n
                    2. Esta práctica refuerza la conexión con sus valores fundamentales y fomenta un sentido de propósito.\n
                    3. Evaluar periódicamente si sus acciones actuales reflejan los valores que más aprecian. Es decir, tomarse el tiempo para autoevaluarse permite identificar áreas donde podrían haber desvíos entre sus valores y sus comportamientos actuales.\n
                    Este ejercicio no solo fortalece la autoestima, sino que también fomenta la coherencia personal y la autenticidad, elementos esenciales para mantener una autoestima alta.`,
                    activity: {
                    }[dayOfWeek] || "Sin actividades pendientes"
                },
            ],
        MEDIO: [
          {
            title: "1.	Practicar ejercicios de reestructuración cognitiva",
            description: `Los ejercicios de reestructuración cognitiva tienen como finalidad reducir la constante autocrítica que la persona puede llegar a realizar sobre sí mismo, reemplazando estos pensamientos por otros de carácter amable. Para aplicar esta estrategia, se pueden realizar las siguientes tareas: 
            ● Identificar cuáles son las reacciones que son frecuentes al juzgarse: ¿Cuáles son las cosas por las que en su mayoría te juzgas? (Trabajo, familia, amor, amistad, etc.). ¿Qué tipo de lenguaje emplea al tratarse? ¿Cuáles son los resultados que se obtiene al ser tan duro consigo mismo? ¿Sientes que te motivas o, por el contrario, sientes desánimo y te sientes deprimido(a)? 
            ● Profundizar en lo que representan los errores en la persona: ¿Cuáles son las medidas que tomas al equivocarte? ¿Priorizas tu bienestar personal o apuntas a resolver la situación dejando de lado cómo te sientes? ¿Tu percepción es fatídica sobre las cosas? Es decir, ¿crees que a todo el mundo le va mejor que a ti? 
            ● Ejercicios de abrazos: A veces, en situaciones difíciles donde te sientas mal contigo mismo, lo que realmente necesitas es entrar en contacto con un poco de calidez humana, por medio de un abrazo el cual transmite serenidad, tranquilidad, amor y ternura. 
            ● Trabajar con el crítico interno que tenemos dentro de nosotros: Ocasionalmente, puede haber una voz dentro de uno mismo que te trata con cierta dureza, por ello, para dejar de ser tan duros con nosotros, es necesario aprender a manejar esta voz. Si has hecho algo malo, en lugar de pensar: “Lo has vuelto a hacer, eres un tonto(a)”, podrías emplear palabras como: “Sé que intentaste hacer lo mejor que pudiste y, si bien no conseguiste lo que querías, ahora sabes cómo puedes mejorar”; teniendo como prioridad reemplazar aquellos pensamientos negativos por apreciaciones positivas. `,
            activity: {
                0: `
                
                
                Domingo – Reflexión y Preparación
                1. Piensa en algo que aprendiste esta semana sobre ti mismo/a.
                2. Planea una acción positiva para la próxima semana, como darte un elogio diario.
                3. Disfruta un momento de calma antes de dormir, sin pantallas ni preocupaciones.
                `,
                1: `Lunes – Conciencia de los Pensamientos
                1. Tómate 1 minuto para identificar un pensamiento negativo sobre ti mismo/a y anótalo en
                una hoja o en tu celular.
                2. Respóndelo con una frase más amable, como si se lo dijeras a un amigo.
                3. Haz algo que te haga sentir bien, como escuchar tu canción favorita o tomar una bebida
                caliente con calma.
                `,
                2: `Martes – Reconociendo tus Esfuerzos
                1. Anota una cosa que hiciste bien hoy, aunque sea algo pequeño, como levantarte a tiempo
                o ayudar a alguien.
                2. Di en voz alta una afirmación positiva, como “Estoy haciendo lo mejor que puedo y eso
                está bien”.
                3. Respira profundamente por 30 segundos cuando sientas estrés o frustración.`,
                3: `Miércoles – Deteniendo la Autocrítica
                1. Cada vez que te critiques hoy, dite ‘Basta’ y reformula el pensamiento ,en algo más
                compasivo.
                2. Mira al espejo y sonríe por 10 segundos. Aunque parezca simple, genera un cambio en tu
                estado de ánimo.
                3. Aprecia un logro del día, por más pequeño que sea, y celébralo con una pausa o un
                respiro profundo.
                `,
                4: `Jueves – Conectando con el Bienestar
                1. Abraza a alguien o a ti mismo por unos segundos y nota cómo te hace sentir.
                2. Haz algo por ti hoy, como ver un video gracioso o caminar por unos minutos.
                3. Dite algo positivo antes de dormir ,como “Mañana es un nuevo día y estoy aprendiendo a
                valorarme”.`,
                5: `Viernes – Terminando la Semana con Amor Propio
                1. Reconoce tres cosas buenas de tu semana, incluso si fueron pequeñas.
                2. Mándale un mensaje bonito a alguien y nota cómo te hace sentir dar algo positivo.
                3. Permítete un momento de descanso sin culpa, aunque sean 5 minutos de tranquilidad`,
                6: `Sábado – Actividad Relajante y Motivadora
                1. Escribe una cualidad que te guste de ti, en una nota o en tu celular.
                2. Muévete un poco: baila, estira o camina, solo por disfrutar el movimiento.
                3. Dedica un momento a algo que realmente disfrutes, sin distracciones.
                `
            }[dayOfWeek] || ""
              
        },
        {
          title: "2.	Trabajar con el dolor mediante el mindfulness",
          description: `Pensar que exponerse al dolor es algo inimaginable en la actualidad, pero trabajar con experiencias que impliquen situaciones incómodas y dolorosas puede potenciar la interiorización de los pensamientos que tengamos sobre ellas y, como resultado, facilitar la gestión de estos pensamientos. Por ejemplo, si has identificado que en tu trabajo no cumples con el prototipo o cualidades necesarias para desempeñarte de la mejor manera, por lo que recibes críticas constantes de tu equipo de trabajo, podrías seguir estos pasos: 
          ● Aceptar el dolor: Reconocer que no cumplir con las expectativas genera tristeza y dolor, y que sentirte así es una reacción normal. 
          ● Cuestionar el diálogo interno negativo: Pregúntate si es cierto que tu desempeño es completamente ineficaz. Busca evidencia que respalde o refute esta creencia. 
          ● Redirigir los pensamientos: Imagina cómo consolarías a un amigo en la misma situación. ¿Qué palabras de ánimo usarías? Aplica esas mismas palabras contigo mismo. 
          ● Aceptar las críticas: Reconoce que las críticas son parte de la vida cotidiana y pueden ser herramientas de crecimiento. `,
          activity: {
              0: `Domingo – Reflexión y gratitud por el proceso
              1. Revisa cómo manejaste tus emociones esta semana y reconoce tu esfuerzo.
              2. Anota tres cosas por las que te sientas agradecido, incluso pequeñas.
              3. Cierra el día con 1 minuto de respiración profunda y un pensamiento positivo.
              `,
              1: `Lunes – Aceptar el dolor sin resistencias
              1. Reconocer cómo te sientes: Dedica 1 minuto a identificar y nombrar tu emoción sin
              juzgarla.
              2. Respiración consciente: Inhala y exhala profundamente por 30 segundos cuando sientas
              malestar.
              3. Escribe una frase de aceptación, como "Es normal sentirse así, esta emoción no me
              define".
              `,
              2: `Martes – Cuestionar el diálogo interno negativo
              1. Registra un pensamiento autocrítico que surja durante el día.
              2. Pregúntate si realmente es cierto o si hay otra forma de verlo.
              3. Sustitúyelo por una frase más realista y amable, como “Estoy aprendiendo y mejorando”.
              `,
              3: `Miércoles – Redirigir los pensamientos negativos
              1. Visualiza cómo animarías a un amigo que estuviera en tu misma situación.
              2. Dite esas mismas palabras en voz alta o escríbelas en una nota.
              3. Haz una pausa de 1 minuto para centrarte en tu respiración cuando aparezca la
              autocrítica`,
              4: `Jueves – Aceptar las críticas sin que te definan
              1. Cuando recibas una crítica, respira hondo antes de reaccionar.
              2. Pregúntate: "¿Qué puedo aprender de esto?" en lugar de tomarlo como un ataque.
              3. Recuerda una crítica pasada que te ayudó a mejorar y agradécelo mentalmente`,
              5: `Viernes – Soltar la tensión emocional con mindfulness
              1. Escanea tu cuerpo y detecta dónde sientes tensión (hombros, mandíbula, etc.).
              2. Relaja conscientemente esa zona con respiraciones profundas.
              3. Haz un pequeño acto de autocuidado, como beber algo caliente o darte un masaje en las
              manos.
              `,
              6: `Sábado – Reinterpretar las experiencias difíciles
              1. Piensa en una situación dolorosa y trata de verla desde otra perspectiva (ejemplo: como
              un aprendizaje).
              2. Anota una lección positiva que hayas sacado de ella.
              3. Realiza una actividad que te conecte con el presente, como escuchar música o caminar
              sin distracciones.
              .`
          }[dayOfWeek] || ""
            
      },
      {
        title: "3. Clarificación de valores",
        description: `Cuando una persona presenta dificultades para identificar y vivir en congruencia con sus valores, puede experimentar confusión, insatisfacción y conflictos internos. Esto puede generar un sentimiento de falta de dirección y propósito. Para fortalecer la conexión con los valores personales
        `,
        activity: {
            0: `Domingo – Reflexión sin presión
            1. Sin juzgarte, piensa si viviste esta semana en congruencia con lo que realmente te
            importa.
            2. Si hay algo que quisieras ajustar, visualiza un pequeño cambio para la próxima semana.
            3. Disfruta un momento de calma sin preocuparte por "hacerlo perfecto".
            `,
            1: `Lunes – Conectando con lo que es importante
            1. Piensa en un momento en el que te sentiste realmente bien contigo mismo/a.
            2. Escribe tres cosas que valoras en la vida (ejemplo: amistad, aprendizaje, libertad).
            3. Haz algo pequeño alineado con uno de esos valores (ejemplo: llamar a un amigo si
            valoras la conexión).
            `,
            2: `Martes – Observando la congruencia con los valores
            1. Elige un valor importante para ti y nota si tus acciones diarias reflejan ese valor.
            2. Haz un pequeño ajuste en tu día para vivir ese valor (ejemplo: si valoras la honestidad, sé
            sincero en una conversación).
            3. Antes de dormir, piensa en un momento del día donde actuaste de acuerdo a tus valores.
            `,
            3: `Miércoles – Explorando lo que te inspira.
            1. Recuerda una persona que admiras y piensa en qué valores representa.
            2. Elige uno de esos valores e intenta aplicarlo en algo simple hoy.
            3. Haz una pausa y pregúntate: "¿Qué me gustaría hacer más en mi vida para sentirme en
            paz conmigo mismo/a?"
            `,
            4: `Jueves – Escuchando la voz interior
            1. Tómate 1 minuto para preguntarte: "¿Estoy tomando decisiones alineadas con mis
            valores?"
            2. Si notas un pequeño desajuste, haz una acción mínima para corregirlo.
            3. Escribe una frase que te motive a ser más auténtico con tus valores.
            `,
            5: `Viernes – Encuentra satisfacción en lo que haces
            1. Piensa en una tarea cotidiana y encuentra una forma de hacerla más alineada con tus
            valores.
            2. Haz algo que te haga sentir conectado contigo mismo/a, aunque sea por 5 minutos.
            3. Reconoce al menos una decisión que tomaste esta semana con base en tus valores.
            `,
              6: `Sábado – Divirtiéndose con los valores
            1. Haz una actividad que disfrutes y que refleje tus valores (ejemplo: si valoras la
            creatividad, dibuja o escribe algo).
            2. Comparte algo positivo con alguien (un mensaje, una sonrisa, un agradecimiento).
            3. Permítete un momento de gratitud por quién eres y lo que valoras.`
        }[dayOfWeek] || ""
          
    },
        ],
        BAJO: [
          {
            title: "1. Practicar ejercicios de reestructuración cognitiva",
            description: `Los ejercicios de reestructuración cognitiva tienen como finalidad reducir la constante autocrítica que la persona puede llegar a realizar sobre sí mismo, reemplazando estos pensamientos por otros de carácter amable. Para aplicar esta estrategia, se pueden realizar las siguientes tareas: 
            ● Identificar cuáles son las reacciones que son frecuentes al juzgarse: ¿Cuáles son las cosas por las que en su mayoría te juzgas? (Trabajo, familia, amor, amistad, etc.). ¿Qué tipo de lenguaje emplea al tratarse? ¿Cuáles son los resultados que se obtiene al ser tan duro consigo mismo? ¿Sientes que te motivas o, por el contrario, sientes desánimo y te sientes deprimido(a)? 
            ● Profundizar en lo que representan los errores en la persona: ¿Cuáles son las medidas que tomas al equivocarte? ¿Priorizas tu bienestar personal o apuntas a resolver la situación dejando de lado cómo te sientes? ¿Tu percepción es fatídica sobre las cosas? Es decir, ¿crees que a todo el mundo le va mejor que a ti? 
            ● Ejercicios de abrazos: A veces, en situaciones difíciles donde te sientas mal contigo mismo, lo que realmente necesitas es entrar en contacto con un poco de calidez humana, por medio de un abrazo el cual transmite serenidad, tranquilidad, amor y ternura. 
            ● Trabajar con el crítico interno que tenemos dentro de nosotros: Ocasionalmente, puede haber una voz dentro de uno mismo que te trata con cierta dureza, por ello, para dejar de ser tan duros con nosotros, es necesario aprender a manejar esta voz. Si has hecho algo malo, en lugar de pensar: “Lo has vuelto a hacer, eres un tonto(a)”, podrías emplear palabras como: “Sé que intentaste hacer lo mejor que pudiste y, si bien no conseguiste lo que querías, ahora sabes cómo puedes mejorar”; teniendo como prioridad reemplazar aquellos pensamientos negativos por apreciaciones positivas.`,
            activity: {
                0:  `Domingo – Reflexión y refuerzo positivo\n\n\n
                2. Revisión semanal: Reflexiona sobre cómo te hablaste durante la semana y qué
                cambios notaste.
                3. Diálogo con el futuro yo: Escribe una carta para leer en el futuro recordándote que
                mereces trato amable.
                4. Plan de reestructuración: Define un objetivo para la próxima semana que te ayude
                a seguir practicando la autocompasión. `,
                1: `Lunes – Identificación de la autocrítica
                1. Registro de pensamientos: Escribe tres pensamientos autocríticos recurrentes y
                analiza en qué situaciones aparecen.
                2. Cuestionamiento de la crítica interna: Pregúntate si realmente es cierto lo que te
                dices y busca evidencia en contra.
                3. Lenguaje compasivo: Reformula cada pensamiento negativo con una frase amable
                y realista.
                `,
                2: `Martes – Explorando la relación con los errores
                1. Diálogo interno reflexivo: Anota un error reciente y describe cómo reaccionaste
                ante él. ¿Fuiste demasiado duro contigo?
                2. Cambio de perspectiva: Escribe cómo interpretarías ese mismo error si le pasara a
                un amigo.
                3. Técnica del espejo: Frente a un espejo, di en voz alta: “Soy humano/a, cometer
                errores es parte del crecimiento”.
                `,
                3: `Miércoles – Cultivar el autocuidado emocional
                1. Ejercicio del abrazo: Si sientes angustia o frustración, cruza los brazos sobre tu pecho y presiónalos suavemente durante 20 segundos.
                2. Palabras de consuelo: Escribe una carta breve dándote apoyo a ti mismo en un
                momento difícil.
                3. Ejercicio de gratitud: Enumera tres cosas que valoras de ti mismo, sin importar lo
                pequeñas que parezcan.`,
                4: `Jueves – Desactivando al crítico interno
                1. Conciencia del diálogo interno: Presta atención a cómo te hablas durante el día y
                cada vez que notes una autocrítica, respira y reformúlala en un tono más compasivo.
                2. Ejercicio del consejero sabio: Imagina que una versión más sabia y amorosa de ti
                mismo te da consejos en momentos difíciles.
                3. Mantra positivo: Crea una frase de apoyo y repítela a lo largo del día (ejemplo:
                “Estoy aprendiendo y mejorando cada día”).
                `,
                5: `Viernes – Transformación de pensamientos limitantes
                1. Cuestionario de la realidad: Toma un pensamiento negativo y responde: “¿Es
                100% cierto? ¿Cómo lo vería otra persona? ¿Me ayuda pensar así?”.
                2. Reescritura de la historia: Piensa en un evento difícil y escribe una nueva versión
                en la que te hables con más amabilidad.
                3. Visualización de éxito: Dedica 5 minutos a imaginarte enfrentando un desafío con
                confianza y resiliencia`,
                6: `Sábado – Autocompasión en la acción
                1. Pequeño acto de amor propio: Realiza una acción solo para ti, como escuchar tu
                canción favorita o disfrutar un momento de calma.
                2. Evaluación de logros: Escribe tres cosas que hayas logrado en la semana, sin
                importar cuán pequeñas sean.
                3. Apreciación externa: Pregunta a alguien cercano qué cualidades valora en ti.
                Anótalas y léelas en voz alta.
                `
            }[dayOfWeek] || ""
              
        },
        {
          title: "2. Trabajar con el dolor mediante el mindfulness",
          description: `Pensar que exponerse al dolor es algo inimaginable en la actualidad, pero trabajar con experiencias que impliquen situaciones incómodas y dolorosas puede potenciar la interiorización de los pensamientos que tengamos sobre ellas y, como resultado, facilitar la gestión de estos pensamientos. Por ejemplo, si has identificado que en tu trabajo no cumples con el prototipo o cualidades necesarias para desempeñarte de la mejor manera, por lo que recibes críticas constantes de tu equipo de trabajo, podrías seguir estos pasos: 
          ● Aceptar el dolor: Reconocer que no cumplir con las expectativas genera tristeza y dolor, y que sentirte así es una reacción normal. 
          ● Cuestionar el diálogo interno negativo: Pregúntate si es cierto que tu desempeño es completamente ineficaz. Busca evidencia que respalde o refute esta creencia. 
          ● Redirigir los pensamientos: Imagina cómo consolarías a un amigo en la misma situación. ¿Qué palabras de ánimo usarías? Aplica esas mismas palabras contigo mismo. 
          ● Aceptar las críticas: Reconoce que las críticas son parte de la vida cotidiana y pueden ser herramientas de crecimiento. `,
          activity: {
              0: `Domingo
              1. Reflexión semanal: Escribe sobre los momentos en los que aplicaste la aceptación
              del dolor y cómo te sentiste.
              2. Recompensa personal: Reconócete por los avances hechos en la semana con un
              gesto significativo para ti.
              3. Planificación positiva: Visualiza la próxima semana con optimismo y escribe un
              objetivo pequeño que quieras cumplir.`,
              1: `Lunes
              1. Práctica de aceptación: Dedica 5 minutos a respirar profundamente y reconocer
              cualquier emoción negativa sin juzgarla. Simplemente obsérvala y acéptala.
              2. Reestructuración cognitiva: Anota un pensamiento negativo sobre ti mismo y
              escribe al lado tres razones por las que podría no ser completamente cierto.
              3. Afirmaciones positivas: Frente al espejo, repite tres frases que refuercen tu
              autoestima, como "Soy valioso/a más allá de mis errores".
              `,
              2: `Martes
              1. Registro de emociones: Lleva un pequeño diario donde anotes cuándo te sientes
              desvalorizado/a y qué lo desencadenó.
              2. Ejercicio de gratitud: Identifica tres aspectos positivos de tu desempeño en el
              trabajo o en tu vida personal.
              3. Mindfulness en la autocompasión: Durante el día, cada vez que te critiques,
              respira profundo y reformula el pensamiento en un tono más amable.`,
              3: `Miércoles
              1. Aceptación del dolor: Recuerda un momento difícil reciente, reconoce la emoción
              que sentiste y permítete experimentarla sin reprimirla.
              2. Diálogo interno positivo: Habla contigo mismo/a como lo harías con un amigo en
              una situación similar.`,
              4: `Jueves
              1. Meditación guiada sobre aceptación: Escucha una meditación de 10 minutos
              enfocada en aceptar las emociones.
              2. Cambio de perspectiva: Reflexiona sobre un error o crítica que recibiste y
              encuentra al menos una lección positiva en ello.
              3. Ejercicio de refuerzo personal: Escribe una carta a tu “yo del pasado” dándole
              ánimos y apoyo por los momentos difíciles.
              `,
              5: `Viernes
              1. Conciencia del lenguaje: Durante el día, presta atención a cómo hablas de ti
              mismo/a y cámbialo si es negativo.
              2. Acto de autocuidado: Regálate un momento de placer, como leer algo que
              disfrutes, escuchar música relajante o tomar un té.
              `,
              6: `Sábado
1. Visualización positiva: Dedica unos minutos a imaginarte en un escenario donde
superas una dificultad con confianza.
2. Escucha activa: Ten una conversación con alguien y concéntrate en comprender sin
juzgar, aplicando la misma paciencia contigo mismo/a.
3. Desconexión digital: Evita redes sociales por unas horas y dedica ese tiempo a
una actividad que realmente disfrutes.`
          }[dayOfWeek] || ""
            
      },
      {
        title: "3. Clarificación de valores",
        description: `Cuando una persona presenta dificultades para identificar y vivir en congruencia con sus valores, puede experimentar confusión, insatisfacción y conflictos internos. Esto puede generar un sentimiento de falta de dirección y propósito. Para fortalecer la conexión con los valores personales. Es necesario poner en práctica las siguientes actividades:`,
        activity: {
            0: `Domingo-Revisión y planificación
            1. Reflexionar sobre los avances de la semana en la clarificación de valores.
            2. Ajustar la lista de valores si es necesario.
            3. Planificar nuevas acciones para seguir fortaleciéndolos en la siguiente semana`,
            1: `Lunes-Reflexión y autoconocimiento
            1. Escribir tres valores personales y describir por qué son importantes.
            2. Recordar un momento en que se haya actuado en congruencia con esos valores.
            3. Reflexionar sobre una situación reciente donde no se respetaron esos valores y qué
            se podría haber hecho diferente.
            `,
            2: `Martes-Evaluación de congruencia
            1. Analizar las decisiones tomadas en la última semana y determinar si reflejan los
            valores personales.
            2. Identificar una acción concreta para alinear mejor los valores con las decisiones.
            3. Crear un plan breve de mejora basado en lo identificado.
            `,
            3: `Miércoles- Propósito y metas
            1. Escribir una declaración de propósito personal basada en valores.
            2. Definir una meta a corto plazo alineada con los valores personales.
            3. Identificar un obstáculo posible y cómo superarlo sin comprometer los valores.`,
            4: `Jueves-Toma de decisiones basada en valores
            1. Elegir una decisión que deba tomarse y analizar cómo cada opción se alinea con los
            valores.
            2. Aplicar técnicas de mindfulness para tomar conciencia antes de decidir.
            3. Reflexionar sobre los beneficios de actuar conforme a los valores.
            `,
            5: `Viernes-Autoaceptación y flexibilidad
            1. Revisar la lista de valores personales y ver si han cambiado con el tiempo.
            2. Escribir una carta a uno mismo reconociendo los esfuerzos por vivir en congruencia
            con los valores.
            3. Practicar la autocompasión al evaluar errores y aprendizajes de la semana.`,
            6: `Sábado-Conexión con los demás
            1. Identificar personas que comparten valores similares y reflexionar sobre cómo han
            influido en la vida personal.
            2. Expresar gratitud hacia alguien que haya inspirado a vivir conforme a los valores.
            3. Realizar una acción concreta que refuerce un valor clave, como un acto de
            generosidad o solidaridad.
            `
        }[dayOfWeek] || ""
          
    },
        ]
      },
      social: {
        ALTO: [
          {
            title: "FELICIDADES",
            description: `¡Felicidades! Los resultados del test demostraron un nivel alto de la autoestima descrita. Para mantener una valoración positiva sobre las capacidades de interacción, es esencial reforzar las habilidades interpersonales y la percepción positiva de uno mismo a la hora de interactuar. Con el objetivo de mantener un nivel de autoestima social alto, resulta recomendable fomentar la asertividad al momento de interactuar con otras personas, priorizando el respeto a las ideas u opiniones ajenas, y también expresando de forma oportuna las percepciones propias. Además, es crucial poner en práctica la empatía al momento de relacionarse con los demás, tomando en consideración que esta permite estrechar lazos y generar un ambiente positivo y de confianza. `,
            activity: {
            }[dayOfWeek] || "Sin actividades programadas."
              
        },
        
        ],
        MEDIO: [
          {
            title: "1. Desarrollo y práctica de habilidades sociales",
            description: `Las habilidades sociales son un conjunto de aptitudes que permiten realizar un proceso de interacción adecuado dentro de entornos sociales. Para fomentar y poner en práctica estás capacidades, puede resultar enriquecedor las siguientes actividades: 
            ● Practicar situaciones sociales: Se requerirá tratar de iniciar con interacciones pequeñas, como saludar o entablar una breve conversación, con la finalidad de empezar a familiarizarse con los procesos de interacción social y ganar confianza en entornos con otras personas. 
            ● Escucha activa: Es vital enfocarse en escuchar con atención durante las conversaciones lo que busca transmitir el interlocutor, debido a que puede hacer que las interacciones se desarrollen con mayor naturalidad. 
            ● Usar técnicas de comunicación asertiva: Es importante aprender a expresar ideas y emociones de manera clara y respetuosa. Para lo cual, se puede usar algunas estrategias como: 
            Autoconocimiento: Reflexionar sobre tus emociones antes de hablar e identificar lo que realmente quieres expresar te ayudará a mantener una mejor comunicación. 
            Autorregulación: Respirar antes de responder, contar hasta 10, o incluso tomarse un tiempo fuera (alejarse por unos minutos) puede ayudarte a controlar más fácilmente tus impulsos para evitar respuestas agresivas o pasivas. 
            Uso de lenguaje claro y directo: Hablar en primera persona (“Yo siento que...”, “Yo pienso que...”) te ayudará a comunicarte mejor, pues expresarte desde el yo, evita que haya malos entendidos. Sé específico sobre lo que necesitas o esperas, no vayas con rodeos o indirectas. Evita totalismos como “siempre” o “nunca”, habla sobre el hoy y el tema que tengan en el momento, eso te ayudará a evitar conflictos. 
            Escucha activa: Mantén contacto visual y muestra interés en lo que dice la otra persona. No interrumpas y valida los sentimientos del otro. 
            Expresión no verbal asertiva: Mantén una postura relajada pero firme. Usa gestos y expresiones acordes a tu mensaje. Modula tu tono de voz para evitar parecer agresivo o inseguro. 
            Práctica y retroalimentación: Finalmente ensayar respuestas en diferentes situaciones y pedir retroalimentación a personas de confianza puede ayudarte, además reflexionar sobre cómo manejaste distintas interacciones y qué podrías mejorar te harán mejorar mucho. `,
            activity: {
                0: "Domingo: Sin actividades programadas.",
                1: `Lunes: Intentar recordar un caso que nos haya pasado donde sentimos que no
tuvimos una comunicación asertiva e intentar pensar que podemos mejorar.
Además, podemos consultarle a alguien de confianza si cree que en relación al caso
que recordamos si nuestra decisión fue la mejor.`,
                2: "Martes: Sin actividades programadas.",
                3: `Miércoles: Pedirle a persona de confianza que te ayude a practicar un caso nuevo
que se les ocurra y practicar nuestra respuesta.
`,
                4: "Jueves:  Sin actividades programadas.",
                5: `Viernes: Intentar interactuar más con otras personas. Además, este día podemos
evaluar todo lo que hemos hecho en la semana y revisar si podemos mejorar algo.
`,
                6: "Sábado:  Sin actividades programadas."
            }[dayOfWeek] || ""
              
        },
        {
          title: "2. Ampliación del círculo social",
          description: `Para familiarizarse con los procesos de interacción, resulta importante involucrarse en ambientes que permitan socializar con otras personas. De forma específica, participar en actividades grupales sobre distintas temáticas pueden generar mejoras importantes en la capacidad de interacción de una persona, y en una valoración adecuada de las mismas. En razón de lo mencionado, resulta importante formar parte de actividades tales como a clubes, talleres o grupos con intereses similares, teniendo como finalidad crear oportunidades de conexión con otras personas que puedan presentar mayor cercanía debido a las aficiones de preferencia. `,
          activity: {
              0: "Domingo: Sin actividades programadas.",
              1: `Lunes: Este día podemos pedirle a personas de confianza que nos presenten a
amigos suyos que no conozcamos, así podemos interactuar con la ayuda de
nuestra persona de confianza. Además podemos intentar mantener conversaciones
vía web o presencialmente según se pueda con las personas que conocimos, podría
servir ser sincero y decirles que estamos intentando mejorar este ámbito.
`,
              2: "Martes: Sin actividades programadas.",
              3: `Miércoles: Este día podemos empezar a saludar a gente que no conocemos, como
porteros, vendedores o compañeros.
`,
              4: "Jueves: Sin actividades programadas.",
              5: `Viernes: Este día podemos intentar entablar pequeñas conversaciones con la gente
que ayer saludamos o con gente que veamos hoy y al final del día evaluar todo lo
que hemos hecho en la semana y revisar si podemos mejorar algo.`,
              6: "Sábado: Sin actividades programadas."
          }[dayOfWeek] || ""
            
      },
      {
        title: "3. Fortalecer la autovaloración y el diálogo interno",
        description: `Es fundamental alcanzar el bienestar personal previo al desarrollo de prácticas que evidencien un proceso interactivo satisfactorio. Por este motivo, tener una valoración individual adecuada puede resultar esencial, considerando que se podrán identificar aquellas cualidades personales que podrían ser de gran apoyo durante procesos de socialización. En adición, es importante evitar comparaciones con personas que pueden tener mayor apertura y facilidad para expresarse e interactuar con otros; y, también se debe aprender a entender y aceptar las imperfecciones, tomando en cuenta que durante los proceso de interacción se pueden cometer errores; sin embargo, son aquellos errores los cuales posibilitan un futuro aprendizaje. Para finalizar, resulta recomendable hacer uso de monólogos y conversaciones internas donde se tenga como finalidad celebrar cada paso hacia una mejora en las interacciones sociales; por más pequeños que parezcan, debido a que estos avances son los que forman las bases para el desarrollo y mejoría de habilidades que puedan facilitar el proceso interactivo, a la vez que el nivel de satisfacción con las propias capacidades y características.`,
        activity: {
            0: "Domingo: Sin actividades programadas.",
            1: `Lunes: Este día podemos pedirle a personas de confianza que nos digan cosas
positivas identifiquen en nosotros. Además, podemos intentar pensar si podemos
reconocer más puntos positivos que los que nos dijo nuestra persona de confianza.
`,
            2: "Martes: Sin actividades programadas.",
            3: `Miércoles: Este día se sugiere intentar estar más atento a lo que nos decimos
mentalmente durante el día, especialmente cuando algo negativo nos pasa ( si te
tropiezas o si se te cae el café ¿qué te dices mentalmente o verbalmente?). ¿Te
estás tratando bien o mal?
`,
            4: "Jueves: Sin actividades programadas.",
            5: `Viernes: Este día se sugiere intentar hablarse positivamente mentalmente cada que
podamos, ya que pasamos todo el día con nuestra propia mente y si no nos
tratamos bien no estaremos más que reforzando ideas negativas sobre nosotros
mismos. Finalmente, podemos evaluar todo lo que hemos hecho en la semana y
revisar si podemos mejorar algo y como nos hemos sentido en la semana.
`,
            6: "Sábado: Sin actividades programadas."
        }[dayOfWeek] || ""
          
    },
    {
      title: "4. Aserción encubierta",
      description: `Este es un método de ensayo mental donde debes visualizarte a tí mismo manejando situaciones problemáticas de una manera específica y más saludable que la que normalmente emplearías. El objetivo central es que, al practicar repetidamente estas respuestas alternativas y más constructivas en la mente, gradualmente puedas comenzar a adoptar estas nuevas reacciones en tu vida cotidiana. A continuación, se sugiere que puedas imaginar que un amigo te culpa por haber robado un lápiz suyo gritando en pleno salón de clases, ante esto imagina cuáles serían respuestas no asertivas, y luego intenta formular una respuesta asertiva ante esta situación. Así como este caso puedes plantear muchos otros casos en donde te sentirías incómodo y posiblemente responderías de manera agresiva o pasiva. En este caso respuestas no asertivas serían por ejemplo, decirle a tu amigo que está loco y siempre pierde las cosas también gritándole o decir que luego le comprarás uno pese a que tú no tomaste su lápiz. Pues en la primera respuesta estás siendo agresivo y en la segunda pasivo. Por otro lado, una respuesta asertiva, sería pedirle que se calme y comunicarle de la manera más calmada posible que tú no tomaste su lápiz. De esta manera estarás comunicando tu posición de manera clara y directa sin atacar a la otra persona.`,
      activity: {
          0: "Domingo: Sin actividades programadas.",
          1: `Lunes: Intentar recordar un caso que nos haya pasado donde sentimos que no
tuvimos una comunicación asertiva e intentar pensar que podemos mejorar.`,
          2: "Martes: Sin actividades programadas.",
          3: `Miércoles: Podemos intentar pensar en un caso nuevo, que no nos haya pasado e
intentar pensar en la forma asertiva de responder.`,
          4: "Jueves: Sin actividades programadas.",
          5: `Viernes: Sin actividades programadas.`,
          6: `,Sábado: Este día se sugiere intentar lo mismo del día anterior y sumado a ello se
puede consultar con alguien de confianza que haría en el caso que creamos.
Además, podemos evaluar todo lo que hemos hecho en la semana y revisar si
podemos mejorar algo y como nos hemos sentido en la semana.
`,
      }[dayOfWeek] || ""
        
  },
        ],
        BAJO: [
          {
            title: "1. Desarrollo y práctica de habilidades sociales",
            description: `Las habilidades sociales son un conjunto de aptitudes que permiten realizar un proceso de interacción adecuado dentro de entornos sociales. Para fomentar y poner en práctica estás capacidades, puede resultar enriquecedor las siguientes actividades: 
            ● Practicar situaciones sociales: Se requerirá tratar de iniciar con interacciones pequeñas, como saludar o entablar una breve conversación, con la finalidad de empezar a familiarizarse con los procesos de interacción social y ganar confianza en entornos con otras personas. 
            ● Escucha activa: Es vital enfocarse en escuchar con atención durante las conversaciones lo que busca transmitir el interlocutor, debido a que puede hacer que las interacciones se desarrollen con mayor naturalidad. 
            ● Usar técnicas de comunicación asertiva: Es importante aprender a expresar ideas y emociones de manera clara y respetuosa. Para lo cual, se puede usar algunas estrategias como: 
            Autoconocimiento: Reflexionar sobre tus emociones antes de hablar e identificar lo que realmente quieres expresar te ayudará a mantener una mejor comunicación. 
            Autorregulación: Respirar antes de responder, contar hasta 10, o incluso tomarse un tiempo fuera (alejarse por unos minutos) puede ayudarte a controlar más fácilmente tus impulsos para evitar respuestas agresivas o pasivas. 
            Uso de lenguaje claro y directo: Hablar en primera persona (“Yo siento que...”, “Yo pienso que...”) te ayudará a comunicarte mejor, pues expresarte desde el yo, evita que haya malos entendidos. Sé específico sobre lo que necesitas o esperas, no vayas con rodeos o indirectas. Evita totalismos como “siempre” o “nunca”, habla sobre el hoy y el tema que tengan en el momento, eso te ayudará a evitar conflictos. 
            Expresión no verbal asertiva: Mantén una postura relajada pero firme. Usa gestos y expresiones acordes a tu mensaje. Modula tu tono de voz para evitar parecer agresivo o inseguro. 
            Práctica y retroalimentación: Finalmente ensayar respuestas en diferentes situaciones y pedir retroalimentación a personas de confianza puede ayudarte, además reflexionar sobre cómo manejaste distintas interacciones y qué podrías mejorar te harán mejorar mucho. En relación a esto, a continuación se sugiere un cronograma para poner en práctica lo anterior:`,
            activity: {
                0: "Domingo: Sin actividades programadas",
                1: `Lunes: Intentar recordar un caso que nos haya pasado donde sentimos que no
tuvimos una comunicación asertiva e intentar pensar que podemos mejorar`,
                2: `Martes: Consultarle a alguien de confianza si cree que en relación al caso que
recordamos el lunes, si nuestra decisión fue la mejor`,
                3: `Miércoles: Pedirle a persona de confianza que te ayude a practicar un caso nuevo
que se les ocurra y practicar nuestra respuesta.
`,
                4:  `Jueves: Empezar a saludar a más gente, intentar entablar pequeñas
conversaciones.
 `,
                5: `Viernes: Intentar interactuar más con otras personas`,
                6: `Sábado: Este día podemos evaluar todo lo que hemos hecho en la semana y
revisar si podemos mejorar algo.`
            }[dayOfWeek] || ""
              
        },
        {
          title: "2. Ampliación del círculo social",
          description: `Para familiarizarse con los procesos de interacción, resulta importante involucrarse en ambientes que permitan socializar con otras personas. De forma específica, participar en actividades grupales sobre distintas temáticas pueden generar mejoras importantes en la capacidad de interacción de una persona, y en una valoración adecuada de las mismas. En razón de lo mencionado, resulta importante formar parte de actividades tales como a clubes, talleres o grupos con intereses similares, teniendo como finalidad crear oportunidades de conexión con otras personas que puedan presentar mayor cercanía debido a las aficiones de preferencia. En relación a esto, a continuación se sugiere un cronograma para poner en práctica lo anterior:`,
          activity: {
              0: "Domingo: Dedica 30 minutos a la meditación y reflexión sobre tus logros de la semana.",
              1: `Lunes: Este día podemos pedirle a personas de confianza que nos presenten a
amigos suyos que no conozcamos, así podemos interactuar con la ayuda de
nuestra persona de confianza.
`,
              2: `Martes: Este día podemos intentar mantener conversaciones vía web o
presencialmente según se pueda con las personas que conocimos el día anterior,
podría servir ser sincero y decirles que estamos intentando mejorar este ámbito.
`,
              3: `Miércoles: Este día podemos pedirle a la misma persona de confianza que nos
presente a alguien más y repetir el proceso.
`,
              4: `Jueves: Empezar a saludar a gente que no conocemos, como porteros, vendedores
o compañeros.
`,
              5: `Viernes: Este día podemos intentar entablar pequeñas conversaciones con la gente
que ayer saludamos o con gente que veamos hoy.`,
              6: `Sábado: Este día podemos evaluar todo lo que hemos hecho en la semana y
revisar si podemos mejorar algo.
.`
          }[dayOfWeek] || ""
            
      },
      {
        title: "3. Fortalecer la autovaloración y el diálogo interno",
        description: `Es fundamental alcanzar el bienestar personal previo al desarrollo de prácticas que evidencien un proceso interactivo satisfactorio. Por este motivo, tener una valoración individual adecuada puede resultar esencial, considerando que se podrán identificar aquellas cualidades personales que podrían ser de gran apoyo durante procesos de socialización. En adición, es importante evitar comparaciones con personas que pueden tener mayor apertura y facilidad para expresarse e interactuar con otros; y, también se debe aprender a entender y aceptar las imperfecciones, tomando en cuenta que durante los proceso de interacción se pueden cometer errores; sin embargo, son aquellos errores los cuales posibilitan un futuro aprendizaje. Para finalizar, resulta recomendable hacer uso de monólogos y conversaciones internas donde se tenga como finalidad celebrar cada paso hacia una mejora en las interacciones sociales; por más pequeños que parezcan, debido a que estos avances son los que forman las bases para el desarrollo y mejoría de habilidades que puedan facilitar el proceso interactivo, a la vez que el nivel de satisfacción con las propias capacidades y características. En relación a esto, a continuación se sugiere un cronograma para poner en práctica lo anterior:`,
        activity: {
            0: "Domingo: Sin actividades programadas",
            1: `Lunes: Escribe en tu diario tres cosas que te hacen único y especial.Lunes: Este día podemos pedirle a personas de confianza que nos digan cosas
positivas identifiquen en nosotros.
`,
            2: `Martes: Este día podemos intentar pensar si podemos reconocer más puntos
positivos que los que nos dijo ayer nuestra persona de confianza.`,
            3: `Miércoles: Este día se sugiere intentar estar más atento a lo que nos decimos
mentalmente durante el día, especialmente cuando algo negativo nos pasa ( si te
tropiezas o si se te cae el café ¿qué te dices mentalmente o verbalmente?). ¿Te
estás tratando bien o mal?
`,
            4: `Jueves: Este día se sugiere intentar hablarse positivamente mentalmente cada que
podamos, ya que pasamos todo el día con nuestra propia mente y si no nos
tratamos bien no estaremos más que reforzando ideas negativas sobre nosotros
mismos.`,
            5: `Viernes: Se sugiere realizar lo mismo que el día interior.
`,
            6: `Sábado: Este día podemos evaluar todo lo que hemos hecho en la semana y
revisar si podemos mejorar algo y como nos hemos sentido en la semana.
`
        }[dayOfWeek] || ""
          
    },
    {
      title: "4. Aserción encubierta",
      description: `Este es un método de ensayo mental donde debes visualizarte a tí mismo manejando situaciones problemáticas de una manera específica y más saludable que la que normalmente emplearías. El objetivo central es que, al practicar repetidamente estas respuestas alternativas y más constructivas en la mente, gradualmente puedas comenzar a adoptar estas nuevas reacciones en tu vida cotidiana. A continuación, se sugiere que puedas imaginar que un amigo te culpa por haber robado un lápiz suyo gritando en pleno salón de clases, ante esto imagina cuáles serían respuestas no asertivas, y luego intenta formular una respuesta asertiva ante esta situación. Así como este caso puedes plantear muchos otros casos en donde te sentirías incómodo y posiblemente responderías de manera agresiva o pasiva. En este caso respuestas no asertivas serían por ejemplo, decirle a tu amigo que está loco y siempre pierde las cosas también gritándole o decir que luego le comprarás uno pese a que tú no tomaste su lápiz. Pues en la primera respuesta estás siendo agresivo y en la segunda pasivo. Por otro lado, una respuesta asertiva, sería pedirle que se calme y comunicarle de la manera más calmada posible que tú no tomaste su lápiz. De esta manera estarás comunicando tu posición de manera clara y directa sin atacar a la otra persona. En relación a esto, a continuación se sugiere un cronograma para poner en práctica lo anterior:`,
      activity: {
          0: "Domingo: Sin actividades programadas",
          1: `Lunes: Intentar recordar un caso que nos haya pasado donde sentimos que no
tuvimos una comunicación asertiva e intentar pensar que podemos mejorar
`,
          2: `Martes: Este día podemos intentar pensar si podemos recordar otro caso que nos
haya pasado donde sentimos que no tuvimos una comunicación asertiva e intentar
pensar en que podemos mejorar`,
          3: `Miércoles: Podemos intentar pensar en un caso nuevo, que no nos haya pasado e
intentar pensar en la forma asertiva de responder.
`,
          4: `Jueves: Este día se sugiere intentar lo mismo del día anterior`,
          5: `Viernes: Este día se sugiere intentar lo mismo del día anterior y sumado a ello se
puede consultar con alguien de confianza que haría en el caso que creamos
`,
          6: `Sábado: Este día podemos evaluar todo lo que hemos hecho en la semana y
revisar si podemos mejorar algo y como nos hemos sentido en la semana.`
      }[dayOfWeek] || ""
        
  },
        ]
      },
      academico: {
        ALTO: [
      {
        title: "FELICIDADADES",
        description: `¡Felicidades! Los resultados del test demostraron un nivel alto del autoestima descrita. Mantener una valoración positiva sobre las competencias intelectuales implica reconocer los logros obtenidos y enfrentar los retos novedosos con seguridad y confianza plena en las propias capacidades. Con el propósito de mantener un nivel adecuado de autoestima académica, resulta recomendable fomentar el aprendizaje continuo, ya sea participando en actividades académicas o explorando nuevas áreas de interés para incorporar nuevos conocimientos. Adicionalmente, el acto de compartir los aprendizajes y enseñar a otras personas ayuda a fortalecer y consolidar el conocimiento obtenido. Finalmente, y como punto más importante, es vital tomar en consideración el esfuerzo por encima de los resultados, teniendo en cuenta que el proceso para incorporar nuevos aprendizajes es tan importante como los logros obtenidos a través de estos.`,
        activity: {

        }[dayOfWeek] || "Sin actividades programadas"
          
    },
        ],
        MEDIO: [
          {
            title: "1. Formar o pertenecer a grupos de estudios respecto al área académica de interés.",
            description: `La asistencia y pertenencia a grupos de estudios permiten socializar y desarrollar conexiones fructíferas con compañeros; lo cual puede implicar un apoyo para reducir pensamientos negativos respecto a las capacidades intelectuales individuales, además de fortalecer el conocimiento previo de manera dinámica y con un feedback adecuado, y también poder facilitar el proceso para incorporar nuevos conocimientos. 
            ● Ubicar grupos de estudios de tu universidad: Coincidir con estudiantes de tu universidad en grupos de estudios de tu carrera permite explorar nuevas áreas de investigación y adquirir conocimientos aprendiendo del punto de vista de cada integrante. Se crea un sentimiento de confianza y seguridad 
            ● Ubicar grupos de estudios de otras universidades: Salir de la zona de confort nos ayuda a poder explorar nuevas rutas de aprendizaje en otros grupos de estudio alejados de nuestra universidad. El sistema educativo en cada uno de ellos diferirá y permitirá que nosotros adquiramos nuevas estrategias de aprendizaje. 
            ● Linkedin como plataforma de voluntariados: La búsqueda de voluntariados o grupos de estudio que potencien más nuestros conocimientos se debe dar a través de gestores adecuados. Linkedin surge como una herramienta atractiva para poder ver continuamente información científica y laboral a través de post, reels o anuncios científicos. `,
            activity: {
                0: "Domingo: Sin actividades programadas.",
                1: `Lunes: Viernes: Revisar entre 20 a 30 minutos post informativos en Linkedin que
permita aprender de forma didáctica. Seguir a aquellos canales educativos que
impulsan nuestro crecimiento académico.
`,
                2: "Martes: Sin actividades programadas ",
                3: `Miércoles: Realizar las actividades de tu grupo de estudio en un rango de 1 a 2
horas.
`,
                4: "Jueves: Sin actividades programadas",
                5: `Viernes: Revisar entre 20 a 30 minutos post informativos en Linkedin que permita
aprender de forma didáctica. Seguir a aquellos canales educativos que impulsan
nuestro crecimiento académico.
`,
                6: "Sábado: Sin actividades programadas"
            }[dayOfWeek] || ""
              
        },
        {
          title: "2. Aplicación de la metodología SMART",
          description: `La metodología SMART es una técnica orientada a facilitar la organización, definición y cumplimiento de los objetivos que se busquen alcanzar. Proviene de un acrónimo en inglés, cuyas siglas explican las características que deben poseer los objetivos que tiene una persona: Specific (Específicos), Measurable (Medibles), Achievable (Alcanzables), Realistic (Realistas) y Time-Bound (Duración Limitada). El método SMART puede ser una herramienta fundamental para establecer objetivos con mayor claridad y dentro de plazos coherentes. En el ámbito académico, esta estrategia puede ser utilizada para proponer objetivos que faciliten el cumplimiento de tareas o proyectos a largo plazo; además que pueden permitir la evaluación constante del trabajo a realizar, y su resolución a través de una planeación detallada sobre qué actividades específicas hacer para lograr culminar con el objetivo propuesto. 
          ● Especificidad (S): El objetivo específico debe ser definido para orientar el plan de acción. 
          ● Medición (M): El objetivo de ser medible para poder seguir el progreso y saber cuándo se ha alcanzado. 
          ● Alcanzabilidad (A): El objetivo debe ser realista y alcanzable, teniendo en cuenta los recursos y tiempo disponible. 
          ● Relevancia (R): El objetivo debe ser significativo y alineado a las prioridades que tengas. 
          ● Tiempo (T): El objetivo debe ser limitado en el tiempo. Entre los primeros pasos, se encontraría establecer el objetivo SMART y crear un calendario con tareas y fechas específicas para planificar las acciones. En relación a esto, a continuación se sugiere un cronograma para poner en práctica lo anterior: `,
          activity: {
              0: "Domingo: Dedica 30 minutos a la meditación y reflexión sobre tus logros de la semana.",
              1: "Lunes: Escribe en tu diario tres cosas que te hacen único y especial.",
              2: "Martes: Practica la autocompasión haciendo algo que disfrutes mucho.",
              3: "Miércoles: Establece una meta personal desafiante para la próxima semana.",
              4: "Jueves: Crea una lista de tus mayores éxitos hasta ahora.",
              5: "Viernes: Dedica tiempo a un hobby que te apasione.",
              6: "Sábado: Realiza un acto de autocuidado especial."
          }[dayOfWeek] || ""
            
      },
        ],
        BAJO: [
          {
            title: "1. Cultivar una mentalidad de crecimiento personal",
            description: `Para mejorar la autoestima académica es necesario que los desafíos sean vistos como oportunidades y que la inteligencia y habilidades no son fijas, sino que se desarrollan con práctica. Ante ello, cultivar una mentalidad adecuada de confianza, valoración y autoconocimiento de nuestras habilidades actuales y aquellas potenciales nos permitirá gestionar los fracasos y confiar en nuestras capacidades.
            ● Validar el progreso personal: Es necesario comparar el desempeño actual con el de hace unas semanas o meses. Por consecuencia, se requerirá realizar el esquema FODA donde identificamos nuestras fortalezas, oportunidades, debilidades y amenazas en el ámbito académico. En adición, será de vital importancia determinar las áreas de oportunidad y de mejora, reflexionando sobre nuestras competencias y elaborar una ruta de aprendizaje continua.
            ● Reconocer logros personales: Se sugiere realizar una lista con los logros alcanzados durante la semana con el objetivo de que al final de dos semanas se pueda otorgar una recompensa ya sea tiempo de ocio, salida, un snack favorito o un regalo.
            ● Establecer metas alcanzables: Se sugiere dividir los objetivos grandes en metas alcanzables y pequeñas haciendo que los logros sean más tangibles y motiven a la persona. Existen aplicaciones que ayudan a la gestión de tareas como Notion, Google Keep, Trello, Todoist y Microsoft To-Do. Tras cumplir las metas alcanzables, se puede tener recompensas como un descanso de 45 minutos o salir a pasear con amigos por cada dos o tres días de actividades completadas.
            ● Gestionar fracasos: Fracasar es algo común en la vida; sin embargo, no debemos hundir los planes por un mal momento. Ante un hecho negativo, hay que aceptar la responsabilidad y buscar estrategias para mejorar y no cometer los mismos errores. Aprender a aceptar aquello que no salió bien y no solo enfocarnos en que fue nuestra culpa nos permitirá sentirnos tranquilos y confiados de un proceso posterior. Se sugeriría que en esos casos se realice un gráfico de los anillos de control con las zonas de control, influencia y no control, con el objetivo de ser capaces de darnos cuenta de las actitudes que hay que mejorar y no ser subjetivos en la autocrítica.`,
            activity: {
                0: "Domingo: Sin actividad programada",
                1: `Lunes: El primer día se debe aplicar el FODA en una cartulina blanca, haciendo cuatro divisiones y redactar los aspectos pertenecientes a fortalezas, debilidades, oportunidades y amenazas. Dicho producto se debe colocar en un lugar visible de la habitación para recordar lo que somos. `,
                2: `Martes: Seleccionar la plataforma de gestión de tareas adecuada y empezar a colocar las mini tareas por realizar sin sobrecargarse académicamente. `,
                3: `Miércoles: Cumplir con las metas diarias, si se logra, otorgar un tiempo de descanso. `,
                4: `Jueves: Cumplir con las metas diarias, si se logra, otorgar un tiempo de descanso`,
                5: `Viernes: Cumplir con las metas diarias, si se logra, otorgar un tiempo de descanso.`,
                6: `Sábado: Revisar el cumplimiento de las metas diarias, si se cumplió en su mayoría tomarse un descanso el domingo o pasear con amigos para poder distraerse.`
            }[dayOfWeek] || ""
              
        },
        {
          title: "2. Elaborar una ruta de aprendizaje",
          description: `La falta de conocimiento en tópicos es un punto determinante en la autoestima académica. Ante ello, elaborar una ruta de aprendizaje nos permitirá aprender los temas por mejorar en base a nuestra disponibilidad de tiempo y realizar una secuencia de actividades, recursos y metas para alcanzar un objetivo educativo de forma ordenada y eficiente.
          ● Definir el objetivo de aprendizaje: Establece qué deseas aprender o lograr. El objetivo debe ser claro, específico y alcanzable.
          ● Desglosa el objetivo en subtemas o áreas claves: Dividirlo en tareas pequeñas facilitará el proceso de aprendizaje y concentrarnos en un aspecto a la vez.
          ● Establecer la secuencia lógica: Organizar las áreas claves de manera progresiva empezando con conceptos básicos antes de abordar los temas complejos.
          ● Elegir los recursos de aprendizaje: Seleccionar los materiales, herramientas y recursos adecuados para cada etapa de la ruta de aprendizaje.
          ● Establecer un calendario o cronograma: Decidir cuánto tiempo se dedicará a cada tema por estudiar, siendo flexible y continuo el aprendizaje.
          ● Evaluar el progreso: Al final de cada etapa, es importante una autoevaluación a través de preguntas para verificar lo aprendido. Puede hacerse uso de exámenes, ejercicios prácticos o retroalimentación de otros.`,
          activity: {
              0: "Domingo: Sin actividad programada",
              1: `Lunes: Definir el objetivo de aprendizaje. Seleccionar qué temas se necesita mejorar o se desea aprender. `,
              2: `Martes: Seleccionar aquel tema acorde a la importancia y urgencia para obtener resultados. Posteriormente, desglosarlo en subtemas o áreas claves. Finalmente, se establecerá la secuencia lógica`,
              3: `Miércoles: Elegir los recursos de aprendizaje del tema como videos, artículos científicos, diapositivas de clases, entre otros nos permitirá saber el tiempo en el que nos tomará abordar el tema deseado.`,
              4: `Jueves: Se utilizará este día para continuar en la elección de los recursos de aprendizaje. En adición, se ordenarán los recursos acorde a los subtemas por tratar. `,
              5: `Viernes: Establecer el calendario o un diagrama de Gantt se puede realizar a través de plataformas de gestión del tiempo como Notion o Google Calendar.`,
              6: `Sábado: Seleccionar los ejercicios prácticos para cada subtema a tratar.`
          }[dayOfWeek] || ""
            
      },
        ]
      },
      fisico: {
        ALTO: [
          {
            title: "FELICIDADES",
            description: `¡Felicidades! Los resultados del test demostraron un nivel alto de la autoestima descrita. Es importante considerar que la valoración física positiva requiere tanto el cuidado del cuerpo como una actitud mental saludable hacia la propia imagen. Con el objetivo de poder mantener un nivel adecuado de la autoestima física, resulta recomendable priorizar y mantener un autocuidado de forma constante, ya sea a través de rutinas de ejercicios o alimentación saludable. En adición, es vital enfocarse en las características propias y evitar la comparación con otras personas. Finalmente, y como punto de mayor trascendencia, es vital invertir tiempo en la realización de actividades que potencien el bienestar personal y hagan sentirse bien con uno mismo.`,
            activity: {

          }[dayOfWeek] || "Sin actividades pendientes"
        },
        ],
        MEDIO: [
          {
            title: "1. Participación en Programas de Actividad Física",
            description: `La práctica regular de actividad física puede asociarse con mejoras significativas en la autoestima, la imagen corporal y el bienestar personal; considerando que establecer objetivos relacionados a la realización de ejercicios físicos pueden fortalecer la percepción positiva de la apariencia corporal, lo cual impacta directamente en la autoestima. Para una práctica adecuada y fructífera de actividad física, pueden realizarse sesiones de 15 a 60 minutos del ejercicio de interés por lo menos tres veces por semana.`,
            activity: {
                0: "Domingo: No hay actividad programada.",
                1: "Lunes: Realizar una caminata de 30 minutos.",
                2: "Martes: No hay actividad programada.",
                3: "Miércoles: Realizar un trote ligero entre 20 a 30 minutos.",
                4: "Jueves: No hay actividad programada.",
                5: "Viernes: Realizar una caminata de 45 minutos.",
                6: "Sábado: No hay actividad programada."
            }[dayOfWeek] || ""
              
        },
        {
          title: "2. Práctica del Mindfulness",
          description: `El mindfulness es una técnica de meditación para atender de forma intencional y consciente a la experiencia presente, y está orientada al cambio y redirección de los pensamientos. Su importancia radica en que puede tener un impacto significativo en la mejora de la autoestima física al fomentar una relación más consciente y compasiva con las características físicas. La práctica del mindfulness puede ayudar a desarrollar una actitud de aceptación hacia el cuerpo, tal como es en el momento presente, en lugar de centrarse en ideales o estándares externos; además que practicar la observación sin juicio de los pensamientos y emociones relacionadas con la apariencia puede reducir la autocrítica destructiva y promover la autoaceptación. Para aplicar el Mindfulness orientado a la mejora de la autoestima física, se deben implementar las siguientes actividades en la rutina diaria: 
          ● Realizar un escaneo corporal: Se requerirá situarse en un lugar libre de distracciones y ruidos ambientales, acostarse o sentarse de forma cómoda, y cerrar los ojos. A continuación, se deberá centrar la atención a cada parte del cuerpo, imaginando parte por parte desde los pies a la cabeza, sin intentar establecer juicios negativos. Se debe realizar este ejercicio durante 15 minutos. 
          ● Meditación de Aceptación: Posterior a la evaluación corporal, se deberán dedicar 10 minutos a realizar frases o monólogos que prioricen una autovaloración positiva, tal como “Acepto mi cuerpo tal y como es”. 
          ● Movimiento consciente: Participar en actividades físicas de relajación como yoga o caminatas conscientes; y, durante la actividad, enfocar la atención en la forma en cómo se mueve el cuerpo y en cómo se siente, en lugar de centrarse en la apariencia o el rendimiento. 
          ● Agradecimiento con el cuerpo: Al finalizar el día, acostarse en la cama y pensar en tres motivos por el cual agradecer al cuerpo, tal como: “El día de hoy, mi cuerpo me permitió completar mi rutina de actividades físicas.” Resulta importante considerar que estas actividades deben realizarse en distintos días, teniendo como principal prioridad alcanzar una relación positiva y respetuosa con uno mismo.`,
          activity: {
              0: "Domingo: Repetir los ejercicios del miércoles.",
              1: "Lunes: Realizar los ejercicios de “Movimiento consciente” durante la caminata y “Agradecimiento con el cuerpo” al finalizar el día.",
              2: "Martes: No hay actividad programada.",
              3: "Miércoles:  Realizar los ejercicios de “Escaneo corporal” y “Meditación”.",
              4: "Jueves: No hay actividad programada.",
              5: "Viernes: Repetir los ejercicios del lunes.",
              6: "Sábado: No hay actividad programada."
          }[dayOfWeek] || ""
            
      },
        ],
        BAJO: [
          {
            title: "1. Participación en Programas de Actividad Física",
            description: `Participación en Programas de Actividad Física La práctica regular de actividad física puede asociarse con mejoras significativas en la autoestima, la imagen corporal y el bienestar personal; considerando que establecer objetivos relacionados a la realización de ejercicios físicos pueden fortalecer la percepción positiva de la apariencia corporal, lo cual impacta directamente en la autoestima. Para una práctica adecuada y fructífera de actividad física, pueden realizarse sesiones de 15 a 60 minutos del ejercicio de interés por lo menos tres veces por semana.Resulta vital no realizar actividades altamente demandantes debido a que, en vez de generar mejoras, puede implicar perjuicios contra la integridad tanto física, debido a un nivel de exigencia demasiado elevado; como mental, debido a que puede generar sentimientos de frustración al no poder culminar con las sesiones.`,
            activity: {
                0: "Domingo: Realizar una caminata de 45 minutos.",
                1: "Lunes: Realizar una caminata de 30 minutos.",
                2: "Martes: Realizar un trote ligero entre 15 a 20 minutos.",
                3: "Miércoles: No hay actividad programada.",
                4: "Jueves: Crea una lista de tus mayores éxitos hasta ahora.",
                5: "Viernes:  Realizar un trote ligero de 20 a 30 minutos.",
                6: "Sábado: No hay actividad programada."
            }[dayOfWeek] || ""
              
        },
        {
          title: "2. Práctica del Mindfulness",
          description: `El mindfulness es una técnica de meditación para atender de forma intencional y consciente a la experiencia presente, y está orientada al cambio y redirección de los pensamientos. Su importancia radica en que puede tener un impacto significativo en la mejora de la autoestima física al fomentar una relación más consciente y compasiva con las características físicas. La práctica del mindfulness puede ayudar a desarrollar una actitud de aceptación hacia el cuerpo, tal como es en el momento presente, en lugar de centrarse en ideales o estándares externos; además que practicar la observación sin juicio de los pensamientos y emociones relacionadas con la apariencia puede reducir la autocrítica destructiva y promover la autoaceptación. Para aplicar el Mindfulness orientado a la mejora de la autoestima física, se deben implementar las siguientes actividades en la rutina diaria:
          ● Realizar un escaneo corporal: Se requerirá situarse en un lugar libre de distracciones y ruidos ambientales, acostarse o sentarse de forma cómoda, y cerrar los ojos. A continuación, se deberá centrar la atención a cada parte del cuerpo, imaginando parte por parte desde los pies a la cabeza, sin intentar establecer juicios negativos. Se debe realizar este ejercicio durante 15 minutos. 
          ● Meditación de Aceptación: Posterior a la evaluación corporal, se deberán dedicar 10 minutos a realizar frases o monólogos que prioricen una autovaloración positiva, tal como “Acepto mi cuerpo tal y como es”.
          ● Movimiento consciente: Participar en actividades físicas de relajación como yoga o caminatas conscientes; y, durante la actividad, enfocar la atención en la forma en cómo se mueve el cuerpo y en cómo se siente, en lugar de centrarse en la apariencia o el rendimiento.
          ● Agradecimiento con el cuerpo: Al finalizar el día, acostarse en la cama y pensar en tres motivos por el cual agradecer al cuerpo, tal como: “El día de hoy, mi cuerpo me permitió completar mi rutina de actividades físicas.” Resulta importante considerar que estas actividades deben realizarse en distintos días, teniendo como principal prioridad alcanzar una relación positiva y respetuosa con uno mismo. Para guardar relación con el programa de actividad física, se recomienda el siguiente cronograma de actividades:
          `,
          activity: {
              0: "Domingo: Repetir los ejercicios del lunes.",
              1: "Lunes: Realizar los ejercicios de “Movimiento consciente” durante la caminata y “Agradecimiento con el cuerpo” al finalizar el día.",
              2: "Martes: No hay actividad programada.",
              3: "Miércoles: Realizar los ejercicios de “Escaneo corporal” y “Meditación”.",
              4: "Jueves: Repetir los ejercicios del lunes",
              5: "Viernes: No hay actividad programada.",
              6: "Sábado: Repetir los ejercicios del miércoles."
          }[dayOfWeek] || ""
            
      },
        ]
      }
    };
  
    return recommendations[category as keyof CategoryRecommendations]?.[level as keyof CategoryRecommendations['personal']] || [];
  };