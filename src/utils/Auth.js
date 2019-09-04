import { defaultParams } from "../settings";
import history from '../history';

class Auth {
    constructor() {
        this.authenticated = false;

        const queryString = require('query-string');
        let queryParams = queryString.parse(location.search);

        if (queryParams.token) {
            this.checkToken(queryParams.token);
        } else {
            if (localStorage.getItem('cId')) {
                this.authenticated = true;
            }
        }
    }

    checkToken(token) {
        Object.keys(defaultParams.token).map((companyId) => {
            if (token.localeCompare(defaultParams.token[companyId]) == 0) {
                this.authenticated = true;
                localStorage.setItem('cId', companyId)
                history.push('/');
            }
        });
    }

    login(token, cb) {
        this.checkToken(token);
        cb();
    }

    logout(cb) {
        this.authenticated = false;
        cb();
    }

    isAuthenticated() {
        return this.authenticated;
    }
}

export default new Auth();
