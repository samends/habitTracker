import {ConnectionService} from '../services/connection.service';
import {Users} from '../entity';
import User from '../models/user';
import {compareSync} from 'bcrypt';
import UserModel from '../models/user';
import {inject, injectable} from 'inversify';
import TYPES from '../types';
import 'reflect-metadata';
import {HashService} from '../services/hash.service';

@injectable()
export class UserService {
    constructor(
        @inject(TYPES.ConnectionService) private connection: ConnectionService,
        @inject(TYPES.HashService) private hashService: HashService,
    ) {}

    async create(user: UserModel): Promise<User> {

        return new Promise((res, reject) => {
            this.connection.run(async (db) => {
                try {
                    const userRepository = db.getRepository(Users);
                    const takenUsers: Users[] = await userRepository.find({ username: user.username });
                    if (takenUsers.length !== 0) {
                        reject(new Error('Username already taken'));
                    }
                    const newUser = new Users();
                    newUser.username = user.username;
                    newUser.password = await this.hashService.genHash(user.password);

                    await db.manager.save(newUser);

                    res(newUser);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    async findByUsername(username: string): Promise<User> {

        return new Promise((res, reject) => {
            try {
                this.connection.run(async (db) => {
                    const userRepository = db.getRepository(Users);
                    const users = await userRepository.find({ username });
                    users.length > 0 ? res(users[0]) : reject('User not found');
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async updateUsername(userId: string, username: string): Promise<User> {

        return new Promise((res, reject) => {
            this.connection.run(async (db) => {
                try {
                    await db.getRepository(Users)
                    .createQueryBuilder()
                    .update(Users)
                    .set({ username })
                    .where('id = :id', { id: userId })
                    .execute();

                    const users = await db.getRepository(Users).find({ id: userId });
                    res(users[0]);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    async updatePassword(userId: string, newPassword: string): Promise<User> {

        return new Promise((res, reject) => {
            this.connection.run(async (db) => {
                try {
                    const hashedPass = await this.hashService.genHash(newPassword);
                    await db.getRepository(Users)
                        .createQueryBuilder()
                        .update(Users)
                        .set({ password: hashedPass })
                        .where('id = :id', { id: userId })
                        .execute();

                    const users = await db.getRepository(Users).find({ id: userId });
                    res(users[0]);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    async deleteUser(userId: string): Promise<User> {

        return new Promise((res, reject) => {
                this.connection.run(async (db) => {
                    try {
                        const users = await db.getRepository(Users).find({ id: userId });

                        await db.getRepository(Users)
                            .createQueryBuilder()
                            .delete()
                            .from(Users)
                            .where('id = :id', { id: userId })
                            .execute();

                        res(users[0]);
                    } catch (error) {
                        reject(error);
                    }
                });
        });
    }

    async validatePassword(userId: string, password: string) {

        return new Promise((res, reject) => {
                this.connection.run(async (db) => {
                    try {
                        const users = await db.getRepository(Users).find({ id: userId });
                        if (users.length > 0) {
                            if (compareSync(password, users[0].password)) {
                                res(users[0]);
                            } else {
                                reject('Wrong password, try again');
                            }
                        } else {
                            reject('User not found');
                        }
                    } catch (error) {
                        reject(error);
                    }
                });
        });
    }
}
