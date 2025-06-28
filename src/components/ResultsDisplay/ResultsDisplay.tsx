import { correctAnswers as importedCorrectAnswers } from '@/lib/correctAnswers';
import { allRecommendations, getDetailedRecommendations, RecommendationItem, FeedbackQuestion } from "../../constants/recommendations";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { questions as allTestQuestions } from "../../constants/questions";
import PsychologicalProfile from './PsychologicalProfile';

interface CategoryScore {
  score: number;
  level: 'ALTO' | 'MEDIO' | 'BAJO';
}

interface Results {
  personal: CategoryScore;
  social: CategoryScore;
  academico: CategoryScore;
  fisico: CategoryScore;
}

interface Props {
  userId: string;
  userInfo: any;
}

const categoryQuestions = {
  personal: [3, 8, 10, 13, 20, 26],
  social: [2, 4, 17, 23, 27, 29],
  academico: [1, 4, 14, 15, 16, 25],
  fisico: [7, 9, 12, 18, 21, 28]
};

interface RecommendationStatus {
  [category: string]: {
    isOpen: boolean;
    userAnswers: Record<number, boolean>;
    categoryLevel: 'ALTO' | 'MEDIO' | 'BAJO';
    recommendationProgress: {
      [recommendationId: string]: {
        currentActivityIndex: number;
        isCompleted: boolean;
      };
    };
    currentQuestionIndex: number;
  };
}

const calculateCategoryScore = (answers: Record<number, boolean>, questionNumbers: number[]): number => {
  return questionNumbers.reduce((score, questionNum) => {
    return score + (answers[questionNum] === importedCorrectAnswers[questionNum] ? 1 : 0);
  }, 0);
};

const determineLevel = (score: number): 'ALTO' | 'MEDIO' | 'BAJO' => {
  if (score >= 5) return 'ALTO';
  if (score >= 3) return 'MEDIO';
  return 'BAJO';
}

const determineGeneralLevel = (totalScore: number): 'ALTO' | 'MEDIO' | 'BAJO' => {
  if (totalScore >= 20) return 'ALTO';
  if (totalScore >= 9) return 'MEDIO';
  return 'BAJO';
};

export const ResultsDisplay = ({ userId, userInfo }: Props) => {
  const router = useRouter();
  const [results, setResults] = useState<Results | null>(null);
  const [isVeracityValid, setIsVeracityValid] = useState(true);
  const [generalLevel, setGeneralLevel] = useState<'ALTO' | 'MEDIO' | 'BAJO' | null>(null);
  const [currentDay] = useState(() => new Date().getDay());
  const [error, setError] = useState<string | null>(null);
  const [userTestAnswers, setUserTestAnswers] = useState<Record<number, boolean> | null>(null);
  const [recommendationStatus, setRecommendationStatus] = useState<RecommendationStatus>({});
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentFeedbackRec, setCurrentFeedbackRec] = useState<RecommendationItem | null>(null);
  const [feedbackAnswers, setFeedbackAnswers] = useState<Record<string, boolean>>({});

