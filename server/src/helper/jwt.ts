import jwt from "jsonwebtoken";

function generateRefreshToken(user: any) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        email: user.email,
      },
      process.env.JWT_REFRESH_SECRET || "",
      {
        expiresIn: "7d",
      },
      (err, token) => {
        if (err) {
          return reject(err);
        }
        return resolve(token);
      }
    );
  });
}

function verifyJWT(token: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET || "", (err, decoded) => {
      if (err) {
        return reject(err);
      }
      return resolve(decoded);
    });
  });
}

export { generateRefreshToken, verifyJWT };
