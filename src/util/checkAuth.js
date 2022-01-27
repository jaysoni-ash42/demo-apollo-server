import jwt from "jsonwebtoken";
import { SECERET_KEY } from "../../config.js";
import { AuthenticationError } from "apollo-server";

export const authCheckAuth = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, SECERET_KEY);
        return user;
      } catch (e) {
        console.log(e);
        throw new AuthenticationError("Invalid/Expired Token");
      }
    }
    throw new AuthenticationError("Authnetication token must be Valid");
  }
  throw new AuthenticationError("Authnetication Header token must be Provided");
};
