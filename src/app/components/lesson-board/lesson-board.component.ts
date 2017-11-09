import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Lesson } from '../../models/lesson.model';
import { LearnerService } from '../../services/learner.service';

@Component({
    templateUrl: 'lesson-board.component.html',
    styleUrls: ['lesson-board.component.css'],
})
export class LessonBoardComponent implements OnInit {

    lessons$: Observable<Lesson[]>;

    constructor(private learnerService: LearnerService, private router: Router) {}

    ngOnInit() {
        this.lessons$ = this.learnerService.getLessons();
    }

}
