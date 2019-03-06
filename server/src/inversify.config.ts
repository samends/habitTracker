import {Container} from 'inversify';
import {ConnectionService} from './services/connection.service';
import {HashService} from './services/hash.service';
import {TypeOrmWrapper} from './services/typeorm.wrapper';
import TYPES from './types';

const container = new Container();

container.bind(TYPES.HashService).to(HashService);
container.bind(TYPES.TypeOrmWrapper).to(TypeOrmWrapper);
container.bind(TYPES.ConnectionService).to(ConnectionService);

export default container;
