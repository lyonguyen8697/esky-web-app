import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class SignOutGuard implements CanActivate {

    constructor(private router: Router,
        private authService: AuthenticationService) {}

    canActivate(): boolean {
        if (this.authService.checkCredentials()) {
            if (this.authService.checkVerify()) {
                this.router.navigate(['']);
                return false;
            }
            this.router.navigate(['verify']);
            return false;
        }
        return true;
    }
}
