import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SpinnerComponentModule } from 'ng2-component-spinner';
import { TooltipComponent } from '../components/tooltip/tooltip.component';

import { UserService } from '../services/user.service';
import { EncryptService } from '../services/encrypt.service';
import { TooltipService } from '../services/tooltip.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        TooltipComponent
    ],
    exports: [
        CommonModule,
        FormsModule,
        SpinnerComponentModule,
        TooltipComponent
    ],
    providers: [
        TooltipService,
        UserService,
        EncryptService
    ]
})
export class SharedModule {}
