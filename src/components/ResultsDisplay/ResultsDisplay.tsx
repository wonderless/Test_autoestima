import { correctAnswers as importedCorrectAnswers } from "@/lib/correctAnswers";
import {
  allRecommendations,
  getDetailedRecommendations,
  RecommendationItem,
  FeedbackQuestion,
} from "../../constants/recommendations";
import { useEffect, useState, useRef, useCallback, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { questions as allTestQuestions } from "../../constants/questions";
import PsychologicalProfile from "./PsychologicalProfile";

interface CategoryScore {
  score: number;
  level: "ALTO" | "MEDIO" | "BAJO";
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
  fisico: [7, 9, 12, 18, 21, 28],
};

interface ActivityProgress {
  currentDay: number;
  currentActivityIndex: number;
  completedActivities: number[];
  isCompleted: boolean;
  countdown?: number | null;
  countdownStartTime?: number | null;
}

interface RecommendationStatus {
  [category: string]: {
    isOpen: boolean;
    userAnswers: Record<number, boolean>;
    categoryLevel: "ALTO" | "MEDIO" | "BAJO";
    recommendationProgress: {
      [recommendationId: string]: ActivityProgress;
    };
    currentQuestionIndex: number;
  };
}

const calculateCategoryScore = (
  answers: Record<number, boolean>,
  questionNumbers: number[]
): number => {
  return questionNumbers.reduce((score, questionNum) => {
    return (
      score +
      (answers[questionNum] === importedCorrectAnswers[questionNum] ? 1 : 0)
    );
  }, 0);
};

const determineLevel = (score: number): "ALTO" | "MEDIO" | "BAJO" => {
  if (score >= 5) return "ALTO";
  if (score >= 3) return "MEDIO";
  return "BAJO";
};

const determineGeneralLevel = (
  totalScore: number
): "ALTO" | "MEDIO" | "BAJO" => {
  if (totalScore >= 20) return "ALTO";
  if (totalScore >= 9) return "MEDIO";
  return "BAJO";
};

// Función para formatear el tiempo restante
const formatTimeRemaining = (seconds: number, countdownStartTime?: number): string => {
  if (seconds <= 0) return "Tiempo completado";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `Falta ${hours} hora${hours > 1 ? 's' : ''}`;
  } else if (minutes >= 10) {
    return `Faltan ${minutes} minutos`;
  } else {
    // Cuando faltan menos de 10 minutos, mostrar la fecha y hora exacta
    if (countdownStartTime) {
      const unlockTime = new Date(countdownStartTime + (countdownStartTime ? seconds * 1000 : 0));
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'long'
      };
      return `Se desbloqueará la actividad a las ${unlockTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} del ${unlockTime.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}`;
    }
    return "Falta menos de 10 minutos";
  }
};

