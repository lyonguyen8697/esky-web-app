import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WelcomePageComponent } from '../components/welcome-page/welcome-page.component';
import { SignComponent } from '../components/sign/sign.component';

@NgModule({
    declarations: [
        WelcomePageComponent,
        SignComponent
    ],
    imports: [
        CommonModule
    ]
})
export class WelcomeModule { }
