import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();


router.post("/signup", async (req, res) => {
  console.log("Signup request received:", req.body); 

  try {
  const { name, email, password, linkedin, bio, career, skills, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email); 
      return res.status(400).json({ message: "User already exists" });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

    
  const newUser = new User({ name, email, password: hashedPassword, linkedin, bio, career, skills, avatar });
    await newUser.save();

    console.log("User created:", newUser); 

    
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    
    const userToSend = { _id: newUser._id, name: newUser.name, email: newUser.email };
    res.status(201).json({ user: userToSend, token });
  } catch (err) {
    console.error("Signup error:", err); 
    res.status(500).json({ message: err.message });
  }
});


router.post("/login", async (req, res) => {
  console.log("Login request received:", req.body); 

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

   
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email); 
      return res.status(400).json({ message: "User not found" });
    }

   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid credentials for:", email); 
      return res.status(400).json({ message: "Invalid credentials" });
    }

    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const userToSend = { _id: user._id, name: user.name, email: user.email };
    res.status(200).json({ user: userToSend, token });
  } catch (err) {
    console.error("Login error:", err); 
    res.status(500).json({ message: err.message });
  }
});


router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error(" Get users error:", err);
    res.status(500).json({ message: err.message });
  }
});


router.put("/users/:id", async (req, res) => {
  try {
  const { name, email, password, linkedin, bio, career, skills, avatar } = req.body;
  const updateData = { name, email, linkedin, bio, career, skills, avatar };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).select("-password"); 

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(" Update user error:", err);
    res.status(500).json({ message: err.message });
  }
});


router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(" Delete user error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
