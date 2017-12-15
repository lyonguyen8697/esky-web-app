import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { Question } from '../../models/question.model';

@Component({
    selector: 'app-multi-choice-answer-card',
    templateUrl: 'multi-choice-answer-card.component.html',
    styleUrls: ['multi-choice-answer-card.component.css']
})
export class MultiChoiceAnswerCardComponent implements OnChanges {

    @Input() question: Question;

    @Output() answer = new EventEmitter<string>();

    @Input() isCorrect: boolean;

    currentChoice: string;

    submitted: boolean;

    ngOnChanges(changes: SimpleChanges) {
        if (changes.question || changes.isCorrect.currentValue === null) {
            this.reset();
        }
    }

    reset() {
        this.isCorrect = null;
        this.currentChoice = null;
        this.submitted = false;
    }

    submit(choice: string) {
        this.currentChoice = choice;
        this.submitted = true;
        this.answer.emit(choice);
    }
}
