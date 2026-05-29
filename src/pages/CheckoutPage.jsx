import React, { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { ChevronLeft } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import PaystackPop from '@paystack/inline-js'

export default function CheckoutPage() {
  const { cart: ctxCart, clearCart, auth } = useCart()
  const navigate = useNavigate()
  // load cart reliably from localStorage as fallback
  const [localCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kitchenrent_cart') || '[]') } catch { return [] }
  })
  const cart = (ctxCart && ctxCart.length) ? ctxCart : localCart

  // redirect to login if not authenticated
  const user = (() => { try { return JSON.parse(localStorage.getItem('kitchenrent_user') || 'null') } catch { return null } })()
  useEffect(() => {
    if (!user || user.isAdmin) {
      navigate('/login')
    }
  }, [user, navigate])
  if (!user || user.isAdmin) return null

  const [form, setForm] = useState({ first: '', last: '', address: '', city: '', zip: '', phone: '', instructions: '', startDate: '', endDate: '' })
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = cart.reduce((sum, item) => sum + ((item?.price || 0) * (item?.qty || item?.quantity || 1) * (item?.rentalDays || item?.days || 1)), 0)
  // read delivery fee from settings if available
  const settings = (() => { try { return JSON.parse(localStorage.getItem('kitchenrent_settings') || '{}') } catch { return {} } })()
  const configuredDelivery = settings.deliveryFee || 5000
  const freeThreshold = settings.freeDeliveryThreshold || 150000
  const deliveryFee = subtotal >= freeThreshold ? 0 : configuredDelivery
  const total = subtotal + deliveryFee

  function handlePaystackPayment() {
    setError('')
    
    // Validate delivery fields first
    if (!form.first || !form.last || !form.address || !form.city) {
      setError('Please complete all delivery fields before payment')
      return
    }

    if (!cart.length) {
      setError('Your cart is empty.')
      return
    }

    setIsProcessing(true)
    
    const popup = new PaystackPop()
    popup.newTransaction({
      key: 'pk_test_a5174a2065478228303189a6c0b96a91b4f81cd6',
      email: user.email || 'customer@kitchenrent.ng',
      amount: total * 100, // Paystack uses kobo (multiply by 100)
      currency: 'NGN',
      ref: 'KR-' + Date.now(),
      metadata: {
        custom_fields: [
          {
            display_name: 'Customer Name',
            variable_name: 'customer_name',
            value: form.first + ' ' + form.last
          },
          {
            display_name: 'Delivery Address',
            variable_name: 'delivery_address',
            value: form.address + ', ' + form.city
          }
        ]
      },
      onSuccess: (transaction) => {
        handlePaymentSuccess(transaction)
      },
      onCancel: () => {
        setIsProcessing(false)
        setError('Payment was cancelled. Please try again.')
      }
    })
  }

  function handlePaymentSuccess(transaction) {
    const orderItems = cart.map((item) => ({
      id: item?.id || item?.sku || item?.name,
      sku: item?.sku,
      name: item?.name,
      image: item?.image,
      price: item?.price,
      quantity: item?.qty || item?.quantity || 1,
      rentalDays: item?.rentalDays || item?.days || 1,
      startDate: item?.startDate || '',
      endDate: item?.endDate || '',
      itemTotal: (item?.price || 0) * (item?.qty || item?.quantity || 1) * (item?.rentalDays || item?.days || 1)
    }))

    // Save order to localStorage
    const order = {
      id: transaction.reference,
      items: orderItems,
      userName: form.first + ' ' + form.last,
      userEmail: user?.email,
      deliveryAddress: {
        firstName: form.first,
        lastName: form.last,
        address: form.address,
        city: form.city,
        zip: form.zip,
        deliveryInstructions: form.instructions
      },
      rentalStartDate: form.startDate || orderItems[0]?.startDate || '',
      rentalEndDate: form.endDate || orderItems[0]?.endDate || '',
      subtotal,
      deliveryFee,
      total,
      status: 'Processing',
      paystackReference: transaction.reference,
      paymentStatus: 'Paid',
      createdAt: new Date().toISOString()
    }

    // Save to orders array
    const existingOrders = JSON.parse(localStorage.getItem('kitchenrent_orders') || '[]')
    existingOrders.push(order)
    localStorage.setItem('kitchenrent_orders', JSON.stringify(existingOrders))

    // Clear cart
    localStorage.removeItem('kitchenrent_cart')
    clearCart()

    // Navigate to confirmation page
    navigate('/order-confirmation', { state: { order } })
  }

  try {
  return (
    <div className="md:flex gap-6">
      <form className="flex-1 space-y-4">
        <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-orange-700 mb-6 font-medium">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <h2 className="text-2xl font-semibold">Delivery Details</h2>
        {error && <div className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input
            placeholder="First name"
            value={form.first}
            onChange={(e) => setForm({ ...form, first: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            placeholder="Last name"
            value={form.last}
            onChange={(e) => setForm({ ...form, last: e.target.value })}
            className="p-2 border rounded"
          />
        </div>
        <input
          placeholder="Venue address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            placeholder="Zip"
            value={form.zip}
            onChange={(e) => setForm({ ...form, zip: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            placeholder="Phone (optional)"
            value={form.phone || ''}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="p-2 border rounded"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <label className="block">
            <span className="text-sm text-gray-700">Rental start date</span>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="mt-1 w-full p-2 border rounded"
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-700">Rental end date</span>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="mt-1 w-full p-2 border rounded"
            />
          </label>
        </div>
        <label className="block">
          <span className="text-sm text-gray-700">Special instructions</span>
          <textarea
            placeholder="Delivery notes"
            value={form.instructions}
            onChange={(e) => setForm({ ...form, instructions: e.target.value })}
            className="mt-1 w-full p-2 border rounded"
            rows="3"
          />
        </label>

        <h3 className="text-xl font-semibold">Payment</h3>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          By placing your order, you confirm that you have read and accepted our <Link to="/terms" className="text-orange-700 underline">Terms & Conditions</Link> and <Link to="/privacy" className="text-orange-700 underline">Privacy Policy</Link>.
        </div>
      </form>

      <aside className="w-full md:w-96">
        <div className="card p-4">
          <h3 className="font-semibold">Rental Summary</h3>
          <div className="mt-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <div className="font-medium mb-2">Your cart is empty</div>
                <button onClick={() => navigate(-1)} className="rounded-xl bg-orange-600 text-white px-4 py-2">Back</button>
              </div>
            ) : (
              <>
                {cart.map((item) => {
                  const qty = item?.qty || item?.quantity || 1
                  const days = item?.rentalDays || item?.days || 1
                  const perDay = item?.price || 0
                  const itemSubtotal = perDay * qty * days
                  const start = item?.startDate
                  const end = item?.endDate
                  const dateRange = start && end ? `${new Date(start).toLocaleDateString()} - ${new Date(end).toLocaleDateString()}` : 'No date selected'
                  return (
                    <div key={item?.sku || item?.id || item?.name} className="text-sm">
                      <div className="flex justify-between"><span>{item?.name} ({days} days × {qty} units)</span><span>₦{itemSubtotal.toLocaleString()}</span></div>
                      <div className="text-xs text-gray-600">{dateRange}</div>
                      <div className="text-xs text-gray-600">₦{perDay.toLocaleString()}/day × {qty} units × {days} days = ₦{itemSubtotal.toLocaleString()}</div>
                    </div>
                  )
                })}
                <div className="border-t pt-2 flex justify-between font-semibold">Subtotal<span>₦{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm text-gray-600">Delivery Fee<span>₦{deliveryFee.toLocaleString()}</span></div>
                <div className="border-t pt-2 flex justify-between text-lg font-semibold">Total<span>₦{total.toLocaleString()}</span></div>
              </>
            )}
          </div>

          {cart.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="rounded-lg border border-gray-200 p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-lg">₦{total.toLocaleString()}</span>
                  <span className="text-xs text-gray-500 font-medium">Secured by Paystack</span>
                </div>
                <div className="text-xs text-gray-600 mb-4">Accepted payment methods:</div>
                <div className="flex gap-2 mb-4 text-xs text-gray-600">
                  <span className="px-2 py-1 bg-gray-100 rounded">💳 Visa</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">💳 Mastercard</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">🏦 Bank Transfer</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">📱 USSD</span>
                </div>
              </div>

              <button 
                type="button"
                onClick={handlePaystackPayment}
                disabled={isProcessing}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
              >
                {isProcessing ? 'Processing...' : `Confirm & Pay ₦${total.toLocaleString()}`}
              </button>

              <p className="text-xs text-gray-500 text-center">
                You will be redirected to Paystack's secure payment page
              </p>

              <details className="text-xs text-gray-400 mt-4">
                <summary className="cursor-pointer hover:text-gray-600 font-medium">Test payment details (demo only)</summary>
                <div className="mt-2 space-y-1 text-gray-500 bg-gray-50 p-2 rounded">
                  <p>💳 Card: 4084 0840 8408 4081</p>
                  <p>📅 Expiry: Any future date</p>
                  <p>🔐 CVV: 408</p>
                </div>
              </details>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
  } catch (err) {
    console.error('CheckoutPage render error', err)
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold text-rose-600">Something went wrong while loading checkout.</h2>
        <p className="text-sm text-slate-600 mt-2">Please go back to your cart and try again.</p>
        <div className="mt-4"><button onClick={() => navigate(-1)} className="rounded bg-orange-600 px-4 py-2 text-white">Back</button></div>
      </div>
    )
  }
}
