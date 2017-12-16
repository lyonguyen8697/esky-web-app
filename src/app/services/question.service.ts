import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthenticationHttp } from './authentication-http.service';
import { RequestUtils } from '../utils/request.utils';
import { Question } from '../models/question.model';
import { ItemMetadata } from '../models/item-metadata.model';

import 'rxjs/add/operator/map';

@Injectable()
export class QuestionService {

    apiUrl = '/api/questions';

    constructor(private authHttp: AuthenticationHttp) {}

    search(key: string): Observable<ItemMetadata[]> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl + '/search/' + key))
            .map(res => res.json());
    }

    getAll(): Observable<Question[]> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl))
        .map(res => res.json());
    }

    get(id: string): Observable<Question> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl + '/' + id))
        .map(res => res.json());
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

}
