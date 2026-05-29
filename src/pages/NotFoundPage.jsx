import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFoundPage(){
  return (
    <div className="text-center py-16">
      <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600" alt="404" className="mx-auto w-64 h-40 object-cover rounded-md" />
      <h1 className="text-3xl font-semibold mt-4">Page Not Found</h1>
      <p className="text-gray-600 mt-2">The kitchen seems to be empty</p>
      <div className="mt-4 flex justify-center gap-3">
        <Link to="/" className="btn-brand px-4 py-2 rounded">Back to Home</Link>
        <Link to="/contact" className="px-4 py-2 border rounded">Contact Support</Link>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="card p-4">Equipment Catalog</div>
        <div className="card p-4">Rental Orders</div>
        <div className="card p-4">Catering Services</div>
      </div>
    </div>
  )
}
