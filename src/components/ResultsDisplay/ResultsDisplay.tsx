
import { correctAnswers } from '@/lib/correctAnswers'
import { getDetailedRecommendations } from "../../constants/recommendations";
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import Test from '@/app/test/page';

interface CategoryScore {
  score: number
  level: 'ALTO' | 'MEDIO' | 'BAJO'
}

interface Results {
  personal: CategoryScore
  social: CategoryScore
  academico: CategoryScore
  fisico: CategoryScore
}

interface Props {
  userId: string
  userInfo: any
}

const categoryQuestions = {
  personal: [3, 8, 10, 13, 20, 26],
  social: [2, 4, 17, 23, 27, 29],
  academico: [1, 4, 14, 15, 16, 25],
  fisico: [7, 9, 12, 18, 21, 28]
}

const calculateCategoryScore = (answers: Record<number, boolean>, questionNumbers: number[]): number => {
  return questionNumbers.reduce((score, questionNum) => {
    return score + (answers[questionNum] === correctAnswers[questionNum] ? 1 : 0)
  }, 0)
}

const determineLevel = (score: number): 'ALTO' | 'MEDIO' | 'BAJO' => {
  if (score >= 5) return 'ALTO'
  if (score >= 3) return 'MEDIO'
  return 'BAJO'
}

const determineGeneralLevel = (totalScore: number): 'ALTO' | 'MEDIO' | 'BAJO' => {
  if (totalScore >= 20) return 'ALTO';
  if (totalScore >= 9) return 'MEDIO';
  return 'BAJO';
};

