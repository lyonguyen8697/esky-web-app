import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthenticationService) { }

    canActivate() {
        // if (this.authService.checkCredentials()) {
        //     return true;
        // }
        // this.router.navigate(['welcome']);
        // return false;
        return true;
    }
}
