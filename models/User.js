const { Schema, model } = require('mongoose');
var validator = require("email-validator");

const userSchema = new Schema(
    {
      username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: validator.validate,
          message: "Invalid email address",
        },
      },
      thoughts: [{ type: Schema.Types.ObjectId, ref: "thought" }],
      friends: [{ type: Schema.Types.ObjectId, ref: "user" }],
    },
    {
      toJSON: {
        virtuals: true,
      },
      id: false,
    }
  );

  userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
  });
  
  const User = model('user', userSchema);
  
  module.exports = User;