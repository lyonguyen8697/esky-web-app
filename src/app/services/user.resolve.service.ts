import { Injectable } from '@angular/core';
import {
    Router, Resolve,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UserService } from './user.service';
import { User } from '../models/user.model';

@Injectable()
export class UserResolve implements Resolve<User> {

    constructor(private router: Router,
                private user: UserService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        const username = route.params['username'];
        return this.user.getByUsername(username)
        .catch(() => {
            this.router.navigate(['error', 404]);
            return Observable.of(null);
        });
    }
}
