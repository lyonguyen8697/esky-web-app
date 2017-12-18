import { Component, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/share';

import { LearnerService } from '../../services/learner.service';
import { QuestionService } from '../../services/question.service';
import { AudioService } from '../../services/audio.service';
import { animation } from '../../animations/animation';
import { slideInOut } from '../../animations/slide-in-out.animation';
import { Question } from '../../models/question.model';
import { AnswerType } from '../../enums/answer-type.enum';
import { element } from 'protractor';

@Component({
    selector: 'app-questions-preview-card',
    templateUrl: 'questions-preview-card.component.html',
    styleUrls: ['questions-preview-card.component.css'],
    animations: [
        animation,
        slideInOut({ slideOut: false, timing: '200ms', translate: '15%' }),
        slideInOut({ name: 'slideInOutDelay', slideOut: false, timing: '200ms 50ms', translate: '15%' })
    ]
})

export class QuestionsPreviewCardComponent implements OnChanges {

    @Input() questions: Question[];

    @Input() processbar = true;

    @Input() editable = true;

    @Input() speechOnInit = true;

    @Input() autoSpeech = true;

    @Input() closeButton = true;

    @Output() closeButtonClick = new EventEmitter();

    autoSpeechCache: boolean;

    arrangment: string[];

    answerType = AnswerType;

    questionIndex = 0;

    currentQuestion: Question;

    isCorrect: boolean;

    progressValue = 0;

    nextQuestionDelaying = false;

    nextQuestionDelay = 1000;

    finished = false;

    slideState: string;

    constructor(private questionService: QuestionService,
                private audioService: AudioService,
                private router: Router) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.questions && this.questions) {
            if (this.questions.length === 1) {
                this.processbar = false;
            }
            this.arrangment = this.buildArrangement(this.questions);
            this.reset();
        }
        if (changes.autoSpeech) {
            this.autoSpeechCache = this.autoSpeech;
        }
    }

    canDeactivate() {
        return true;
    }

    reset() {
        this.questionIndex = 0;
        this.ajustProgressbar();
        this.nextQuestion();
    }

    answer(answer: string) {
        this.nextQuestionDelaying = true;
        if (this.questionService.checkAnswer(this.currentQuestion, answer)) {
            this.correctAnswer();
        } else {
            this.wrongAnswer();
        }
        setTimeout(() => this.next(), this.nextQuestionDelay);
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
        if (!this.speechOnInit && this.autoSpeech && this.questionIndex === 0) {
            this.autoSpeech = false;
        } else {
            this.autoSpeech = this.autoSpeechCache;
        }
        this.nextQuestionDelaying = false;
        this.isCorrect = null;
        this.currentQuestion = this.questions[this.questionIndex];
        this.toggleAnimation();
    }

    summary() {
        this.nextQuestionDelaying = false;
        this.finished = true;
        window.setTimeout(() => {
            this.arrangeQuestion(this.questions, this.arrangment);
            this.reset();
        }, this.nextQuestionDelay);
    }

    gotoQuestionCreator() {
        this.router.navigate(['creator', 'question', this.currentQuestion.id]);
    }

    ajustProgressbar() {
        this.progressValue = this.questionIndex / this.questions.length * 100;
    }

    buildArrangement(questions: Question[]): string[] {
        const arrangement = new Array();
        for (let i = 0; i < questions.length; i++) {
            arrangement.push(questions[i].id);
        }
        return arrangement;
    }

    arrangeQuestion(questions: Question[], arrangement: string[]) {
        for (let i = 0; i < arrangement.length; i++) {
            const id = arrangement[i];
            const question = questions.find(n => n.id === id);
            if (question) {
                questions.splice(questions.indexOf(question), 1);
                questions.push(question);
            } else {
                arrangement.splice(i, 1);
            }
        }
    }

    toggleAnimation() {
        this.slideState = 'void';
        setTimeout(() => this.slideState = '*', 100);
    }

    closeButtonClicked() {
        this.skipQuestion();
        this.closeButtonClick.emit();
    }
}
