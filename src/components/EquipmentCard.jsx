import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RatingStars from './RatingStars'
import ImageWithFallback from './ImageWithFallback'
import { Heart } from 'lucide-react'
import { equipmentImages } from '../assets/images'

export default function EquipmentCard({ item }) {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState(null)
  const imageSrc = equipmentImages[item.id] || item.image || item.images?.[0]

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('kitchenrent_wishlist') || '[]')
      setSaved(raw.includes(String(item.id)))
    } catch {
      setSaved(false)
    }
  }, [item.sku])

  function toggleSave(e) {
    e.stopPropagation()
    e.preventDefault()
    try {
      const raw = JSON.parse(localStorage.getItem('kitchenrent_wishlist') || '[]')
      const idStr = String(item.id)
      const exists = raw.includes(idStr)
      let next
      if (exists) {
        next = raw.filter((id) => id !== idStr)
        setToast('Removed from wishlist')
        setSaved(false)
      } else {
        next = [...raw, idStr]
        setToast('Added to wishlist')
        setSaved(true)
      }
      localStorage.setItem('kitchenrent_wishlist', JSON.stringify(next))
      setTimeout(() => setToast(null), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div onClick={() => navigate(`/equipment/${item.id}`)} className="block cursor-pointer">
      <div className="card p-4 flex flex-col h-full relative hover:shadow-md transition">
        {item.badge && (
          <div className="absolute left-3 top-3 z-20 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">{item.badge}</div>
        )}
        <button onClick={toggleSave} className="absolute right-3 top-3 z-20 bg-white/70 rounded-full p-2">
          <Heart className={`w-5 h-5 ${saved ? 'text-brand' : 'text-gray-400'}`} />
        </button>
        <ImageWithFallback src={imageSrc} alt={item.name} className="w-full h-48 object-cover rounded-md mb-3" placeholderText={item.name} />
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-600 mt-1 max-h-12 overflow-hidden">{item.description}</p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-sm text-brand font-semibold">₦{item.price.toLocaleString()}/day</div>
            <div className="text-xs text-gray-500">{item.inStock ? 'In Stock' : 'Out of Stock'}</div>
          </div>
          <div className="flex flex-col items-end">
            <RatingStars rating={item.rating} />
            <div className="mt-2">
              <button onClick={(e) => { e.stopPropagation(); navigate(`/equipment/${item.id}`) }} className="px-3 py-1 rounded btn-brand">Rent Now</button>
            </div>
          </div>
        </div>
        {toast && (
          <div className="fixed top-6 right-6 bg-gray-900 text-white px-4 py-2 rounded shadow">{toast}</div>
        )}
      </div>
    </div>
  )
}
