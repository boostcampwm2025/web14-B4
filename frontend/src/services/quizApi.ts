import { Quiz } from "@/src/types/quiz";

const BASE_URL = 'http://localhost:8080';

export async function fetchQuizzes(category?: string, difficulty?: string): Promise<Quiz[]> {
    const params = new URLSearchParams();

    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);

    const res = await fetch(`${BASE_URL}/quizzes?${params.toString()}`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('퀴즈 목록을 가져오는데 실패했습니다.');
    }

    return res.json();
}

export async function fetchCategoryCounts() {
    const res = await fetch(`${BASE_URL}/quizzes/categories`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('카테고리 정보를 가져오는데 실패했습니다.');
    }
    return res.json();
}