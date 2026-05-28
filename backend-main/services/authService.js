const bcrypt =
  require("bcryptjs");

const User =
  require("../models/userModel");

const generateToken =
  require("../utils/generateToken");

const signupUser =
  async (
    username,
    email,
    password
  ) => {

    const existingUser =
      await User.findOne({
        email
      });

    if (existingUser) {

      throw new Error(
        "User already exists"
      );

    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await User.create({

        username,

        email,

        password:
          hashedPassword

      });

    return {

      token:
        generateToken(
          user._id
        ),

      userId:
        user._id

    };

  };

module.exports = {
  signupUser
};