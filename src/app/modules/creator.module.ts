import { NgModule } from '@angular/core';

import { CreatorPageComponent } from '../components/creator-page/creator-page.component';
import { LessonCreatorComponent } from '../components/lesson-creator/lesson-creator.component';
import { QuestionCreatorComponent } from '../components/question-creator/question-creator.component';

import { SharedModule } from './shared.module';
import { CreatorRoutingModule } from './creator-routing.module';

import { ContributorService } from '../services/contributor.service';
import { QuestionService } from '../services/question.service';
import { QuestionCreateValidatorService } from '../services/question-create-validator.service';

@NgModule({
    declarations: [
        CreatorPageComponent,
        LessonCreatorComponent,
        QuestionCreatorComponent
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
