import { Injectable, EventEmitter } from '@angular/core';

import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Learner } from '../models/learner.model';

@Injectable()
export class LocalStorageService {

    userLocation = 'user';

    learnerLocation = 'learner';

    user = new EventEmitter<User>();

    learner = new EventEmitter<Learner>();

    getUser(): User {
        return JSON.parse(localStorage.getItem(this.userLocation));
    }

    setUser(user: User) {
        this.user.emit(user);
        if (this.getUser()) {
            user.token = this.getUser().token;
        }
        localStorage.setItem(this.userLocation, JSON.stringify(user));
    }

    removeUser() {
        localStorage.removeItem(this.userLocation);
    }

    setUserToken(token: string) {
        const user = this.getUser();
        user.token = token;
        this.user.emit(user);
        localStorage.setItem(this.userLocation, JSON.stringify(user));
    }

    getUserToken() {
        return this.getUser().token;
    }

    getLearner(): Learner {
        return new Learner(JSON.parse(localStorage.getItem(this.learnerLocation)));
    }

    setLearner(learner: Learner) {
        this.learner.emit(learner);
        localStorage.setItem(this.learnerLocation, JSON.stringify(learner));
    }

    removeLearner() {
        localStorage.removeItem(this.learnerLocation);
    }

    removeAll() {
        this.removeUser();
        this.removeLearner();
    }
}
