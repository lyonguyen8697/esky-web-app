import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { UserService } from './user.service';
import { SignUpInfo } from '../models/sign-up-info.model';

import 'rxjs/add/Observable/of';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class ValidatorService {

    emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    usernameRegex = /^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/;

    constructor(private user: UserService) {}

    async validate(info: any): Promise<boolean> {
        const a = await info.email !== undefined ? this.email(info).toPromise() : true;
        const b = await info.username !== undefined ? this.username(info).toPromise() : true;
        const c = info.name !== undefined ? this.name(info) : true;
        const d = info.password !== undefined ? this.password(info) : true;
        const e = info.confirmPass !== undefined ? this.confirmPassword(info) : true;
        return Promise.all([a, b, c, d, e])
        .then(value => value.every(n => n));
    }

    isEmpty(s: string): boolean {
        return s.trim().length === 0;
    }

    email(info: { email: string, emailError: boolean, emailErrorMess: string }): Observable<boolean> {
        if (this.isEmpty(info.email)) {
            info.emailError = true;
            info.emailErrorMess = 'Email của bạn là gì?';
            return Observable.of(false);
        } else if (!this.emailRegex.test(info.email)) {
            info.emailError = true;
            info.emailErrorMess = 'Vui lòng nhập địa chỉ email hợp lệ';
            return Observable.of(false);
        }
        return this.user.hasEmailOrUsername(info.email)
        .map(isExists => {
            if (isExists) {
                info.emailError = true;
                info.emailErrorMess = 'Email bạn nhập đã tồn tại';
                return false;
            } else {
                info.emailError = false;
                info.emailErrorMess = '';
                return true;
            }
        });
    }

    username(info: { currentUsername: string, username: string, usernameError: boolean, usernameErrorMess: string }): Observable<boolean> {
        if (this.isEmpty(info.username)) {
            info.usernameError = true;
            info.usernameErrorMess = 'Tên người dùng của bạn là gì?';
            return Observable.of(false);
        } else if (!this.usernameRegex.test(info.username)) {
            info.usernameError = true;
            info.usernameErrorMess = 'Tên người dùng của bạn không hợp lệ';
            return Observable.of(false);
        } else if (info.username.toLowerCase() === info.currentUsername.toLowerCase()) {
            info.usernameError = false;
            info.usernameErrorMess = '';
            return Observable.of(true);
        }
        return this.user.hasEmailOrUsername(info.username)
        .map(isExists => {
            if (isExists) {
                info.usernameError = true;
                info.usernameErrorMess = 'Tên người dùng đã tồn tại';
                return false;
            } else {
                info.usernameError = false;
                info.usernameErrorMess = '';
                return true;
            }
        });
    }

    name(info: { name: string, nameError: boolean, nameErrorMess: string }): boolean {
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

    password(info: { password: string, passwordError: boolean, passwordErrorMess: string }): boolean {
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

    confirmPassword(info: { password: string, confirmPass: string, confirmPassError: boolean, confirmPassErrorMess: string }): boolean {
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
