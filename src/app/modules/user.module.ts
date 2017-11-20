import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from './shared.module';
import { UserRoutingModule } from './user-routing.module';

import { UserInfoComponent } from '../components/user-info/user-info.component';

@NgModule({
    declarations: [
        UserInfoComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        UserRoutingModule
    ]
})
export class UserModule {}
