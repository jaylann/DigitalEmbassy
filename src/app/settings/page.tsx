'use client'
import MobileLayout from '@/components/layout/MobileLayout'

export default function SettingsPage() {
  return (
    <MobileLayout>
      <main className="p-4 space-y-4 max-w-lg mx-auto">
        <h1 className="text-xl font-semibold text-center">Settings</h1>
        <p className="text-muted-foreground text-center">Customize your experience here.</p>
      </main>
    </MobileLayout>
  );
}
