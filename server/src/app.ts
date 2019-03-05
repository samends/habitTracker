import { config } from 'dotenv';
import { UserService } from './api/user.service';
import container from './inversify.config';
import TYPES from './types';
import 'reflect-metadata';
import {buildSchema} from 'graphql';
import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';

config();
const userService = container.resolve<UserService>(UserService);
// const user = await userService.create({username: 'anewuser', password: 'hellothere'});

// console.log(user);

// userService.update('cf334dc0-2a51-4c76-bbcf-7a707ccea8f6', {username: 'derp4729'}).then((user) => {
//    console.log('success!', user);
// }).catch((error) => {
//    console.log('there was an error', error);
// });

const schema = buildSchema(`
   input UserInput {
      username: String,
      password: String
   }

   type User {
      id: ID!,
      username: String,
      password: String
   }

   type Query {
      hello: String,
      testFind(field: String, value: String): User,
      testUpdate(userId: String, field: String, value: String): User,
      testDelete(userId: String): User
   }

   type Mutation {
      create(input: UserInput): User
   }
`);

const root = {
   hello: () => 'Hello world!',
   create: async ({input}) => {
      try {
         return await userService.create(input);
      } catch (error) {
         console.log('There was an error', error);
      }
   },
   testFind: async ({field, value}) => {
      try {
         return await userService.find({[field]: value});
      } catch (error) {
         console.log('There was an error', error);
      }
   },
   testUpdate: async ({userId, field, value}) => {
      try {
         return await userService.update(userId, {[field]: value});
      } catch (error) {
         console.log('There was an error', error);
      }
   },
   testDelete: async ({userId}) => {
      try {
         return await userService.delete(userId);
      } catch (error) {
         console.log('There was an error', error);
      }
   }
};

const app = express();
app.use('/data', graphqlHTTP({
   schema,
   rootValue: root,
   graphiql: true,
}));

app.listen(4000);
console.log('GraphQL api server running at localhost:4000');
