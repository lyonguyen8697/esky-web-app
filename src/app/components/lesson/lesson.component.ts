import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/share';

import { LearnerService } from '../../services/learner.service';
import { LessonService } from '../../services/lesson.service';
import { AudioService } from '../../services/audio.service';
import { animation } from '../../animations/animation';
import { slideInOut } from '../../animations/slide-in-out.animation';
import { Lesson } from '../../models/lesson.model';
import { Question } from '../../models/question.model';
import { AnswerType } from '../../enums/answer-type.enum';

@Component({
    templateUrl: 'lesson.component.html',
    styleUrls: ['lesson.component.css'],
    animations: [
        animation,
        slideInOut('200ms', false, '5%', 0)
    ]
})

export class LessonComponent implements OnInit {

    lesson: Lesson;

    questions: Question[];

    answerType = AnswerType;

    questionIndex = 0;

    currentQuestion: Question;

    progressValue = 0;

    nextQuestionDelaying = false;

    nextQuestionDelay = 1000;

    constructor(private learnerService: LearnerService,
        private lessonService: LessonService,
        private audioService: AudioService,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.getQuestions();
    }

    canDeactivate() {
        this.updateLessonProgress();
        return true;
    }

    updateLessonProgress() {
        this.learnerService.updateLessonProgress(this.lesson.id, this.progressValue, this.getLessonRemains())
        .subscribe();
    }

    getQuestions() {
        this.route.data
        .subscribe(data => {
            this.lesson = data.lesson.lesson;
            this.questions = data.lesson.questions;
            this.questionIndex = 0;
            if (this.lesson.remains) {
                this.arrangeQuestion();
                this.questionIndex = this.questions.length - this.lesson.remains.length;
                this.ajustProgressbar();
            }
            this.nextQuestion();
        });
    }

    answer(event) {
        this.nextQuestionDelaying = true;
        if (event) {
            this.correctAnswer();
        } else {
           this.wrongAnswer();
        }
        setTimeout(() => this.nextQuestion(), this.nextQuestionDelay);
    }

    correctAnswer() {
        this.audioService.play(this.audioService.correct);
        this.questionIndex++;
        this.ajustProgressbar();
    }

    wrongAnswer() {
        this.audioService.play(this.audioService.wrong);
        const wrongQuestion = this.questions.splice(this.questionIndex, 1)[0];
        this.questions.push(wrongQuestion);
    }

    skipQuestion() {
        if (this.questionIndex < this.questions.length - 1 && !this.nextQuestionDelaying) {
            this.nextQuestionDelaying = true;
            this.wrongAnswer();
            setTimeout(() => this.nextQuestion(), this.nextQuestionDelay);
        }
    }

    nextQuestion() {
        this.currentQuestion = this.questions[this.questionIndex];
        this.nextQuestionDelaying = false;
    }

    ajustProgressbar() {
        this.progressValue = this.questionIndex / this.questions.length * 100;
    }

    arrangeQuestion() {
        this.lesson.remains.forEach(id => {
            const question = this.questions.find(n => n.id === id);
            this.questions.splice(this.questions.indexOf(question), 1);
            this.questions.push(question);
        });
    }

    getLessonRemains(): string[] {
        const remains = new Array();
        for (let i = this.questionIndex; i < this.questions.length; i++) {
            remains.push(this.questions[i].id);
        }
        return remains;
    }
}
