import {
    createConnection,
    getManager,
    getRepository,
    ConnectionOptions,
    EntityManager,
    Connection
} from 'typeorm';

import {injectable} from 'inversify';

@injectable()
export class TypeOrmWrapper {
    public async createConnection(options: ConnectionOptions): Promise<Connection> {
        return await createConnection(options);
    }

    public getManager(): EntityManager {
        return getManager();
    }

    public getRepository(entityClass: any): any {
        return getRepository(entityClass);
    }
}
