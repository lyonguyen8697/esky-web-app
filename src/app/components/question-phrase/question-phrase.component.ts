import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-question-phrase',
    templateUrl: 'question-phrase.component.html',
    styleUrls: ['question-phrase.component.css']
})
export class QuestionPhraseComponent {

    @Input() phrase: string;

    regex = /([^_]+|_+)/;

    constructor() {
        console.log(this.regex.exec('hello __ every__'));
    }

}
