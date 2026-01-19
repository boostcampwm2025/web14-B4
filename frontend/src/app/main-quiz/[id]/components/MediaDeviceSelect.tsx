type MediaDeviceOption = {
  value: string;
  label: string;
};

type MediaDeviceSelectProps = {
  label: string;
  value: string;
  options: MediaDeviceOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function MediaDeviceSelect({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: MediaDeviceSelectProps) {
  return (
    <div className="relative space-y-2">
      <div className="text-sm font-medium text-gray-800">{label}</div>

      <select
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-4 pr-10 text-sm appearance-none cursor-pointer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {options.map((opt, idx) => (
          <option key={`${opt.value}-${idx}`} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* 커스텀 화살표 */}
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none translate-y-[10px]">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
