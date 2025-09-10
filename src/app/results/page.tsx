'use client'

import { ResultsDisplay } from '../../components/ResultsDisplay/ResultsDisplay'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'  
import { UserInfo } from '@/types/userInfo'

export default function Results() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo | null >(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const auth = getAuth()
    const db = getFirestore()

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        // Verificación más robusta de autenticación
        if (!user) {
          console.log('No user authenticated, redirecting to login')
          router.push('/auth/loginUser')
          return
        }

        // Verificar que el usuario tenga un UID válido
        if (!user.uid) {
          console.error('User has no UID')
          router.push('/auth/loginUser')
          return
        }

        // Intentar obtener el documento del usuario con reintentos
        let userDoc = null
        let attempts = 0
        const maxAttempts = 3

        while (attempts < maxAttempts && !userDoc) {
          try {
            userDoc = await getDoc(doc(db, 'users', user.uid))
            if (!userDoc.exists()) {
              console.error(`User document not found for UID: ${user.uid}`)
              router.push('/auth/loginUser')
              return
            }
            break
          } catch (error) {
            attempts++
            console.warn(`Attempt ${attempts} failed to get user document:`, error)
            if (attempts < maxAttempts) {
              // Esperar un poco antes del siguiente intento
              await new Promise(resolve => setTimeout(resolve, 1000))
            } else {
              console.error('Max attempts reached, redirecting to login')
              router.push('/auth/loginUser')
              return
            }
          }
        }

        if (userDoc && userDoc.exists()) {
          const userData = userDoc.data()
          
          // Verificar que el usuario tenga datos básicos
          if (!userData || typeof userData !== 'object') {
            console.error('Invalid user data structure')
            router.push('/auth/loginUser')
            return
          }

          // Verificar que el usuario tenga respuestas del test
          const hasAnswers = userData.answers || userData.answers2
          if (!hasAnswers) {
            console.error('User has no test answers, redirecting to test')
            router.push('/test')
            return
          }

          setUserInfo({
            ...userData,
            lastTestDate: userData.lastTestDate?.toDate ? userData.lastTestDate.toDate() : userData.lastTestDate
          } as UserInfo)
          setUserId(user.uid)
        }
      } catch (error) {
        console.error("Error retrieving user document:", error);
        router.push('/auth/loginUser')
      } finally {
        setIsLoading(false)
        setAuthChecked(true)
      }
    })

    return () => unsubscribe()
  }, [router])

  // Mostrar loading hasta que se complete la verificación de autenticación
  if (isLoading || !authChecked) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Si no hay userId o userInfo después de la verificación, no renderizar nada
  // (el useEffect ya se encargó de la redirección)
  if (!userId || !userInfo) {
    return null
  }

  return (
    <div className="w-full px-2 sm:px-4 py-4 sm:py-8 min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <ResultsDisplay userId={userId} userInfo={userInfo} />
    </div>
  )
}