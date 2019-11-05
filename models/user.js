/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    f_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    m_name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    l_name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    phone: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    department_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'department',
        key: 'department_id'
      }
    },
    user_role_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'user_role',
        key: 'user_role_id'
      }
    },
    token: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    token_issued_on: {
      type: DataTypes.DATE,
      allowNull: true
    },
    token_expires_on: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_blocked: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    verified: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    email_verification: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      primaryKey: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'user'
  });
};
