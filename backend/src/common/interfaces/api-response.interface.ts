export interface ApiResponse<T = unknown> {
  success: boolean; // true: 성공, false: 실패
  message: string; // 사용자용 또는 개발자용 설명 메시지
  errorCode: string | null; // 실패 시 에러 코드 문자열, 성공 시 null
  data: T | null; // 성공 시 응답 데이터, 실패 시 null
}
