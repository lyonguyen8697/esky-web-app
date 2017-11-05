export class SignUpInfo {
    email = '';
    emailError: boolean = null;
    emailErrorMess = '';
    name = '';
    nameError: boolean = null;
    nameErrorMess = '';
    password = '';
    passwordError: boolean = null;
    passwordErrorMess = '';
    confirmPass = '';
    confirmPassError: boolean = null;
    confirmPassErrorMess = '';

    reset() {
        this.email = '';
        this.name = '';
        this.password = '';
        this.confirmPass = '';
    }

    get validated(): boolean {
        return this.emailError === false && this.nameError === false && this.passwordError === false && this.confirmPassError === false;
    }

    get prime(): { email: string, name: string, password: string } {
        return { email: this.email, name: this.name, password: this.password };
    }
}
