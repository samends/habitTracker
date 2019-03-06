import {dbUser} from '../test/fixtures';
import {ConnectionService} from '../services/connection.service';

class MockConnectionService {
    constructor(params) {
        const instantiating = 'variable';
    }
    findUser(...params) {
        return Promise.resolve([dbUser]);
    }
    createUser(...params) {
        return Promise.resolve([dbUser]);
    }
    updateUser(...params) {
        return Promise.resolve([dbUser]);
    }
    deleteUser(...params) {
        return Promise.resolve([dbUser]);
    }
}

export const connectionService = new MockConnectionService({}) as ConnectionService;
