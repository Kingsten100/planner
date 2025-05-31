"use client"

import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { doc, getDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [authLoaded, setAuthLoaded] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if(!firebaseUser) {
        setUser(null)
        setAuthLoaded(true)
        return
      }

      const docRef = doc(db, "users", firebaseUser.uid)

      const getUserDocWithRetry = async (retries = 5, delay = 300) => {
        let docSnap = null
        for(let i = 0; i < retries; i++) {
          docSnap = await getDoc(docRef)
          if(docSnap.exists()) break

          await new Promise(resolve => setTimeout(resolve, delay))
        }

        return docSnap
      }

      const docSnap = await getUserDocWithRetry()

      if(docSnap && docSnap.exists()) {
        setUser({ uid: firebaseUser.uid, ...docSnap.data()})
      } else {
        console.warn("Användaren kunde inte hämtas")
        setUser(null)
      }

      setAuthLoaded(true)
    })

    return () => unsub()
  }, [])


//========= REGITRERING =========//
  const register = async (email, password, displayName) => {
    setLoading(true)

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(res.user, { displayName })

      if(!res.user) {
        console.log('Ingen användare')
        return
      }

      const docRef = doc(db, "users", res.user.uid)

      await setDoc(docRef, {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName,
        role: 'user',
        createdAt: Timestamp.now()
      })

    } catch (err) {
      console.log("Fel vid registrering: " + err)
      throw err
    } finally {
      setLoading(false)
    }

  }

  //======== LOGOUT ========//
  const logout = async () => {
    router.replace('/')
    await signOut(auth)
  }

  //========= LOGIN =========//
  const login = async (email, password) => {
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      console.log('Fel vid inloggning: ' + err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  //======== CHECKA OM ADMIN =======//

  const isAdmin = () => {
    if(!user) return false
    return user.role === 'admin'
  }

  //========= UPPDATERA ROLL =======//
  const updateUserRole = async (userId, newRole) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { role: newRole });
    console.log("Roll uppdaterad!");
  } catch (error) {
    console.error("Fel vid uppdatering av roll:", error);
  }
};


  const value = {
    user,
    setUser,
    loading,
    authLoaded,
    register,
    login,
    logout,
    isAdmin,
    updateUserRole
  }

  return (
    <AuthContext.Provider value={value}>
      { children }
    </AuthContext.Provider>
  )

}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if(!context) {
    throw new Error("UseAuth måste användas inuti en  AuthProvider")
  }
  return context
}