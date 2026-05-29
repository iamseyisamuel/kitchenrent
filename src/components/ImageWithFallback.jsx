import React, { useState } from 'react'

export default function ImageWithFallback({ src, alt, className = '', placeholderText = 'No image available' }) {
  const [errored, setErrored] = useState(false)

  if (!src || errored) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center text-gray-600 text-center p-3`}>
        {placeholderText}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
    />
  )
}
