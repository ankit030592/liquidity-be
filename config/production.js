module.exports = {
    environment: 'production',
    port: 3000,
    enc_key: 'jdjf9348ufjsdjfkrjf85dks',
    enc_options: {
        algorithm: 'aes256'
    },
    mongo: {
        host: '127.0.0.1',
        port: '27017',
        db: 'session',
        url: 'mongodb://localhost:27017/liquidity'
    },

    appName: 'Page',
    token: {
        valid_for: 1440 // in minutes, expires in 1 day
    },
    password_reset_code: {
        valid_for: 1440 // in minutes, expires in 1 day
    },
    post: {
        valid_for: 365 // in days
    },
    repost: {
        valid_for: 365 //180 // in days
    },
    locations: {
        max_recent_entries: 5
    },
    mysql_date_format: 'YYYY-MM-DD HH:MM:SS',
    sequelize: {
        options: {
            timestamps: false,
            freezeTableName: true
        }
    }
}