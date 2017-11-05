import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { EncryptService } from '../services/encrypt.service';
import { RequestUtils } from '../utils/request.utils';
import { Credentials } from '../models/credentials.models';
import { User } from '../models/user.model';
import { Role } from '../enums/role.emum';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {

    apiUrl = '/api/authenticate';

    redirectUrl: string;

    constructor(private http: Http,
        private router: Router,
        private encryt: EncryptService) { }

    signIn(credential: Credentials, error: string) {
        this.encryptInfo(credential);
        this.http.post(RequestUtils.getFullUrl(this.apiUrl),
            JSON.stringify(credential),
            { headers: RequestUtils.getHeaders()})
            .subscribe(
                res => this.signInSuccess(res),
                res => this.signInError(res, error)
            );
    }

    signInSuccess(res) {
        User.setLocal(res.json());
        if (User.getLocal().token) {
            if (this.redirectUrl) {
                this.router.navigate([this.redirectUrl]);
            } else {
                this.router.navigate(['']);
            }
        } else {
            this.router.navigate(['verify']);
        }
    }
    signInError(res, error: string) {
        error = res.json().message;
    }

    encryptInfo(credential: Credentials) {
        credential.password = this.encryt.encryptPassword(credential.password);
    }

    signOut() {
        User.removeLocal();
        this.redirectUrl = null;
        this.router.navigate(['welcome']);
    }

    checkCredentials(): boolean {
        return User.getLocal() ? true : false;
    }

    checkVerify(): boolean {
        return this.checkCredentials() ? User.getLocal().token != null : false;
    }

    userInRole(role: Role): boolean {
        const userRole: Role = Role[User.getLocal().role];
        return userRole >= role;
    }

}
