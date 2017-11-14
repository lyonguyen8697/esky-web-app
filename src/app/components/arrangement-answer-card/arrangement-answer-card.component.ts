import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { Question } from '../../models/question.model';
import { ArrangementService } from '../../services/arrangement.service';

@Component({
    selector: 'app-arrangement-answer-card',
    templateUrl: 'arrangement-answer-card.component.html',
    styleUrls: ['arrangement-answer-card.component.css']
})
export class ArrangementAnswerCardComponent implements OnChanges {

    @Input() question: Question;

    @Output() answer = new EventEmitter<boolean>();

    answerFragments: string[];

    disableSubmit: boolean;

    submitted: boolean;

    isCorrect: boolean;

    constructor(private arrange: ArrangementService) { }

    ngOnChanges() {
        this.answerFragments = [];
        this.disableSubmit = true;
        this.submitted = false;
        this.isCorrect = false;
    }

    submit() {
        this.submitted = true;
        if (this.checkAnswer(this.answerFragments)) {
            this.isCorrect = true;
            this.answer.emit(true);
        } else {
            this.isCorrect = false;
            this.answer.emit(false);
        }
    }

    append(selector: string) {
        this.arrange.moveElementTo(selector, '.choice-fragments', '.answer-fragments', 200, () => {
            this.updateAnswer();
        });
    }

    discard(selector: string) {
        this.arrange.moveElementTo(selector, '.answer-fragments', '.choice-fragments', 200, () => {
            this.updateAnswer();
        });
    }

    updateAnswer() {
        this.answerFragments = this.arrange.getFragments('.answer-fragments');
        if (this.answerFragments.length > 0) {
            this.disableSubmit = false;
        } else {
            this.disableSubmit = true;
        }
    }

    checkAnswer(answer: string[]): boolean {
        return this.question.answers.every((value, index) => value === answer[index]);
    }
}
