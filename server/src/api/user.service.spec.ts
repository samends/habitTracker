import {MockConnection} from '../test/connection.stub';
import {user, dbUser} from '../test/fixtures';
import {UserService} from './user.service';

describe('userService', () => {
    let mockConnection;
    let userService: UserService;
    let mockRepository;
    const hashService = {
        genHash: jasmine.createSpy().and.returnValue('testHash'),
    };
    describe('when a user is being created', () => {
        describe('and user has not already been created', () => {
            beforeEach(() => {
                mockRepository = {
                    find: () => [],
                    manager: jasmine.createSpyObj('DB manager', ['save']),
                };

                mockConnection = new MockConnection(mockRepository);
                userService = new UserService(mockConnection, hashService),
                userService.create(user);
            });
            it('should save new user to db', () => {
                expect(mockRepository.manager.save).toHaveBeenCalledWith({...user, password: 'teHash'});
            });
        });
    });
});
