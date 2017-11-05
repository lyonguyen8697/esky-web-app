import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VerifyPageComponent } from '../components/verify-page/verify-page.component';
import { VerifyResolve } from '../services/verify.resolve.service';
import { VerifyGuard } from '../guards/verify.guard';

const verifyRoutes: Routes = [
    {
        path: 'verify',
        canActivate: [VerifyGuard],
        component: VerifyPageComponent
    },
    {
        path: 'verify/:token',
        canActivate: [VerifyGuard],
        component: VerifyPageComponent,
        resolve: {
            response: VerifyResolve
        }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(verifyRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        VerifyResolve
    ]
})
export class VerifyRoutingModule {}
