import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Homepage from './User Pages/Homepage'
import Shop from './User Pages/Shop'
import New from './User Pages/New'
import Aboutus from './User Pages/Aboutus'
import Contact from './User Pages/Contact'
import Userlogin from './Logins/Userlogin'

import UserSignup from './Logins/UserSignup'
import AdminSignup from './Logins/AdminSignup'
import Adminlogin from './Logins/Adminlogin'
import Productdetail from './User Pages/Productdetail'
import Adminhomepage from './Admin/Adminhomepage'
import Product from './Admin/Product'
import Orders from './Admin/Orders'
import Customer from './Admin/Customer'
import Message from './Admin/Message'
import Settings from './Admin/Settings'
import Cart from './User Pages/Cart'
import Profile from './User Pages/Profile'

const AppContent = () => {
  return (
    <>
      <Routes>
        {/* User Pages*/}
        <Route path="/" element={<Homepage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/new" element={<New />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product" element={<Productdetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />

        {/* Logins User*/}
        <Route path="/login" element={<Userlogin />} />
        <Route path="/signup" element={<UserSignup />} />

        {/* Logins Admin*/}
        <Route path="/adminlogin" element={<Adminlogin />} />
        <Route path="/adminsignup" element={<AdminSignup />} />

        {/* Admin Pages*/}
        <Route path="/adminhomepage" element={<Adminhomepage />} />
        <Route path="/adminproduct" element={<Product />} />
        <Route path="/adminorders" element={<Orders />} />
        <Route path="/admincustomer" element={<Customer />} />
        <Route path="/adminmessage" element={<Message />} />
        <Route path="/adminsettings" element={<Settings />} />
      </Routes>
   
    </>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  )
}

export default App