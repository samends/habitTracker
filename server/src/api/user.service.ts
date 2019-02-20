import {ConnectionService} from '../services/connection.service';
import {Users} from '../entity';
import User from '../models/user';
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
                    } else {
                        const newUser = new Users();
                        newUser.username = user.username;
                        newUser.password = await this.hashService.genHash(user.password);

                        await db.manager.save(newUser);

                        res(newUser);
                    }
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
                    res(users[0]);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async update(userId: string, update: {[field: string]: string}): Promise<User> {

        return new Promise((res, reject) => {
            this.connection.run(async (db) => {
                try {
                    await db.getRepository(Users)
                    .createQueryBuilder()
                    .update(Users)
                    .set(update)
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

    async delete(userId: string): Promise<User> {

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
                            if (this.hashService.compare(password, users[0].password)) {
                                res(users[0]);
                            } else {
                                reject(new Error('Wrong password, try again'));
                            }
                        } else {
                            reject(new Error('User not found'));
                        }
                    } catch (error) {
                        reject(error);
                    }
                });
        });
    }
}
