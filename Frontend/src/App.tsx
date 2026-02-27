import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Homepage from './User Pages/Homepage'
import Shop from './User Pages/Shop'
import New from './User Pages/New'
import Aboutus from './User Pages/Aboutus'
import Contact from './User Pages/Contact'
import Userlogin from './Logins/Userlogin'
import WhatsAppChat from './User Components/WhatsAppChat'
import UserSignup from './Logins/UserSignup'
import AdminSignup from './Logins/AdminSignup'
import Adminlogin from './Logins/Adminlogin'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
       
        {/* Logins User*/}
        <Route path="/login" element={<Userlogin />} />
        <Route path="/signup" element={<UserSignup />} /> 

        {/* Logins Admin*/}
        <Route path="/adminlogin" element={<Adminlogin />} />
        <Route path="/adminsignup" element={<AdminSignup />} />


      </Routes>
      <WhatsAppChat />
    </BrowserRouter>
  )
}

export default App