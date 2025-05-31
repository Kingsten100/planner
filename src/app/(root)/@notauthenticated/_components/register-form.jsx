"use client"
import React, { useState } from 'react'
import { z } from 'zod'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from '@/contexts/authContext'
import { getErrorMessage } from '@/lib/getFirebaseError'

export const registerFormSchema = z.object({
  email: z.string().email({ message: "Du måste ange en giltig epostadress"}),
  displayName: z.string()
    .nonempty({ message: "Du måste ange ett användarnamn" })
    .min(3, { message: "Användarnamnet måste vara minst 3 tecken långt" })
    .max(30, { message: "Användarnamnet får inte vara längre än 30 tecken" }),
  password: z.string().nonempty({ message: "Du måste ange ett lösenord" })
    .min(5, { message: "Lösenordet måste vara minst 5 tecken långt" }),
  confirmPassword: z.string().nonempty({ message: "Du måste upprepa lösenordet" })
}).refine(data => data.password === data.confirmPassword, {
  message: "Lösenorden matchar inte. Försök igen",
  path: ["confirmpassword"]
})

export const RegisterForm = ({ changeForm, form }) => {

  const [errorMessage, setErrorMessage] = useState(null)

  const { register, loading } = useAuth()

  async function onSubmit(values) {
    try {
      const { email, password, displayName } = values
      await register(email, password, displayName)
    } catch (err) {
      const errorMessage = getErrorMessage(err.code)
      setErrorMessage(errorMessage)
    }
  }


  return (
    <>
      <h2 className='text-center font-semibold text-2xl mb-5'>Registrera dig</h2>
      {
        errorMessage && <p className='text.red-500 text-center'>{errorMessage}</p>
      }

      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Användarnamn</FormLabel>
              <FormControl>
                <Input className="not-dark:border-gray-300" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Epost</FormLabel>
              <FormControl>
                <Input type="email" className="not-dark:border-gray-300" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lösenord</FormLabel>
              <FormControl>
                <Input type="password" className="not-dark:border-gray-300" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bekräfta lösenordet</FormLabel>
              <FormControl>
                <Input type="password" className="not-dark:border-gray-300" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p>Har du redan ett konto? <span onClick={() => changeForm("login")} className='underline cursor-pointer'>Logga in här</span></p>
        <Button disabled={loading} className="w-full sm:w-auto" type="submit">Registrera</Button>
      </form>
    </Form>
    </>
  )
}
