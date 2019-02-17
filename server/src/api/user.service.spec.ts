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
        compare: (a, b) => true,
    };
    describe('when', () => {
        describe('creating a user', () => {
            describe('and the user has not already been created', () => {
                const mockUser = new Users();
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
                    mockUser.username = user.username;
                    mockUser.password = hash;
                }),
                    it('should save new user to db', () => {
                        userService = new UserService(mockConnection, hashService),
                            userService.create(user).then((res) => {
                                expect(mockDb.manager.save).toHaveBeenCalledWith(mockUser);
                                expect(res).toEqual(mockUser);
                            });
                    });
            });
            describe('and the user has already been created', () => {
                beforeEach(() => {
                    mockRepository = {
                        find: () => [dbUser],
                    };
                    mockDb = {
                        manager: jasmine.createSpyObj('manager', ['save']),
                        getRepository: (...params) => {
                            return mockRepository;
                        },
                    };
                    mockConnection = new MockConnection(mockDb);
                }),
                    it('should not save user to db', () => {
                        userService = new UserService(mockConnection, hashService),
                            userService.create(user).catch((error) => {
                                expect(mockDb.manager.save).not.toHaveBeenCalled();
                                expect(error).toEqual(new Error('Username already taken'));
                            });
                    });
            });
        });

        describe('finding a user by username', () => {
            describe('and user exists', () => {
                const mockUser = new Users();
                beforeEach(() => {
                    mockRepository = {
                        find: jasmine.createSpy().and.returnValue([dbUser]),
                    };
                    mockDb = {
                        manager: jasmine.createSpyObj('manager', ['save']),
                        getRepository: (...params) => {
                            return mockRepository;
                        },
                    };
                    mockConnection = new MockConnection(mockDb);
                    mockUser.username = user.username;
                    mockUser.password = hash;
                }),
                    it('should find user in db', () => {
                        userService = new UserService(mockConnection, hashService),
                            userService.findByUsername('merp').then((res) => {
                                expect(mockRepository.find).toHaveBeenCalledWith({ username: 'merp' });
                                expect(res).toEqual(dbUser);
                            });
                    });
            });
            describe('and user does not exists', () => {
                const mockUser = new Users();
                beforeEach(() => {
                    mockRepository = {
                        find: jasmine.createSpy().and.returnValue([]),
                    };
                    mockDb = {
                        manager: jasmine.createSpyObj('manager', ['save']),
                        getRepository: (...params) => {
                            return mockRepository;
                        },
                    };
                    mockConnection = new MockConnection(mockDb);
                    mockUser.username = user.username;
                    mockUser.password = hash;
                }),
                    it('should throw an error', () => {
                        userService = new UserService(mockConnection, hashService),
                            userService.findByUsername('merp').catch((error) => {
                                expect(mockRepository.find).toHaveBeenCalledWith({ username: 'merp' });
                                expect(error).toEqual(new Error('User not found'));
                            });
                    });
            });
        });

        describe('updating a username', () => {
            const mockUser = new Users();
            beforeEach(() => {
                mockRepository = {
                    find: jasmine.createSpy().and.returnValue([dbUser]),
                    createQueryBuilder: jasmine.createSpy().and.returnValue({
                        update: jasmine.createSpy().and.returnValue({
                            set: jasmine.createSpy().and.returnValue({
                                where: jasmine.createSpy().and.returnValue({
                                    execute: jasmine.createSpy()
                                }),
                            }),
                        }),
                    }),
                };
                mockDb = {
                    manager: jasmine.createSpyObj('manager', ['save']),
                    getRepository: (...params) => {
                        return mockRepository;
                    },
                };
                mockConnection = new MockConnection(mockDb);
                mockUser.username = user.username;
                mockUser.password = hash;
            });
            it('should call create query builder', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.updateUsername('1234', 'merp').then(() => {
                        expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
                    });
            });
            it('should call update', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.updateUsername('1234', 'merp').then(() => {
                        expect(mockRepository.createQueryBuilder().update).toHaveBeenCalledWith(Users);
                    });
            });
            it('should call set', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.updateUsername('1234', 'merp').then(() => {
                        expect(mockRepository.createQueryBuilder().update().set)
                            .toHaveBeenCalledWith({ username: 'merp' });
                    });
            });
            it('should call where', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.updateUsername('1234', 'merp').then(() => {
                        expect(mockRepository.createQueryBuilder().update().set().where)
                            .toHaveBeenCalledWith('id = :id', { id: '1234' });
                    });
            });
            it('should call execute', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.updateUsername('1234', 'merp').then(() => {
                        expect(mockRepository.createQueryBuilder().update().set().where().execute)
                            .toHaveBeenCalled();
                    });
            });
            it('should call find', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.updateUsername('1234', 'merp').then(() => {
                        expect(mockRepository.find).toHaveBeenCalledWith({id: '1234'});
                    });
            });
            it('should return the correct value', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.updateUsername('1234', 'merp').then((res) => {
                        expect(res).toEqual(dbUser);
                    });
            });
        });

        describe('updating a username throws an error', () => {
            const mockUser = new Users();
            beforeEach(() => {
                mockRepository = {
                    find: jasmine.createSpy().and.returnValue([dbUser]),
                    createQueryBuilder: () => {
                        throw new Error('test error');
                    },
                };
                mockDb = {
                    manager: jasmine.createSpyObj('manager', ['save']),
                    getRepository: (...params) => {
                        return mockRepository;
                    },
                };
                mockConnection = new MockConnection(mockDb);
                mockUser.username = user.username;
                mockUser.password = hash;
            });
            it('should call create query builder', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.updateUsername('1234', 'merp').catch((error) => {
                        expect(error).toEqual(new Error('test error'));
                    });
            });
        });

        describe('updating a password', () => {
            const mockUser = new Users();
            beforeEach(() => {
                mockRepository = {
                    find: jasmine.createSpy().and.returnValue([dbUser]),
                    createQueryBuilder: jasmine.createSpy().and.returnValue({
                        update: jasmine.createSpy().and.returnValue({
                            set: jasmine.createSpy().and.returnValue({
                                where: jasmine.createSpy().and.returnValue({
                                    execute: jasmine.createSpy(),
                                }),
                            }),
                        }),
                    }),
                };
                mockDb = {
                    manager: jasmine.createSpyObj('manager', ['save']),
                    getRepository: (...params) => {
                        return mockRepository;
                    },
                };
                mockConnection = new MockConnection(mockDb);
                mockUser.username = user.username;
                mockUser.password = hash;
            });
            it('should call create query builder', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.updatePassword('1234', 'merp').then(() => {
                        expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
                    });
            });
            it('should call update', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.updatePassword('1234', 'merp').then(() => {
                        expect(mockRepository.createQueryBuilder().update).toHaveBeenCalledWith(Users);
                    });
            });
            it('should call set', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.updatePassword('1234', 'merp').then(() => {
                        expect(mockRepository.createQueryBuilder().update().set)
                            .toHaveBeenCalledWith({ password: hash });
                    });
            });
            it('should call where', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.updatePassword('1234', 'merp').then(() => {
                        expect(mockRepository.createQueryBuilder().update().set().where)
                            .toHaveBeenCalledWith('id = :id', { id: '1234' });
                    });
            });
            it('should call execute', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.updatePassword('1234', 'merp').then(() => {
                        expect(mockRepository.createQueryBuilder().update().set().where().execute)
                            .toHaveBeenCalled();
                    });
            });
            it('should call find', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.updatePassword('1234', 'merp').then(() => {
                        expect(mockRepository.find).toHaveBeenCalledWith({id: '1234'});
                    });
            });
            it('should return the correct value', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.updatePassword('1234', 'merp').then((res) => {
                        expect(res).toEqual(dbUser);
                    });
            });
        });

        describe('updating a password throws an error', () => {
            const mockUser = new Users();
            beforeEach(() => {
                mockRepository = {
                    find: jasmine.createSpy().and.returnValue([dbUser]),
                    createQueryBuilder: () => {
                        throw new Error('test error');
                    },
                };
                mockDb = {
                    manager: jasmine.createSpyObj('manager', ['save']),
                    getRepository: (...params) => {
                        return mockRepository;
                    },
                };
                mockConnection = new MockConnection(mockDb);
                mockUser.username = user.username;
                mockUser.password = hash;
            });
            it('should call create query builder', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.updatePassword('1234', 'merp').catch((error) => {
                        expect(error).toEqual(new Error('test error'));
                    });
            });
        });

        describe('deleting a user', () => {
            const mockUser = new Users();
            beforeEach(() => {
                mockRepository = {
                    find: jasmine.createSpy().and.returnValue([dbUser]),
                    createQueryBuilder: jasmine.createSpy().and.returnValue({
                        delete: jasmine.createSpy().and.returnValue({
                            from: jasmine.createSpy().and.returnValue({
                                where: jasmine.createSpy().and.returnValue({
                                    execute: jasmine.createSpy(),
                                }),
                            }),
                        }),
                    }),
                };
                mockDb = {
                    manager: jasmine.createSpyObj('manager', ['save']),
                    getRepository: (...params) => {
                        return mockRepository;
                    },
                };
                mockConnection = new MockConnection(mockDb);
                mockUser.username = user.username;
                mockUser.password = hash;
            });
            it('should call find', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.delete('12345').then(() => {
                        expect(mockRepository.find).toHaveBeenCalledWith({id: '12345'});
                    });
            });
            it('should call create query builder', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.delete('12345').then(() => {
                        expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
                    });
            });
            it('should call delete', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.delete('12345').then(() => {
                        expect(mockRepository.createQueryBuilder().delete).toHaveBeenCalled();
                    });
            });
            it('should call from', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.delete('12345').then(() => {
                        expect(mockRepository.createQueryBuilder().delete().from)
                            .toHaveBeenCalledWith(Users);
                    });
            });
            it('should call where', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.delete('12345').then(() => {
                        expect(mockRepository.createQueryBuilder().delete().from().where)
                            .toHaveBeenCalledWith('id = :id', {id: '12345'});
                    });
            });
            it('should call execute', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.delete('12345').then(() => {
                        expect(mockRepository.createQueryBuilder().delete().from().where().execute)
                            .toHaveBeenCalled();
                    });
            });
            it('should return the correct value', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.delete('12345').then((res) => {
                        expect(res).toEqual(dbUser);
                    });
            });
        });

        describe('deleting a user throws an error', () => {
            const mockUser = new Users();
            beforeEach(() => {
                mockRepository = {
                    find: jasmine.createSpy().and.returnValue([dbUser]),
                    createQueryBuilder: () => {
                        throw new Error('test error');
                    },
                };
                mockDb = {
                    manager: jasmine.createSpyObj('manager', ['save']),
                    getRepository: (...params) => {
                        return mockRepository;
                    },
                };
                mockConnection = new MockConnection(mockDb);
                mockUser.username = user.username;
                mockUser.password = hash;
            });
            it('should call create query builder', () => {
                userService = new UserService(mockConnection, hashService),
                    userService.delete('12345').catch((error) => {
                        expect(error).toEqual(new Error('test error'));
                    });
            });
        });

        describe('validating a password', () => {
            describe('and user exists', () => {
                describe('and password is valid', () => {
                    const mockUser = new Users();
                    beforeEach(() => {
                        spyOn(hashService, 'compare').and.returnValue(true);
                        mockRepository = {
                            find: jasmine.createSpy().and.returnValue([dbUser]),
                        };
                        mockDb = {
                            manager: jasmine.createSpyObj('manager', ['save']),
                            getRepository: (...params) => {
                                return mockRepository;
                            },
                        };
                        mockConnection = new MockConnection(mockDb);
                        mockUser.username = user.username;
                        mockUser.password = hash;
                    });
                    it('should call find', () => {
                        userService = new UserService(mockConnection, hashService),
                            userService.validatePassword('18900', '12345').then((res) => {
                                expect(res).toEqual(dbUser);
                            });
                    });
                });
                describe('and password is invalid', () => {
                    const mockUser = new Users();
                    beforeEach(() => {
                        spyOn(hashService, 'compare').and.returnValue(false);
                        mockRepository = {
                            find: jasmine.createSpy().and.returnValue([dbUser]),
                        };
                        mockDb = {
                            manager: jasmine.createSpyObj('manager', ['save']),
                            getRepository: (...params) => {
                                return mockRepository;
                            },
                        };
                        mockConnection = new MockConnection(mockDb);
                        mockUser.username = user.username;
                        mockUser.password = hash;
                    });
                    it('should call find', () => {
                        userService = new UserService(mockConnection, hashService),
                            userService.validatePassword('18900', '12345').catch((error) => {
                                expect(error).toEqual(new Error('Wrong password, try again'));
                            });
                    });
                });
            });
            describe('and user does not exists', () => {
                const mockUser = new Users();
                beforeEach(() => {
                    spyOn(hashService, 'compare').and.returnValue(true);
                    mockRepository = {
                        find: jasmine.createSpy().and.returnValue([]),
                    };
                    mockDb = {
                        manager: jasmine.createSpyObj('manager', ['save']),
                        getRepository: (...params) => {
                            return mockRepository;
                        },
                    };
                    mockConnection = new MockConnection(mockDb);
                    mockUser.username = user.username;
                    mockUser.password = hash;
                });
                it('should call find', () => {
                    userService = new UserService(mockConnection, hashService),
                        userService.validatePassword('18900', '12345').catch((error) => {
                            expect(error).toEqual(new Error('User not found'));
                        });
                });
            });
        });
    });
});
