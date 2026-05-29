import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function AboutPage(){
  const navigate = useNavigate()
  return (
    <div>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-orange-700 mb-6 font-medium">
        <ChevronLeft className="w-5 h-5" /> Back
      </button>
      <h2 className="text-2xl font-semibold mb-4">About KitchenRent</h2>
      <p className="text-gray-700">We provide kitchen equipment rental for events, caterers and restaurants. Our mission is to make professional gear accessible.</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">500+ equipment</div>
        <div className="card p-4">24/7 support</div>
        <div className="card p-4">5k+ events</div>
      </div>
    </div>
  )
}
