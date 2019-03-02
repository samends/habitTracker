import {dbUser} from '../test/fixtures';
import {ConnectionService} from '../services/connection.service';

export const connectionService: ConnectionService = {
    findUser(...params) {
        return Promise.resolve([dbUser]);
    },
    createUser(...params) {
        return Promise.resolve([dbUser]);
    },
    updateUser(...params) {
        return Promise.resolve([dbUser]);
    },
    deleteUser(...params) {
        return Promise.resolve([dbUser]);
    }
};
