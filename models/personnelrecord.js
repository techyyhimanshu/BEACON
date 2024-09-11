'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PersonnelRecords extends Model {
    static associate(models) {
      // define association here
    }
  }

  PersonnelRecords.init({
    personnel_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name is required"
        },
        customValidator(value) {
          if (!value) {
            throw new Error("Name is required")
          }

          if (value.length < 2 || value.length > 20) {
            throw new Error("Name must be between 2 and 20 characters")
          }
        },
      }
    },
    father_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Father's name is required"
        },
        customValidator(value) {
          if (!value) {
            throw new Error("Father's name is required")
          }

          if (value.length < 2 || value.length > 20) {
            throw new Error("Father's name must be between 2 and 20 characters")
          }
        },
      }
    },
    dob: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Date of Birth is required"
        },
        isValidDate(value) {
          if (!value) {
            throw new Error("Date of Birth is required");
          }

          // Convert value to string if it's a Date object
          const dateString = value.toString()

          // Validate the actual date
          const [year, month, day] = dateString.split('-').map(Number);
          const date = new Date(year, month - 1, day);

          // Check if the date is valid
          if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
            throw new Error("Invalid Date of Birth");
          }

          // Optionally, check if the date is in the future
          const today = new Date();
          if (date > today) {
            throw new Error("Date of Birth cannot be in the future");
          }
        }
      }
    },


    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Email is required"
        },
        customValidator(value) {
          if (!value) {
            throw new Error("Email is required");
          }

          // Regular expression to validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            throw new Error("Invalid email format");
          }
        }
      }
    },

    phone_one: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Primary phone number is required"
        },
        customValidator(value) {
          if (!value) {
            throw new Error("Primary phone number is required")
          }
          if (isNaN(value)) {
            throw new Error("Primary phone number should not be numeric")
          }
          if (value.length != 10) {
            throw new Error("Primary phone number should be 10 digits")
          }
        }
      }
    },
    phone_two: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isNumeric: {
          msg: "Phone number must contain only numbers"
        },
        len: {
          args: [10, 10],
          msg: "Secondary phone must be exactly 10 digits"
        }
      }
    },
    present_address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Present address is required"
        },
        customValidator(value) {
          if (!value) {
            throw new Error("Present address is required")
          }
        }
      }
    },
    permanent_address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Permanent address is required"
        },
        customValidator(value) {
          if (!value) {
            throw new Error("Permanent address is required")
          }
        }
      }
    },
    aadhar_no: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Aadhar number is required"
        },
        customValidator(value){
          if(!value){
            throw new Error("Aadhar number is required")
          }
          if(isNaN(value)){
            throw new Error("Aadhar number must be a number")
          }
          if(value.length!=12){
            throw new Error("Aadhar number must be 12 digits")
          }
        }
      }
    },
    course: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notNull:{
          msg:"Course is required"
        },
        customValidator(value){
          if(!value){
            throw new Error("Course is required")
          }
        }
      }
    },
    date_of_joining: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Date of joining is required"
        },
        isDate: {
          msg: "Must be a valid date"
        }
      }
    },
    device_id:{
      type:DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    image_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    aadhar_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pan_card_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'PersonnelRecords',
    paranoid: true
  });

  return PersonnelRecords;
};