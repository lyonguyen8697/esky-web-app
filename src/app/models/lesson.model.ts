export interface Lesson {
    id: string;
    subject: string;
    title: string;
    description: string;
    level: number;
    deleted?: boolean;
    answered?: string[];
    remains?: string[];
    experience?: number;
    passed?: boolean;
}
