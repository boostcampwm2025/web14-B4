import { Quiz } from "@/src/types/quiz";

const BASE_URL = 'http://localhost:8080';

export async function fetchQuizzes(): Promise<Quiz[]> {
    const res = await fetch(`${BASE_URL}/quizzes`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('퀴즈 목록을 가져오는데 실패했습니다.');
    }

    return res.json();
}