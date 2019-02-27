import {dbUser} from '../test/fixtures';
import {ConnectionService} from '../services/connection.service';

export const connectionService: ConnectionService = {
    findUser(...params) {
        return new Promise((res) => res([dbUser]));
    },
    createUser(...params) {
        return new Promise((res) => res([dbUser]));
    },
    updateUser(...params) {
        return new Promise((res) => res([dbUser]));
    },
    deleteUser(...params) {
        return new Promise((res) => res([dbUser]));
    }
};
