import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/share';

import { LessonService } from '../../services/lesson.service';
import { AudioService } from '../../services/audio.service';
import { animation } from '../../animations/animation';
import { slideInOut } from '../../animations/slide-in-out.animation';
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

    questions: Question[];

    answerType = AnswerType;

    questionIndex = 0;

    numberOfQuestions = 0;

    progressValue = 0;

    constructor(private lessonService: LessonService,
        private audioService: AudioService,
        private route: ActivatedRoute) { }

    ngOnInit() {
        setTimeout(() => this.getQuestions(), 2000);
        // this.getQuestions();
    }

    getQuestions() {
        this.route.paramMap
        .switchMap((params: ParamMap) => {
            const id = params.get('id');
            return this.lessonService.get(id);
        }).subscribe(questions => {
            this.questions = questions;
            this.numberOfQuestions = questions.length;
        });
    }

    answer(event) {
        if (event) {
            this.correctAnswer();
        } else {
           this.wrongAnswer();
        }
        setTimeout(() => this.nextQuestion(), 1000);
    }

    correctAnswer() {
        this.audioService.play(this.audioService.correct);
        this.ajustProgressbar();
    }

    wrongAnswer() {
        this.audioService.play(this.audioService.wrong);
        this.questions.push(this.questions[this.questionIndex]);
    }

    nextQuestion() {
        this.questionIndex++;
    }

    ajustProgressbar() {
        this.progressValue += 100 / this.numberOfQuestions;
    }
}
