import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { LearnerService } from './learner.service';
import { Lesson } from '../models/lesson.model';
import { Question } from '../models/question.model';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class LessonReslover implements Resolve<{ lesson: Lesson, questions: Question[] }> {

    constructor(private router: Router, private learner: LearnerService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<{ lesson: Lesson, questions: Question[] }> {
        const id  = route.paramMap.get('id');

        return this.learner.getLesson(id)
        .catch((res) => {
            console.log(res.json());
            this.router.navigate(['']);
            return Observable.of(null);
        });
    }
}
