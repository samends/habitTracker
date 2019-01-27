import {config} from 'dotenv';

config();

import {Connection} from './connection/connection';
import {Habits, Users} from './entity';

const connection = new Connection();

connection.run(async (db) => {
   console.log('You have made a connection');
   const usersRepository = db.getRepository(Users);
   const users = await usersRepository.find();

   console.log('All users in db hello', users);
});
