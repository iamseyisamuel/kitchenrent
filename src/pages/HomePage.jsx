import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import EquipmentCard from '../components/EquipmentCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { ShoppingBag, Truck, RotateCcw } from 'lucide-react'
import equipmentData from '../data/equipment.json'

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  const location = useLocation()

  useEffect(() => {
    setLoading(true)
    setFeatured(equipmentData.slice(0, 4))
    console.log('Featured equipment loaded:', equipmentData.length)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (location.state?.scrollToHow) {
      const target = document.querySelector('#how-it-works')
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [location.state])

  return (
    <div>
      <section 
        className="relative flex items-center justify-center mb-8"
        style={{
          position: 'relative',
          width: '100vw',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          minHeight: '500px',
          backgroundImage: 'url(/src/assets/Kitchen.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="relative text-center text-white px-4 max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-2 md:mb-4 leading-tight">Equip Your Kitchen with the Best</h1>
          <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8">Flexible rentals for events, pop-ups and catering.</p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link to="/equipment" className="px-6 py-2 md:py-3 rounded btn-brand font-semibold hover:opacity-90 transition">Browse Equipment</Link>
            <a href="#how-it-works" className="px-6 py-2 md:py-3 rounded bg-white text-brand font-semibold hover:opacity-90 transition">Learn More</a>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Featured Equipment</h2>
        {loading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {featured.map((item) => <EquipmentCard key={item.sku} item={item} />)}
          </div>
        )}
      </section>

      <section id="how-it-works" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-6 text-center">
            <div className="mx-auto w-12 h-12 text-brand"><ShoppingBag className="w-12 h-12" /></div>
            <h3 className="font-semibold mt-3">Select Equipment</h3>
            <p className="text-sm text-gray-600 mt-2">Browse and choose the items you need.</p>
          </div>
          <div className="card p-6 text-center">
            <div className="mx-auto w-12 h-12 text-brand"><Truck className="w-12 h-12" /></div>
            <h3 className="font-semibold mt-3">Precise Delivery</h3>
            <p className="text-sm text-gray-600 mt-2">We deliver on time, to your venue.</p>
          </div>
          <div className="card p-6 text-center">
            <div className="mx-auto w-12 h-12 text-brand"><RotateCcw className="w-12 h-12" /></div>
            <h3 className="font-semibold mt-3">Easy Returns</h3>
            <p className="text-sm text-gray-600 mt-2">Hassle-free pickup and cleanup.</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-4">
            <div className="font-semibold">Chef Adebayo Okonkwo — Lagos Catering Co.</div>
            <div className="text-sm text-yellow-500">★★★★☆</div>
            <p className="text-sm text-gray-600 mt-2">Rented the convection oven for a 300-guest wedding — equipment arrived clean and on time. Highly recommend.</p>
          </div>
          <div className="card p-4">
            <div className="font-semibold">Mrs. Funke Balogun — Party Planners NG</div>
            <div className="text-sm text-yellow-500">★★★★★</div>
            <p className="text-sm text-gray-600 mt-2">The refrigerated prep table kept everything fresh during our outdoor event. Great service and support.</p>
          </div>
          <div className="card p-4">
            <div className="font-semibold">Mr. Emeka Nwosu — Continental Caterers</div>
            <div className="text-sm text-yellow-500">★★★★☆</div>
            <p className="text-sm text-gray-600 mt-2">Rented the gas range and griddle for a corporate lunch; perfect performance and easy returns.</p>
          </div>
          <div className="card p-4">
            <div className="font-semibold">Tunde & Co. Events — Abuja</div>
            <div className="text-sm text-yellow-500">★★★★★</div>
            <p className="text-sm text-gray-600 mt-2">Mixer and fryer rentals made our banquet seamless — friendly delivery team and excellent equipment.</p>
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-3">Booking with Confidence</h2>
        <p className="text-slate-600">By booking equipment with KitchenRent, you agree to our <Link to="/terms" className="font-semibold text-orange-700 underline">Terms & Conditions</Link> and <Link to="/privacy" className="font-semibold text-orange-700 underline">Privacy Policy</Link>. Need help? Visit our <Link to="/help" className="font-semibold text-orange-700 underline">Help Center</Link>.</p>
      </section>
    </div>
  )
}
