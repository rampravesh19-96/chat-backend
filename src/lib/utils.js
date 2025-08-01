import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,                      // Prevent JS access
    secure: true,                        // Required for cross-site cookie over HTTPS
    sameSite: "None",                    // Must be "None" for cross-site cookies
    maxAge: 7 * 24 * 60 * 60 * 1000,     // 7 days
  });

  return token;
};
