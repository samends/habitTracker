import {Container} from 'inversify';
import {Connection} from './connection/connection';
import TYPES from './types';

const container = new Container();

container.bind(TYPES.Connection).to(Connection);

export default container;
