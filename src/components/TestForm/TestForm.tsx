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
  console.log('🚀 handleSubmit iniciado');
  
  try {
    console.log('📊 Calculando veracity score...');
    console.log('veracityQuestions:', veracityQuestions);
    console.log('answers:', answers);
    console.log('answersveracityQuestions:', answersveracityQuestions);
    
    // Calculate veracity score - modificado para usar answersveracityQuestions
    const veracityScore = veracityQuestions.reduce((score, questionNum, index) => {
      return score + (answers[questionNum] === answersveracityQuestions[index] ? 1 : 0)
    }, 0)
    
    console.log('✅ Veracity score calculado:', veracityScore);

    // Calculate test duration
    const startTime = localStorage.getItem('testStartTime');
    const endTime = Date.now();
    const testDuration = startTime ? Math.floor((endTime - parseInt(startTime)) / 1000) : 0; // Duration in seconds
    
    console.log('⏰ Test duration calculado:', testDuration, 'segundos');
    console.log('startTime desde localStorage:', startTime);

    // Get current user and firestore instance
    const auth = getAuth()
    const db = getFirestore()
    
    console.log('🔐 Auth y DB obtenidos');
    console.log('Usuario actual:', auth.currentUser);
    
    if (!auth.currentUser) {
      console.error('❌ No user logged in')
      console.log('🏠 Redirigiendo a "/" por falta de usuario');
      router.push('/')
      return
    }

    console.log('👤 Usuario logueado:', auth.currentUser.uid);

    // Obtener el valor final de isRetake desde Firebase
    console.log('📄 Obteniendo documento de usuario desde Firebase...');
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
    const userData = userDoc.data();
    console.log('📋 Datos del usuario obtenidos:', userData);
    
    const finalIsRetake = userData?.hasRetakenTest === true;
    console.log('🔄 Es retake?:', finalIsRetake);
    console.log('hasRetakenTest value:', userData?.hasRetakenTest);

    // Determinar dónde guardar los datos según si es primer o segundo intento
    let updateData: any;

    if (finalIsRetake) {
      console.log('📝 Preparando datos para SEGUNDO intento...');
      // Es el segundo intento - guardar en propiedades con sufijo "2"
      updateData = {
        answers2: answers,
        veracityScore2: veracityScore,
        testDuration2: testDuration,
        lastTestDate2: serverTimestamp()
      };
    } else {
      console.log('📝 Preparando datos para PRIMER intento...');
      // Es el primer intento - guardar en propiedades estándar
      updateData = {
        answers: answers,
        veracityScore: veracityScore,
        testDuration: testDuration,
        lastTestDate: serverTimestamp()
      };
    }
    
    console.log('💾 Datos a actualizar:', updateData);

    // Update user document in Firestore
    console.log('🔄 Actualizando documento en Firestore...');
    const userRef = doc(db, 'users', auth.currentUser.uid)
    await updateDoc(userRef, updateData)
    console.log('✅ Documento actualizado exitosamente');

    // Clean up start time from localStorage
    localStorage.removeItem('testStartTime');
    console.log('🧹 testStartTime removido del localStorage');

    console.log('🎯 Redirigiendo a /results...');
    router.push('/results')
    console.log('🎯 router.push(/results) ejecutado');
    
  } catch (error) {
    console.error('💥 Error en handleSubmit:', error)
    if (error instanceof Error) {
      console.error('Stack trace completo:', error.stack);
    }
    alert('Hubo un error al guardar tus respuestas. Por favor intenta nuevamente.')
  }
}

  const currentQuestionData = questions[currentQuestion]
  const isFirstQuestion = currentQuestion === 0
  const isLastQuestion = currentQuestion === questions.length - 1

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
            onClick={handleSubmit}
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