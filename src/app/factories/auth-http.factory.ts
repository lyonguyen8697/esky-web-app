import { Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(new AuthConfig({
      tokenGetter: (() => JSON.parse(localStorage.getItem('user')).token),
      globalHeaders: [{ 'Content-Type': 'application/json'}]
    }), http, options);
}
