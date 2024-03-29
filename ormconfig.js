var dbConfig = {
    synchronize: false,
    migrations: ['migration/*.js'],
    cli: {
        migrationsDir: "migration"
    },
};

switch(process.env.NODE_ENV){
    case 'development':
        Object.assign(dbConfig, {
            type: 'sqlite',
            database: 'db.sqlite',
            entities: ['**/*.entity.js']
        })
        break;
    case 'test':
        Object.assign(dbConfig, {
            type: 'sqlite',
            database: 'test.sqlite',
            entities: ['**/*.entity.ts']
        })
        break;
    case 'production':
        break;
    default:
        throw new Error('Unknow environment')
}

module.exports = dbConfig;