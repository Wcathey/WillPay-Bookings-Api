'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(
        models.Spot,
        {foreignKey: "spotId", onDelete: 'CASCADE'}
      );
      Booking.belongsTo(
        models.User,
        {foreignKey: "userId", onDelete: 'CASCADE'}
      )
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        customStartDateVal() {
          const currentDate = new Date().getTime()
          if(this.startDate.getTime() < currentDate) {
            throw new Error("startDate cannot be in the past")
          }
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        customEndDateVal() {
          const sd = this.startDate.getTime();
          if(this.endDate.getTime() <= sd) {
            throw new Error("endDate cannot be on or before startDate")
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
