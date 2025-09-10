"use client";

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { correctAnswers,answersveracityQuestions } from '@/lib/correctAnswers'
import { questions ,veracityQuestions} from '@/constants/questions'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore'

interface TestFormProps {
  isRetake: boolean;
}

export const TestForm = ({ isRetake }: TestFormProps) => {
  const router = useRouter() 
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, boolean>>({})
  

  // Establecer el tiempo de inicio del test cuando se monta el componente
  useEffect(() => {
    // Solo establecer testStartTime si no existe (para evitar resetear en retomas)
    if (!localStorage.getItem("testStartTime")) {
      localStorage.setItem("testStartTime", Date.now().toString());
    }
  }, []);

  // Reiniciar el estado cuando es una retoma del test - solo al montar el componente
  useEffect(() => {
    
    const checkAndResetIfRetake = async () => {
      try {
        // Verificar directamente en Firebase si es una retoma
        const auth = getAuth();
        if (auth.currentUser) {
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          const userData = userDoc.data();
          const isActuallyRetake = userData?.hasRetakenTest === true;
          
          
          if (isActuallyRetake) {
            setAnswers({});
            setCurrentQuestion(0);
            // También limpiar el localStorage para asegurar un nuevo tiempo de inicio
            localStorage.removeItem("testStartTime");
            localStorage.setItem("testStartTime", Date.now().toString());
          } else {
          }
        }
      } catch (error) {
        console.error('TestForm - Error verificando retoma en Firebase:', error);
      }
    };
    
    checkAndResetIfRetake();
  }, []); // Removido isRetake de las dependencias para que solo se ejecute al montar

  const handleAnswerChange = (value: boolean) => {
    const questionId = questions[currentQuestion].id
    setAnswers(prev => {
      const newAnswers = { 
        ...prev,
        [questionId]: value
      };
      return newAnswers;
    })
  }

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      console.log('=== INICIO DEL PROCESO DE FINALIZACIÓN DEL TEST ===');
      console.log('Timestamp:', new Date().toISOString());
      console.log('Usuario actual:', getAuth().currentUser?.uid);
      console.log('Respuestas del usuario:', answers);
      console.log('Número total de respuestas:', Object.keys(answers).length);
      console.log('Preguntas totales:', questions.length);
      
      // Verificar si todas las preguntas fueron respondidas
      const unansweredQuestions = questions.filter(q => !answers.hasOwnProperty(q.id));
      if (unansweredQuestions.length > 0) {
        console.warn('Preguntas sin responder:', unansweredQuestions.map(q => q.id));
      } else {
        console.log('✅ Todas las preguntas fueron respondidas');
      }

      // Calculate veracity score - modificado para usar answersveracityQuestions
      console.log('=== CALCULANDO VERACITY SCORE ===');
      console.log('Preguntas de veracidad:', veracityQuestions);
      console.log('Respuestas correctas de veracidad:', answersveracityQuestions);
      
      const veracityScore = veracityQuestions.reduce((score, questionNum, index) => {
        const userAnswer = answers[questionNum];
        const correctAnswer = answersveracityQuestions[index];
        const isCorrect = userAnswer === correctAnswer;
        console.log(`Pregunta ${questionNum}: Usuario=${userAnswer}, Correcta=${correctAnswer}, Correcto=${isCorrect}`);
        return score + (isCorrect ? 1 : 0);
      }, 0);
      
      console.log('Veracity Score calculado:', veracityScore);
      console.log('¿Es veracityScore >= 4?', veracityScore >= 4);
      
      if (veracityScore >= 4) {
        console.log('⚠️ ADVERTENCIA: Usuario respondió sin sinceridad (veracityScore >= 4)');
      } else {
        console.log('✅ Usuario respondió con sinceridad (veracityScore < 4)');
      }

      // Calculate test duration
      console.log('=== CALCULANDO DURACIÓN DEL TEST ===');
      const startTime = localStorage.getItem('testStartTime');
      const endTime = Date.now();
      const testDuration = startTime ? Math.floor((endTime - parseInt(startTime)) / 1000) : 0;
      console.log('Tiempo de inicio (timestamp):', startTime);
      console.log('Tiempo de finalización (timestamp):', endTime);
      console.log('Duración del test (segundos):', testDuration);
      console.log('Duración del test (minutos):', Math.floor(testDuration / 60));

      // Get current user and firestore instance
      console.log('=== VERIFICANDO AUTENTICACIÓN ===');
      const auth = getAuth()
      const db = getFirestore()
      
      if (!auth.currentUser) {
        console.error('❌ No hay usuario autenticado');
        router.push('/login')
        return
      }
      
      console.log('✅ Usuario autenticado:', auth.currentUser.uid);
      console.log('Email del usuario:', auth.currentUser.email);

      // Obtener el valor final de isRetake desde Firebase
      console.log('=== VERIFICANDO ESTADO DE RETOMA ===');
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const userData = userDoc.data();
      const finalIsRetake = userData?.hasRetakenTest === true;
      
      console.log('Datos del usuario desde Firebase:', userData);
      console.log('¿Es retoma del test?', finalIsRetake);
      console.log('Prop isRetake recibida:', isRetake);
      
      if (finalIsRetake !== isRetake) {
        console.warn('⚠️ Discrepancia entre prop isRetake y Firebase hasRetakenTest');
      }
      
      // Determinar dónde guardar los datos según si es primer o segundo intento
      console.log('=== PREPARANDO DATOS PARA GUARDAR ===');
      let updateData: any;
      
      if (finalIsRetake) {
        // Es el segundo intento - guardar en propiedades con sufijo "2"
        console.log('Guardando como segundo intento (sufijo "2")');
        updateData = {
          answers2: answers,
          veracityScore2: veracityScore,
          testDuration2: testDuration,
          lastTestDate2: serverTimestamp()
        };
      } else {
        // Es el primer intento - guardar en propiedades estándar
        console.log('Guardando como primer intento (propiedades estándar)');
        updateData = {
          answers: answers,
          veracityScore: veracityScore,
          testDuration: testDuration,
          lastTestDate: serverTimestamp()
        };
      }
      
      console.log('Datos a actualizar en Firebase:', updateData);
      
      // Update user document in Firestore
      console.log('=== GUARDANDO EN FIREBASE ===');
      const userRef = doc(db, 'users', auth.currentUser.uid)
      await updateDoc(userRef, updateData)
      console.log('✅ Datos guardados exitosamente en Firebase');
      
      // Verificar que los datos se guardaron correctamente
      console.log('=== VERIFICANDO GUARDADO ===');
      const updatedDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const updatedData = updatedDoc.data();
      console.log('Datos actualizados en Firebase:', updatedData);
      
      if (finalIsRetake) {
        console.log('Verificando segundo intento:');
        console.log('- answers2 existe:', !!updatedData?.answers2);
        console.log('- veracityScore2:', updatedData?.veracityScore2);
        console.log('- testDuration2:', updatedData?.testDuration2);
        console.log('- lastTestDate2 existe:', !!updatedData?.lastTestDate2);
      } else {
        console.log('Verificando primer intento:');
        console.log('- answers existe:', !!updatedData?.answers);
        console.log('- veracityScore:', updatedData?.veracityScore);
        console.log('- testDuration:', updatedData?.testDuration);
        console.log('- lastTestDate existe:', !!updatedData?.lastTestDate);
      }

      // Clean up start time from localStorage
      console.log('=== LIMPIANDO LOCALSTORAGE ===');
      localStorage.removeItem('testStartTime');
      console.log('✅ testStartTime removido del localStorage');
      
      console.log('=== REDIRIGIENDO A RESULTADOS ===');
      console.log('Navegando a /results...');
      router.push('/results')
      console.log('=== FIN DEL PROCESO DE FINALIZACIÓN DEL TEST ===');
      
    } catch (error) {
      console.error('=== ERROR EN EL PROCESO DE FINALIZACIÓN ===');
      console.error('Error completo:', error);
      if (error instanceof Error) {
        console.error('Stack trace:', error.stack);
      }
      console.error('Timestamp del error:', new Date().toISOString());
      alert('Hubo un error al guardar tus respuestas. Por favor intenta nuevamente.')
    }
  }

  const currentQuestionData = questions[currentQuestion]
  const isFirstQuestion = currentQuestion === 0
  const isLastQuestion = currentQuestion === questions.length - 1

  // Log cuando se está en la última pregunta
  useEffect(() => {
    if (isLastQuestion) {
      console.log('=== ÚLTIMA PREGUNTA DEL TEST ===');
      console.log('Pregunta actual:', currentQuestion + 1, 'de', questions.length);
      console.log('ID de la pregunta:', currentQuestionData.id);
      console.log('Texto de la pregunta:', currentQuestionData.text);
      console.log('Respuesta actual del usuario:', answers[currentQuestionData.id]);
      console.log('Total de respuestas dadas:', Object.keys(answers).length);
      console.log('¿Falta responder esta pregunta?', !answers.hasOwnProperty(currentQuestionData.id));
    }
  }, [isLastQuestion, currentQuestion, currentQuestionData, answers]);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl p-4 md:p-6">
      {isFirstQuestion && (
        <h1 className="text-xl md:text-3xl font-bold text-center mb-4 md:mb-8 text-white">
          Programa de evaluación y orientación de la autoestima
        </h1>
      )}
      
      <div className="bg-celeste p-4 md:p-8 rounded-lg shadow-lg mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-medium mb-4 md:mb-6 min-h-0 md:min-h-[80px] flex items-center">
          {currentQuestion + 1}. {currentQuestionData.text}
        </h2>
        
        <div className="flex flex-row">
          <label className="flex-1 flex items-center justify-center p-2 md:p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name={`question-${currentQuestionData.id}`}
              checked={answers[currentQuestionData.id] === true}
              onChange={() => handleAnswerChange(true)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="ml-3">Sí</span>
          </label>
          
          <label className="flex-1 flex items-center justify-center p-2 md:p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name={`question-${currentQuestionData.id}`}
              checked={answers[currentQuestionData.id] === false}
              onChange={() => handleAnswerChange(false)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="ml-3">No</span>
          </label>
        </div>
      </div>
      
      <div className="flex justify-between">
        {!isFirstQuestion && (
          <button
            onClick={goToPreviousQuestion}
            className="px-4 md:px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300
                      transition-colors font-medium text-sm md:text-base"
          >
            Atrás
          </button>
        )}
        
        <div className="flex-1" />
        
        {!isLastQuestion ? (
          <button
            onClick={goToNextQuestion}
            disabled={!answers.hasOwnProperty(currentQuestionData.id)}
            className="px-4 md:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700
                      transition-colors font-medium disabled:opacity-50
                      disabled:cursor-not-allowed text-sm md:text-base"
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={() => {
              console.log('=== BOTÓN "FINALIZAR TEST" PRESIONADO ===');
              console.log('Timestamp del clic:', new Date().toISOString());
              console.log('Usuario:', getAuth().currentUser?.uid);
              console.log('¿Está habilitado el botón?', answers.hasOwnProperty(currentQuestionData.id));
              console.log('Respuesta de la última pregunta:', answers[currentQuestionData.id]);
              handleSubmit();
            }}
            disabled={!answers.hasOwnProperty(currentQuestionData.id)}
            className="px-4 md:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700
                      transition-colors font-medium disabled:opacity-50
                      disabled:cursor-not-allowed text-sm md:text-base"
          >
            Finalizar Test
          </button>
        )}
      </div>
    </div>
  )
}