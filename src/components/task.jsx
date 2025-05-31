"use client"
import React from 'react'
import { Button } from './ui/button'

export const Task = ({ task, handleComplete, index}) => {
  return (
    <div className='flex gap-4 justify-between'>
      <Button className='p-5 rounded-lg cursor-pointer flex justify-between' variant='outline' onClick={() => handleComplete(task)}>
        
        <span className='text-xl'>{task.title}</span>
      </Button>
        <span className='min-w-5'>{task.date}</span>

    </div>


    
  )
}
