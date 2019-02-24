import 'reflect-metadata';
import {createConnection, getManager, getRepository} from 'typeorm';
import {Habits, Users} from '../entity';
import UserModel from '../models/user';
import {injectable} from 'inversify';
import 'reflect-metadata';

@injectable()
export class ConnectionService {
    constructor() {
        createConnection({
            type: 'postgres',
            host: process.env.PGHOST,
            port: Number(process.env.PGPORT),
            username: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            database: process.env.habit_tracker,
            entities: [
                Habits,
                Users,
            ],
            synchronize: true,
            logging: false,
        });
    }

    async findUser(queryObject: {[key: string]: string}) {
        return await getRepository(Users).find(queryObject);
    }

    async createUser(user: UserModel) {
        await getManager().save(user);
        return await getRepository(Users).find({username: user.username});
    }

    async updateUser(id: string, fieldUpdate: {[field: string]: string}): Promise<Users[]> {
        await getRepository(Users)
            .createQueryBuilder()
            .update(Users)
            .set(fieldUpdate)
            .where('id = :id', { id })
            .execute();

        return await getRepository(Users).find({id})
    }

    async deleteUser(id: string): Promise<Users[]>  {
        const deletedUser = await getRepository(Users).find({id});
        await getRepository(Users)
            .createQueryBuilder()
            .delete()
            .from(Users)
            .where('id = :id', { id })
            .execute();

        return deletedUser;
    }
}
