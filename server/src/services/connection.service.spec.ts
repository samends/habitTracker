import { ConnectionService } from './connection.service';
import { Habits, Users } from '../entity';
import { dbUser, user } from '../test/fixtures';

describe('ConnectionService', () => {
    let connectionService: ConnectionService;
    const typeOrmWrapper: any = {
        createConnection: jasmine.createSpy(),
        getManager: jasmine.createSpy().and.returnValue({
            save: jasmine.createSpy().and.returnValue(Promise.resolve([dbUser]))
        }),
        getRepository: jasmine.createSpy().and.returnValue({
            find: jasmine.createSpy().and.returnValue(Promise.resolve([dbUser]))
        })
    };
    describe('upon initialization', () => {
        process.env.PGHOST = 'purpleCats';
        process.env.PGUSER = 'pinkCats';
        process.env.PGPORT = '55';
        process.env.PGPASSWORD = 'greenCats';
        process.env.habit_tracker = 'redCats';
        connectionService = new ConnectionService(typeOrmWrapper);
        it('creates database connection with correct params', () => {
            expect(typeOrmWrapper.createConnection).toHaveBeenCalledWith({
                type: 'postgres',
                host: 'purpleCats',
                port: 55,
                username: 'pinkCats',
                password: 'greenCats',
                database: 'redCats',
                entities: [
                    Habits,
                    Users
                ],
                synchronize: true,
                logging: false,
            });
        });
    });

    describe('when', () => {
        describe('finding a user by username', () => {
            beforeEach(() => {
                connectionService = new ConnectionService(typeOrmWrapper);
            });
            it('calls database find method', () => {
                connectionService.findUser({ username: 'fuzz' });
                expect(typeOrmWrapper.getRepository().find).toHaveBeenCalledWith({ username: 'fuzz' });
            });
            it('returns correct user', (done) => {
                connectionService.findUser({ username: 'fuzz' }).then((res) => {
                    expect(res).toEqual([dbUser]);
                    done();
                });
            });
        });

        describe('creating a user', () => {
            beforeEach(() => {
                connectionService = new ConnectionService(typeOrmWrapper);
            });
            it('saves user to database', () => {
                connectionService.createUser(user);
                expect(typeOrmWrapper.getManager().save).toHaveBeenCalledWith(user);
            });
            it('finds created user', () => {
                connectionService.createUser(user);
                expect(typeOrmWrapper.getRepository().find).toHaveBeenCalledWith({ username: user.username });
            });
            it('returns the created user', () => {
                connectionService.createUser(user).then((res) => {
                    expect(res).toEqual([dbUser]);
                });
            });
        });
    });
});

// describe('updating a username', () => {
//     const mockUser = new Users();
//     beforeEach(() => {
//         mockRepository = {
//             find: jasmine.createSpy().and.returnValue([dbUser]),
//             createQueryBuilder: jasmine.createSpy().and.returnValue({
//                 update: jasmine.createSpy().and.returnValue({
//                     set: jasmine.createSpy().and.returnValue({
//                         where: jasmine.createSpy().and.returnValue({
//                             execute: jasmine.createSpy()
//                         }),
//                     }),
//                 }),
//             }),
//         };
//         mockDb = {
//             manager: jasmine.createSpyObj('manager', ['save']),
//             getRepository: (...params) => {
//                 return mockRepository;
//             },
//         };
//         mockConnection = new MockConnection(mockDb);
//         mockUser.username = user.username;
//         mockUser.password = hash;
//     });
//     it('should call create query builder', () => {
//         userService = new UserService(mockConnection, hashService),
//             userService.update('1234', {username: 'merp'}).then(() => {
//                 expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
//             });
//     });
//     it('should call update', () => {
//         userService = new UserService(mockConnection, hashService),
//             userService.update('1234', {username: 'merp'}).then(() => {
//                 expect(mockRepository.createQueryBuilder().update).toHaveBeenCalledWith(Users);
//             });
//     });
//     it('should call set', () => {
//         userService = new UserService(mockConnection, hashService),
//             userService.update('1234', {username: 'merp'}).then(() => {
//                 expect(mockRepository.createQueryBuilder().update().set)
//                     .toHaveBeenCalledWith({ username: 'merp' });
//             });
//     });
//     it('should call where', () => {
//         userService = new UserService(mockConnection, hashService),
//             userService.update('1234', {username: 'merp'}).then(() => {
//                 expect(mockRepository.createQueryBuilder().update().set().where)
//                     .toHaveBeenCalledWith('id = :id', { id: '1234' });
//             });
//     });
//     it('should call execute', () => {
//         userService = new UserService(mockConnection, hashService),
//             userService.update('1234', {username: 'merp'}).then(() => {
//                 expect(mockRepository.createQueryBuilder().update().set().where().execute)
//                     .toHaveBeenCalled();
//             });
//     });
//     it('should call find', () => {
//         userService = new UserService(mockConnection, hashService),
//             userService.update('1234', {username: 'merp'}).then(() => {
//                 expect(mockRepository.find).toHaveBeenCalledWith({id: '1234'});
//             });
//     });
//     it('should return the correct value', () => {
//         userService = new UserService(mockConnection, hashService),
//             userService.update('1234', {username: 'merp'}).then((res) => {
//                 expect(res).toEqual(dbUser);
//             });
//     });
// });
