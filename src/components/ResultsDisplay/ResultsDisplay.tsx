
import { correctAnswers } from '@/lib/correctAnswers'
import { getDetailedRecommendations } from "../../constants/recommendations";
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';

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


//hola
  // Coordenadas para el dispersigrama (calculadas en base a los puntajes)
  const calculatePointCoordinate = (score: number, baseCoord: number, direction: 1 | -1): number => {
    // Ajustamos las coordenadas según el puntaje (0-6)
    // Una puntuación de 6 estará más cerca del centro, una de 0 más lejos
    const distance = 25 * (6 - score); // 25px por cada punto de distancia
    return baseCoord + (direction * distance);
  };

  // Base center point
  const centerX = 300;
  const centerY = 250;

  // Cálculo de coordenadas para cada aspecto
  const personalY = calculatePointCoordinate(results.personal.score, centerY, -1); // Hacia arriba
  const fisicoY = calculatePointCoordinate(results.fisico.score, centerY, 1); // Hacia abajo
  const socialX = calculatePointCoordinate(results.social.score, centerX, -1); // Hacia la izquierda
  const academicoX = calculatePointCoordinate(results.academico.score, centerX, 1); // Hacia la derecha

  // Nivel para cada categoría
  const getLevelClass = (level: string): string => {
    if (level === 'ALTO') return 'bg-green-100 text-green-800';
    if (level === 'MEDIO') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  const getLevelColor = (level: 'ALTO' | 'MEDIO' | 'BAJO'): string => {
    switch (level) {
      case 'ALTO': return 'text-green-500';
      case 'MEDIO': return 'text-yellow-500';
      case 'BAJO': return 'text-red-500';
      default: return '';
    }
  };
  return (

 
    <div className="w-full px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">
        Resultados del Test de Autoestima
      </h1>
      
      {/* Nivel general */}
      <div className="text-center text-lg font-bold mb-6 bg-celeste rounded-lg border border-gray-300 p-4 shadow-sm w-full">
        Nivel de Autoestima General&nbsp;&nbsp;&nbsp;&nbsp;
        <span className={getLevelColor(generalLevel || 'MEDIO')}>
          {generalLevel}
        </span>
      </div>
      
      {/* Tabla de resultados */}
      <div className="mb-8 bg-celeste p-6 rounded-lg shadow-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Perfil Psicológico</h2>
        
        <div className="overflow-x-auto">
        <table className="w-full border-collapse border-2 border-black">
  <thead>
    <tr className="bg-mi-color-rgb text-white">
      <th className="py-3 px-4 text-left border-2 border-black">Aspecto</th>
      <th className="py-3 px-4 text-center border-2 border-black">Puntuación</th>
      <th className="py-3 px-4 text-center border-2 border-black">Nivel</th>
      <th className="py-3 px-4 text-left border-2 border-black">Interpretación</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="py-3 px-4 border-2 border-black font-medium">Personal</td>
      <td className="py-3 px-4 border-2 border-black text-center font-bold">{results.personal.score}/6</td>
      <td className="py-3 px-4 border-2 border-black text-center">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelClass(results.personal.level)}`}>
          {results.personal.level}
        </span>
      </td>
      <td className="py-3 px-4 border-2 border-black">
        {results.personal.level === 'ALTO' && 'Buena percepción de sí mismo y confianza en sus capacidades personales.'}
        {results.personal.level === 'MEDIO' && 'Percepción adecuada de sí mismo con áreas por reforzar.'}
        {results.personal.level === 'BAJO' && 'Puede mejorar en la confianza y valoración de sí mismo.'}
      </td>
    </tr>
    <tr>
      <td className="py-3 px-4 border-2 border-black font-medium">Social</td>
      <td className="py-3 px-4 border-2 border-black text-center font-bold">{results.social.score}/6</td>
      <td className="py-3 px-4 border-2 border-black text-center">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelClass(results.social.level)}`}>
          {results.social.level}
        </span>
      </td>
      <td className="py-3 px-4 border-2 border-black">
        {results.social.level === 'ALTO' && 'Facilidad para interactuar socialmente y establecer relaciones saludables.'}
        {results.social.level === 'MEDIO' && 'Relativa facilidad para interactuar socialmente, con aspectos por mejorar.'}
        {results.social.level === 'BAJO' && 'Puede fortalecer sus habilidades de interacción social.'}
      </td>
    </tr>
    <tr>
      <td className="py-3 px-4 border-2 border-black font-medium">Académico</td>
      <td className="py-3 px-4 border-2 border-black text-center font-bold">{results.academico.score}/6</td>
      <td className="py-3 px-4 border-2 border-black text-center">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelClass(results.academico.level)}`}>
          {results.academico.level}
        </span>
      </td>
      <td className="py-3 px-4 border-2 border-black">
        {results.academico.level === 'ALTO' && 'Confianza elevada en sus capacidades de aprendizaje y desempeño académico.'}
        {results.academico.level === 'MEDIO' && 'Adecuada valoración de sus capacidades académicas.'}
        {results.academico.level === 'BAJO' && 'Puede aumentar la confianza en sus habilidades académicas.'}
      </td>
    </tr>
    <tr>
      <td className="py-3 px-4 border-2 border-black font-medium">Físico</td>
      <td className="py-3 px-4 border-2 border-black text-center font-bold">{results.fisico.score}/6</td>
      <td className="py-3 px-4 border-2 border-black text-center">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelClass(results.fisico.level)}`}>
          {results.fisico.level}
        </span>
      </td>
      <td className="py-3 px-4 border-2 border-black">
        {results.fisico.level === 'ALTO' && 'Buena aceptación y valoración de su imagen corporal y capacidades físicas.'}
        {results.fisico.level === 'MEDIO' && 'Aceptación moderada de su imagen y capacidades físicas.'}
        {results.fisico.level === 'BAJO' && 'Puede mejorar la aceptación de su imagen corporal.'}
      </td>
    </tr>
  </tbody>
