'use strict';

module.exports = {
    token: {
        valid_for: 1440 // in minutes, expires in 1 day
    },
    mysql_date_format: 'YYYY-MM-DD HH:MM:SS',
    sequelize: {
        options: {
            timestamps: false,
            freezeTableName: true
        }
    },
}
