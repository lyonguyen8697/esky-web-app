import { Injectable } from '@angular/core';

import { User } from '../models/user.model';

@Injectable()
export class UserService {

    userLocation = 'user';

    getLocal(): User {
        return JSON.parse(localStorage.getItem(this.userLocation));
    }

    setLocal(user: User) {
        localStorage.setItem(this.userLocation, JSON.stringify(user));
    }

    removeLocal() {
        localStorage.removeItem(this.userLocation);
    }

    setToken(token: string) {
        const user = this.getLocal();
        user.token = token;
        this.setLocal(user);
    }

    getToken() {
        return this.getLocal().token;
    }
}
