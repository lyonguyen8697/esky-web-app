import { Component, OnInit, Input } from '@angular/core';

import { SpeechService } from '../../services/speech.service';
import { Question } from '../../models/question.model';

@Component({
    selector: 'app-question-card',
    templateUrl: 'question-card.component.html',
    styleUrls: ['question-card.component.css']
})
export class QuestionCardComponent implements OnInit {

    @Input() question: Question;

    constructor(private speechService: SpeechService) { }

    ngOnInit() {
        this.speak();
    }

    speak() {
        this.speechService.speak(this.question.voice);
    }

    togglePhrase() {
        // this.question.phrase = this.question.phrase ? null : 'How are you';
    }
}
