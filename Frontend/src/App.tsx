import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CartProvider } from './context/CartContext'
import UserLayout from './User Components/UserLayout'
import ProtectedRoute from './components/ProtectedRoute'
import RequireAuth from './components/RequireAuth'
import Homepage from './User Pages/Homepage'
import Shop from './User Pages/Shop'
import New from './User Pages/New'
import Aboutus from './User Pages/Aboutus'
import Contact from './User Pages/Contact'
import Userlogin from './Logins/Userlogin'
import UserSignup from './Logins/UserSignup'
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
        {/* User Pages + Login/Signup (with chatbot) */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/new" element={<New />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product" element={<Navigate to="/shop" replace />} />
          <Route path="/product/:id" element={<Productdetail />} />
          {/* Profile & Cart – require login; redirect to /login if not logged in */}
          <Route element={<RequireAuth />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/login" element={<Userlogin />} />
          <Route path="/signup" element={<UserSignup />} />
        </Route>


        {/* Admin Pages – ProtectedRoute: only role 'admin' can access */}
        <Route element={<ProtectedRoute />}>
          <Route path="/adminhomepage" element={<Adminhomepage />} />
          <Route path="/adminproduct" element={<Product />} />
          <Route path="/adminorders" element={<Orders />} />
          <Route path="/admincustomer" element={<Customer />} />
          <Route path="/adminmessage" element={<Message />} />
          <Route path="/adminsettings" element={<Settings />} />
        </Route>
      </Routes>
   
    </>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppContent />
        <ToastContainer position="top-right" autoClose={3000} theme="light" />
      </CartProvider>
    </BrowserRouter>
  )
}

export default App