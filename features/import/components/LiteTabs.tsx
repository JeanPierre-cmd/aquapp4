import { useState, ReactNode } from 'react';

interface TabConfig {
  id: string;
  title: string;
  content: ReactNode;
}

interface LiteTabsProps {
  tabs: TabConfig[];
  defaultTab: string;
}

/**
 * A lightweight, self-contained tab component controlled by useState.
 * Serves as a fallback for @radix-ui/react-tabs to ensure feature availability.
 * Mimics the appearance of the Radix component for visual consistency.
 */
export default function LiteTabs({ tabs, defaultTab }: LiteTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const activeContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className="block">
      <div role="tablist" aria-orientation="horizontal" className="px-4 pt-3 border-b border-border flex gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tab-content-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-t-md ${
              activeTab === tab.id
                ? 'border-b-2 border-primary text-primary'
                : 'text-textSecondary hover:text-primary'
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div
        id={`tab-content-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="p-4"
      >
        {activeContent}
      </div>
    </div>
  );
}
