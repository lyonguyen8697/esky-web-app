import { AnswerType } from '../enums/answer-type.enum';
import { Choice } from './choice.model';

export interface Question {
    id: string;
    question: string;
    caption: string;
    phrase: string;
    voice: string;
    picture: string;
    answerType: AnswerType;
    answer: string;
    choices: Choice[];
}
