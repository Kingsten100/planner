import React from 'react'
import { Task } from './task'

export const TaskList = ({ tasks, handleComplete }) => {
  return (
    <>
    <div>
      {
        tasks.length <= 0 ? <span>Du har inga uppgifter</span> : ''
      }
    </div>
      <div className='flex flex-col gap-4 w-full'>
        {
          tasks.map((task, index) => (
            <Task key={task.id} task={task} handleComplete={handleComplete} index={index}/>
          ))
        }
      </div>
    
    </>
  )
}
