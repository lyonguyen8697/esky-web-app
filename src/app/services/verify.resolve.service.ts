import { Injectable } from '@angular/core';
import {
    Router, Resolve,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { VerifyService } from './verify.service';

@Injectable()
export class VerifyResolve implements Resolve<any> {

    constructor(private verifyService: VerifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const token = route.params['token'];
        return this.verifyService.verify(token);
    }
}
