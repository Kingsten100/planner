import { AuthProvider } from "@/contexts/authContext"
import { TasksProvider } from "@/contexts/tasksContext"
import { UsersProvider } from "@/contexts/usersContext"


function Providers({ children }) {
  return (
    <AuthProvider>
      <UsersProvider>
        <TasksProvider>
          { children }
        </TasksProvider>
      </UsersProvider>
    </AuthProvider>
  )
}

export default Providers