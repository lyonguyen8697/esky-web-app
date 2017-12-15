import { NgModule } from '@angular/core';

import { SharedModule } from './shared.module';
import { StudyRoutingModule } from './study-routing.module';

import { StudyPageComponent } from '../components/study-page/study-page.component';
import { LessonComponent } from '../components/lesson/lesson.component';
import { ResultCardComponent } from '../components/result-card/result-card.component';
import { ChallengeComponent } from '../components/challenge/challenge.component';

import { LessonService } from '../services/lesson.service';
import { SpeechService } from '../services/speech.service';
import { AudioService } from '../services/audio.service';
import { ArrangementService } from '../services/arrangement.service';
import { LessonGuard } from '../guards/lesson.guard';
import { LearnerLessonReslover } from '../services/learner-lesson.resolver.service';
import { CanDeactivateGuard } from '../guards/can-deactivate.guard';

@NgModule({
    declarations: [
        StudyPageComponent,
        LessonComponent,
        ResultCardComponent,
        ChallengeComponent
    ],
    imports: [
        SharedModule,
        StudyRoutingModule
    ],
    providers: [
        LessonService,
        SpeechService,
        AudioService,
        ArrangementService,
        LessonGuard,
        LearnerLessonReslover,
        CanDeactivateGuard
    ]
})
export class StudyModule { }
