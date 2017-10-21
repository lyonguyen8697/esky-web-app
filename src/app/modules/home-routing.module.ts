import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from '../components/home-page/home-page.component';
import { LessonBoardComponent } from '../components/lesson-board/lesson-board.component';

import { AuthGuard } from '../guards/auth.guard';

const homeRoutes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: HomePageComponent,
        pathMatch: 'full',
        children: [
            {
                path: '',
                component: LessonBoardComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(homeRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class HomeRoutingModule { }
