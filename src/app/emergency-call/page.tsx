'use client'

import { useState, useEffect } from 'react'
import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function EmergencyCallPage() {
  const [status, setStatus] = useState<'idle' | 'dialing' | 'connected'>('idle')

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (status === 'dialing') {
      timeout = setTimeout(() => setStatus('connected'), 3000)
    }
    return () => clearTimeout(timeout)
  }, [status])

  const handleCall = () => {
    if (status === 'idle') setStatus('dialing')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Emergency Call</h1>
      <Button
        aria-label="Call emergency services"
        onClick={handleCall}
        className={cn(
          'rounded-full w-24 h-24 sm:w-32 sm:h-32 text-white bg-red-600 text-3xl sm:text-4xl shadow-lg active:scale-95',
          status === 'idle' && 'animate-pulse'
        )}
      >
        <Phone className="w-8 h-8 sm:w-10 sm:h-10" />
      </Button>
      <p className="text-lg h-6">
        {status === 'idle' && 'Tap to call for help'}
        {status === 'dialing' && 'Dialing…'}
        {status === 'connected' && 'Connected'}
      </p>
    </div>
  )
}
