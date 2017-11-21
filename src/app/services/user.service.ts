import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mapTo';

import { AuthenticationHttp } from './authentication-http.service';
import { LocalStorageService } from './local-storage.service';
import { EncryptService } from './encrypt.service';
import { RequestUtils } from '../utils/request.utils';
import { User } from '../models/user.model';
import { SignUpInfo } from '../models/sign-up-info.model';
import { UserUpdateInfo } from '../models/user-update-info.model';

@Injectable()
export class UserService {

    apiUrl = 'api/accounts';

    constructor(private http: Http,
                private authHttp: AuthenticationHttp,
                private router: Router,
                private storage: LocalStorageService,
                private encrypt: EncryptService) {}

    get(): Observable<User> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl))
        .map(res => {
            const user: User = res.json();
            this.storage.user.emit(user);
            return user;
        });
    }

    getByUsername(username: string): Observable<User> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl + '/' + username))
        .map(res => res.json());
    }

    hasEmailOrUsername(emailOrUsername: string): Observable<boolean> {
        return this.http.head(RequestUtils.getFullUrl('api/accounts/' + emailOrUsername))
        .mapTo(true)
        .catch(() => Observable.of(false));
    }

    signUp(info: SignUpInfo, handler?: Function) {
        info.password = this.encrypt.encryptPassword(info.password);
        this.http.post(RequestUtils.getFullUrl('api/accounts'), info)
        .subscribe(
            res => this.signUpSucess(res),
            res => this.signUpError(res, handler)
        );
    }

    signUpSucess(res) {
        const user = res.json();
        this.storage.setUser(user);
        this.router.navigate(['verify']);
    }

    signUpError(res, handler?: Function) {
        handler(res.json().message);
    }

    updateUsername(username: string, credentials: string): Observable<any> {
        credentials = this.encrypt.encryptPassword(credentials);
        return this.authHttp
        .put(RequestUtils.getFullUrl(this.apiUrl + '/username'), { username: username, credentials: credentials});
    }

    updateName(name: string, credentials: string): Observable<any> {
        credentials = this.encrypt.encryptPassword(credentials);
        return this.authHttp
        .put(RequestUtils.getFullUrl(this.apiUrl + '/name'), { name: name, credentials: credentials});
    }

    updatePassword(password: string, credentials: string): Observable<any> {
        password = this.encrypt.encryptPassword(password);
        credentials = this.encrypt.encryptPassword(credentials);
        return this.authHttp
        .put(RequestUtils.getFullUrl(this.apiUrl + '/password'), { password: password, credentials: credentials});
    }

}
