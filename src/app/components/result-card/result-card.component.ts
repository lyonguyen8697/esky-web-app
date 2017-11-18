import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AudioService } from '../../services/audio.service';
import { slideInOut } from '../../animations/slide-in-out.animation';
import { Learner } from '../../models/learner.model';
import { LevelInfo } from '../../models/level-info.model';

declare var $: any;

@Component({
    selector: 'app-result-card',
    templateUrl: 'result-card.component.html',
    styleUrls: ['result-card.component.css'],
    animations: [
        slideInOut({ timing: '800ms ease-out', translate: '300%'})
    ]
})
export class ResultCardComponent implements OnChanges {

    @Input() experienceBonus: number;

    @Input() learner: Learner;

    levelCircle: any;

    circleStartValue: number;

    level: number;

    constructor(private audio: AudioService,
                private router: Router) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.learner && this.learner) {
            this.playWinSound();
            this.level = this.learner.level;
            this.circleStartValue = this.calculateValue();
            this.levelCircle = this.createLevelCircle('.level-circle', this.circleStartValue);
        }
        if (changes.experienceBonus && this.experienceBonus) {
            this.countExperience(() => this.bonusExperience());
        }
    }

    countExperience(handler?: Function) {
        const temp = this.experienceBonus;
        this.experienceBonus = 0;
        const interval = window.setInterval(() => {
            if (this.experienceBonus < temp) {
                this.experienceBonus++;
            } else {
                window.clearInterval(interval);
                if (handler) {
                    handler();
                }
            }
        }, 10);
    }

    bonusExperience() {
        this.learner.experience += this.experienceBonus;
        let n;
        if ((n = this.learner.level - this.level) > 0) {
            this.levelUp(n, () => {
                this.animateCircle(0, this.calculateValue());
            });
        } else {
            this.animateCircle(this.circleStartValue, this.calculateValue());
        }
    }

    levelUp(n: number, handler?: Function, count = 0) {
        this.animateCircle(this.circleStartValue, 1, () => {
            this.playLevelUpSound();
            this.level++;
            this.circleStartValue = 0;
            count++;
            if (n > count) {
                this.levelUp(n, handler, count);
            } else if (handler) {
                handler();
            }
        });
    }

    createLevelCircle(selector: string, value: number): any {
        return $(selector).circleProgress({
            startAngle: -Math.PI / 2,
            size: 120,
            value: value,
            lineCap: 'round',
            animation: { duration: 300}
        });
    }

    animateCircle(startValue: number, value: number, handler?: Function) {
        this.levelCircle.circleProgress({
            value: value,
            animation: { duration: 1000 },
            animationStartValue: startValue
        }).one('circle-animation-end', () => {
            if (handler) {
                handler();
            }
        });
    }

    calculateValue(): number {
        return this.learner.currentLevelExperience / this.learner.currentLevelExperienceRequired;
    }

    playWinSound() {
        this.audio.play(this.audio.win);
    }

    playLevelUpSound() {
        this.audio.play(this.audio.ding);
    }

    continue() {
        this.router.navigate(['']);
    }
}
