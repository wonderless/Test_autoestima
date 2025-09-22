'use client'

import { ResultsDisplay } from '../../components/ResultsDisplay/ResultsDisplay'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'  
import { UserInfo } from '@/types/userInfo'
import { useAuth } from '@/contexts/AuthContext'
import { db } from '@/lib/firebase/config'

export default function Results() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const { user, loading: authLoading } = useAuth() // Destructurar loading

  useEffect(() => {
    const verifyUserAndFetchData = async () => {
      if (authLoading) {
        return // No hacer nada mientras está cargando
      }

      if (!user) {
        router.push('/')
        return
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))

        if (userDoc.exists()) {
          const userData = userDoc.data()
          setUserInfo({
            ...userData,
            lastTestDate: userData.lastTestDate.toDate()
          } as UserInfo)
          setUserId(user.uid)
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error("Error retrieving user document:", error)
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    verifyUserAndFetchData()
  }, [user, authLoading, router])

  if (authLoading || isLoading) {
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