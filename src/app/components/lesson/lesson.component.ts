import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

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
        slideInOut('1000ms')
    ]
})

export class LessonComponent implements OnInit {

    questions$: Observable<Question[]>;

    answerType = AnswerType;

    questionIndex = 0;

    test = true;

    constructor(private lessoService: LessonService,
        private audioService: AudioService,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.getQuestions();
    }

    getQuestions() {
        this.questions$ = this.route.paramMap
        .switchMap((params: ParamMap) => {
            const id = params.get('id');
            return this.lessoService.get(id);
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
    }

    wrongAnswer() {
        this.audioService.play(this.audioService.wrong);
    }

    nextQuestion() {
        this.questionIndex++;
    }
}
