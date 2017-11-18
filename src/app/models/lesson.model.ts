export interface Lesson {
    id: string;
    subject: string;
    title: string;
    caption: string;
    description: string;
    level: string;
    answered: string[];
    remains: string[];
    experience: number;
    passed: boolean;
}
