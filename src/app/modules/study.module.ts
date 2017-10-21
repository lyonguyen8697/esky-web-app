import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudyPageComponent } from '../components/study-page/study-page.component';
import { LessonComponent } from '../components/lesson/lesson.component';
import { QuestionCardComponent } from '../components/question-card/question-card.component';
import { MultiChoiceAnswerCardComponent } from '../components/multi-choice-answer-card/multi-choice-answer-card.component';
import { ArrangementAnswerCardComponent } from '../components/arrangement-answer-card/arrangement-answer-card.component';
import { SpeechAnswerCardComponent } from '../components/speech-answer-card/speech-answer-card.component';
import { TypingAnswerCardComponent } from '../components/typing-answer-card/typing-answer-card.component';
import { ChallengeComponent } from '../components/challenge/challenge.component';

import { LessonService } from '../services/lesson.service';
import { SpeechService } from '../services/speech.service';
import { AudioService } from '../services/audio.service';
import { LessonGuard } from '../guards/lesson.guard';

import { StudyRoutingModule } from './study-routing.module';

@NgModule({
    declarations: [
        StudyPageComponent,
        LessonComponent,
        QuestionCardComponent,
        MultiChoiceAnswerCardComponent,
        ArrangementAnswerCardComponent,
        SpeechAnswerCardComponent,
        TypingAnswerCardComponent,
        ChallengeComponent
    ],
    imports: [
        CommonModule,
        StudyRoutingModule
    ],
    providers: [
        LessonService,
        SpeechService,
        AudioService,
        LessonGuard
    ]
})
export class StudyModule { }
