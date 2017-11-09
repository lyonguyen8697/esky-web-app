import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudyPageComponent } from '../components/study-page/study-page.component';
import { LessonComponent } from '../components/lesson/lesson.component';
import { ChallengeComponent } from '../components/challenge/challenge.component';

import { AuthGuard } from '../guards/auth.guard';
import { LessonGuard } from '../guards/lesson.guard';
import { LessonReslover } from '../services/lesson.resolver.service';
import { CanDeactivateGuard } from '../guards/can-deactivate.guard';

const studyRoutes: Routes = [
    {
        path: 'study',
        canActivate: [AuthGuard],
        component: StudyPageComponent,
        children: [
            {
                path: 'lesson/:id',
                canDeactivate: [CanDeactivateGuard],
                component: LessonComponent,
                resolve: {
                    lesson: LessonReslover
                }
            },
            {
                path: 'lesson',
                redirectTo: '',
                pathMatch: 'full'
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
