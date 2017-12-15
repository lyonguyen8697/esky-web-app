import { Component, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';

import { Question } from '../../models/question.model';
import { ArrangementService } from '../../services/arrangement.service';

@Component({
    selector: 'app-arrangement-answer-card',
    templateUrl: 'arrangement-answer-card.component.html',
    styleUrls: ['arrangement-answer-card.component.css']
})
export class ArrangementAnswerCardComponent implements OnChanges {

    @Input() question: Question;

    @Output() answer = new EventEmitter<string>();

    @Input() isCorrect: boolean;

    answerFragments: string[];

    disableSubmit: boolean;

    submitted: boolean;

    resetFlag: boolean;

    constructor(private arrange: ArrangementService) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.question || changes.isCorrect.currentValue === null) {
            this.reset();
        }
    }

    reset() {
        this.answerFragments = [];
        this.isCorrect = null;
        this.disableSubmit = true;
        this.submitted = false;
        this.resetFlag = false;
        this.shuffleChoices();
        setTimeout(() => this.resetFlag = true, 100);
    }

    submit() {
        this.submitted = true;
        this.answer.emit(this.answerFragments.join(';'));
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

    shuffleChoices() {
        for (let i = this.question.choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.question.choices[i], this.question.choices[j]] = [this.question.choices[j], this.question.choices[i]];
        }
    }
}