const RecommendationDisplay: React.FC<{
  recommendation: RecommendationItem;
  categoryKey: string;
  onMarkActivityComplete: (category: string, recommendationId: string, activityIndex: number) => void;
  currentRecommendationProgress: {
    currentActivityIndex: number;
    isCompleted: boolean;
  };
}> = ({ recommendation, categoryKey, onMarkActivityComplete, currentRecommendationProgress }) => {
console.log(`Rendering RecommendationDisplay: id=${recommendation.id}, currentIndex=${currentRecommendationProgress.currentActivityIndex}, isCompleted=${currentRecommendationProgress.isCompleted}`);
  // Manejar casos donde activities no está definido
  const hasActivities = recommendation.activities && recommendation.activities.length > 0;
  const currentActivity = hasActivities 
    ? recommendation.activities![currentRecommendationProgress.currentActivityIndex]
    : null;
  const isLastActivity = hasActivities 
    ? currentRecommendationProgress.currentActivityIndex === recommendation.activities!.length - 1
    : true;
  const isRecommendationCompleted = currentRecommendationProgress.isCompleted || !hasActivities;

  const handleNextActivity = () => {
    onMarkActivityComplete(categoryKey, recommendation.id, currentRecommendationProgress.currentActivityIndex);
  };

  const handleResetRecommendation = () => {
    onMarkActivityComplete(categoryKey, recommendation.id, -1);
  };

  return (
    <div className={`recommendation-card ${isRecommendationCompleted ? 'completed-rec' : ''}`}>
      <h3 className="font-semibold text-lg mb-2">{recommendation.title}</h3>
      {recommendation.questionAsked && (
<p className="text-sm text-gray-700 mb-2">
  Pregunta: &quot;{recommendation.questionAsked}&quot; - Tu respuesta: {recommendation.questionAnsweredIncorrectly ? 'NO' : 'SÍ'}
</p>
      )}

      <p className="mb-3 text-gray-700">{recommendation.description}</p>

      {!isRecommendationCompleted && hasActivities ? (
        <>
          <h4 className="font-medium text-md mb-2">Actividad Actual:</h4>
          <div className="bg-blue-50 p-3 rounded-md mb-4 border border-blue-200">
            <p dangerouslySetInnerHTML={{ __html: currentActivity! }}></p>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleNextActivity}
              className="px-4 py-2 rounded-md text-white font-medium transition-colors bg-green-600 hover:bg-green-700"
            >
              {isLastActivity ? 'Culminar Recomendación' : 'Marcar Actividad Completada'}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-green-700 font-semibold mb-3">
            {hasActivities ? '¡Recomendación Completada!' : 'Recomendación'}
          </p>
          
          {hasActivities && (
            <button
              onClick={handleResetRecommendation}
              className="px-4 py-2 rounded-md bg-gray-500 text-white font-medium hover:bg-gray-600 transition-colors"
            >
              Reiniciar Recomendación
            </button>
          )}
          
          {recommendation.feedbackQuestions && recommendation.feedbackQuestions.length > 0 && (
            <button
              onClick={() => {
                setCurrentFeedbackRec(recommendation);
                setFeedbackAnswers({});
                setShowFeedbackModal(true);
              }}
              className={`px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors ${hasActivities ? 'ml-2' : ''}`}
            >
              Ver Retroalimentación
            </button>
          )}
        </div>
      )}
    </div>
  );
};

  const saveResultsToFirebase = async (resultsData: Results, answers: Record<number, boolean>) => {
    try {
      const db = getFirestore();
      const userRef = doc(db, 'users', userId);

      const testResults = {
        testResults: {
          personal: { score: resultsData.personal.score, level: resultsData.personal.level },
          social: { score: resultsData.social.score, level: resultsData.social.level },
          academico: { score: resultsData.academico.score, level: resultsData.academico.level },
          fisico: { score: resultsData.fisico.score, level: resultsData.fisico.level },
        },
        answers: answers,
      };

      await updateDoc(userRef, testResults);
    } catch (err) {
      console.error('Error saving results:', err);
      setError('Hubo un error al guardar tus resultados. Por favor, inténtalo de nuevo.');
    }
  };

  const moveToNextQuestion = async (category: string) => {
    console.log('⭐ moveToNextQuestion called for category:', category, 'prevIndex:', recommendationStatus[category]?.currentQuestionIndex);
    setRecommendationStatus(prevStatus => {
      const newStatus = { ...prevStatus };
      const currentCategoryStatus = { ...newStatus[category] };
      
      currentCategoryStatus.currentQuestionIndex += 1;
      
      newStatus[category] = currentCategoryStatus;
      return newStatus;
    });

    try {
      const db = getFirestore();
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        [`recommendationProgress.${category}.currentQuestionIndex`]: recommendationStatus[category].currentQuestionIndex + 1,
      });
    } catch (error) {
      console.error('Error saving question progress:', error);
    }
  };

