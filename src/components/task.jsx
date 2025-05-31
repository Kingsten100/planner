"use client"
import React from 'react'
import { Button } from './ui/button'

export const Task = ({ task, handleComplete, index}) => {
  return (
    
      <Button className='p-5 rounded-lg cursor-pointer flex justify-between' variant='outline' onClick={() => handleComplete(task)}>
        
        <span className='text-xl'>{task.title}</span>
        <span>{task.date}</span>
        
      </Button>


    
  )
}
