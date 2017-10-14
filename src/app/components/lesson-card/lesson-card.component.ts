import { Component, Input } from '@angular/core';

import { Lesson } from '../../models/lesson.model';

@Component({
    selector: 'app-lesson-card',
    templateUrl: 'lesson-card.component.html',
    styleUrls: ['lesson-card.component.css']
})
export class LessonCardComponent {

    @Input() lesson: Lesson;

}
