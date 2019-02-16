import {Container} from 'inversify';
import {Connection} from './connection/connection';
import {HashService} from './services/hash.service';
import TYPES from './types';

const container = new Container();

container.bind(TYPES.Connection).to(Connection);
container.bind(TYPES.HashService).to(HashService);

export default container;
