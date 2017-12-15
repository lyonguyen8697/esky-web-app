import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';

import { SpeechService } from '../../services/speech.service';
import { Question } from '../../models/question.model';

@Component({
    selector: 'app-questions-table',
    templateUrl: 'questions-table.component.html',
    styleUrls: ['questions-table.component.css']
})

export class QuestionsTableComponent implements OnInit, OnChanges {

    @Input() questions: Question[];

    @Input() selecteds: Question[] = [];

    @Input() filter: any;

    @Input() selectable = true;

    @Input() height: string;

    @Input() selectedClass = 'bg-success';

    @Input() border = false;

    constructor(private speech: SpeechService) { }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.selectable && !changes.selectable.currentValue) {
            this.selecteds.splice(0, this.selecteds.length);
        }
    }

    speak(event: MouseEvent, voice: string) {
        this.speech.speak(voice);
        event.stopPropagation();
    }

    rowClicked(question: Question) {
        if (!this.selectable) {
            return;
        }
        if (this.isSelected(question)) {
            this.deselect(question);
        } else {
            this.select(question);
        }
    }

    select(question: Question) {
        this.selecteds.push(question);
    }

    deselect(question: Question) {
        this.selecteds.splice(this.selecteds.indexOf(question), 1);
    }

    isSelected(question: Question): boolean {
        return this.selecteds.includes(question);
    }
}
