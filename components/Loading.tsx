"use client"

import React, { FC } from 'react'

interface LoadingOverlayProps {
  className?: string
  size?: 'small' | 'medium' | 'large'
  message?: string
}

const LoadingOverlay: FC<LoadingOverlayProps> = ({ size = 'medium', message, className }) => {
  const spinnerSize = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12', 
    large: 'h-16 w-16'
  }[size]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className={`animate-spin rounded-full ${spinnerSize} border-t-2 border-b-2 border-white`}></div>
        {message && (
          <p className="text-white text-lg">{message}</p>
        )}
      </div>
    </div>
  )
}

export default LoadingOverlay