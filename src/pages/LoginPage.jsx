import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { setAuth } = useCart()
  const navigate = useNavigate()

  const isLoginValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password.length >= 8

  function handleLogin(e) {
    e.preventDefault()
    setError('')
    if (!isLoginValid) {
      setError('Invalid email or password')
      return
    }

    console.log('Attempting login with:', email)
    console.log('Users in storage:', localStorage.getItem('kitchenrent_users'))
    console.log('Single user in storage:', localStorage.getItem('kitchenrent_user'))

    if (email === 'admin@kitchenrent.com' && password === 'ict2112026project') {
      const adminUser = { name: 'Admin', email: 'admin@kitchenrent.com', isAdmin: true }
      localStorage.setItem('kitchenrent_user', JSON.stringify(adminUser))
      localStorage.setItem('kitchenrent_auth', JSON.stringify({ loggedIn: true, email: adminUser.email, name: adminUser.name, profilePic: null, isAdmin: true }))
      setAuth({ loggedIn: true, email: adminUser.email, name: adminUser.name, profilePic: null, isAdmin: true })
      navigate('/admin')
      return
    }

    const users = JSON.parse(localStorage.getItem('kitchenrent_users') || '[]')
    const normalizedEmail = email.toLowerCase().trim()
    const foundUser = users.find((u) => u.email?.toLowerCase().trim() === normalizedEmail && u.password === password)

    if (!foundUser) {
      setError('Invalid email or password')
      return
    }

    const loggedInUser = {
      name: foundUser.name,
      email: foundUser.email,
      phone: foundUser.phone,
      accountType: foundUser.accountType,
      isAdmin: false
    }
    localStorage.setItem('kitchenrent_user', JSON.stringify(loggedInUser))
    localStorage.setItem('kitchenrent_auth', JSON.stringify({ loggedIn: true, email: loggedInUser.email, name: loggedInUser.name, profilePic: null, isAdmin: false }))
    setAuth({ loggedIn: true, email: loggedInUser.email, name: loggedInUser.name, profilePic: null, isAdmin: false })
    navigate('/')
  }

  return (
    <div className="md:flex bg-white rounded overflow-hidden">
      <div className="hidden md:block md:w-1/2 bg-accent p-8">
        <h2 className="text-2xl font-semibold">KitchenRent</h2>
        <p className="mt-4">“Equip your kitchen with trusted equipment”</p>
      </div>
      <div className="w-full md:w-1/2 p-8">
        <h2 className="text-2xl font-semibold">Welcome Back</h2>
        <button className="mt-4 w-full border p-2 rounded">Continue with Google</button>
        <div className="my-4 text-center text-gray-500">or sign in with email</div>
        {error && <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            className="w-full p-2 border rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full p-2 border rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-between text-sm">
            <a href="#">Forgot password?</a>
            <Link to="/register">Create account</Link>
          </div>
          <button
            type="submit"
            disabled={!isLoginValid}
            className={`w-full p-2 rounded ${isLoginValid ? 'btn-brand cursor-pointer' : 'bg-gray-400 text-white opacity-50 cursor-not-allowed'}`}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
