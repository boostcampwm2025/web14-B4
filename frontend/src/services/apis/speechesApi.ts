import { apiFetch } from '@/services/http/apiFetch';
import { SpeechItemDto } from '@/app/checklist/types/speeches.types';

export type SttResult = {
  solvedQuizId: number;
  text: string;
};

export type SpeechesTextResponse = {
  quizId: number;
  speeches: SpeechItemDto[];
};

export type UpdateSpeechTextResponse = {
  mainQuizId: number;
  solvedQuizId: number;
  speechText: string;
};

export type CreateSpeechTextAnswerResponse = {
  mainQuizId: number;
  solvedQuizId: number;
};

type UploadAudio = {
  blob: Blob;
  filename: string;
  mimeType: string;
};

/**
 * 음성 파일을 STT 변환 API로 전송
 * - POST /speeches/stt
 * - form-data key: audio, filename: audio.webm
 * - 응답: { solvedQuizId, text }
 */
export async function postSpeechesStt(mainQuizId: number, audio: UploadAudio): Promise<SttResult> {
  const formData = new FormData();
  const audioFile = new File([audio.blob], audio.filename, { type: audio.mimeType });
  formData.append('audio', audioFile, audioFile.name);
  formData.append('mainQuizId', mainQuizId.toString());
  formData.append('mimeType', audio.mimeType);

  const data = await apiFetch<SttResult>(
    '/speeches/stt',
    { method: 'POST', body: formData },
    { message: 'STT 응답 데이터가 없습니다.' },
  );

  // 런타임 방어
  const solvedQuizId =
    typeof data.solvedQuizId === 'string' ? Number(data.solvedQuizId) : data.solvedQuizId;
  if (typeof solvedQuizId !== 'number' || isNaN(solvedQuizId) || typeof data.text !== 'string') {
    throw new Error('STT 응답 형식이 올바르지 않습니다.');
  }

  return {
    solvedQuizId,
    text: data.text,
  };
}

/**
 * 사용자가 mainQuizId에서 답변했던 녹음 텍스트를 조회
 */
export async function getSpeechesByQuizId(mainQuizId: number): Promise<SpeechesTextResponse> {
  const data = await apiFetch<SpeechesTextResponse>(
    `/speeches/${mainQuizId}`,
    { method: 'GET' },
    { message: '음성 데이터 조회 응답이 없습니다.' },
  );

  return data;
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
): Promise<UpdateSpeechTextResponse> {
  const data = await apiFetch<UpdateSpeechTextResponse>(
    `/speeches/${mainQuizId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        solvedQuizId,
        speechText,
      }),
    },
    { message: '음성 텍스트 수정 응답 데이터가 없습니다.' },
  );

  return data;
}

/**
 * 말하기 연습 텍스트 답변을 서버에 저장(insert)한다
 * - POST /speeches/text/{mainQuizId}
 * @param mainQuizId 말하기 퀴즈 ID
 * @param speechText 사용자가 입력한 텍스트 답변
 */
export async function postSpeechTextAnswer(
  mainQuizId: number,
  speechText: string,
): Promise<CreateSpeechTextAnswerResponse> {
  const data = await apiFetch<CreateSpeechTextAnswerResponse>(
    `/speeches/text/${mainQuizId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        speechText,
      }),
    },
    { message: '텍스트 답변 저장 응답 데이터가 없습니다.' },
  );

  return data;
}
