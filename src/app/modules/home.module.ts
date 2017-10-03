import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomePageComponent } from '../components/home-page/home-page.component';
import { LessonBoardComponent } from '../components/lesson-board/lesson-board.component';
import { LessonCardComponent } from '../components/lesson-card/lesson-card.component';

import { HomeRoutingModule } from './home-routing.module';

@NgModule({
    declarations: [
        HomePageComponent,
        LessonBoardComponent,
        LessonCardComponent
    ],
    imports: [
        CommonModule,
        HomeRoutingModule
    ]
})
export class HomeModule { }
