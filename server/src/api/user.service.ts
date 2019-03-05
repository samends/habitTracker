import { ConnectionService } from '../services/connection.service';
import { Users } from '../entity';
import { UserModel } from '../models/user';
import { inject, injectable } from 'inversify';
import TYPES from '../types';
import 'reflect-metadata';
import { HashService } from '../services/hash.service';

@injectable()
export class UserService {
    constructor(
        @inject(TYPES.ConnectionService) private connectionService: ConnectionService,
        @inject(TYPES.HashService) private hashService: HashService,
    ) { }

    async create(user: UserModel): Promise<Users> {

        return new Promise(async (res, reject) => {
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

    async find(query: { [field: string]: string }): Promise<Users> {

        return new Promise(async (res, reject) => {
            try {
                const users = await this.connectionService.findUser(query);
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

    async update(userId: string, query: { [field: string]: string }): Promise<Users> {

        return new Promise(async (res, reject) => {
            try {
                const users = await this.connectionService.updateUser(userId, query);
                res(users[0]);
            } catch (error) {
                reject(error);
            }
        });
    }

    async delete(userId: string): Promise<Users> {

        return new Promise(async (res, reject) => {
            try {
                const users = await this.connectionService.deleteUser(userId);
                res(users[0]);
            } catch (error) {
                reject(error);
            }
        });
    }
}
