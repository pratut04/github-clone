const bcrypt =
  require("bcryptjs");

const User =
  require("../models/userModel");

const generateToken =
  require("../utils/generateToken");

const signup =
  async (req, res) => {

    try {

      const {
        username,
        email,
        password
      } = req.body;

      const existingUser =
        await User.findOne({
          email
        });

      if (existingUser) {

        return res
          .status(400)
          .json({
            message:
              "User exists"
          });

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

      res.status(201)
      .json({

        token:
          generateToken(
            user._id
          ),

        userId:
          user._id

      });

    } catch (error) {

      res.status(500)
      .json({
        message:
          error.message
      });

    }

  };

const login =
  async (req, res) => {

    try {

      const {
        email,
        password
      } = req.body;

      const user =
        await User.findOne({
          email
        });

      if (!user) {

        return res
          .status(400)
          .json({
            message:
              "Invalid credentials"
          });

      }

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {

        return res
          .status(400)
          .json({
            message:
              "Invalid credentials"
          });

      }

      res.json({

        token:
          generateToken(
            user._id
          ),

        userId:
          user._id

      });

    } catch (error) {

      res.status(500)
      .json({
        message:
          error.message
      });

    }

  };

module.exports = {
  signup,
  login
};