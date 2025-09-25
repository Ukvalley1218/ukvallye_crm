import jwt from "jsonwebtoken";
import User from "../models/User.js";


// Verify JWT
export const protect = async (req, res, next) => {
  let token;
console.log(req.headers.authorization); // should print "Bearer <token>"
if (req.headers.authorization?.startsWith("Bearer")) {
  try {
    token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = await User.findById(decoded.id).select("-password");
    console.log(req.user);                  // should show the logged-in user
      
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) return res.status(401).json({ message: "Not authorized, no token" });
};

// Role-based access
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};