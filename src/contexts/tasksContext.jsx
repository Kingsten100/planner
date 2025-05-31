"use client"

import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore"
import { useAuth } from "./authContext"
import { db } from "@/lib/firebase"
import { format } from "date-fns"

const { createContext, useState, useEffect, useContext, useMemo } = require("react")

const TasksContext = createContext()

export const TasksProvider = ({ children }) => {

  const [loading, setLoading] = useState(false)
  const [tasks, setTasks] = useState([])

  const { isAdmin, authLoaded, user } = useAuth()

  useEffect(() => {
    if(!authLoaded || !user) return

    setLoading(true)

    let q

    if(user.role === 'admin') {
      q = query(collection(db, "tasks"), orderBy('date'), orderBy('order'))
    } else {
      q = query(collection(db, "tasks"), where("ownerId", "==", user.uid), orderBy("date"), orderBy("order"))
    }

    const unsub = onSnapshot(q, querySnap => {
      const updatedTask = querySnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTasks(updatedTask)
      setLoading(false)
    })

    return () => unsub()
  }, [isAdmin, user])


  const getNextOrder = () => {
    return Math.max(...tasks.map(task => task.order ?? 0), 0) + 1000
  }

  const addTask = async (taskData) => {
    if(!isAdmin()) return

    setLoading(true)

    try {
      const newTask = {
        ...taskData,
        date: format(taskData.date, "yyyy-MM-dd"),
        order: getNextOrder(),
        completed: false,
        createdAt: serverTimestamp()
      }
      await addDoc(collection(db, "tasks"), newTask)

    } catch (err) {
      console.log(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const completeTask = async (taskId) => {
    setLoading(true)

    try {
      const taskRef = doc(db, "tasks", taskId)
      await updateDoc(taskRef, {
        completed: true
      })
    } catch (err) {
      console.error("Gick inte att uppdatera uppgift: " + err)
    } finally {
      setLoading(false)
    }
  }

    const getTasksByUserForDate = (uid) => {
      return useMemo(() => {
        return tasks
        .filter(task => task.ownerId === uid )
        .sort((a, b) => a.order - b.order)
      }, [tasks, uid])
    }
    


  const value = {
    addTask,
    loading,
    tasks,
    completeTask,
    getTasksByUserForDate,
   
  }

  return (
    <TasksContext.Provider value={value}>
      { children }
    </TasksContext.Provider>
  )
}

export const useTasks = () => {
  const context = useContext(TasksContext)
  if(!context) {
    throw new Error("useTaks måste användas inuti en UsersProvider")
  }
  return context
}