'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(
        models.User, {foreignKey: 'ownerId', onDelete: 'CASCADE'}
      );
      Spot.hasMany(
        models.Review,
        {foreignKey: "spotId", onDelete: 'CASCADE'}
      );
      Spot.hasMany(
        models.Booking,
        {foreignKey: "spotId", onDelete: 'CASCADE'}
      );
      Spot.hasMany(
        models.SpotImage,
        {foreignKey: "spotId", onDelete: 'CASCADE'}
      );

    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.FLOAT,
      validate: {
       customLat(value) {
        if(value < -90 || value > 90) {
          throw Error("Latitude must be within -90 ad 90")
        }
       }
      }
    },
    lng: {
      type: DataTypes.FLOAT,
      validate: {
      customLng(value) {
        if(value < -180 || value > 180) {
          throw Error ("Longitude must be within -180 and 180")
      }
    }
    },
  },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        lengthCheck() {
          if(!this.description.length >= 30) {
            throw Error
          }
        }
      }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
