import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthenticationHttp } from '../services/authentication-http.service';
import { RequestUtils } from '../utils/request.utils';
import { User } from '../models/user.model';
import { Role } from '../enums/role.emum';
import { Lesson } from '../models/lesson.model';
import { Question } from '../models/question.model';
import { Learner } from '../models/learner.model';
import { LevelInfo } from '../models/level-info.model';
import { ItemMetadata } from '../models/item-metadata.model';

import 'rxjs/add/operator/map';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class ContributorService {

    apiUrl = '/api/contributors';

    constructor(private authHttp: AuthenticationHttp,
        private storage: LocalStorageService) { }

    search(key: string): Observable<ItemMetadata[]> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl + '/search/' + key))
            .map(res => res.json());
    }

    appoint(id: string): Observable<boolean> {
        return this.authHttp
            .post(RequestUtils.getFullUrl(this.apiUrl), id)
            .catch(error => Observable.of(error));
    }

    insertLesson(note: string, lesson: Lesson, questions: Question[]): Observable<any> {
        return this.authHttp
            .post(RequestUtils.getFullUrl(this.apiUrl + '/lesson'), { note, lesson, questions: questions.map(question => question.id) })
            .catch(error => Observable.of(error.json()));
    }

    updateLesson(note: string, lesson: Lesson, questions: Question[]): Observable<any> {
        return this.authHttp
            .put(RequestUtils.getFullUrl(this.apiUrl + '/lesson/' + lesson.id),
            { note, lesson, questions: questions.map(question => question.id) })
            .catch(error => Observable.of(error.json()));
    }

    deleteLesson(note: string, lessonId: string): Observable<any> {
        return this.authHttp
            .delete(RequestUtils.getFullUrl(this.apiUrl + '/lesson/' + lessonId + '?note=' + note))
            .catch(error => Observable.of(error.json()));
    }

    insertQuestion(note: string, question: Question): Observable<any> {
        return this.authHttp
            .post(RequestUtils.getFullUrl(this.apiUrl + '/question'), { note, question })
            .catch(error => Observable.of(error.json()));
    }

    updateQuestion(note: string, question: Question): Observable<any> {
        return this.authHttp
            .put(RequestUtils.getFullUrl(this.apiUrl + '/question/' + question.id), { note, question })
            .catch(error => Observable.of(error.json()));
    }

    deleteQuestion(note: string, questionId: string): Observable<any> {
        return this.authHttp
            .delete(RequestUtils.getFullUrl(this.apiUrl + '/question/' + questionId + '?note=' + note))
            .catch(error => Observable.of(error.json()));
    }
}
