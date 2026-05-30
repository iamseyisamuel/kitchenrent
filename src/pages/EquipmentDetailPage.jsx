import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import RatingStars from '../components/RatingStars'
import LoadingSpinner from '../components/LoadingSpinner'
import ImageWithFallback from '../components/ImageWithFallback'
import { useCart } from '../context/CartContext'
import { Check, ChevronLeft, ShoppingCart } from 'lucide-react'
import { equipmentImages } from '../assets/images'
import equipmentData from '../data/equipment.json'

export default function EquipmentDetailPage(){
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showAllReviews, setShowAllReviews] = useState(false)
  const { addToCart } = useCart()
  const navigate = useNavigate()

  useEffect(()=>{
    const found = equipmentData.find((d) => String(d.id) === String(id))
    setItem(found)
    console.log('Equipment detail loaded:', id, found ? true : false)
    setLoading(false)
  },[id])

  const days = useMemo(()=>{
    if(!startDate || !endDate) return 1
    const s = new Date(startDate)
    const e = new Date(endDate)
    const diff = Math.ceil((e - s) / (1000*60*60*24)) + 1
    return diff > 0 ? diff : 1
  },[startDate,endDate])

  const imageSrc = item ? equipmentImages?.[item.id] || item.image || item.images?.[0] : undefined
  const reviews = item?.customerReviews || []
  const features = item?.features || []
  const specs = item?.specs || {}

  if(loading) return <LoadingSpinner />
  if(!item) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Equipment not found</h2>
      <p className="text-gray-500 mb-6">This item may have been removed or doesn't exist.</p>
      <Link to="/equipment" className="bg-orange-700 text-white px-6 py-3 rounded-lg">
        Back to Equipment
      </Link>
    </div>
  )

  function handleAdd(){
    const rentalDays = calculateDays()
    const totalPrice = (item.price || 0) * (qty || 1) * rentalDays
    const payload = {
      id: item.id,
      sku: item.sku || String(item.id),
      name: item.name,
      image: equipmentImages[item.id] || item.image,
      price: item.price,
      qty: qty,
      quantity: qty,
      rentalDays,
      startDate: startDate || '',
      endDate: endDate || '',
      itemTotal: totalPrice
    }
    addToCart(payload)
    alert('Added to rental cart')
  }

  const thumbnails = imageSrc ? [imageSrc].concat(Array(3).fill(imageSrc)).slice(0,4) : []

  const calculateDays = () => {
    if (!startDate || !endDate) return 1
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = end - start
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays < 1 ? 1 : diffDays
  }

  const rentalDays = calculateDays()
  const totalPrice = (item.price || 0) * (qty || 1) * rentalDays

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-orange-700 font-medium">
        <ChevronLeft className="w-5 h-5" /> Back
      </button>
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1 space-y-6">
          <div className="rounded-md overflow-hidden">
            <ImageWithFallback src={imageSrc} alt={item.name} className="w-full h-64 md:h-96 object-cover rounded-lg" placeholderText={item.name} />
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {thumbnails.map((t, idx) => (
              <ImageWithFallback key={idx} src={t} alt={`${item.name}-${idx}`} className="w-20 h-16 object-cover rounded-md flex-shrink-0" placeholderText={item.name} />
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-semibold">{item.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <div className="flex items-center gap-2"><RatingStars rating={item.rating} /><div className="text-sm text-gray-600">({item.reviews})</div></div>
              </div>
            </div>

            <p className="text-gray-700">{item.fullDescription}</p>

            <div>
              <h3 className="font-semibold mb-3">Professional Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg border p-4 bg-white">
                    <div className="text-brand mt-1"><Check className="w-5 h-5" /></div>
                    <div className="text-sm text-gray-700">{f}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Customer Reviews</h3>
              <div className="space-y-3">
                {(showAllReviews ? reviews : reviews.slice(0, 3)).map((r, idx) => (
                  <div key={idx} className="rounded-lg border bg-white p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">{r.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}</div>
                      <div>
                        <div className="font-semibold">{r.name} <span className="text-xs text-gray-500">• {r.date}</span></div>
                        <div className="text-sm text-yellow-500">{'★'.repeat(Math.round(r.rating))}</div>
                        <div className="text-sm text-gray-700 mt-2">{r.text}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {reviews.length > 3 && (
                <button onClick={() => setShowAllReviews((s) => !s)} className="mt-3 rounded border px-4 py-2 text-sm font-medium hover:bg-gray-50">
                  {showAllReviews ? 'Show Less' : 'Load More Reviews'}
                </button>
              )}
            </div>
          </div>
        </div>

        <aside className="card p-4 w-full md:w-96 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-green-600 font-semibold">{item.inStock ? 'In Stock' : 'Out of Stock'}</div>
            <div className="text-xs text-gray-500">SKU: {item.sku}</div>
          </div>

          <div className="text-3xl font-bold text-brand mt-4">₦{item.price.toLocaleString()}/day</div>

          <div className="mt-4 grid grid-cols-1 gap-3">
            {Object.entries(item.specs).slice(0, 2).map(([k, v]) => (
              <div key={k} className="p-3 border rounded text-sm bg-gray-50">
                <div className="font-semibold">{k}</div>
                <div className="text-gray-600">{v}</div>
              </div>
            ))}
          </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-600">Rental Period</label>
              <div className="grid gap-2 mt-2 md:grid-cols-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    const val = e.target.value
                    setStartDate(val)
                    // ensure endDate is not before startDate
                    if (endDate && new Date(endDate) < new Date(val)) {
                      setEndDate(val)
                    }
                  }}
                  min={new Date().toISOString().slice(0,10)}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().slice(0,10)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-600">Quantity</label>
            <div className="grid gap-2 mt-2">
              <div className="flex items-center gap-2">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-full rounded border px-3 py-2 text-center">-</button>
                <div className="w-full rounded border px-3 py-2 text-center">{qty}</div>
                <button onClick={() => setQty((q) => q + 1)} className="w-full rounded border px-3 py-2 text-center">+</button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">Total ({rentalDays} days × {qty} units) <span className="font-semibold">₦{totalPrice.toLocaleString()}</span></div>

          <button disabled={!item.inStock} onClick={handleAdd} className="mt-4 w-full rounded bg-brand px-4 py-3 text-white font-semibold">
            <span className="inline-flex items-center justify-center gap-2"><ShoppingCart className="w-5 h-5" /> Add to Rental Cart</span>
          </button>

          <div className="mt-2 text-xs text-gray-500">Free delivery on orders over ₦150,000</div>
        </aside>
      </div>
    </div>
  )
}
