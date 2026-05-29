import React from 'react'

export default function RatingStars({ rating = 0 }) {
  const full = Math.floor(rating)
  return (
    <div className="flex items-center gap-1 text-sm text-yellow-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < full ? '★' : '☆'}</span>
      ))}
      <span className="text-gray-600 ml-2">{rating.toFixed(1)}</span>
    </div>
  )
}
