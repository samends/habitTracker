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