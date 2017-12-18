import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from './shared.module';
import { UserRoutingModule } from './user-routing.module';

import { UserProfilePageComponent } from '../components/user-profile-page/user-profile-page.component';
import { UserInfoComponent } from '../components/user-info/user-info.component';

@NgModule({
    declarations: [
        UserInfoComponent,
        UserProfilePageComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        UserRoutingModule
    ]
})
export class UserModule {}
