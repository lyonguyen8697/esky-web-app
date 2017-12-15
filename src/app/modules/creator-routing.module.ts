import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreatorPageComponent } from '../components/creator-page/creator-page.component';
import { LessonCreatorComponent } from '../components/lesson-creator/lesson-creator.component';
import { QuestionCreatorComponent } from '../components/question-creator/question-creator.component';

import { AuthGuard } from '../guards/auth.guard';
import { LessonReslover } from '../services/lesson.resolver.service';
import { QuestionResolver } from '../services/question.resolver';
import { Role } from '../enums/role.emum';

const creatorRoutes: Routes = [
    {
        path: 'creator',
        canActivate: [AuthGuard],
        data: {
            role: Role.CONTRIBUTOR
        },
        component: CreatorPageComponent,
        children: [
            {
                path: 'lesson',
                component: LessonCreatorComponent
            },
            {
                path: 'lesson/:id',
                component: LessonCreatorComponent,
                resolve: {
                    lesson: LessonReslover
                }
            },
            {
                path: 'question',
                component: QuestionCreatorComponent
            },
            {
                path: 'question/:id',
                component: QuestionCreatorComponent,
                resolve: {
                    question: QuestionResolver
                }
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
        RouterModule.forChild(creatorRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        LessonReslover,
        QuestionResolver
    ]
})
export class CreatorRoutingModule { }
