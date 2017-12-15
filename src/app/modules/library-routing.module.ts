import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LibraryPageComponent } from '../components/library-page/library-page.component';
import { QuestionsTableComponent } from '../components/questions-table/questions-table.component';

import { AuthGuard } from '../guards/auth.guard';

const libraryRoutes: Routes = [
    {
        path: 'library',
        canActivate: [AuthGuard],
        component: LibraryPageComponent,
        /*children: [
            {
                path: 'questions',
                component: QuestionsTableComponent
            }
        ]*/
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(libraryRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class LibraryRoutingModule { }
