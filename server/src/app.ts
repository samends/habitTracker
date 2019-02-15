import {config} from 'dotenv';
import {UserService} from './api/user.service';
import container from './inversify.config';
import TYPES from './types';
import 'reflect-metadata';

config();

const userService = container.resolve<UserService>(UserService);

const app = async () => {
   const newUser = {
      name: 'Herold',
      username: 'bobMiggin',
      password: 'somePassword',
   };

   try {

      await userService.updatePassword('344ab1e2-168a-457c-acf5-382cb87d9b5f', 'somePassword', 'somePassword2');

      console.log('Done!');
   } catch (e) {
      console.log('New error', e.message);
   }
};

const userId = 'e0b4adee-cb1b-4d96-b946-acc785f2b393';
const password = 'somePassword';

const updateUsername = async () => {
   await userService.updateUsername('344ab1e2-168a-457c-acf5-382cb87d9b5f', 'coolKid');
   console.log('Done!');
};

const findByUsername = async () => {
   const user = await userService.findByUsername('coolKid', 'somePassword2');
   console.log('Done!', user);
};

const deleteUser = async () => {
   const user = await userService.deleteUser(userId, password);
   console.log('Deleted user', user);
};

try {
   deleteUser();
} catch (error) {
   console.log('there was an error', error);
}
