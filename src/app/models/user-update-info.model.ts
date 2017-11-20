import { User } from './user.model';

export class UserUpdateInfo {
    currentUsername = '';
    username = '';
    usernameError: boolean = null;
    usernameErrorMess = '';
    name = '';
    nameError: boolean = null;
    nameErrorMess = '';
    password = '';
    passwordError: boolean = null;
    passwordErrorMess = '';

    credentials: string;

    reset() {
        this.currentUsername = '';
        this.username = '';
        this.usernameError = null;
        this.usernameErrorMess = '';
        this.name = '';
        this.nameError = null;
        this.nameErrorMess = '';
        this.password = '';
        this.passwordError = null;
        this.passwordErrorMess = '';
    }

    get validated(): boolean {
        return this.usernameError === false && this.nameError === false && this.passwordError === false;
    }

    get prime(): { username: string, name: string, password: string, credentials: string } {
        return { username: this.username, name: this.name, password: this.password, credentials: this.credentials };
    }
}
