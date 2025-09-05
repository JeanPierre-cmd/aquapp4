import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import ForgeSessionView from './ForgeSessionView';

/**
 * 3-D / 2-D visualizer container.
 * Muestra tabs base y, opcionalmente, la pestaña
 * “Forge (sesión)” si la flag está activa.
 */

const features = {
  infraApsEnabled:
    (import.meta.env.VITE_INFRA_APS_ENABLED as string | undefined) === 'true'
} as const;

const coreTabs = [
  { id: 'viewer', name: 'Visor 3-D', icon: Eye },
  { id: 'meta',  name: 'Metadatos', icon: Eye }
] as const;

type Tab = (typeof coreTabs)[number] | { id: 'aps'; name: string; icon: typeof Eye };

export default function Visualization3D() {
  const [activeTab, setActiveTab] = useState<Tab['id']>('viewer');

  const finalTabs: Tab[] = features.infraApsEnabled
    ? [...coreTabs, { id: 'aps', name: 'Forge (sesión)', icon: Eye }]
    : [...coreTabs];

  return (
    <section className="flex h-full w-full flex-col">
      {/* Tabs */}
      <nav className="flex shrink-0 items-center gap-4 border-b border-[color:var(--border,#2F2F2F)] px-4 py-2">
        {finalTabs.map((tab) => (
          <button
            key={tab.id}
            aria-label={`Cambiar a pestaña ${tab.name}`}
            className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-[color:var(--surface,#262626)] text-[color:var(--text,#FFFFFF)]'
                : 'text-[color:var(--textSecondary,#A3A3A3)] hover:text-[color:var(--text,#FFFFFF)]'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} />
            {tab.name}
          </button>
        ))}
      </nav>

      {/* Contenido */}
      <div className="relative h-full flex-1 overflow-hidden">
        {activeTab === 'viewer' && (
          <div className="flex h-full w-full items-center justify-center text-[color:var(--textSecondary,#A3A3A3)]">
            <span>Visor 3-D principal</span>
          </div>
        )}

        {activeTab === 'meta' && (
          <div className="flex h-full w-full items-center justify-center text-[color:var(--textSecondary,#A3A3A3)]">
            <span>Panel de metadatos</span>
          </div>
        )}

        {features.infraApsEnabled && activeTab === 'aps' && <ForgeSessionView />}
      </div>
    </section>
  );
}
