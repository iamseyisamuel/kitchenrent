import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Menu, X } from 'lucide-react'
import { useCart } from '../context/CartContext'

function scrollToHow() {
  const element = document.querySelector('#how-it-works')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default function Navbar() {
  const { cart, auth } = useCart()
  const [open, setOpen] = useState(false)
  const [profilePic, setProfilePic] = useState(auth?.profilePic || localStorage.getItem('kitchenrent_profile_pic') || '')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setProfilePic(auth?.profilePic || localStorage.getItem('kitchenrent_profile_pic') || '')
  }, [auth?.profilePic])

  useEffect(() => {
    const handleProfileUpdate = () => {
      setProfilePic(localStorage.getItem('kitchenrent_profile_pic') || auth?.profilePic || '')
    }
    window.addEventListener('profileUpdated', handleProfileUpdate)
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate)
  }, [auth?.profilePic])

  const handleHowItWorks = () => {
    if (location.pathname === '/') {
      scrollToHow()
    } else {
      navigate('/')
      setTimeout(() => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
    setOpen(false)
  }

  return (
    <header className="border-b bg-white">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-brand flex items-center justify-center text-white font-bold">KR</div>
          <div>
            <div className="text-lg font-semibold">KitchenRent</div>
            <div className="text-xs text-gray-500">Equip Your Kitchen</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/equipment" className={({isActive})=> isActive? 'text-brand font-medium': 'text-gray-700'}>Equipment</NavLink>
          <button type="button" onClick={handleHowItWorks} className="text-gray-700">How it Works</button>
          <NavLink to="/about" className="text-gray-700">About</NavLink>
          <NavLink to="/contact" className="text-gray-700">Contact</NavLink>
          {auth?.isAdmin && <NavLink to="/admin" className={({isActive})=> isActive? 'text-brand font-medium': 'text-gray-700'}>Admin Panel</NavLink>}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative text-gray-700">
            <ShoppingCart />
            {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-brand text-white text-xs rounded-full px-1.5">{cart.length}</span>}
          </Link>
          <div className="flex items-center gap-3">
            <Link to={auth?.loggedIn ? '/profile' : '/login'} className="text-gray-700 flex items-center gap-3">
              {auth?.loggedIn ? (
                profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center font-semibold">{(auth?.name || auth?.email || 'U').charAt(0).toUpperCase()}</div>
                )
              ) : (
                <User />
              )}
              {auth?.loggedIn && (
                <div className="hidden md:flex flex-col text-left">
                  <div className="text-xs">{auth?.name || auth?.email}</div>
                  {auth?.isAdmin && <div className="text-[10px] bg-orange-600 text-white px-2 rounded-full mt-1">Admin</div>}
                </div>
              )}
            </Link>
          </div>
          <button className="md:hidden" onClick={() => setOpen((s) => !s)} aria-label="menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t">
          <div className="container py-4 flex flex-col gap-2">
            <NavLink to="/equipment" className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-700 font-medium">Equipment</NavLink>
            <button type="button" onClick={handleHowItWorks} className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-700 font-medium">How it Works</button>
            <NavLink to="/about" className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-700 font-medium">About</NavLink>
            <NavLink to="/contact" className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-700 font-medium">Contact</NavLink>
          </div>
        </div>
      )}
    </header>
  )
}
