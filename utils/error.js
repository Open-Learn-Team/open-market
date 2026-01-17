// utils/error.js
export function getApiErrorMessage(
  error,
  fallback = "요청을 처리할 수 없습니다."
) {
  if (!error) return fallback;

  // API에서 내려주는 대표 케이스들
  if (error.data) {
    if (typeof error.data === "string") return error.data;
    if (error.data.detail) return error.data.detail;
    if (error.data.quantity?.[0]) return error.data.quantity[0];
    if (error.data.non_field_errors?.[0]) return error.data.non_field_errors[0];
  }

  // 상태 코드 기반 처리
  if (error.status === 400) return "요청이 올바르지 않습니다.";
  if (error.status === 401) return "로그인이 필요합니다.";
  if (error.status === 403) return "권한이 없습니다.";
  if (error.status === 404) return "요청한 데이터를 찾을 수 없습니다.";

  return fallback;
}
