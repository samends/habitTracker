import { config } from 'dotenv';
import { UserService } from './api/user.service';
import container from './inversify.config';
import TYPES from './types';
import 'reflect-metadata';

config();

const userService = container.resolve<UserService>(UserService);

try {
   const newUser = {
      username: 'merp',
      password: 'hellomoto',
   };
   userService.create(newUser).then((user) => {
      console.log('success!', user);
   }).catch((error) => {
      console.log('there was an error', error);
   });
} catch (error) {
   console.log('there was an error', error);
}
