import { useEffect } from "react";
import ImportLayout from "./components/ImportLayout";

// Mock analytics object for demonstration purposes.
// In a real application, this would be imported from an analytics service utility.
const analytics = {
  track: (eventName: string, properties?: Record<string, any>) => {
    console.log(`[Analytics] Event tracked: "${eventName}"`, properties || '');
  }
};

export default function ImportarPage() {
  useEffect(() => {
    analytics.track("nav_importar_open");
  }, []);

  return (
    <section className="h-full flex flex-col bg-surface rounded-2xl shadow-lg border border-border">
      <header className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text">Importar Datos</h1>
      </header>
      <div className="flex-1 overflow-y-auto">
        <ImportLayout />
      </div>
    </section>
  );
}
