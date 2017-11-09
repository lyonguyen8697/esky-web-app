import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { Question } from '../../models/question.model';

@Component({
    selector: 'app-multi-choice-answer-card',
    templateUrl: 'multi-choice-answer-card.component.html',
    styleUrls: ['multi-choice-answer-card.component.css']
})
export class MultiChoiceAnswerCardComponent implements OnChanges {

    @Input() question: Question;

    @Output() answer = new EventEmitter<boolean>();

    chooser: string;

    ngOnChanges() {
        this.chooser = null;
    }

    submit(choiceIndex: string) {
        this.chooser = choiceIndex;
        if (this.checkAnswer(this.chooser)) {
            this.answer.emit(true);
        } else {
            this.answer.emit(false);
        }
    }

    checkAnswer(answer: string): boolean {
        return this.question.answers.includes(answer);
    }
}
