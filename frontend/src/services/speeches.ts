import { SpeechItemDto } from '@/app/checklist/types/speeches.types';

export type SttResult = {
  solvedQuizId: number;
  text: string;
};

export type SpeechesTextResponse = {
  quizId: number;
  speeches: SpeechItemDto[];
};

/**
 * 음성 파일을 STT 변환 API로 전송
 * - POST /speeches/stt
 * - form-data key: audio, filename: audio.webm
 * - 응답: { solvedQuizId, text }
 */
export async function postSpeechesStt(mainQuizId: number, audioBlob: Blob): Promise<SttResult> {
  const formData = new FormData();
  formData.append(
    'audio',
    new File([audioBlob], 'audio.webm', {
      type: audioBlob.type || 'audio/webm',
    }),
  );
  formData.append('mainQuizId', mainQuizId.toString());

  // const data = await apiFetch<SttResult>('/speeches/stt', {
  //   method: 'POST',
  //   body: formData,
  // });

  const response = await fetch('http://localhost:8080/api/speeches/stt', {
    method: 'POST',
    body: formData,
  });

  const responseBody = await response.json();

  if (!responseBody.success) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: SttResult = responseBody.data;

  if (!data) {
    throw new Error('STT 응답 데이터가 없습니다.');
  }

  // 런타임 방어
  const solvedQuizId =
    typeof data.solvedQuizId === 'string' ? Number(data.solvedQuizId) : data.solvedQuizId;
  if (typeof solvedQuizId !== 'number' || isNaN(solvedQuizId) || typeof data.text !== 'string') {
    throw new Error('STT 응답 형식이 올바르지 않습니다.');
  }

  return data;
}

/**
 * 사용자가 mainQuizId에서 답변했던 녹음 텍스트를 조회
 */
export async function getSpeechesByQuizId(mainQuizId: number): Promise<SpeechesTextResponse> {
  try {
    // TODO : 추후 응답 형식 통일 되면, apiFetch로 변경 필요
    // const data = await apiFetch<SpeechesTextResponse>(`/speeches/${mainQuizId}`, {
    //   method: 'GET',
    // });

    const response = await fetch(`http://localhost:8080/api/speeches/${mainQuizId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseBody = await response.json();

    if (!responseBody.data) {
      throw new Error('음성 데이터 조회에 실패했습니다.');
    }

    return responseBody.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    throw new Error(`음성 조회 실패: ${errorMessage}`);
  }
}

/**
 * 수정한 녹음 텍스트를 서버에 update 한다
 * @param solvedQuizId 반영할 quiz id
 * @param speechText 수정된 녹음 텍스트
 */
export async function updateSpeechText(
  mainQuizId: number,
  solvedQuizId: number,
  speechText: string,
) {
  try {
    // TODO : 추후 응답 형식 통일 되면, apiFetch로 변경 필요
    // const data = await apiFetch(`/speeches/${mainQuizId}`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     solvedQuizId,
    //     speechText,
    //   }),
    // });

    const response = await fetch(`http://localhost:8080/api/speeches/${mainQuizId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        solvedQuizId,
        speechText,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data) {
      throw new Error('음성 텍스트 수정에 실패했습니다.');
    }

    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    throw new Error(`음성 텍스트 수정 실패: ${errorMessage}`);
  }
}
