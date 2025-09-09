import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import authenticateToken from "../middleware/auth.ts";
import User from "../models/User.ts";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const router = express.Router();

// Get all users from DB
router.get("/", authenticateToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" + error });
  }
});

// Add a new user to the DB
// router.post("/", async (req, res) => {
//   try {
//     // Extract user data from the request body
//     const { email, password, mailingList } = req.body;
//     // Validate the input
//     if (!email || !password) {
//       return res.status(400).json({ error: "Email and Password are required" });
//     }

//     const query = { email: email.toString() };
//     const existingUser = await User.findOne(query);
//     if (existingUser) {
//       return res.status(401).json({ error: "Email is already in use" });
//     }

//     const encryptedPass = await bcrypt.hash(password, 10);
//     // Create a new user instance
//     const newUser = new User({
//       email,
//       password: encryptedPass,
//       mailingList,
//       role: "user",
//     });
//     // Save the new user to the database
//     await newUser.save();
//     const token = jwt.sign(
//       { userId: newUser._id, email: newUser.email },
//       JWT_SECRET,
//       {
//         expiresIn: "1h",
//       }
//     );
//     res.json({
//       message: "Register successful",
//       token, // Send the token to the client
//       user: {
//         id: newUser._id,
//         email: newUser.email,
//         role: newUser.role,
//       },
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       res
//         .status(500)
//         .json({ error: "Error during registration", details: error.message });
//     }
//   }
// });

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    // Validate the input
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required!" });
    }
    // Find user by username

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    // Compare the provided password with the hashed password in the database

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }
    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Send the token and user data
    res.json({
      message: "Login successful",
      token, // Send the token to the client
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        authorName: user.authorName,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to login" });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "No user was found" });
    }
    res.status(200).json({ email: user.username });
  } catch (error) {
    res.status(500).json({ error: "An error occurred", details: error });
  }
});

export default router;
