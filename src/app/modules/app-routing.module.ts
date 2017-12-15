import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomePageComponent } from '../components/welcome-page/welcome-page.component';
import { ErrorPageComponent } from '../components/error-page/error-page.component';

import { SignOutGuard } from '../guards/sign-out.guard';

const appRoutes: Routes = [
    {
        path: 'welcome',
        canActivate: [SignOutGuard],
        component: WelcomePageComponent
    },
    {
        path: 'error',
        children: [
            {
                path: ':code',
                component: ErrorPageComponent
            },
            {
                path: '',
                redirectTo: '404',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: false }
        )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}