export const ResultsDisplay = ({ userId, userInfo }: Props) => {
  const router = useRouter()
  const [results, setResults] = useState<Results | null>(null)
  const [isVeracityValid, setIsVeracityValid] = useState(true)
  const [generalLevel, setGeneralLevel] = useState<'ALTO' | 'MEDIO' | 'BAJO' | null>(null)
  const [currentDay] = useState(() => new Date().getDay())
  const [error, setError] = useState<string | null>(null)

  const saveResultsToFirebase = async (results: Results) => {
    try {
      const db = getFirestore()
      const userRef = doc(db, 'users', userId)
      
      const testResults = {
        testResults: {
          personal: {
            score: results.personal.score,
            level: results.personal.level
          },
          social: {
            score: results.social.score,
            level: results.social.level
          },
          academico: {
            score: results.academico.score,
            level: results.academico.level
          },
          fisico: {
            score: results.fisico.score,
            level: results.fisico.level
          }
        }
      }
  
      await updateDoc(userRef, testResults)
    } catch (err) {
      console.error('Error saving results:', err)
      setError('Hubo un error al guardar tus resultados. Por favor, inténtalo de nuevo.')
    }
  }

  useEffect(() => {
    const db = getFirestore()
    
    const fetchAndProcessResults = async () => {
      try {
        // Get the user's answers from Firebase
        const userDoc = await getDoc(doc(db, 'users', userId))
        const userData = userDoc.data()
        
        if (!userData?.answers) {
          setError('No se encontraron respuestas del test')
          return
        }

        const answers = userData.answers
        const veracityScore = userData.veracityScore || 0

        if (veracityScore >= 3) {
          setIsVeracityValid(false)
          return
        }

        const calculatedResults: Results = {
          personal: {
            score: calculateCategoryScore(answers, categoryQuestions.personal),
            level: 'MEDIO',
          },
          social: {
            score: calculateCategoryScore(answers, categoryQuestions.social),
            level: 'MEDIO',
          },
          academico: {
            score: calculateCategoryScore(answers, categoryQuestions.academico),
            level: 'MEDIO',
          },
          fisico: {
            score: calculateCategoryScore(answers, categoryQuestions.fisico),
            level: 'MEDIO',
          }
        }

        let totalScore = 0
        Object.keys(calculatedResults).forEach((category) => {
          const score = calculatedResults[category as keyof Results].score
          const level = determineLevel(score)
          calculatedResults[category as keyof Results].level = level
          
          totalScore += score
        })

        const calculatedGeneralLevel = determineGeneralLevel(totalScore)
        setGeneralLevel(calculatedGeneralLevel)
        setResults(calculatedResults)

        // Save results to Firebase
        await saveResultsToFirebase(calculatedResults)
      } catch (error) {
        console.error('Error processing results:', error)
        setError('Hubo un error al procesar tus resultados.')
      }
    }

    fetchAndProcessResults()
  }, [userId])

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }


  if (!isVeracityValid) {
    return (
      <div className="max-w-2xl mx-auto p-6">
                    <h1 className="text-3xl font-bold text-center mb-8 text-white">
        Resultados del Test
      </h1>
        <div className="bg-celeste border-l-4 p-8 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium">
                Respuestas Inconsistentes
              </h3>
              <div className="mt-2">
                <p>
                  Hemos detectado algunas inconsistencias en tus respuestas. 
                  Para obtener una evaluación precisa de tu autoestima, 
                  es importante que respondas con total sinceridad. 
                  ¿Te gustaría intentar el test nuevamente?
                </p>
              </div>
              <div className="mt-4">
              <button
                onClick={async () => {
                  try {
                    // Limpiar localStorage
                    localStorage.removeItem('testAnswers')
                    
                    // Limpiar los datos del test en Firebase y resetear la fecha
                    const db = getFirestore()
                    const userRef = doc(db, 'users', userId)
                    
                    await updateDoc(userRef, {
                      answers: {},
                      testDuration: 0,
                      veracityScore: 0,
                      lastTestDate: null // Importante: eliminar la fecha del último test
                    })
                    
                    // Redireccionar directamente a la página del test
                    router.push('/dashboard/user')
                  } catch (error) {
                    console.error('Error al reiniciar el test:', error)
                    router.push('/dashboard/user')
                  }
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-lg 
                        hover:bg-yellow-700 transition-colors"
              >
                Realizar Test Nuevamente
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (!results) {
    return <div className="text-center text-white">Cargando resultados...</div>
  }
  return (
    <div className="w-full px-4">
            <h1 className="text-3xl font-bold text-center mb-8 text-white">
        Resultados del Test
      </h1>
      <div className="text-center text-lg font-bold mb-6 bg-celeste rounded-lg border border-gray-300 p-4 shadow-sm w-full">
        Nivel de Autoestima General&nbsp;&nbsp;&nbsp;&nbsp;
        <span className={generalLevel === 'ALTO' ? 'text-green-500' : generalLevel === 'MEDIO' ? 'text-yellow-500' : 'text-red-500'}>
          {generalLevel}
        </span>
      </div>
      
  
      <div className="grid grid-cols-1 gap-6 w-full">
        {Object.entries(results).map(([category, data], index) => {
          const recommendations = getDetailedRecommendations(category, data.level, currentDay);
  
          return (
            <div
              key={category}
              className="bg-celeste p-6 rounded-lg shadow-lg w-full"
            >
              <h2 className="text-xl font-semibold capitalize mb-4">
                Aspecto {category}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Nivel:</span>
                  <span
                    className={`
                      px-3 py-1 rounded-full text-sm font-medium
                      ${data.level === "ALTO" ? "bg-green-100 text-green-800" : ""}
                      ${data.level === "MEDIO" ? "bg-yellow-100 text-yellow-800" : ""}
                      ${data.level === "BAJO" ? "bg-red-100 text-red-800" : ""}
                    `}
                  >
                    {data.level}
                  </span>
                </div>
  
                <div className="flex items-center justify-between">
                  <span className="font-medium">Puntuación:</span>
                  <span>{data.score}/6</span>
                </div>
  
                {recommendations.map((rec, index) => (
                  <div key={index} className="mt-4 p-4 bg-celeste rounded-lg">
                    <h3 className="font-medium text-lg mb-2 text-blue-800" >
                      {rec.title}
                    </h3>
                    <div className="space-y-2">
                    <p className="text-gray-700 whitespace-pre-line">{rec.description}</p>

                      <div className="mt-2 p-2 bg-celeste rounded">
                        <p className="text-blue-700">
                          <span className="font-medium"  style={{ whiteSpace: "pre-line" }} >Actividad: </span>
                          {rec.activity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  
};