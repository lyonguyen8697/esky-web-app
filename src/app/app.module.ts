import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './modules/app-routing.module';
import { AuthenticationModule } from './modules/authentication.module';
import { WelcomeModule } from './modules/welcome.module';
import { HomeModule } from './modules/home.module';
import { StudyModule } from './modules/study.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    WelcomeModule,
    HomeModule,
    StudyModule,
    AppRoutingModule,
    AuthenticationModule
  ],
  providers: [
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
