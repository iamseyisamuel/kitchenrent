import React from 'react'
import { Navigate } from 'react-router-dom'

export default function AdminRoute({ children }) {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('kitchenrent_user')) || {}
    } catch {
      return {}
    }
  })()
  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />
  }
  return children
}
