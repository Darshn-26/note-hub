import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="flex mt-20 justify-center min-h-screen">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-6 border-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-6 border-transparent bg-gradient-to-r from-white via-white/80 to-white/60 rounded-full animate-spin-reverse"></div>
        <div className="absolute inset-6 z-10">
          <svg
            className="w-full h-full text-gradient-text animate-spin"
            fill="none"
            stroke="url(#gradientStroke)"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <defs>
              <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1"/>
                <stop offset="100%" stopColor="#ec4899"/>
              </linearGradient>
            </defs>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner