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

import 'rxjs/add/operator/map';

@Injectable()
export class LearnerService {

    apiUrl = '/api/learners';

    constructor(private authHttp: AuthenticationHttp) { }

    getLessons(): Observable<Lesson[]> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl + '/lessons'))
        .map(res => res.json());
    }

    getLesson(lessonId: string): Observable<{ lesson: Lesson, questions: Question[] }> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl + '/lessons/' + lessonId))
        .map(res => res.json());
    }

    updateLessonRemains(lessonId: string, remains: string[]): Observable<any> {
        return this.authHttp.put(RequestUtils.getFullUrl(this.apiUrl + '/lessons/' + lessonId), remains);
    }

    test(): Observable<string> {
        return this.authHttp.get(RequestUtils.getFullUrl('/api/test')).map(res => res.json());
    }
}
