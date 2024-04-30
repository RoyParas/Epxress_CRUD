const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @desc Register User
// @route POST /api/users/register
// access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All the fields are mandatory.");
  }
  const userAvailabe = await User.findOne({ email });
  if (userAvailabe) {
    res.status(400);
    throw new Error("User Already Registered.");
  }

  //   Hashed Password
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log("User Created ", user);
  if (user) {
    res.status(201);
    res.json({
      id: user.id,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("User Data is not Valid");
  }
});

// @desc Login User
// @route POST /api/users/login
// access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All the fields are mandatory");
  }

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.access_token_secret,
      { expiresIn: "30m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Email or Password Invalid.");
  }
});

// @desc Current User
// @route GET /api/users/current
// access PRIVATE
const currentUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
