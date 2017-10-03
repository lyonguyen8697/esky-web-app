import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-lesson-card',
    templateUrl: 'lesson-card.component.html',
    styleUrls: ['lesson-card.component.css']
})
export class LessonCardComponent {

    @Input() title: string;

    @Input() subtitle: string;

    @Input() content: string;
}
