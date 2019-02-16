import {Container} from 'inversify';
import {ConnectionService} from './services/connection.service';
import {HashService} from './services/hash.service';
import TYPES from './types';

const container = new Container();

container.bind(TYPES.ConnectionService).to(ConnectionService);
container.bind(TYPES.HashService).to(HashService);

export default container;
