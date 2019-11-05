var config = require('config');   
var Sequelize = require('sequelize');
// require('sequelize-hierarchy')(Sequelize);

var sequelize = new Sequelize('mysql://' + config.db.user +':' + config.db.password + '@' + config.db.host + ':' + config.db.port + '/' + config.db.database, {
  define: config.sequelize.options
});

module.exports = sequelize;
