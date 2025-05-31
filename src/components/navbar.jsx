"use client"

import { useAuth } from '@/contexts/authContext'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'

export const Navbar = () => {

  const { isAdmin, logout } = useAuth()

  const router = useRouter()


  return (
    <nav className='flex items-center justify-between py-10'>
      <div>
        <Link className='text-4xl font-bold' href='/'><h1>Planner</h1></Link>
      </div>
      <div className='flex gap-4'>
        <Button variant='outline' onClick={logout}>Logga ut</Button>

        {
          isAdmin() && (
            <div className='hidden md:flex gap-4'>
            <Button asChild variant='outline' size='lg'> 
             <Link href='/all'>Alla</Link>
            </Button>
            <Button asChild variant='outline' size='lg'>
              <Link href='/add'>Lägg till uppgift</Link>
            </Button>
            <Button asChild variant='outline' size='lg'>
              <Link href='/settings'>Inställningar</Link>
            </Button>
            </div>
          )
        }
        {
          isAdmin() && (
            <div className='md:hidden mx-auto'>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className='border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0  outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive p-2' variant='outline'>Meny</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => {router.push('/all')}}>Alla Uppgifter</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {router.push('/add')}}>Lägg Till Uppgifter</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {router.push('/settings')}}>Inställningar</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        }
      </div>
    </nav>
  )
}
