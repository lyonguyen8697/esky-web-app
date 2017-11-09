import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { SpeechService } from '../../services/speech.service';
import { Question } from '../../models/question.model';

@Component({
    selector: 'app-speech-answer-card',
    templateUrl: 'speech-answer-card.component.html',
    styleUrls: ['speech-answer-card.component.css']
})

export class SpeechAnswerCardComponent implements OnChanges {

    @Input() question: Question;

    @Output() answer = new EventEmitter<boolean>();

    textRecognized: string;

    recognizing: boolean;

    isCorrect: boolean;

    submitted: boolean;

    submitTimeOutId: number;

    recognizeTime = 5000;

    constructor(private speech: SpeechService) { }

    ngOnChanges() {
        this.reset();
    }

    reset() {
        this.textRecognized = '';
        this.recognizing = false;
        this.isCorrect = false;
        this.submitted = false;
    }

    recognize() {
        this.recognizing = true;
        const words = this.isWord(this.question.answers[0]) ? this.question.answers : undefined;
        this.speech.recognize(words)
        .subscribe(
            result => {
                if (!this.submitted) {
                    if (words) {
                        this.textRecognized = this.filterWords(result);
                    } else {
                        this.textRecognized = result;
                    }
                    if (this.checkAnswer(this.textRecognized)) {
                        this.submit();
                    }
                }
            },
            error => {
                this.submit();
            },
            () => {
                if (!this.submitted) {
                    this.submit();
                }
            }
        );
        this.submitTimeOutId = window.setTimeout(() => {
            if (!this.submitted) {
                this.submit();
            }
        }, this.recognizeTime);
    }

    submit() {
        window.clearTimeout(this.submitTimeOutId);
        this.speech.stopRecognize();
        this.recognizing = false;
        this.submitted = true;
        if (this.checkAnswer(this.textRecognized)) {
            this.isCorrect = true;
            this.answer.emit(true);
        } else {
            this.isCorrect = false;
            this.answer.emit(false);
        }
    }

    isWord(s: string): boolean {
        return /^\w+$/g.test(s);
    }

    filterWords(s: string) {
        return s.match(/(\w+)/g).pop();
    }

    checkAnswer(answer: string): boolean {
        return this.question.answers.includes(answer);
    }
}
