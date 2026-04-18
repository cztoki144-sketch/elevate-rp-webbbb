import React from 'react'
export function Badge({ className = '', ...props }) {
  return <span className={`inline-flex items-center gap-1 rounded-full bg-red-600/20 text-red-300 px-2.5 py-1 text-xs border border-red-500/30 ${className}`} {...props} />
}