import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"

interface ProtectedRoutesProps{
    children:ReactNode
}
function ProtectedRoutes({children}:ProtectedRoutesProps) {
    const token = localStorage.getItem("token")

    if(!token){
        return <Navigate to='/register' replace />
    }
  return <>{children}</>
}

export default ProtectedRoutes
