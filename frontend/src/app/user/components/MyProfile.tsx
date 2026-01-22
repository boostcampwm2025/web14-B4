'use client';

import { UserProfile } from '../types/user';

export const mockUserData: UserProfile = {
  id: '1',
  name: '김철수',
  profileImage:
    'data:image/jpeg;base64,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', // 임시 프로필 이미지
  grade: 'gold',
  interests: ['프론트엔드', '백엔드', '운영체제'],
};

interface UserProfileProps {
  user: UserProfile;
}

const GRADE_CONFIG = {
  bronze: { label: '브론즈', color: '#CD7F32', bgColor: '#FFF4E6' },
  silver: { label: '실버', color: '#71717A', bgColor: '#F4F4F5' },
  gold: { label: '골드', color: '#9B4A00', bgColor: '#F9A518' },
  platinum: { label: '플래티넘', color: '#6366F1', bgColor: '#EEF2FF' },
};

export default function MyProfile({ user }: UserProfileProps) {
  const gradeInfo = GRADE_CONFIG[user.grade];

  const handleEdit = () => {
    alert('프로필 수정');
  };

  return (
    <div className="mx-auto py-8">
      <div className="flex items-start gap-6">
        {/* 프로필 이미지 */}
        <div className="flex-shrink-0">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={`${user.name}의 프로필`}
              className="w-20 h-20 rounded-full object-cover border-4 border-gray-100"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-4 border-gray-100">
              <span className="text-3xl font-bold text-white">{user.name.charAt(0)}</span>
            </div>
          )}
        </div>

        {/* 사용자 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: gradeInfo.bgColor,
                color: gradeInfo.color,
              }}
            >
              {gradeInfo.label}
            </span>
          </div>

          {/* 관심 분야 */}
          {user.interests.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 수정 버튼 */}
        {
          <button
            onClick={handleEdit}
            className="flex-shrink-0 rounded-full px-8 py-1 text-sm font-medium text-gray-500 bg-gray-50 hover:bg-gray-200 border border-gray-500 transition-colors"
          >
            내 정보 수정
          </button>
        }
      </div>
    </div>
  );
}
