import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, CanActivate } from '@angular/router';

import { LessonService } from '../services/lesson.service';

@Injectable()
export class LessonGuard implements CanActivate {

    constructor(private router: Router, private lessonService: LessonService) {}

    canActivate(route: ActivatedRouteSnapshot) {
        if (this.lessonService.canAccess(route.paramMap.get('id'))) {
            return true;
        }
        this.router.navigate(['']);
        return false;
    }

}
