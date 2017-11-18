import { LevelInfo } from './level-info.model';

export class Learner {
    id: string;
    trophy: number;
    experience: number;
    wordsRecord: number;
    questionsAnswered: number;
    lessonsPassed: number;
    challengeTimes: number;
    topChallenge: number;
    levelInfo: LevelInfo;

    constructor(learner: any) {
        this.from(learner);
    }

    from(learner: any) {
        this.id = learner.id;
        this.trophy = learner.trophy;
        this.experience = learner.experience;
        this.wordsRecord = learner.wordsRecord;
        this.questionsAnswered = learner.questionsAnswered;
        this.lessonsPassed = learner.lessonsPassed;
        this.challengeTimes = learner.challengeTimes;
        this.topChallenge = learner.topChallenge;
    }

    get level(): number {
        return this.levelInfo ? this.calculateLevel(this.experience, this.levelInfo.seed, this.levelInfo.factor) + 1 : 1;
    }

    get currentLevelExperienceRequired(): number {
        return this.levelInfo ? this.calculateLevelExperienceRequired(this.level, 1, this.levelInfo.seed, this.levelInfo.factor) : 0;
    }

    get currentLevelExperience(): number {
        return this.levelInfo ? this.calculateLevelExperience(this.experience, this.levelInfo.seed, this.levelInfo.factor) : 0;
    }

    calculateLevel(experience: number, levelExperience: number, levelFactor: number): number {
        if ((experience = experience - levelExperience * levelFactor) > 0) {
            return 1 + this.calculateLevel(experience, levelExperience * levelFactor, levelFactor);
        }
        return 0;
    }

    calculateLevelExperienceRequired(level: number, pivot: number, levelExperience: number, levelFactor: number): number {
        if (pivot === level) {
            return levelExperience * levelFactor;
        }
        return this.calculateLevelExperienceRequired(level, ++pivot, levelExperience * levelFactor, levelFactor);
    }

    calculateLevelExperience(experience: number, levelExperience: number, levelFactor: number): number {
        experience = experience - levelExperience * levelFactor;
        if (experience > 0) {
            return this.calculateLevelExperience(experience, levelExperience * levelFactor, levelFactor);
        }
        return experience + levelExperience * levelFactor;
    }

}
