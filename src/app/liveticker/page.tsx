'use client'
import MobileLayout from '../../components/MobileLayout'

export default function LiveTickerPage() {
  return (
    <MobileLayout>
      <main className="p-4 space-y-4 max-w-lg mx-auto">
        <h1 className="text-xl font-semibold text-center">Live Ticker</h1>
        <p className="text-muted-foreground text-center">No live updates available yet.</p>
      </main>
    </MobileLayout>
  );
}
