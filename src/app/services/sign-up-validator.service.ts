import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SignUpService } from './sign-up.service';
import { SignUpInfo } from '../models/sign-up-info.model';

import 'rxjs/add/Observable/of';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class SignUpValidatorService {

    emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    constructor(private signUpService: SignUpService) {}

    validate(info: SignUpInfo): Observable<boolean> {
        return this.email(info)
        .mergeMap(a => {
            const b = this.name(info);
            const c = this.password(info);
            const d = this.confirmPassword(info);

            return Observable.of(a && b && c && d);
        });
    }

    isEmpty(s: string): boolean {
        return s.trim().length === 0;
    }

    email(info: SignUpInfo): Observable<boolean> {
        if (this.isEmpty(info.email)) {
            info.emailError = true;
            info.emailErrorMess = 'Email của bạn là gì?';
            return Observable.of(false);
        } else if (!this.emailRegex.test(info.email)) {
            info.emailError = true;
            info.emailErrorMess = 'Vui lòng nhập địa chỉ email hợp lệ';
            return Observable.of(false);
        }
        return this.signUpService.checkEmailExists(info.email)
        .mergeMap(isExists => {
            if (isExists) {
                info.emailError = true;
                info.emailErrorMess = 'Email bạn nhập đã tồn tại';
                return Observable.of(false);
            } else {
                info.emailError = false;
                info.emailErrorMess = '';
                return Observable.of(true);
            }
        });
    }

    name(info: SignUpInfo): boolean {
        if (this.isEmpty(info.name)) {
            info.nameError = true;
            info.nameErrorMess = 'Tên của bạn là gì?';
            return false;
        } else {
            info.nameError = false;
            info.nameErrorMess = '';
            return true;
        }
    }

    password(info: SignUpInfo): boolean {
        if (this.isEmpty(info.password)) {
            info.passwordError = true;
            info.passwordErrorMess = 'Mật khẩu của bạn là gì?';
            return false;
        } else if (info.password.length < 6) {
            info.passwordError = true;
            info.passwordErrorMess = 'Mật khẩu của bạn tối thiểu phải có 6 ký tự';
            return false;
        } else {
            info.passwordError = false;
            info.passwordErrorMess = '';
            return true;
        }
    }

    confirmPassword(info: SignUpInfo): boolean {
        if (this.isEmpty(info.confirmPass)) {
            info.confirmPassError = true;
            info.confirmPassErrorMess = 'Vui lòng nhập lại mật khẩu của bạn';
            return false;
        } else if (info.confirmPass !== info.password) {
            info.confirmPassError = true;
            info.confirmPassErrorMess = 'Mật khẩu bạn nhập không chính xác';
            return false;
        } else {
            info.confirmPassError = false;
            info.confirmPassErrorMess = '';
            return true;
        }
    }
}
