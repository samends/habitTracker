import {genSalt, hash} from 'bcrypt';

export const genHash = async (password): Promise<string> => {
    const hashedPassword = await new Promise((resolve, reject) => {
        genSalt(Number(process.env.SALT_ROUNDS), (err, salt) => {
            hash(password, salt, (e, generatedHash) => {
                if (e) { return reject(e); }
                resolve(generatedHash);
           });
        });
    });

    return hashedPassword as string;
};
