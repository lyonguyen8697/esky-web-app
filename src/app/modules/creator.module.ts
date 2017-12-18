import { NgModule } from '@angular/core';

import { CreatorPageComponent } from '../components/creator-page/creator-page.component';
import { CreatorCentralComponent } from '../components/creator-central/creator-central.component';
import { LessonCreatorComponent } from '../components/lesson-creator/lesson-creator.component';
import { QuestionCreatorComponent } from '../components/question-creator/question-creator.component';

import { SharedModule } from './shared.module';
import { CreatorRoutingModule } from './creator-routing.module';

import { ContributorService } from '../services/contributor.service';
import { QuestionService } from '../services/question.service';
import { QuestionCreateValidatorService } from '../services/question-create-validator.service';
import { ContributeCardComponent } from '../components/contribute-card/contribute-card.component';

@NgModule({
    declarations: [
        CreatorPageComponent,
        CreatorCentralComponent,
        LessonCreatorComponent,
        QuestionCreatorComponent,
        ContributeCardComponent
    ],
    imports: [
        SharedModule,
        CreatorRoutingModule
    ],
    providers: [
        ContributorService,
        QuestionService,
        QuestionCreateValidatorService
    ]
})
export class CreatorModule {}
