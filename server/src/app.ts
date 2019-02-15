import {config} from 'dotenv';
import {UserService} from './api/user.service';
import container from './inversify.config';
import TYPES from './types';
import 'reflect-metadata';

config();

const userService = container.resolve<UserService>(UserService);

try {
  userService.vailidatePassword('db301e03-2c9e-46e7-aaf8', 'blarg').then((user) => {
     console.log('success!', user);
  }).catch((error) => {
     console.log('there was an error');
  });
} catch (error) {
   console.log('there was an error', error);
}