const handleOnMarkActivityComplete = async (category: string, recommendationId: string, activityIndex: number) => {
  console.log('🔄 Completing activity:', { category, recommendationId, activityIndex });
  const prevQuestionIndex = recommendationStatus[category]?.currentQuestionIndex ?? 0;
  console.log('🐞 handleOnMarkActivityComplete: recommendationStatus for category before update:', recommendationStatus[category]);
  
  setRecommendationStatus(prevStatus => {
    const newStatus = { ...prevStatus };
    const currentCategoryStatus = { ...newStatus[category] };
    const recProgress = { ...currentCategoryStatus.recommendationProgress[recommendationId] };

    if (activityIndex === -1) {
      // Reiniciar recomendación
      recProgress.currentActivityIndex = 0;
      recProgress.isCompleted = false;
      console.log('🔄 Restarting recommendation');
    } else {
      const recsForCategory = getRecommendationsForCategory(
        category,
        currentCategoryStatus.categoryLevel,
        userTestAnswers!
      );
      const currentRec = recsForCategory.find(r => r.id === recommendationId);

      if (currentRec) {
        const hasActivities = currentRec.activities && currentRec.activities.length > 0;
        
        console.log('📝 Current rec info:', {
          id: currentRec.id,
          hasActivities,
          totalActivities: currentRec.activities?.length,
          currentIndex: recProgress.currentActivityIndex
        });

        if (hasActivities) {
          // CLAVE: Incrementar DESPUÉS de completar la actividad actual
          const nextActivityIndex = activityIndex + 1;
          
          // Si aún hay más actividades que mostrar
          if (nextActivityIndex < currentRec.activities!.length) {
            recProgress.currentActivityIndex = nextActivityIndex;
            console.log(`✅ Moving to activity ${nextActivityIndex } of ${currentRec.activities!.length}`);
          } else {
            // Si completó todas las actividades
            recProgress.isCompleted = true;
            console.log('🎉 All activities completed for this recommendation');
            
            // Mostrar feedback solo si hay preguntas de feedback
            if (currentRec.feedbackQuestions && currentRec.feedbackQuestions.length > 0) {
              setTimeout(() => {
                setCurrentFeedbackRec(currentRec);
                setFeedbackAnswers({});
                setShowFeedbackModal(true);
              }, 500);
            }
          }
        } else {
          recProgress.isCompleted = true;
        }
      }
    }

    currentCategoryStatus.recommendationProgress[recommendationId] = recProgress;
    newStatus[category] = currentCategoryStatus;

    // Verificar si todas las recomendaciones de la pregunta actual están completas
    const currentQuestionNum = categoryQuestions[category as keyof typeof categoryQuestions][currentCategoryStatus.currentQuestionIndex];
    const recsForCategory = getRecommendationsForCategory(
      category,
      currentCategoryStatus.categoryLevel,
      userTestAnswers!
    );
    const allRecsForQuestion = recsForCategory.filter(r => r.relatedQuestion === currentQuestionNum);
    
    const allCompleted = allRecsForQuestion.every(r => {
      const updatedRecProgress = newStatus[category].recommendationProgress[r.id];
      return updatedRecProgress?.isCompleted || !(r.activities && r.activities.length > 0);
    });

    console.log('📊 Question completion check:', {
      currentQuestionNum,
      totalRecs: allRecsForQuestion.length,
      completedRecs: allRecsForQuestion.filter(r => newStatus[category].recommendationProgress[r.id]?.isCompleted).length,
      allCompleted
    });

    // Solo avanzar a la siguiente pregunta si TODAS las recomendaciones están completas
    if (allCompleted && recProgress.isCompleted) {
      console.log('🚀 Advancing to next question inline');
      currentCategoryStatus.currentQuestionIndex += 1;
    }

    return newStatus;
  });

  // Guardar en Firebase (simplificado)
  try {
    const db = getFirestore();
    const userRef = doc(db, 'users', userId);
    
    // Obtener el estado actual después de la actualización
    const currentRecProgress = recommendationStatus[category]?.recommendationProgress[recommendationId];
    if (currentRecProgress) {
      const newIndex = activityIndex === -1 ? 0 : activityIndex + 1;
      const recsForCategory = getRecommendationsForCategory(category, recommendationStatus[category].categoryLevel, userTestAnswers!);
      const currentRec = recsForCategory.find(r => r.id === recommendationId);
      const totalActivities = currentRec?.activities?.length || 0;
      const isCompleted = activityIndex === -1 ? false : newIndex >= totalActivities;
      
      await updateDoc(userRef, {
        [`recommendationProgress.${category}.recommendationProgress.${recommendationId}`]: {
          currentActivityIndex: isCompleted ? totalActivities : newIndex,
          isCompleted
        },
        [`recommendationProgress.${category}.currentQuestionIndex`]: prevQuestionIndex + 1
      });
    }
  } catch (error) {
    console.error('Error saving recommendation activity progress:', error);
  }
};



  const handleFeedbackSubmit = (questionKey: string, answer: boolean) => {
    setFeedbackAnswers(prev => ({ ...prev, [questionKey]: answer }));
  };

  const submitAllFeedback = async () => {
    if (!currentFeedbackRec || !currentFeedbackRec.feedbackQuestions) return;

    const allAnswered = currentFeedbackRec.feedbackQuestions.every(q => feedbackAnswers.hasOwnProperty(q.key));

    if (allAnswered) {
      try {
        const db = getFirestore();
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          [`activityFeedback.${currentFeedbackRec.id}`]: feedbackAnswers,
        });
      } catch (error) {
        console.error('Error saving activity feedback:', error);
      }
      setShowFeedbackModal(false);
      setCurrentFeedbackRec(null);
      setFeedbackAnswers({});
    } else {
      alert("Por favor, responde a todas las preguntas de retroalimentación antes de continuar.");
    }
  };




