import { NgModule } from '@angular/core';
import { XHRBackend, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { AuthGuard } from '../guards/auth.guard';
import { SignOutGuard } from '../guards/sign-out.guard';
import { AuthenticationHttp } from '../services/authentication-http.service';
import { authenticationHttpFactory } from '../factories/auth-http.factory';

@NgModule({
    providers: [
        AuthenticationService,
        AuthGuard,
        SignOutGuard,
        {
          provide: AuthenticationHttp,
          useFactory: authenticationHttpFactory,
          deps: [XHRBackend, RequestOptions, Router, AuthenticationService]
        }
      ]
})
export class AuthenticationModule { }
