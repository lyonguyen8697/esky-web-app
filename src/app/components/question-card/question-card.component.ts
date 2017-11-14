import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { SpeechService } from '../../services/speech.service';
import { Question } from '../../models/question.model';

@Component({
    selector: 'app-question-card',
    templateUrl: 'question-card.component.html',
    styleUrls: ['question-card.component.css']
})
export class QuestionCardComponent implements OnChanges {

    @Input() question: Question;

    @Output() skip = new EventEmitter();

    constructor(private speechService: SpeechService) { }

    ngOnChanges() {
        this.speechService.cancelSpeak();
        setTimeout(() => this.speak(), 200);
    }

    speak() {
        if (this.question.voice) {
            this.speechService.speak(this.question.voice);
        }
    }

    togglePhrase() {
        // this.question.phrase = this.question.phrase ? null : 'How are you';
    }

    skipQuestion() {
        this.skip.emit();
    }
}
