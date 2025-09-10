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

// Tiempo de desbloqueo para pasar al siguiente día de actividades
// Definido en segundos: 12 horas = 12 * 60 * 60 = 43200 segundos
const UNLOCK_DELAY_SECONDS = 12 * 60 * 60;
//const UNLOCK_DELAY_SECONDS = 1* 10;
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

// Función para formatear el tiempo restante (mostrar SIEMPRE la fecha y hora exacta)
const formatTimeRemaining = (seconds: number, countdownStartTime?: number): string => {
  if (seconds <= 0) return "Tiempo completado";
  if (!countdownStartTime) return "Calculando hora de desbloqueo...";
  const unlockTime = new Date(countdownStartTime + (UNLOCK_DELAY_SECONDS * 1000));
  return `Se desbloqueará la actividad a las ${unlockTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} del ${unlockTime.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}`;
};

// Componente optimizado para mostrar el countdown sin re-renderizar el resto
const CountdownDisplay = memo<{
  countdownStartTime: number;
  onComplete: () => void;
}>(({ countdownStartTime, onComplete }) => {
  const [timeRemaining, setTimeRemaining] = useState(UNLOCK_DELAY_SECONDS);
  
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - countdownStartTime) / 1000);
      const remaining = Math.max(0, UNLOCK_DELAY_SECONDS - elapsed);
      
      if (remaining <= 0) {
        clearInterval(timer);
        onComplete();
        return;
      }
      
      setTimeRemaining(remaining);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdownStartTime, onComplete]);
  
  if (timeRemaining <= 0) return null;
  const unlockTime = new Date(countdownStartTime + (UNLOCK_DELAY_SECONDS * 1000));
  return (
    <span>
      Se desbloqueará la actividad a las {unlockTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} del {unlockTime.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
    </span>
  );
});
CountdownDisplay.displayName = 'CountdownDisplay';

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
  const [hasRetakenTest, setHasRetakenTest] = useState(false);
  const [feedbackAnswers, setFeedbackAnswers] = useState<
    Record<string, boolean>
  >({});
  const [currentAspectIndex, setCurrentAspectIndex] = useState(0);
  const [testAttempts, setTestAttempts] = useState<number>(1);
  const [showPreviousResults, setShowPreviousResults] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

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
            if (progress?.countdownStartTime) {
              const elapsed = Math.floor((Date.now() - progress.countdownStartTime) / 1000);
              const remaining = Math.max(0, UNLOCK_DELAY_SECONDS - elapsed);
              
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
                  const timer = activeTimers.current.get(timerKey);
                  if (timer) {
                    clearTimeout(timer);
                    activeTimers.current.delete(timerKey);
                  }
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
      timers.forEach(timer => clearTimeout(timer));
      timers.clear();
      clearInterval(cleanupInterval);
    };
  }, [cleanupExpiredTimers]);

  // Función para limpiar temporizadores al desmontar
  useEffect(() => {
    const timers = activeTimers.current;
    return () => {
      timers.forEach(timer => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  // Función para iniciar un temporizador - optimizada con useCallback
  const startTimer = useCallback((category: string, recommendationId: string, duration: number = UNLOCK_DELAY_SECONDS) => {
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

    // El CountdownDisplay se encarga de mostrar el tiempo y completar automáticamente
    // Solo necesitamos limpiar el temporizador cuando se complete
    const timer = setTimeout(() => {
      activeTimers.current.delete(timerKey);
    }, duration * 1000);

    activeTimers.current.set(timerKey, timer);
  }, []);

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

  // Función para completar una actividad - optimizada con useCallback
  const completeActivity = useCallback(async (category: string, recommendationId: string) => {
    const currentProgress = recommendationStatus[category]?.recommendationProgress?.[recommendationId];
    if (!currentProgress) return;

    if (!userTestAnswers) return;
    
    const recommendation = getRecommendationsForCategory(
      category,
      recommendationStatus[category]?.categoryLevel || "BAJO",
      userTestAnswers
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
        startTimer(category, recommendationId, UNLOCK_DELAY_SECONDS);
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
          countdown: isLastActivityOfDay && !isLastDay ? UNLOCK_DELAY_SECONDS : null,
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
    const setRecommendationStatusLocal = setRecommendationStatus;
    const currentDay = recommendation.days?.[currentProgress.currentDay - 1];
    
    // Obtener recomendaciones para navegación - optimizado con useMemo
    const navigationData = useMemo(() => {
      if (!userTestAnswers) return { allRecommendations: [], currentIndex: -1, canGoPrev: false, canGoNext: false };
      
      const allRecommendations = getRecommendationsForCategory(
        categoryKey,
        recommendationStatus[categoryKey]?.categoryLevel || "BAJO",
        userTestAnswers
      );
      const currentIndex = allRecommendations.findIndex(rec => rec.id === recommendation.id);
      return {
        allRecommendations,
        currentIndex,
        canGoPrev: currentIndex > 0,
        canGoNext: currentIndex < allRecommendations.length - 1
      };
    }, [categoryKey, recommendation.id, userTestAnswers, getRecommendationsForCategory]);

    // Función para encontrar la siguiente pregunta que necesita recomendación
    const findNextQuestionWithRecommendation = useCallback((currentQuestionIndex: number, direction: 'next' | 'prev') => {
      if (!userTestAnswers) return null;
      
      const allQuestions = categoryQuestions[categoryKey as keyof typeof categoryQuestions];
      const userAnswers = userTestAnswers;
      
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
    }, [categoryKey]);

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
    }, [categoryKey, recommendation.id, completeActivity]);

    if (!currentDay) return null;

    const currentActivity = currentDay.activities[currentProgress.currentActivityIndex];
    const isLastActivityOfDay = currentProgress.currentActivityIndex === currentDay.activities.length - 1;
    const isLastDay = recommendation.days ? currentProgress.currentDay === recommendation.days.length : false;
    const hasCountdown = currentProgress.countdown !== null && currentProgress.countdown !== undefined;

    if (hasCountdown) {
      return (
        <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border border-blue-200">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-bold text-green-700 mb-3 sm:mb-4">
              ¡Felicidades!
            </h3>
            <p className="text-base sm:text-lg mb-3 sm:mb-4">
              Has completado todas las actividades del Día {currentProgress.currentDay}.
            </p>
            <p className="text-base sm:text-lg mb-4 sm:mb-6">
              Las actividades del Día {currentProgress.currentDay + 1} estarán disponibles en:
            </p>
            <div className="text-2xl sm:text-3xl font-bold text-blue-700 mb-4 sm:mb-6">
              <CountdownDisplay 
                countdownStartTime={currentProgress.countdownStartTime!}
                onComplete={() => {
                  // Cuando se complete el countdown, actualizar el estado
                  setRecommendationStatusLocal(prev => ({
                    ...prev,
                    [categoryKey]: {
                      ...prev[categoryKey],
                      recommendationProgress: {
                        ...prev[categoryKey]?.recommendationProgress || {},
                        [recommendation.id]: {
                          ...currentProgress,
                          countdown: null,
                          countdownStartTime: null,
                          currentDay: currentProgress.currentDay + 1,
                          currentActivityIndex: 0
                        }
                      }
                    }
                  }));
                }}
              />
            </div>
            
            {/* Botones de navegación */}
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
              <OptimizedButton
                onClick={handlePrevClick}
                disabled={findNextQuestionWithRecommendation(recommendationStatus[categoryKey]?.currentQuestionIndex || 0, 'prev') === null}
                className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
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
                className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
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
      <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Día {currentProgress.currentDay}</h3>
        
        {currentActivity && (
          <div className="mb-4 sm:mb-6">
            <h4 className="text-base sm:text-lg font-semibold mb-2">{currentActivity.title}</h4>
            <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">{currentActivity.description}</p>
            
            <OptimizedButton
              onClick={handleCompleteActivity}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
            >
              {isLastActivityOfDay ? "Culminar Día" : "Marcar Actividad Completada"}
            </OptimizedButton>
          </div>
        )}

        {/* Progreso del día */}
        <div className="mb-3 sm:mb-4">
          <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
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
      if (!userTestAnswers) return { allRecommendations: [], currentIndex: -1, canGoPrev: false, canGoNext: false };
      
      const allRecommendations = getRecommendationsForCategory(
        categoryKey,
        recommendationStatus[categoryKey]?.categoryLevel || "BAJO",
        userTestAnswers
      );
      const currentIndex = allRecommendations.findIndex(rec => rec.id === recommendation.id);
      return {
        allRecommendations,
        currentIndex,
        canGoPrev: currentIndex > 0,
        canGoNext: currentIndex < allRecommendations.length - 1
      };
    }, [categoryKey, recommendation.id, userTestAnswers, getRecommendationsForCategory]);

    // Función para encontrar la siguiente pregunta que necesita recomendación
    const findNextQuestionWithRecommendation = useCallback((currentQuestionIndex: number, direction: 'next' | 'prev') => {
      if (!userTestAnswers) return null;
      
      const allQuestions = categoryQuestions[categoryKey as keyof typeof categoryQuestions];
      const userAnswers = userTestAnswers;
      
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
    }, [categoryKey]);

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
        <div className="bg-green-50 p-4 sm:p-6 rounded-lg border border-green-200">
          <h3 className="text-lg sm:text-xl font-bold text-green-700 mb-2">
            ✅ {recommendation.title}
          </h3>
          <p className="text-green-600 mb-3 sm:mb-4 text-sm sm:text-base">
            ¡Has completado todas las actividades de esta recomendación!
          </p>
          
          {/* Botones de navegación siempre visibles */}
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
            <OptimizedButton
              onClick={handlePrevClick}
              disabled={findNextQuestionWithRecommendation(recommendationStatus[categoryKey]?.currentQuestionIndex || 0, 'prev') === null}
              className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
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
              className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
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
      <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold mb-2">{recommendation.title}</h3>
        <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">{recommendation.description}</p>
        
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
    resultsData: Results
  ) => {
    try {
      const db = getFirestore();
      const userRef = doc(db, "users", userId);

      const testResults = {
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
      };

      // Verificar si es una retoma del test para determinar dónde guardar
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      const isRetake = userData?.hasRetakenTest === true;
      
      let updateData: any;
      
      if (isRetake) {
        // Es el segundo intento - guardar solo testResults2, NO sobrescribir answers2
        updateData = {
          testResults2: testResults
        };
      } else {
        // Es el primer intento - guardar solo testResults, NO sobrescribir answers
        updateData = {
          testResults
        };
      }
      await updateDoc(userRef, updateData);
    } catch (err) {
      console.error("Error saving results:", err);
      setError(
        "Hubo un error al guardar tus resultados. Por favor, inténtalo de nuevo."
      );
    }
  }, [userId]);

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
        // Verificación adicional de userId
        if (!userId) {
          console.error('No userId provided to ResultsDisplay')
          setError("Error: No se pudo identificar al usuario");
          setIsDataLoaded(true);
          return;
        }

        const userDoc = await getDoc(doc(db, "users", userId));
        
        if (!userDoc.exists()) {
          console.error(`User document not found for userId: ${userId}`)
          setError("Error: No se encontró la información del usuario");
          setIsDataLoaded(true);
          return;
        }

        const userData = userDoc.data();

        if (!userData) {
          console.error('User data is null or undefined')
          setError("Error: Datos del usuario no válidos");
          setIsDataLoaded(true);
          return;
        }

        // Verificar si es una retoma del test para usar las respuestas correctas
        const isRetake = userData?.hasRetakenTest === true;
        const answers = isRetake ? userData?.answers2 : userData?.answers;
        
        if (!answers || typeof answers !== 'object') {
          console.error('No valid answers found for user')
          setError("No se encontraron respuestas del test válidas");
          setIsDataLoaded(true);
          return;
        }

        setUserTestAnswers(answers);
        const veracityScore = isRetake ? (userData?.veracityScore2 || 0) : (userData?.veracityScore || 0);

        // Verificación más estricta del veracityScore
        if (veracityScore >= 4) {
          console.log(`User ${userId} has veracityScore ${veracityScore}, showing inconsistency message`)
          setIsVeracityValid(false);
          setIsDataLoaded(true);
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

        // Solo guardar resultados si no existen ya en Firebase
        // Esto evita sobrescribir los datos que ya se guardaron en TestForm
        const existingResults = isRetake ? userData?.testResults2 : userData?.testResults;
        
        if (!existingResults) {
          await saveResultsToFirebase(calculatedResults);
        }

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
            if (savedRecData?.countdownStartTime) {
              const elapsed = Math.floor((Date.now() - savedRecData.countdownStartTime) / 1000);
              const remaining = Math.max(0, UNLOCK_DELAY_SECONDS - elapsed);
              
              if (remaining > 0) {
                startTimer(category, rec.id, UNLOCK_DELAY_SECONDS);
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

          // Determinar un currentQuestionIndex válido:
          // 1) Si hay un valor guardado, usarlo (pero clamp dentro del rango).
          // 2) Si no, encontrar el primer índice de pregunta en esta categoría cuya respuesta sea incorrecta.
          const savedIndex = savedRecommendationProgress[category]?.currentQuestionIndex;
          const questionNums = categoryQuestions[category as keyof typeof categoryQuestions] || [];
          // Buscar primer índice con respuesta incorrecta
          let firstWrongIndex = questionNums.findIndex(qn => answers[qn] !== importedCorrectAnswers[qn]);
          if (firstWrongIndex === -1) firstWrongIndex = 0; // si no hay incorrectas, fallback a 0

          // Si hay savedIndex, asegurarse que esté dentro de los límites [0, questionNums.length - 1]
          let initialIndex = typeof savedIndex === 'number' ? savedIndex : firstWrongIndex;
          if (initialIndex < 0) initialIndex = 0;
          if (initialIndex > Math.max(0, questionNums.length - 1)) initialIndex = questionNums.length - 1;

          initialRecommendationStatus[category] = {
            isOpen:
              savedRecommendationProgress[category]?.isOpen !== undefined
                ? savedRecommendationProgress[category]?.isOpen
                : true,
            userAnswers: answers,
            categoryLevel: catLevel,
            recommendationProgress: categoryRecProgress,
            currentQuestionIndex: initialIndex,
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

  // Efecto independiente para asegurar sincronización de hasRetakenTest con Firebase
  useEffect(() => {
    const fetchHasRetakenTest = async () => {
      try {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, "users", userId));
        const userData = userDoc.data();
        if (userData) {
          setHasRetakenTest(userData.hasRetakenTest ?? false);
          
          // Contar cuántos intentos del test ha realizado (máximo 2)
          let attempts = 1;
          if (userData?.hasRetakenTest === true) {
            attempts = 2;
          }
          setTestAttempts(attempts);
        }
      } catch (err) {
        console.error("Error fetching hasRetakenTest:", err);
      }
    };
    fetchHasRetakenTest();
  }, [userId]);

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
    if (!userTestAnswers) {
      return {
        totalQuestionsWithRecommendations: 0,
        completedQuestionsWithRecommendations: 0,
        currentQuestionIndex: 0,
        progressPercentage: 100
      };
    }
    
    const allQuestions = categoryQuestions[category as keyof typeof categoryQuestions];
    const userAnswers = userTestAnswers;
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
  }, [recommendationStatus, userTestAnswers]);

  const allCategoriesCompleted = useMemo(() => Boolean(
    results &&
      recommendationStatus &&
      userTestAnswers &&
      Object.entries(results).every(([category, data]) => {
        if (data.level !== "BAJO") return true;
        
        const progress = calculateRealProgress(category);
        return progress.completedQuestionsWithRecommendations >= progress.totalQuestionsWithRecommendations;
      })
  ), [results, recommendationStatus, calculateRealProgress, userTestAnswers]);

  // Función para manejar el caso de respuestas inconsistentes (NO marca hasRetakenTest)
  const handleRetakeAfterInconsistency = useCallback(async () => {
    try {
      
      // Limpiar localStorage del test anterior
      localStorage.removeItem("testAnswers");
      localStorage.removeItem("testStartTime");
      
      const db = getFirestore();
      const userRef = doc(db, "users", userId);
      
      // Limpiar los datos del test anterior que fueron inconsistentes
      // Esto asegura que las nuevas respuestas se guarden en el campo correcto
      await updateDoc(userRef, {
        answers: null,
        veracityScore: null,
        testDuration: null,
        lastTestDate: null,
        testResults: null
      });
      
      
      // Navegar al test sin marcar hasRetakenTest
      router.push("/test");
      
    } catch (error) {
      console.error("Error en retake after inconsistency:", error);
      // En caso de error, intentar navegar al test de todas formas
      router.push("/test");
    }
  }, [userId, router]);

  const handleResetTest = useCallback(async () => {
    try {
      
      // Limpiar localStorage del test anterior
      localStorage.removeItem("testAnswers");
      localStorage.removeItem("testStartTime");
      
      const db = getFirestore();
      const userRef = doc(db, "users", userId);
      
      // Obtener el documento actual para verificar el estado
      const userDoc = await getDoc(doc(db, "users", userId));
      const userData = userDoc.data();
      
      
      // Solo permitir 2 intentos máximo
      if (userData?.hasRetakenTest === true) {
        alert("Ya has realizado el test 2 veces. No se permiten más intentos.");
        return;
      }
      
      
      // Marcar que es una retoma del test
      await updateDoc(userRef, {
        hasRetakenTest: true
      });
      
      
      // Verificar que se actualizó correctamente
      const updatedDoc = await getDoc(doc(db, "users", userId));
      const updatedData = updatedDoc.data();
      
      // Verificar que la actualización fue exitosa antes de navegar
      if (updatedData?.hasRetakenTest !== true) {
        console.error("Error: hasRetakenTest no se actualizó correctamente");
        alert("Hubo un error al preparar el test. Por favor intenta nuevamente.");
        return;
      }
      
      // Actualizar el estado local
      setHasRetakenTest(true);
      
      
      // Navegar al test
      router.push("/test");
      
    } catch (error) {
      console.error("Error resetting test:", error);
      // En caso de error, intentar navegar al test de todas formas
      router.push("/test");
    }
  }, [userId, router]);

  const handleContinueToNextQuestion = useCallback((category: string) => {
    if (!userTestAnswers) return;
    
    const currentQuestionIndex = recommendationStatus[category]?.currentQuestionIndex || 0;
    const allQuestions = categoryQuestions[category as keyof typeof categoryQuestions];
    const userAnswers = userTestAnswers;
    
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

  // Función para obtener los resultados de un intento específico
  const getAttemptResults = useCallback(async (attemptNumber: number) => {
    try {
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, "users", userId));
      const userData = userDoc.data();
      
      if (!userData) return null;
      
      const suffix = attemptNumber > 1 ? attemptNumber.toString() : '';
      const answers = userData[`answers${suffix}`] || {};
      const testResults = userData[`testResults${suffix}`] || {};
      const testDuration = userData[`testDuration${suffix}`] || 0;
      const veracityScore = userData[`veracityScore${suffix}`] || 0;
      const lastTestDate = userData[`lastTestDate${suffix}`] || null;
      
      return {
        attemptNumber,
        answers,
        testResults,
        testDuration,
        veracityScore,
        lastTestDate
      };
    } catch (error) {
      console.error("Error fetching attempt results:", error);
      return null;
    }
  }, [userId]);

  // Array de aspectos en orden
  const aspectCategories = useMemo(() => ['personal', 'social', 'academico', 'fisico'], []);

  // Función para navegar al siguiente aspecto
  const handleNextAspect = useCallback(() => {
    setCurrentAspectIndex(prev => Math.min(prev + 1, aspectCategories.length - 1));
  }, [aspectCategories.length]);

  // Función para navegar al aspecto anterior
  const handlePrevAspect = useCallback(() => {
    setCurrentAspectIndex(prev => Math.max(prev - 1, 0));
  }, []);

  // Obtener el aspecto actual
  const currentAspect = aspectCategories[currentAspectIndex];
  const currentAspectData = results?.[currentAspect as keyof Results];
  const currentAspectStatus = recommendationStatus?.[currentAspect];

  // Función para verificar si el aspecto actual está completado
  const isCurrentAspectCompleted = useCallback(() => {
    if (!currentAspectData || !currentAspectStatus) return false;
    
    // Si el nivel no es BAJO, está completado automáticamente
    if (currentAspectData.level !== "BAJO") return true;
    
    // Para nivel BAJO, verificar si se completaron todas las actividades de los 3 días
    const recommendations = getRecommendationsForCategory(
      currentAspect,
      currentAspectData.level,
      userTestAnswers || {}
    );
    
    // Verificar que todas las recomendaciones estén completadas
    return recommendations.every(rec => {
      const progress = currentAspectStatus.recommendationProgress?.[rec.id];
      return progress?.isCompleted === true;
    });
  }, [currentAspectData, currentAspectStatus, currentAspect, getRecommendationsForCategory]);

  // Función para verificar si todos los aspectos están completados
  const areAllAspectsCompleted = useCallback(() => {
    return aspectCategories.every(aspect => {
      const aspectData = results?.[aspect as keyof Results];
      const aspectStatus = recommendationStatus?.[aspect];
      
      if (!aspectData || !aspectStatus) return false;
      
      if (aspectData.level !== "BAJO") return true;
      
      // Para nivel BAJO, verificar que todas las recomendaciones estén completadas
      const recommendations = getRecommendationsForCategory(
        aspect,
        aspectData.level,
        userTestAnswers || {}
      );
      
      return recommendations.every(rec => {
        const progress = aspectStatus.recommendationProgress?.[rec.id];
        return progress?.isCompleted === true;
      });
    });
  }, [results, recommendationStatus, aspectCategories, getRecommendationsForCategory, userTestAnswers]);

  // Componente de botón optimizado para evitar re-renderizados
  const OptimizedButton = memo<{
    onClick: () => void;
    disabled?: boolean;
    className: string;
    children: React.ReactNode;
  }>((props) => (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={props.className}
    >
      {props.children}
    </button>
  ));
  OptimizedButton.displayName = 'OptimizedButton';

  // NUEVO: comprobar si LOS 4 aspectos están en nivel MEDIO o ALTO
  const allFourHigh = useMemo(() => {
    if (!results) return false;
    const atLeastMedium = (level?: string) => level === "MEDIO" || level === "ALTO";
    return (
      atLeastMedium(results.personal?.level) &&
      atLeastMedium(results.social?.level) &&
      atLeastMedium(results.academico?.level) &&
      atLeastMedium(results.fisico?.level)
    );
  }, [results]);

  // Mostrar loading hasta que los datos estén cargados
  if (!isDataLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-white">
          Error
        </h1>
        <div className="bg-red-100 border-l-4 border-red-500 p-3 sm:p-4 rounded">
          <p className="text-red-700 text-sm sm:text-base">{error}</p>
          <button
            onClick={() => router.push('/test')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Test
          </button>
        </div>
      </div>
    );
  }

  if (!isVeracityValid) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-white">
          Resultados del Test
        </h1>
        <div className="bg-celeste border-l-4 p-4 sm:p-8 rounded-lg">
          <div className="flex flex-col sm:flex-row">
            <div className="flex-shrink-0 mb-3 sm:mb-0">
              <svg
                className="h-6 w-6 mx-auto sm:mx-0"
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
            <div className="sm:ml-3 text-center sm:text-left">
              <h3 className="text-base sm:text-lg font-medium">Respuestas Inconsistentes</h3>
              <div className="mt-2">
                <p className="text-sm sm:text-base">
                  Hemos detectado algunas inconsistencias en tus respuestas.
                  Para obtener una evaluación precisa de tu autoestima, es
                  importante que respondas con total sinceridad. ¿Te gustaría
                  intentar el test nuevamente?
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleRetakeAfterInconsistency}
                  className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
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
      <div className="text-center text-white text-sm sm:text-base">
        Cargando resultados y recomendaciones...
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-white">
        Resultados del Test de Autoestima
      </h1>
 

      <div className="text-center text-base sm:text-lg font-bold mb-4 sm:mb-6 bg-celeste rounded-lg border border-gray-300 p-3 sm:p-4 shadow-sm w-full">
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
        generalLevel={generalLevel}
      />

      {/* REEMPLAZO: Si los 4 aspectos están en ALTO mostrar mensaje de agradecimiento,
          de lo contrario mostrar la UI existente de orientaciones y recomendaciones */}
      {allFourHigh ? (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3 text-gray-800">Gracias por tu valiosa participación</h2>
          <p className="text-gray-700 text-base">
            Ahora presentas una muy buena autoestima y esperamos sigas manteniéndola así. Éxitos.
          </p>
        </div>
      ) : (
        <>
          <h1 className="text-2xl sm:text-3xl font-bold text-center mt-6 mb-4 sm:mb-6 text-white">
            Orientaciones y recomendaciones a seguir
          </h1>
          <p className="text-center text-white text-sm sm:text-base mb-4">
            Se recomienda realizar las siguientes actividades para mejorar su autoestima y así poder prevenir posibles problemas psicológicos relacionados con una baja autoestima.
          </p>

          {/* Indicador de progreso de aspectos */}
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-center space-x-2 mb-3 sm:mb-4">
              {aspectCategories.map((aspect, index) => (
                <div
                  key={aspect}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                    index === currentAspectIndex
                      ? 'bg-blue-600'
                      : index < currentAspectIndex
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-white text-xs sm:text-sm">
              Aspecto {currentAspectIndex + 1} de {aspectCategories.length}: {currentAspect.charAt(0).toUpperCase() + currentAspect.slice(1)}
            </p>
          </div>

          {/* Contenido del aspecto actual */}
          {currentAspectData && currentAspectStatus && (
            <div className="bg-celeste p-4 sm:p-6 rounded-lg shadow-lg w-full mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl capitalize mb-3 sm:mb-4">Dominio {currentAspect}</h2>
              
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm sm:text-base">Nivel:</span>
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getLevelClass(
                      currentAspectData.level
                    )}`}
                  >
                    {currentAspectData.level}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm sm:text-base">Puntuación:</span>
                  <span className="text-sm sm:text-base">{currentAspectData.score}/6</span>
                </div>
              </div>

              {/* Para niveles MEDIO y ALTO, mostrar solo recomendaciones generales */}
              {currentAspectData.level !== "BAJO" ? (
                <div>
                  {userTestAnswers && getRecommendationsForCategory(
                    currentAspect,
                    currentAspectData.level,
                    userTestAnswers
                  ).map((rec) => (
                    <div key={rec.id} className="mt-3 sm:mt-4 p-3 sm:p-4 bg-white rounded-md">
                      <h3 className="font-semibold text-base sm:text-lg">{rec.title}</h3>
                      <p className="mt-2 text-gray-700 text-sm sm:text-base">{rec.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                /* Para nivel BAJO, mostrar el sistema completo de actividades */
                <div>
                  {(() => {
                    if (!userTestAnswers) return false;
                    const progress = calculateRealProgress(currentAspect);
                    return progress.completedQuestionsWithRecommendations < progress.totalQuestionsWithRecommendations;
                  })() ? (
                    <>
                      {userTestAnswers && getRecommendationsForCategory(
                        currentAspect,
                        currentAspectData.level,
                        userTestAnswers
                      )
                        .filter((rec) => {
                          // Clampear el índice antes de obtener el número de pregunta para evitar índices fuera de rango
                          const questionsForAspect = categoryQuestions[currentAspect as keyof typeof categoryQuestions] || [];
                          const rawIndex = currentAspectStatus?.currentQuestionIndex ?? 0;
                          const clampedIndex = Math.min(Math.max(rawIndex, 0), Math.max(0, questionsForAspect.length - 1));
                          const questionNum = questionsForAspect[clampedIndex];
                          return rec.relatedQuestion === questionNum || !rec.relatedQuestion;
                        })
                        .map((rec) => (
                          <RecommendationDisplay
                            key={rec.id}
                            recommendation={rec}
                            categoryKey={currentAspect}
                          />
                        ))}
                    </>
                  ) : (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-3 sm:px-4 py-3 rounded relative mb-4">
                      <p className="text-sm sm:text-base">
                        {(() => {
                          if (!userTestAnswers) return "Cargando...";
                          const progress = calculateRealProgress(currentAspect);
                          if (progress.totalQuestionsWithRecommendations === 0) {
                            return "¡Excelente! Todas tus respuestas en esta categoría fueron correctas.";
                          }
                          return "¡Has completado todas las actividades para esta categoría!";
                        })()}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navegación entre aspectos */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
            <button
              onClick={handlePrevAspect}
              disabled={currentAspectIndex === 0}
              className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                currentAspectIndex === 0
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Anterior Aspecto
            </button>

            <div className="text-center text-white text-xs sm:text-sm">
              {isCurrentAspectCompleted() ? (
                <div className="mb-2">
                  <span className="text-green-400">✓ Aspecto completado - Puedes continuar</span>
                </div>
              ) : null}
            </div>

            <button
              onClick={handleNextAspect}
              disabled={currentAspectIndex === aspectCategories.length - 1}
              className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                currentAspectIndex === aspectCategories.length - 1
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              Siguiente Aspecto
            </button>
          </div>

          {/* Botón para repetir el test cuando todos los aspectos estén completados */}
          {areAllAspectsCompleted() && hasRetakenTest === false && (
            <div className="mt-6 sm:mt-8 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                ¡Felicitaciones! Has completado todas las actividades
              </h3>

                             <button
                 onClick={() => {
                   handleResetTest();
                 }}
                 className="bg-blue-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-base sm:text-lg font-medium"
               >
                 Realizar Test Otra Vez
               </button>
            </div>
          )}
        </>
      )}

      {showFeedbackModal && currentFeedbackRec && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
              Retroalimentación para: {currentFeedbackRec.title}
            </h3>
            {currentFeedbackRec.feedbackQuestions?.map((q) => (
              <div key={q.key} className="mb-3 sm:mb-4">
                <p className="font-medium mb-2 text-sm sm:text-base">{q.question}</p>
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
                    <span className="ml-2 text-sm sm:text-base">Sí</span>
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
                    <span className="ml-2 text-sm sm:text-base">No</span>
                  </label>
                </div>
              </div>
            ))}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6">
              <button
                onClick={handleCloseFeedbackModal}
                className="px-3 sm:px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors text-sm sm:text-base"
              >
                Cerrar
              </button>
              <button
                onClick={submitAllFeedback}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
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
