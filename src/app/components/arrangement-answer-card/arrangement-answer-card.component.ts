import { Component, OnInit, Input } from '@angular/core';

import { Question } from '../../models/question.model';

@Component({
    selector: 'app-arrangement-answer-card',
    templateUrl: 'arrangement-answer-card.component.html',
    styleUrls: ['arrangement-answer-card.component.css']
})

export class ArrangementAnswerCardComponent implements OnInit {

    @Input() question: Question;

    constructor() { }

    ngOnInit() { }
}
