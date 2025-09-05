import React, { useState } from 'react';
import NetsModule from '@/features/nets/components/NetsModule';
import { Ship, Network, Cpu } from 'lucide-react';

// A simple placeholder for other modules
const PlaceholderModule = ({ name }: { name: string }) => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center text-textSecondary bg-surface rounded-lg border border-border">
    <div className="p-4 mb-4 bg-background rounded-full">
      <Cpu size={48} className="text-primary" />
    </div>
    <h2 className="text-2xl font-bold text-text">Módulo de {name}</h2>
    <p className="mt-2 max-w-md">
      Este contenido se implementará en futuras iteraciones. La funcionalidad completa para {name} estará disponible aquí.
    </p>
  </div>
);

const tabs = [
  { id: 'cages', name: 'Balsas Jaulas', icon: Ship, component: () => <PlaceholderModule name="Balsas Jaulas" /> },
  { id: 'nets', name: 'Redes', icon: Network, component: () => <NetsModule /> },
  { id: 'model', name: 'Modelo 3D/2D', icon: Cpu, component: () => <PlaceholderModule name="Modelo 3D/2D" /> },
];

export default function CagesModule() {
  const [activeTab, setActiveTab] = useState('nets');

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="flex flex-col h-full bg-background text-text">
      <header className="p-6 border-b border-border">
        <h1 className="text-3xl font-bold">Gestión de Infraestructura</h1>
        <p className="text-md text-textSecondary mt-1">Administre jaulas, redes y modelos 3D de la concesión activa.</p>
      </header>
      
      <div className="px-6 border-b border-border flex space-x-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors -mb-px border-b-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-t-md ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-textSecondary hover:text-text hover:bg-surface'
            }`}
          >
            <tab.icon size={16} />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      <main className="flex-grow p-6 overflow-auto">
        {ActiveComponent && <ActiveComponent />}
      </main>
    </div>
  );
}
