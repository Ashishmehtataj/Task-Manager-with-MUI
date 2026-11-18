import { BrowserRouter,Routes, Route } from 'react-router-dom'
import Login from './Components/Login'
import ProtectedRoutes from './Components/ProtectedRoutes'
import Task from './Components/Task'
import Register from './Components/Register'
import ForgotPassword from './Components/ForgotPassword'
import ResetPassword from './Components/ResetPassword'


function App() {
  return (
    <div>
      
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<ProtectedRoutes><Task/></ProtectedRoutes>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='forgotpassword' element={<ForgotPassword/>} />
        <Route path='resetpassword/:token' element={<ResetPassword />} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
