import { NgModule } from '@angular/core';

import { SharedModule } from './shared.module';
import { ManageRoutingModule } from './manage-routing.module';

import { ManagePageComponent } from '../components/manage-page/manage-page.component';
import { AccountsManagerComponent } from '../components/accounts-manager/accounts-manager.component';
import { LessonsManagerComponent } from '../components/lessons-manager/lessons-manager.component';
import { QuestionsManagerComponent } from '../components/questions-manager/questions-manager.component';

@NgModule({
    declarations: [
        ManagePageComponent,
        AccountsManagerComponent,
        LessonsManagerComponent,
        QuestionsManagerComponent
    ],
    imports: [
        SharedModule,
        ManageRoutingModule
    ]
})
export class ManageModule { }
