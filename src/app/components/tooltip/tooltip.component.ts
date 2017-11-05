import { Component, AfterViewInit, Input } from '@angular/core';

import { TooltipService } from '../../services/tooltip.service';

@Component({
    selector: 'app-tooltip',
    templateUrl: 'tooltip.component.html',
    styleUrls: ['tooltip.component.css']
})
export class TooltipComponent implements AfterViewInit {

    @Input() title = '';

    @Input() placement = 'top';

    @Input() isError = true;

    constructor(private tooltipService: TooltipService) {}

    ngAfterViewInit() {
        this.tooltipService.init('.app-tooltip');
    }
}
