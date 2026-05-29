import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem('kitchenrent_cart')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  const [auth, setAuth] = useState(() => {
    try {
      const raw = localStorage.getItem('kitchenrent_auth')
      return raw ? JSON.parse(raw) : { loggedIn: false }
    } catch {
      return { loggedIn: false }
    }
  })

  useEffect(() => {
    localStorage.setItem('kitchenrent_cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('kitchenrent_auth', JSON.stringify(auth))
  }, [auth])

  function addToCart(item) {
    setCart((prev) => {
      const found = prev.find((p) => p.sku === item.sku)
      if (found) {
        return prev.map((p) => (p.sku === item.sku ? { ...p, qty: p.qty + item.qty } : p))
      }
      return [...prev, item]
    })
  }

  function removeFromCart(sku) {
    setCart((prev) => prev.filter((p) => p.sku !== sku))
  }

  function updateQuantity(sku, qty) {
    setCart((prev) => prev.map((p) => (p.sku === sku ? { ...p, qty } : p)))
  }

  function clearCart() {
    setCart([])
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, auth, setAuth }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
