const path = require('path');

const BASE_PATH = path.join(__dirname, 'src', 'server', 'db');

module.exports = {
    test: {
        client: 'pg',
        connection: 'postgres://postgres:postgres@localhost:5432/gallery_test',
        migrations: {
            directory: path.join(BASE_PATH, 'migrations')
        },
        seeds: {
            directory: path.join(BASE_PATH, 'seeds/test')
        }
    },
    development: {
        client: 'pg',
        connection: 'postgres://postgres:postgres@localhost:5432/gallery',
        migrations: {
            directory: path.join(BASE_PATH, 'migrations')
        },
        seeds: {
            directory: path.join(BASE_PATH, 'seeds/dev')
        }
    },
    prod: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: path.join(BASE_PATH, 'migrations')
        },
        seeds: {
            directory: path.join(BASE_PATH, 'seeds/dev')
        }
    }
};