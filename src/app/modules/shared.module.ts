import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { SpinnerComponentModule } from 'ng2-component-spinner';
import { QuestionCardComponent } from '../components/question-card/question-card.component';
import { MultiChoiceAnswerCardComponent } from '../components/multi-choice-answer-card/multi-choice-answer-card.component';
import { ArrangementAnswerCardComponent } from '../components/arrangement-answer-card/arrangement-answer-card.component';
import { SpeechAnswerCardComponent } from '../components/speech-answer-card/speech-answer-card.component';
import { TypingAnswerCardComponent } from '../components/typing-answer-card/typing-answer-card.component';
import { QuestionsPreviewCardComponent } from '../components/questions-preview-card/questions-preview-card.component';
import { QuestionsTableComponent } from '../components/questions-table/questions-table.component';
import { RankingCardComponent } from '../components/ranking-card/ranking-card.component';
import { UserLevelCardComponent } from '../components/user-level-card/user-level-card.component';
import { ModalComponent } from '../components/modal/modal.component';
import { TooltipComponent } from '../components/tooltip/tooltip.component';
import { ProgressbarComponent } from '../components/progressbar/progressbar.component';

import { LocalStorageService } from '../services/local-storage.service';
import { UserService } from '../services/user.service';
import { LearnerService } from '../services/learner.service';
import { ManagerService } from '../services/manager.service';
import { EncryptService } from '../services/encrypt.service';
import { ModalService } from '../services/modal.service';
import { TooltipService } from '../services/tooltip.service';

import { TrimDirective } from '../directives/trim.directive';

import { FilterPipe } from '../pipes/filter.pipe';
import { AliasPipe } from '../pipes/alias.pipe';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        SpinnerComponentModule
    ],
    declarations: [
        QuestionCardComponent,
        ArrangementAnswerCardComponent,
        MultiChoiceAnswerCardComponent,
        SpeechAnswerCardComponent,
        TypingAnswerCardComponent,
        QuestionsPreviewCardComponent,
        QuestionsTableComponent,
        RankingCardComponent,
        UserLevelCardComponent,
        ModalComponent,
        TooltipComponent,
        ProgressbarComponent,
        TrimDirective,
        FilterPipe,
        AliasPipe
    ],
    exports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        SpinnerComponentModule,
        QuestionCardComponent,
        ArrangementAnswerCardComponent,
        MultiChoiceAnswerCardComponent,
        SpeechAnswerCardComponent,
        TypingAnswerCardComponent,
        QuestionsPreviewCardComponent,
        QuestionsTableComponent,
        RankingCardComponent,
        UserLevelCardComponent,
        ModalComponent,
        TooltipComponent,
        ProgressbarComponent,
        TrimDirective,
        FilterPipe,
        AliasPipe
    ],
    providers: [
        LocalStorageService,
        UserService,
        ModalService,
        TooltipService,
        LearnerService,
        ManagerService,
        EncryptService
    ]
})
export class SharedModule {}
