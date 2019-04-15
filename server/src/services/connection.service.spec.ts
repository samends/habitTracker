import { ConnectionService } from './connection.service';
import { Habits, Users } from '../entity';
import { dbUser, user } from '../test/fixtures';

describe('ConnectionService', () => {
    let connectionService: ConnectionService;
    let typeOrmWrapper: any;
    describe('upon initialization', () => {
        beforeEach(() => {
            typeOrmWrapper = {
                createConnection: jasmine.createSpy(),
                getManager: jasmine.createSpy().and.returnValue({
                    save: jasmine.createSpy().and.returnValue(Promise.resolve([dbUser]))
                }),
                getRepository: jasmine.createSpy().and.returnValue({
                    find: jasmine.createSpy().and.returnValue(Promise.resolve([dbUser]))
                })
            };
            process.env.PGHOST = 'purpleCats';
            process.env.PGUSER = 'pinkCats';
            process.env.PGPORT = '55';
            process.env.PGPASSWORD = 'greenCats';
            process.env.habit_tracker = 'redCats';
            connectionService = new ConnectionService(typeOrmWrapper);
        });
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
                typeOrmWrapper = {
                    createConnection: jasmine.createSpy(),
                    getManager: jasmine.createSpy().and.returnValue({
                        save: jasmine.createSpy().and.returnValue(Promise.resolve([dbUser]))
                    }),
                    getRepository: jasmine.createSpy().and.returnValue({
                        find: jasmine.createSpy().and.returnValue(Promise.resolve([dbUser]))
                    })
                };
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
                typeOrmWrapper = {
                    createConnection: jasmine.createSpy(),
                    getManager: jasmine.createSpy().and.returnValue({
                        save: jasmine.createSpy().and.returnValue(Promise.resolve([dbUser]))
                    }),
                    getRepository: jasmine.createSpy().and.returnValue({
                        find: jasmine.createSpy().and.returnValue(Promise.resolve([dbUser]))
                    })
                };
                connectionService = new ConnectionService(typeOrmWrapper);
            });
            it('saves user to database', () => {
                connectionService.createUser(user);
                expect(typeOrmWrapper.getManager().save).toHaveBeenCalledWith(user);
            });
            it('finds created user', () => {
                connectionService.createUser(user).then(() => {
                    expect(typeOrmWrapper.getRepository(Users).find).toHaveBeenCalledWith({ username: user.username });
                });
            });
            it('returns the created user', (done) => {
                connectionService.createUser(user).then((res) => {
                    expect(res).toEqual([dbUser]);
                    done();
                });
            });
        });

        describe('updating a username', () => {
            beforeEach(() => {
                typeOrmWrapper = {
                    createConnection: jasmine.createSpy(),
                    find: jasmine.createSpy().and.returnValue([dbUser]),
                    getRepository: jasmine.createSpy().and.returnValue({
                        createQueryBuilder: jasmine.createSpy().and.returnValue({
                            update: jasmine.createSpy().and.returnValue({
                                set: jasmine.createSpy().and.returnValue({
                                    where: jasmine.createSpy().and.returnValue({
                                        execute: jasmine.createSpy()
                                    }),
                                }),
                            }),
                        }),
                        find: jasmine.createSpy().and.returnValue(Promise.resolve([dbUser]))
                    })
                };
                connectionService = new ConnectionService(typeOrmWrapper);
            });
            it('should call execute', () => {
                connectionService = new ConnectionService(typeOrmWrapper);
                connectionService.updateUser('1234', { username: 'merp' }).then(() => {
                    expect(typeOrmWrapper.getRepository().createQueryBuilder().update().set().where().execute)
                        .toHaveBeenCalled();
                });
            });
            it('should call find', () => {
                connectionService = new ConnectionService(typeOrmWrapper);
                connectionService.updateUser('1234', { username: 'merp' }).then(() => {
                    expect(typeOrmWrapper.getRepository().find).toHaveBeenCalledWith({ id: '1234' });
                });
            });
            it('should return the correct values', () => {
                connectionService = new ConnectionService(typeOrmWrapper);
                connectionService.updateUser('1234', { username: 'merp' }).then((res) => {
                    expect(res).toEqual([dbUser]);
                });
            });
        });
        describe('deleting a user', () => {
            beforeEach(() => {
                typeOrmWrapper = {
                    createConnection: jasmine.createSpy(),
                    find: jasmine.createSpy().and.returnValue([dbUser]),
                    getRepository: jasmine.createSpy().and.returnValue({
                        createQueryBuilder: jasmine.createSpy().and.returnValue({
                            delete: jasmine.createSpy().and.returnValue({
                                from: jasmine.createSpy().and.returnValue({
                                    where: jasmine.createSpy().and.returnValue({
                                        execute: jasmine.createSpy()
                                    }),
                                }),
                            }),
                        }),
                        find: jasmine.createSpy().and.returnValue(Promise.resolve([dbUser]))
                    })
                };
                connectionService = new ConnectionService(typeOrmWrapper);
            });
            it('should call execute', () => {
                connectionService = new ConnectionService(typeOrmWrapper);
                connectionService.deleteUser('1234').then(() => {
                    expect(typeOrmWrapper.getRepository().createQueryBuilder().delete().from().where().execute)
                        .toHaveBeenCalled();
                });
            });
            it('should call find', () => {
                connectionService = new ConnectionService(typeOrmWrapper);
                connectionService.deleteUser('1234').then(() => {
                    expect(typeOrmWrapper.getRepository().find).toHaveBeenCalledWith({ id: '1234' });
                });
            });
            it('should return the correct values', () => {
                connectionService = new ConnectionService(typeOrmWrapper);
                connectionService.deleteUser('1234').then((res) => {
                    expect(res).toEqual([dbUser]);
                });
            });
        });
    });
});
