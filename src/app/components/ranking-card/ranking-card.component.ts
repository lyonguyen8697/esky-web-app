import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { LearnerService } from '../../services/learner.service';
import { User } from '../../models/user.model';
import { Learner } from '../../models/learner.model';

@Component({
    selector: 'app-ranking-card',
    templateUrl: 'ranking-card.component.html',
    styleUrls: ['ranking-card.component.css']
})

export class RankingCardComponent implements OnInit, OnChanges {

    @Input() user: User;

    ranking: User[];

    userRank: number;

    constructor(private learnerService: LearnerService) { }

    ngOnInit() {
        this.learnerService.getRanking()
            .subscribe(ranking => {
                this.ranking = ranking;
            });
    }

    ngOnChanges() {
        if (this.user) {
            this.learnerService.getRank(this.user.id)
                .subscribe(res => {
                    this.userRank = res.rank;
                });
        }
    }
}
