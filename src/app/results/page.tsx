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
          setUserInfo({...userData,lastTestDate:userData.lastTestDate.toDate()}as UserInfo)
          setUserId(user.uid)
        } else {
          // Silenciosamente redirigir al inicio sin mostrar error
          // Controlando el caso "User document not found"
          router.push('/')
        }
      } catch (error) {
        console.error("Error retrieving user document:", error);
        // Silenciosamente manejar cualquier error redirigiendo
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="w-full px-2 sm:px-4 py-4 sm:py-8 min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      {userId && userInfo && (
        <ResultsDisplay userId={userId} userInfo={userInfo} />
      )}
    </div>
  )
}