import { Injectable } from '@angular/core';

import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncryptService {

    sha256(message: string): string {
        return CryptoJS.SHA256(message).toString();
    }

    md5(message: string): string {
        return CryptoJS.MD5(message).toString();
    }

    encryptPassword(password: string): string {
        password = this.md5(password);
        password = this.md5(password);
        password = this.sha256(password);
        return password;
    }
}
