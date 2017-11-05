import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from './shared.module';

import { WelcomePageComponent } from '../components/welcome-page/welcome-page.component';
import { SignComponent } from '../components/sign/sign.component';

import { SignUpService } from '../services/sign-up.service';
import { SignUpValidatorService } from '../services/sign-up-validator.service';
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
        SignUpService,
        SignUpValidatorService,
        EncryptService
    ]
})
export class WelcomeModule { }
