require("pretty-error").start();
const asyncHandler = require("express-async-handler");
const User = require("../models").user;
const _ = require("underscore");
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshsToken,
  verifyRefreshToken,
} = require("../middleware/auth");
const log = require("log4js").getLogger("auth");
log.level = "info";

// * @route   POST /api/v1/auth/register
// @desc      Signup new user
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const { email, password, username, role, scope } = req.body;

  // * Hash Password
  const hashedPw = await bcrypt.hash(password, 12);

  // * save user
  const user = new User({
    username,
    email,
    password: hashedPw,
    role,
    scope,
  });
  const result = await user.save();

  // * define payload
  let payload = {
    id: result.id,
    email: result.email,
    role: result.role,
    scope: result.scope,
  };

  // * generate Access token
  const accessToken = await generateAccessToken(payload);

  // * Generate Refresh Token
  const refreshToken = await generateRefreshsToken(payload);

  res.status(200).json({
    success: true,
    data: { username, email, accessToken, refreshToken },
  });
});

// * @route   POST /api/v1/auth/login
// @desc      login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // * Check is email exist ?
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User / Password Doesn't Match or Exist",
    });
  }

  // * Compare Password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "User / Password Doesn't Match or Exist",
    });
  }

  // * Send Back Data Without Sensitive Information
  const data = await User.findOne({
    where: { email },
  });

  // * define payload
  let payload = {
    id: data.id,
    email: data.email,
    role: data.role,
    scope: data.scope,
  };

  // * generate Access token
  const accessToken = await generateAccessToken(payload);

  // * Generate Refresh Token
  const refreshToken = await generateRefreshsToken(payload);

  res.status(200).json({
    success: true,
    data: { id: data.id, username: data.username, accessToken, refreshToken },
  });
});

// * @route   POST /api/v1/auth/refresh
// @desc      refresh jwt token
// @access    Public
exports.refresh = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "Refresh Token Not Found" });
  }

  // * Verify Refresh Token
  const verifyResult = await verifyRefreshToken(refreshToken);

  // * remove iat & exp value
  const payload = _.pick(verifyResult, "id", "email", "role");

  // * Buat Baru Access Token & Refresh Token
  const accessToken = await generateAccessToken(payload);
  const refToken = await generateRefreshsToken(payload);

  // * Send Refresh Token & Dan Access token
  res.status(200).json({ success: true, accessToken, refreshToken: refToken });
});

// * @route GET /api/v1/auth/profiles
// @desc    Get User Detail
// @access  Private [admin,user]
exports.getAccount = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  console.log("req.user", req.user);
  const data = await User.findOne({
    where: { id },
    attributes: { exclude: "password" },
  });
  res.status(200).json({
    success: true,
    data,
  });
});
