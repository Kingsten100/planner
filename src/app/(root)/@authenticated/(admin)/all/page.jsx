import React from 'react'
import { AllUsersTasksList } from './_components/all-tasks'

const AllTaskPage = () => {
  return (
    <>
      
      <div className='grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(400px,1fr))]'>
        <AllUsersTasksList />
      </div>
    
    </>
  )
}

export default AllTaskPage
