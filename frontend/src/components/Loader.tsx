interface LoaderProps {
  message: string;
  subMessage?: string;
}

export default function Loader({ message, subMessage }: LoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm space-y-4 text-center">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
        <div className="text-base font-semibold text-gray-900">{message}</div>
        {subMessage && <p className="text-sm text-gray-600">{subMessage}</p>}
      </div>
    </div>
  );
}
