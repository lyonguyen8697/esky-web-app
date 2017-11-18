import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { EncryptService } from '../services/encrypt.service';
import { RequestUtils } from '../utils/request.utils';
import { SignUpInfo } from '../models/sign-up-info.model';
import { UserService } from './user.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/Observable/of';

@Injectable()
export class SignUpService {

    constructor(private http: Http,
        private router: Router,
        private user: UserService,
        private encrypt: EncryptService) {}

    checkEmailExists(email: string): Observable<boolean> {
        return this.http.head(RequestUtils.getFullUrl('api/accounts/' + email))
        .map(() => true)
        .catch(() => Observable.of(false));
    }

    signUp(info: SignUpInfo, error: string) {
        const encryptInfo = this.encryptInfo(info);
        this.http.post(RequestUtils.getFullUrl('api/accounts'), encryptInfo)
        .subscribe(
            res => this.signUpSucess(res),
            res => this.signUpError(res, error)
        );
    }

    signUpSucess(res) {
        this.user.setLocal(res.json());
        this.router.navigate(['verify']);
    }

    signUpError(res, error: string) {
        error = 'Server response: ' + res.json().message + ' Please refresh your page.';
    }

    encryptInfo(info: SignUpInfo): { email: string, name: string, password: string } {
        const encryptInfo = info.prime;
        encryptInfo.password = this.encrypt.encryptPassword(encryptInfo.password);
        return encryptInfo;
    }
}
