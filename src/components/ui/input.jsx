import React from 'react'

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-red-500/50 ${className}`}
      {...props}
    />
  )
}
