import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/share';

import { LearnerService } from '../../services/learner.service';
import { LessonService } from '../../services/lesson.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { AudioService } from '../../services/audio.service';
import { animation } from '../../animations/animation';
import { slideInOut } from '../../animations/slide-in-out.animation';
import { Learner } from '../../models/learner.model';
import { Lesson } from '../../models/lesson.model';
import { Question } from '../../models/question.model';
import { AnswerType } from '../../enums/answer-type.enum';
import { Role } from '../../enums/role.emum';

@Component({
    templateUrl: 'lesson.component.html',
    styleUrls: ['lesson.component.css'],
    animations: [
        animation,
        slideInOut({ slideOut: false, timing: '200ms', translate: '15%'}),
        slideInOut({ name: 'slideInOutDelay', slideOut: false, timing: '200ms 50ms', translate: '15%'})
    ]
})
export class LessonComponent implements OnInit {

    lesson: Lesson;

    questions: Question[];

    experience: number;

    answerType = AnswerType;

    questionIndex = 0;

    currentQuestion: Question;

    isCorrect: boolean;

    progressValue = 0;

    nextQuestionDelaying = false;

    nextQuestionDelay = 1000;

    finished = false;

    learner: Learner;

    slideState: string;

    isEditable: boolean;

    constructor(public learnerService: LearnerService,
        private lessonService: LessonService,
        private local: LocalStorageService,
        private audioService: AudioService,
        private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.getQuestions();
        this.isEditable = Role[this.local.getUser().role] > Role.LEARNER;
    }

    canDeactivate() {
        return true;
    }

    getQuestions() {
        this.route.data
        .subscribe(data => {
            this.lesson = data.lesson.lesson;
            this.questions = data.lesson.questions;
            this.questionIndex = 0;
            if (this.lesson.remains.length > 0) {
                this.arrangeQuestion();
                this.questionIndex = this.questions.length - this.lesson.remains.length;
                this.ajustProgressbar();
            }
            this.nextQuestion();
        });
    }

    answer(answer: string) {
        this.nextQuestionDelaying = true;
        this.learnerService.answerQuestion(this.lesson.id, this.currentQuestion.id, answer)
        .subscribe(result => {
            if (result) {
                this.correctAnswer();
            } else {
               this.wrongAnswer();
            }
            setTimeout(() => this.next(), this.nextQuestionDelay);
        });
    }

    correctAnswer() {
        this.audioService.play(this.audioService.correct);
        this.isCorrect = true;
        this.questionIndex++;
        this.ajustProgressbar();
    }

    wrongAnswer() {
        this.audioService.play(this.audioService.wrong);
        this.isCorrect = false;
        const wrongQuestion = this.questions.splice(this.questionIndex, 1)[0];
        this.questions.push(wrongQuestion);
    }

    skipQuestion() {
        if (this.questionIndex < this.questions.length - 1 && !this.nextQuestionDelaying) {
            this.nextQuestionDelaying = true;
            this.learnerService.answerQuestion(this.lesson.id, this.currentQuestion.id, '').subscribe();
            this.wrongAnswer();
            setTimeout(() => this.nextQuestion(), this.nextQuestionDelay);
        }
    }

    next() {
        if (this.questionIndex < this.questions.length) {
            this.nextQuestion();
        } else {
            this.summary();
        }
    }

    nextQuestion() {
        this.nextQuestionDelaying = false;
        this.isCorrect = null;
        this.currentQuestion = this.questions[this.questionIndex];
        this.toggleAnimation();
    }

    summary() {
        this.nextQuestionDelaying = false;
        this.finished = true;
        this.learnerService.get()
        .subscribe(learner => {
            this.learner = learner;
        });
        this.learnerService.getLessonReward(this.lesson.id)
        .subscribe(experience => {
            this.experience = experience;
        });
    }

    gotoLessonCreator() {
        this.router.navigate(['creator', 'lesson', this.lesson.id]);
    }

    gotoQuestionCreator() {
        this.router.navigate(['creator', 'question', this.currentQuestion.id]);
    }

    ajustProgressbar() {
        this.progressValue = this.questionIndex / this.questions.length * 100;
    }

    arrangeQuestion() {
        for (let i = 0; i < this.lesson.remains.length; i++) {
            const id = this.lesson.remains[i];
            const question = this.questions.find(n => n.id === id);
            if (question) {
                this.questions.splice(this.questions.indexOf(question), 1);
                this.questions.push(question);
            } else {
                this.lesson.remains.splice(i, 1);
            }
        }
    }

    getLessonRemains(): string[] {
        const remains = new Array();
        for (let i = this.questionIndex; i < this.questions.length; i++) {
            remains.push(this.questions[i].id);
        }
        return remains;
    }

    toggleAnimation() {
        this.slideState = 'void';
        setTimeout(() => this.slideState = '*', 100);
    }
}
