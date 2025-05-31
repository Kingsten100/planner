"use client"

const { useAuth } = require("@/contexts/authContext")
const { useRouter } = require("next/navigation")
const { useEffect } = require("react")

const AdminLayout = ({ children }) => {
  const { isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if(!isAdmin()) {
      router.replace("/")
    }
  }, [])

  if(!isAdmin) {
    return null
  }

  return (
    <>
      { children }
    </>
  )
}

export default AdminLayout