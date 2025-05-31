"use client"
import React, { useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { useSearchParams, useRouter } from 'next/navigation'
import { eachDayOfInterval, parse } from 'date-fns'


import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Calendar } from '@/components/ui/calendar'

import { useUsers } from '@/contexts/usersContext'
import { useTasks } from '@/contexts/tasksContext'

const formSchema = z.object({
  title: z.string().nonempty({ message: 'Du måste fylla i uppgift'}),
  ownerId: z.string().nonempty({ message: 'Du måste ange en användare'}),
  date: z.date()
})

export const AddTaskForm = () => {

  const searchParams = useSearchParams()
  const presetDate = searchParams.get("date")
  const presetUserId = searchParams.get("userId")

  const { users } = useUsers()
  const { addTask, loading } = useTasks()
  const router = useRouter()

  const [errorMessage, setErrorMessage] = useState(null)
  const [submitted, setSubmitted] = useState(false)



  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      ownerId: presetUserId ?? '',
      date: presetDate ? parse(presetDate, 'yyyy-MM-dd', new Date()) ?? new Date() : new Date()
    }
  })

  async function onSubmit(values) {
    const base = {
      title: values.title,
      ownerId: values.ownerId,
      date: values.date
    }

    try {
      setSubmitted(true)

      await addTask({ ...base})

      form.reset()
      router.push('/')
    } catch (err) {
      console.error(err)
      setErrorMessage('Något gick fel')
      setSubmitted(false)
    } finally {
      setSubmitted(false)
    }
  }

  return (
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Uppgift</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="ownerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tilldelad till</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-52 justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? users.find(
                            (user) => user.uid === field.value
                          )?.displayName
                        : "Välj användare"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-0">
                  <Command>
                    <CommandInput
                      placeholder="Sök användare..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>Inga användare hittades.</CommandEmpty>
                      <CommandGroup>
                        {users.map((user) => (
                          <CommandItem
                            value={user.displayName.toLowerCase()}
                            key={user.uid}
                            onSelect={() => {
                              form.setValue("ownerId", user.uid)
                            }}
                          >
                            {user.displayName}
                            <Check
                              className={cn(
                                "ml-auto",
                                user.uid === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
          <FormItem>
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  />
              <FormMessage />
          </FormItem>
          )}
        />

    


        { errorMessage && <p className='text-red-500 text-sm'>{errorMessage}</p>}
        <Button disabled={loading || submitted} type="submit">{ loading ? "Skapar..." : "Skapa uppgift"}</Button>
      </form>
    </Form>
  )
}
