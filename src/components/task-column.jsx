"use client"
import { useAuth } from '@/contexts/authContext'
import { useTasks } from '@/contexts/tasksContext'
import React from 'react'
import { TaskList } from './task-list'

export const TaskColumn = ({ user, date }) => {

  const {  completeTask, getTasksByUserForDate } = useTasks()

  const tasks = getTasksByUserForDate(user.uid, date)

  const notCompleted = tasks.filter(task => !task.completed)

  const { isAdmin } = useAuth()

  const handleComplete = async (task) => {
    completeTask(task.id)
  
  }

  return (
    <div className='w-full p-5 mx-auto rounded-xl flex flex-col border bg-slate-300'>
      <div>
        {
          isAdmin() && (
            <div className='flex gap-5'></div>
          )
        }
        <div className='flex items-center justify-between'>
          <p className='pb-2 font-semibold text-2xl'>{user.displayName}</p>
          <p>Deadline:</p>

        </div>
        <TaskList tasks={notCompleted} handleComplete={handleComplete}/>
      </div>
    </div>
  )
}
