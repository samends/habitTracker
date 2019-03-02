import { connectionService } from '../test/connection.stub';
import { user, dbUser } from '../test/fixtures';
import { UserService } from './user.service';
import { Users } from '../entity';

describe('userService', () => {
    let userService: UserService;
    const hash = 'testHash';
    const hashService = {
        genHash: jasmine.createSpy().and.returnValue(hash),
        compare: (a, b) => true,
    };
    describe('when', () => {
        describe('creating a user', () => {
            const mockUser = new Users();
            beforeEach(() => {
                mockUser.username = user.username;
                mockUser.password = hash;
            }),
                it('should generate password hash', () => {
                    spyOn(connectionService, 'findUser').and.returnValue(Promise.resolve([]));
                    userService = new UserService(connectionService, hashService),
                        userService.create(user).then(() => {
                            expect(hashService.genHash).toHaveBeenCalledWith(user.password);
                        });
                });
            it('should return the correct value', () => {
                spyOn(connectionService, 'createUser').and.returnValue(Promise.resolve([dbUser]));
                spyOn(connectionService, 'findUser').and.returnValue(Promise.resolve([]));
                userService = new UserService(connectionService, hashService),
                    userService.create(user).then((res) => {
                        expect(res).toEqual(dbUser);
                    });
            });
            it('should save new user to db', (done) => {
                spyOn(connectionService, 'findUser').and.returnValue(Promise.resolve([]));
                spyOn(connectionService, 'createUser').and.returnValue(Promise.resolve([dbUser]));
                userService = new UserService(connectionService, hashService),
                    userService.create(user).then((res) => {
                        expect(connectionService.createUser).toHaveBeenCalledWith(mockUser);
                        done();
                    });
            });
        });

        describe('finding a user by username', () => {
            describe('and user exists', () => {
                const mockUser = new Users();
                beforeEach(() => {
                    mockUser.username = user.username;
                    mockUser.password = hash;
                }),
                    it('should find user in db', (done) => {
                        spyOn(connectionService, 'findUser').and.returnValue(Promise.resolve([dbUser]));
                        userService = new UserService(connectionService, hashService),
                            userService.find({ username: 'merp' }).then(() => {
                                expect(connectionService.findUser).toHaveBeenCalledWith({ username: 'merp' });
                                done();
                            });
                    });
                it('should return the correct value', (done) => {
                    spyOn(connectionService, 'findUser').and.returnValue(Promise.resolve([dbUser]));
                    userService = new UserService(connectionService, hashService),
                        userService.find({ username: 'merp' }).then((res) => {
                            expect(res).toEqual(dbUser);
                            done();
                        });
                });
            });
            describe('and user does not exist', () => {
                const mockUser = new Users();
                beforeEach(() => {
                    mockUser.username = user.username;
                    mockUser.password = hash;
                }),
                    it('should throw error', (done) => {
                        spyOn(connectionService, 'findUser').and.returnValue(Promise.resolve([]));
                        userService = new UserService(connectionService, hashService),
                            userService.find({ username: 'merp' }).catch((error) => {
                                expect(error).toEqual(new Error('Username not found'));
                                done();
                            });
                    });
            });
        });

        describe('updating a username', () => {
            describe('and username exists', () => {
                const mockUser = new Users();
                beforeEach(() => {
                    mockUser.username = user.username;
                    mockUser.password = hash;
                }),
                    it('should find user in db', (done) => {
                        spyOn(connectionService, 'updateUser').and.returnValue(Promise.resolve([dbUser]));
                        userService = new UserService(connectionService, hashService);
                        userService.update('1234', { username: 'mrMerp' }).then(() => {
                            expect(connectionService.updateUser).toHaveBeenCalledWith('1234', { username: 'mrMerp' });
                            done();
                        });
                    });
                it('should return the correct value', (done) => {
                    spyOn(connectionService, 'updateUser').and.returnValue(Promise.resolve([dbUser]));
                    userService = new UserService(connectionService, hashService);
                    userService.update('1234', { username: 'mrMerp' }).then((res) => {
                        expect(res).toBe(dbUser);
                        done();
                    });
                });
            });
            describe('and an error was thrown', () => {
                const mockUser = new Users();
                beforeEach(() => {
                    mockUser.username = user.username;
                    mockUser.password = hash;
                }),
                    it('should throw error', (done) => {
                        spyOn(connectionService, 'updateUser').and
                            .returnValue(Promise.reject(new Error('Pandas are in the way')));
                        userService = new UserService(connectionService, hashService);
                        userService.update('1234', { username: 'mrMerp' }).catch((error) => {
                            expect(error).toEqual(new Error('Pandas are in the way'));
                            done();
                        });
                    });
            });
        });

        describe('validating user password', () => {
            it('should find user in db', (done) => {
                spyOn(connectionService, 'deleteUser').and.returnValue(Promise.resolve([dbUser]));
                userService = new UserService(connectionService, hashService);
                userService.delete('1234').then(() => {
                    expect(connectionService.deleteUser).toHaveBeenCalledWith('1234');
                    done();
                });
            });
            it('should return the correct value', (done) => {
                spyOn(connectionService, 'deleteUser').and.returnValue(Promise.resolve([dbUser]));
                userService = new UserService(connectionService, hashService);
                userService.delete('1234').then((res) => {
                    expect(res).toBe(dbUser);
                    done();
                });
            });
            describe('and an error was thrown', () => {
                it('should throw error', (done) => {
                    spyOn(connectionService, 'deleteUser').and
                        .returnValue(Promise.reject(new Error('Pandas are in the way')));
                    userService = new UserService(connectionService, hashService);
                    userService.delete('1234').catch((error) => {
                        expect(error).toEqual(new Error('Pandas are in the way'));
                        done();
                    });
                });
            });
        });

        // describe('updating a username throws an error', () => {
        //     const mockUser = new Users();
        //     beforeEach(() => {
        //         mockRepository = {
        //             find: jasmine.createSpy().and.returnValue([dbUser]),
        //             createQueryBuilder: () => {
        //                 throw new Error('test error');
        //             },
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
        //             userService.update('1234', {username: 'merp'}).catch((error) => {
        //                 expect(error).toEqual(new Error('test error'));
        //             });
        //     });
        // });

        // describe('updating a password', () => {
        //     const mockUser = new Users();
        //     beforeEach(() => {
        //         mockRepository = {
        //             find: jasmine.createSpy().and.returnValue([dbUser]),
        //             createQueryBuilder: jasmine.createSpy().and.returnValue({
        //                 update: jasmine.createSpy().and.returnValue({
        //                     set: jasmine.createSpy().and.returnValue({
        //                         where: jasmine.createSpy().and.returnValue({
        //                             execute: jasmine.createSpy(),
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
        //             userService.update('1234', {password: hash}).then(() => {
        //                 expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
        //             });
        //     });
        //     it('should call update', () => {
        //         userService = new UserService(mockConnection, hashService),
        //             userService.update('1234', {password: hash}).then(() => {
        //                 expect(mockRepository.createQueryBuilder().update).toHaveBeenCalledWith(Users);
        //             });
        //     });
        //     it('should call set', () => {
        //         userService = new UserService(mockConnection, hashService),
        //             userService.update('1234', {password: hash}).then(() => {
        //                 expect(mockRepository.createQueryBuilder().update().set)
        //                     .toHaveBeenCalledWith({ password: hash });
        //             });
        //     });
        //     it('should call where', () => {
        //         userService = new UserService(mockConnection, hashService),
        //             userService.update('1234', {password: hash}).then(() => {
        //                 expect(mockRepository.createQueryBuilder().update().set().where)
        //                     .toHaveBeenCalledWith('id = :id', { id: '1234' });
        //             });
        //     });
        //     it('should call execute', () => {
        //         userService = new UserService(mockConnection, hashService),
        //             userService.update('1234', {password: hash}).then(() => {
        //                 expect(mockRepository.createQueryBuilder().update().set().where().execute)
        //                     .toHaveBeenCalled();
        //             });
        //     });
        //     it('should call find', () => {
        //         userService = new UserService(mockConnection, hashService),
        //             userService.update('1234', {password: hash}).then(() => {
        //                 expect(mockRepository.find).toHaveBeenCalledWith({id: '1234'});
        //             });
        //     });
        //     it('should return the correct value', () => {
        //         userService = new UserService(mockConnection, hashService),
        //             userService.update('1234', {password: hash}).then((res) => {
        //                 expect(res).toEqual(dbUser);
        //             });
        //     });
        // });

        // describe('updating a password throws an error', () => {
        //     const mockUser = new Users();
        //     beforeEach(() => {
        //         mockRepository = {
        //             find: jasmine.createSpy().and.returnValue([dbUser]),
        //             createQueryBuilder: () => {
        //                 throw new Error('test error');
        //             },
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
        //             userService.update('1234', {password: hash}).catch((error) => {
        //                 expect(error).toEqual(new Error('test error'));
        //             });
        //     });
        // });

        // describe('deleting a user', () => {
        //     const mockUser = new Users();
        //     beforeEach(() => {
        //         mockRepository = {
        //             find: jasmine.createSpy().and.returnValue([dbUser]),
        //             createQueryBuilder: jasmine.createSpy().and.returnValue({
        //                 delete: jasmine.createSpy().and.returnValue({
        //                     from: jasmine.createSpy().and.returnValue({
        //                         where: jasmine.createSpy().and.returnValue({
        //                             execute: jasmine.createSpy(),
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
        //     it('should call find', () => {
        //         userService = new UserService(mockConnection, hashService),
        //             userService.delete('12345').then(() => {
        //                 expect(mockRepository.find).toHaveBeenCalledWith({id: '12345'});
        //             });
        //     });
        //     it('should call create query builder', () => {
        //         userService = new UserService(mockConnection, hashService),
        //             userService.delete('12345').then(() => {
        //                 expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
        //             });
        //     });
        //     it('should call delete', () => {
        //         userService = new UserService(mockConnection, hashService),
        //             userService.delete('12345').then(() => {
        //                 expect(mockRepository.createQueryBuilder().delete).toHaveBeenCalled();
        //             });
        //     });
        //     it('should call from', () => {
        //         userService = new UserService(mockConnection, hashService),
        //             userService.delete('12345').then(() => {
        //                 expect(mockRepository.createQueryBuilder().delete().from)
        //                     .toHaveBeenCalledWith(Users);
        //             });
        //     });
        //     it('should call where', () => {
        //         userService = new UserService(mockConnection, hashService),
        //             userService.delete('12345').then(() => {
        //                 expect(mockRepository.createQueryBuilder().delete().from().where)
        //                     .toHaveBeenCalledWith('id = :id', {id: '12345'});
        //             });
        //     });
        //     it('should call execute', () => {
        //         userService = new UserService(mockConnection, hashService),
        //             userService.delete('12345').then(() => {
        //                 expect(mockRepository.createQueryBuilder().delete().from().where().execute)
        //                     .toHaveBeenCalled();
        //             });
        //     });
        //     it('should return the correct value', () => {
        //         userService = new UserService(mockConnection, hashService),
        //             userService.delete('12345').then((res) => {
        //                 expect(res).toEqual(dbUser);
        //             });
        //     });
        // });

        // describe('deleting a user throws an error', () => {
        //     const mockUser = new Users();
        //     beforeEach(() => {
        //         mockRepository = {
        //             find: jasmine.createSpy().and.returnValue([dbUser]),
        //             createQueryBuilder: () => {
        //                 throw new Error('test error');
        //             },
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
        //             userService.delete('12345').catch((error) => {
        //                 expect(error).toEqual(new Error('test error'));
        //             });
        //     });
        // });

        // describe('validating a password', () => {
        //     describe('and user exists', () => {
        //         describe('and password is valid', () => {
        //             const mockUser = new Users();
        //             beforeEach(() => {
        //                 spyOn(hashService, 'compare').and.returnValue(true);
        //                 mockRepository = {
        //                     find: jasmine.createSpy().and.returnValue([dbUser]),
        //                 };
        //                 mockDb = {
        //                     manager: jasmine.createSpyObj('manager', ['save']),
        //                     getRepository: (...params) => {
        //                         return mockRepository;
        //                     },
        //                 };
        //                 mockConnection = new MockConnection(mockDb);
        //                 mockUser.username = user.username;
        //                 mockUser.password = hash;
        //             });
        //             it('should call find', () => {
        //                 userService = new UserService(mockConnection, hashService),
        //                     userService.validatePassword('18900', '12345').then((res) => {
        //                         expect(res).toEqual(dbUser);
        //                     });
        //             });
        //         });
        //         describe('and password is invalid', () => {
        //             const mockUser = new Users();
        //             beforeEach(() => {
        //                 spyOn(hashService, 'compare').and.returnValue(false);
        //                 mockRepository = {
        //                     find: jasmine.createSpy().and.returnValue([dbUser]),
        //                 };
        //                 mockDb = {
        //                     manager: jasmine.createSpyObj('manager', ['save']),
        //                     getRepository: (...params) => {
        //                         return mockRepository;
        //                     },
        //                 };
        //                 mockConnection = new MockConnection(mockDb);
        //                 mockUser.username = user.username;
        //                 mockUser.password = hash;
        //             });
        //             it('should call find', () => {
        //                 userService = new UserService(mockConnection, hashService),
        //                     userService.validatePassword('18900', '12345').catch((error) => {
        //                         expect(error).toEqual(new Error('Wrong password, try again'));
        //                     });
        //             });
        //         });
        //     });
        //     describe('and user does not exists', () => {
        //         const mockUser = new Users();
        //         beforeEach(() => {
        //             spyOn(hashService, 'compare').and.returnValue(true);
        //             mockRepository = {
        //                 find: jasmine.createSpy().and.returnValue([]),
        //             };
        //             mockDb = {
        //                 manager: jasmine.createSpyObj('manager', ['save']),
        //                 getRepository: (...params) => {
        //                     return mockRepository;
        //                 },
        //             };
        //             mockConnection = new MockConnection(mockDb);
        //             mockUser.username = user.username;
        //             mockUser.password = hash;
        //         });
        //         it('should call find', () => {
        //             userService = new UserService(mockConnection, hashService),
        //                 userService.validatePassword('18900', '12345').catch((error) => {
        //                     expect(error).toEqual(new Error('User not found'));
        //                 });
        //         });
        //     });
        // });
    });
});
