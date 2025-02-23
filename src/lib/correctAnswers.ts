// src/lib/correctAnswers.ts

// El valor booleano indica si la respuesta correcta es "Sí" (true) o "No" (false)
export const correctAnswers: Record<number, boolean> = {
    // Preguntas de veracidad (no afectan el puntaje final)
    6: true,    // Siempre digo la verdad
    11: false,  // A veces hago cosas sin pensar
    19: true,   // Siempre hago lo correcto
    22: true,   // Nunca me enojo
    24: true,   // Siempre soy amable con todos
    30: true,   // Siempre digo lo que pienso
  
    // Preguntas personales
    3: false,    // Me considero una persona segura de mí misma
    8: false,    // Puedo tomar decisiones con facilidad
    10: false,   // Soy capaz de reconocer mis cualidades
    13: true,   // Me siento capaz de lograr lo que me propongo
    20: false,   // Me siento valioso/a como persona
    26: true,   // Confío en mis decisiones
   
    // Preguntas sociales
    2: true,    // Casi siempre cumplo con mis obligaciones
    4: false,    // Me llevo bien con la mayoría de las personas
    17: true,   // Me siento aceptado/a por mis amigos
    23: false,   // Me resulta fácil hacer amigos
    27: false,   // Me siento bien en situaciones sociales
    29: true,   // Me llevo bien con mis compañeros
  
    // Preguntas académicas
    1: true,    // Generalmente siento que me es fácil aprender
    14: true,   // Soy bueno/a para los estudios
    15: false,   // Tengo confianza en mis capacidades académicas
    16: true,   // Me siento preparado/a para mis exámenes
    25: true,   // Me siento capaz de aprender cosas nuevas
  
    // Preguntas físicas
    7: true,    // Me siento conforme con mi aspecto físico
    9: true,    // Me siento atractivo/a
    12: true,   // Me gusta mi apariencia física
    18: false,   // Estoy satisfecho/a con mi peso
    21: true,   // Me siento cómodo/a con mi cuerpo
    28: true    // Me siento conforme con mi altura
  }