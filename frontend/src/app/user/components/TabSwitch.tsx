'use client';

type Tab = 'understanding' | 'solved';

interface TabSwitchProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function TabSwitch({ activeTab, onTabChange }: TabSwitchProps) {
  return (
    <div className="inline-flex bg-gray-200 rounded-full p-1">
      <button
        onClick={() => onTabChange('understanding')}
        className={`
          px-6 py-2 rounded-full font-medium transition-all duration-300 cursor-pointer
          ${
            activeTab === 'understanding'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-transparent text-gray-700 hover:text-gray-900'
          }
        `}
      >
        분야별 이해도
      </button>
      <button
        onClick={() => onTabChange('solved')}
        className={`
          px-6 py-2 rounded-full font-medium transition-all duration-300 cursor-pointer
          ${
            activeTab === 'solved'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-transparent text-gray-700 hover:text-gray-900'
          }
        `}
      >
        지금까지 푼 문제
      </button>
    </div>
  );
}

export type { Tab };
