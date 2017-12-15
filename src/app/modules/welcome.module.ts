import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from './shared.module';

import { WelcomePageComponent } from '../components/welcome-page/welcome-page.component';
import { SignComponent } from '../components/sign/sign.component';

import { UserInfoValidatorService } from '../services/user-info-validator.service';
import { EncryptService } from '../services/encrypt.service';

@NgModule({
    declarations: [
        WelcomePageComponent,
        SignComponent
    ],
    imports: [
        SharedModule
    ],
    providers: [
        UserInfoValidatorService,
        EncryptService
    ]
})
export class WelcomeModule { }
