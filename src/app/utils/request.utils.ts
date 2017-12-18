import { Headers } from '@angular/http';

import { User } from '../models/user.model';
import { Log } from '../models/log.model';

export class RequestUtils {

    private static baseUrl = 'http://localhost:9998';

    private static headers = new Headers({
        'Content-Type': 'application/json'
    });

    static getFullUrl(url: string): string {
        if (url.startsWith('/')) {
            return this.baseUrl + url;
        }
        return this.baseUrl + '/' + url;
    }

    static getHeaders(): Headers {
        const headers = new Headers({
            'Content-Type': 'application/json'
        });
        const token = RequestUtils.getAuthorizationToken();
        if (token) {
            headers.append('Authorization', token);
        }
        return headers;
    }

    static getAuthorizationToken(): string {
        const user: User = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            return `Bearer ${user.token}`;
        }
        return '';
    }

    static mapQuestionLog(res: any): Log {
        return {
            id: res.log_id,
            contributor: res.contributor,
            time: new Date(res.time),
            method: res.method,
            note: res.note,
            accepted: res.accepted,
            question: {
                id: res.id,
                question: res.question,
                phrase: res.phrase,
                voice: res.voice,
                picture: res.picture,
                answerType: res.answerType,
                answers: res.answers,
                choices: res.choices,
                difficulty: res.difficulty
            }
        };
    }

    static mapLessonLog(res: any): Log {
        return {
            id: res.log_id,
            contributor: res.contributor,
            time: new Date(res.time),
            method: res.method,
            note: res.note,
            accepted: res.accepted,
            lesson: {
                id: res.id,
                subject: res.subject,
                title: res.title,
                description: res.description,
                level: res.level
            }
        };
    }
}
