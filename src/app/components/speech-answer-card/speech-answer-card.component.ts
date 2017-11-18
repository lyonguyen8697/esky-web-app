import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';

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

    @Input() isCorrect: boolean;

    @Output() answer = new EventEmitter<string>();

    textRecognized: string;

    recognizing: boolean;

    submitted: boolean;

    submitTimeOutId: number;

    recognizeTime = 5000;

    constructor(private speech: SpeechService) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.question || changes.isCorrect.currentValue === null) {
            this.reset();
        }
    }

    reset() {
        this.speech.stopRecognize();
        this.textRecognized = '';
        this.recognizing = false;
        this.submitted = false;
    }

    recognize() {
        this.recognizing = true;
        const words = this.isWord(this.question.phrase) ? this.question.phrase : undefined;
        this.speech.recognize([words])
        .subscribe(
            result => {
                if (!this.submitted) {
                    if (words) {
                        this.textRecognized = this.filterWords(result);
                    } else {
                        this.textRecognized = result;
                    }
                    this.submit();
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
        this.answer.emit(this.textRecognized);
    }

    isWord(s: string): boolean {
        return /^\w+$/g.test(s);
    }

    filterWords(s: string) {
        return s.match(/(\w+)/g).pop();
    }
}
