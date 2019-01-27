import {Connection} from '../connection/connection';
import {Habits, Users} from '../entity';
import User from '../models/user';

export class UserService {
    async create(u: User) {
        const connection = new Connection();

        connection.run(async (db) => {
           const user = new Users();
           user.name = u.name;
           user.username = u.username;
           user.password = u.password;

           await db.manager.save(user);

           return u;
        });
    }
}
