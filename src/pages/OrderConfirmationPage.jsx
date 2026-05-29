import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

export default function OrderConfirmationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get order from location state or localStorage
    if (location.state?.order) {
      setOrder(location.state.order)
      setLoading(false)
    } else {
      // Fallback: get last order from localStorage
      try {
        const orders = JSON.parse(localStorage.getItem('kitchenrent_orders') || '[]')
        if (orders.length > 0) {
          setOrder(orders[orders.length - 1])
        }
      } catch (err) {
        console.error('Error loading order:', err)
      }
      setLoading(false)
    }
  }, [location.state])

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 mb-4">Order not found</p>
        <button
          onClick={() => navigate('/equipment')}
          className="bg-orange-600 text-white px-4 py-2 rounded"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  const rentalStart = order.rentalStartDate ? new Date(order.rentalStartDate).toLocaleDateString() : 'Not set'
  const rentalEnd = order.rentalEndDate ? new Date(order.rentalEndDate).toLocaleDateString() : 'Not set'

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8">
      <div className="max-w-2xl mx-auto">
        {/* Celebration Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-20 h-20 text-green-500" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Booking Confirmed! 🎉</h1>
          <p className="text-lg text-green-600 font-medium">Your payment was successful</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-xl border border-green-200 p-8 mb-6 shadow-sm">
          <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Reference</p>
              <p className="text-xl font-semibold text-gray-900">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Status</p>
              <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                ✓ Paid via Paystack
              </div>
            </div>
          </div>

          {/* Rental Period */}
          <div className="mb-8 pb-8 border-b">
            <h3 className="font-semibold text-gray-900 mb-4">Rental Period</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium text-gray-900">{rentalStart}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-medium text-gray-900">{rentalEnd}</p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="mb-8 pb-8 border-b">
            <h3 className="font-semibold text-gray-900 mb-4">Delivery Address</h3>
            <div className="text-gray-700">
              <p className="font-medium">{order.deliveryAddress?.firstName} {order.deliveryAddress?.lastName}</p>
              <p>{order.deliveryAddress?.address}</p>
              <p>{order.deliveryAddress?.city}, {order.deliveryAddress?.zip}</p>
              {order.deliveryAddress?.deliveryInstructions && (
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                  <p className="text-gray-600"><strong>Special Instructions:</strong> {order.deliveryAddress.deliveryInstructions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Items Summary */}
          <div className="mb-8 pb-8 border-b">
            <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.quantity} × {item.rentalDays} days @ ₦{item.price?.toLocaleString() || '0'}/day</p>
                  </div>
                  <p className="font-semibold text-gray-900">₦{item.itemTotal?.toLocaleString() || '0'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="space-y-2 mb-8">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₦{order.subtotal?.toLocaleString() || '0'}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>₦{order.deliveryFee?.toLocaleString() || '0'}</span>
            </div>
            <div className="flex justify-between text-xl font-semibold text-gray-900 pt-4 border-t">
              <span>Total Paid</span>
              <span>₦{order.total?.toLocaleString() || '0'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/profile')}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate('/equipment')}
            className="border border-orange-600 text-orange-600 hover:bg-orange-50 font-semibold py-3 rounded-lg transition"
          >
            Continue Shopping
          </button>
        </div>

        {/* Confirmation Message */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-sm text-blue-800">
            ✉️ A confirmation email has been sent to <strong>{order.userEmail}</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
