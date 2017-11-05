import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Lesson } from '../../models/lesson.model';
import { UserService } from '../../services/user.service';

@Component({
    templateUrl: 'lesson-board.component.html',
    styleUrls: ['lesson-board.component.css'],
})
export class LessonBoardComponent implements OnInit {

    lessons$: Observable<Lesson[]>;

    constructor(private userService: UserService, private router: Router) {}

    ngOnInit() {
        this.lessons$ = this.userService.getLessons();
    }

}
