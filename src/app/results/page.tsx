'use client'

import { ResultsDisplay } from '../../components/ResultsDisplay/ResultsDisplay'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

export default function Results() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [hasAnswers, setHasAnswers] = useState(false)

  useEffect(() => {
    const auth = getAuth()
    const db = getFirestore()

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login')
        return
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setUserInfo(userData)
          setUserId(user.uid)
          // Check if user has answers
          setHasAnswers(!!userData.answers)
        } else {
          console.error('User document not found')
          router.push('/')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  if (!hasAnswers) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">No has completado el test todavía</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Realizar Test
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">
        Resultados del Test
      </h1>
      
      {userId && userInfo && (
        <ResultsDisplay userId={userId} userInfo={userInfo} />
      )}
    </div>
  )
}