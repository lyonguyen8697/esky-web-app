import { NgModule } from '@angular/core';

import { SharedModule } from './shared.module';
import { LibraryRoutingModule } from './library-routing.module';

import { LibraryPageComponent } from '../components/library-page/library-page.component';

@NgModule({
    declarations: [
        LibraryPageComponent
    ],
    imports: [
        SharedModule,
        LibraryRoutingModule
    ]
})
export class LibraryModule { }