export const ResultsDisplay = ({ userId, userInfo }: Props) => {
  const router = useRouter();
  const [results, setResults] = useState<Results | null>(null);
  const [isVeracityValid, setIsVeracityValid] = useState(true);
  const [generalLevel, setGeneralLevel] = useState<
    "ALTO" | "MEDIO" | "BAJO" | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [userTestAnswers, setUserTestAnswers] = useState<Record<
    number,
    boolean
  > | null>(null);
  const [recommendationStatus, setRecommendationStatus] =
    useState<RecommendationStatus>({});
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentFeedbackRec, setCurrentFeedbackRec] =
    useState<RecommendationItem | null>(null);
  const [feedbackAnswers, setFeedbackAnswers] = useState<
    Record<string, boolean>
  >({});

  // Temporizadores activos
  const activeTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Función para limpiar temporizadores expirados y actualizar el estado
  const cleanupExpiredTimers = useCallback(() => {
    setRecommendationStatus(prev => {
      let hasChanges = false;
      const updatedStatus = { ...prev };

      Object.keys(updatedStatus).forEach(category => {
        const categoryData = updatedStatus[category];
        if (categoryData?.recommendationProgress) {
          Object.keys(categoryData.recommendationProgress).forEach(recommendationId => {
            const progress = categoryData.recommendationProgress[recommendationId];
            if (progress?.countdown && progress?.countdownStartTime) {
              const elapsed = Math.floor((Date.now() - progress.countdownStartTime) / 1000);
              const remaining = Math.max(0, progress.countdown - elapsed);
              
              if (remaining <= 0) {
                // El temporizador expiró, desbloquear el siguiente día
                categoryData.recommendationProgress[recommendationId] = {
                  ...progress,
                  countdown: null,
                  countdownStartTime: null,
                  currentDay: progress.currentDay + 1,
                  currentActivityIndex: 0
                };
                hasChanges = true;
                
                // Limpiar el temporizador activo si existe
                const timerKey = `${category}-${recommendationId}`;
                if (activeTimers.current.has(timerKey)) {
                  clearInterval(activeTimers.current.get(timerKey)!);
                  activeTimers.current.delete(timerKey);
                }
              }
            }
          });
        }
      });

      return hasChanges ? updatedStatus : prev;
    });
  }, []);

  // Limpiar temporizadores al desmontar y limpiar temporizadores expirados
  useEffect(() => {
    // Limpiar temporizadores expirados al montar el componente
    cleanupExpiredTimers();
    
    // Limpiar temporizadores expirados cada 30 segundos
    const cleanupInterval = setInterval(cleanupExpiredTimers, 30000);
    
    return () => {
      const timers = activeTimers.current;
      timers.forEach(timer => clearInterval(timer));
      timers.clear();
      clearInterval(cleanupInterval);
    };
  }, [cleanupExpiredTimers]);

  // Función para iniciar un temporizador - optimizada con useCallback
  const startTimer = useCallback((category: string, recommendationId: string, duration: number = 300) => {
    const timerKey = `${category}-${recommendationId}`;
    
    // Limpiar temporizador existente si lo hay
    if (activeTimers.current.has(timerKey)) {
      clearInterval(activeTimers.current.get(timerKey)!);
    }

    // Actualizar estado con el tiempo inicial
    setRecommendationStatus(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        recommendationProgress: {
          ...prev[category]?.recommendationProgress || {},
          [recommendationId]: {
            ...prev[category]?.recommendationProgress?.[recommendationId] || {},
            countdown: duration,
            countdownStartTime: Date.now()
          }
        }
      }
    }));

    // Crear nuevo temporizador - optimizado para reducir re-renderizados
    const timer = setInterval(() => {
      setRecommendationStatus(prev => {
        const currentProgress = prev[category]?.recommendationProgress[recommendationId];
        if (!currentProgress || !currentProgress.countdown) {
          clearInterval(timer);
          activeTimers.current.delete(timerKey);
          return prev;
        }

        // Calcular el tiempo real transcurrido desde el inicio del countdown
        const elapsed = currentProgress.countdownStartTime 
          ? Math.floor((Date.now() - currentProgress.countdownStartTime) / 1000)
          : 0;
        const actualRemaining = Math.max(0, duration - elapsed);
        
        if (actualRemaining <= 0) {
          clearInterval(timer);
          activeTimers.current.delete(timerKey);
          
          // Desbloquear el siguiente día
          return {
            ...prev,
            [category]: {
              ...prev[category],
              recommendationProgress: {
                ...prev[category]?.recommendationProgress || {},
                [recommendationId]: {
                  ...currentProgress,
                  countdown: null,
                  countdownStartTime: null,
                  currentDay: currentProgress.currentDay + 1,
                  currentActivityIndex: 0
                }
              }
            }
          };
        }

        return {
          ...prev,
          [category]: {
            ...prev[category],
            recommendationProgress: {
              ...prev[category]?.recommendationProgress || {},
              [recommendationId]: {
                ...currentProgress,
                countdown: actualRemaining
              }
            }
          }
        };
      });
    }, 5000); // Actualizar cada 5 segundos

    activeTimers.current.set(timerKey, timer);
  }, []);

  // Función para completar una actividad - optimizada con useCallback
  const completeActivity = useCallback(async (category: string, recommendationId: string) => {
    const currentProgress = recommendationStatus[category]?.recommendationProgress?.[recommendationId];
    if (!currentProgress) return;

    const recommendation = getRecommendationsForCategory(
      category,
      recommendationStatus[category]?.categoryLevel || "BAJO",
      userTestAnswers!
    ).find(rec => rec.id === recommendationId);

    if (!recommendation?.days) return;

    const currentDay = recommendation.days[currentProgress.currentDay - 1];
    if (!currentDay) return;

    const nextActivityIndex = currentProgress.currentActivityIndex + 1;
    const isLastActivityOfDay = nextActivityIndex >= currentDay.activities.length;
    const isLastDay = currentProgress.currentDay >= recommendation.days.length;

    if (isLastActivityOfDay) {
      if (isLastDay) {
        // Completar toda la recomendación
        setRecommendationStatus(prev => ({
          ...prev,
          [category]: {
            ...prev[category],
            recommendationProgress: {
              ...prev[category]?.recommendationProgress || {},
              [recommendationId]: {
                ...currentProgress,
                isCompleted: true,
                countdown: null,
                countdownStartTime: null
              }
            }
          }
        }));

        // Mostrar feedback si existe
        if (recommendation.feedbackQuestions?.length) {
          setCurrentFeedbackRec(recommendation);
          setFeedbackAnswers({});
          setShowFeedbackModal(true);
        }
      } else {
        // Iniciar temporizador para el siguiente día
        startTimer(category, recommendationId, 300); // 5 minutos
      }
    } else {
      // Avanzar a la siguiente actividad del mismo día
      setRecommendationStatus(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          recommendationProgress: {
            ...prev[category]?.recommendationProgress || {},
            [recommendationId]: {
              ...currentProgress,
              currentActivityIndex: nextActivityIndex
            }
          }
        }
      }));
    }

    // Guardar en Firebase
    try {
      const db = getFirestore();
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        [`recommendationProgress.${category}.recommendationProgress.${recommendationId}`]: {
          currentDay: currentProgress.currentDay,
          currentActivityIndex: isLastActivityOfDay ? 0 : nextActivityIndex,
          completedActivities: [...(currentProgress.completedActivities || []), currentProgress.currentActivityIndex],
          isCompleted: isLastDay,
          countdown: isLastActivityOfDay && !isLastDay ? 300 : null,
          countdownStartTime: isLastActivityOfDay && !isLastDay ? Date.now() : null
        }
      });
    } catch (error) {
      console.error("Error saving activity progress:", error);
    }
  }, [recommendationStatus, userTestAnswers, startTimer, userId]);

  // Componente para mostrar actividades de un día - optimizado con useMemo
  const DayActivitiesRenderer: React.FC<{
    recommendation: RecommendationItem;
    categoryKey: string;
    currentProgress: ActivityProgress;
  }> = ({ recommendation, categoryKey, currentProgress }) => {
    const currentDay = recommendation.days?.[currentProgress.currentDay - 1];
    
    // Obtener recomendaciones para navegación - optimizado con useMemo
    const navigationData = useMemo(() => {
      const allRecommendations = getRecommendationsForCategory(
        categoryKey,
        recommendationStatus[categoryKey]?.categoryLevel || "BAJO",
        userTestAnswers!
      );
      const currentIndex = allRecommendations.findIndex(rec => rec.id === recommendation.id);
      return {
        allRecommendations,
        currentIndex,
        canGoPrev: currentIndex > 0,
        canGoNext: currentIndex < allRecommendations.length - 1
      };
    }, [categoryKey, recommendation.id, getRecommendationsForCategory]);

    // Función para encontrar la siguiente pregunta que necesita recomendación
    const findNextQuestionWithRecommendation = useCallback((currentQuestionIndex: number, direction: 'next' | 'prev') => {
      const allQuestions = categoryQuestions[categoryKey as keyof typeof categoryQuestions];
      const userAnswers = userTestAnswers!;
      
      if (direction === 'next') {
        // Buscar hacia adelante
        for (let i = currentQuestionIndex + 1; i < allQuestions.length; i++) {
          const questionNum = allQuestions[i];
          const userAnswer = userAnswers[questionNum];
          const correctAnswer = importedCorrectAnswers[questionNum];
          
          if (userAnswer !== correctAnswer) {
            return i;
          }
        }
      } else {
        // Buscar hacia atrás
        for (let i = currentQuestionIndex - 1; i >= 0; i--) {
          const questionNum = allQuestions[i];
          const userAnswer = userAnswers[questionNum];
          const correctAnswer = importedCorrectAnswers[questionNum];
          
          if (userAnswer !== correctAnswer) {
            return i;
          }
        }
      }
      
      return null; // No hay más preguntas con recomendaciones
    }, [categoryKey, userTestAnswers]);

    // Handlers optimizados con useCallback
    const handlePrevClick = useCallback(() => {
      const currentQuestionIndex = recommendationStatus[categoryKey]?.currentQuestionIndex || 0;
      const prevQuestionIndex = findNextQuestionWithRecommendation(currentQuestionIndex, 'prev');
      
      if (prevQuestionIndex !== null) {
        setRecommendationStatus(prev => ({
          ...prev,
          [categoryKey]: {
            ...prev[categoryKey],
            currentQuestionIndex: prevQuestionIndex
          }
        }));
      }
    }, [categoryKey, findNextQuestionWithRecommendation]);

    const handleNextClick = useCallback(() => {
      const currentQuestionIndex = recommendationStatus[categoryKey]?.currentQuestionIndex || 0;
      const nextQuestionIndex = findNextQuestionWithRecommendation(currentQuestionIndex, 'next');
      
      if (nextQuestionIndex !== null) {
        setRecommendationStatus(prev => ({
          ...prev,
          [categoryKey]: {
            ...prev[categoryKey],
            currentQuestionIndex: nextQuestionIndex
          }
        }));
      }
    }, [categoryKey, findNextQuestionWithRecommendation]);

    const handleCompleteActivity = useCallback(() => {
      completeActivity(categoryKey, recommendation.id);
    }, [completeActivity, categoryKey, recommendation.id]);

    if (!currentDay) return null;

    const currentActivity = currentDay.activities[currentProgress.currentActivityIndex];
    const isLastActivityOfDay = currentProgress.currentActivityIndex === currentDay.activities.length - 1;
    const isLastDay = recommendation.days ? currentProgress.currentDay === recommendation.days.length : false;
    const hasCountdown = currentProgress.countdown !== null && currentProgress.countdown !== undefined;

    if (hasCountdown) {
      return (
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="text-center">
            <h3 className="text-xl font-bold text-green-700 mb-4">
              ¡Felicidades!
            </h3>
            <p className="text-lg mb-4">
              Has completado todas las actividades del Día {currentProgress.currentDay}.
            </p>
            <p className="text-lg mb-6">
              Las actividades del Día {currentProgress.currentDay + 1} estarán disponibles en:
            </p>
            <div className="text-3xl font-bold text-blue-700 mb-6">
              {formatTimeRemaining(currentProgress.countdown!, currentProgress.countdownStartTime!)}
            </div>
            
            {/* Botones de navegación */}
            <div className="flex justify-center gap-4">
              <OptimizedButton
                onClick={handlePrevClick}
                disabled={findNextQuestionWithRecommendation(recommendationStatus[categoryKey]?.currentQuestionIndex || 0, 'prev') === null}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  findNextQuestionWithRecommendation(recommendationStatus[categoryKey]?.currentQuestionIndex || 0, 'prev') !== null
                    ? "bg-yellow-600 text-white hover:bg-yellow-700" 
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                Anterior
              </OptimizedButton>
              <OptimizedButton
                onClick={handleNextClick}
                disabled={findNextQuestionWithRecommendation(recommendationStatus[categoryKey]?.currentQuestionIndex || 0, 'next') === null}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  findNextQuestionWithRecommendation(recommendationStatus[categoryKey]?.currentQuestionIndex || 0, 'next') !== null
                    ? "bg-green-600 text-white hover:bg-green-700" 
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                Siguiente
              </OptimizedButton>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-bold mb-4">Día {currentProgress.currentDay}</h3>
        
        {currentActivity && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">{currentActivity.title}</h4>
            <p className="text-gray-700 mb-4">{currentActivity.description}</p>
            
            <OptimizedButton
              onClick={handleCompleteActivity}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              {isLastActivityOfDay ? "Culminar Día" : "Marcar Actividad Completada"}
            </OptimizedButton>
          </div>
        )}

        {/* Progreso del día */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progreso del día:</span>
            <span>{currentProgress.currentActivityIndex + 1} de {currentDay.activities.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentProgress.currentActivityIndex + 1) / currentDay.activities.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Componente para mostrar una recomendación - optimizado con memo
  const RecommendationDisplay = memo<{
    recommendation: RecommendationItem;
    categoryKey: string;
  }>(({ recommendation, categoryKey }) => {
    const currentProgress = recommendationStatus[categoryKey]?.recommendationProgress?.[recommendation.id];
    
    // Obtener recomendaciones para navegación - optimizado con useMemo
    const navigationData = useMemo(() => {
      const allRecommendations = getRecommendationsForCategory(
        categoryKey,
        recommendationStatus[categoryKey]?.categoryLevel || "BAJO",
        userTestAnswers!
      );
      const currentIndex = allRecommendations.findIndex(rec => rec.id === recommendation.id);
      return {
        allRecommendations,
        currentIndex,
        canGoPrev: currentIndex > 0,
        canGoNext: currentIndex < allRecommendations.length - 1
      };
    }, [categoryKey, recommendation.id, getRecommendationsForCategory]);

    // Función para encontrar la siguiente pregunta que necesita recomendación
    const findNextQuestionWithRecommendation = useCallback((currentQuestionIndex: number, direction: 'next' | 'prev') => {
      const allQuestions = categoryQuestions[categoryKey as keyof typeof categoryQuestions];
      const userAnswers = userTestAnswers!;
      
      if (direction === 'next') {
        // Buscar hacia adelante
        for (let i = currentQuestionIndex + 1; i < allQuestions.length; i++) {
          const questionNum = allQuestions[i];
          const userAnswer = userAnswers[questionNum];
          const correctAnswer = importedCorrectAnswers[questionNum];
          
          if (userAnswer !== correctAnswer) {
            return i;
          }
        }
      } else {
        // Buscar hacia atrás
        for (let i = currentQuestionIndex - 1; i >= 0; i--) {
          const questionNum = allQuestions[i];
          const userAnswer = userAnswers[questionNum];
          const correctAnswer = importedCorrectAnswers[questionNum];
          
          if (userAnswer !== correctAnswer) {
            return i;
          }
        }
      }
      
      return null; // No hay más preguntas con recomendaciones
    }, [categoryKey, userTestAnswers]);

    // Handlers optimizados con useCallback
    const handlePrevClick = useCallback(() => {
      const currentQuestionIndex = recommendationStatus[categoryKey]?.currentQuestionIndex || 0;
      const prevQuestionIndex = findNextQuestionWithRecommendation(currentQuestionIndex, 'prev');
      
      if (prevQuestionIndex !== null) {
        setRecommendationStatus(prev => ({
          ...prev,
          [categoryKey]: {
            ...prev[categoryKey],
            currentQuestionIndex: prevQuestionIndex
          }
        }));
      }
    }, [categoryKey, findNextQuestionWithRecommendation]);

    const handleNextClick = useCallback(() => {
      const currentQuestionIndex = recommendationStatus[categoryKey]?.currentQuestionIndex || 0;
      const nextQuestionIndex = findNextQuestionWithRecommendation(currentQuestionIndex, 'next');
      
      if (nextQuestionIndex !== null) {
        setRecommendationStatus(prev => ({
          ...prev,
          [categoryKey]: {
            ...prev[categoryKey],
            currentQuestionIndex: nextQuestionIndex
          }
        }));
      }
    }, [categoryKey, findNextQuestionWithRecommendation]);

    if (!currentProgress) return null;

    if (currentProgress.isCompleted) {
      return (
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-xl font-bold text-green-700 mb-2">
            ✅ {recommendation.title}
          </h3>
          <p className="text-green-600 mb-4">
            ¡Has completado todas las actividades de esta recomendación!
          </p>
          
          {/* Botones de navegación siempre visibles */}
          <div className="flex justify-center gap-4">
            <OptimizedButton
              onClick={handlePrevClick}
              disabled={findNextQuestionWithRecommendation(recommendationStatus[categoryKey]?.currentQuestionIndex || 0, 'prev') === null}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                findNextQuestionWithRecommendation(recommendationStatus[categoryKey]?.currentQuestionIndex || 0, 'prev') !== null
                  ? "bg-yellow-600 text-white hover:bg-yellow-700" 
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            >
              Anterior
            </OptimizedButton>
            <OptimizedButton
              onClick={handleNextClick}
              disabled={findNextQuestionWithRecommendation(recommendationStatus[categoryKey]?.currentQuestionIndex || 0, 'next') === null}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                findNextQuestionWithRecommendation(recommendationStatus[categoryKey]?.currentQuestionIndex || 0, 'next') !== null
                  ? "bg-green-600 text-white hover:bg-green-700" 
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            >
              Siguiente
            </OptimizedButton>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-xl font-bold mb-2">{recommendation.title}</h3>
        {recommendation.questionAsked && (
                  <p className="text-sm text-gray-600 mb-2">
          Pregunta: &quot;{recommendation.questionAsked}&quot; - Tu respuesta: {recommendation.questionAnsweredIncorrectly ? "SÍ" : "NO"}
        </p>
        )}
        <p className="text-gray-700 mb-4">{recommendation.description}</p>
        
        {recommendation.days && (
          <DayActivitiesRenderer
            recommendation={recommendation}
            categoryKey={categoryKey}
            currentProgress={currentProgress}
          />
        )}
      </div>
    );
  });
  RecommendationDisplay.displayName = 'RecommendationDisplay';

  // Funciones optimizadas con useCallback
  const saveResultsToFirebase = useCallback(async (
    resultsData: Results,
    answers: Record<number, boolean>
  ) => {
    try {
      const db = getFirestore();
      const userRef = doc(db, "users", userId);

      const testResults = {
        testResults: {
          personal: {
            score: resultsData.personal.score,
            level: resultsData.personal.level,
          },
          social: {
            score: resultsData.social.score,
            level: resultsData.social.level,
          },
          academico: {
            score: resultsData.academico.score,
            level: resultsData.academico.level,
          },
          fisico: {
            score: resultsData.fisico.score,
            level: resultsData.fisico.level,
          },
        },
        answers: answers,
      };

      await updateDoc(userRef, testResults);
    } catch (err) {
      console.error("Error saving results:", err);
      setError(
        "Hubo un error al guardar tus resultados. Por favor, inténtalo de nuevo."
      );
    }
  }, [userId]);

  const getRecommendationsForCategory = useCallback((
    category: string,
    level: "ALTO" | "MEDIO" | "BAJO",
    answers: Record<number, boolean>
  ) => {
    // Para niveles ALTO y MEDIO, devolver solo las recomendaciones generales
    if (level !== "BAJO") {
      return (
        allRecommendations[category as keyof typeof allRecommendations][
          level
        ] || []
      );
    }

    // Para nivel BAJO, devolver solo las recomendaciones específicas por pregunta respondida incorrectamente
    const questionNumbers =
      categoryQuestions[category as keyof typeof categoryQuestions];
    const questionBasedRecs: RecommendationItem[] = [];

    questionNumbers.forEach((questionNum) => {
      const userAnswer = answers[questionNum];
      const correctAnswer = importedCorrectAnswers[questionNum];

      // Solo agregar recomendaciones si la respuesta fue incorrecta
      if (userAnswer !== correctAnswer) {
        const questionRecs = (
          allRecommendations[category as keyof typeof allRecommendations][
            "BAJO"
          ] as RecommendationItem[]
        ).filter((rec) => rec.relatedQuestion === questionNum);

        questionBasedRecs.push(...questionRecs);
      }
    });

    // Si no hay recomendaciones específicas, devolver las generales de nivel BAJO
    if (questionBasedRecs.length === 0) {
      const generalRecs = (
        allRecommendations[category as keyof typeof allRecommendations][
          "BAJO"
        ] as RecommendationItem[]
      ).filter((rec) => !rec.relatedQuestion);
      return generalRecs;
    }

    return questionBasedRecs;
  }, []);

  const toggleSection = useCallback((category: string) => {
    setRecommendationStatus((prevStatus) => ({
      ...prevStatus,
      [category]: {
        ...prevStatus[category],
        isOpen: !prevStatus[category].isOpen,
      },
    }));
  }, []);

  const handleFeedbackSubmit = useCallback((questionKey: string, answer: boolean) => {
    setFeedbackAnswers((prev) => ({ ...prev, [questionKey]: answer }));
  }, []);

  const submitAllFeedback = useCallback(async () => {
    if (!currentFeedbackRec || !currentFeedbackRec.feedbackQuestions) return;

    const allAnswered = currentFeedbackRec.feedbackQuestions.every((q) =>
      feedbackAnswers.hasOwnProperty(q.key)
    );

    if (allAnswered) {
      try {
        const db = getFirestore();
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          [`activityFeedback.${currentFeedbackRec.id}`]: feedbackAnswers,
        });
      } catch (error) {
        console.error("Error saving activity feedback:", error);
      }
      setShowFeedbackModal(false);
      setCurrentFeedbackRec(null);
      setFeedbackAnswers({});
    } else {
      alert(
        "Por favor, responde a todas las preguntas de retroalimentación antes de continuar."
      );
    }
  }, [currentFeedbackRec, feedbackAnswers, userId]);

  useEffect(() => {
    const db = getFirestore();

    const fetchAndProcessResults = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        const userData = userDoc.data();

        if (!userData?.answers) {
          setError("No se encontraron respuestas del test");
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
            level: "MEDIO",
          },
          social: {
            score: calculateCategoryScore(answers, categoryQuestions.social),
            level: "MEDIO",
          },
          academico: {
            score: calculateCategoryScore(answers, categoryQuestions.academico),
            level: "MEDIO",
          },
          fisico: {
            score: calculateCategoryScore(answers, categoryQuestions.fisico),
            level: "MEDIO",
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

        const savedRecommendationProgress =
          userData?.recommendationProgress || {};

        const initialRecommendationStatus: RecommendationStatus = {};
        Object.keys(calculatedResults).forEach((category) => {
          const catLevel = calculatedResults[category as keyof Results].level;
          const recs = getRecommendationsForCategory(
            category,
            catLevel,
            answers
          );

          const categoryRecProgress: {
            [id: string]: ActivityProgress;
          } = {};
          recs.forEach((rec) => {
            const savedRecData =
              savedRecommendationProgress[category]?.recommendationProgress?.[
                rec.id
              ];
            categoryRecProgress[rec.id] = {
              currentDay: savedRecData?.currentDay ?? 1,
              currentActivityIndex: savedRecData?.currentActivityIndex ?? 0,
              completedActivities: savedRecData?.completedActivities ?? [],
              isCompleted: savedRecData?.isCompleted ?? false,
              countdown: savedRecData?.countdown ?? null,
              countdownStartTime: savedRecData?.countdownStartTime ?? null
            };

            // Reiniciar temporizadores si hay countdown activo
            if (savedRecData?.countdown && savedRecData.countdown > 0) {
              const elapsed = savedRecData.countdownStartTime 
                ? Math.floor((Date.now() - savedRecData.countdownStartTime) / 1000)
                : 0;
              const remaining = Math.max(0, savedRecData.countdown - elapsed);
              
              if (remaining > 0) {
                startTimer(category, rec.id, remaining);
              } else {
                // Si el tiempo ya expiró, desbloquear el siguiente día inmediatamente
                categoryRecProgress[rec.id] = {
                  ...categoryRecProgress[rec.id],
                  countdown: null,
                  countdownStartTime: null,
                  currentDay: (savedRecData.currentDay || 1) + 1,
                  currentActivityIndex: 0
                };
              }
            }
          });

          initialRecommendationStatus[category] = {
            isOpen:
              savedRecommendationProgress[category]?.isOpen !== undefined
                ? savedRecommendationProgress[category]?.isOpen
                : true,
            userAnswers: answers,
            categoryLevel: catLevel,
            recommendationProgress: categoryRecProgress,
            currentQuestionIndex:
              savedRecommendationProgress[category]?.currentQuestionIndex ?? 0,
          };
        });
        setRecommendationStatus(initialRecommendationStatus);
      } catch (error) {
        console.error("Error processing results:", error);
        setError("Hubo un error al procesar tus resultados.");
      }
    };

    fetchAndProcessResults();
  }, [userId, saveResultsToFirebase, startTimer, getRecommendationsForCategory]);

  // Funciones optimizadas con useCallback y useMemo
  const getLevelClass = useCallback((level: string): string => {
    if (level === "ALTO") return "bg-green-100 text-green-800";
    if (level === "MEDIO") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  }, []);

  const getLevelColor = useCallback((level: "ALTO" | "MEDIO" | "BAJO"): string => {
    switch (level) {
      case "ALTO":
        return "text-green-500";
      case "MEDIO":
        return "text-yellow-500";
      case "BAJO":
        return "text-red-500";
      default:
        return "";
    }
  }, []);

  // Función para calcular el progreso real basado en preguntas que necesitan recomendaciones
  const calculateRealProgress = useCallback((category: string) => {
    const allQuestions = categoryQuestions[category as keyof typeof categoryQuestions];
    const userAnswers = userTestAnswers!;
    const currentQuestionIndex = recommendationStatus[category]?.currentQuestionIndex || 0;
    
    // Contar cuántas preguntas necesitan recomendaciones
    let totalQuestionsWithRecommendations = 0;
    let completedQuestionsWithRecommendations = 0;
    
    for (let i = 0; i < allQuestions.length; i++) {
      const questionNum = allQuestions[i];
      const userAnswer = userAnswers[questionNum];
      const correctAnswer = importedCorrectAnswers[questionNum];
      
      if (userAnswer !== correctAnswer) {
        totalQuestionsWithRecommendations++;
        if (i < currentQuestionIndex) {
          completedQuestionsWithRecommendations++;
        }
      }
    }
    
    return {
      totalQuestionsWithRecommendations,
      completedQuestionsWithRecommendations,
      currentQuestionIndex,
      progressPercentage: totalQuestionsWithRecommendations > 0 
        ? (completedQuestionsWithRecommendations / totalQuestionsWithRecommendations) * 100 
        : 100
    };
  }, [userTestAnswers, recommendationStatus]);

  const allCategoriesCompleted = useMemo(() => Boolean(
    results &&
      recommendationStatus &&
      userTestAnswers &&
      Object.entries(results).every(([category, data]) => {
        if (data.level !== "BAJO") return true;
        
        const progress = calculateRealProgress(category);
        return progress.completedQuestionsWithRecommendations >= progress.totalQuestionsWithRecommendations;
      })
  ), [results, recommendationStatus, userTestAnswers, calculateRealProgress]);

  const handleResetTest = useCallback(async () => {
    try {
      localStorage.removeItem("testAnswers");
      const db = getFirestore();
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        answers: {},
        recommendationProgress: {},
        activityFeedback: {},
        testDuration: 0,
        veracityScore: 0,
        lastTestDate: null,
      });
      router.push("/test");
    } catch (error) {
      console.error("Error resetting test:", error);
      router.push("/test");
    }
  }, [userId, router]);

  const handleContinueToNextQuestion = useCallback((category: string) => {
    const currentQuestionIndex = recommendationStatus[category]?.currentQuestionIndex || 0;
    const allQuestions = categoryQuestions[category as keyof typeof categoryQuestions];
    const userAnswers = userTestAnswers!;
    
    // Buscar la siguiente pregunta que necesita recomendación
    let nextQuestionIndex = currentQuestionIndex + 1;
    while (nextQuestionIndex < allQuestions.length) {
      const questionNum = allQuestions[nextQuestionIndex];
      const userAnswer = userAnswers[questionNum];
      const correctAnswer = importedCorrectAnswers[questionNum];
      
      if (userAnswer !== correctAnswer) {
        // Encontramos una pregunta que necesita recomendación
        break;
      }
      nextQuestionIndex++;
    }
    
    // Si encontramos una pregunta válida, navegar a ella
    if (nextQuestionIndex < allQuestions.length) {
      setRecommendationStatus(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          currentQuestionIndex: nextQuestionIndex
        }
      }));
    } else {
      // Si no hay más preguntas, avanzar al final
      setRecommendationStatus(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          currentQuestionIndex: allQuestions.length
        }
      }));
    }
  }, [recommendationStatus, userTestAnswers]);

  const handleCloseFeedbackModal = useCallback(() => {
    setShowFeedbackModal(false);
  }, []);

  // Componente de botón optimizado para evitar re-renderizados
  const OptimizedButton = memo<{
    onClick: () => void;
    disabled?: boolean;
    className: string;
    children: React.ReactNode;
  }>(({ onClick, disabled = false, className, children }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  ));
  OptimizedButton.displayName = 'OptimizedButton';

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
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
              <svg
                className="h-6 w-6 "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium">Respuestas Inconsistentes</h3>
              <div className="mt-2">
                <p>
                  Hemos detectado algunas inconsistencias en tus respuestas.
                  Para obtener una evaluación precisa de tu autoestima, es
                  importante que respondas con total sinceridad. ¿Te gustaría
                  intentar el test nuevamente?
                </p>
              </div>
              <div className="mt-4">
                                  <button
                    onClick={handleResetTest}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Realizar Test Nuevamente
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (
    !results ||
    !userTestAnswers ||
    !recommendationStatus ||
    Object.keys(recommendationStatus).length === 0
  ) {
    return (
      <div className="text-center text-white">
        Cargando resultados y recomendaciones...
      </div>
    );
  }

  return (
    <div className="w-full px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">
        Resultados del Test de Autoestima
      </h1>

      <div className="text-center text-lg font-bold mb-6 bg-celeste rounded-lg border border-gray-300 p-4 shadow-sm w-full">
        Nivel de Autoestima General&nbsp;&nbsp;&nbsp;&nbsp;
        <span className={getLevelColor(generalLevel || "MEDIO")}>
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
        Sistema de Actividades Personalizadas
      </h1>

      <div className="grid grid-cols-1 gap-6 w-full">
        {Object.entries(results).map(([category, data]) => {
          const status = recommendationStatus?.[category];
          const recommendationsForCategory = getRecommendationsForCategory(
            category,
            data.level,
            userTestAnswers || {}
          );

          if (!status) return null;

          // Para niveles MEDIO y ALTO, mostramos solo el mensaje general
          if (data.level !== "BAJO") {
            return (
              <div
                key={category}
                className="bg-celeste p-6 rounded-lg shadow-lg w-full"
              >
                <h2 className="text-xl capitalize mb-4">Dominio {category}</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Nivel:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelClass(
                        data.level
                      )}`}
                    >
                      {data.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Puntuación:</span>
                    <span>{data.score}/6</span>
                  </div>
                </div>

                {recommendationsForCategory.map((rec) => (
                  <div key={rec.id} className="mt-4 p-4 bg-white rounded-md">
                    <h3 className="font-semibold text-lg">{rec.title}</h3>
                    <p className="mt-2 text-gray-700">{rec.description}</p>
                  </div>
                ))}
              </div>
            );
          }

          // Para nivel BAJO, mostramos el sistema completo de actividades
          const currentRecommendations = recommendationsForCategory.filter(
            (rec) => {
              const questionNum = categoryQuestions[category as keyof typeof categoryQuestions][status?.currentQuestionIndex || 0];
              return rec.relatedQuestion === questionNum || !rec.relatedQuestion;
            }
          );

          const allQuestions = categoryQuestions[category as keyof typeof categoryQuestions];
          const isLastQuestion = status.currentQuestionIndex >= allQuestions.length - 1;

          return (
            <div
              key={category}
              className="bg-celeste p-6 rounded-lg shadow-lg w-full"
            >
              <button
                onClick={() => toggleSection(category)}
                className="w-full flex justify-between items-center text-left py-2 px-4 rounded-md bg-mi-color-rgb text-white font-semibold mb-4"
              >
                <h2 className="text-xl capitalize">Dominio {category}</h2>
                <span className="text-2xl">{status.isOpen ? "−" : "+"}</span>
              </button>

              {status.isOpen && (
                <>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Nivel:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelClass(
                          data.level
                        )}`}
                      >
                        {data.level}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-medium">Puntuación:</span>
                      <span>{data.score}/6</span>
                    </div>

                    
                  </div>

                  {(() => {
                    const progress = calculateRealProgress(category);
                    return progress.completedQuestionsWithRecommendations < progress.totalQuestionsWithRecommendations;
                  })() ? (
                    <>
                      {currentRecommendations.length > 0 ? (
                        currentRecommendations.map((rec) => (
                          <RecommendationDisplay
                            key={rec.id}
                            recommendation={rec}
                            categoryKey={category}
                          />
                        ))
                      ) : (
                        <div className="mb-4 p-4 bg-green-100 border border-green-200 rounded-md">
                          <p>
                            No hay recomendaciones específicas para esta
                            pregunta. Tu respuesta fue adecuada.
                          </p>
                          <button
                            onClick={() => handleContinueToNextQuestion(category)}
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Continuar a la siguiente pregunta
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                      <p>
                        {(() => {
                          const progress = calculateRealProgress(category);
                          if (progress.totalQuestionsWithRecommendations === 0) {
                            return "¡Excelente! Todas tus respuestas en esta categoría fueron correctas.";
                          }
                          return "¡Has completado todas las actividades para esta categoría!";
                        })()}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {allCategoriesCompleted && (
        <div className="mt-8 text-center">
          <button
            onClick={handleResetTest}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Realizar Test Otra Vez
          </button>
        </div>
      )}

      {showFeedbackModal && currentFeedbackRec && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              Retroalimentación para: {currentFeedbackRec.title}
            </h3>
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
                onClick={handleCloseFeedbackModal}
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

function calculatePointCoordinate(
  score: number,
  baseCoord: number,
  direction: 1 | -1
): number {
  const distance = 25 * (6 - score);
  return baseCoord + direction * distance;
}
