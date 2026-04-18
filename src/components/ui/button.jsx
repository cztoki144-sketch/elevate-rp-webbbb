import React from 'react'
export function Button({ className = '', variant = 'default', size = 'base', ...props }) {
  const base = 'inline-flex items-center justify-center font-medium rounded-2xl transition active:scale-[.98] disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    default: 'bg-red-600 hover:bg-red-500 text-white',
    secondary: 'bg-white/10 hover:bg-white/20 text-white',
    ghost: 'bg-transparent hover:bg-white/10 text-white',
    outline: 'border border-white/20 hover:bg-white/10 text-white'
  }
  const sizes = { sm: 'h-9 px-3 text-sm', base: 'h-10 px-4 text-sm', lg: 'h-12 px-5 text-base' }
  return <button className={`${base} ${variants[variant]||variants.default} ${sizes[size]||sizes.base} ${className}`} {...props} />
}