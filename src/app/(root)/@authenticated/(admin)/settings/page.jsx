"use client"
import React, { useState } from 'react'

import { useUsers } from '@/contexts/usersContext'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/authContext'


const AdminSettings = () => {

 
  const { updateUserRole, isAdmin, loading } = useAuth()
  const { users } = useUsers()
  

  
  const handleRoleToggle = async (userId, current) => {
    const newRole = current === 'admin' ? 'user' : 'admin'
    await updateUserRole(userId, newRole)
  }
  
  return (
     <>

     
     {
      isAdmin() && (
        users.map(user =>(
          <div key={user.uid} className='mb-4 flex items-center gap-4'>
            <p>{user.displayName}</p>
            <Button onClick={() => handleRoleToggle(user.uid, user.role)} disabled={loading} variant='outline'>Byt roll till: {user.role === 'admin' ? 'User' : 'Admin'}</Button>
          </div>
        ))
      ) 
      }

      
     </>
  )
}

export default AdminSettings
