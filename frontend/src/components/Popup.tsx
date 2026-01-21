import { Button } from '@/components/Button';

interface PopupProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function Popup({
  isOpen,
  title,
  description,
  confirmText = '네',
  cancelText = '아니오',
  onConfirm,
  onCancel,
}: PopupProps) {
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
          <Button
            variant="secondary"
            size="cta"
            className="flex-1 rounded-[20px]"
            onClick={onCancel}
          >
            {cancelText}
          </Button>

          <Button
            variant="primary"
            size="cta"
            className="flex-1 rounded-[20px] shadow-lg shadow-blue-100 active:scale-95"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
