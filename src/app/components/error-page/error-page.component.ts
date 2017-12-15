import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'error-page.component.html'
})

export class ErrorPageComponent implements OnInit {

    code = 404;

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.paramMap
            .subscribe(param => {
                this.code = +param.get('code');
            });
    }
}
