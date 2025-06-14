"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./authContext"
import { collection, onSnapshot, query, QuerySnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

const UsersContext = createContext()

export const UsersProvider = ({ children }) => {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const { isAdmin } = useAuth()

  useEffect(() => {
    if(!isAdmin()) return

    const q = query(collection(db, "users"))
    const unsub = onSnapshot(q, querySnapshot => {
      const usersData = []

      querySnapshot.forEach(doc => {
        usersData.push({...doc.data(), id: doc.id})
      })
      setUsers(usersData)
    })
    return () => unsub()
  }, [isAdmin])

  const value = {
    users,
    loading
  }

  return (
    <UsersContext.Provider value={value}>
      { children }
    </UsersContext.Provider>
  )

}

export const useUsers = () => {
  const context = useContext(UsersContext)
  if(!context) {
    throw new Error('useUsers måste användas inuti en UsersProvider')
  }
  return context
}