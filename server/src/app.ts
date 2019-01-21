import {config} from 'dotenv';
import {Client} from 'pg';

config();
const client = new Client();

const main = async () => {
    await client.connect();

    client.query('SELECT NOW()', (err, res) => {
        console.log(err, res);
        client.end();
    });
};

main();
