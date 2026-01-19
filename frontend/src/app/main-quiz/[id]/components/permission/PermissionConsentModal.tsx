import { Button } from '@/components/Button';

type PermissionConsentModalProps = {
  isOpen: boolean;
  title: string;
  descriptions: string[];
  onDeny: () => void;
  onAgree: () => void;
  denyText?: string;
  agreeText?: string;
};

export default function PermissionConsentModal({
  isOpen,
  title,
  descriptions,
  onDeny,
  onAgree,
  denyText = '거부',
  agreeText = '동의',
}: PermissionConsentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm space-y-4">
        <div className="space-y-2">
          <div className="text-base font-semibold text-gray-900">{title}</div>
          {descriptions.map((text, idx) => (
            <p key={idx} className="text-sm text-gray-700">
              {text}
            </p>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="fixed" onClick={onDeny}>
            {denyText}
          </Button>
          <Button variant="primary" size="fixed" onClick={onAgree}>
            {agreeText}
          </Button>
        </div>
      </div>
    </div>
  );
}