</table>
        </div>
        
        <div className="mt-4 p-4">
          <p className="font-medium text-blue-800">Interpretación de niveles:</p>
          <ul className="mt-2 space-y-1">
            <li>
              <span className="text-red-500 font-medium">Bajo (0-2 puntos): </span>
              Indica áreas que requieren atención y desarrollo.
            </li>
            <li>
              <span className="text-yellow-500 font-medium">Medio (3 puntos): </span>
              Refleja un desarrollo adecuado con oportunidades de mejora.
            </li>
            <li>
              <span className="text-green-500 font-medium">Alto (4-6 puntos): </span>
              Muestra fortalezas y un buen desarrollo en el aspecto evaluado.
            </li>
          </ul>
        </div>
      </div>
      
      {/* Dispersigrama */}
      <div className="bg-celeste p-6 rounded-lg shadow-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Dispersigrama de Resultados</h2>
        
        <div className="w-full flex justify-center">
          <div className="w-full max-w-xl">
            <svg 
              viewBox="0 0 600 500" 
              className="w-full h-auto border rounded-lg bg-white p-4"
            >
              {/* Ejes y líneas de referencia */}
              <line x1="300" y1="50" x2="300" y2="450" stroke="#ccc" strokeWidth="1"/>
              <line x1="100" y1="250" x2="500" y2="250" stroke="#ccc" strokeWidth="1"/>
              
              {/* Círculos de referencia (niveles) */}

              
              {/* Etiquetas de los ejes */}
              <text x="300" y="40" textAnchor="middle" fontWeight="bold">PERSONAL</text>
              <text x="300" y="470" textAnchor="middle" fontWeight="bold">FÍSICO</text>
              <text x="80" y="250" textAnchor="middle" fontWeight="bold">SOCIAL</text>
              <text x="520" y="250" textAnchor="middle" fontWeight="bold">ACADÉMICO</text>
              
              {/* Puntos de datos */}
              <circle cx="300" cy={personalY} r="8" fill={results.personal.level === 'ALTO' ? '#28a745' : results.personal.level === 'MEDIO' ? '#ffc107' : '#dc3545'}/>
              <circle cx={academicoX} cy="250" r="8" fill={results.academico.level === 'ALTO' ? '#28a745' : results.academico.level === 'MEDIO' ? '#ffc107' : '#dc3545'}/>
              <circle cx={socialX} cy="250" r="8" fill={results.social.level === 'ALTO' ? '#28a745' : results.social.level === 'MEDIO' ? '#ffc107' : '#dc3545'}/>
              <circle cx="300" cy={fisicoY} r="8" fill={results.fisico.level === 'ALTO' ? '#28a745' : results.fisico.level === 'MEDIO' ? '#ffc107' : '#dc3545'}/>
              
              {/* Polígono que conecta los puntos */}
              <polygon 
                points={`300,${personalY} ${academicoX},250 300,${fisicoY} ${socialX},250`} 
                fill="rgba(74, 111, 165, 0.2)" 
                stroke="#4a6fa5" 
                strokeWidth="2"
              />
              
              {/* Puntuaciones en los puntos */}
              <text x="300" y={personalY - 15} textAnchor="middle" fontSize="12">{results.personal.score}</text>
              <text x={academicoX + 15} y="250" textAnchor="middle" fontSize="12">{results.academico.score}</text>
              <text x={socialX - 15} y="250" textAnchor="middle" fontSize="12">{results.social.score}</text>
              <text x="300" y={fisicoY + 15} textAnchor="middle" fontSize="12">{results.fisico.score}</text>
            </svg>
          </div>
        </div>
        
        <div className="mt-4 flex justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span>Alto (4-6)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
            <span>Medio (3)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            <span>Bajo (0-2)</span>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <p className="font-medium text-blue-800">Interpretación del Dispersigrama:</p>
          <p className="mt-2">
            El gráfico muestra los niveles de autoestima en los cuatro aspectos evaluados. 
            Cuanto más cerca está el punto del centro, mayor es la puntuación obtenida. 
            {results.personal.level === 'ALTO' && results.academico.level === 'ALTO' && 
              ' Las fortalezas se observan principalmente en los aspectos personal y académico.'}
            {results.social.level === 'ALTO' && results.fisico.level === 'ALTO' && 
              ' Las fortalezas se observan principalmente en los aspectos social y físico.'}
            {results.personal.level === 'BAJO' && ' El aspecto personal muestra oportunidades de mejora.'}
            {results.social.level === 'BAJO' && ' El aspecto social muestra oportunidades de mejora.'}
            {results.academico.level === 'BAJO' && ' El aspecto académico muestra oportunidades de mejora.'}
            {results.fisico.level === 'BAJO' && ' El aspecto físico muestra oportunidades de mejora.'}
          </p>
          <p className="mt-2">
            La forma del polígono resultante indica un perfil de autoestima 
            {Math.max(
              results.personal.score, 
              results.social.score, 
              results.academico.score, 
              results.fisico.score
            ) - 
            Math.min(
              results.personal.score, 
              results.social.score, 
              results.academico.score, 
              results.fisico.score
            ) > 2 
              ? ' con desarrollo desigual' 
              : ' con desarrollo equilibrado'}.
          </p>
        </div>
      </div>
















    
      <h1 className="text-3xl font-bold text-center mt-6 mb-6 text-white">
  Recomendaciones del Test
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