import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule, BrowserXhr } from '@angular/http';

import { AppRoutingModule } from './modules/app-routing.module';
import { AuthenticationModule } from './modules/authentication.module';
import { WelcomeModule } from './modules/welcome.module';
import { UserModule } from './modules/user.module';
import { VerifyModule } from './modules/verify.module';
import { HomeModule } from './modules/home.module';
import { StudyModule } from './modules/study.module';
import { LibraryModule } from './modules/library.module';
import { CreatorModule } from './modules/creator.module';
import { SharedModule } from './modules/shared.module';

import { AppComponent } from './app.component';
import { NgProgressModule, NgProgressBrowserXhr } from 'ngx-progressbar';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';

import { ClickOutsideDirective } from './directives/click-outside.directive';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ErrorPageComponent,
    ClickOutsideDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    NgProgressModule,
    WelcomeModule,
    VerifyModule,
    HomeModule,
    StudyModule,
    LibraryModule,
    CreatorModule,
    AppRoutingModule,
    UserModule,
    AuthenticationModule,
    SharedModule
  ],
  providers: [
    { provide: BrowserXhr, useClass: NgProgressBrowserXhr }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
