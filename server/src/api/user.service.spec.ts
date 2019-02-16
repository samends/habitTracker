import {MockConnection} from '../test/connection.stub';
import {user, dbUser} from '../test/fixtures';
import {UserService} from './user.service';
import {Users} from '../entity';

describe('userService', () => {
    let mockConnection;
    let userService: UserService;
    let mockDb;
    let mockRepository;
    const hash = 'testHash';
    const hashService = {
        genHash: jasmine.createSpy().and.returnValue(hash),
    };
    beforeEach(() => {
        mockRepository = {
            find: () => [],
        };
        mockDb = {
            manager: jasmine.createSpyObj('manager', ['save']),
            getRepository: (...params) => {
                return mockRepository;
            },
        };
        mockConnection = new MockConnection(mockDb);
    });
    describe('when a user is being created', () => {
        describe('and user has not already been created', () => {
            const mockUser = new Users();
            beforeEach(() => {
                mockUser.username = user.username;
                mockUser.password = hash;
            })
            it('should save new user to db', () => {
                userService = new UserService(mockConnection, hashService),
                userService.create(user).then(() => {
                    expect(mockDb.manager.save).toHaveBeenCalledWith(mockUser);
                });
            });
        });
    });
});
