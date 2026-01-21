/**
 * 배열 요소 순서를 무작위로 섞어 반환한다.
 * @param array 무작위로 섞고 싶은 배열
 * @returns 섞인 배열
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
