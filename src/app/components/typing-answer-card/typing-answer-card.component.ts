import { Component, OnInit, Input } from '@angular/core';

import { Question } from '../../models/question.model';

@Component({
    selector: 'app-typing-answer-card',
    templateUrl: 'typing-answer-card.component.html',
    styleUrls: ['typing-answer-card.component.css']
})

export class TypingAnswerCardComponent implements OnInit {

    @Input() question: Question;

    constructor() { }

    ngOnInit() { }
}
