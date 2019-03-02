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
        @inject(TYPES.ConnectionService) private connectionService: ConnectionService,
        @inject(TYPES.HashService) private hashService: HashService,
    ) {}

    async create(user: UserModel): Promise<User> {

        return new Promise(async(res, reject) => {
                try {
                    const newUser = new Users();
                    newUser.username = user.username;
                    newUser.password = await this.hashService.genHash(user.password);

                    const createdUser = await this.connectionService.createUser(newUser);
                    res(createdUser[0]);
                } catch (error) {
                    reject(error);
                }
        });
    }

    async findByUsername(username: string): Promise<User> {

        return new Promise(async (res, reject) => {
            try {
                const users = await this.connectionService.findUser({ username });
                if (users.length > 0) {
                    res(users[0]);
                } else {
                    reject(new Error('Username not found'));
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    async update(userId: string, fieldUpdate: {[field: string]: string}): Promise<User> {

        return new Promise(async (res, reject) => {
                try {
                    const users = await this.connectionService.updateUser(userId, fieldUpdate);
                    res(users[0]);
                } catch (error) {
                    reject(error);
                }
        });
    }

    async delete(userId: string): Promise<User> {

        return new Promise((res, reject) => {
                    try {
                        const users = this.connectionService.deleteUser(userId);
                        res(users[0]);
                    } catch (error) {
                        reject(error);
                    }
        });
    }

    async validatePassword(userId: string, password: string) {

        return new Promise(async (res, reject) => {
                    try {
                        const users = await this.connectionService.findUser({id: userId});
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
    }
}
