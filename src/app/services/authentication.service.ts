import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { EncryptService } from '../services/encrypt.service';
import { RequestUtils } from '../utils/request.utils';
import { Credentials } from '../models/credentials.models';
import { LocalStorageService } from './local-storage.service';
import { Role } from '../enums/role.emum';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {

    apiUrl = '/api/authenticate';

    redirectUrl: string;

    constructor(private http: Http,
        private router: Router,
        private storage: LocalStorageService,
        private encryt: EncryptService) { }

    signIn(credential: Credentials, handler?: Function) {
        this.encryptInfo(credential);
        this.http.post(RequestUtils.getFullUrl(this.apiUrl),
            JSON.stringify(credential),
            { headers: RequestUtils.getHeaders()})
            .subscribe(
                res => this.signInSuccess(res),
                res => this.signInError(res, handler)
            );
    }

    signInSuccess(res) {
        this.storage.setUser(res.json());
        if (this.checkVerify()) {
            this.redirect();
        } else {
            this.router.navigate(['verify']);
        }
    }

    signInError(res, handler?: Function) {
        handler(res.json().message);
    }

    redirect() {
        if (this.redirectUrl) {
            this.router.navigate([this.redirectUrl]);
        } else {
            this.router.navigate(['']);
        }
    }

    encryptInfo(credential: Credentials) {
        credential.password = this.encryt.encryptPassword(credential.password);
    }

    signOut() {
        this.storage.removeAll();
        this.redirectUrl = null;
        this.router.navigate(['welcome']);
    }

    requireSignIn(redirectUrl: string) {
        this.redirectUrl = redirectUrl;
        this.router.navigate(['welcome']);
    }

    checkCredentials(): boolean {
        return this.storage.getUser() ? true : false;
    }

    checkVerify(): boolean {
        return this.checkCredentials() ? this.storage.getUserToken() != null : false;
    }

    userInRole(role: Role): boolean {
        const userRole: Role = Role[this.storage.getUser().role];
        return userRole >= role;
    }

}
