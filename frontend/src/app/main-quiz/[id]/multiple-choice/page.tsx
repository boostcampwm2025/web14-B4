import { fetchMultipleChoices } from '@/services/apis/multipleQuizApi';
import MultipleQuizContainer from './components/multiple-quizzes/MultipleQuizContainer';
import QuizIntro from './components/QuizIntro';

export default async function MultipleQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mainQuizId = Number(id);

  // const multipleQuizInfo = await fetchMultipleChoices(mainQuizId);
  const multipleQuizInfo = mock;
  return (
    <div className="flex justify-center">
      <div className="px-10 w-300">
        <QuizIntro />
        <MultipleQuizContainer multipleQuizzesInfo={multipleQuizInfo} />
      </div>
    </div>
  );
}

const mock = {
  mainQuizId: 1,
  totalCount: 2,
  multipleChoices: [
    {
      multipleChoiceId: 10,
      content: '프로세스와 스레드의 차이로 가장 적절한 것은?',
      options: [
        {
          multipleQuizOptionId: 100,
          option:
            '프로세스는 독립된 메모리 공간을 가지며, 스레드는 같은 프로세스의 자원을 공유한다.',
          isCorrect: true,
          explanation: null,
        },
        {
          multipleQuizOptionId: 101,
          option: '프로세스와 스레드는 모두 독립된 메모리 공간을 가진다.',
          isCorrect: false,
          explanation: null,
        },
        {
          multipleQuizOptionId: 102,
          option: '스레드는 독립된 메모리 공간을 가지며, 프로세스는 자원을 공유한다.',
          isCorrect: false,
          explanation: null,
        },
        {
          multipleQuizOptionId: 103,
          option: '프로세스와 스레드는 컨텍스트 스위칭 비용이 발생하지 않는다.',
          isCorrect: false,
          explanation: null,
        },
      ],
    },
    {
      multipleChoiceId: 11,
      content: '컨텍스트 스위칭 시 저장되는 정보로 가장 적절한 것은?',
      options: [
        {
          multipleQuizOptionId: 110,
          option: 'CPU 레지스터와 프로그램 카운터',
          isCorrect: true,
          explanation: null,
        },
        {
          multipleQuizOptionId: 111,
          option: '하드디스크의 파일 블록',
          isCorrect: false,
          explanation: null,
        },
        {
          multipleQuizOptionId: 112,
          option: '네트워크 패킷 큐',
          isCorrect: false,
          explanation: null,
        },
        {
          multipleQuizOptionId: 113,
          option: '파일 시스템의 inode',
          isCorrect: false,
          explanation: null,
        },
      ],
    },
  ],
};
