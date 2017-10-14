import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { Http, RequestOptions, HttpModule } from '@angular/http';

import { AppRoutingModule } from './modules/app-routing.module';
import { WelcomeModule } from './modules/welcome.module';
import { HomeModule } from './modules/home.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

import { AuthenticationService } from './services/authentication.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { authHttpServiceFactory } from './factories/auth-http.factory';
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
    AppRoutingModule
  ],
  providers: [
    AuthenticationService,
    UserService,
    AuthGuard,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
