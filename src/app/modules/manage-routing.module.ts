import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManagePageComponent } from '../components/manage-page/manage-page.component';
import { AccountsManagerComponent } from '../components/accounts-manager/accounts-manager.component';
import { LessonsManagerComponent } from '../components/lessons-manager/lessons-manager.component';
import { QuestionsManagerComponent } from '../components/questions-manager/questions-manager.component';

import { AuthGuard } from '../guards/auth.guard';
import { Role } from '../enums/role.emum';

const manageRoutes: Routes = [
    {
        path: 'manage',
        canActivate: [AuthGuard],
        data: {
            role: Role.MANAGER
        },
        component: ManagePageComponent,
        children: [
            {
                path: 'accounts',
                component: AccountsManagerComponent
            },
            {
                path: 'lessons',
                component: LessonsManagerComponent
            },
            {
                path: 'questions',
                component: QuestionsManagerComponent
            },
            {
                path: '',
                redirectTo: 'accounts',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(manageRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class ManageRoutingModule { }
