"use client"
import { useAuth } from '@/contexts/authContext'
import { Loader2Icon } from 'lucide-react'
import React from 'react'

function ApplicationLayout({ authenticated, notauthenticated }) {

  const { user, authLoaded } = useAuth()

  if(!authLoaded) {
    return (
      <div className='flex items-center justify-center'>
        <Loader2Icon className='size-20 animate-spin'/>
      </div>

    )
  }

  return (
    <>
      {
        user === null
        ? notauthenticated
        : authenticated
      }
    </>
  )
}

export default ApplicationLayout