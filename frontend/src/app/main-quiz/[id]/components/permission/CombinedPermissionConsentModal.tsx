import { Button } from '@/components/Button';
import { useState } from 'react';

type CombinedPermissionConsentModalProps = {
  isOpen: boolean;
  onDeny: () => void;
  onAgree: (micChecked: boolean, cameraChecked: boolean) => void;
};

export default function CombinedPermissionConsentModal({
  isOpen,
  onDeny,
  onAgree,
}: CombinedPermissionConsentModalProps) {
  const [micChecked, setMicChecked] = useState(true);
  const [cameraChecked, setCameraChecked] = useState(false);

  if (!isOpen) return null;

  const handleAgree = () => {
    onAgree(micChecked, cameraChecked);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm space-y-4">
        <div className="space-y-2">
          <div className="pl-0.5 text-base font-semibold text-gray-900">권한 안내</div>
          <p className="text-sm text-gray-700">
            말하기 답변 녹음 및 촬영을 위해 마이크와 카메라 권한이 필요합니다. <br />
            권한을 선택해주세요.
          </p>
        </div>

        <div className="space-y-3">
          {/* 마이크 체크박스 */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={micChecked}
              onChange={(e) => setMicChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">마이크 권한</div>
              <div className="text-xs text-gray-600 mt-1">
                녹음 파일은 서버에 저장하지 않으며, 음성 메시지를 텍스트로 변환하는데만 사용합니다.
              </div>
            </div>
          </label>

          {/* 카메라 체크박스 */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={cameraChecked}
              onChange={(e) => setCameraChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">카메라 권한</div>
              <div className="text-xs text-gray-600 mt-1">
                카메라 영상은 서버에 저장하지 않으며, 미러링 용도로만 지원합니다.
              </div>
            </div>
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="fixed" onClick={onDeny}>
            거부
          </Button>
          <Button variant="primary" size="fixed" onClick={handleAgree}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}
