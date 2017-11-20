import { Injectable, EventEmitter } from '@angular/core';

import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Injectable()
export class LocalStorageService {

    userLocation = 'user';

    user = new EventEmitter<User>();

    getUser(): User {
        return JSON.parse(localStorage.getItem(this.userLocation));
    }

    setUser(user: User) {
        this.user.emit(user);
        localStorage.setItem(this.userLocation, JSON.stringify(user));
    }

    removeUser() {
        localStorage.removeItem(this.userLocation);
    }

    setUserToken(token: string) {
        const user = this.getUser();
        user.token = token;
        this.setUser(user);
    }

    getUserToken() {
        return this.getUser().token;
    }
}
