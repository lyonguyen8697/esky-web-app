import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './modules/app-routing.module';
import { WelcomeModule } from './modules/welcome.module';
import { HomeModule } from './modules/home.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { AuthenticationService } from './services/authentication.service';
import { AuthGuard } from './guards/auth.guard';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    WelcomeModule,
    HomeModule,
    AppRoutingModule
  ],
  providers: [AuthenticationService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
