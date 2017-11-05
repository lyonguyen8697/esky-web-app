import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifyRoutingModule } from './verify-routing.module';
import { VerifyPageComponent } from '../components/verify-page/verify-page.component';

import { VerifyService } from '../services/verify.service';
import { VerifyGuard } from '../guards/verify.guard';


@NgModule({
    declarations: [
        VerifyPageComponent
    ],
    imports: [
        VerifyRoutingModule,
        CommonModule
    ],
    providers: [
        VerifyService,
        VerifyGuard
    ]
})
export class VerifyModule {}
