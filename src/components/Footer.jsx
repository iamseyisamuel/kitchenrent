import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t bg-white mt-8">
      <div className="container py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <div className="text-lg font-semibold">KitchenRent</div>
          <div className="text-sm text-gray-600">Equip your kitchen with the best</div>
        </div>
        <div>
          <div className="font-semibold">Services</div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li><Link to="/equipment">Equipment Catalog</Link></li>
            <li><Link to="/contact">Catering</Link></li>
            <li><Link to="/about">Events</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Company</div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login">Admin</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Support</div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/privacy">Privacy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-sm text-gray-500">© {new Date().getFullYear()} KitchenRent. All rights reserved.</div>
    </footer>
  )
}
