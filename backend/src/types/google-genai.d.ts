declare module '@google/genai' {
  /* 질문이나 지시사항 */
  export interface GenerateContentPart {
    text: string;
  }

  export interface GenerateContentUserContent {
    role: string; // e.g., 'user'
    parts: GenerateContentPart[];
  }

  export interface GenerateContentThinkingConfig {
    thinkingBudget?: number;
  }

  /**
   * Gemini 모델의 생성 동작을 제어하는 설정 인터페이스
   */
  export interface GenerateContentConfig {
    /** 0.0 ~ 1.0 사이의 값. 높을수록 창의적이고 낮을수록 결정론적임 */
    temperature?: number;

    /** 출력 결과에 포함될 최대 토큰 수 */
    maxOutputTokens?: number;

    /** 상위 확률 기반 샘플링 제어 */
    topP?: number;

    /** 상위 K개 토큰 샘플링 제어 */
    topK?: number;

    /** 특정 문자열이 나타나면 생성을 중단함 */
    stopSequences?: string[];

    /** 모델에게 부여하는 페르소나 또는 배경 지침 */
    systemInstruction?: string | Content | Content[];

    /** 응답의 MIME 타입을 지정 (예: 'application/json', 'text/plain') */
    responseMimeType?: string;

    /** JSON 출력 모드 사용 시 결과의 스키마 정의 (JSON Schema 표준) */
    responseSchema?: Record<string, unknown>;

    /** 모델이 출력할 데이터 유형 지정 (예: ['TEXT', 'IMAGE']) */
    responseModalities?: ('TEXT' | 'IMAGE' | 'AUDIO')[];

    /** 안전 필터 설정 */
    safetySettings?: SafetySetting[];

    /** 도구 사용 (함수 호출 등) 설정 */
    tools?: Tool[];

    /** 도구 실행 모드 설정 (자동, 특정 함수 지정 등) default = 0*/
    toolConfig?: ToolConfig;

    /** [Gemini 3 전용] 모델의 추론(Thinking) 과정 설정 */
    thinkingConfig?: {
      /** 응답 객체에 모델의 생각 과정을 포함할지 여부 */
      includeThoughts?: boolean;
      /** 추론의 깊이 설정 */
      thinkingLevel?: 'minimal' | 'low' | 'medium' | 'high';
    };

    /** 출력 결과 후보 수 (현재 대부분 1개만 지원) */
    candidateCount?: number;

    /** 데이터의 존재 여부에 따른 생성 확률 조정 */
    presencePenalty?: number;

    /** 동일한 단어 반복 사용을 억제하는 페널티 */
    frequencyPenalty?: number;
  }

  /** * 보조 타입들 (구현 환경에 따라 확장 가능)
   */
  export interface SafetySetting {
    category:
      | 'HARM_CATEGORY_HARASSMENT'
      | 'HARM_CATEGORY_HATE_SPEECH'
      | 'HARM_CATEGORY_SEXUALLY_EXPLICIT'
      | 'HARM_CATEGORY_DANGEROUS_CONTENT';
    threshold:
      | 'BLOCK_NONE'
      | 'BLOCK_LOW_AND_ABOVE'
      | 'BLOCK_MEDIUM_AND_ABOVE'
      | 'BLOCK_ONLY_HIGH';
  }

  export interface Content {
    role: 'user' | 'model';
    parts: Part[];
  }

  export interface Part {
    text?: string;
    inlineData?: {
      mimeType: string;
      data: string;
    };
    fileData?: {
      mimeType: string;
      fileUri: string;
    };
  }

  export interface GenerateContentConfig {
    systemInstruction?: string;
    temperature?: number;
    responseMimeType?: string;
    thinkingConfig?: GenerateContentThinkingConfig;
  }

  export interface GenerateContentRequest {
    model: string;
    config?: GenerateContentConfig;
    /** 이전 대화 내용을 기억하게 하려면 배열에 순서대로 쌓아서 보내야 함 */
    contents: GenerateContentUserContent[];
  }

  export interface GenerateContentResponse {
    text?: string;
  }

  export class GoogleGenAI {
    constructor(apiKey: string);
    models: {
      generateContent(
        request: GenerateContentRequest,
      ): Promise<GenerateContentResponse>;
    };
  }
}
