import {config} from 'dotenv';
import {UserService} from './api/user.service';

config();

const app = async () => {
   const newUser = {
      name: 'Herold',
      username: 'bobMiggin',
      password: 'somePassword',
   };

   try {
      const userService = new UserService();

      const returnedUser = await userService.updateUsername('c3c82a23-f863-4912-a9d5-62e6e46d5b9d', 'bobMitten');

      console.log('returned user', returnedUser);
   } catch (e) {
      console.log('New error', e.message);
   }
};

app();
