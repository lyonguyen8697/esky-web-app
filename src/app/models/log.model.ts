import { Lesson } from './lesson.model';
import { Question } from './question.model';

export interface Log {
    id: string;
    contributor: string;
    time: Date;
    method: string;
    note: string;
    accepted: boolean;

    lesson?: Lesson;
    question?: Question;
}
