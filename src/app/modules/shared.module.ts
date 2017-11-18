import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SpinnerComponentModule } from 'ng2-component-spinner';
import { TooltipComponent } from '../components/tooltip/tooltip.component';
import { ProgressbarComponent } from '../components/progressbar/progressbar.component';

import { UserService } from '../services/user.service';
import { LearnerService } from '../services/learner.service';
import { EncryptService } from '../services/encrypt.service';
import { TooltipService } from '../services/tooltip.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        TooltipComponent,
        ProgressbarComponent
    ],
    exports: [
        CommonModule,
        FormsModule,
        SpinnerComponentModule,
        TooltipComponent,
        ProgressbarComponent
    ],
    providers: [
        UserService,
        TooltipService,
        LearnerService,
        EncryptService
    ]
})
export class SharedModule {}