const getRecommendationsForCategory = (category: string, level: 'ALTO' | 'MEDIO' | 'BAJO', answers: Record<number, boolean>) => {
  // Para niveles ALTO y MEDIO, devolver solo las recomendaciones generales
  if (level !== 'BAJO') {
    return allRecommendations[category as keyof typeof allRecommendations][level] || [];
  }
  
  // Para nivel BAJO, devolver solo las recomendaciones específicas por pregunta respondida incorrectamente
  const questionNumbers = categoryQuestions[category as keyof typeof categoryQuestions];
  const questionBasedRecs: RecommendationItem[] = [];
  
  questionNumbers.forEach(questionNum => {
    const userAnswer = answers[questionNum];
    const correctAnswer = importedCorrectAnswers[questionNum];
    
    // Solo agregar recomendaciones si la respuesta fue incorrecta
    if (userAnswer !== correctAnswer) {
      const questionRecs = (allRecommendations[category as keyof typeof allRecommendations]['BAJO'] as RecommendationItem[])
        .filter(rec => rec.relatedQuestion === questionNum);
      
      questionBasedRecs.push(...questionRecs);
    }
  });
  
  // Si no hay recomendaciones específicas, devolver las generales de nivel BAJO
  if (questionBasedRecs.length === 0) {
    const generalRecs = (allRecommendations[category as keyof typeof allRecommendations]['BAJO'] as RecommendationItem[])
      .filter(rec => !rec.relatedQuestion); // Solo las que NO tienen pregunta relacionada
    return generalRecs;
  }
  
  return questionBasedRecs;
};




  const toggleSection = (category: string) => {
    setRecommendationStatus(prevStatus => ({
      ...prevStatus,
      [category]: {
        ...prevStatus[category],
        isOpen: !prevStatus[category].isOpen,
      },
    }));
  };

  useEffect(() => {
    const db = getFirestore();

    const fetchAndProcessResults = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        const userData = userDoc.data();

        if (!userData?.answers) {
          setError('No se encontraron respuestas del test');
          return;
        }

        const answers = userData.answers;
        setUserTestAnswers(answers);
        const veracityScore = userData.veracityScore || 0;

        if (veracityScore >= 3) {
          setIsVeracityValid(false);
          return;
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
          },
        };

        let totalScore = 0;
        Object.keys(calculatedResults).forEach((category) => {
          const score = calculatedResults[category as keyof Results].score;
          const level = determineLevel(score);
          calculatedResults[category as keyof Results].level = level;
          totalScore += score;
        });

        const calculatedGeneralLevel = determineGeneralLevel(totalScore);
        setGeneralLevel(calculatedGeneralLevel);
        setResults(calculatedResults);

        await saveResultsToFirebase(calculatedResults, answers);

        const savedRecommendationProgress = userData?.recommendationProgress || {};

        const initialRecommendationStatus: RecommendationStatus = {};
        Object.keys(calculatedResults).forEach(category => {
          const catLevel = calculatedResults[category as keyof Results].level;
          const recs = getRecommendationsForCategory(category, catLevel, answers);


          const categoryRecProgress: { [id: string]: { currentActivityIndex: number; isCompleted: boolean; } } = {};
          recs.forEach(rec => {
            const savedRecData = savedRecommendationProgress[category]?.recommendationProgress?.[rec.id];
            categoryRecProgress[rec.id] = {
              currentActivityIndex: savedRecData?.currentActivityIndex ?? 0,
              isCompleted: savedRecData?.isCompleted ?? false,
            };
          });

          initialRecommendationStatus[category] = {
            isOpen: savedRecommendationProgress[category]?.isOpen !== undefined ? savedRecommendationProgress[category]?.isOpen : true,
            userAnswers: answers,
            categoryLevel: catLevel,
            recommendationProgress: categoryRecProgress,
            currentQuestionIndex: savedRecommendationProgress[category]?.currentQuestionIndex ?? 0
          };
        });
        setRecommendationStatus(initialRecommendationStatus);

      } catch (error) {
        console.error('Error processing results:', error);
        setError('Hubo un error al procesar tus resultados.');
      }
    };

    fetchAndProcessResults();
  }, [userId]);

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
                      localStorage.removeItem('testAnswers')
                      const db = getFirestore()
                      const userRef = doc(db, 'users', userId)
                      await updateDoc(userRef, {
                        answers: {},
                        testDuration: 0,
                        veracityScore: 0,
                        lastTestDate: null
                      })
                      router.push('/dashboard/user')
                    } catch (error) {
                      console.error('Error al reiniciar el test:', error)
                      router.push('/dashboard/user')
                    }
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
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

  if (!results || !userTestAnswers || Object.keys(recommendationStatus).length === 0) {
    return <div className="text-center text-white">Cargando resultados y recomendaciones...</div>;
  }

  return (
    <div className="w-full px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">
        Resultados del Test de Autoestima
      </h1>

      <div className="text-center text-lg font-bold mb-6 bg-celeste rounded-lg border border-gray-300 p-4 shadow-sm w-full">
        Nivel de Autoestima General&nbsp;&nbsp;&nbsp;&nbsp;
        <span className={getLevelColor(generalLevel || 'MEDIO')}>
          {generalLevel}
        </span>
      </div>

      <PsychologicalProfile
        results={results}
        getLevelClass={getLevelClass}
        personalY={calculatePointCoordinate(results.personal.score, 250, -1)}
        socialX={calculatePointCoordinate(results.social.score, 300, -1)}
        academicoX={calculatePointCoordinate(results.academico.score, 300, 1)}
        fisicoY={calculatePointCoordinate(results.fisico.score, 250, 1)}
      />

      <h1 className="text-3xl font-bold text-center mt-6 mb-6 text-white">
        Recomendaciones Personalizadas
      </h1>

     <div className="grid grid-cols-1 gap-6 w-full">
        {Object.entries(results).map(([category, data]) => {
          const status = recommendationStatus[category];
          const recommendationsForCategory = getRecommendationsForCategory(
  category,
  data.level,
  userTestAnswers || {}
);


          if (!status) return null;

          // Para niveles MEDIO y ALTO, mostramos solo el mensaje general
          if (data.level !== 'BAJO') {
            return (
              <div key={category} className="bg-celeste p-6 rounded-lg shadow-lg w-full">
                <h2 className="text-xl capitalize mb-4">Aspecto {category}</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Nivel:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelClass(data.level)}`}>
                      {data.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Puntuación:</span>
                    <span>{data.score}/6</span>
                  </div>
                </div>

                {recommendationsForCategory.map(rec => (
                  <div key={rec.id} className="mt-4 p-4 bg-white rounded-md">
                    <h3 className="font-semibold text-lg">{rec.title}</h3>
                    <p className="mt-2 text-gray-700">{rec.description}</p>
                  </div>
                ))}
              </div>
            );
          }


          // Para nivel BAJO, mostramos el sistema completo de actividades
          const currentQuestionNum = categoryQuestions[category as keyof typeof categoryQuestions][status.currentQuestionIndex];
          const currentRecommendations = recommendationsForCategory.filter(
            rec => rec.relatedQuestion === currentQuestionNum || !rec.relatedQuestion
          );

          const allQuestions = categoryQuestions[category as keyof typeof categoryQuestions];
          const isLastQuestion = status.currentQuestionIndex >= allQuestions.length - 1;
          const allRecommendationsCompleted = currentRecommendations.every(rec => 
            status.recommendationProgress[rec.id]?.isCompleted
          );
    return (
            <div key={category} className="bg-celeste p-6 rounded-lg shadow-lg w-full">
              <button
                onClick={() => toggleSection(category)}
                className="w-full flex justify-between items-center text-left py-2 px-4 rounded-md bg-mi-color-rgb text-white font-semibold mb-4"
              >
                <h2 className="text-xl capitalize">Aspecto {category}</h2>
                <span className="text-2xl">{status.isOpen ? '−' : '+'}</span>
              </button>

              {status.isOpen && (
                <>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Nivel:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelClass(data.level)}`}>
                        {data.level}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-medium">Puntuación:</span>
                      <span>{data.score}/6</span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center">
                        <span>Progreso:</span>
                        <span>
                          Pregunta {Math.min(status.currentQuestionIndex + 1, allQuestions.length)} de {allQuestions.length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ 
                            width: `${(status.currentQuestionIndex / allQuestions.length) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {status.currentQuestionIndex < allQuestions.length ? (
                    <>


                      {currentRecommendations.length > 0 ? (
                        currentRecommendations.map((rec) => (
                          status.recommendationProgress[rec.id] && (
                            <RecommendationDisplay
                              key={rec.id}
                              recommendation={rec}
                              categoryKey={category}
                              onMarkActivityComplete={handleOnMarkActivityComplete}
                              currentRecommendationProgress={status.recommendationProgress[rec.id]}
                            />
                          )
                        ))
                      ) : (
                        <div className="mb-4 p-4 bg-green-100 border border-green-200 rounded-md">
                          <p>No hay recomendaciones específicas para esta pregunta. Tu respuesta fue adecuada.</p>
                          <button
                            onClick={() => moveToNextQuestion(category)}
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Continuar a la siguiente pregunta
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                      <p>¡Has completado todas las actividades para esta categoría!</p>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {showFeedbackModal && currentFeedbackRec && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Retroalimentación para: {currentFeedbackRec.title}</h3>
            {currentFeedbackRec.feedbackQuestions?.map((q) => (
              <div key={q.key} className="mb-4">
                <p className="font-medium mb-2">{q.question}</p>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name={q.key}
                      value="true"
                      checked={feedbackAnswers[q.key] === true}
                      onChange={() => handleFeedbackSubmit(q.key, true)}
                    />
                    <span className="ml-2">Sí</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name={q.key}
                      value="false"
                      checked={feedbackAnswers[q.key] === false}
                      onChange={() => handleFeedbackSubmit(q.key, false)}
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
            ))}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={submitAllFeedback}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Enviar Retroalimentación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function calculatePointCoordinate(score: number, baseCoord: number, direction: 1 | -1): number {
  const distance = 25 * (6 - score);
  return baseCoord + (direction * distance);
}