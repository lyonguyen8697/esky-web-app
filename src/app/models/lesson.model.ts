export interface Lesson {
    id: string;
    subject: string;
    title: string;
    caption: string;
    description: string;
    level: string;
    progress: number;
    remains: string[];
    passed: boolean;
}
