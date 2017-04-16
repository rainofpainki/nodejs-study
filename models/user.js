const { sequelize, DataTypes } = require('../controller/db');
module.exports = {
  user:
      sequelize.define('user', {
      user_no:          { type: DataTypes.INTEGER,  primaryKey: true,   autoIncrement: true },
      user_id:          { type: DataTypes.STRING(20), allowNull:false },
      user_pwd:         { type: DataTypes.STRING(100), allowNull:false },
      user_name:        { type: DataTypes.STRING(20), allowNull:false},
      user_gender:      { type: DataTypes.INTEGER, allowNull:true},
      user_birthdate:   { type: DataTypes.DATE, allowNull:true},
      user_email:       { type: DataTypes.STRING(100), allowNull:true},
      user_mobile:      { type: DataTypes.STRING(11), allowNull:true},
      use_status:       { type: DataTypes.STRING(1), allowNull:false, defaultValue:'Y'}
    }, {
      timestamps: false,
      tableName: 'yello_user'
    }),
  sequelize:sequelize
}
