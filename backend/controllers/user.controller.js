import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if(!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  }catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
        return res.status(400).json({ message: "Please provide all required fields" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        const options = {
            httpOnly: true,
            expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
            sameSite: "lax",
            secure: false,
        };

        res.status(200).cookie("token", token, options).json({ message: "Login successful"});
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { registerUser, loginUser };