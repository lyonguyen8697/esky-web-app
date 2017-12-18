import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';
import { UserProfilePageComponent } from '../components/user-profile-page/user-profile-page.component';
import { UserResolve } from '../services/user.resolve.service';

const userRoutes: Routes = [
    {
        path: ':username',
        canActivate: [AuthGuard],
        component: UserProfilePageComponent,
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
