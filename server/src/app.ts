import {config} from 'dotenv';
import {UserService} from './api/user.service';

config();

const app = async () => {
   const newUser = {
      name: 'Herold',
      username: 'heroldG',
      password: 'somePassword',
   };

   const userService = new UserService();

   const returnedUser = await userService.create(newUser);

   console.log('returned user', returnedUser);
};

app();
