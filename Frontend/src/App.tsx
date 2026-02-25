import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Homepage from './User Pages/Homepage'
import Shop from './User Pages/Shop'
import New from './User Pages/New'
import Aboutus from './User Pages/Aboutus'
import Contact from './User Pages/Contact'
import Userlogin from './Logins/Userlogin'
import WhatsAppChat from './User Components/WhatsAppChat'
import UserSignup from './Logins/UserSignup'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/new" element={<New />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/contact" element={<Contact />} />

        {/* Logins User*/}
        <Route path="/login" element={<Userlogin />} />
        <Route path="/signup" element={<UserSignup />} /> 


      </Routes>
      <WhatsAppChat />
    </BrowserRouter>
  )
}

export default App