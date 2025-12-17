import jwt from "jsonwebtoken";
import { IUserDocument } from "../models/user.model";

export const generateToken = (user: IUserDocument) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY!, {
    expiresIn: "1d",
  });
  return token;
};
