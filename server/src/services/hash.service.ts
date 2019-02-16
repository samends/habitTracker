import {genSalt, hash, compareSync} from 'bcrypt';
import {injectable} from 'inversify';

@injectable()
export class HashService {
    async genHash(password): Promise<string> {
        const hashedPassword = await new Promise((resolve, reject) => {
            genSalt(Number(process.env.SALT_ROUNDS), (err, salt) => {
                hash(password, salt, (e, generatedHash) => {
                    if (e) { return reject(e); }
                    resolve(generatedHash);
               });
            });
        });
        return hashedPassword as string;
    }

    compare(a, b): boolean {
        return compareSync(a, b);
    }
}
