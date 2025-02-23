"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { correctAnswers } from '@/lib/correctAnswers'
import { questions } from '@/constants/questions'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, updateDoc } from 'firebase/firestore'

const veracityQuestions = [6, 11, 19, 22, 24, 30]

export const TestForm = () => {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, boolean>>({})

  const handleAnswerChange = (value: boolean) => {
    const questionId = questions[currentQuestion].id
    setAnswers(prev => ({ 
      ...prev,
      [questionId]: value
    }))
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
      // Calculate veracity score
      const veracityScore = veracityQuestions.reduce((score, questionNum) => {
        return score + (answers[questionNum] === correctAnswers[questionNum] ? 1 : 0)
      }, 0)
  
      // Calculate test duration
      const startTime = localStorage.getItem('testStartTime');
      const endTime = Date.now();
      const testDuration = startTime ? Math.floor((endTime - parseInt(startTime)) / 1000) : 0; // Duration in seconds
  
      // Get current user and firestore instance
      const auth = getAuth()
      const db = getFirestore()
      
      if (!auth.currentUser) {
        console.error('No user logged in')
        router.push('/login')
        return
      }
  
      // Update user document in Firestore
      const userRef = doc(db, 'users', auth.currentUser.uid)
      await updateDoc(userRef, {
        answers: answers,
        veracityScore: veracityScore,
        testDuration: testDuration // Store duration in seconds
      })
  
      // Clean up start time from localStorage
      localStorage.removeItem('testStartTime');
      
      router.push('/results')
    } catch (error) {
      console.error('Error saving test results:', error)
      alert('Hubo un error al guardar tus respuestas. Por favor intenta nuevamente.')
    }
  }

  const currentQuestionData = questions[currentQuestion]
  const isFirstQuestion = currentQuestion === 0
  const isLastQuestion = currentQuestion === questions.length - 1

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] p-6">
      {isFirstQuestion && (
        <h1 className="text-3xl font-bold text-center mb-8 text-white">
          Test de Autoestima General (TAG)
        </h1>
      )}

      <div className="bg-celeste p-8 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-medium mb-6 min-h-[80px] flex items-center">
          {currentQuestion + 1}. {currentQuestionData.text}
        </h2>

        <div className="flex">
          <label className="flex-1 flex items-center justify-center p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name={`question-${currentQuestionData.id}`}
              checked={answers[currentQuestionData.id] === true}
              onChange={() => handleAnswerChange(true)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="ml-3">Sí</span>
          </label>

          <label className="flex-1 flex items-center justify-center p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
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
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 
                     transition-colors font-medium"
          >
            Atrás
          </button>
        )}
        
        <div className="flex-1" />

        {!isLastQuestion ? (
          <button
            onClick={goToNextQuestion}
            disabled={!answers.hasOwnProperty(currentQuestionData.id)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                     transition-colors font-medium disabled:opacity-50 
                     disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!answers.hasOwnProperty(currentQuestionData.id)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                     transition-colors font-medium disabled:opacity-50 
                     disabled:cursor-not-allowed"
          >
            Finalizar Test
          </button>
        )}
      </div>
    </div> 
  )
}