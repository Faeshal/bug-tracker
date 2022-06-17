"use strict";
const { Model } = require("sequelize");
const withPagination = require("sequelize-cursor-pagination");
module.exports = (sequelize, DataTypes) => {
  class card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      card.belongsTo(models.project);
      card.belongsTo(models.user);
    }
  }
  card.init(
    {
      name: DataTypes.STRING,
      content: DataTypes.STRING,
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "card",
    }
  );
  const options = {
    methodName: "paginate",
    primaryKeyField: "id",
  };

  withPagination(options)(card);
  return card;
};
