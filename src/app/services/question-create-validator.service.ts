import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class QuestionCreateValidatorService {

    constructor() {}

    getErrorMessage(name: string, control: AbstractControl) {
        if (control.hasError('required')) {
            return name + ' của bạn là gì?';
        }
        if (control.hasError('minlength')) {
            return name + ' của bạn phải có tối thiểu 6 ký tự';
        }
        if (control.hasError('exists')) {
            return name + ' của bạn đã tồn tại';
        }
        if (control.hasError('server')) {
            return `Lỗi vui lòng nhập ${name} hợp lệ`;
        }
    }
}
