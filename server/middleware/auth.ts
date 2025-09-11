import { type Request, type Response, type NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

interface CustomJwtPayload extends JwtPayload {
  userID: string;
  username: string;
  authorName: string;
}

interface AuthenticatedRequest extends Request {
  userData?: {
    userID: string;
    username: string;
    authorName: string;
  };
}

const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
    req.userData = {
      userID: decoded.userID,
      username: decoded.username,
      authorName: decoded.authorName,
    };
    next();
  } catch {
    res.status(401).json({ error: "Authentication failed" });
  }
};

export default authenticateToken;
