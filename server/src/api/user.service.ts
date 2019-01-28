import {Connection} from '../connection/connection';
import {Users} from '../entity';
import User from '../models/user';
import {genHash} from '../utils';

export class UserService {
    async create(u: User): Promise<User> {
        const connection = new Connection();

        return new Promise((res, reject) => {
            connection.run(async (db) => {
                const user = new Users();
                user.name = u.name;
                user.username = u.username;
                user.password = await genHash(u.password);

                await db.manager.save(user);

                res(u);
             });
        });
    }
}
