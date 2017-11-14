import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-progressbar',
    templateUrl: 'progressbar.component.html',
    styleUrls: ['progressbar.component.css']
})

export class ProgressbarComponent {

    @Input() value = 0;

    @Input() minValue = 0;

    @Input() maxValue = 100;

    @Input() height = '1rem';

    @Input() backgroundClass = 'bg-primary';

    @Input() animated = false;

    @Input() striped = false;

}
