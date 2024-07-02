import jwt from "jsonwebtoken";

function generateRefreshToken(email: string) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { email: email, provider: "local" },
      process.env.JWT_REFRESH_SECRET || "",
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          return reject(err);
        }
        return resolve(token);
      }
    );
  });
}

function verifyJWT(refreshToken: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "",
      (err, decoded) => {
        if (err) {
          return reject(err);
        }
        return resolve(decoded);
      }
    );
  });
}

export { generateRefreshToken, verifyJWT };
