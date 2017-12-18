import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { AudioService } from '../../services/audio.service';
import { LessonService } from '../../services/lesson.service';
import { QuestionService } from '../../services/question.service';
import { User } from '../../models/user.model';
import { Question } from '../../models/question.model';
import { Log } from '../../models/log.model';
import { TimeUtil } from '../../utils/time.util';

@Component({
    selector: 'app-contribute-card',
    templateUrl: 'contribute-card.component.html',
    styleUrls: ['contribute-card.component.css']
})

export class ContributeCardComponent implements OnInit, OnChanges {

    @Input() log: Log;

    @Input() user: User;

    @Input() disabled: boolean;

    @Input() isManager: boolean;

    @Output() accept = new EventEmitter();

    @Output() reject = new EventEmitter();

    questions: Question[];

    timeAgo: string;

    isCorrect: boolean;

    constructor(private router: Router,
        private userService: UserService,
        private local: LocalStorageService,
        private lessonService: LessonService,
        private questionService: QuestionService,
        private audio: AudioService) { }

    ngOnInit() {

    }

    ngOnChanges() {
        if (this.log) {
            this.disabled = false;
            this.timeAgo = TimeUtil.fromNow(this.log.time);
            this.isManager = this.local.getUser().role === 'MANAGER';
            if (this.log.lesson && this.log.method !== 'DELETE') {
                this.lessonService.getLogQuestions(this.log.id)
                    .subscribe(questions => {
                        this.questions = questions;
                    });
            }
        }
    }

    acceptButtonClicked() {
        if (this.isManager && !this.disabled) {
            this.accept.emit({ log: this.log, update: () => this.updateLog() });
        }
    }

    rejectButtonClicked() {
        if (this.isManager && !this.disabled) {
            this.reject.emit({ log: this.log, update: () => this.updateLog() });
        }
    }

    updateLog() {
        if (this.log.lesson) {
            this.lessonService.getLogById(this.log.id)
                .subscribe(log => this.log = log);
        } else {
            this.questionService.getLogById(this.log.id)
                .subscribe(log => this.log = log);
        }
    }

    gotoCreator() {
        if (this.log.lesson) {
            this.gototLessonCreator();
        } else {
            this.gotoQuestionCreator();
        }
    }

    gototLessonCreator() {
        if (this.log.lesson.id) {
            this.router.navigate(['creator', 'lesson', this.log.lesson.id]);
        }
    }

    gotoQuestionCreator() {
        if (this.log.question.id) {
            this.router.navigate(['creator', 'question', this.log.question.id]);
        }
    }
}
