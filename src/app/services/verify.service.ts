import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { RequestUtils } from '../utils/request.utils';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class VerifyService {

    verifyApi = 'api/accounts/verify';

    constructor(private http: Http) { }

    verify(token: string): Observable<any> {
        return this.http.get(RequestUtils.getFullUrl(this.verifyApi + '/' + token))
            .map(res => res.json())
            .catch(res => Observable.of(res.json()));
    }

    resendVerify(id: string): Observable<boolean> {
        return this.http.get(RequestUtils.getFullUrl('api/accounts/' + id + '/verify'))
            .map(() => true)
            .catch(() => Observable.of(false));
    }
}
