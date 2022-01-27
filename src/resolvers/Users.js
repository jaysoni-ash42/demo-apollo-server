import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserInputError } from "apollo-server";
import { registerValidator, loginValidator } from "../util/userValidator.js";
import { SECERET_KEY } from "../../config.js";

const userResolvers = {
  Mutation: {
    async register(
      _,
      { registerInput: { userName, password, confirmPassword, email } }
    ) {
      const { errors, valid } = registerValidator(
        userName,
        password,
        confirmPassword,
        email
      );
      if (!valid) {
        throw new UserInputError("errors", { errors });
      }
      const searchedUser = await User.findOne({ userName });
      if (searchedUser) {
        throw new UserInputError("User already Exist", {
          errors: {
            userName: "user with this userName already exist",
          },
        });
      }
      password = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        userName,
        password,
        createdAt: new Date().toISOString(),
      });
      const result = await user.save();
      return {
        ...result._doc,
        id: result._id,
      };
    },
    async login(_, { userName, password }) {
      const { errors, valid } = loginValidator(userName, password);
      if (!valid) {
        throw new UserInputError("error", { errors });
      }
      const searchedUser = await User.findOne({ userName });
      if (!searchedUser) {
        throw new UserInputError("wrong credentials", {
          errors: {
            general: "user not found",
          },
        });
      }
      const match = await bcrypt.compare(password, searchedUser.password);
      if (!match) {
        throw new UserInputError("wrong credentials", {
          errors: {
            general: "wrong password",
          },
        });
      }
      const token = jwt.sign(
        {
          id: searchedUser.id,
          userName: userName,
        },
        SECERET_KEY,
        { expiresIn: "1h" }
      );
      return {
        token,
      };
    },
  },
};

export default userResolvers;
