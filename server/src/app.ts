import {config} from 'dotenv';

config();

import 'reflect-metadata';
import {createConnection} from 'typeorm';
import {Habits, Users} from './entity';

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
   console.log('You have made a connection');
   const usersRepository = connection.getRepository(Users);
   const users = await usersRepository.find();

   console.log('All users in db', users);

}).catch((error) => console.log(error));
