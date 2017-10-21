import { Component, OnInit, Input } from '@angular/core';

import { Question } from '../../models/question.model';

@Component({
    selector: 'app-speech-answer-card',
    templateUrl: 'speech-answer-card.component.html'
})

export class SpeechAnswerCardComponent implements OnInit {

    @Input() question: Question;

    constructor() { }

    ngOnInit() { }
}
