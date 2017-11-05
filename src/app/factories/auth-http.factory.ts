import { XHRBackend, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { AuthenticationHttp } from '../services/authentication-http.service';
import { AuthenticationService } from '../services/authentication.service';

function authenticationHttpFactory(
  backend: XHRBackend,
  options: RequestOptions,
  router: Router,
  authService: AuthenticationService
) {
    return new AuthenticationHttp(backend, options, router, authService);
}
export { authenticationHttpFactory };
