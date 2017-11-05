import { Headers } from '@angular/http';

import { User } from '../models/user.model';

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
}
