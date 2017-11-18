import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, CanActivateChild } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { Role } from '../enums/role.emum';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(private router: Router, private authService: AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        const url = state.url;

        const allowedRole = route.data['role'] || Role.LEARNER;

        return this.checkAuthentication(url) && this.checkAuthorization(allowedRole);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    checkAuthentication(url: string): boolean {
        if (this.authService.checkCredentials()) {
            return true;
        }

        this.authService.requireSignIn(url);

        return false;
    }

    checkAuthorization(allowedRole: Role): boolean {
        return this.authService.userInRole(allowedRole);
    }
}
