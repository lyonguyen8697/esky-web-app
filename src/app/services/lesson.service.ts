import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthenticationHttp } from '../services/authentication-http.service';
import { RequestUtils } from '../utils/request.utils';
import { Question } from '../models/question.model';
import { Lesson } from '../models/lesson.model';
import { ItemMetadata } from '../models/item-metadata.model';
import { Log } from '../models/log.model';

import 'rxjs/add/operator/map';

@Injectable()
export class LessonService {

    apiUrl = '/api/lessons';

    constructor(private authHttp: AuthenticationHttp) { }

    search(key: string): Observable<ItemMetadata[]> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl + '/search/' + key))
            .map(res => res.json());
    }

    getAll(): Observable<Lesson[]> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl))
            .map(res => res.json());
    }

    get(id: string): Observable<Lesson> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl + '/' + id))
            .map(res => res.json());
    }

    getQuestions(id: string): Observable<Question[]> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl + '/' + id + '/questions'))
            .map(res => res.json());
    }

    getWithQuestions(id: string): Observable<{ lesson: Lesson, questions: Question[] }> {
        return this.get(id).mergeMap(lesson => {
            return this.getQuestions(id).map(questions => {
                return { lesson, questions };
            });
        });
    }

    getLogs(start = 0, count = 0): Observable<Log[]> {
        return this.authHttp.get(RequestUtils.getFullUrl(`${this.apiUrl}/log?start=${start}&count=${count}`))
            .map(res => res.json().map(log => RequestUtils.mapLessonLog(log)));
    }

    getLogById(id: string): Observable<Log> {
        return this.authHttp.get(RequestUtils.getFullUrl(`${this.apiUrl}/log/${id}`))
            .map(res => RequestUtils.mapLessonLog(res.json()));
    }

    getLogQuestions(id: string): Observable<Question[]> {
        return this.authHttp.get(RequestUtils.getFullUrl(`${this.apiUrl}/log/${id}/questions`))
            .map(res => res.json());
    }

    acceptContribute(id: string): Observable<any> {
        return this.authHttp.get(RequestUtils.getFullUrl(`${this.apiUrl}/log/${id}/accept`))
            .catch(error => {
                throw error.json();
            });
    }

    rejectContribute(id: string): Observable<any> {
        return this.authHttp.get(RequestUtils.getFullUrl(`${this.apiUrl}/log/${id}/reject`))
            .catch(error => {
                throw error.json();
            });
    }


    delete(id: string): Observable<any> {
        return this.authHttp.delete(RequestUtils.getFullUrl(this.apiUrl + '/' + id))
            .catch(error => Observable.of(error.json()));
    }

    restore(id: string): Observable<any> {
        return this.authHttp.post(RequestUtils.getFullUrl(this.apiUrl + '/' + id), null)
            .catch(error => Observable.of(error.json()));
    }

}
