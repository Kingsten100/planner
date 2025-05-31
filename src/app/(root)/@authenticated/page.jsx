"use client"

import { TaskColumn } from '@/components/task-column'
import { useAuth } from '@/contexts/authContext'
import { isValid, parse } from 'date-fns'
import { useSearchParams } from 'next/navigation'
import React from 'react'




function HomePage() {

    const searchParams = useSearchParams()
    const date = searchParams.get("date")
    const parsed = date
      ? parse(date, "yyyy-MM-dd", new Date())
      : new Date()
    const selectedDate = isValid(parsed) ? parsed : new Date()

    const { user } = useAuth()

  return (
    <>
      <div className='mt-10 pb-20'>
        <TaskColumn date={selectedDate} user={user}/>
      </div>
    </>
  )
}

export default HomePage