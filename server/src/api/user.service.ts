import {Connection} from '../connection/connection';
import {Users} from '../entity';
import User from '../models/user';
import {genHash} from '../utils';
import {compareSync} from 'bcrypt';
import UserModel from '../models/user';
import {inject, injectable} from 'inversify';
import TYPES from '../types';
import 'reflect-metadata';

@injectable()
export class UserService {
    @inject(TYPES.Connection) private connection: Connection;

    async create(u: UserModel): Promise<User> {

        return new Promise((res, reject) => {
            this.connection.run(async (db) => {
                const userRepository = db.getRepository(Users);
                const takenUsers: Users[] = await userRepository.find({username: u.username});
                if (takenUsers.length !== 0) {
                    return reject(new Error('Username already taken'));
                }
                const user = new Users();
                user.username = u.username;
                user.password = await genHash(u.password);

                await db.manager.save(user);

                return res(u);
             });
        });
    }

    async findByUsername(username: string, password: string): Promise<User> {

        return new Promise((res, reject) => {
            this.connection.run(async (db) => {
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

    async updateUsername(userId: string, username: string): Promise<User> {

        return new Promise((res, reject) => {
            this.connection.run(async (db) => {
                const user = await db.getRepository(Users)
                    .createQueryBuilder()
                    .update(Users)
                    .set({username})
                    .where('id = :id', {id: userId})
                    .execute();
                res();
             });
        });
    }

    async updatePassword(userId: string, password: string, newPassword: string): Promise<User> {

        return new Promise((res, reject) => {
            this.connection.run(async (db) => {
                try {
                    this.vailidatePassword(db, userId, password, async (user) => {
                        const hashedPass = await genHash(newPassword);
                        await db.getRepository(Users)
                        .createQueryBuilder()
                        .update(Users)
                        .set({password: hashedPass})
                        .where('id = :id', {id: userId})
                        .execute();

                        res(user);
                    });
                } catch (error) {
                    reject(error);
                }
             });
        });
    }

    async deleteUser(userId: string, password: string): Promise<User> {

        return new Promise((res, reject) => {
            this.connection.run(async (db) => {
                try {
                    this.vailidatePassword(db, userId, password, async (user) => {
                        await db.getRepository(Users)
                            .createQueryBuilder()
                            .delete()
                            .from(Users)
                            .where('id = :id', {id: userId})
                            .execute();
                        res(user);
                    });
                } catch (error) {
                    reject(error);
                }
             });
        });
    }

    private vailidatePassword = async (db, userId: string, password: string, callback: (user: User) => void) => {
        const users = await db.getRepository(Users).find({id: userId});
        if (users.length > 0) {
            if (compareSync(password, users[0].password)) {
                callback(users[0]);
            } else {
                throw new Error('Wrong password, try again');
            }
        } else {
            throw new Error('User not found');
        }
    }
}
