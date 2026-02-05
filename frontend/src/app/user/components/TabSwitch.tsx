'use client';

import { useRef, useState, useEffect } from 'react';

type Tab = 'understanding' | 'solved';

interface TabSwitchProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TABS: { key: Tab; label: string }[] = [
  { key: 'understanding', label: '분야별 이해도' },
  { key: 'solved', label: '지금까지 푼 문제' },
];

export default function TabSwitch({ activeTab, onTabChange }: TabSwitchProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<Tab, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const el = tabRefs.current.get(activeTab);
    const container = containerRef.current;
    if (!el || !container) return;

    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    setIndicator({
      left: elRect.left - containerRect.left,
      width: elRect.width,
    });
  }, [activeTab]);

  return (
    <div ref={containerRef} className="relative inline-flex bg-gray-200 rounded-full p-1">
      {/* 슬라이딩 배경 */}
      <div
        className="absolute top-1 bottom-1 rounded-full bg-blue-500 shadow-md transition-all duration-500 ease-[cubic-bezier(0.34,1,0.54,1)]"
        style={{ left: indicator.left, width: indicator.width }}
      />

      {TABS.map((tab) => (
        <button
          key={tab.key}
          ref={(el) => {
            if (el) tabRefs.current.set(tab.key, el);
          }}
          onClick={() => onTabChange(tab.key)}
          className={`
            relative z-10 px-6 py-2 rounded-full font-medium transition-colors duration-300 cursor-pointer
            ${activeTab === tab.key ? 'text-white' : 'text-gray-700 hover:text-gray-900'}
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export type { Tab };
