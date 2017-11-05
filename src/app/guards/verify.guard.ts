import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class VerifyGuard implements CanActivate {

    constructor(private router: Router,
        private authService: AuthenticationService) {}

    canActivate(): boolean {
        if (this.authService.checkVerify()) {
            this.router.navigate(['']);
            return false;
        }
        return true;
    }
}
