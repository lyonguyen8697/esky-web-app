import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'app-question-phrase',
    templateUrl: 'question-phrase.component.html',
    styleUrls: ['question-phrase.component.css']
})
export class QuestionPhraseComponent implements OnChanges {

    @Input() phrase: string;

    regex = /([^_]+|_+)/;

    constructor() {
        console.log(this.regex.exec('hello __ every__'));
    }

    ngOnChanges() {

    }
}
