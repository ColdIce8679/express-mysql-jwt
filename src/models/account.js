export default (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
  }, {});
  Account.associate = (models) => { // eslint-disable-line no-unused-vars
    // associations can be defined here
  };
  return Account;
};
