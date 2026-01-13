declare module '@google/genai' {
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

  export interface GenerateContentConfig {
    systemInstruction?: string;
    temperature?: number;
    responseMimeType?: string;
    thinkingConfig?: GenerateContentThinkingConfig;
  }

  export interface GenerateContentRequest {
    model: string;
    config?: GenerateContentConfig;
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
