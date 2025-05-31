import { Navbar } from '@/components/navbar'
import React from 'react'

const Layout = ({ children }) => {

  
  return (
    <>
      <main>
        <Navbar />
        { children }
      </main>
    </>
  )
}

export default Layout
