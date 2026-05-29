import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { equipmentImages } from '../assets/images'
import ImageWithFallback from '../components/ImageWithFallback'

export default function CartPage(){
  const { cart, updateQuantity, removeFromCart } = useCart()
  const navigate = useNavigate()

  const subtotal = cart.reduce((s, i) => {
    const qty = i.qty || i.quantity || 1
    const days = i.rentalDays || i.days || 1
    const price = i.price || 0
    return s + price * qty * days
  }, 0)
  const delivery = cart.length ? 5000 : 0

  return (
    <div className="md:flex gap-6">
      <section className="flex-1">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-orange-700 mb-6 font-medium">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <h2 className="text-2xl font-semibold mb-4">Your Rental Cart</h2>
        {cart.length===0 ? (
          <div className="card p-6 text-center">Your cart is empty. <Link to="/equipment" className="text-brand">Browse equipment</Link></div>
        ) : (
          <div className="space-y-4">
            {cart.map(item=> {
              const qty = item.qty || item.quantity || 1
              const days = item.rentalDays || item.days || 1
              const perDay = item.price || 0
              const itemSubtotal = perDay * qty * days
              const start = item.startDate
              const end = item.endDate
              const dateRange = start && end ? `${new Date(start).toLocaleDateString()} - ${new Date(end).toLocaleDateString()}` : 'No date selected'
              const key = item.sku || item.id || item.name
              return (
                <div key={key} className="card p-4 flex items-center gap-4">
                  <ImageWithFallback src={equipmentImages[item.id] || item.image} alt={item.name} className="w-24 h-24 object-cover rounded" placeholderText={item.name} />
                  <div className="flex-1 text-left">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-600">{days} days rental ({dateRange})</div>
                    <div className="text-sm text-gray-600 mt-2">₦{perDay.toLocaleString()}/day × {qty} units × {days} days = ₦{itemSubtotal.toLocaleString()}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="mt-2 flex items-center gap-2">
                      <input type="number" min="1" value={qty} onChange={e=>updateQuantity(item.sku || item.id || item.name, Number(e.target.value))} className="w-16 p-1 border rounded" />
                      <button onClick={()=>removeFromCart(item.sku || item.id || item.name)} className="text-sm text-red-500">Remove</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
      <aside className="w-full md:w-96">
        <div className="card p-4">
          <h3 className="font-semibold">Order Summary</h3>
          <div className="mt-4">
            <div className="flex justify-between"><span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>₦{delivery.toLocaleString()}</span></div>
            <div className="flex justify-between font-semibold mt-2"><span>Total</span><span>₦{(subtotal+delivery).toLocaleString()}</span></div>
          </div>
          <button disabled={cart.length===0} onClick={()=>navigate('/checkout')} className="mt-4 btn-brand px-4 py-2 rounded w-full">Proceed to Checkout</button>
        </div>
      </aside>
    </div>
  )
}
