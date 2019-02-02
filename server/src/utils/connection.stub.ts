import {MockDb} from './db.stub';

export class MockConnection {
    constructor(public mockRepository: any) {}

    public run = async (callback) => {
        const mockDb = new MockDb(this.mockRepository);
        await callback(mockDb);
    }
}
