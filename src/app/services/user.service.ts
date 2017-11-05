import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthenticationHttp } from '../services/authentication-http.service';
import { RequestUtils } from '../utils/request.utils';
import { User } from '../models/user.model';
import { Role } from '../enums/role.emum';
import { Lesson } from '../models/lesson.model';

import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

    apiUrl = '/api/users/123AB/lessons';

    constructor(private authHttp: AuthenticationHttp) { }

    remove() {
        localStorage.removeItem('user');
    }

    getLessons(): Observable<Lesson[]> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl))
        .map(res => res.json());
    }

    test(): Observable<string> {
        return this.authHttp.get(RequestUtils.getFullUrl('/api/test')).map(res => res.json());
    }
}
