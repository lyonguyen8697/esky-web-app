import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-lesson-progressbar',
    templateUrl: 'lesson-progressbar.component.html',
    styleUrls: ['lesson-progressbar.component.css']
})

export class LessonProgressbarComponent {

    @Input() value = 0;

    @Input() minValue = 0;

    @Input() maxValue = 100;

}
