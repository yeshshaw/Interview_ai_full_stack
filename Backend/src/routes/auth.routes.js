const express = require("express");

const {
    registerUserController,
    loginUserController,
    logoutUserController , 
    getMeController
} = require("../controllers/auth.controller");

const middlewareRatelimiter = require("../middleware/ratelimiter.middleware");

const authMiddleware = require("../middleware/auth.middleware");

const authRoutes = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @access  Public
 */
authRoutes.post(
    "/register",
    middlewareRatelimiter.reteLimiter,
    registerUserController
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and generate JWT token
 * @access  Public
 */
authRoutes.post(
    "/login",
    middlewareRatelimiter.reteLimiter,
    loginUserController
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and blacklist JWT token using Redis
 * @access  Private
 */
authRoutes.post(
    "/logout",
    middlewareRatelimiter.reteLimiter,
    authMiddleware.authMiddleware,
    logoutUserController
);

authRoutes.get(
    '/get' , 
    middlewareRatelimiter.reteLimiter,
    authMiddleware.authMiddleware ,
    getMeController

)

module.exports = authRoutes;