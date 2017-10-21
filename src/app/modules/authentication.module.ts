import { NgModule } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';

import { AuthenticationService } from '../services/authentication.service';
import { AuthGuard } from '../guards/auth.guard';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { authHttpServiceFactory } from '../factories/auth-http.factory';

@NgModule({
    providers: [
        AuthenticationService,
        AuthGuard,
        {
          provide: AuthHttp,
          useFactory: authHttpServiceFactory,
          deps: [Http, RequestOptions]
        }
      ]
})
export class AuthenticationModule { }
