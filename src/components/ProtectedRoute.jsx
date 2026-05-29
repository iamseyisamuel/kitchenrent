import React from 'react'
import { Navigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProtectedRoute({ children }) {
  const { auth } = useCart()
  if (!auth || !auth.loggedIn) {
    return <Navigate to="/login" replace />
  }
  return children
}
