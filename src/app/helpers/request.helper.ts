import { Headers } from '@angular/http';

export class RequestHelper {

    private static baseUrl = 'http://localhost:9998/esky';

    private static headers = new Headers({
        'Content-Type': 'application/json'
    });

    static getFullUrl(url: string): string {
        return this.baseUrl + url;
    }

    static getHeaders(): Headers {
        return this.headers;
    }
}
