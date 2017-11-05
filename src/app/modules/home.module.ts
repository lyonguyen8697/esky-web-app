import { NgModule } from '@angular/core';

import { HomePageComponent } from '../components/home-page/home-page.component';
import { LessonBoardComponent } from '../components/lesson-board/lesson-board.component';
import { LessonCardComponent } from '../components/lesson-card/lesson-card.component';
import { AuthenticationService } from '../services/authentication.service';
import { AuthGuard } from '../guards/auth.guard';

import { SharedModule } from './shared.module';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
    declarations: [
        HomePageComponent,
        LessonBoardComponent,
        LessonCardComponent
    ],
    imports: [
        SharedModule,
        HomeRoutingModule
    ]
})
export class HomeModule { }
