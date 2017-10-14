import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { RequestHelper } from '../helpers/request.helper';
import { Credentials } from '../models/credentials.models';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {

    apiUrl = '/api/authenticate';

    constructor(private http: Http, private router: Router) { }

    signIn(credential: Credentials) {
        return this.http.post(RequestHelper.getFullUrl(this.apiUrl),
            JSON.stringify(credential),
            { headers: RequestHelper.getHeaders()})
            .subscribe(
                (res) => this.signInSuccess(res),
                (err) => this.signInError(err)
            );
    }

    private signInSuccess(response: Response) {
        const user = response.json();
        console.log(user);
        if (user && user.token) {
            localStorage.setItem('user', JSON.stringify(user));
            this.router.navigate(['']);
        }
    }

    private signInError(error) {
        console.log(error);
    }

    signOut() {
        localStorage.removeItem('user');
        this.router.navigate(['welcome']);
    }

    checkCredentials(): boolean {
        return localStorage.getItem('user') ? true : false;
    }

}
