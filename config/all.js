'use strict';

module.exports = {
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
        valid_for: 365//180 // in days
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
    },
    currency_code: 'USD'    
}
