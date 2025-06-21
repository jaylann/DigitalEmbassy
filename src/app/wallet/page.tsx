'use client'
import { QRCodeSVG } from 'qrcode.react'
import MobileLayout from '../../components/MobileLayout'

export default function WalletPage() {
  const name = "Alex Müller";
  const qrValue = `passport-${Math.random().toString(36).slice(2)}`;

  return (
    <MobileLayout>
      <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
        <div className="bg-card text-card-foreground rounded-xl shadow-md p-6 w-full max-w-sm space-y-4">
          <h1 className="text-center text-xl font-semibold">Digital Wallet</h1>
          <div className="text-center">
            <p className="text-sm">Name</p>
            <p className="font-medium text-lg">{name}</p>
          </div>
          <div className="flex justify-center">
            <QRCodeSVG value={qrValue} size={180} level="Q" />
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Present this QR code as a one-time passport
          </p>
        </div>
      </div>
    </MobileLayout>
  )
}
