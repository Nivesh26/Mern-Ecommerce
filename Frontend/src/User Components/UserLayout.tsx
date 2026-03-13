import { Outlet } from 'react-router-dom'
import Chatbot from './Chatbot'

const UserLayout = () => {
  return (
    <>
      <Outlet />
      <Chatbot />
    </>
  )
}

export default UserLayout
