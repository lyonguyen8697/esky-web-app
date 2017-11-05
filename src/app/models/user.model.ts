import { Role } from '../enums/role.emum';

export class User {
    id: string;
    email: string;
    name: string;
    role: string;
    token: string;

    static getLocal(): User {
        return JSON.parse(localStorage.getItem('user'));
    }

    static setLocal(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    static removeLocal() {
        localStorage.removeItem('user');
    }

    static setToken(token: string) {
        let user = this.getToken();
        if (!user) {
            user = new User();
        }
        user.token = token;
        this.setToken(user);
    }

    static getToken() {
        return this.getToken().token;
    }

    toLocal() {
        localStorage.setItem('user', JSON.stringify(this));
    }
}
