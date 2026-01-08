import { apiFetch } from "@/services/http/apiFetch";

export type SttResult = {
  solvedQuizId: number;
  text: string;
};

/**
 * 음성 파일을 STT 변환 API로 전송
 * - POST /speeches/stt
 * - form-data key: audio, filename: audio.webm
 * - 응답: { solvedQuizId, text }
 */
export async function postSpeechesStt(audioBlob: Blob): Promise<SttResult> {
  const formData = new FormData();
  formData.append(
    "audio",
    new File([audioBlob], "audio.webm", {
      type: audioBlob.type || "audio/webm",
    })
  );

  const data = await apiFetch<SttResult>("/speeches/stt", {
    method: "POST",
    body: formData,
  });

  if (!data) {
    throw new Error("STT 응답 데이터가 없습니다.");
  }

  // 런타임 방어
  if (typeof data.solvedQuizId !== "number" || typeof data.text !== "string") {
    throw new Error("STT 응답 형식이 올바르지 않습니다.");
  }

  return data;
}
