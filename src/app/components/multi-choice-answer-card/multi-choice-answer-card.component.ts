import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { Question } from '../../models/question.model';
import { Choice } from '../../models/choice.model';

@Component({
    selector: 'app-multi-choice-answer-card',
    templateUrl: 'multi-choice-answer-card.component.html',
    styleUrls: ['multi-choice-answer-card.component.css']
})
export class MultiChoiceAnswerCardComponent implements OnInit {

    @Input() question: Question;

    @Output() answer = new EventEmitter<boolean>();

    chooser: string;

    constructor() { }

    ngOnInit() { }

    choose(choice: Choice) {
        this.chooser = choice.id;
        if (choice.id === this.question.answer) {
            this.answer.emit(true);
        } else {
            this.answer.emit(false);
        }
    }
}
