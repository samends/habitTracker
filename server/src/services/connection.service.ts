import 'reflect-metadata';
import {createConnection} from 'typeorm';
import {Habits, Users} from '../entity';
import {injectable} from 'inversify';
import 'reflect-metadata';

@injectable()
export class ConnectionService {
    run(callback: (connection) => void) {
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
        }).then(async (connection) => {
            callback(connection);
        }).catch((error) => console.log(error));
    }
}
