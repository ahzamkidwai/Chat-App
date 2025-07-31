import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token received in verifyToken Middleware : ", token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token in verifyToken Middleware : ", decoded);

    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
