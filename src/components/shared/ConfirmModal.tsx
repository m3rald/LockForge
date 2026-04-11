import React from 'react'
import { X } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  children: React.ReactNode
  confirmText?: string
  confirmVariant?: 'primary' | 'danger'
  isLoading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'Confirm',
  confirmVariant = 'primary',
  isLoading = false
}: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#1a1a2e] border border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-zinc-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <X className="size-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-8">
          {children}
        </div>
        
        <div className="px-8 py-6 bg-zinc-900/50 border-t border-zinc-800 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-400 hover:bg-zinc-800 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 ${
              confirmVariant === 'danger'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                : 'bg-cyan-500 text-black hover:bg-cyan-400'
            }`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
