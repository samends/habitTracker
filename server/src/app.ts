import { config } from 'dotenv';
import { UserService } from './api/user.service';
import container from './inversify.config';
import TYPES from './types';
import 'reflect-metadata';

config();

const userService = container.resolve<UserService>(UserService);

userService.update('cf334dc0-2a51-4c76-bbcf-7a707ccea8f6', {username: 'derp4729'}).then((user) => {
   console.log('success!', user);
}).catch((error) => {
   console.log('there was an error', error);
});
