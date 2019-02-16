export class MockDb {
    constructor(public mockRepository) {}
    getRepository = (...params) => {
        return this.mockRepository;
    }
}
