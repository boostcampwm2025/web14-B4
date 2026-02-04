'use client';

import { UserProfile } from '../types/user';
interface UserProfileProps {
  user: UserProfile;
}

// const GRADE_CONFIG = {
//   bronze: { label: '브론즈', color: '#CD7F32', bgColor: '#FFF4E6' },
//   silver: { label: '실버', color: '#71717A', bgColor: '#F4F4F5' },
//   gold: { label: '골드', color: '#9B4A00', bgColor: '#F9A518' },
//   platinum: { label: '플래티넘', color: '#6366F1', bgColor: '#EEF2FF' },
// };

export default function MyProfile({ user }: UserProfileProps) {
  // const gradeInfo = GRADE_CONFIG[user.grade] || GRADE_CONFIG.bronze;

  const handleEdit = () => {
    alert('프로필 수정');
  };

  return (
    <div className="mx-auto py-8">
      <div className="flex items-center gap-6">
        {/* 프로필 이미지 */}
        <div className="flex-shrink-0">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={`${user.name}의 프로필`}
              className="w-25 h-25 rounded-full object-cover border-4 border-gray-100"
            />
          ) : (
            <img
              src="/images/default-profile.svg"
              alt="기본 프로필"
              className="w-25 h-25 rounded-full object-cover border-4 border-gray-100"
            />
          )}
        </div>

        {/* 사용자 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            {/* <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: gradeInfo.bgColor,
                color: gradeInfo.color,
              }}
            >
              {gradeInfo.label}
            </span> */}
          </div>

          {/* 관심 분야 */}
          {/* {user.interests?.length > 0 && (
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
          )} */}
        </div>

        {/* 수정 버튼 */}
        {
          // <button
          //   onClick={handleEdit}
          //   className="flex-shrink-0 rounded-full px-8 py-1 text-sm font-medium text-gray-500 bg-gray-50 hover:bg-gray-200 border border-gray-500 transition-colors cursor-pointer"
          // >
          //   내 정보 수정
          // </button>
        }
      </div>
    </div>
  );
}
