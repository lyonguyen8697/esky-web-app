import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthenticationHttp } from './authentication-http.service';
import { RequestUtils } from '../utils/request.utils';
import { Question } from '../models/question.model';
import { ItemMetadata } from '../models/item-metadata.model';
import { Log } from '../models/log.model';

import 'rxjs/add/operator/map';

@Injectable()
export class QuestionService {

    apiUrl = '/api/questions';

    constructor(private authHttp: AuthenticationHttp) { }

    search(key: string): Observable<ItemMetadata[]> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl + '/search/' + key))
            .map(res => res.json());
    }

    getAll(): Observable<Question[]> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl))
            .map(res => res.json());
    }

    getById(id: string): Observable<Question> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl + '/' + id))
            .map(res => res.json());
    }

    getLogs(start = 0, count = 0): Observable<Log[]> {
        return this.authHttp.get(RequestUtils.getFullUrl(`${this.apiUrl}/log?start=${start}&count=${count}`))
            .map(res => res.json().map(log => RequestUtils.mapQuestionLog(log)));
    }

    getLogById(id: string): Observable<Log> {
        return this.authHttp.get(RequestUtils.getFullUrl(`${this.apiUrl}/log/${id}`))
            .map(res => RequestUtils.mapQuestionLog(res.json()));
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

    checkAnswer(question: Question, answer: string) {
        switch (question.answerType) {
            case 'ARRANGEMENT':
                return question.answers.join(';') === answer;
            case 'MULTI_CHOICE':
            case 'SPEECH':
            case 'TYPING':
                return question.answers.includes(answer);
        }
        return false;
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
