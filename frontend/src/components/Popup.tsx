interface PopupProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function CommonPopup({ isOpen, title, description, onConfirm, onCancel }: PopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />

      {/* 팝업 컨테이너 */}
      <div className="relative w-full max-w-sm bg-white rounded-[35px] p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* 텍스트 영역 */}
        <div className="text-center mb-8">
          <h2 className="text-[20px] font-semibold text-gray-900 mb-4 tracking-tight">{title}</h2>
          <p className="text-4 text-[var(--color-gray-dark)] leading-relaxed break-keep">
            {description}
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-5">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-[#F1F4F9] text-gray-600 rounded-[20px] font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
          >
            네
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-[#4A7DFF] text-white rounded-[20px] font-semibold shadow-lg shadow-blue-100 hover:bg-[#3B6AE6] transition-all active:scale-95 cursor-pointer"
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommonPopup;
