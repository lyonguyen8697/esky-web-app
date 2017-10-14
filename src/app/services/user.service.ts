import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { RequestHelper } from '../helpers/request.helper';
import { Lesson } from '../models/lesson.model';

import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

    apiUrl = '/api/users/123AB/lessons';

    constructor(private http: Http) { }

    getLessons(): Observable<Lesson[]> {
        return this.http.get(RequestHelper.getFullUrl(this.apiUrl))
        .map(res => res.json());
    }
}
