const User = require("../models/Users");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Todo = require("../models/Todo");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input fields
        if (!name || !email || !password) {
            return res.status(400).json({
                status: false,
                message: 'Please add all fields'
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                status: false,
                message: 'User already exists'
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        const saveUser = await user.save();
        console.log(saveUser);

        // Send success response
        return res.json({
            status: true,
            message: 'Registered Successfully',
            data: saveUser
        });

    } catch (error) {
        console.error(error);
        // Catch any unforeseen errors and send a response
        return res.status(500).json({
            status: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!email || !password) {
            return res.status(400).json({
                status: false,
                message: 'Please add all fields'
            });
        }
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error("Invalid credentials");
        }

    } catch (error) {
        console.error(error);
        // Catch any unforeseen errors and send a response
        return res.status(500).json({
            status: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = req.user;

        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

const logoutUser = async (req, res) => {
    const token = await req.headers.authorization.split(' ')[1];

    // Add the token to the blacklist
    tokenBlacklist.add(token);

    res.status(200).json({
        status: true,
        message: 'Logout successful',
    });
};


module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser,
};
