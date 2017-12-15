import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';
import { UserInfoComponent } from '../components/user-info/user-info.component';
import { UserResolve } from '../services/user.resolve.service';

const userRoutes: Routes = [
    {
        path: ':username',
        canActivate: [AuthGuard],
        component: UserInfoComponent,
        resolve: {
            user: UserResolve
        },
    },
    {
        path: '**',
        redirectTo: 'error/404'
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(userRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        UserResolve
    ]
})
export class UserRoutingModule {}
