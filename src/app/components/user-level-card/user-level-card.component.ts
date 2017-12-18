import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { LearnerService } from '../../services/learner.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { Learner } from '../../models/learner.model';
import { User } from '../../models/user.model';

declare var $: any;

@Component({
    selector: 'app-user-level-card',
    templateUrl: 'user-level-card.component.html',
    styleUrls: ['user-level-card.component.css']
})
export class UserLevelCardComponent implements OnInit, OnChanges {

    @Input() user: User;

    learner: Learner;

    levelCircle: any;

    circleStartValue: number;

    currentLevelExperience: number;

    currentLevelExperienceRequired: number;

    level: number;

    constructor(private learnerService: LearnerService,
    ) { }

    ngOnInit() {

    }

    ngOnChanges() {
        if (this.user) {
            this.learnerService.getById(this.user.id)
                .subscribe(learner => {
                    this.learner = learner;
                    this.level = this.learner.level;
                    this.currentLevelExperience = Math.floor(this.learner.currentLevelExperience);
                    this.currentLevelExperienceRequired = Math.floor(this.learner.currentLevelExperienceRequired);
                    this.circleStartValue = this.currentLevelExperience / this.currentLevelExperienceRequired;
                    this.levelCircle = this.createLevelCircle('.level-circle', this.circleStartValue);
                });
        }
    }

    createLevelCircle(selector: string, value: number): any {
        return $(selector).circleProgress({
            startAngle: -Math.PI / 2,
            size: 120,
            value: value,
            lineCap: 'round',
            animation: { duration: 300 }
        });
    }
}
