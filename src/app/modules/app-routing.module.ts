import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomePageComponent } from '../components/welcome-page/welcome-page.component';
import { PageNotFoundComponent } from '../components/page-not-found/page-not-found.component';

import { SignOutGuard } from '../guards/sign-out.guard';

const appRoutes: Routes = [
    {
        path: 'welcome',
        canActivate: [SignOutGuard],
        component: WelcomePageComponent
    },
    {
        path: '404',
        component: PageNotFoundComponent
    },
    {
        path: '**',
        redirectTo: '404'
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
