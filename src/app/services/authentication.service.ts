import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthenticationService {

    isSignIn = false;

    constructor(private router: Router) { }

    public signIn(email: string, password: string) {
        console.log(email, password);
        if (email === 'lyonguyen@gmail.com' && password === '752589') {
            this.isSignIn = true;
            this.router.navigate(['']);
            console.log('checked');
        }
    }

    public signOut() {

    }

    public checkCredentials(): boolean {
        return this.isSignIn;
    }

}
