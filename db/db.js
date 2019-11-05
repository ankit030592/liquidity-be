var config = require('config');   
var Sequelize = require('sequelize');

var sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL, {
  define: config.sequelize.options
});

module.exports = sequelize;