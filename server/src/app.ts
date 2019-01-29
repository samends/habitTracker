import {config} from 'dotenv';
import {UserService} from './api/user.service';

config();

const app = async () => {
   const newUser = {
      name: 'Herold',
      username: 'heroldG',
      password: 'somePassword',
   };

   try {
      const userService = new UserService();

      const returnedUser = await userService.create(newUser);

      console.log('returned user', returnedUser);
   } catch (e) {
      console.log('New error', e.message);
   }
};

app();
