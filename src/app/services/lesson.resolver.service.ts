import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { LessonService } from './lesson.service';
import { Lesson } from '../models/lesson.model';
import { Question } from '../models/question.model';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class LessonReslover implements Resolve<{ lesson: Lesson, questions: Question[] }> {

    constructor(private router: Router, private lesson: LessonService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<{ lesson: Lesson, questions: Question[] }> {
        const id  = route.paramMap.get('id');

        return this.lesson.getWithQuestions(id)
        .catch((res) => {
            this.router.navigate(['error', 404]);
            return Observable.of(null);
        });
    }
}
