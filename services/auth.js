import jwt from "jsonwebtoken";
import "dotenv/config";

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    console.log("token is null");
    //return res.status(401).json({ message: "token bad?" });
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.SECRET_TOKEN, (err) => {
    if (err) {
      //return res.status(403);
      return res.sendStatus(403);
    }
    next();
  });
};

const generateAccessToken = async (req, user) => {
  return jwt.sign(user, process.env.SECRET_TOKEN, { expiresIn: "15s" });
};

const generateRefreshToken = async (req, user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN);
};

const refreshToAccessToken = async (req, res, next) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) {
    return res.sendStatus(401);
  }
  // check if refresh token in database

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err) => {
    if (err) {
      return res.sendStatus(403);
    }
  });
};

export {
  authenticateToken,
  generateAccessToken,
  generateRefreshToken,
  refreshToAccessToken,
};
