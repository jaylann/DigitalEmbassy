import { Button } from "@/components/ui/button"
import MobileLayout from '../../components/MobileLayout'

export default function DebugPage() {
  return (
    <MobileLayout>
      <div className="p-8 space-y-4">
        <h1 className="text-2xl font-semibold">Debug Tools</h1>
        <div className="flex flex-wrap gap-2">
          <Button id="button-one">Button One</Button>
          <Button id="button-two">Button Two</Button>
          <Button id="button-three">Button Three</Button>
        </div>
        <section
          id="debug-output"
          className="mt-4 p-4 border rounded min-h-[100px]"
        >
          Debug output will appear here.
        </section>
      </div>
    </MobileLayout>
  );
}
