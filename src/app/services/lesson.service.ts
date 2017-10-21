import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { RequestHelper } from '../helpers/request.helper';
import { Question } from '../models/question.model';

import 'rxjs/add/operator/map';

@Injectable()
export class LessonService {

    apiUrl = '/api/lessons/';

    constructor(private http: Http) {}

    get(id: string): Observable<Question[]> {
        return this.http.get(RequestHelper.getFullUrl(this.apiUrl + id))
        .map(res => res.json());
    }

    canAccess(id: string): boolean {
        return id ? true : false;
    }

}
