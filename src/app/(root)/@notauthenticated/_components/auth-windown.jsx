"use client"
import React, { useState } from 'react'
import { RegisterForm, registerFormSchema } from './register-form'
import { useForm } from 'react-hook-form'
import { LoginForm, loginFormSchema } from './login-form'
import { zodResolver } from '@hookform/resolvers/zod'

export const AuthWindow = () => {

  const [showLogin, setShowLogin] = useState(true)

  const changeForm = (formName) => {
    if(formName === "login") {
      setShowLogin(true)
    } else if(formName === "register") {
      setShowLogin(false)
    }
  }

  const loginForm = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const registerForm = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: '',
      displayName: '',
      password: '',
      confirmPassword: ''
    }
  })



  return (
    <>
      {
        showLogin ? <LoginForm changeForm={changeForm} form={loginForm}/> : <RegisterForm changeForm={changeForm} form={registerForm}/>
      }
    </>
  )
}
