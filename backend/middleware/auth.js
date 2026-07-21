import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const getUser = async (req, res, next) => {
   console.log("middleware has been called");

    try {
        const accessToken = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
        console.log(accessToken);

        if(!accessToken) {
            return res.status(401).json({ message: "Unauthorized request" });
        }
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: "Invalid access token" });
        }

        req.user = user;
        next();
    }catch (error) {
        console.error("Error in getUser middleware:", error);
        return res.status(401).json({ message: "Invalid access token" });
    }
}

export default getUser;