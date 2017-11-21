import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { SpinnerComponentModule } from 'ng2-component-spinner';
import { ModalComponent } from '../components/modal/modal.component';
import { TooltipComponent } from '../components/tooltip/tooltip.component';
import { ProgressbarComponent } from '../components/progressbar/progressbar.component';

import { LocalStorageService } from '../services/local-storage.service';
import { UserService } from '../services/user.service';
import { LearnerService } from '../services/learner.service';
import { EncryptService } from '../services/encrypt.service';
import { ModalService } from '../services/modal.service';
import { TooltipService } from '../services/tooltip.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ModalComponent,
        TooltipComponent,
        ProgressbarComponent
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SpinnerComponentModule,
        ModalComponent,
        TooltipComponent,
        ProgressbarComponent
    ],
    providers: [
        LocalStorageService,
        UserService,
        ModalService,
        TooltipService,
        LearnerService,
        EncryptService
    ]
})
export class SharedModule {}
