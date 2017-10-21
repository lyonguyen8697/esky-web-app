import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudyPageComponent } from '../components/study-page/study-page.component';
import { LessonComponent } from '../components/lesson/lesson.component';
import { ChallengeComponent } from '../components/challenge/challenge.component';

import { AuthGuard } from '../guards/auth.guard';
import { LessonGuard } from '../guards/lesson.guard';

const studyRoutes: Routes = [
    {
        path: 'study',
        canActivate: [AuthGuard],
        component: StudyPageComponent,
        children: [
            {
                path: 'lesson/:id',
                canActivate: [LessonGuard],
                component: LessonComponent
            },
            {
                path: 'lesson',
                redirectTo: '/'
            },
            {
                path: 'challenge',
                component: ChallengeComponent
            },
            {
                path: '',
                redirectTo: '/',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(studyRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class StudyRoutingModule { }
