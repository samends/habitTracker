import {Connection} from '../connection/connection';
import {Users} from '../entity';
import User from '../models/user';
import {genHash} from '../utils';
import {compareSync} from 'bcrypt';

export class UserService {
    async create(u: User): Promise<User> {
        const connection = new Connection();

        return new Promise((res, reject) => {
            connection.run(async (db) => {
                const userRepository = db.getRepository(Users);
                const takenUsers: Users[] = await userRepository.find({username: u.username});
                if (takenUsers.length) {
                    return reject(new Error('Username already taken'));
                }
                const user = new Users();
                user.name = u.name;
                user.username = u.username;
                user.password = await genHash(u.password);

                await db.manager.save(user);

                return res(u);
             });
        });
    }

    async findByUsername(username: string, password: string): Promise<User> {
        const connection = new Connection();

        return new Promise((res, reject) => {
            connection.run(async (db) => {
                const userRepository = db.getRepository(Users);
                const user = await userRepository.find({username});
                if (compareSync(password, user[0].password)) {
                    res(user[0]);
                } else {
                    reject(new Error('Wrong password, try again'));
                }
             });
        });
    }
}
