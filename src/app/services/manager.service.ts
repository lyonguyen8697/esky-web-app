import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthenticationHttp } from '../services/authentication-http.service';
import { RequestUtils } from '../utils/request.utils';

import 'rxjs/add/operator/map';

@Injectable()
export class ManagerService {

    apiUrl = '/api/managers';

    constructor(private authHttp: AuthenticationHttp) { }

    appoint(id: string): Observable<any> {
        return this.authHttp
            .post(RequestUtils.getFullUrl(this.apiUrl), id)
            .catch(error => Observable.of(error));
    }
}
