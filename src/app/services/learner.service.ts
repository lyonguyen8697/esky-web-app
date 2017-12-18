import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthenticationHttp } from '../services/authentication-http.service';
import { LocalStorageService } from './local-storage.service';
import { RequestUtils } from '../utils/request.utils';
import { User } from '../models/user.model';
import { Role } from '../enums/role.emum';
import { Lesson } from '../models/lesson.model';
import { Question } from '../models/question.model';
import { Learner } from '../models/learner.model';
import { LevelInfo } from '../models/level-info.model';
import { ItemMetadata } from '../models/item-metadata.model';

import 'rxjs/add/operator/map';

@Injectable()
export class LearnerService {

    apiUrl = '/api/learners';

    constructor(private authHttp: AuthenticationHttp,
        private storage: LocalStorageService) { }

    search(key: string): Observable<ItemMetadata[]> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl + '/search/' + key))
            .map(res => res.json());
    }

    get(): Observable<Learner> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl))
            .map(res => res.json())
            .mergeMap(res => {
                const learner = new Learner(res);
                return this.getLevelInfo().map((levelInfo: LevelInfo) => {
                    learner.levelInfo = levelInfo;
                    this.storage.setLearner(learner);
                    return learner;
                });
            });
    }

    getById(id: string) {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl + '/' + id))
            .map(res => res.json())
            .mergeMap(res => {
                const learner = new Learner(res);
                return this.getLevelInfo().map((levelInfo: LevelInfo) => {
                    learner.levelInfo = levelInfo;
                    this.storage.setLearner(learner);
                    return learner;
                });
            });
    }

    getLevelInfo(): Observable<LevelInfo> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl + '/levelinfo'))
            .map(res => res.json());
    }

    getLessons(): Observable<Lesson[]> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl + '/lessons'))
            .map(res => res.json());
    }

    getLesson(lessonId: string): Observable<{ lesson: Lesson, questions: Question[] }> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl + '/lessons/' + lessonId))
            .map(res => res.json());
    }

    answerQuestion(lessonId: string, questionId: string, answer: string): Observable<boolean> {
        return this.authHttp.put(RequestUtils.getFullUrl(this.apiUrl + '/lessons/' + lessonId + '/questions/' + questionId), answer)
            .map(res => res.json().result);
    }

    getLessonReward(lessonId): Observable<number> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl + '/lessons/' + lessonId + '/reward'))
            .map(res => res.json().experience);
    }

    getRank(id: string): Observable<{ rank: number }> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl + '/' + id + '/rank'))
            .map(res => res.json());
    }

    getRanking(limit?: number): Observable<User[]> {
        return this.authHttp.get(RequestUtils.getFullUrl(this.apiUrl + '/ranking'))
            .map(res => res.json());
    }

    test(): Observable<string> {
        return this.authHttp.get(RequestUtils.getFullUrl('/api/test')).map(res => res.json());
    }
}
