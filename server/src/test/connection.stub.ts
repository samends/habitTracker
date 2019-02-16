export class MockConnection {
    constructor(public mockDb) {}

    public run = async (callback) => {
        await callback(this.mockDb);
    }
}
