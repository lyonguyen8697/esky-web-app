import { AnswerType } from '../enums/answer-type.enum';

export interface Question {
    id: string;
    question: string;
    phrase: string;
    voice: string;
    picture: string;
    answerType: string;
    answers: string[];
    choices: string[];
    difficulty: string;
}
