import User from "../models/user.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({ error : "Unauthorized : No token found"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        if(!decoded){
            return res.status(401).json({ error : "Unauthorized : Invalid token"})
        }
        const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
        req.user = user
        next();
    }
    catch(error){
        console.error("Error in protected middleware : ", error.message);
        return res.status(500).json({ error : "Internal Server Error"})
    }
};

export default protectRoute;