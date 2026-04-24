import jwt from "jsonwebtoken";

export const createToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      forename: user.forename,
      role: user.role,
      createdAt: user.createdAt,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
};
