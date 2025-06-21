"use client"
import MobileLayout from '../../components/MobileLayout'

export default function DebugPage() {
  return (
    <MobileLayout>
      <div className="p-8 space-y-4">
        <h1 className="text-2xl font-semibold">Debug Tools</h1>
        <p>Use the floating debug menu (Shift+D) to toggle routes and set status.</p>
      </div>
    </MobileLayout>
  );
}
