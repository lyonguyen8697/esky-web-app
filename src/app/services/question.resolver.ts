import { Injectable } from '@angular/core';
import {
    Router, Resolve,
    ActivatedRouteSnapshot
} from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { QuestionService } from './question.service';
import { Question } from '../models/question.model';


@Injectable()
export class QuestionResolver implements Resolve<Question> {

    constructor(private router: Router,
                private questionService: QuestionService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Question> {
        const id = route.params['id'];
        return this.questionService.getById(id)
        .catch(() => {
            this.router.navigate(['404']);
            return Observable.of(null);
        });
    }
}
