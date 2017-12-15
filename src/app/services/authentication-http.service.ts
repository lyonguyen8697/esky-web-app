import { Injectable } from '@angular/core';
import {
    Http,
    Request,
    RequestOptions,
    RequestOptionsArgs,
    Response, XHRBackend,
    Headers
} from '@angular/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from '../services/authentication.service';
import { RequestUtils } from '../utils/request.utils';
import { ErrorMessage } from '../models/error-message.model';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationHttp extends Http {

    constructor(
        backend: XHRBackend,
        options: RequestOptions,
        private router: Router,
        private authService: AuthenticationService
    ) {
        super(backend, options);
        options.headers = RequestUtils.getHeaders();
    }

    request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {
        if (typeof url === 'string') {
            if (!options) {
                options = { headers: RequestUtils.getHeaders() };
            }
            options.headers.set('Authorization', RequestUtils.getAuthorizationToken());
        } else {
            url.headers.set('Authorization', RequestUtils.getAuthorizationToken());
        }
        return super.request(url, options)
            .catch(res => this.handleError(res));
    }

    handleError(res: Response) {
        const error: ErrorMessage = res.json();
        if (error.statusCode === 500) {
            this.router.navigate(['error', 500]);
        } else if (error.statusCode === 401) {
            this.authService.requireSignIn(this.router.url);
        } else if (error.statusCode === 403) {
            this.router.navigate(['']);
        }
        return Observable.throw(res);
    }

}
